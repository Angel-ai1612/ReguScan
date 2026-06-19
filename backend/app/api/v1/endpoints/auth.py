"""Clerk webhook handler + auth + billing endpoints."""
import hashlib
import hmac
import json
import base64

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user, require_owner, resolve_user_org
from app.core.config import settings
from app.db.session import get_db
from app.models.models import Organization, User
from app.schemas.schemas import CheckoutCreate, CheckoutOut, OrgOut, UserOut, UsageOut

auth_router = APIRouter(prefix="/auth", tags=["auth"])
billing_router = APIRouter(prefix="/billing", tags=["billing"])
orgs_router = APIRouter(prefix="/orgs", tags=["orgs"])

stripe.api_key = settings.STRIPE_SECRET_KEY


# ─── Auth ─────────────────────────────────────────────────────────────────────

@auth_router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@auth_router.post("/webhook")
async def clerk_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Clerk webhook events (user created/updated/deleted)."""
    body = await request.body()
    svix_id = request.headers.get("svix-id", "")
    svix_ts = request.headers.get("svix-timestamp", "")
    svix_sig = request.headers.get("svix-signature", "")

    # Verify Svix signature
    signed = f"{svix_id}.{svix_ts}.{body.decode()}"
    raw_secret = settings.CLERK_WEBHOOK_SECRET.lstrip("whsec_")
    key = base64.b64decode(raw_secret + "==")  # pad just in case
    expected = "v1," + base64.b64encode(
        hmac.new(key, signed.encode(), hashlib.sha256).digest()
    ).decode()
    if not any(sig.strip() == expected for sig in svix_sig.split(" ")):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event = json.loads(body)
    event_type = event.get("type")
    data = event.get("data", {})

    if event_type in ("user.created", "user.updated"):
        await _upsert_user(data, db)
    elif event_type == "user.deleted":
        result = await db.execute(select(User).where(User.clerk_id == data["id"]))
        user = result.scalar_one_or_none()
        if user:
            await db.delete(user)

    return Response(status_code=200)


# ─── Orgs ─────────────────────────────────────────────────────────────────────

@orgs_router.get("/me", response_model=OrgOut)
async def get_my_org(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _, org = await resolve_user_org(current_user, db)
    return org


# ─── Billing ──────────────────────────────────────────────────────────────────

PLAN_PRICE_ATTR = {
    "starter_monthly": "STRIPE_PRICE_STARTER",
    "pro_monthly": "STRIPE_PRICE_PRO",
    "enterprise_monthly": "STRIPE_PRICE_ENTERPRISE",
}


@billing_router.post("/checkout", response_model=CheckoutOut)
async def create_checkout(
    payload: CheckoutCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _, org = await resolve_user_org(current_user, db)
    price_attr = PLAN_PRICE_ATTR.get(f"{payload.plan}_{payload.billing_period}")
    price_id = getattr(settings, price_attr, None) if price_attr else None
    if not price_id:
        raise HTTPException(status_code=400, detail="Invalid plan or billing period")

    session = stripe.checkout.Session.create(
        customer_email=current_user.email,
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url="https://app.reguscan.com/dashboard/settings?success=1",
        cancel_url="https://app.reguscan.com/dashboard/settings?canceled=1",
        metadata={"org_id": org.id},
    )
    return CheckoutOut(url=session.url)


@billing_router.post("/portal", response_model=CheckoutOut)
async def billing_portal(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _, org = await resolve_user_org(current_user, db)
    if not org.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No billing account found")
    session = stripe.billing_portal.Session.create(
        customer=org.stripe_customer_id,
        return_url="https://app.reguscan.com/dashboard/settings",
    )
    return CheckoutOut(url=session.url)


@billing_router.get("/usage", response_model=UsageOut)
async def get_usage(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import func
    from app.models.models import Scan, Website

    _, org = await resolve_user_org(current_user, db)
    limits = settings.SCAN_LIMITS.get(org.plan, settings.SCAN_LIMITS["free"])

    websites_count = await db.scalar(
        select(func.count()).where(Website.org_id == org.id, Website.is_active == True)
    )
    scans_count = await db.scalar(
        select(func.count()).where(
            Scan.website_id.in_(select(Website.id).where(Website.org_id == org.id))
        )
    )

    return UsageOut(
        plan=org.plan,
        scans_used=scans_count or 0,
        scans_limit=limits["scans_per_month"],
        websites_used=websites_count or 0,
        websites_limit=limits["websites"],
        period_start=org.subscription_current_period_start,
        period_end=org.subscription_current_period_end,
    )


@billing_router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    body = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(body, sig, settings.STRIPE_WEBHOOK_SECRET)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    if event["type"] == "checkout.session.completed":
        s = event["data"]["object"]
        org_id = s.get("metadata", {}).get("org_id")
        result = await db.execute(select(Organization).where(Organization.id == org_id))
        org = result.scalar_one_or_none()
        if org:
            org.stripe_customer_id = s.get("customer")
            org.stripe_subscription_id = s.get("subscription")
            org.subscription_status = "active"

    elif event["type"] in ("customer.subscription.updated", "customer.subscription.deleted"):
        sub = event["data"]["object"]
        result = await db.execute(
            select(Organization).where(Organization.stripe_subscription_id == sub["id"])
        )
        org = result.scalar_one_or_none()
        if org:
            org.subscription_status = sub["status"]
            if sub["status"] == "canceled":
                org.plan = "free"

    return Response(status_code=200)


# ─── Internal helpers ─────────────────────────────────────────────────────────

async def _upsert_user(data: dict, db: AsyncSession):
    import re
    clerk_id = data["id"]
    email_objs = data.get("email_addresses") or []
    email = email_objs[0].get("email_address", "") if email_objs else ""

    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if not user:
        slug_base = re.sub(r"[^a-z0-9]", "-", email.split("@")[0].lower())[:50]
        # Ensure slug uniqueness
        existing_slug = await db.scalar(
            select(Organization).where(Organization.slug == slug_base)
        )
        slug = slug_base if not existing_slug else f"{slug_base}-{clerk_id[:6]}"

        org = Organization(name=f"{data.get('first_name', 'My')} Org", slug=slug, plan="free")
        db.add(org)
        await db.flush()

        user = User(
            clerk_id=clerk_id,
            email=email,
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            avatar_url=data.get("image_url"),
            org_id=org.id,
            role="owner",
        )
        db.add(user)
    else:
        user.email = email
        user.first_name = data.get("first_name")
        user.last_name = data.get("last_name")
        user.avatar_url = data.get("image_url")

    await db.flush()
