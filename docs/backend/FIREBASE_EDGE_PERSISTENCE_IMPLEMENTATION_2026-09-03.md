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
- classifies Firestore `409 ALREADY_EXISTS` and equivalent create-if-absent precondition responses as the idempotent `exists` result;
- keeps TeamAi domain state in Firebase Firestore, not Supabase Postgres.

## Frozen project identity
The authoritative TeamAi Firebase project is `team-ai-official`. Similarly named Firebase projects, including `homefinder-official`, are distinct and must not be substituted or interpreted as aliases. See `docs/backend/FIREBASE_PROJECT_IDENTITY.md`.

Project identity reconciliation is a prerequisite to Firebase runtime diagnosis. The public Web SDK configuration identifies the intended project but is not a privileged credential. The Admin/service-account JSON remains secret and is never recorded in GitHub, chat, logs, or this document.

## Security boundary
The function runs with Supabase platform JWT verification disabled because it uses Firebase ID-token verification as its application authentication boundary. This is intentional and must not be changed to trust an arbitrary client UID.

Required secret:
- `FIREBASE_SERVICE_ACCOUNT_JSON` — Firebase/Google service-account JSON, stored only as a Supabase Edge Function secret.

## Deployment evidence
- Supabase project: `srpgzzretfyqdsfclnuo`
- Edge Function: `teamai-domain-bootstrap`
- Function ID: `e476040e-4ad6-423a-8c28-597877c4d85e`
- Version 5: `ACTIVE`
- `verify_jwt`: `false`
- Version 5 deployment SHA-256: `3267d9e5167d3c292a977b0f1ecbc11913f2ae4c9014b28d2f89ce71491d3400`
- Source commit containing the idempotency fix: `789d0356c29c5cf16f0ca5ed897b69695d66779a`

Version 5 is the deployed implementation containing explicit handling for the observed Firestore `409 ALREADY_EXISTS` response.

## Live authenticated execution evidence
Using a real Firebase Authentication ID token issued by the canonical `team-ai-official` project and the probe IDs `e2e-probe-003`, `e2e-project-003`, `e2e-team-003`, and `e2e-seat-003`:

- First authenticated POST: **HTTP 200**, response `ok: true`; this demonstrated successful trusted execution and Firestore creation path.
- Immediate repeat of the identical authenticated POST: **HTTP 200**, response `ok: true`; the previous implementation had returned HTTP 500 because Firestore correctly returned `409 ALREADY_EXISTS`, and version 5 now maps that condition to the idempotent `exists` result.

This is direct live execution evidence for authentication, service-account IAM, Firestore write access, and repeat-call idempotency of the bootstrap path.

## Evidence boundary
The following gates are now evidenced:
1. correct Firebase project identity is enforced in source;
2. a real Firebase ID token authenticates successfully;
3. the trusted service account has sufficient Firestore IAM to reach the database;
4. the Firestore write path succeeds in live execution;
5. a repeated identical bootstrap request remains successful and does not fail on `ALREADY_EXISTS`.

Still required before marking the full persistence/runtime gates complete:
1. independently verify the five resulting Firestore documents in `team-ai-official` without relying only on the function response;
2. exercise missing/invalid Firebase ID-token rejection;
3. run the relevant project audits/tests and record the exact evidence;
4. reconcile Product Law → Masterplan → contract/skill → implementation → evidence → endorsement;
5. only then advance to server-owned PayPal UID correlation and durable commerce mutation.

## PayPal disposition
PayPal remains downstream of durable domain persistence. The existing `paypal-webhook` function remains the verification boundary only. No PayPal product/plan or live transaction is activated by this slice.
