# TEAM-BACKEND-001 — Canonical Commerce Foundation

**Date:** 2026-09-03
**Status:** IN IMPLEMENTATION
**Phase:** GATE 5 — Canonical Commerce Foundation

## Purpose
Establish the durable commerce boundary before commercial UI expansion. This phase does not enable live billing or claim PayPal end-to-end completion.

## Frozen authority model
`PayPal` remains the external payment-event authority.
`Supabase Edge Functions` remain the trusted server execution and webhook boundary.
`Firestore (default)` remains TeamAi durable application/domain state.
`Firebase UID` remains the domain ownership root.
The browser never self-attests payment success, subscription state, or entitlement.

## Canonical flow
`PayPal event → trusted Edge Function → authenticity verification → replay/idempotency control → server-owned PayPal-to-Firebase-UID correlation → durable commerce event → entitlement projection in Firestore`

## Foundation contract
`src/backend/commerce.ts` establishes:
- PayPal as the currently supported commerce provider.
- Stable provider-event and idempotency identities.
- Firebase UID as the required server-owned ownership identity.
- Durable commerce-event shape.
- Entitlement projection shape.
- UID-rooted Firestore commerce event and entitlement paths.

## Extension rule
Additional payment buttons, subscription products/plans, promotional variants, and PayPal-facing commercial flows are configurations or extensions of this canonical boundary. They must not create a second identity, ownership, database, entitlement authority, or browser-authoritative path.

## Current validation boundary
The contract is source-level only. No PayPal transaction, live subscription, webhook signature verification, replay test, or Firestore commerce mutation is claimed complete by this file.

## Next evidence
1. Validate the contract with backend unit tests.
2. Connect the server-owned correlation boundary to the existing trusted Edge runtime.
3. Implement webhook authenticity and expected webhook identity verification.
4. Persist durable commerce events with stable idempotency/replay handling.
5. Project entitlements into Firestore under the authenticated Firebase UID.
6. Exercise sandbox events before any production commercial activation.

## Traceability
`PRODUCT_LAW.md` canonical backend extension invariant + Laws 101–104 → `MASTERPLAN.md` GATE 5 → this contract → implementation → verification evidence → endorsement.

## Explicit non-goals
- No new sign-in provider is introduced here.
- No commercial UI is enabled here.
- No PayPal secret is placed in source.
- PHASE-004 Firebase Emulator / Rules execution remains parked and separately tracked.
