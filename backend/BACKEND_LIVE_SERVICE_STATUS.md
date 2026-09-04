# TEAM-BACKEND-001 — Live Service Status

**Date:** 2026-09-04  
**Phase:** TEAM-BACKEND-001  
**Status:** IN IMPLEMENTATION — GATE 3 PASS; GATE 5B PASS; GATE 5C IMPLEMENTED / AVAILABLE-ENVIRONMENT VERIFIED; LIVE PAYPAL RUNTIME EVIDENCE OUTSTANDING

| Boundary | Source contract | Live evidence | Status |
|---|---|---|---|
| Firebase Auth | UID ownership contract | Live Edge endpoint rejects invalid Firebase tokens with HTTP 401; valid authenticated Gate 3 execution has also been evidenced | PASS |
| Firestore `default` | UID-rooted paths + rules baseline | Authenticated bootstrap persisted the Gate-3 hierarchy; exact nested seat document was independently read; repeat-call idempotency was verified | PASS |
| Supabase Edge Functions | Trusted runtime/webhook boundary | `teamai-domain-bootstrap` is deployed and live; the trusted persistence slice is authenticated and evidenced | PASS |
| PayPal | External event authority | Server-owned correlation contract and Gate-5C implementation are present; final authenticated PayPal transaction/webhook runtime proof remains outstanding | IMPLEMENTED / RUNTIME EVIDENCE OPEN |
| GitHub | Engineering authority | `main` is the current engineering/source authority | PASS |
| Firebase Hosting | TeamAi web delivery | Current Product Law keeps Firebase Hosting as delivery authority | PASS |
| Vercel | Non-authoritative preview/browser-verification only | **TEMPORARY CUTOFF (2026-09-04):** disconnected/rate-limited from TeamAi GitHub repo; not a merge blocker; GitHub Actions + Playwright remain verification path | PARKED / CUTOFF |

## Live endpoint

Canonical Supabase project host:
`https://srpgzzretfyqdsfclnu.supabase.co`

Canonical TeamAi bootstrap function:
`https://srpgzzretfyqdsfclnu.supabase.co/functions/v1/teamai-domain-bootstrap`

The live function verifies Firebase ID tokens for the frozen Firebase project `team-ai-official` and derives the Firebase UID from the verified token. A request-body UID is not an ownership credential.

## Verified Gate 3 evidence

The current Gate 3 checkpoint records executable evidence for:

`Firebase ID token → verified Firebase UID → Firestore TeamAi hierarchy → independent Firestore confirmation → repeat-call idempotency`

Evidence includes invalid-token rejection, missing-authorization rejection, successful authenticated bootstrap, independent nested-seat verification, and repeat-call idempotency.

Source: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE3_2026-09-03.md`.

## Gate 5B / Gate 5C evidence boundary

Gate 5B is PASS for the server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation contract.

Gate 5C implementation and available-environment verification are PASS/CLOSED. The current remaining evidence boundary is live PayPal transaction/webhook runtime validation, including authenticated webhook processing and replay behavior sufficient for final completion endorsement.

The remaining runtime evidence must not be represented as an architecture failure or as a missing Gate-5C source implementation.

## Evidence rule

`Source configuration != deployment != integration != end-to-end completion.`

No live PayPal transaction-success, authenticated business-webhook, or final TEAM-BACKEND-001 completion claim is made until the corresponding executable evidence and completion/endorsement record exist.

Vercel cutoff must not be recorded as a TeamAi architecture or delivery failure.

## Next executable gate

Obtain the remaining live PayPal sandbox transaction/webhook evidence without exposing credentials or tokens in chat, then reconcile the resulting runtime evidence into the Gate-5C checkpoint and final TEAM-BACKEND-001 completion/endorsement packet.
