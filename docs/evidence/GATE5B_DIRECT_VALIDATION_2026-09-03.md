# Gate 5B — Direct Contract Validation Evidence

Date: 2026-09-03
Status: `PASS — SOURCE CONTRACT VALIDATED`

## Scope
This evidence closes the Gate 5B source-contract validation boundary only. It does not close PayPal live integration, webhook processing, durable commerce persistence, entitlement projection, or full backend completion.

## Validation performed
The committed `src/backend/commerce.ts` contract was copied into a temporary local validation workspace and compiled with TypeScript 5.8.3 using strict NodeNext settings. Behavioral assertions then executed against the compiled module under Node.js 22.16.0.

## Assertions passed
- A server-owned commerce intent is created from a non-empty server-established Firebase UID and correlation ID.
- A verified PayPal provider event binds only to a pending server-owned intent.
- The resulting correlation preserves the server-established Firebase UID.
- The idempotency key is deterministically derived as `paypal:event:{providerEventId}`.
- An empty PayPal provider event ID is rejected.
- Firestore commerce event and entitlement paths remain rooted under the Firebase UID.

Observed validation result:

`GATE5B_DIRECT_TEST=PASS`

## Local source fingerprint
Validated `src/backend/commerce.ts` SHA-256:

`2f0cb5e19311b8ef89bfb6a31cb8c2ca5da9a39850d3bc6e7b37dc89b741bfe7`

## Non-claims
- No live PayPal transaction was exercised.
- No live PayPal webhook business event was processed by TeamAi.
- No entitlement was activated from PayPal evidence.
- No replay-protection or webhook-delivery success claim is made here.
- Firebase emulator/rules execution remains parked because the local environment lacks the required Firebase CLI/runtime path.

## Next gate
Gate 5C: verified PayPal webhook authenticity, replay/idempotency handling, durable commerce event persistence, and entitlement projection.
