# TEAM-BACKEND-001 — Task execution gate slice

**Status:** implementation proposal / deterministic execution slice

## Purpose

Close the smallest remaining execution-boundary gap between scheduler-owned task state and the existing ProviderRuntime gate.

## Contract

- A task enters this service only from `waiting_approval`.
- `approved` must be explicit and true.
- The service records a durable `START` event before provider invocation.
- Provider invocation is delegated only to `ProviderRuntime`.
- Success records `COMPLETE` and transitions the task to `completed`.
- Provider rejection/failure records `FAIL` and transitions the task to `failed`.
- A previously seen execution idempotency key causes a duplicate response without a second provider invocation.

## Authority boundary

The service does not choose the next task or seat, does not grant entitlements, does not write Firestore directly, and does not permit provider-to-provider control. Scheduler/task state remains authoritative for eligibility; ProviderRuntime remains authoritative for provider invocation gates.

## Verification

The deterministic tests cover successful execution, approval blocking, invalid task state, ProviderRuntime failure, and duplicate execution. GitHub Actions must typecheck, run project tests, and verify the canonical project package before merge.

## Remaining backend frontier

This slice does not close the remaining live PayPal sandbox transaction/webhook evidence. That external runtime evidence remains a separate Gate-5C completion boundary and must not be represented as complete without executable evidence.
