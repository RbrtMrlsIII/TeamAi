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
**BLOCKED**

The attempted Email/Password token acquisition for a Firebase Auth test user returned `invalid login credentials`. Consequently a valid Firebase ID token was not available for the authenticated persistence probe in this checkpoint.

No Gate 3 Firestore-write success is claimed here. This checkpoint treats the blocker as a test-account/token-acquisition issue, not as evidence of Firestore failure.

## Evidence boundary

The current checkpoint therefore establishes executable evidence for the live authentication rejection boundary, but not full authenticated persistence completion.

Still required:
1. obtain a valid Firebase ID token from the authoritative `team-ai-official` project without exposing credentials or tokens;
2. execute the authenticated bootstrap probe;
3. independently verify the expected Firestore documents under the verified Firebase UID;
4. verify repeat-call idempotency for the current deployment;
5. reconcile the complete Product Law → Masterplan → contract/skill → implementation → evidence → endorsement chain.

## PayPal disposition
PayPal remains downstream of durable domain persistence. No PayPal product/plan or live transaction is activated by this slice.
