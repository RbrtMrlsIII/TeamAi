# TEAM-BACKEND-001 — Scheduler + Durable Domain State Contract

**State:** IMPLEMENTED contract slice
**Field:** Backend & Runtime
**Scope:** scheduler eligibility and UID-rooted durable state contracts

## Authority flow

`Human/User authority → Product Law → responsibility profile → workspace/rules + skills → capabilities → authorization → task requirements + durable task state → scheduler eligibility → trusted ProviderRuntime execution → durable result/event → verification`

## Implemented boundary

`src/backend/domain-state.ts` defines the durable identity relationship between Firebase UID, workplace, project, team, seat, connection, task and event records. It provides explicit UID ownership and state-identity guards plus a repository-shaped durable state interface.

`src/backend/scheduler.ts` defines a pure scheduler eligibility calculation. A seat is eligible only when it:

1. belongs to the task's project;
2. is active and explicitly authorized;
3. is authorized for the task type;
4. matches the task responsibility field;
5. has every required capability; and
6. has every required skill.

When multiple seats qualify, selection is deterministic by seat identifier. The scheduler does not select by branch name, recency, provider preference, or UI state.

## Non-authority boundaries

The scheduler does not invoke providers, mutate Firestore, mutate entitlements, perform payment activity, or perform direct provider-to-provider orchestration. It produces an eligibility decision for a separate execution/state transition layer.

`ProviderRuntime` remains the sole provider invocation boundary. The durable-state contract does not make the frontend authoritative over scheduler or execution state.

## Verification

`tests/backend-scheduler-domain-state.test.mjs` covers:

- authorized/capable/skilled seat selection;
- project isolation;
- ready-state gating;
- Firebase UID ownership isolation; and
- entity identity validation.

## Remaining TEAM-BACKEND-001 work

This slice does **not** close TEAM-BACKEND-001. Remaining work includes concrete Firebase adapter persistence, authenticated runtime wiring, recovery/concurrency evidence, final audit/traceability evidence, and the separately outstanding live PayPal transaction/webhook runtime evidence.
