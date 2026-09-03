# CHECKPOINT — TEAM-BACKEND-001 GATE 5C

Date: 2026-09-03
Status: `GATE 5C — IMPLEMENTATION STARTED; RUNTIME VALIDATION PENDING`

## Purpose
Extend the already-passed Gate 5B correlation contract into a trusted commerce processing boundary without moving TeamAi domain authority away from Firebase Auth/Firestore.

## Implemented source boundary
- `src/backend/commerce.ts` now exposes explicit UID-rooted intent, correlation-index, commerce-event, and entitlement paths.
- `supabase/functions/teamai-commerce-intent/index.ts` verifies the Firebase ID token directly against the authoritative `team-ai-official` project, creates a server-owned PayPal commerce intent, and returns only an opaque correlation ID for use as PayPal `custom_id`.
- `supabase/functions/_shared/firestore.ts` provides the trusted service-account → Google OAuth → Firestore REST path for server-owned commerce persistence.
- `supabase/functions/paypal-webhook/index.ts` contains the Gate 5C implementation for PayPal authenticity verification, event correlation, durable event idempotency, and entitlement projection.

## Deployment evidence
- `teamai-commerce-intent` deployed ACTIVE, version 1.
- `teamai-paypal-webhook-v5c` deployed ACTIVE, version 1.
- Existing canonical `paypal-webhook` remains ACTIVE and unchanged because the new implementation has not yet completed runtime validation.

## Security boundary
PayPal webhook authenticity is checked before commerce processing. After authenticity succeeds, the webhook uses the authenticated event's `resource.custom_id` as a lookup key into a server-only correlation index, then verifies that the referenced UID-rooted commerce intent matches the same correlation ID before writing any durable commerce event or entitlement state.

The correlation index is a server-only lookup aid, not the source of truth for TeamAi ownership. Canonical intent, commerce events, and entitlement projections remain rooted under the Firebase UID. Client rules continue to deny unauthorized writes.

## Current non-claims
- No live PayPal transaction has been exercised.
- No live PayPal webhook has yet been accepted and independently verified end-to-end by TeamAi.
- No production PayPal listener cutover has been performed.
- No complete replay-race, entitlement-ordering, failure/recovery, or end-to-end browser-to-commerce evidence is claimed.

## Next validation boundary
1. Invoke the new commerce-intent function with an invalid token and confirm HTTP 401.
2. Invoke it with a valid Firebase ID token and confirm only a correlation ID/custom_id is returned and corresponding server-owned Firestore intent/index documents exist.
3. Use an authenticated PayPal sandbox webhook event to verify signature, correlation, durable event creation, and entitlement projection.
4. Replay the same provider event and confirm the durable event is treated as a duplicate without a second projection mutation.
5. Only after those checks succeed should the canonical PayPal webhook endpoint be considered for cutover.

## Handover rule
Gate 5C is not complete yet, therefore the mandatory completed-gate handover rule is not triggered by this checkpoint. The Gate 5B target-project handover remains the latest completed-gate packet.
