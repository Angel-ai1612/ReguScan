# ReguScan — Build Lessons

## Patterns & Rules

### 1. Never use `.__wrapped__` to bypass FastAPI dependency injection
**Mistake**: Calling `get_current_user_org.__wrapped__(user, db)` to invoke a dependency function directly.
**Rule**: Extract shared logic into a plain `async def resolve_*()` helper that takes explicit args. Only use `Depends()` at route level.
**Fix**: Created `resolve_user_org(user, db)` in `core/auth.py`.

### 2. SQLAlchemy `case()` syntax changed in 2.0
**Rule**: In SQLAlchemy 2.x, use `case({"val": 0}, value=Column.col)` not `.case(Column.col, ...)`.
**Fix**: Wrap in a function `_severity_order()` so it's constructed fresh per query.

### 3. Alembic requires `script.py.mako` in `alembic/` directory
**Rule**: Always create `alembic/script.py.mako` when scaffolding — without it `alembic revision` fails.

### 4. Celery `asyncio.new_event_loop().run_until_complete()` in sync tasks
**Pattern**: Celery tasks are synchronous but our DB/Redis clients are async.
**Rule**: Always use `asyncio.new_event_loop().run_until_complete(coro)` in Celery tasks and close the loop after.
**Caveat**: Never reuse event loops across tasks — always create fresh ones.

### 5. Upstash Redis requires `rediss://` (TLS), not `redis://`
**Rule**: In `.env.example`, use `rediss://` URL for Upstash. Local Docker uses `redis://`.

### 6. Free tier WebSocket on Render
**Issue**: Render free tier supports WebSockets but the service sleeps. Pre-warm with a health ping.
**Rule**: Frontend should ping `/health` on load to wake the Render service before the user tries to scan.

### 7. Clerk JWT verification needs fresh JWKS on first request only
**Rule**: Cache JWKS in a module-level variable; invalidate on 401 to handle key rotation.

### 8. Playwright in Docker needs `--no-sandbox`
**Rule**: Always pass `--no-sandbox --disable-setuid-sandbox` in Chromium launch args when running in containers.

### 9. PostCSS config required for Tailwind in Next.js 14
**Rule**: Always create `postcss.config.js` alongside `tailwind.config.js`. Without it, Tailwind classes don't compile.

### 10. Schemas __init__.py needed
**Rule**: Every Python package directory needs `__init__.py`. Use `touch` command in batch to create all at once.

### 11. Clerk v5 uses clerkMiddleware, not authMiddleware
**Mistake**: Used `authMiddleware` from `@clerk/nextjs` v4 API while package.json specifies v5.
**Rule**: Always check the installed Clerk version. v5+ uses `clerkMiddleware` + `createRouteMatcher`. Auth in server components requires `await auth()`.

### 12. Never import @clerk/nextjs/server inside a browser axios interceptor
**Mistake**: `lib/api.ts` imported `getToken` from `@clerk/nextjs/server` inside an axios interceptor that runs in the browser.
**Rule**: Server-only imports crash in the browser. Use `window.__clerk_token` (set by a client component) as the bridge pattern.

### 13. List has no .discard() — that's a set method
**Mistake**: `ConnectionManager.active` typed as `dict[str, list[WebSocket]]` but called `.discard()` (a set method) on it.
**Rule**: Always match method to collection type. Lists use `.remove()` with try/except for safe removal.

### 14. Unused imports cause ruff failures in CI
**Rule**: After removing a dependency (e.g. replacing asyncio.new_event_loop with run_async), immediately remove the now-unused `import asyncio` line. CI runs `ruff check` and will fail.

### 15. Alembic script.py.mako is required even for manual migration files
**Rule**: Always create `alembic/script.py.mako` when scaffolding. Without it `alembic revision --autogenerate` fails even if you only plan to write manual migrations.
