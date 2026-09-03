# Firebase Edge Persistence Implementation Slice — 2026-09-03

## Purpose
Advance TEAM-BACKEND-001 in chronological order: durable Firestore domain persistence before PayPal commerce completion.

## Implemented source slice
A new Supabase Edge Function, `teamai-domain-bootstrap`, establishes the minimum trusted persistence path for:

`Firebase UID → Account → Workplace → Project → Team/Solo → Web AI Seat`

The function:
- verifies a Firebase Authentication ID token against the canonical TeamAi Firebase project;
- derives the UID only from the verified token, never from request JSON;
- requires the trusted Firebase service-account `project_id` to equal `team-ai-official`;
- obtains a Google OAuth access token from the trusted Firebase service-account credential held in Supabase Edge secrets;
- writes to Firestore `(default)` through the Firestore REST API using IAM authorization;
- targets Firestore explicitly at the canonical `team-ai-official` project rather than inheriting an arbitrary project ID from request data;
- uses `currentDocument.exists=false` for create-if-absent semantics so repeated bootstrap calls do not overwrite existing documents;
- classifies Firestore equivalent create-if-absent conflict responses as the idempotent `exists` result;
- keeps TeamAi domain state in Firebase Firestore, not Supabase Postgres.

## Frozen project identity

The authoritative TeamAi Firebase project is `team-ai-official`. Similarly named Firebase projects, including `homefinder-official`, are distinct and must not be substituted or interpreted as aliases. See `docs/backend/FIREBASE_PROJECT_IDENTITY.md`.

Project identity reconciliation is a prerequisite to Firebase runtime diagnosis. The public Web SDK configuration identifies the intended project but is not a privileged credential. The Admin/service-account JSON remains secret and is never recorded in GitHub, chat, logs, or this document.

## Security boundary

The function runs with Supabase platform JWT verification disabled because it uses Firebase ID-token verification as its application authentication boundary. This is intentional and must not be changed to trust an arbitrary client UID.

Required secret:
- `FIREBASE_SERVICE_ACCOUNT_JSON` — Firebase/Google service-account JSON, stored only as a Supabase Edge Function secret.

## Current deployment evidence

- Supabase project ref: `srpgzzretfyqdsfclnuo`
- Edge Function: `teamai-domain-bootstrap`
- Function ID: `e476040e-4ad6-423a-8c28-597877c4d85e`
- Current live version: `6`
- `verify_jwt`: `false`
- Current live deployment was inspected after the Firebase ID-token error-normalization fix.

## Current live gate evidence

### Gate 1 — invalid Firebase ID token
**PASS**

A live request carrying an invalid Firebase ID token returned HTTP 401 with `invalid_firebase_id_token`.

### Gate 2 — missing Authorization header
**PASS**

A live request without the Firebase Authorization header returned HTTP 401 with `missing_firebase_id_token`.

### Gate 3 — valid Firebase ID token → Firestore persistence
**PASS**

The authenticated persistence slice is now executable and evidence-backed for the current deployment.

#### Gate 3B — authenticated persistence

A valid Firebase ID token for `team-ai-official` reached `teamai-domain-bootstrap`. The function derived the ownership root from the verified Firebase UID and returned HTTP 200 for the `gate3-test-workplace` / `gate3-test-project` / `gate3-test-team` / `gate3-test-seat` test hierarchy.

#### Gate 3C — independent Firestore verification

The exact nested seat document was independently read directly from Firestore `(default)` in `team-ai-official` using Google-authenticated Firestore REST access. The response contained actual stored document values rather than `NOT_FOUND`.

Canonical nested path:

`accounts/{verified Firebase UID}/workplaces/gate3-test-workplace/projects/gate3-test-project/teams/gate3-test-team/seats/gate3-test-seat`

#### Gate 3D — repeat-call idempotency

The same authenticated bootstrap request was executed a second time using the same identifiers. It returned HTTP 200 with existing-value results, demonstrating create-if-absent/idempotent behavior rather than recreating the records.

A detailed checkpoint is recorded in `docs/CHECKPOINT_TEAM-BACKEND-001_GATE3_2026-09-03.md`.

## Evidence boundary

The current evidence establishes:

`Firebase ID token → verified Firebase UID → Firestore TeamAi hierarchy → independent Firestore confirmation → repeat-call idempotency`

Still required for full TEAM-BACKEND-001 completion:
1. local Firebase emulator/rules execution;
2. server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation;
3. verified PayPal webhook authenticity, idempotency, and replay protection;
4. durable commerce events and entitlement projection;
5. provider/runtime invocation behind authorization/task contracts;
6. complete task/event runtime, security, failure, timeout, cancellation, and recovery verification;
7. final Product Law → Masterplan → contract/skill → implementation → evidence → endorsement reconciliation;
8. TEAM-BACKEND-001 completion endorsement.

## PayPal disposition
PayPal remains downstream of durable domain persistence. No PayPal product/plan or live transaction is activated by this slice.
