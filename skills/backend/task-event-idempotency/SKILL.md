# Backend — Task / Event / Idempotency Skill

## WHEN TO USE
Use when creating, transitioning, leasing, completing, failing, cancelling, retrying, or reconciling TeamAi tasks and durable events.

## INPUT
Task/event identity, authenticated ownership context, current lifecycle state, requested transition, idempotency identity, and scheduler/approval boundary.

## AUTHORITY
Firestore `(default)` owns durable TeamAi task/event state. The task-state contract defines valid lifecycle transitions and event semantics.

## ACTION
Use the canonical task/event paths and lifecycle transitions. Require durable identity and ownership context. Preserve idempotency for repeatable operations and never infer completion from in-memory state alone.

## DO NOT
Do not bypass valid state transitions, duplicate durable events on retry, or allow an AI/provider to directly select the next actor outside scheduler eligibility.

## PASS
The requested state transition/event is valid, durably recorded, attributable, and safe under repeat execution where applicable.

## EVIDENCE
Record task/event IDs, transition, idempotency identity, resulting durable state, and recovery/failure evidence when relevant.

## SEE ALSO
- `src/backend/task-state.ts`
- `PRODUCT_LAW.md`
- `skills/backend/firestore-canonical-state/SKILL.md`
