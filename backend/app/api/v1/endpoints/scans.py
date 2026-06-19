"""Scan trigger, status, and results endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db.session import get_db
from app.models.models import Scan, User, Website
from app.schemas.schemas import ScanOut, ScanTrigger

router = APIRouter(tags=["scans"])


@router.post("/websites/{website_id}/scan", response_model=ScanOut, status_code=201)
async def trigger_scan(
    website_id: str,
    payload: ScanTrigger = ScanTrigger(),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Trigger a new compliance scan for a website."""
    website = await _get_website_or_403(website_id, current_user, db)

    # Check for already-running scan
    running = await db.execute(
        select(Scan).where(
            Scan.website_id == website_id,
            Scan.status.in_(["pending", "running"]),
        )
    )
    if running.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="A scan is already running for this website")

    scan = Scan(
        website_id=website_id,
        triggered_by=payload.triggered_by,
        status="pending",
    )
    db.add(scan)
    await db.flush()
    await db.refresh(scan)

    # Dispatch Celery task
    from app.tasks.scan_workflow import run_scan_workflow
    task = run_scan_workflow.delay(str(scan.id), website.url)
    scan.celery_task_id = task.id
    await db.flush()

    return scan


@router.get("/scans/{scan_id}", response_model=ScanOut)
async def get_scan(
    scan_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    scan = await _get_scan_or_403(scan_id, current_user, db)
    return scan


@router.get("/websites/{website_id}/scans", response_model=list[ScanOut])
async def list_scans(
    website_id: str,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_website_or_403(website_id, current_user, db)
    result = await db.execute(
        select(Scan)
        .where(Scan.website_id == website_id)
        .order_by(Scan.created_at.desc())
        .limit(limit)
    )
    return result.scalars().all()


@router.delete("/scans/{scan_id}", status_code=204)
async def delete_scan(
    scan_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    scan = await _get_scan_or_403(scan_id, current_user, db)
    await db.delete(scan)


# ─── Helpers ──────────────────────────────────────────────────────────────────

async def _get_website_or_403(website_id: str, user: User, db: AsyncSession) -> Website:
    result = await db.execute(select(Website).where(Website.id == website_id))
    website = result.scalar_one_or_none()
    if not website or website.org_id != user.org_id:
        raise HTTPException(status_code=404, detail="Website not found")
    return website


async def _get_scan_or_403(scan_id: str, user: User, db: AsyncSession) -> Scan:
    result = await db.execute(
        select(Scan).join(Website, Scan.website_id == Website.id).where(Scan.id == scan_id)
    )
    scan = result.scalar_one_or_none()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    # verify org ownership
    website_result = await db.execute(select(Website).where(Website.id == scan.website_id))
    website = website_result.scalar_one_or_none()
    if not website or website.org_id != user.org_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return scan
