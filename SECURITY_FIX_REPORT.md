# ReguScan Security Fix Report

Date: 2026-06-26

## Summary

Fixed all confirmed deploy-blocking findings from the manual security audit:

- Clerk JWT verification no longer trusts the unverified token issuer.
- Production JWT verification now fails closed unless Clerk issuer and audience are configured.
- JWT signature, issuer, audience, authorized party (`azp`), expiration, and not-before claims are verified before local user provisioning.
- Scan WebSocket progress now requires a valid Clerk token and checks that the authenticated user owns the scan's organization.
- Tracked environment examples no longer contain real-looking Clerk secrets.
- Next.js and Clerk were upgraded to remove the previously reported critical/high advisories.
- A PostCSS override was added so `npm audit --omit=dev` reports zero vulnerabilities.

## Fixed Findings

### 1. Clerk JWT Verification Bypass

Before:

- `backend/app/core/auth.py` read `iss` from unverified JWT claims.
- The backend fetched JWKS from that untrusted issuer.
- Audience verification was disabled.
- A token that verified against attacker-controlled JWKS could reach local user provisioning.

After:

- JWKS is fetched only from configured `CLERK_JWKS_URL`.
- `CLERK_ISSUER` is used as the trusted issuer.
- `CLERK_JWT_AUDIENCE` is enforced when configured and required in production.
- `CLERK_AUTHORIZED_PARTIES` enforces Clerk's recommended `azp` origin check.
- Pending Clerk session status (`sts=pending`) is rejected.
- Local user provisioning happens only after token verification succeeds.

Regression tests added:

- Valid configured Clerk-style JWT succeeds.
- Attacker-issued JWT with a valid attacker signature is rejected.
- JWT with the wrong audience is rejected.

### 2. Unauthenticated Scan WebSocket

Before:

- `/ws/scans/{scan_id}` allowed any client that knew a scan id to subscribe to Redis progress events.

After:

- The frontend passes a Clerk token when opening the WebSocket.
- The backend verifies the token and checks that the scan belongs to the authenticated user's organization before subscribing.
- Unauthorized WebSocket attempts are closed with policy violation code `1008`.

### 3. Tracked Secret Exposure

Before:

- `frontend/.env.local.example` contained a real-looking Clerk secret.

After:

- Tracked examples use placeholders only.
- `backend/.env.example` documents the new Clerk issuer, audience, and authorized-party settings.

Keys that must be rotated because they were present in ignored local `.env` files:

- Clerk secret key.
- Clerk webhook secret.
- Groq API key.
- Any Stripe webhook or secret key that has been replaced with a real value locally.

### 4. Vulnerable Frontend Dependencies

Before:

- `next@14.2.21` had critical/high advisories, including middleware authorization bypass.
- `@clerk/nextjs@5.x` pulled high-severity Clerk advisories.

After:

- `next` upgraded to `16.2.9`.
- `@clerk/nextjs` upgraded to `7.5.9`.
- ESLint tooling upgraded for Next 16 compatibility.
- `postcss` pinned and overridden to `8.5.15`.
- `npm audit --omit=dev` reports zero vulnerabilities.

Breaking changes handled:

- Clerk middleware auth helper is now awaited.
- Removed deprecated `UserButton afterSignOutUrl` prop.
- Replaced build-time Google Fonts fetch with a system font stack.
- Replaced deprecated Next image `domains` with `remotePatterns`.
- Accepted Next's required `tsconfig.json` JSX setting for Next 16.

## Validation

Commands run:

- `backend\.venv\Scripts\python.exe -m pytest tests\test_api.py`
  - Result: `24 passed`.
- `npm.cmd run type-check`
  - Result: passed.
- `npm.cmd run build`
  - Result: passed on Next.js `16.2.9`.
- `npm.cmd audit --omit=dev --json`
  - Result: `0` vulnerabilities.
- `git grep` tracked-file secret sweep for Clerk/Groq/Stripe/Gemini-style secrets.
  - Result: no real tracked application secrets found. Local/test Postgres defaults remain in docs/test/dev config.

## Remaining Notes

- Next.js still warns that the `middleware` file convention is deprecated in favor of `proxy`. The build passes and this is not a security finding, but it should be migrated in a future framework cleanup.
- Ignored local `.env` files still contain real secrets. They are not tracked, but the exposed values should be rotated before deployment.
- Production deployment must set `CLERK_ISSUER`, `CLERK_JWT_AUDIENCE`, `CLERK_AUTHORIZED_PARTIES`, and `CLERK_JWKS_URL`; the API intentionally fails closed without issuer/audience in production.
