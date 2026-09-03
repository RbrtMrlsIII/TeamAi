# CHECKPOINT — TEAM-BACKEND-001 GATE 5 START

**Date:** 2026-09-03
**Gate:** GATE 5 — Canonical Commerce Foundation
**Status:** ACTIVE / IN IMPLEMENTATION

## Entry condition
Gate 4 Firebase Emulator / Security Rules execution is deliberately parked and separately tracked. Parking does not waive the requirement; it only permits sequential progress on the next bounded backend gate.

## Objective
Establish the durable commerce and entitlement boundary so additional payment buttons, subscription products/plans, promotional variants, and future PayPal commercial flows extend one canonical path rather than create parallel ownership or entitlement authorities.

## Frozen authority chain
`PayPal event authority → Supabase Edge trusted execution → server-owned Firebase UID correlation → Firestore durable commerce state/entitlement`

## Source implementation started
`src/backend/commerce.ts` defines the first source-level commerce contract:
- PayPal as the currently supported provider.
- Stable provider-event and idempotency identities.
- Firebase UID as the required server-owned ownership identity.
- Durable commerce event shape.
- Entitlement projection shape.
- UID-rooted Firestore commerce paths.

## Not yet proven
- PayPal webhook authenticity.
- Expected webhook identity validation.
- Replay resistance / duplicate-event behavior.
- Live PayPal-to-Firebase UID correlation.
- Durable Firestore commerce mutation.
- Entitlement projection from verified external events.
- Sandbox transaction exercise.

## Next execution slice
Connect the commerce contract to the trusted Edge runtime without introducing secrets into source, then add deterministic tests before any live PayPal activation.

## ORUCAVEA boundary
This checkpoint records entry and source implementation only. Completion requires executable verification evidence and final traceability/endorsement under the project completion protocol.
