"""Async helpers for use inside synchronous Celery tasks."""
import asyncio


def run_async(coro):
    """
    Run an async coroutine from within a synchronous Celery task.
    Creates a fresh event loop, runs the coroutine, then closes the loop.
    Safe to call multiple times in the same task.
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        try:
            # Cancel any remaining tasks
            pending = asyncio.all_tasks(loop)
            if pending:
                loop.run_until_complete(asyncio.gather(*pending, return_exceptions=True))
        finally:
            loop.close()
            asyncio.set_event_loop(None)
