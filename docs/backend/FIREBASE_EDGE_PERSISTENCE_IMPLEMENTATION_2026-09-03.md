# Firebase Edge Persistence Implementation Slice — 2026-09-03

## Purpose
Advance TEAM-BACKEND-001 in chronological order: durable Firestore domain persistence before PayPal commerce completion.

## Implemented source slice
A new Supabase Edge Function, `teamai-domain-bootstrap`, is prepared to establish the minimum durable domain chain:

`Firebase UID → Account → Workplace → Project → Team/Solo → Web AI Seat`

The function:
- verifies a Firebase Authentication ID token against the Firebase project audience/issuer;
- derives the UID only from the verified token, never from request JSON;
- obtains a Google OAuth access token from a trusted Firebase service-account credential held in Supabase Edge secrets;
- writes to Firestore `(default)` through the Firestore REST API using IAM authorization;
- uses `currentDocument.exists=false` for create-if-absent semantics so repeated bootstrap calls do not overwrite existing documents;
- keeps TeamAi domain state in Firebase Firestore, not Supabase Postgres.

## Security boundary
The function must run with Supabase platform JWT verification disabled because it uses Firebase ID-token verification as its application authentication boundary. This is intentional and must not be changed to trust an arbitrary client UID.

Required secret:
- `FIREBASE_SERVICE_ACCOUNT_JSON` — Firebase/Google service-account JSON, stored only as a Supabase Edge Function secret.

No Firebase credential is recorded in GitHub, chat, logs, or this document.

## Evidence boundary
This is **source implementation evidence only**. It is not yet live deployment or E2E completion evidence.

Still required before marking the persistence/runtime gates complete:
1. configure `FIREBASE_SERVICE_ACCOUNT_JSON` securely in Supabase;
2. deploy `teamai-domain-bootstrap` with custom Firebase authentication and `verify_jwt=false`;
3. exercise it using a real Firebase Auth ID token;
4. verify the resulting Firestore hierarchy in `team-ai-official`;
5. verify repeat-call idempotency and unauthorized-token rejection;
6. run the relevant project audits/tests and record the exact evidence;
7. only then advance to server-owned PayPal UID correlation and durable commerce mutation.

## PayPal disposition
PayPal remains downstream of durable domain persistence. The existing `paypal-webhook` function remains the verification boundary only. No PayPal product/plan or live transaction is activated by this slice.
