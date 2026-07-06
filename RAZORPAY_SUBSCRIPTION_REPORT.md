# Razorpay Subscription Report

Date: 2026-07-07

## Executive Summary

ReguScan is now safe to deploy as a Free-plan product with backend-enforced limits. Paid Starter/Pro checkout is intentionally gated behind `RAZORPAY_CHECKOUT_ENABLED=false` by default because the current implementation uses Razorpay Orders as a controlled test flow, not a fully verified recurring Razorpay Subscriptions launch.

Paid subscriptions are not public-launch ready yet. The UI shows paid plans as coming soon unless the backend explicitly reports Razorpay checkout is enabled and configured.

## Architecture Chosen

- Backend source of truth: `backend/app/core/plans.py`.
- Current payment model: Razorpay Orders test flow, disabled by default.
- Preferred future paid model: Razorpay Subscriptions using `POST /v1/subscriptions`.
- Upgrade rule: frontend success callbacks never upgrade a plan. Organization plans change only after verified backend webhook events.

Razorpay webhook verification follows the official raw-body HMAC guidance: validate `X-Razorpay-Signature` over the raw request body with `RAZORPAY_WEBHOOK_SECRET`. Duplicate event handling uses the official `x-razorpay-event-id` header.

References:

- https://razorpay.com/docs/webhooks/validate-test/
- https://razorpay.com/docs/api/payments/subscriptions/create-subscription/
- https://razorpay.com/docs/api/orders/create/

## Files Changed

- `backend/app/core/plans.py`
- `backend/app/core/config.py`
- `backend/app/models/models.py`
- `backend/app/schemas/schemas.py`
- `backend/app/api/v1/endpoints/auth.py`
- `backend/app/api/v1/endpoints/websites.py`
- `backend/app/api/v1/endpoints/scans.py`
- `backend/app/api/v1/endpoints/ai_systems.py`
- `backend/alembic/versions/003_add_billing_plan_metadata.py`
- `backend/tests/test_api.py`
- `backend/.env.example`
- `frontend/lib/api.ts`
- `frontend/app/(dashboard)/dashboard/settings/page.tsx`
- `frontend/app/(dashboard)/dashboard/scans/[scanId]/page.tsx`
- `README.md`
- `GUIDE.md`
- `render.yaml`
- `RAZORPAY_MIGRATION_REPORT.md`
- `frontend/tsconfig.json` was updated by `next build`; it was already dirty before this work.

## Database Changes

Added non-destructive Alembic migration:

- `003_add_billing_plan_metadata`

New organization columns:

- `plan_updated_at`
- `razorpay_last_event_id`
- `razorpay_last_event_at`

New index:

- `idx_orgs_razorpay_last_event`

Legacy Stripe fields remain as deprecated columns for migration safety.

## Plan Limits Implemented

Backend plan source of truth:

| Plan | Websites | Scan limit | Gap visibility | Notes |
|------|----------|------------|----------------|-------|
| Free | 1 | 1 scan total | Top 3 gaps | Active without billing |
| Starter | 3 | 10 scans/month | Full gaps | Paid checkout gated |
| Pro | 10 | 100 scans/month | Full gaps | Paid checkout gated |
| Enterprise | Unlimited | Unlimited | Full gaps | Contact/coming soon |

Server-side enforcement:

- Website creation checks backend plan limits.
- Scan trigger checks limits before creating a scan task or dispatching Celery.
- Gap list API shapes Free responses to top 3 gaps plus `locked_count`.
- Usage API calculates counts from the database and returns current plan, subscription status, scan scope, remaining scans, website limits, and billing availability.

PDF reports and API access are marked coming soon because they are not implemented as paid features.

## Razorpay Flow Implemented

Safe current behavior:

