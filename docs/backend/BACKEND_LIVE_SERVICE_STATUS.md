# TEAM-BACKEND-001 — Live Service Status

**Date:** 2026-09-03
**Phase:** TEAM-BACKEND-001
**Status:** IN IMPLEMENTATION — GATE 3 BLOCKED ON TEST CREDENTIALS

| Boundary | Source contract | Live evidence | Status |
|---|---|---|---|
| Firebase Auth | UID ownership contract | Correct live Edge endpoint rejects invalid Firebase tokens with HTTP 401 | PARTIAL |
| Firestore `default` | UID-rooted paths + rules baseline | Persistence slice is deployed, but authenticated Gate 3 has not yet reached Firestore because no valid Firebase ID token has been obtained for the probe user | OPEN |
| Supabase Edge Functions | Trusted runtime/webhook boundary | `teamai-domain-bootstrap` is deployed and live; current deployment uses Firebase ID-token verification | PASS |
| PayPal | External event authority | No commerce transaction exercised | OPEN |
| GitHub | Engineering authority | `team-backend-001/foundation` remains the authoritative implementation branch | PASS |
| Vercel | Optional future surface | Not required for current backend phase | DEFERRED |

## Live endpoint

Canonical Supabase project host:
`https://srpgzzretfyqdsfclnuo.supabase.co`

Canonical TeamAi bootstrap function:
`https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1/teamai-domain-bootstrap`

The current live function verifies Firebase ID tokens for the frozen Firebase project `team-ai-official` and derives the Firebase UID from the verified token. A request-body UID is not an ownership credential.

## Gate evidence

**Gate 1 — invalid Firebase ID token:** PASS. The live function returned HTTP 401 with `invalid_firebase_id_token`.

**Gate 2 — missing Authorization header:** PASS. The live function returned HTTP 401 with `missing_firebase_id_token`.

**Gate 3 — valid Firebase ID token → Firestore persistence:** BLOCKED. The local token-acquisition attempt reached Firebase Authentication but returned `invalid login credentials`, so no valid Firebase ID token was available for the authenticated persistence probe. This is a test-account/token acquisition issue, not evidence that Firestore persistence failed.

## Evidence rule
`Source configuration != deployment != integration != end-to-end completion.`

No live Firebase Auth/Firestore or PayPal commerce completion is claimed until executable evidence exists for the corresponding boundary.

## Next executable gate
Obtain a valid Firebase ID token for a test user belonging to the `team-ai-official` Firebase project without exposing credentials or tokens in chat. Then execute the authenticated bootstrap probe and independently verify the resulting Firestore documents.
