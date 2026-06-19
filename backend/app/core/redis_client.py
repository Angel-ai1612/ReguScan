"""Redis client (Upstash-compatible) + rate limiting."""
import redis.asyncio as aioredis
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings

# Shared async Redis client
redis_client: aioredis.Redis = aioredis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)

# SlowAPI rate limiter backed by Redis
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=settings.REDIS_URL,
)


async def get_redis() -> aioredis.Redis:
    return redis_client


async def cache_set(key: str, value: str, ttl: int = settings.REDIS_TTL_SECONDS) -> None:
    await redis_client.setex(key, ttl, value)


async def cache_get(key: str) -> str | None:
    return await redis_client.get(key)


async def cache_delete(key: str) -> None:
    await redis_client.delete(key)


async def publish_event(channel: str, message: str) -> None:
    """Publish a message to a Redis pub/sub channel (WebSocket bridge)."""
    await redis_client.publish(channel, message)