1. Authenticated user requests Starter or Pro.
2. Backend rejects invalid plans and Enterprise checkout.
3. Backend refuses checkout unless `RAZORPAY_CHECKOUT_ENABLED=true` and Razorpay secrets/webhook secret are configured.
4. If enabled, backend creates a Razorpay Order and returns only public checkout data.
5. Frontend opens Razorpay Checkout.
6. Frontend payment callback calls backend verification.
7. Backend verifies `order_id|payment_id` signature and records payment proof only.
8. Plan remains unchanged until a verified webhook event arrives.
9. Verified `payment.captured` or subscription activation/charge events can activate Starter/Pro.
10. Cancellation/completed/halted subscription events move the organization back to Free.

## Webhook Security

Implemented:

- Reads raw request body.
- Validates `X-Razorpay-Signature`.
- Fails closed when `RAZORPAY_WEBHOOK_SECRET` is missing.
- Rejects invalid signatures with `400`.
- Processes expected payment/subscription events only.
- Uses `x-razorpay-event-id` to prevent immediate duplicate event replay for an organization.
- Does not log or expose payment secrets.
- Does not store card details.

Remaining hardening before paid launch:

- Add a dedicated billing event table with a unique provider event id.
- Verify real Razorpay test dashboard delivery against staging.
- Implement true Razorpay Subscriptions creation instead of Orders for monthly paid plans.

## Env Vars

Added/updated placeholders only:

- `RAZORPAY_CHECKOUT_ENABLED=false`
- `RAZORPAY_KEY_ID=<razorpay-key-id>`
- `RAZORPAY_KEY_SECRET=<razorpay-key-secret>`
- `RAZORPAY_WEBHOOK_SECRET=<razorpay-webhook-secret>`
- `RAZORPAY_PLAN_STARTER=<razorpay-starter-plan-id>`
- `RAZORPAY_PLAN_PRO=<razorpay-pro-plan-id>`
- `RAZORPAY_CURRENCY=INR`

No real Razorpay keys were added.

## Tests Added Or Updated

Added coverage for:

- Free backend plan defaults.
- Free top-3 gap response shaping.
- Invalid Razorpay plan rejection.
- Checkout disabled by default.
- Payment callback alone does not upgrade the plan.
- Verified webhook activates a paid plan.
- Duplicate webhook event id is idempotent.

Existing coverage retained:

- Billing usage requires auth.
- Invalid webhook signatures reject.
- Missing webhook secret fails closed.
- Legacy checkout route is disabled.
- Clerk JWT issuer/audience/signature security tests.

## Verification Results

Passed:

- `.\.venv\Scripts\python.exe -m pytest tests -q`
  - Result: `43 passed, 6 warnings`
- `npm.cmd run type-check`
  - Result: passed
- `npm.cmd run build`
  - Result: passed
- `.\.venv\Scripts\alembic.exe heads`
  - Result: `003_add_billing_plan_metadata (head)`
- `docker-compose ps`
  - Result: Docker reachable with elevated access; no services running.

Container commands requested but blocked by stopped services:

- `docker-compose exec -T api pytest tests -q`
  - Result: `service "api" is not running`
- `docker-compose exec -T frontend npm run type-check`
  - Result: `service "frontend" is not running`
- `docker-compose exec -T frontend npm run build`
  - Result: `service "frontend" is not running`

## Remaining Limitations

- Paid subscriptions are not production-ready.
- Razorpay Orders are not a substitute for recurring subscription billing.
- Real test-mode checkout and webhook delivery were not performed because no running stack or real Razorpay test credentials were available.
- Enterprise remains contact/coming soon.
- PDF reports and API access remain coming soon.
- A dedicated billing event ledger should be added before paid launch.

## Public Demo Recommendation

Safe public demo posture:

- Show Free as active/current.
- Show Starter and Pro as coming soon unless `RAZORPAY_CHECKOUT_ENABLED=true` in a verified staging or production environment.
- Keep Enterprise as contact/coming soon.
- Enforce Free limits from the backend.

Do not claim paid subscriptions work publicly until Razorpay Subscriptions, checkout, webhook delivery, idempotency, cancellations, and plan-limit upgrades are verified end to end.
