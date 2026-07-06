"""Clerk webhook handler + auth + billing endpoints."""

import hashlib
import hmac
import secrets

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from svix.webhooks import Webhook, WebhookVerificationError

from app.core.auth import get_current_user, resolve_user_org
from app.core.config import settings
from app.db.session import get_db
from app.models.models import Organization, User
from app.schemas.schemas import (
    OrgOut,
    RazorpayOrderCreate,
    RazorpayOrderOut,
    RazorpayPaymentVerify,
    RazorpayPaymentVerifyOut,
    UsageOut,
    UserOut,
)
from app.services.clerk_users import upsert_clerk_user

auth_router = APIRouter(prefix="/auth", tags=["auth"])
billing_router = APIRouter(prefix="/billing", tags=["billing"])
orgs_router = APIRouter(prefix="/orgs", tags=["orgs"])


RAZORPAY_PLAN_CONFIG = {
    "starter": {
        "plan_id_attr": "RAZORPAY_PLAN_STARTER",
        "amount": 4900,
        "websites": 3,
        "scans_per_month": 10,
    },
    "pro": {
        "plan_id_attr": "RAZORPAY_PLAN_PRO",
        "amount": 19900,
        "websites": 10,
        "scans_per_month": 100,
    },
}


def _require_webhook_secret(secret: str, name: str) -> str:
    if not secret:
        raise HTTPException(status_code=500, detail=f"{name} is not configured")
    return secret


