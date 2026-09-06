# Backend — Commerce / PayPal Skill

## WHEN TO USE
Use when implementing or verifying TeamAi's PayPal-facing commerce correlation, webhook authenticity, replay/idempotency, event persistence, aggregate-state transition, or entitlement projection.

## INPUT
Authenticated Firebase UID context, server-owned commerce intent/correlation, verified PayPal event data, canonical Firestore paths, and required evidence boundary.

## AUTHORITY
PayPal is the external payment-event authority. TeamAi owns server-side correlation, durable event projection, aggregate commerce state, and entitlement rules. Firestore remains the TeamAi durable domain-state authority.

F6 Status may display TeamAi vs provider entitlement as two facts. It does not own or grant entitlement. F7 Modal may request approval; it does not execute payment.

## ACTION
Create/consume commerce intents only through the trusted server boundary. Correlate verified PayPal events to the server-owned intent, derive stable idempotency identity, persist authenticated commerce events under the Firebase UID, synchronize the canonical commerce aggregate when the mapped event carries an aggregate transition, and project entitlement only from authenticated correlated provider events.

For a successful `PAYMENT.CAPTURE.COMPLETED` event, the canonical progression is:

`capture COMPLETED → signed provider event → verified correlation → durable event → aggregate status completed → entitlement active`

The aggregate patch may occur before the duplicate-event early return so safe PayPal redelivery can repair stale aggregate state without creating a second event record.

## DO NOT
Do not let the browser self-attest payment or entitlement success. Do not create provider event state outside the canonical TeamAi domain path. Do not treat a source-contract test as live PayPal runtime proof. Do not treat F6 Status copy as payment authority. Do not treat `custom_id`, provider event IDs, or entitlement state as substitutes for the canonical aggregate document. Do not label the whole commerce lifecycle complete until aggregate, event, and entitlement state are directly verified.

## PASS
The commerce path preserves authenticated ownership, provider-event authenticity, correlation, idempotency/replay protection, canonical aggregate state, and durable entitlement projection.

For the post-fix aggregate-state gate, PASS additionally requires direct Firestore verification that the expected aggregate is `completed`, the provider event remains singular, and the entitlement is `active` with the correct source commerce event ID.

## EVIDENCE
Separate source-contract, available-environment, and live PayPal runtime evidence. Record the real provider event ID, correlation, listener deployment/version, HTTP outcome, Firestore aggregate/event/entitlement state, and remaining limitations. Preserve whether evidence is RUNTIME-PROVEN, LEARNED, or COMPLETED rather than inferring a higher state.

## SEE ALSO
- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `docs/SKILL_WIRING.md`
- `docs/backend/FIRESTORE_DOMAIN_MODEL_V2.md`
- `docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md`
- `src/backend/commerce.ts`
- `supabase/functions/paypal-webhook/index.ts`
- `skills/backend/firestore-canonical-state/SKILL.md`
- `skills/backend/task-event-idempotency/SKILL.md`
- `skills/backend/verification-recovery/SKILL.md`
