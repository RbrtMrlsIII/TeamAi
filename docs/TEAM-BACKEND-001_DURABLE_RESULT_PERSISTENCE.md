# TEAM-BACKEND-001 — Durable Execution Result Persistence

**State:** IMPLEMENTED source contract
**Field:** Backend & Runtime

## Purpose

The provider execution result is now treated as durable evidence rather than remaining only in the in-memory return value of `TaskExecutionService`.

## Canonical sequence

`START durable event → ProviderRuntime → normalized result/terminal error → durable execution-result record → COMPLETE/FAIL durable event → task terminal state`

The result record is keyed by the terminal event identity and stored under the verified Firebase UID, workplace, TeamAi project, and task hierarchy:

`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/tasks/{taskId}/execution-results/{terminalEventId}`

The write uses create-only semantics so a retry cannot silently overwrite an existing terminal result.

## Recovery property

A result is associated with `taskId + projectId + eventId`. The result store can therefore answer whether a terminal result is already durable before another terminal-result write is attempted.

## Failure semantics

A provider failure is persisted as a normalized failure result before the `FAIL` event is appended. A result persistence failure is not converted into a provider failure; it propagates, preventing a false terminal state.

## Verification boundary

Tests prove scope, create-only write construction, result identity lookup, and terminal-result-before-terminal-event ordering. They do **not** prove live Firebase execution, cross-process contention, restart recovery, or authenticated end-to-end runtime wiring.

## Remaining runtime evidence

- Live two-worker Firestore lease contention.
- Restart/recovery after lease and around provider execution.
- Live durable result retrieval after process restart.
- Authenticated end-to-end Firebase UID → scheduler → lease → approval → ProviderRuntime → durable evidence.
- Separate live PayPal sandbox transaction/webhook evidence.
