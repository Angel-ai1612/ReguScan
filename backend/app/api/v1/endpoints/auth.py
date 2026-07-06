"""Clerk webhook handler + auth + billing endpoints."""

import hashlib
import hmac
import json
import secrets
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from svix.webhooks import Webhook, WebhookVerificationError

from app.core.auth import get_current_user, resolve_user_org
from app.core.config import settings
from app.core.plans import (
    get_paid_plan_config,
    get_plan_config,
    remaining_limit,
)
from app.db.session import get_db
from app.models.models import Organization, Scan, User, Website
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
    plan_config = get_paid_plan_config(payload.plan)
    if not plan_config or payload.billing_period != "monthly":
        raise HTTPException(status_code=400, detail="Invalid plan or billing period")
    if not settings.RAZORPAY_CHECKOUT_ENABLED:
        raise HTTPException(status_code=503, detail="Paid plan checkout is coming soon")
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail="Razorpay is not configured")

    plan_id = getattr(settings, plan_config.razorpay_plan_id_attr or "", "")
    notes = {
        "org_id": org.id,
        "plan": payload.plan,
        "billing_period": payload.billing_period,
    }
    order = await _create_razorpay_order_request(
        amount=plan_config.amount_minor or 0,
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
    _, org = await resolve_user_org(current_user, db)
    plan = get_plan_config(org.plan)
    period_start = _current_month_start()

    websites_count = await db.scalar(
        select(func.count()).where(Website.org_id == org.id, Website.is_active == True)
    )
    website_ids = select(Website.id).where(Website.org_id == org.id)
    scans_total = await db.scalar(
        select(func.count()).where(
            Scan.website_id.in_(website_ids)
        )
    )
    scans_month = await db.scalar(
        select(func.count()).where(
            Scan.website_id.in_(website_ids),
            Scan.created_at >= period_start,
        )
    )
    scans_used = scans_total if plan.scan_limit_scope == "total" else scans_month
    scans_used = scans_used or 0

    return UsageOut(
        plan=org.plan,
        subscription_status=org.subscription_status or "incomplete",
        scans_used=scans_used,
        scans_used_this_month=scans_month or 0,
        scans_used_total=scans_total or 0,
        scans_limit=plan.scan_limit,
        scan_limit_scope=plan.scan_limit_scope,
        remaining_scans=remaining_limit(plan.scan_limit, scans_used),
        websites_used=websites_count or 0,
        websites_limit=plan.websites,
        remaining_websites=remaining_limit(plan.websites, websites_count or 0),
        period_start=org.subscription_current_period_start,
        period_end=org.subscription_current_period_end,
        billing_available=_razorpay_checkout_available(),
        payment_status=org.subscription_status,
        plan_features=plan.public_features(),
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

    try:
        event = json.loads(body)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Invalid webhook payload") from exc

    event_type = event.get("event")
    payload = event.get("payload", {})
    event_id = request.headers.get("x-razorpay-event-id")

    if event_type == "payment.captured":
        payment = payload.get("payment", {}).get("entity", {})
        org = await _find_org_for_razorpay_event(payment, db)
        plan = _plan_from_razorpay_notes(payment)
        if _is_duplicate_razorpay_event(org, event_id):
            return Response(status_code=200)
        if org and get_paid_plan_config(plan):
            org.razorpay_payment_id = payment.get("id") or org.razorpay_payment_id
            org.razorpay_order_id = payment.get("order_id") or org.razorpay_order_id
            org.razorpay_customer_id = payment.get("customer_id") or org.razorpay_customer_id
            _activate_org_plan(org, plan, "active", event_id)
            db.add(org)

    elif event_type == "payment.failed":
        payment = payload.get("payment", {}).get("entity", {})
        org = await _find_org_for_razorpay_event(payment, db)
        if _is_duplicate_razorpay_event(org, event_id):
            return Response(status_code=200)
        if org:
            org.subscription_status = "payment_failed"
            _mark_razorpay_event_seen(org, event_id)
            db.add(org)

    elif event_type in ("subscription.activated", "subscription.charged", "subscription.authenticated"):
        subscription = payload.get("subscription", {}).get("entity", {})
        org = await _find_org_for_razorpay_event(subscription, db)
        plan = _plan_from_razorpay_notes(subscription)
        if _is_duplicate_razorpay_event(org, event_id):
            return Response(status_code=200)
        if org and get_paid_plan_config(plan):
            org.razorpay_subscription_id = subscription.get("id")
            org.razorpay_customer_id = subscription.get("customer_id") or org.razorpay_customer_id
            _set_subscription_period(org, subscription)
            _activate_org_plan(org, plan, subscription.get("status") or "active", event_id)
            db.add(org)

    elif event_type in ("subscription.cancelled", "subscription.completed", "subscription.halted"):
        subscription = payload.get("subscription", {}).get("entity", {})
        org = await _find_org_for_razorpay_event(subscription, db)
        if _is_duplicate_razorpay_event(org, event_id):
            return Response(status_code=200)
        if org:
            org.subscription_status = subscription.get("status") or "cancelled"
            org.plan = "free"
            org.plan_updated_at = datetime.now(timezone.utc)
            _set_subscription_period(org, subscription)
            _mark_razorpay_event_seen(org, event_id)
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


def _razorpay_checkout_available() -> bool:
    return bool(
        settings.RAZORPAY_CHECKOUT_ENABLED
        and settings.RAZORPAY_KEY_ID
        and settings.RAZORPAY_KEY_SECRET
        and settings.RAZORPAY_WEBHOOK_SECRET
    )


def _current_month_start() -> datetime:
    return datetime.now(timezone.utc).replace(
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )


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


def _is_duplicate_razorpay_event(org: Organization | None, event_id: str | None) -> bool:
    return bool(org and event_id and org.razorpay_last_event_id == event_id)


def _mark_razorpay_event_seen(org: Organization, event_id: str | None) -> None:
    if event_id:
        org.razorpay_last_event_id = event_id
        org.razorpay_last_event_at = datetime.now(timezone.utc)


def _activate_org_plan(
    org: Organization,
    plan: str | None,
    subscription_status: str,
    event_id: str | None,
) -> None:
    if not get_paid_plan_config(plan):
        return
    org.plan = plan
    org.subscription_status = subscription_status
    org.plan_updated_at = datetime.now(timezone.utc)
    _mark_razorpay_event_seen(org, event_id)


def _set_subscription_period(org: Organization, subscription: dict) -> None:
    current_start = _timestamp_to_datetime(subscription.get("current_start"))
    current_end = _timestamp_to_datetime(subscription.get("current_end"))
    if current_start:
        org.subscription_current_period_start = current_start
    if current_end:
        org.subscription_current_period_end = current_end


def _timestamp_to_datetime(value: int | str | None) -> datetime | None:
    if value in (None, ""):
        return None
    try:
        return datetime.fromtimestamp(int(value), timezone.utc)
    except (TypeError, ValueError, OSError):
        return None


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
