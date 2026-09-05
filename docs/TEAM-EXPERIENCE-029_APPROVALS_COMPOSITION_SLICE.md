# TEAM-EXPERIENCE-029 — Approvals composition slice

**Status:** implementation proposal / presentation-only slice

## Purpose

Inhabit the Approvals navigation composition using the existing 029 skeleton and the existing shared F7 E4 approval plate.

## Contract

- Queue = F4 cards in an F3 panel.
- Selected request = F3 E3 panel.
- Decision = the existing shared F7 E4 plate.
- The UI presents request, seat, task, impact, waiting-since and current display state.
- APPROVE and DENY remain presentation-only in this slice.
- No Firestore write, provider invocation, scheduler mutation, entitlement mutation, PayPal activity, or durable state transition occurs from this UI.

## Backend alignment

The current backend task model includes `waiting_approval` and transitions back to `running` only through a `START` event. Durable task events carry an `eventId`, `idempotencyKey`, `type`, `actorId`, and `occurredAt`. The provider runtime gate separately requires a running task, explicit approval, an active project-scoped connection, matching provider, and `execute` capability before invocation.

This presentation slice therefore renders the approval boundary without pretending that a browser click performs the authoritative transition.

## Verification intent

- Approvals is reachable from wide and compact navigation.
- Queue selection changes only presentation state.
- Selected request shows what would run and what would not.
- Opening the decision uses the shared F7 plate.
- F7 remains focus-trapped and Escape-deterministic.
- APPROVE / DENY produce UI-only status text.
- No horizontal overflow in compact layout.
