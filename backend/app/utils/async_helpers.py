"""Async helpers for use inside synchronous Celery tasks."""
import asyncio

_worker_loop: asyncio.AbstractEventLoop | None = None


def run_async(coro):
    """
    Run an async coroutine from within a synchronous Celery task.
    Reuses one event loop per worker process so async DB/Redis clients do not
    get bound to a different loop between workflow stages.
    """
    global _worker_loop
    if _worker_loop is None or _worker_loop.is_closed():
        _worker_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(_worker_loop)
    return _worker_loop.run_until_complete(coro)
