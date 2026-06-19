"""Websites CRUD endpoints."""
import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user, require_admin, resolve_user_org
from app.db.session import get_db
from app.models.models import User, Website
from app.schemas.schemas import WebsiteCreate, WebsiteOut, WebsiteUpdate

router = APIRouter(prefix="/websites", tags=["websites"])


@router.post("", response_model=WebsiteOut, status_code=status.HTTP_201_CREATED)
async def create_website(
    payload: WebsiteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _, org = await resolve_user_org(current_user, db)

    limit = _get_plan_limit(org.plan)
    count = await db.scalar(
        select(func.count()).where(Website.org_id == org.id, Website.is_active == True)
    )
    if limit != -1 and (count or 0) >= limit:
        raise HTTPException(
            status_code=402,
            detail=f"Plan limit reached ({limit} websites). Upgrade to add more.",
        )

    existing = await db.scalar(
        select(Website).where(Website.org_id == org.id, Website.url == payload.url)
    )
    if existing:
        raise HTTPException(status_code=409, detail="Website already added")

    website = Website(
        org_id=org.id,
        url=payload.url,
        name=payload.name or _extract_domain(payload.url),
        description=payload.description,
        scan_settings=payload.scan_settings or {},
    )
    db.add(website)
    await db.flush()
    await db.refresh(website)
    return website


@router.get("", response_model=list[WebsiteOut])
async def list_websites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _, org = await resolve_user_org(current_user, db)
    result = await db.execute(
        select(Website)
        .where(Website.org_id == org.id, Website.is_active == True)
        .order_by(Website.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{website_id}", response_model=WebsiteOut)
async def get_website(
    website_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _get_website_or_404(website_id, current_user, db)


@router.patch("/{website_id}", response_model=WebsiteOut)
async def update_website(
    website_id: str,
    payload: WebsiteUpdate,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    website = await _get_website_or_404(website_id, current_user, db)
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(website, field, value)
    await db.flush()
    await db.refresh(website)
    return website


@router.delete("/{website_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_website(
    website_id: str,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    website = await _get_website_or_404(website_id, current_user, db)
    website.is_active = False
    await db.flush()


# ─── Helpers ──────────────────────────────────────────────────────────────────

async def _get_website_or_404(website_id: str, user: User, db: AsyncSession) -> Website:
    result = await db.execute(select(Website).where(Website.id == website_id))
    website = result.scalar_one_or_none()
    if not website or website.org_id != user.org_id:
        raise HTTPException(status_code=404, detail="Website not found")
    return website


def _get_plan_limit(plan: str) -> int:
    return {"free": 1, "starter": 3, "pro": 10, "enterprise": -1}.get(plan, 1)


def _extract_domain(url: str) -> str:
    from urllib.parse import urlparse
    return urlparse(url).netloc or url
