# CHECKPOINT — TEAM-BACKEND-001 GATE 5B

Date: 2026-09-03
Status: `GATE 5B — SERVER-OWNED PAYPAL CORRELATION CONTRACT IMPLEMENTED; VALIDATION PENDING`

## Purpose
Record the bounded server-owned correlation contract that binds a verified PayPal provider event to an authenticated Firebase UID without trusting browser-supplied ownership.

## Authority boundary
- Firebase Auth owns identity and Firebase UID ownership.
- PayPal remains the external payment-event authority.
- Supabase Edge Functions remain the trusted server boundary for webhook receipt and verification.
- Firestore `(default)` remains the durable TeamAi application/domain system of record.

## Implemented contract
`src/backend/commerce.ts` now defines:

1. `ServerOwnedCommerceIntent` — a pending commerce intent rooted in the server-established Firebase UID and an opaque correlation ID.
2. `createServerOwnedCommerceIntent()` — creates the pending correlation contract from the verified server-side UID.
3. `bindVerifiedPayPalEvent()` — binds a verified PayPal provider event ID to that existing intent and derives the stable idempotency key `paypal:event:{providerEventId}`.
4. `assertServerOwnedCorrelation()` — validates the complete correlation before durable commerce processing.

The browser is not granted authority to invent or replace the Firebase UID used for ownership.

## Test contract added
`tests/backend-foundation.test.mjs` now verifies:
- server-owned intent → PayPal event binding;
- stable provider-event-derived idempotency key;
- rejection of an empty provider event ID.

## Validation boundary
The source contract is implemented and committed. Project-wide build/test execution remains an environment-dependent evidence step; no green test result is claimed here until the repository dependency tree is available and the test command completes successfully.

No live PayPal event has been processed by this contract. No entitlement has been activated. No webhook authenticity claim is inferred from this source change.

## Next gate
**GATE 5C — verified PayPal webhook authenticity + replay/idempotency processing + durable commerce event projection.** PayPal requires webhook message verification before processing; timestamp/replay controls and the registered webhook ID are part of that boundary. citeturn454723search1turn454723search2

## Handover rule
This checkpoint is accompanied by the target-project Gate-5B scoped handover packet. Universal ToolKit does not hand over TeamAi state; TeamAi owns this project checkpoint and packet.
