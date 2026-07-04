"""FastAPI application entry point."""
import asyncio
import json
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy import select

from app.api.v1.endpoints.ai_systems import ai_router, gap_router
from app.api.v1.endpoints.auth import auth_router, billing_router, orgs_router
from app.api.v1.endpoints.scans import router as scans_router
from app.api.v1.endpoints.websites import router as websites_router
from app.core.auth import get_user_from_token
from app.core.config import settings
from app.core.redis_client import limiter, redis_client
from app.db.session import AsyncSessionLocal
from app.models.models import Scan, Website


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    if settings.sentry_dsn:
        sentry_sdk.init(dsn=settings.sentry_dsn, traces_sample_rate=0.1)
    yield
    # Shutdown
    await redis_client.aclose()


app = FastAPI(
    title="ReguScan API",
    description="EU AI Act Compliance Scanner",
    version=settings.APP_VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url=None,
    lifespan=lifespan,
)

# ─── Middleware ────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── Routers ──────────────────────────────────────────────────────────────────

PREFIX = settings.API_V1_PREFIX

app.include_router(auth_router, prefix=PREFIX)
app.include_router(billing_router, prefix=PREFIX)
app.include_router(orgs_router, prefix=PREFIX)
app.include_router(websites_router, prefix=PREFIX)
app.include_router(scans_router, prefix=PREFIX)
app.include_router(ai_router, prefix=PREFIX)
app.include_router(gap_router, prefix=PREFIX)

# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.APP_VERSION, "env": settings.APP_ENV}


@app.get("/")
async def root():
    return {"service": "ReguScan API", "docs": "/docs"}


# ─── WebSocket — real-time scan progress ─────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.active: dict[str, list[WebSocket]] = {}

    async def connect(self, scan_id: str, ws: WebSocket, subprotocol: str | None = None):
        await ws.accept(subprotocol=subprotocol)
        self.active.setdefault(scan_id, []).append(ws)

    def disconnect(self, scan_id: str, ws: WebSocket):
        if scan_id in self.active:
            try:
                self.active[scan_id].remove(ws)
            except ValueError:
                pass

    async def broadcast(self, scan_id: str, message: str):
        dead = []
        for ws in self.active.get(scan_id, []):
            try:
                await ws.send_text(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.active[scan_id].remove(ws)


manager = ConnectionManager()


@app.websocket("/ws/scans/{scan_id}")
async def scan_websocket(websocket: WebSocket, scan_id: str):
    """WebSocket endpoint for real-time scan progress updates."""
    allowed, subprotocol = await _websocket_can_access_scan(websocket, scan_id)
    if not allowed:
        await websocket.close(code=1008)
        return

    await manager.connect(scan_id, websocket, subprotocol=subprotocol)
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(f"scan:{scan_id}")
    forward_task: asyncio.Task | None = None

    try:
        # Forward Redis pub/sub messages to WebSocket
        async def _forward():
            async for message in pubsub.listen():
                if message["type"] == "message":
                    data = message["data"]
                    await websocket.send_text(data)

        forward_task = asyncio.create_task(_forward())

        # Keep alive — wait for client disconnect
        while True:
            try:
                await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
            except asyncio.TimeoutError:
                await websocket.send_text(json.dumps({"event": "ping"}))

    except WebSocketDisconnect:
        pass
    finally:
        if forward_task:
            forward_task.cancel()
        await pubsub.unsubscribe(f"scan:{scan_id}")
        manager.disconnect(scan_id, websocket)


async def _websocket_can_access_scan(websocket: WebSocket, scan_id: str) -> tuple[bool, str | None]:
    token, subprotocol = _extract_websocket_token(websocket)
    if not token:
        return False, None

    async with AsyncSessionLocal() as db:
        try:
            user = await get_user_from_token(token, db)
        except Exception:
            return False, None

        result = await db.execute(
            select(Scan)
            .join(Website, Scan.website_id == Website.id)
            .where(Scan.id == scan_id, Website.org_id == user.org_id)
        )
        return result.scalar_one_or_none() is not None, subprotocol


def _extract_websocket_token(websocket: WebSocket) -> tuple[str | None, str | None]:
    token = None
    selected_subprotocol = None

    auth_header = websocket.headers.get("authorization")
    if auth_header:
        scheme, _, credentials = auth_header.partition(" ")
        if scheme.lower() == "bearer" and credentials:
            token = credentials

    for protocol in websocket.headers.get("sec-websocket-protocol", "").split(","):
        protocol = protocol.strip()
        if protocol == "reguscan":
            selected_subprotocol = "reguscan"
        elif protocol.startswith("clerk.") and len(protocol) > len("clerk."):
            token = protocol[len("clerk."):]

    return token, selected_subprotocol
