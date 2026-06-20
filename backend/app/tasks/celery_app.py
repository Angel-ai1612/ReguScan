"""Celery application factory."""
from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "reguscan",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.tasks.scan_workflow",
        "app.tasks.crawler",
        "app.tasks.detector",
        "app.tasks.classifier",
        "app.tasks.gap_analyzer",
        "app.tasks.report_generator",
        "app.tasks.notifier",
        "app.tasks.scheduled",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,  # one task at a time per worker (for crawling)
    task_routes={
        "app.tasks.scan_workflow.run_scan_workflow": {"queue": "workflow"},
        "app.tasks.scheduled.*": {"queue": "workflow"},
        "app.tasks.crawler.*": {"queue": "crawl"},
        "app.tasks.detector.*": {"queue": "detect"},
        "app.tasks.classifier.*": {"queue": "llm"},
        "app.tasks.report_generator.*": {"queue": "report"},
        "app.tasks.notifier.*": {"queue": "notify"},
    },
    task_default_retry_delay=60,
    task_max_retries=3,
    broker_connection_retry_on_startup=True,
)
