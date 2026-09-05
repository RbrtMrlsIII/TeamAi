# TeamAi — Current State Control Index

**Status:** CANONICAL RECOVERY / EXECUTION INDEX
**Revision basis:** `main` is the current source baseline.

This document is a compact operational index for agents. It does not replace Product Law, Masterplan, Policy/ORUCAVEAM, concrete skills, implementation contracts, verification evidence, HandOver, Endorsement, or live runtime proof.

## Authority order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/** → implementation → verification → evidence → HandOver / Endorsement`

## Current execution posture

- `TEAM-BACKEND-001`: **IN IMPLEMENTATION**; scheduler/domain-state contracts, runtime bridge, concrete Firestore lease transaction source, and its `AtomicTaskLeaseStore` adapter are implemented; live Firestore concurrency/restart evidence, durable result/artifact persistence, authenticated end-to-end execution wiring, and PayPal runtime evidence remain open.
- `TEAM-EXPERIENCE-029`: **presentation implementation materially inhabited; backend/live-domain integration and full completion frontier remain open**.
- GitHub is the engineering/source authority.
- Firebase `(default)` Firestore is the durable application/domain-state authority.
- Firebase Auth owns identity / Firebase UID ownership.
- Supabase Edge Functions own trusted server execution and PayPal webhook handling.
- PayPal is external payment-provider event authority.
- Firebase Hosting is current TeamAi web delivery authority.
- GitHub Pages is validation-only static browser publication for the spatial UI.
- Vercel is **paused/cut off by current policy** and must not be resumed without explicit user approval.

## Merged implementation frontier

The 029 spatial progression currently present on `main` remains the established Shell → Deck → F7 → Workplace → Seats → Planning → Working → Approvals → Artifacts → Settings composition.

The backend execution progression currently present on `main` is:

`ProviderRuntime gate → task execution gate → authorization + durable domain state + scheduler eligibility + runtime bridge → concrete Firestore lease transaction source → AtomicTaskLeaseStore adapter`

These are bounded implementation slices and do **not** by themselves establish full 029 completion or TEAM-BACKEND-001 completion.

## Backend reality

The backend foundation now includes Firebase UID-rooted paths, durable task/event state, deterministic Seat eligibility, explicit authorization, atomic lease contract, scheduler-to-execution bridge, trusted ProviderRuntime execution, and a concrete server-side Firestore transaction implementation for `ready → leased` task acquisition.

The concrete Firestore boundary is deliberately split: `FirestoreLeaseTransaction` owns transaction mechanics, while `FirestoreAtomicTaskLeaseStore` maps the result into the canonical scheduler lease contract. It carries explicit Firebase UID, workplace, and TeamAi project scope; TeamAi `projectId` is not treated as the Firebase infrastructure project ID.

The concrete Firestore adapter uses runtime-only service-account configuration and Firestore optimistic transaction preconditions. Source tests exercise transaction construction, ready-state gating, conflict handling, and contract mapping. This is **source/test evidence**, not live Firebase runtime proof.

The existing `teamai-domain-bootstrap` runtime remains the live authenticated UID → Firestore domain hierarchy proof.

## Remaining TEAM-BACKEND-001 frontier

1. Live Firestore transactional lease exercise with two concurrent workers proving single-winner behavior.
2. Restart/recovery proof after lease acquisition and before/after provider execution.
3. Durable normalized result/artifact persistence tied to task and event identity.
4. Authenticated end-to-end runtime wiring from verified Firebase UID through scheduler, lease, approval, execution, and durable evidence.
5. Final audit/traceability, HandOver, and Endorsement evidence.
6. Separate live PayPal sandbox transaction/webhook runtime evidence.

## Frontend reality

The spatial frontend remains fixture-backed presentation. Fixtures are presentation content, not durable domain authority. Backend-owned read-model integration is still a separate controlled slice.

## Known brittle points

### 1. Canonical-state drift
Keep documentation synchronized with the implementation frontier without promoting source implementation into runtime-proven or completed status.

### 2. Branch accumulation
Before reusing any non-main branch, compare it against current `main` and classify it.

### 3. Frontend/backend contract boundary
Do not inject browser Firebase/domain behavior ad hoc. Consume backend-owned read models and trusted runtime facts through explicit contracts.

### 4. Firestore write-authority boundary
Browser writes must not become scheduler or execution authority.

### 5. Concurrency and recovery
The transactional lease source and its scheduler-contract adapter are implemented, but live contention and restart evidence are still required.

### 6. PayPal evidence frontier
Gate 5C implementation/available-environment verification is complete as a source boundary; live transaction/webhook runtime evidence remains outstanding.

### 7. Dual API-server ambiguity
`src/main.ts` launches `src/api/server.ts`. `src/server.ts` remains present and must not be removed without dependency proof and explicit reconciliation.

## Rules for high-concurrency agents

1. `main` is the baseline for current work.
2. Before reusing an old branch, compare it with current `main`.
3. Do not merge based on branch naming, stale PR descriptions, or old screenshots.
4. A PR must identify governing Masterplan item, concrete skill routing, verification scope, and limitations.
5. Do not turn fixture UI into claimed live domain behavior without an explicit integration contract and runtime evidence.
6. Do not create page-local Product Law, scheduler, identity, entitlement, commerce, or durable-state authority.
7. Do not resume Vercel without explicit user approval.

## Immediate next gate

**TEAM-BACKEND-001 — live Firestore concurrency/recovery exercise and durable result persistence.**

Scope:

`verified Firebase UID → authoritative task read → transactional lease → approval → trusted execution → durable result/event → restart/concurrency recovery`

Out of scope:

`browser Firestore authority, provider-to-provider orchestration, PayPal transaction activity, Vercel activation, Product Law rewrite, second frontend theme/root.`

## Evidence language

Use precise state labels:

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade a state label by implication.
