"""AI Systems and Gaps API endpoints."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import case, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user, require_admin
from app.db.session import get_db
from app.models.models import AISystem, Gap, Scan, User, Website
from app.schemas.schemas import AISystemOut, AISystemOverride, GapOut, GapStatusUpdate

ai_router = APIRouter(prefix="/ai-systems", tags=["ai-systems"])
gap_router = APIRouter(tags=["gaps"])


def _severity_order():
    return case(
        {"critical": 0, "high": 1, "medium": 2, "low": 3},
        value=Gap.severity,
        else_=4,
    )


# ─── AI Systems ───────────────────────────────────────────────────────────────

@ai_router.get("/{system_id}", response_model=AISystemOut)
async def get_ai_system(
    system_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _get_system_or_403(system_id, current_user, db)


@ai_router.patch("/{system_id}/override", response_model=AISystemOut)
async def override_classification(
    system_id: str,
    payload: AISystemOverride,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    system = await _get_system_or_403(system_id, current_user, db)
    system.risk_category = payload.risk_category
    system.override_reason = payload.override_reason
    system.manually_overridden = True
    await db.flush()
    await db.refresh(system)
    return system


@gap_router.get("/websites/{website_id}/ai-systems", response_model=list[AISystemOut])
async def list_ai_systems_for_website(
    website_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _verify_website_access(website_id, current_user, db)
    result = await db.execute(
        select(AISystem)
        .where(AISystem.website_id == website_id, AISystem.is_active == True)
        .order_by(AISystem.created_at.desc())
    )
    return result.scalars().all()


# ─── Gaps ─────────────────────────────────────────────────────────────────────

@gap_router.get("/scans/{scan_id}/gaps", response_model=list[GapOut])
async def list_gaps_for_scan(
    scan_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _verify_scan_access(scan_id, current_user, db)
    result = await db.execute(
        select(Gap).where(Gap.scan_id == scan_id).order_by(_severity_order())
    )
    return result.scalars().all()


@gap_router.patch("/gaps/{gap_id}", response_model=GapOut)
async def update_gap_status(
    gap_id: str,
    payload: GapStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Gap).where(Gap.id == gap_id))
    gap = result.scalar_one_or_none()
    if not gap:
        raise HTTPException(status_code=404, detail="Gap not found")

    await _verify_scan_access(gap.scan_id, current_user, db)

    gap.status = payload.status
    if payload.resolution_notes:
        gap.resolution_notes = payload.resolution_notes
    if payload.status == "resolved":
        gap.resolved_at = datetime.now(timezone.utc)
        gap.resolved_by = current_user.id

    await db.flush()
    await db.refresh(gap)
    return gap


# ─── Helpers ──────────────────────────────────────────────────────────────────

async def _get_system_or_403(system_id: str, user: User, db: AsyncSession) -> AISystem:
    result = await db.execute(select(AISystem).where(AISystem.id == system_id))
    system = result.scalar_one_or_none()
    if not system:
        raise HTTPException(status_code=404, detail="AI system not found")
    website = await db.get(Website, system.website_id)
    if not website or website.org_id != user.org_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return system


async def _verify_website_access(website_id: str, user: User, db: AsyncSession):
    website = await db.get(Website, website_id)
    if not website or website.org_id != user.org_id:
        raise HTTPException(status_code=404, detail="Website not found")


async def _verify_scan_access(scan_id: str, user: User, db: AsyncSession):
    result = await db.execute(select(Scan).where(Scan.id == scan_id))
    scan = result.scalar_one_or_none()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    website = await db.get(Website, scan.website_id)
    if not website or website.org_id != user.org_id:
        raise HTTPException(status_code=403, detail="Access denied")
