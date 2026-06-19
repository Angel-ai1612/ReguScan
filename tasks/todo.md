# ReguScan Build Plan

## Phase 1: Scaffolding & Config ✅
- [x] Directory structure
- [x] Backend pyproject.toml + requirements
- [x] Backend core config (settings, database, redis)
- [x] SQLAlchemy models (all 10 tables)
- [x] Alembic migrations (001_initial + env.py + script.py.mako)
- [x] Docker Compose (local dev — api, worker, beat, flower, frontend, db, redis)

## Phase 2: Backend API ✅
- [x] FastAPI app entry point (main.py)
- [x] Auth middleware (Clerk JWT — core/auth.py)
- [x] resolve_user_org helper (replaces .__wrapped__ anti-pattern)
- [x] Organizations endpoint (orgs_router)
- [x] Users + Clerk webhook handler
- [x] Websites endpoints (CRUD + plan limits)
- [x] Scans endpoints (trigger, status, list, delete)
- [x] AI Systems endpoints (get, list, override)
- [x] Gaps endpoints (list by scan, update status)
- [x] Billing endpoints (checkout, portal, usage, Stripe webhook)
- [x] WebSocket scan progress (Redis pub/sub bridge)

## Phase 3: Async Workers (Celery) ✅
- [x] Celery app setup (celery_app.py — 5 queues)
- [x] Scan workflow orchestrator (scan_workflow.py)
- [x] Crawler task (Playwright — 20 pages, network intercept, screenshots)
- [x] AI detector task (30+ signatures — chatbots, content gen, high-risk, recommendation)
- [x] LLM classifier task (Groq Llama 3.3 70B — JSON mode)
- [x] Gap analyzer task (rule engine — all 4 tiers, code snippets)
- [x] Report compiler task (Jinja2 HTML report, R2 upload, compliance score)
- [x] Notification task (Resend email on completion)

## Phase 4: Frontend (Next.js) ✅
- [x] Next.js 14 + Clerk + TanStack Query + Tailwind
- [x] Landing page (hero, features, pricing, dark theme)
- [x] Clerk middleware (route protection)
- [x] Dashboard layout (sidebar navigation)
- [x] Dashboard overview (stats, website list, deadline banner)
- [x] Websites list page (CRUD, scan trigger)
- [x] Website detail page (AI systems, scan history, stats)
- [x] Scan results page (real-time WebSocket progress, gaps with code snippets)
- [x] Reports page (all scans across websites, download links)
- [x] Settings + billing page (plan comparison, usage meters, Stripe checkout)
- [x] Token injector (Clerk JWT → axios interceptor)

## Phase 5: Deployment ✅
- [x] render.yaml (API web service + Celery worker)
- [x] Vercel config (via CLI + env vars documented)
- [x] GitHub Actions CI/CD (.github/workflows/ci.yml)
- [x] backend/.env.example (all variables with comments + free tier URLs)
- [x] frontend/.env.local.example

## Documentation ✅
- [x] README.md (full setup guide, free tier services, deployment, structure)
- [x] tasks/lessons.md (10 patterns captured)

## Review
### What was built
- Full-stack EU AI Act compliance scanner (free tier, $0/month to run)
- 7 Celery workers covering the entire scan pipeline
- 30+ AI detection signatures with LLM classification fallback
- Real-time WebSocket scan progress
- Compliance gap engine with copy-paste remediation code
- HTML reports uploaded to Cloudflare R2

### Free tier constraints
- Render free: 512MB RAM, sleeps after 15min inactivity
- Upstash: 10K req/day → ~100-200 scans/day
- Groq: 14,400 req/day → ~1,440-4,800 AI classifications/day
- Supabase: 500MB → ~50K+ scans before limit

### Known TODOs for post-MVP
- [ ] Scheduled weekly rescans (Celery Beat periodic task)
- [ ] Pinecone regulation embeddings seeder script
- [ ] White-label reports (agency feature)
- [ ] Browser extension
- [ ] CI/CD pipeline secrets setup guide

## Quality Pass (this session) ✅
- [x] Fix asyncio.new_event_loop() loop leaks in all 5 task files → shared run_async util
- [x] Fix Clerk v5 middleware API (authMiddleware → clerkMiddleware)
- [x] Fix auth() → await auth() in Next.js server components
- [x] Fix api.ts interceptor — remove broken @clerk/nextjs/server browser import
- [x] Fix ConnectionManager.discard() → remove() (list vs set method)
- [x] Remove unused imports (HttpUrl, EmailStr, asyncio)
- [x] Add scheduled.py (weekly rescans + stale scan cleanup)
- [x] Add scripts/seed_pinecone.py (regulation embeddings seeder)
- [x] All 39 Python files pass syntax check ✅
- [x] All 14 TypeScript files verified ✅
- [x] 15 lessons captured in tasks/lessons.md
