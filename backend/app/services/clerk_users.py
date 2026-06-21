"""Clerk user provisioning helpers."""
import re

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.models import Organization, User


def _primary_email(data: dict) -> str:
    emails = data.get("email_addresses") or []
    primary_id = data.get("primary_email_address_id")
    if primary_id:
        for item in emails:
            if item.get("id") == primary_id and item.get("email_address"):
                return item["email_address"]
    if emails and emails[0].get("email_address"):
        return emails[0]["email_address"]
    return ""


def _slugify(value: str, fallback: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:50]
    return slug or fallback


def _fallback_clerk_user_data(clerk_id: str, claims: dict | None = None) -> dict:
    claims = claims or {}
    email = (
        claims.get("email")
        or claims.get("email_address")
        or claims.get("primary_email")
        or f"{clerk_id}@users.clerk.local"
    )
    first_name = claims.get("first_name")
    last_name = claims.get("last_name")
    name = claims.get("name")
    if name and not first_name:
        parts = str(name).split(" ", 1)
        first_name = parts[0]
        last_name = last_name or (parts[1] if len(parts) > 1 else None)

    return {
        "id": clerk_id,
        "first_name": first_name,
        "last_name": last_name,
        "image_url": claims.get("image_url") or claims.get("picture"),
        "primary_email_address_id": "fallback-primary",
        "email_addresses": [
            {"id": "fallback-primary", "email_address": email},
        ],
    }


async def fetch_clerk_user_data(clerk_id: str) -> dict | None:
    """Fetch a Clerk user through the backend API when a webhook was missed."""
    if not settings.CLERK_SECRET_KEY:
        return None

    try:
        async with httpx.AsyncClient(timeout=8) as client:
            response = await client.get(
                f"https://api.clerk.com/v1/users/{clerk_id}",
                headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
            )
            response.raise_for_status()
            return response.json()
    except Exception:
        return None


async def upsert_clerk_user(data: dict, db: AsyncSession) -> User:
    """Create or update the local user and a default organization."""
    clerk_id = data["id"]
    email = _primary_email(data) or f"{clerk_id}@users.clerk.local"

    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if not user:
        slug_base = _slugify(email.split("@")[0], f"user-{clerk_id[:8]}")
        existing_slug = await db.scalar(
            select(Organization).where(Organization.slug == slug_base)
        )
        slug = slug_base if not existing_slug else f"{slug_base}-{clerk_id[:6]}"

        org_name = data.get("first_name") or email.split("@")[0] or "My"
        org = Organization(name=f"{org_name} Org", slug=slug, plan="free")
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
    return user


async def bootstrap_clerk_user(clerk_id: str, claims: dict, db: AsyncSession) -> User:
    """Provision a valid authenticated Clerk user if the webhook has not arrived."""
    data = await fetch_clerk_user_data(clerk_id)
    if not data:
        data = _fallback_clerk_user_data(clerk_id, claims)
    return await upsert_clerk_user(data, db)
