# TEAM-EXPERIENCE-029 — Firebase Transfer Status

Status: `BACKEND PERSISTENCE FOUNDATION EVIDENCED — 029 REMAINS BACKEND-GATED`

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
- Gate 3B — valid Firebase ID token reaches Firestore persistence: **PASS**.
- Gate 3C — exact nested Firestore document independently verified with stored values: **PASS**.
- Gate 3D — identical authenticated repeat call returns HTTP 200 with existing-value results: **PASS**.

The complete evidence record is `docs/CHECKPOINT_TEAM-BACKEND-001_GATE3_2026-09-03.md`.

## Gate 3 disposition

`GATE_3_FIREBASE_PERSISTENCE`: **PASS**

The evidence-backed slice now establishes:

`Firebase ID token → verified Firebase UID → Firestore hierarchy → independent persistence confirmation → repeat-call idempotency`

This is sufficient to advance backend reasoning beyond the initial persistence blocker, but it is not equivalent to TEAM-BACKEND-001 completion.

## Remaining backend prerequisites before 029 production implementation release

- local Firebase Emulator/rules execution verification;
- skill-wiring and project-type/field/task/provider/runtime resolution verification as applicable to the backend contract;
- server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation;
- verified PayPal webhook authenticity, idempotency, replay protection, and durable commerce events/entitlements;
- durable task/event/job runtime behavior and provider/runtime invocation behind policy and authorization contracts;
- security, failure, timeout, cancellation, and recovery verification;
- final Product Law → Masterplan → contract/skill → implementation → evidence → endorsement traceability reconciliation;
- TEAM-BACKEND-001 completion endorsement.

## Canonical sequence

`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

TEAM-EXPERIENCE-029 is now eligible for continued planning/reconciliation against an evidence-backed Firebase persistence foundation, but its production frontend implementation gate remains closed until the remaining explicit backend prerequisites are satisfied.
