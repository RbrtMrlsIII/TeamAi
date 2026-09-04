# Backend — Task Event Idempotency Skill

## WHEN TO USE
Use when creating, projecting, or replaying TeamAi task/commerce/runtime events that must not double-apply.

## INPUT
Event identity, source authority, destination Firestore path, and replay/idempotency key.

## AUTHORITY
Durable event identity lives in canonical backend state, not in UI animation, F6 Status pulses, or F7 mount/unmount.

## ACTION
Derive a stable idempotency identity from the authoritative event and persist only through the trusted path.

## DO NOT
Do not use presentation transitions as event identity. Do not double-write because a UI surface remounted.

## PASS
Replay does not create a second authoritative event.

## EVIDENCE
Record idempotency key, source event, and projection result.

## SEE ALSO
- `skills/backend/firestore-canonical-state/SKILL.md`
- `skills/backend/commerce-paypal/SKILL.md`
