# ReguScan Architecture Document

**Version:** 1.0  
**Last Updated:** 2026-07-23  
**Repository:** https://github.com/Angel-ai1612/ReguScan

---

## Table of Contents

1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Data Flow & Pipeline](#data-flow--pipeline)
6. [Database Schema](#database-schema)
7. [API Design](#api-design)
8. [Authentication & Authorization](#authentication--authorization)
9. [Task Queue & Async Processing](#task-queue--async-processing)
10. [Real-Time Communication](#real-time-communication)
11. [Security Architecture](#security-architecture)
12. [Deployment Architecture](#deployment-architecture)
13. [Monitoring & Observability](#monitoring--observability)
14. [Scaling Considerations](#scaling-considerations)

---

## System Overview

ReguScan is an **EU AI Act compliance scanner** that automatically crawls websites, detects embedded AI systems, classifies their risk under EU Regulation 2024/1689, maps compliance gaps, and generates actionable remediation guidance.

### Core Value Proposition

- **Evidence-first detection**: Playwright-based crawling captures DOM, scripts, network requests, and screenshots
- **LLM-enhanced classification**: Groq LLM classifies detected systems against EU AI Act risk tiers with structured fallbacks
- **Crawl-quality awareness**: Distinguishes between "no AI found after healthy crawl" vs "no AI found because crawl was incomplete"
- **Real-time streaming**: WebSocket + Redis pub/sub delivers live scan progress without polling
- **Actionable remediation**: Gap analysis provides code snippets, UI patterns, and compliance checklists

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            REGSUCHAN SYSTEM ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────────────────────────┐
│   Frontend   │◄───►│   Backend    │◄───►│         Data Layer               │
│  (Next.js 16)│     │  (FastAPI)   │     │  ┌─────────┐  ┌─────────────┐   │
│              │     │              │     │  │PostgreSQL│  │    Redis    │   │
│  • Dashboard │     │  • REST API  │     │  │  (Data)  │  │ (Cache/Queue)│   │
│  • WebSocket │     │  • WebSocket │     │  └─────────┘  └─────────────┘   │
│  • Clerk Auth│     │  • Auth      │     │                                    │
└──────────────┘     │  • Plans     │     └──────────────────────────────────┘
                     │  • Rate Limit│                    ▲
                     └──────┬───────┘                    │
                            │                            │
              ┌─────────────┼─────────────┐              │
              ▼             ▼             ▼              │
       ┌──────────┐  ┌──────────┐  ┌──────────┐         │
       │  Crawl   │  │ Detect   │  │ Classify │         │
       │ (Playwright)│ (Patterns)│  │  (Groq)  │         │
       └──────────┘  └──────────┘  └──────────┘         │
              │             │             │              │
              ▼             ▼             ▼              │
       ┌─────────────────────────────────────────┐       │
       │            Gap Analyzer                 │       │
       │    (Rule Engine → Obligations)          │       │
       └─────────────────────────────────────────┘       │
                            │                            │
                            ▼                            │
                   ┌─────────────────┐                    │
                   │ Report Generator│                    │
                   │ (Score + HTML)  │                    │
                   └────────┬────────┘                    │
                            │                            │
                            ▼                            │
                   ┌─────────────────┐                    │
                   │   R2 Storage    │                    │
                   │  (PDF/HTML)     │                    │
                   └─────────────────┘                    │
                            │                            │
                            ▼                            │
                   ┌─────────────────┐                    │
                   │   Notifier      │                    │
                   │  (Email/Webhook)│                    │
                   └─────────────────┘                    │
```

### Key Architectural Principles

1. **Separation of Concerns**: Frontend, API, and worker layers are independently deployable
2. **Async-First**: All long-running operations use Celery workers with Redis broker
3. **Tenant Isolation**: Multi-tenant data model with organization-level scoping
4. **Fail-Closed Security**: Default-deny authentication, SSRF protection, input validation
5. **Observability**: Structured logging, Sentry error tracking, health endpoints

---

## Technology Stack

### Frontend (Next.js 16)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.9 | App Router, Server Actions, SSG |
| React | 18.3.1 | UI Components, Hooks |
| TypeScript | 5.6.3 | Type Safety |
| Tailwind CSS | 3.4.14 | Styling, Dark Theme |
| Clerk | 7.5.9 | Authentication, JWT, Sessions |
| Zustand | 5.0.1 | Client State |
| TanStack Query | 5.61.0 | Server State, Caching |
| Motion | 12.42.2 | Animations |
| Recharts | 2.13.3 | Data Visualization |
| Sonner | 1.7.0 | Toast Notifications |
| Radix UI | Latest | Accessible Primitives |

### Backend (FastAPI)

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.115.5 | REST API, WebSocket |
| Pydantic | 2.10.3 | Validation, Schemas |
| SQLAlchemy | 2.0.36 | ORM, Async Sessions |
| Alembic | 1.14.0 | Database Migrations |
| Celery | 5.4.0 | Distributed Task Queue |
| Redis | 5.2.1 | Cache, Broker, Pub/Sub |
| PostgreSQL | 16 | Primary Database |
| Playwright | 1.49.0 | Headless Browser Crawling |
| Groq | 0.12.0 | LLM Risk Classification |
| Sentry SDK | 2.19.2 | Error Tracking |
| SlowAPI | 0.1.9 | Rate Limiting |

### Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| Container Runtime | Docker | Containerization |
| Orchestration | Docker Compose (local), Render (prod) | Service Management |
| CI/CD | GitHub Actions | Automated Testing & Deployment |
| Frontend Hosting | Vercel | Edge Deployment |
| Backend Hosting | Render | Managed Services |
| Database | Supabase/PostgreSQL | Managed PostgreSQL |
| Cache/Queue | Upstash/Redis | Managed Redis |
| Object Storage | Cloudflare R2 | Report Storage |

---

## Component Architecture

### Backend Module Structure

```
backend/app/
├── api/
│   └── v1/
│       └── endpoints/
│           ├── auth.py          # Clerk auth, org management, billing
│           ├── websites.py      # Website CRUD, scan triggers
│           ├── scans.py         # Scan status, results, progress
│           ├── ai_systems.py    # AI system details, overrides
│           └── gaps.py          # Gap listing, filtering
├── core/
│   ├── config.py                # Settings (Pydantic Settings)
│   ├── auth.py                  # JWT verification, RBAC
│   ├── redis_client.py          # Redis connection, rate limiter
│   ├── plans.py                 # Plan configurations, limits
│   └── url_safety.py            # SSRF protection
├── db/
│   └── session.py               # SQLAlchemy async session
├── models/
│   └── models.py                # SQLAlchemy ORM models
├── schemas/
│   └── schemas.py               # Pydantic request/response models
├── services/
│   ├── clerk_users.py           # Clerk user sync
│   └── (business logic)
├── tasks/
│   ├── celery_app.py            # Celery configuration
│   ├── scan_workflow.py         # Pipeline orchestrator
│   ├── crawler.py               # Playwright crawling
│   ├── detector.py              # Pattern-based AI detection
│   ├── classifier.py            # Groq LLM classification
│   ├── gap_analyzer.py          # Rule-based gap mapping
│   ├── report_generator.py      # Score calculation, HTML report
│   ├── notifier.py              # Email/webhook notifications
│   └── scheduled.py             # Periodic tasks (beat)
└── utils/
    └── async_helpers.py         # Sync/async bridge
```

### Frontend Module Structure

```
frontend/
├── app/
│   ├── (auth)/                  # Sign-in, sign-up (Clerk)
│   ├── (dashboard)/
│   │   ├── layout.tsx           # Dashboard shell + sidebar
│   │   ├── dashboard/
│   │   │   ├── page.tsx         # Main dashboard
│   │   │   ├── websites/
│   │   │   ├── scans/
│   │   │   ├── reports/
│   │   │   └── settings/
│   ├── demo-ai-target/          # Deterministic test page
│   ├── pricing/                 # Pricing page
│   ├── docs/                    # Documentation
│   ├── security/                # Security page
│   └── sample-report/           # Sample report viewer
├── components/
│   ├── dashboard/               # Dashboard-specific components
│   ├── landing/                 # Landing page components
│   ├── scan/                    # Scan progress, results
│   └── ui/                      # Reusable UI primitives (premium.tsx)
├── lib/
│   └── api.ts                   # Typed Axios client + types
├── types/                       # TypeScript definitions
└── middleware.ts                # Clerk route protection
```

---

## Data Flow & Pipeline

### Scan Pipeline (Celery Task Chain)

```
run_scan_workflow(scan_id, url, max_pages)
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 1: CRAWL (crawler.py)                                 │
│ • Playwright headless Chromium                              │
│ • SSRF-safe URL routing (assert_url_is_safe)               │
│ • Extracts: HTML, scripts, network requests, selectors     │
│ • Screenshots (base64 JPEG, 40% quality)                   │
│ • Confidence scoring: high/medium/low                      │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 2: DETECT (detector.py)                               │
│ • 50+ signatures across 5 categories:                      │
│   - Chatbots (Intercom, Drift, Zendesk, Tawk, Crisp, etc.) │
│   - AI Content Generation (DALL-E, Midjourney, Stable)     │
│   - High-Risk (Biometrics, Emotion, Credit, HR, Social)    │
│   - Recommendation Engines                                  │
│   - Generic AI (chatbots, resume builders, generative)     │
│ • Evidence types: script, network, HTML, DOM selector      │
│ • Confidence scoring: 0.3–0.9 based on evidence strength   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 3: CLASSIFY (classifier.py)                           │
│ • Groq LLM (llama-3.3-70b-versatile) with structured output│
│ • System prompt: EU AI Act expert                          │
│ • Tiers: Prohibited, High, Limited, Minimal                │
│ • Art.6(3) exception evaluation                            │
│ • Fallback: rule-based classification when LLM fails       │
│ • Persists AI systems to database                          │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 4: GAP ANALYSIS (gap_analyzer.py)                     │
│ • Rule engine maps risk tiers → obligations                │
│   - Prohibited: Art.5 immediate cessation                  │
│   - High: Art.9,10,12,13,14, Annex IV (7 gaps)             │
│   - Limited: Art.50.1, 50.4 (2 gaps)                       │
│   - All: Art.4 AI literacy                                 │
│ • Fine exposure estimates per tier                         │
│ • Persists gaps linked to AI systems                       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 5: REPORT (report_generator.py)                       │
│ • Compliance score: 100 - Σ(severity_weight × count)       │
│ • Quality caps: crawl_confidence (med:85, low:70)          │
│ • Weak evidence cap: 85                                     │
│ • Jinja2 HTML template with autoescape                     │
│ • Upload to Cloudflare R2 (optional)                       │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│ STAGE 6: NOTIFY (notifier.py)                               │
│ • Resend email (optional)                                   │
│ • Webhook delivery (optional)                              │
│ • Updates website last_scan, compliance_score              │
└─────────────────────────────────────────────────────────────┘
```

### Real-Time Progress Streaming

```
Backend (Redis Pub/Sub)          Frontend (WebSocket)
─────────────────────            ────────────────────
         │                            │
         ▼                            │
   publish_event()                   │
   channel: "scan:{scan_id}"         │
   payload: {event, data}            │
         │                            │
         │         WebSocket          │
         │◄──────────────────────────│
         │         /ws/scans/{id}    │
         │                            │
         │         Subscribe to      │
         │         Redis channel     │
         │                            │
         │         Forward messages  │
         │──────────────────────────►│
         │                            │
         ▼                            ▼
   Scan complete              Update UI
   Close connection           (reactive)
```

---

## Database Schema

### Core Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `organizations` | Multi-tenant root | id, name, slug, plan, subscription_*, razorpay_* |
| `users` | Clerk-synced users | id, clerk_id, email, org_id, role |
| `websites` | Monitored targets | id, org_id, url, compliance_score, overall_risk_tier |
| `scans` | Scan executions | id, website_id, status, stage, progress, results (JSONB) |
| `ai_systems` | Detected AI systems | id, website_id, scan_id, name, type, risk_category, evidence |
| `gaps` | Compliance gaps | id, ai_system_id, scan_id, obligation_code, severity, status |
| `documents` | Generated docs | id, org_id, ai_system_id, type, content_markdown, pdf_url |
| `api_keys` | Programmatic access | id, org_id, key_hash, permissions |
| `webhooks` | Event notifications | id, org_id, url, events, secret |
| `audit_logs` | Activity trail | id, org_id, user_id, action, resource_*, details |

### Key Design Decisions

1. **UUID Primary Keys**: All entities use string UUIDs for distributed ID generation
2. **JSONB for Flexibility**: Scan results, evidence, settings stored as JSONB
3. **Cascading Deletes**: Website → Scans → AI Systems/Gaps cascade
4. **Soft Deletes**: Organizations have `deleted_at` for data retention
5. **Indexes**: Strategic indexes on org_id, status, risk_category, created_at
6. **Constraints**: Check constraints on score ranges, severity enums, status enums

---

## API Design

### REST Endpoints (Prefix: `/api/v1`)

| Resource | Endpoints |
|----------|-----------|
| **Auth** | `POST /auth/sync-user`, `GET /auth/me` |
| **Organizations** | `GET /orgs/me`, `PATCH /orgs/me` |
| **Billing** | `GET /billing/usage`, `POST /billing/order`, `POST /billing/verify-payment` |
| **Websites** | `GET /websites`, `POST /websites`, `GET /websites/{id}`, `DELETE /websites/{id}` |
| **Scans** | `POST /websites/{id}/scan`, `GET /websites/{id}/scans`, `GET /scans/{id}`, `GET /scans/{id}/gaps` |
| **AI Systems** | `GET /scans/{id}/ai-systems`, `GET /ai-systems/{id}`, `PATCH /ai-systems/{id}` |
| **Gaps** | `GET /scans/{id}/gaps`, `GET /gaps/{id}`, `PATCH /gaps/{id}` |

### Response Patterns

```typescript
// Success
{ "data": {...} }  // or array for lists

// Error (FastAPI HTTPException)
{ "detail": "Error message" }

// Pagination (when applicable)
{ "items": [...], "total": 100, "page": 1, "page_size": 20 }
```

### WebSocket

```
GET /ws/scans/{scan_id}
Subprotocols: "reguscan", "clerk.{token}"

Events:
- scan.started     → { status: "running", url: "..." }
- scan.progress    → { stage: "crawling", percent_complete: 10 }
- scan.completed   → { status: "completed", compliance_score: 85 }
- scan.failed      → { error: "...", retryable: true }
```

---

## Authentication & Authorization

### Clerk Integration

- **JWT Verification**: RS256 via JWKS endpoint (`app/core/auth.py`)
- **Multi-Tenancy**: Users belong to organizations via `org_id`
- **Roles**: `owner`, `admin`, `compliance-manager`, `member`, `viewer`
- **Fail-Closed**: Production requires all Clerk settings configured
- **Token Injection**: Frontend `TokenInjector` provides Clerk token to Axios

### Authorization Matrix

| Action | Owner | Admin | Compliance | Member | Viewer |
|--------|-------|-------|------------|--------|--------|
| Manage org settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage billing | ✅ | ✅ | ❌ | ❌ | ❌ |
| Add/remove websites | ✅ | ✅ | ✅ | ❌ | ❌ |
| Trigger scans | ✅ | ✅ | ✅ | ✅ | ❌ |
| View reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| Override AI classification | ✅ | ✅ | ✅ | ❌ | ❌ |
| Resolve gaps | ✅ | ✅ | ✅ | ✅ | ❌ |
| Manage webhooks/API keys | ✅ | ✅ | ❌ | ❌ | ❌ |

### WebSocket Access Control

```
WebSocket connection → Extract token (Bearer or clerk.* subprotocol)
    │
    ▼
Verify JWT → Get user + org_id
    │
    ▼
Query Scan → Join Website → Check Website.org_id == user.org_id
    │
    ├── Match → Allow connection
    └── No match → Close (1008 Policy Violation)
```

---

## Task Queue & Async Processing

### Celery Configuration (`app/tasks/celery_app.py`)

```python
celery_app = Celery(
    "reguscan",
    broker=settings.CELERY_BROKER_URL,      # redis://redis:6379/1
    backend=settings.CELERY_RESULT_BACKEND, # redis://redis:6379/2
)

# Queues
- workflow    # scan_workflow (orchestrator)
- crawl       # Playwright crawling
- detect      # Pattern detection
- llm         # Groq classification
- report      # Report generation, R2 upload
- notify      # Email, webhooks
- scheduled   # Periodic tasks (beat)
```

### Worker Deployment

```yaml
# docker-compose.yml
worker:
  command: celery -A app.tasks.celery_app.celery_app worker
    --loglevel=info
    --queues=workflow,crawl,detect,llm,report,notify
    --concurrency=2
beat:
  command: celery -A app.tasks.celery_app.celery_app beat
    --loglevel=info
    --schedule=/tmp/celerybeat-schedule
flower:
  command: celery -A app.tasks.celery_app.celery_app flower --port=5555
```

### Task Retry Policy

- `scan_workflow`: max_retries=1, countdown=60s
- Individual tasks: no auto-retry (idempotent via scan_id)
- Dead letter: Failed scans marked `status=failed`, manual retry via UI

---

## Real-Time Communication

### Redis Pub/Sub Channels

| Channel | Publisher | Subscribers | Payload |
|---------|-----------|-------------|---------|
| `scan:{scan_id}` | `scan_workflow` (via `_emit`) | WebSocket connections | `{event, data}` |

### Message Format

```json
{
  "event": "scan.progress",
  "data": {
    "scan_id": "uuid",
    "stage": "classifying",
    "percent_complete": 50
  }
}
```

### Frontend WebSocket Lifecycle

1. Mount scan page → `useEffect` initiates connection
2. Get Clerk token → Connect to `/ws/scans/{id}` with subprotocols
3. Subscribe to Redis channel `scan:{scan_id}`
4. Forward Redis messages → Update React state
5. On completion/failure → Invalidate queries, close WebSocket
6. Fallback: 3s polling if WebSocket fails

---

## Security Architecture

### Implemented Safeguards

| Layer | Protection |
|-------|------------|
| **Network** | SSRF protection blocks localhost, private IPs, metadata endpoints, DNS rebinding |
| **Auth** | Clerk JWT verification (issuer, JWKS, audience, authorized parties, expiry) |
| **AuthZ** | Tenant-isolated WebSocket access, RBAC on mutations |
| **Input** | Pydantic validation on all endpoints, URL safety checks |
| **Output** | Jinja2 autoescape for HTML reports, CSP headers |
| **Rate Limit** | SlowAPI per-IP limits (configurable) |
| **Secrets** | `.env.example` placeholders only, no real secrets in repo |
| **Webhooks** | Svix signature verification for Clerk, Razorpay HMAC |
| **Scans** | Backend-enforced quota checks before Celery dispatch |

### SSRF Protection (`app/core/url_safety.py`)

```python
BLOCKED_PATTERNS = [
    "localhost", "127.0.0.1", "::1", "0.0.0.0",
    "169.254.169.254",  # AWS metadata
    "metadata.google.internal",  # GCP metadata
    "10.", "172.16.", "192.168.",  # Private ranges
    ".internal", ".local", ".consul"  # Internal TLDs
]

def assert_url_is_safe(url: str) -> str:
    # Validates scheme, host, port against blocklist
    # Follows redirects with same validation
    # Raises UnsafeUrlError if blocked
```

### Rate Limiting

```python
# app/core/redis_client.py
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"],
    storage_uri=settings.REDIS_URL,
)
```

---

## Deployment Architecture

### Local Development (Docker Compose)

```
Services (7):
├── api          → FastAPI + Uvicorn (port 8000)
├── worker       → Celery worker (2 concurrency)
├── beat         → Celery beat scheduler
├── flower       → Celery monitoring (port 5555)
├── frontend     → Next.js dev server (port 3000)
├── db           → PostgreSQL 16 (port 5432)
└── redis        → Redis 7 (port 6379)
```

### Production (Render + Vercel)

```
┌────────────────────────────────────────────────────────────┐
│                      RENDER (Backend)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Web     │  │ Worker   │  │  Beat    │  │  Redis   │   │
│  │ Service  │  │ Service  │  │ Service  │  │ (Upstash)│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │           │           │            │               │
│       └───────────┼───────────┼────────────┘               │
│                   ▼           ▼                            │
│            ┌──────────┐  ┌──────────┐                      │
│            │PostgreSQL│  │  S3/R2   │                      │
│            │(Supabase)│  │(Cloudflare)                    │
│            └──────────┘  └──────────┘                      │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│                      VERCEL (Frontend)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Edge Network │  │  Next.js 16  │  │  Clerk Auth  │     │
│  │  (Global)    │  │  (Serverless)│  │  (Managed)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline (`.github/workflows/ci.yml`)

```yaml
Jobs:
  1. backend:    lint (ruff) → format → typecheck (mypy) → test (pytest, 60% coverage)
  2. frontend:   lint → typecheck (tsc)
  3. deploy-backend:  (on main) → Trigger Render deploy via API
  4. deploy-frontend: (on main) → Vercel CLI deploy
```

### Environment Variables

| Category | Variables |
|----------|-----------|
| **Core** | `SECRET_KEY`, `APP_ENV`, `DEBUG`, `API_V1_PREFIX` |
| **Database** | `DATABASE_URL`, `DATABASE_URL_SYNC`, `DB_POOL_SIZE` |
| **Redis** | `REDIS_URL`, `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND` |
| **Auth (Clerk)** | `CLERK_SECRET_KEY`, `CLERK_JWKS_URL`, `CLERK_ISSUER`, `CLERK_JWT_AUDIENCE`, `CLERK_AUTHORIZED_PARTIES` |
| **LLM** | `GROQ_API_KEY`, `GROQ_MODEL_FAST`, `GROQ_MODEL_SMART` |
| **Embeddings** | `GEMINI_API_KEY`, `GEMINI_EMBEDDING_MODEL` |
| **Vector DB** | `PINECONE_API_KEY`, `PINECONE_INDEX` |
| **Storage** | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` |
| **Email** | `RESEND_API_KEY`, `FROM_EMAIL`, `RESEND_TEST_RECIPIENT` |
| **Payments** | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RAZORPAY_PLAN_*` |
| **Monitoring** | `SENTRY_DSN` |

---

## Monitoring & Observability

### Health Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Service status, version, environment |
| `GET /docs` | OpenAPI/Swagger (dev only) |

### Metrics & Logging

- **Structured Logging**: `structlog` with JSON output
- **Error Tracking**: Sentry SDK (FastAPI integration)
- **Task Monitoring**: Flower (Celery) at `/flower`
- **Database**: Query logging via SQLAlchemy echo (dev)

### Key Metrics to Monitor

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| API error rate | Sentry / logs | > 1% |
| Scan failure rate | Scan status | > 10% |
| Queue depth | Redis/Celery | > 100 pending |
| Worker utilization | Flower | < 50% (under-provisioned) |
| DB connection pool | SQLAlchemy | > 80% used |
| WebSocket failures | Frontend logs | > 5% |

---

## Scaling Considerations

### Horizontal Scaling

| Component | Scaling Strategy |
|-----------|-----------------|
| **API (FastAPI)** | Stateless, add Render instances behind load balancer |
| **Workers (Celery)** | Increase `--concurrency`, add worker services per queue |
| **Beat** | Single instance (leader election via Redis) |
| **Frontend (Vercel)** | Automatic edge scaling |
| **Database** | Read replicas, connection pooling (PgBouncer) |
| **Redis** | Upstash auto-scales, consider Cluster mode |

### Performance Optimizations

1. **Crawl Parallelism**: Playwright contexts can be pooled (currently sequential)
2. **Batch LLM Calls**: Classify multiple systems per Groq request
3. **Database Indexes**: Add composite indexes for common query patterns
4. **Caching**: Cache plan configs, website metadata in Redis
5. **CDN**: Static assets via Vercel Edge, reports via R2/CDN

### Bottleneck Analysis

| Stage | Current Limit | Scaling Path |
|-------|---------------|--------------|
| Crawl | 1 page at a time, 20 pages max | Browser pool, distributed crawling |
| Classify | 1 LLM call per system | Batch prompts, async Groq |
| Report | Sequential Jinja2 render | Template compilation, streaming |
| DB | Single writer | Read replicas, partitioning |

---

## Appendix: Key Files Reference

### Backend Entry Points
- `backend/app/main.py` — FastAPI app, WebSocket, routers
- `backend/app/tasks/celery_app.py` — Celery configuration
- `backend/app/tasks/scan_workflow.py` — Pipeline orchestrator

### Core Pipeline Tasks
- `backend/app/tasks/crawler.py` — Playwright crawling
- `backend/app/tasks/detector.py` — Pattern detection
- `backend/app/tasks/classifier.py` — Groq LLM classification
- `backend/app/tasks/gap_analyzer.py` — Rule engine
- `backend/app/tasks/report_generator.py` — Scoring + HTML
- `backend/app/tasks/notifier.py` — Notifications

### Configuration & Security
- `backend/app/core/config.py` — Settings management
- `backend/app/core/auth.py` — JWT verification, RBAC
- `backend/app/core/plans.py` — Plan limits, billing logic
- `backend/app/core/url_safety.py` — SSRF protection

### Data Layer
- `backend/app/models/models.py` — SQLAlchemy models
- `backend/app/db/session.py` — Async session factory
- `backend/alembic/versions/` — Migrations

### Frontend Core
- `frontend/app/(dashboard)/layout.tsx` — Dashboard shell
- `frontend/app/(dashboard)/dashboard/page.tsx` — Main dashboard
- `frontend/app/(dashboard)/dashboard/scans/[scanId]/page.tsx` — Scan detail
- `frontend/lib/api.ts` — Typed API client

### Infrastructure
- `docker-compose.yml` — Local stack
- `render.yaml` — Render Blueprint
- `.github/workflows/ci.yml` — CI/CD
- `backend/Dockerfile.dev`, `frontend/Dockerfile.dev` — Container images

---

*This document reflects the architecture as of commit `50f817f` (2026-07-23). Update when significant architectural changes occur.*