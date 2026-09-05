# TEAM-EXPERIENCE-029 — Backend Validator Contract

**Field:** `field/frontend-backend-validator-contract-v1`  
**Boundary:** Frontend presentation/validation only

## Purpose

Define the smallest typed frontend contract for consuming backend-owned execution facts without giving the frontend execution authority.

## Backend-owned facts

The frontend may validate and present:

- task identity and task status;
- approval state;
- assigned seat and provider identity;
- connection readiness;
- a terminal event type when a task is completed.

The frontend does **not** select the next task or seat, invoke providers, mutate scheduler/task state, write Firestore, grant entitlement, or perform PayPal actions.

## Provenance

`source` distinguishes backend-fed facts from local fixtures. A fixture is presentation/test input and is never an authority source.

## Validation rule

A `running` task must report a `ready` connection. A `completed` task must expose its terminal event type. Required task, seat, and provider identifiers must be non-empty.

Validation failure is presentation-visible only; it does not repair or mutate the backend fact.

## Next boundary

The next slice may bind these validators to UI fields in the spatial surface. That binding must remain read-only and must continue to treat backend execution state as authoritative.
