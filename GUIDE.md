# ReguScan Local Setup Guide

ReguScan is a local MVP for scanning websites for public-facing AI features, classifying EU AI Act risk, finding compliance gaps, and generating an explainable compliance report.

This guide is written for Windows PowerShell and Docker Desktop.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Clerk
- Backend: FastAPI, SQLAlchemy, Alembic, Pydantic
- Workers: Celery, Redis, Playwright
- Database: PostgreSQL
- AI services: Groq, Gemini, Pinecone
- Email: Resend
- Monitoring UI: Flower

Cloudflare R2, Razorpay, and Sentry are optional and not required for local MVP testing.

## Prerequisites

Install these first:

- Docker Desktop
- Git
- A code editor
- Valid local environment files

Start Docker Desktop before running Docker commands.

## Project Folder

```powershell
cd "C:\Users\MD Abdul Rahman\Downloads\reguscan\reguscan"
```

## Environment Files

Required local files:

```text
backend\.env
frontend\.env.local
```

Do not commit real `.env` files or private API keys to GitHub.

## Required Backend Environment Variables

Set these in `backend\.env`:

```text
SECRET_KEY=
CLERK_SECRET_KEY=
CLERK_JWKS_URL=
CLERK_WEBHOOK_SECRET=
GROQ_API_KEY=
GEMINI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX=regulations
RESEND_API_KEY=
RESEND_FROM_EMAIL=
DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/reguscan
DATABASE_URL_SYNC=postgresql://postgres:postgres@db:5432/reguscan
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/1
CELERY_RESULT_BACKEND=redis://redis:6379/2
APP_ENV=local
DEBUG=true
```

For one-off local email tests only, use a temporary container environment variable instead of saving a personal email address in code:

```powershell
docker compose exec -e RESEND_TEST_RECIPIENT="your-test-email@example.com" -T worker python -c "print('temporary env is available')"
```

## Required Frontend Environment Variables

Set these in `frontend\.env.local`:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Daily Start

```powershell
cd "C:\Users\MD Abdul Rahman\Downloads\reguscan\reguscan"
docker compose start
docker compose ps
```

If this is the first run, or containers do not exist yet, build and create them:

```powershell
docker compose up -d --build
```

Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/health
- API docs: http://localhost:8000/docs
- Flower: http://localhost:5555

## Daily Stop

```powershell
docker compose stop
```

Use `docker compose down` only for a clean reset or when you intentionally want to remove containers.

## Rebuild After Dependency Changes

```powershell
cd "C:\Users\MD Abdul Rahman\Downloads\reguscan\reguscan"
docker compose build
docker compose up -d
docker compose ps
```

If containers still use stale dependencies:

```powershell
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Database Migrations

Run migrations:

```powershell
docker compose exec api alembic upgrade head
```

Check current migration:

```powershell
docker compose exec api alembic current
```

Create a migration only after changing SQLAlchemy models:

```powershell
docker compose exec api alembic revision --autogenerate -m "describe_change"
```

## Check Backend Health

```powershell
docker compose exec api python -c "import httpx; print(httpx.get('http://localhost:8000/health').text)"
```

Or open:

```text
http://localhost:8000/health
```

## View Logs

API:

```powershell
docker compose logs -f api
```

Celery worker:

```powershell
docker compose logs -f worker
```

Frontend:

```powershell
docker compose logs -f frontend
```

PostgreSQL:

```powershell
docker compose logs -f db
```

Redis:

```powershell
docker compose logs -f redis
```

## Run Tests

Backend:

```powershell
docker compose exec -T api pytest tests -q
```

Frontend type-check:

```powershell
docker compose exec -T frontend npm run type-check
```

Frontend production build:

```powershell
docker compose exec -T frontend npm run build
```

## Create a User and Sign In

1. Open http://localhost:3000
2. Click `Start free`
3. Complete Clerk sign-up
4. Confirm the dashboard loads
5. Sign out and sign back in to verify login/logout

If dashboard API calls return `403`, check:

```powershell
docker compose logs -f api
```

Then verify the Clerk keys in `backend\.env` and `frontend\.env.local`.

## Run the First Scan

1. Open http://localhost:3000/dashboard
2. Click `Add website`
3. Add a public HTTPS website
4. Open the website details page
5. Start a scan
6. Wait for the scan result page to reach `completed`

The result page should show:

- Pages checked
- Scripts reviewed
- AI signals
- Detected AI systems
- Page URL where each system was found
- Detection source and signal
- Risk category
- Confidence score
- Related obligations
- Compliance gaps and recommended fixes

## Stable Demo Target

For a reliable portfolio demo, use a stable public page that contains obvious AI signals, then verify the result page shows AI systems, evidence cards, gaps, score, and report output.

This repo includes a deterministic demo target source and route at:

```text
docs\demo-ai-target.html
frontend\app\demo-ai-target\page.tsx
```

Host the HTML on a public static URL, or deploy the frontend and scan:

```text
https://<your-frontend-domain>/demo-ai-target
```

Do not weaken SSRF protections to scan `localhost`, private IPs, or Docker-internal hostnames.

## Verify Celery Is Processing Scans

In one terminal:

```powershell
docker compose logs -f worker
```

Start a scan from the frontend. The worker logs should show stages like:

```text
crawl
detect
classify
analyze
report
notify
```

You can also open Flower:

```text
http://localhost:5555
```

## Test Email Notifications

Use a temporary recipient variable. Do not commit test email addresses.

```powershell
docker compose exec -e RESEND_TEST_RECIPIENT="your-test-email@example.com" -T worker python -c "from app.tasks.notifier import notify_scan_complete; print(notify_scan_complete('PASTE_SCAN_ID_HERE'))"
```

If this fails, check:

```powershell
docker compose logs -f worker
```

Also verify:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- Resend sender domain verification

## Troubleshooting

If frontend cannot call the backend:

```powershell
docker compose ps
docker compose logs -f frontend
docker compose logs -f api
```

Check `NEXT_PUBLIC_API_URL=http://localhost:8000`.

If scans stay pending:

```powershell
docker compose logs -f worker
docker compose logs -f redis
```

Confirm the worker listens to all queues:

```text
workflow,crawl,detect,llm,report,notify
```

If a public demo site changes or becomes unreliable, use the stable demo target HTML above and scan the public URL where you hosted it.

If Playwright crawling fails:

```powershell
docker compose logs -f worker
```

Rebuild the backend image if browser dependencies changed:

```powershell
docker compose build --no-cache api worker
docker compose up -d
```

If database tables are missing:

```powershell
docker compose exec api alembic upgrade head
```

If authentication fails:

```powershell
docker compose logs -f api
```

Check Clerk publishable key, secret key, JWKS URL, and webhook secret.

## Clean Docker Build Cache Safely

This can delete cached image layers and may make the next build slower:

```powershell
docker builder prune -a
```

To remove stopped containers and unused networks:

```powershell
docker system prune
```

Do not remove volumes unless you want to delete local database data.

## What Not To Commit

Never commit:

- `.env`
- `.env.local`
- API keys
- Clerk secrets
- Resend keys
- Personal email test recipients
- Database dumps with real user data
- Screenshots showing secrets or private customer data

## Optional Services Not Required For Local MVP

These can stay unset for local MVP testing:

- Cloudflare R2: only needed for persistent hosted report files
- Razorpay: only needed for test checkout/order wiring and real paid billing
- Sentry: only needed for production error monitoring
