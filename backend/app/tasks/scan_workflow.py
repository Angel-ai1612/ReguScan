"""Scan workflow — chains crawler → detector → classifier → gap analyzer → report → notify."""
import json
from datetime import datetime, timezone

from app.tasks.celery_app import celery_app
from app.utils.async_helpers import run_async


async def _update_scan(scan_id: str, **kwargs):
    from sqlalchemy import update
    from app.db.session import AsyncSessionLocal
    from app.models.models import Scan
    async with AsyncSessionLocal() as db:
        await db.execute(update(Scan).where(Scan.id == scan_id).values(**kwargs))
        await db.commit()


async def _emit(scan_id: str, event: str, data: dict):
    from app.core.redis_client import publish_event
    channel = f"scan:{scan_id}"
    payload = json.dumps({"event": event, "data": {"scan_id": scan_id, **data}})
    await publish_event(channel, payload)


@celery_app.task(bind=True, name="app.tasks.scan_workflow.run_scan_workflow", max_retries=1)
def run_scan_workflow(self, scan_id: str, url: str):
    """Entry point: runs the full scan pipeline sequentially."""
    try:
        run_async(_update_scan(
            scan_id,
            status="running",
            stage="crawling",
            progress_percent=5,
            started_at=datetime.now(timezone.utc),
        ))
        run_async(_emit(scan_id, "scan.started", {"status": "running", "url": url}))

        # Stage 1: Crawl
        run_async(_emit(scan_id, "scan.progress", {"stage": "crawling", "percent_complete": 10}))
        from app.tasks.crawler import crawl_website
        crawl_data = crawl_website(scan_id, url)

        # Stage 2: Detect
        run_async(_update_scan(scan_id, stage="detecting", progress_percent=30))
        run_async(_emit(scan_id, "scan.progress", {"stage": "detecting", "percent_complete": 30}))
        from app.tasks.detector import detect_ai_systems
        detection_data = detect_ai_systems(scan_id, crawl_data)

        # Stage 3: Classify
        run_async(_update_scan(scan_id, stage="classifying", progress_percent=50))
        run_async(_emit(scan_id, "scan.progress", {"stage": "classifying", "percent_complete": 50}))
        from app.tasks.classifier import classify_ai_systems
        classification_data = classify_ai_systems(scan_id, detection_data)

        # Stage 4: Gap analysis
        run_async(_update_scan(scan_id, stage="analyzing", progress_percent=70))
        run_async(_emit(scan_id, "scan.progress", {"stage": "analyzing", "percent_complete": 70}))
        from app.tasks.gap_analyzer import analyze_gaps
        gap_data = analyze_gaps(scan_id, classification_data)

        # Stage 5: Report
        run_async(_update_scan(scan_id, stage="reporting", progress_percent=85))
        run_async(_emit(scan_id, "scan.progress", {"stage": "reporting", "percent_complete": 85}))
        from app.tasks.report_generator import compile_report
        report_data = compile_report(scan_id, gap_data)
        final_status = "needs_review" if report_data.get("requires_review") else "completed"

        # Stage 6: Finalize
        run_async(_update_scan(
            scan_id,
            status=final_status,
            stage="done",
            progress_percent=100,
            completed_at=datetime.now(timezone.utc),
            compliance_score=report_data.get("compliance_score", 0),
            gap_summary=report_data.get("gap_summary"),
            classification_results=report_data.get("classification_results"),
            estimated_fine_exposure=report_data.get("estimated_fine_exposure"),
            report_url=report_data.get("report_url"),
        ))
        run_async(_update_website_score(scan_id, report_data))
        run_async(_emit(scan_id, "scan.completed", {
            "status": final_status,
            "compliance_score": report_data.get("compliance_score", 0),
            "requires_review": report_data.get("requires_review", False),
        }))

        from app.tasks.notifier import notify_scan_complete
        notify_scan_complete.delay(scan_id)

    except Exception as exc:
        run_async(_update_scan(
            scan_id,
            status="failed",
            stage="error",
            failed_at=datetime.now(timezone.utc),
            error_message=str(exc),
        ))
        run_async(_emit(scan_id, "scan.failed", {"error": str(exc), "retryable": True}))
        raise self.retry(exc=exc, countdown=60)


async def _update_website_score(scan_id: str, report_data: dict):
    from sqlalchemy import update, select
    from app.db.session import AsyncSessionLocal
    from app.models.models import Scan, Website
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Scan).where(Scan.id == scan_id))
        scan = result.scalar_one_or_none()
        if scan:
            await db.execute(
                update(Website).where(Website.id == scan.website_id).values(
                    compliance_score=report_data.get("compliance_score"),
                    overall_risk_tier=report_data.get("overall_risk_tier"),
                    last_scan_id=scan_id,
                    last_scan_at=datetime.now(timezone.utc),
                )
            )
            await db.commit()
