# TEAM-BACKEND-001 — Durable Scheduler + Runtime Bridge Contract

**State:** IMPLEMENTED contract slice
**Field:** Backend & Runtime

## Purpose

Connect the already implemented scheduler and trusted execution primitives without moving authority into the frontend or directly coupling Web AI providers to one another.

## Canonical runtime sequence

`authenticated UID → durable project/Seat state → task requirements → scheduler eligibility → atomic lease → approval transition → ProviderRuntime → durable START/COMPLETE/FAIL evidence → next eligible work`

## Implemented source boundary

- `src/backend/task-lease.ts` defines the atomic lease contract. The store implementation must perform the ready-state check and lease write as one transaction.
- `src/backend/task-runtime-bridge.ts` connects scheduler evaluation to leasing, approval, and the existing `TaskExecutionService`.
- Scheduler remains pure and deterministic; it does not invoke providers or mutate durable state.
- `TaskExecutionService` remains the trusted execution sequencing boundary and still requires explicit approval and authorization.
- ProviderRuntime remains the sole provider invocation boundary.

## Concurrency invariant

Two workers may evaluate the same task concurrently, but only the worker whose atomic lease transaction observes `ready` and commits the lease may proceed. A losing worker must receive a non-acquired result and must not invoke a provider.

## Approval invariant

Leasing does not imply approval. The runtime bridge exposes approval as a separate durable transition. Execution is permitted only after the authoritative task state reports `waiting_approval`, approval is true, authorization is active, and the connection is valid.

## Firebase adapter target

A concrete Firestore-backed implementation must map the `AtomicTaskLeaseStore`, `RuntimeTaskStore`, and `RuntimeApprovalStore` contracts onto UID-rooted Firestore documents and transactions. The existing `teamai-domain-bootstrap` function proves the authenticated UID-rooted persistence boundary, but this bridge slice does not claim a new live Firestore lease transaction has been exercised.

## Recovery

Lease acquisition and execution identifiers must remain durable and idempotent. A restart must re-read authoritative task/event state before attempting another lease or execution. Provider calls must never be inferred from a browser-only status.

## Explicit exclusions

- no direct provider-to-provider orchestration;
- no browser Firestore write authority;
- no PayPal transaction activity;
- no Vercel activation;
- no completion claim for TEAM-BACKEND-001.

## Remaining evidence

Concrete Firebase transactional lease execution, concurrency/restart evidence, durable result/artifact persistence, authenticated end-to-end runtime evidence, and live PayPal transaction/webhook evidence remain required before final TEAM-BACKEND-001 completion/endorsement.
