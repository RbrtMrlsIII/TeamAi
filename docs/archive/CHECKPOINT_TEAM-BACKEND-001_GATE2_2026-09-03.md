# TeamAi Checkpoint — TEAM-BACKEND-001 / Gate 2

**Date:** 2026-09-03
**Branch:** `team-backend-001/foundation`
**Checkpoint purpose:** preserve the exact backend-first development state before continuing Firebase token acquisition and authenticated Firestore persistence.

## Repository checkpoint

At checkpoint creation, the implementation branch contains the trusted Firebase persistence slice and the Firebase ID-token authentication normalization fix. The branch head is recorded by the repository history; this document does not replace Git as the source of code truth.

## Canonical authority snapshot

- Firebase Auth = identity authority.
- Firestore `(default)` = TeamAi durable domain/application state.
- Supabase Edge Functions = trusted server runtime and PayPal webhook receiver.
- PayPal = external payment-provider authority.
- GitHub = engineering/source authority.
- Firebase Hosting = current web delivery surface.
- Vercel = future optional browser/deployment surface.
- Supabase Postgres = platform infrastructure only, not TeamAi domain state.
- Retired PostgreSQL implementation traces are not an active recovery pathway.
- TeamAi Firebase project identity is frozen as `team-ai-official`.

## Current backend implementation

Function:
`supabase/functions/teamai-domain-bootstrap/index.ts`

Behavior:

`Firebase ID token → verified Firebase UID → Account → Workplace → Project → Team/Solo → Web AI Seat`

The request body does not establish Firebase ownership. The UID is derived only after Firebase ID-token verification. The trusted service-account credential remains a server-side Supabase Edge secret.

## Live function state

Canonical Supabase project host:
`https://srpgzzretfyqdsfclnuo.supabase.co`

Canonical function endpoint:
`https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1/teamai-domain-bootstrap`

Current live function: `teamai-domain-bootstrap`, version 6.

## Executable verification

### Gate 1 — invalid Firebase ID token
**PASS**

The live function rejected an invalid Firebase ID token with HTTP 401 and the normalized error `invalid_firebase_id_token`.

### Gate 2 — missing Authorization header
**PASS**

The live function rejected a request without Firebase authorization with HTTP 401 and `missing_firebase_id_token`.

### Gate 3 — valid Firebase ID token → Firestore persistence
**BLOCKED**

The test-user Email/Password token acquisition attempt returned `invalid login credentials`. Therefore no valid Firebase ID token was available for the authenticated persistence probe. This checkpoint does not interpret that result as a Firestore failure and does not alter the backend implementation to work around a test-account credential problem.

## Next gate

Obtain a valid Firebase ID token for a test user in the authoritative `team-ai-official` Firebase project without exposing credentials or tokens in chat. Then run the authenticated bootstrap request and independently verify the resulting Firestore documents.

## Completion discipline

This checkpoint does not claim TEAM-BACKEND-001 completion and does not unlock TEAM-EXPERIENCE-029. Documentation, deployment, isolated HTTP responses, or unit tests are insufficient for end-to-end completion.

Required traceability remains:

`Product Law → Masterplan item → contract/skill → implementation → verification evidence → completion/endorsement`

## Token and secret handling

No Firebase ID token, password, Web API key value, service-account JSON, private key, or PayPal secret is recorded in this checkpoint or repository.
