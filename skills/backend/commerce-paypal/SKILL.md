# Backend — Commerce / PayPal Skill

## WHEN TO USE
Use when implementing or verifying TeamAi's PayPal-facing commerce correlation, webhook authenticity, replay/idempotency, event persistence, or entitlement projection.

## INPUT
Authenticated Firebase UID context, server-owned commerce intent/correlation, verified PayPal event data, canonical Firestore paths, and required evidence boundary.

## AUTHORITY
PayPal is the external payment-event authority. TeamAi owns server-side correlation, durable event projection, and entitlement rules. Firestore remains the TeamAi durable domain-state authority.

## ACTION
Create/consume commerce intents only through the trusted server boundary. Correlate verified PayPal events to the server-owned intent, derive stable idempotency identity, persist authenticated commerce events under the Firebase UID, and project entitlement only from authenticated correlated provider events.

## DO NOT
Do not let the browser self-attest payment or entitlement success. Do not create provider event state outside the canonical TeamAi domain path. Do not treat a source-contract test as live PayPal runtime proof.

## PASS
The commerce path preserves authenticated ownership, provider-event authenticity, correlation, idempotency/replay protection, and canonical durable projection.

## EVIDENCE
Separate source-contract, available-environment, and live PayPal runtime evidence. Record remaining external limitations explicitly.

## SEE ALSO
- `PRODUCT_LAW.md`
- `src/backend/commerce.ts`
- `supabase/functions/paypal-webhook/index.ts`
- `skills/backend/firestore-canonical-state/SKILL.md`
