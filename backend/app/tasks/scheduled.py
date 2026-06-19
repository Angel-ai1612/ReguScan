"""Celery Beat periodic tasks — scheduled rescans and maintenance."""
from celery.schedules import crontab

from app.tasks.celery_app import celery_app
from app.utils.async_helpers import run_async


# ─── Beat schedule ────────────────────────────────────────────────────────────

celery_app.conf.beat_schedule = {
    # Rescan all active websites weekly (Sunday 02:00 UTC)
    "weekly-rescans": {
        "task": "app.tasks.scheduled.trigger_scheduled_rescans",
        "schedule": crontab(hour=2, minute=0, day_of_week=0),
    },
    # Clean up stale pending/running scans older than 1 hour
    "cleanup-stale-scans": {
        "task": "app.tasks.scheduled.cleanup_stale_scans",
        "schedule": crontab(hour="*/6", minute=0),  # Every 6 hours
    },
}


@celery_app.task(name="app.tasks.scheduled.trigger_scheduled_rescans")
def trigger_scheduled_rescans():
    """Queue a fresh scan for every active website on Pro/Enterprise plans."""
    run_async(_do_scheduled_rescans())


async def _do_scheduled_rescans():
    from sqlalchemy import select
    from app.db.session import AsyncSessionLocal
    from app.models.models import Organization, Website, Scan
    from app.tasks.scan_workflow import run_scan_workflow

    async with AsyncSessionLocal() as db:
        # Only scan Pro/Enterprise orgs on the weekly schedule
        result = await db.execute(
            select(Website)
            .join(Organization, Website.org_id == Organization.id)
            .where(
                Website.is_active == True,
                Organization.plan.in_(["pro", "enterprise"]),
                Organization.deleted_at.is_(None),
            )
        )
        websites = result.scalars().all()

        queued = 0
        for website in websites:
            # Skip if already running
            running = await db.scalar(
                select(Scan).where(
                    Scan.website_id == website.id,
                    Scan.status.in_(["pending", "running"]),
                )
            )
            if running:
                continue

            scan = Scan(
                website_id=website.id,
                triggered_by="scheduled",
                status="pending",
            )
            db.add(scan)
            await db.flush()
            await db.refresh(scan)

            task = run_scan_workflow.delay(str(scan.id), website.url)
            scan.celery_task_id = task.id
            queued += 1

        await db.commit()
        return {"queued": queued}


@celery_app.task(name="app.tasks.scheduled.cleanup_stale_scans")
def cleanup_stale_scans():
    """Mark scans stuck in pending/running for >1 hour as failed."""
    run_async(_do_cleanup())


async def _do_cleanup():
    from datetime import datetime, timezone, timedelta
    from sqlalchemy import update, select
    from app.db.session import AsyncSessionLocal
    from app.models.models import Scan

    cutoff = datetime.now(timezone.utc) - timedelta(hours=1)

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Scan).where(
                Scan.status.in_(["pending", "running"]),
                Scan.created_at < cutoff,
            )
        )
        stale = result.scalars().all()

        for scan in stale:
            scan.status = "failed"
            scan.failed_at = datetime.now(timezone.utc)
            scan.error_message = "Scan timed out — automatically cancelled after 1 hour"

        if stale:
            await db.commit()

        return {"cleaned": len(stale)}
