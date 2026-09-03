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
- Deployed version after project-identity enforcement: `2`
- Status: `ACTIVE`
- `verify_jwt`: `false`
- Deployment SHA-256: `159e37d8b33decfabfc302d6f2dea0cf56991ec93ed32290252b0432a886aeae`

This proves deployment of the identity-enforced source. It does **not** prove that the Supabase secret contains the correct TeamAi service account or that Firestore persistence succeeds.

## Evidence boundary
This slice now has source + deployment evidence, but it is **not yet live persistence or E2E completion evidence**.

Still required before marking the persistence/runtime gates complete:
1. verify the configured `FIREBASE_SERVICE_ACCOUNT_JSON` belongs to `team-ai-official` without exposing its secret value;
2. exercise the deployed function using a real `team-ai-official` Firebase Auth ID token;
3. verify the resulting Firestore hierarchy in `team-ai-official`;
4. verify repeat-call idempotency and unauthorized-token rejection;
5. run the relevant project audits/tests and record the exact evidence;
6. only then advance to server-owned PayPal UID correlation and durable commerce mutation.

## PayPal disposition
PayPal remains downstream of durable domain persistence. The existing `paypal-webhook` function remains the verification boundary only. No PayPal product/plan or live transaction is activated by this slice.
