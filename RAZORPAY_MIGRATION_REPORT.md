# Razorpay Migration Report

Date: 2026-07-06

## Summary

ReguScan has been moved from Stripe-specific billing code to a Razorpay-ready, test-only payment structure while preserving the free MVP flow. Paid plan activation is not production-ready yet: plans are only upgraded after verified Razorpay webhook events, and live checkout still needs real Razorpay test/live validation.

## Stripe References Found

- Backend dependency: `stripe==11.3.0` in `backend/pyproject.toml`.
- Backend config: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and Stripe price settings.
- Backend routes: checkout session creation, billing portal session creation, and Stripe webhook handling in `backend/app/api/v1/endpoints/auth.py`.
- Database fields: `stripe_customer_id` and `stripe_subscription_id` on `Organization`.
- Initial migration: Stripe columns and `idx_orgs_stripe_customer`.
- Frontend API/UI: dashboard settings called `/api/v1/billing/checkout` and `/api/v1/billing/portal`.
- Docs/config: README, GUIDE, render config, env example, design notes, and task notes referenced Stripe.

## Removed Or Replaced

- Removed Stripe SDK import and Stripe route logic.
- Removed the Stripe Python dependency from `backend/pyproject.toml`.
- Replaced payment env config with Razorpay placeholders:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `RAZORPAY_WEBHOOK_SECRET`
  - `RAZORPAY_PLAN_STARTER`
  - `RAZORPAY_PLAN_PRO`
  - `RAZORPAY_CURRENCY`
- Replaced frontend billing calls with Razorpay order creation and payment signature verification.
- Disabled the legacy `/api/v1/billing/checkout` and `/api/v1/billing/portal` routes with safe `410` responses.
- Updated current docs and setup notes to describe Razorpay instead of Stripe.

## Safely Deprecated

- `stripe_customer_id` and `stripe_subscription_id` remain in the ORM and initial migration for non-destructive data safety.
- No destructive migration was added to rename or drop old Stripe columns.

## Razorpay Files Changed

- `backend/app/api/v1/endpoints/auth.py`
  - Adds `/api/v1/billing/order`.
  - Adds `/api/v1/billing/verify-payment`.
  - Replaces Stripe webhook handling with Razorpay webhook signature verification.
  - Updates org plan only after verified `payment.captured` or subscription webhook events.
- `backend/app/core/config.py`
  - Adds Razorpay settings.
- `backend/app/models/models.py`
  - Adds Razorpay customer/order/payment/subscription/plan fields.
- `backend/app/schemas/schemas.py`
  - Adds Razorpay request/response schemas.
- `frontend/lib/api.ts`
  - Adds Razorpay order and payment verification client methods.
- `frontend/app/(dashboard)/dashboard/settings/page.tsx`
  - Loads Razorpay Checkout script and verifies checkout signatures server-side.
  - Does not mark a plan active from frontend success.

## Database Changes

Added migration:

- `backend/alembic/versions/002_add_razorpay_billing_fields.py`

New organization columns:

- `razorpay_customer_id`
- `razorpay_order_id`
- `razorpay_payment_id`
- `razorpay_subscription_id`
- `razorpay_plan_id`

New indexes:

- `idx_orgs_razorpay_customer`
- `idx_orgs_razorpay_order`
- `idx_orgs_razorpay_subscription`

## Security Model

- Razorpay order creation requires authenticated users.
- Razorpay key secret is never exposed to the frontend.
- Frontend payment success is not trusted as an upgrade signal.
- `/billing/verify-payment` validates `order_id|payment_id` HMAC signatures and stores proof, but leaves the plan pending webhook confirmation.
- `/billing/webhook` reads the raw body and requires a valid `X-Razorpay-Signature`.
- Missing webhook secret fails closed.
- Invalid webhook signatures return `400`.
- Org plan changes only after verified Razorpay webhook events.
- No card or payment instrument details are stored.

## Scan Limits

Existing scan and website limits remain connected to `org.plan`:

- Free: 1 website, 1 scan/month.
- Starter: 3 websites, 10 scans/month.
- Pro: 10 websites, 100 scans/month.
- Enterprise: unlimited.

Scan dispatch still enforces monthly quota before Celery dispatch.

## Documentation Updated

- `README.md`
- `GUIDE.md`
- `backend/.env.example`
- `render.yaml`
- `tasks/todo.md`
- `design.md`
- `PORTFOLIO_NOTES.md`
- `PROJECT_IMPROVEMENT_REPORT.md`
- `SECURITY_FIX_REPORT.md`
- public frontend copy in pricing/docs/home pages

## External References Checked

- Razorpay Standard Checkout integration steps: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/
- Razorpay webhook validation docs: https://razorpay.com/docs/webhooks/validate-test/

## Verification Results

Passed:

- `backend/.venv/Scripts/python.exe -m pytest tests -q`
  - Result: `37 passed, 6 warnings`.
- `npm.cmd run type-check`
  - Result: passed.
- `npm.cmd run build`
  - Result: passed.
- `backend/.venv/Scripts/alembic.exe heads`
  - Result: `002_add_razorpay_billing_fields (head)`.
- Secret sweep:
  - No tracked `rzp_live_`, `sk_live`, `whsec_`, or Stripe env variables found in active backend/frontend/docs config.
- Stripe reference sweep:
  - Remaining references are limited to deprecated legacy DB column names in the ORM and initial migration.

Docker status:

- `docker compose ps`
  - Result: Docker Compose ran, but no ReguScan services were running.
- `docker compose exec -T api pytest tests -q`
  - Result: failed because service `api` is not running.
- `docker compose exec -T frontend npm run type-check`
  - Result: failed because service `frontend` is not running.
- `docker compose exec -T frontend npm run build`
  - Result: failed because service `frontend` is not running.

Not completed in this environment:

- Live Docker health check.
- Authenticated browser dashboard check.
- Real Razorpay hosted checkout test transaction.
- Real Razorpay webhook delivery from Dashboard.
- End-to-end free scan flow through running API, PostgreSQL, Redis, and Celery.

## Remaining Payment Limitations

- Paid launch is still test-only.
- Real Razorpay keys, dashboard webhook setup, and test transaction validation are required before launch.
- Subscription lifecycle handling is basic and should be hardened for idempotency using `x-razorpay-event-id`.
- No customer-facing Razorpay portal is enabled.
- Legacy Stripe columns remain and should only be removed in a later data-backed cleanup migration.

## Paid Launch Readiness

Not production-ready. The code is Razorpay-ready for controlled testing, but live paid subscriptions should not be launched until verified Razorpay checkout, webhook delivery, idempotency, plan upgrades, cancellations, and scan limits pass against a running staging stack.
