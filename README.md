# ReguScan — EU AI Act Compliance Scanner

Automated platform that crawls websites, detects AI systems, classifies their EU AI Act risk tier, and generates actionable compliance gap reports with copy-paste remediation code.

**Fines reach €35M or 7% of global annual turnover. High-risk obligations enforceable August 2, 2026.**

---

## Architecture

```
Frontend (Next.js + Vercel free)
     │
     ▼
Backend API (FastAPI + Render free)
     │
     ├── PostgreSQL (Supabase free — 500MB)
     ├── Redis     (Upstash free — 10K req/day)
     └── Celery Workers
              │
              ├── Playwright crawler
              ├── Pattern detector
              ├── Groq LLM classifier (free — 14,400 req/day)
              ├── Gap rule engine
              └── Report generator → Cloudflare R2
```

---

## Free Tier Stack

| Service | Provider | Free Limit |
|---------|----------|------------|
| PostgreSQL | [Supabase](https://supabase.com) | 500MB, unlimited requests |
| Redis / Queue | [Upstash](https://upstash.com) | 10,000 req/day |
| LLM (classification) | [Groq](https://console.groq.com) | 14,400 req/day on Llama 3.3 70B |
| Auth | [Clerk](https://clerk.com) | 10,000 MAU |
| Email | [Resend](https://resend.com) | 3,000 emails/month |
| Object Storage | [Cloudflare R2](https://cloudflare.com) | 10 GB, 1M req/month |
| Vector DB | [Pinecone](https://pinecone.io) | 1 index, 100K vectors |
| Backend hosting | [Render](https://render.com) | Free (sleeps after 15min) |
| Frontend hosting | [Vercel](https://vercel.com) | Free |
| Payments | [Razorpay](https://razorpay.com) | Test checkout/order wiring; paid launch not enabled by default |
| Error tracking | [Sentry](https://sentry.io) | 5,000 errors/month free |

---

## Local Development Setup

### Prerequisites
- Python 3.12+
- Node.js 20+
- Docker + Docker Compose

### 1. Clone and configure

```bash
git clone https://github.com/yourusername/reguscan.git
cd reguscan

# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env — fill in your API keys (see "Getting API Keys" below)

# Frontend environment
cp frontend/.env.local.example frontend/.env.local
# Edit frontend/.env.local — add your Clerk keys
```

### 2. Start local stack

```bash
docker compose up --build
```

This starts:
- **API** at http://localhost:8000 (FastAPI + auto-reload)
- **Worker** — Celery scan worker
- **Beat** — Celery scheduler
- **Flower** at http://localhost:5555 (Celery monitoring)
- **Frontend** at http://localhost:3000 (Next.js)
- **PostgreSQL** at localhost:5432
- **Redis** at localhost:6379

### 3. Run database migrations

```bash
docker compose exec api alembic upgrade head
```

### 4. Install Playwright browsers (first time only)

```bash
docker compose exec worker playwright install chromium --with-deps
```

### 5. Open the app

http://localhost:3000 — sign up with Clerk, add a website, trigger a scan.

---

## Getting Free API Keys

### Groq (LLM — required for classification)
1. Sign up at https://console.groq.com
2. Create an API key
3. Set `GROQ_API_KEY=gsk_...` in `.env`
4. **Free**: 14,400 requests/day on Llama 3.3 70B

### Clerk (Auth — required)
1. Sign up at https://clerk.com
2. Create a new application
3. Go to API Keys — copy **Publishable Key** and **Secret Key**
4. Add a webhook endpoint: `https://your-api.onrender.com/api/v1/auth/webhook`
5. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
6. Copy the **Webhook Secret**
7. Set in `.env`: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_WEBHOOK_SECRET`
8. Set in `frontend/.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

### Supabase (PostgreSQL — required)
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection string
4. Copy the **Session mode** connection string (port 5432)
5. Set `DATABASE_URL=postgresql+asyncpg://...` and `DATABASE_URL_SYNC=postgresql://...`

### Upstash (Redis — required)
1. Sign up at https://console.upstash.com
2. Create a Redis database (select **Global** for free tier)
3. Copy the **Redis URL** (starts with `rediss://`)
4. Set `REDIS_URL`, `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND` — use `/0`, `/1`, `/2` as db suffix

### Resend (Email — optional but recommended)
1. Sign up at https://resend.com
2. Create an API key
3. Verify your sending domain (or use `@resend.dev` for testing)
4. Set `RESEND_API_KEY=re_...` and `FROM_EMAIL=noreply@yourdomain.com`

### Cloudflare R2 (Reports storage — optional)
1. Sign up at https://cloudflare.com
2. Go to R2 → Create bucket named `reguscan`
3. Create an R2 API token with Read+Write permissions
4. Enable public access on the bucket (for report URLs)
5. Set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`

### Razorpay (Payments - optional for free tier testing)
1. Sign up at https://razorpay.com
2. Use test mode keys from the Razorpay dashboard.
3. Set `RAZORPAY_CHECKOUT_ENABLED=false` until test checkout and webhook delivery pass in staging.
4. Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`.
5. Set plan placeholders: `RAZORPAY_PLAN_STARTER` and `RAZORPAY_PLAN_PRO`.
6. Add a webhook endpoint pointing to your deployed API `/api/v1/billing/webhook`.
7. The free plan does not require payment. Paid checkout uses Razorpay Orders as a gated test flow; recurring paid subscriptions are not public-launch ready until Razorpay Subscription creation, checkout, webhook delivery, duplicate event handling, cancellations, and scan-limit upgrades are verified end to end.

### Plan Limits

The backend is the source of truth for plan enforcement:

| Plan | Websites | Scan limit | Gap visibility | Billing status |
|------|----------|------------|----------------|----------------|
| Free | 1 | 1 scan total | Top 3 gaps | Always available |
| Starter | 3 | 10 scans/month | Full gap analysis | Razorpay checkout disabled unless explicitly enabled |
| Pro | 10 | 100 scans/month | Full gap analysis | Razorpay checkout disabled unless explicitly enabled |
| Enterprise | Unlimited | Unlimited | Full gap analysis | Contact/coming soon |

PDF reports and API access are marked coming soon until those features are implemented.

### Pinecone (Vector DB — optional)
1. Sign up at https://app.pinecone.io
2. Create an index named `regulations` with dimension `768` and metric `cosine`
3. Copy your API key
4. Set `PINECONE_API_KEY` and `PINECONE_INDEX=regulations`

---

## Deployment

### Backend → Render (free)

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to https://render.com → New → Blueprint
# 3. Connect your GitHub repo
# 4. Render detects render.yaml automatically
# 5. Set all environment variables in Render dashboard
# 6. Deploy

# 7. Run migrations after first deploy:
# Render → Service → Shell → alembic upgrade head
```

### Frontend → Vercel (free)

```bash
# Install Vercel CLI
npm i -g vercel

cd frontend
vercel --prod

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# CLERK_SECRET_KEY
# NEXT_PUBLIC_API_URL=https://reguscan-api.onrender.com
# NEXT_PUBLIC_WS_URL=wss://reguscan-api.onrender.com
```

### CI/CD (GitHub Actions)

Add these secrets to your GitHub repo (Settings → Secrets):

```
RENDER_API_KEY          # Render account API key
RENDER_SERVICE_ID       # Your Render service ID
VERCEL_TOKEN            # Vercel personal access token
VERCEL_ORG_ID           # Vercel org/user ID
VERCEL_PROJECT_ID       # Vercel project ID
```

CI runs on every push:
- Lint (ruff), type-check (mypy), tests (pytest)
- Auto-deploy to Render + Vercel on merge to `main`

---

## Development Commands

```bash
# Backend (inside container or venv)
cd backend

# Run migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "add_field"

# Run tests
pytest tests/ -v --cov=app

# Lint
ruff check app/
ruff format app/

# Type check
mypy app/

# Start worker manually
celery -A app.tasks.celery_app.celery_app worker --loglevel=info -Q crawl,detect,llm,report,notify

# Frontend
cd frontend
npm run dev        # dev server
npm run build      # production build
npm run type-check # TypeScript check
```

---

## Project Structure

```
reguscan/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/     # FastAPI route handlers
│   │   │   ├── auth.py           # Clerk webhooks + billing
│   │   │   ├── websites.py       # Website CRUD
│   │   │   ├── scans.py          # Scan trigger + status
│   │   │   └── ai_systems.py     # AI systems + gaps
│   │   ├── core/
│   │   │   ├── config.py         # Settings (pydantic-settings)
│   │   │   ├── auth.py           # JWT verification
│   │   │   └── redis_client.py   # Redis + rate limiter
│   │   ├── db/session.py         # SQLAlchemy async engine
│   │   ├── models/models.py      # ORM models (all tables)
│   │   ├── schemas/schemas.py    # Pydantic request/response schemas
│   │   ├── tasks/
│   │   │   ├── celery_app.py     # Celery config
│   │   │   ├── scan_workflow.py  # Main pipeline orchestrator
│   │   │   ├── crawler.py        # Playwright web crawler
│   │   │   ├── detector.py       # AI pattern matching
│   │   │   ├── classifier.py     # Groq LLM classification
│   │   │   ├── gap_analyzer.py   # Rule-based gap engine
│   │   │   ├── report_generator.py # HTML report + R2 upload
│   │   │   └── notifier.py       # Resend email notifications
│   │   └── main.py               # FastAPI app + WebSocket
│   ├── alembic/                  # DB migrations
│   ├── tests/                    # pytest tests
│   ├── Dockerfile                # Production
│   ├── Dockerfile.dev            # Development
│   └── pyproject.toml
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout (Clerk + providers)
│   │   └── (dashboard)/
│   │       ├── dashboard/page.tsx          # Overview
│   │       ├── dashboard/websites/         # Website list + detail
│   │       ├── dashboard/scans/[scanId]/   # Scan results + live progress
│   │       ├── dashboard/reports/          # Reports list
│   │       └── dashboard/settings/         # Billing + profile
│   ├── components/
│   │   ├── dashboard/Sidebar.tsx
│   │   ├── dashboard/TokenInjector.tsx
│   │   └── providers.tsx
│   ├── lib/api.ts                # Typed API client (axios)
│   └── middleware.ts             # Clerk auth protection
├── docker-compose.yml
├── render.yaml                   # Render deployment config
└── .github/workflows/ci.yml     # GitHub Actions CI/CD
```

---

## Scan Pipeline

```
URL submitted
    │
    ▼ Playwright crawl (max 20 pages)
    │  • Intercept network requests
    │  • Extract scripts, DOM selectors, HTML
    │  • Take screenshots
    │
    ▼ Pattern detector
    │  • 30+ AI system signatures (chatbots, content gen, biometric, etc.)
    │  • Script URL matching, network request matching, DOM selector matching
    │
    ▼ Groq LLM classifier (Llama 3.3 70B)
    │  • Per-system EU AI Act classification
    │  • Prohibited / High / Limited / Minimal
    │  • Confidence score + applicable articles + reasoning
    │
    ▼ Gap rule engine
    │  • Maps risk tier → required obligations
    │  • Critical/High/Medium/Low severity
    │  • Copy-paste remediation code snippets
    │
    ▼ Report compiler
    │  • Compliance score (0–100)
    │  • Fine exposure estimates
    │  • HTML report → Cloudflare R2
    │
    ▼ Notifications
       • Email via Resend
       • WebSocket real-time progress
```

---

## EU AI Act Risk Tiers

| Tier | Articles | Fine | Examples |
|------|----------|------|---------|
| **Prohibited** | Art. 5 | €35M / 7% | Social scoring, emotion recognition at work, real-time biometric ID |
| **High-risk** | Annex III | €15M / 3% | HR/recruitment AI, credit scoring, biometrics, fraud detection |
| **Limited-risk** | Art. 50 | €15M / 3% | Chatbots (must disclose), AI-generated content (must label) |
| **Minimal** | Art. 4 | €7.5M / 1.5% | AI literacy training only |

---

## Known Limitations (Free Tier)

- **Render free tier**: API sleeps after 15 minutes of inactivity → ~30s cold start
- **Upstash 10K req/day**: Supports ~100–200 scans/day
- **Groq 14,400 req/day**: Each scan uses ~3–10 LLM calls (1 per AI system detected)
- **Supabase 500MB**: Supports ~50,000+ scans before hitting limit
- **No Playwright in Render free**: The free tier has limited memory; reduce `max_pages` in crawler if OOM

---

## Contributing

1. Fork and clone
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes, run `ruff check` and `pytest`
4. Open PR against `develop`

---

## License

MIT — see LICENSE file.

---

*Not legal advice. EU AI Act (Regulation 2024/1689). ReguScan helps identify compliance gaps; consult a qualified legal professional for formal compliance advice.*
