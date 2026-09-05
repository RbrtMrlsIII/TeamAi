# TEAM-BACKEND-001 — Firestore Runtime Adapter Contract

**State:** IMPLEMENTED source contract
**Field:** Backend & Runtime

## Purpose

Materialize the scheduler/runtime bridge against the canonical Firebase `(default)` Firestore authority without moving durable execution authority into the browser.

## Canonical path

`Firebase UID → Firestore project/task/Seat state → scheduler eligibility → transactional lease → separate approval transition → trusted execution → durable event/result → recovery`

## Implemented boundary

`src/backend/firestore-runtime.ts` provides a server-side Firestore REST adapter using a Firebase service account held only in runtime environment configuration. It supports:

- UID/workplace/project-scoped task, Seat and connection reads;
- Firestore read-write transaction creation;
- transactional ready-state task leasing with an update-time precondition;
- separate leased-task approval transition with an update-time precondition; and
- durable execution-event writes.

The lease transaction reads the authoritative task in the transaction and commits the lease plus task-state transition together. A concurrent write conflict is returned as a non-acquired lease rather than invoking a provider.

## Recovery invariant

A worker must re-read authoritative Firestore state before lease or execution. Lease identifiers and execution idempotency keys remain durable identifiers. Browser-visible state is never used as evidence that execution occurred.

## Security boundary

The adapter accepts the Firebase UID/workplace/project scope explicitly and uses the service account only inside the trusted runtime. Service-account material is never committed and must never be placed in browser code, logs, chat, or repository configuration.

## Verification

`tests/firestore-runtime.test.mjs` uses an in-process HTTP boundary mock to verify that:

- lease acquisition begins a transaction;
- task state is read inside that transaction;
- the commit contains both lease creation and task `ready → leased` transition;
- update-time concurrency protection is present; and
- approval is separately committed as `leased → waiting_approval`.

These tests prove request/transaction construction, not live Firebase execution. Live concurrency/restart evidence remains required before runtime-proven status.

## Remaining TEAM-BACKEND-001 evidence

Live Firebase lease concurrency/restart exercise, durable result/artifact persistence, authenticated end-to-end execution wiring, and live PayPal transaction/webhook evidence remain open.
