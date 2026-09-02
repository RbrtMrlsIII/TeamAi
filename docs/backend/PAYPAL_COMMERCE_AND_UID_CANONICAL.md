# PayPal Commerce + Firebase UID Canonical

## Authority

PayPal is authoritative for payment-provider events. Firebase Auth is authoritative for human identity. Firestore is authoritative for TeamAi's resulting subscription, promotion, payment, and entitlement state. Supabase Edge Functions are the trusted verification and translation boundary.

## Canonical flow

`User → PayPal checkout/subscription → PayPal event → Supabase Edge Function → verify/authenticate → idempotency/replay protection → resolve server-owned Firebase UID correlation → Firestore commerce event/state → entitlement`

## Browser safety rule

The browser may initiate checkout, but it never decides payment success and never supplies a Firebase UID that is trusted as ownership proof. The backend resolves the event against a pre-existing TeamAi subscription intent/correlation.

## Commercial hypothesis

The first qualifying subscription has one paid month followed by months 2–3 free. The introductory three-month grant is usable once per Firebase UID. Succeeding months bill normally under the active plan. Exact PayPal Product/Plan/Button design, trial representation, pricing, taxes, refunds, grace periods, and failed-renewal behavior remain downstream of UI/commercial validation.

## Idempotency

Persist PayPal event identity and relevant correlation identifiers so retries or duplicate valid deliveries do not create duplicate payments, duplicate entitlements, or duplicate promotional grants.

## Implementation status

Planning contract only. No live or sandbox subscription transaction has been exercised. Commerce activation requires executable evidence for signature verification, UID correlation, Firestore mutation, entitlement grant, renewal, cancellation, retry, and one-time promotion enforcement.
