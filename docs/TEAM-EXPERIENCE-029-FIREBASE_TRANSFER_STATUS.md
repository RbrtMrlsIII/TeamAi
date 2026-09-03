# TEAM-EXPERIENCE-029 — Firebase Transfer Status

Status: `BACKEND FOUNDATION IN PROGRESS — 029 HOLD`

Date: 2026-09-03

## Decision carried into execution

TeamAi uses Firebase as the application-backend authority profile. The previously retired PostgreSQL backend implementation is not a supported active recovery path and is not to be resurrected. Any historical PostgreSQL references are historical evidence only; active repository structure must not provide an easy implementation pathway back to the retired backend.

## Firebase target

- Firebase Authentication: identity/session foundation and Firebase UID ownership.
- Cloud Firestore `(default)`: TeamAi domain/application persistence and durable domain records.
- Firebase Hosting: current web delivery surface.
- Firebase Security Rules: least-privilege client access for the modeled UID-rooted paths.
- Firebase Emulator Suite: validation surface for rules and client-side behavior before broader live mutation testing.
- Supabase Edge Functions: trusted server execution/runtime boundary and PayPal webhook receiver.
- Supabase Postgres: platform infrastructure only, never TeamAi domain state.

## TEAM-BACKEND-001 live foundation

`supabase/functions/teamai-domain-bootstrap/` implements the first trusted persistence slice:

`Firebase ID token → verified Firebase UID → Account → Workplace → Project → Team/Solo → Web AI Seat`

The function verifies Firebase ID tokens for the frozen `team-ai-official` project, derives ownership from the verified token, obtains Firestore authorization through the trusted service-account secret, and writes to Firestore `(default)` using create-if-absent semantics.

## Executable checkpoint

- Gate 1 — invalid Firebase ID token rejected with HTTP 401: **PASS**.
- Gate 2 — missing Authorization header rejected with HTTP 401: **PASS**.
- Gate 3 — valid Firebase ID token reaches Firestore persistence: **BLOCKED**.

The Gate 3 test-user token acquisition attempt returned `invalid login credentials`. No valid Firebase ID token was available for the authenticated persistence probe, so Firestore persistence has not been claimed as live-verified by this checkpoint.

## Explicit non-claims

This checkpoint does not claim full TEAM-BACKEND-001 completion, independent Firestore document verification, repeat-call idempotency for the current live deployment, complete emulator/rules verification, PayPal commerce integration, provider invocation, or TEAM-EXPERIENCE-029 frontend implementation.

## Canonical sequence

`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

029 remains blocked until the backend foundation completion evidence is sufficient under the project's traceability rule.