@auth_router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@auth_router.post("/webhook")
async def clerk_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Clerk webhook events (user created/updated/deleted)."""
    body = await request.body()

    try:
        webhook = Webhook(
            _require_webhook_secret(settings.CLERK_WEBHOOK_SECRET, "Clerk webhook secret")
        )
        event = webhook.verify(body, dict(request.headers))
    except WebhookVerificationError:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event_type = event.get("type")
    data = event.get("data", {})

    if event_type in ("user.created", "user.updated"):
        await upsert_clerk_user(data, db)
    elif event_type == "user.deleted":
        result = await db.execute(select(User).where(User.clerk_id == data["id"]))
        user = result.scalar_one_or_none()
        if user:
            await db.delete(user)

    return Response(status_code=200)


@orgs_router.get("/me", response_model=OrgOut)
async def get_my_org(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _, org = await resolve_user_org(current_user, db)
    return org


@billing_router.post("/order", response_model=RazorpayOrderOut)
async def create_razorpay_order(
    payload: RazorpayOrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _, org = await resolve_user_org(current_user, db)
    plan_config = RAZORPAY_PLAN_CONFIG.get(payload.plan)
    if not plan_config or payload.billing_period != "monthly":
        raise HTTPException(status_code=400, detail="Invalid plan or billing period")
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail="Razorpay is not configured")

    plan_id = getattr(settings, plan_config["plan_id_attr"], "")
    notes = {
        "org_id": org.id,
        "plan": payload.plan,
        "billing_period": payload.billing_period,
    }
    order = await _create_razorpay_order_request(
        amount=plan_config["amount"],
        currency=settings.RAZORPAY_CURRENCY,
        receipt=f"{org.id[:12]}-{secrets.token_hex(6)}",
        notes=notes,
    )

    org.razorpay_order_id = order["id"]
    org.razorpay_plan_id = plan_id or None
    org.subscription_status = "pending_payment"
    db.add(org)
    await db.flush()

    return RazorpayOrderOut(
        key_id=settings.RAZORPAY_KEY_ID,
        order_id=order["id"],
        amount=order["amount"],
        currency=order["currency"],
        plan=payload.plan,
        subscription_status=org.subscription_status,
    )


@billing_router.post("/checkout")
async def legacy_checkout_removed():
    raise HTTPException(
        status_code=410,
        detail="Legacy checkout has been removed. Use /api/v1/billing/order for Razorpay.",
    )


@billing_router.post("/portal")
async def billing_portal(
    current_user: User = Depends(get_current_user),  # noqa: ARG001
):
    raise HTTPException(
        status_code=410,
        detail="Legacy billing portal has been removed. Razorpay self-serve portal is not enabled.",
    )


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


@billing_router.post("/verify-payment", response_model=RazorpayPaymentVerifyOut)
async def verify_razorpay_payment(
    payload: RazorpayPaymentVerify,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _, org = await resolve_user_org(current_user, db)
    if payload.razorpay_order_id != org.razorpay_order_id:
        raise HTTPException(status_code=400, detail="Payment order does not match organization")

    _verify_razorpay_payment_signature(
        order_id=org.razorpay_order_id,
        payment_id=payload.razorpay_payment_id,
        signature=payload.razorpay_signature,
        secret=settings.RAZORPAY_KEY_SECRET,
    )

    org.razorpay_payment_id = payload.razorpay_payment_id
    org.subscription_status = "payment_verified_waiting_webhook"
    db.add(org)
    await db.flush()
    return RazorpayPaymentVerifyOut(status=org.subscription_status)


@billing_router.post("/webhook")
async def razorpay_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    body = await request.body()
    sig = request.headers.get("x-razorpay-signature", "")
    webhook_secret = _require_webhook_secret(
        settings.RAZORPAY_WEBHOOK_SECRET,
        "Razorpay webhook secret",
    )
    if not sig or not _verify_razorpay_webhook_signature(body, sig, webhook_secret):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event = await request.json()
    event_type = event.get("event")
    payload = event.get("payload", {})

    if event_type == "payment.captured":
        payment = payload.get("payment", {}).get("entity", {})
        org = await _find_org_for_razorpay_event(payment, db)
        plan = _plan_from_razorpay_notes(payment)
        if org and plan in RAZORPAY_PLAN_CONFIG:
            org.razorpay_payment_id = payment.get("id") or org.razorpay_payment_id
            org.razorpay_order_id = payment.get("order_id") or org.razorpay_order_id
            org.razorpay_customer_id = payment.get("customer_id") or org.razorpay_customer_id
            org.plan = plan
            org.subscription_status = "active"
            db.add(org)

    elif event_type == "payment.failed":
        payment = payload.get("payment", {}).get("entity", {})
        org = await _find_org_for_razorpay_event(payment, db)
        if org:
            org.subscription_status = "payment_failed"
            db.add(org)

    elif event_type in ("subscription.charged", "subscription.authenticated"):
        subscription = payload.get("subscription", {}).get("entity", {})
        org = await _find_org_for_razorpay_event(subscription, db)
        plan = _plan_from_razorpay_notes(subscription)
        if org and plan in RAZORPAY_PLAN_CONFIG:
            org.razorpay_subscription_id = subscription.get("id")
            org.razorpay_customer_id = subscription.get("customer_id") or org.razorpay_customer_id
            org.plan = plan
            org.subscription_status = subscription.get("status") or "active"
            db.add(org)

    elif event_type in ("subscription.cancelled", "subscription.halted"):
        subscription = payload.get("subscription", {}).get("entity", {})
        org = await _find_org_for_razorpay_event(subscription, db)
        if org:
            org.subscription_status = subscription.get("status") or "cancelled"
            org.plan = "free"
            db.add(org)

    return Response(status_code=200)


async def _create_razorpay_order_request(
    *,
    amount: int,
    currency: str,
    receipt: str,
    notes: dict[str, str],
) -> dict:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.razorpay.com/v1/orders",
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET),
                json={
                    "amount": amount,
                    "currency": currency,
                    "receipt": receipt,
                    "notes": notes,
                },
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail="Razorpay rejected the order") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Razorpay order request failed") from exc


def _verify_razorpay_webhook_signature(body: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def _verify_razorpay_payment_signature(
    *,
    order_id: str,
    payment_id: str,
    signature: str,
    secret: str,
) -> None:
    if not secret:
        raise HTTPException(status_code=500, detail="Razorpay key secret is not configured")
    message = f"{order_id}|{payment_id}".encode("utf-8")
    expected = hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail="Invalid payment signature")


def _plan_from_razorpay_notes(entity: dict) -> str | None:
    notes = entity.get("notes") or {}
    return notes.get("plan")


async def _find_org_for_razorpay_event(
    entity: dict,
    db: AsyncSession,
) -> Organization | None:
    notes = entity.get("notes") or {}
    org_id = notes.get("org_id")
    if org_id:
        org = await db.get(Organization, org_id)
        if org:
            return org

    for column_value, column in (
        (entity.get("order_id"), Organization.razorpay_order_id),
        (entity.get("id"), Organization.razorpay_subscription_id),
        (entity.get("customer_id"), Organization.razorpay_customer_id),
    ):
        if column_value:
            result = await db.execute(select(Organization).where(column == column_value))
            org = result.scalar_one_or_none()
            if org:
                return org
    return None
