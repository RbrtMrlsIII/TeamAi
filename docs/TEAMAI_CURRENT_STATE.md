# TeamAi — Current State Control Index

**Status:** CANONICAL RECOVERY / EXECUTION INDEX
**Revision basis:** `main` at `2090b9ab15d70d82664a7d2aafc032832363f2b6`

This document is a compact operational index for agents. It does not replace Product Law, Masterplan, Policy/ORUCAVEAM, concrete skills, implementation contracts, verification evidence, HandOver, or Endorsement.

## Authority order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/** → implementation → verification → evidence → HandOver / Endorsement`

## Current execution posture

- `TEAM-BACKEND-001`: **IN IMPLEMENTATION**; durable scheduler/domain-state bridge is now implemented as a bounded runtime contract, while concrete Firebase transactional runtime evidence and external PayPal runtime evidence remain open.
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

The 029 spatial progression currently present on `main` is:

`PR #24 Shell + Navigation → #25 Command Deck interior → #26 shared F7 plate/skill hygiene → #28 F7 handoff + smoke → #29 Command Deck skeleton → #30 Workplace → #31 Seats/Provider → #32 Planning → #33 Working → #34 F7 hidden-cluster correction → #36 Approvals → #37 Artifacts → #38 Settings`

The backend execution progression currently present on `main` includes:

`PR #35 ProviderRuntime gate → PR #39 task execution gate → PR #55 authorization + durable domain state + scheduler eligibility + runtime bridge contract`

These merged slices are bounded presentation/contracts or execution slices; they do **not** by themselves establish full 029 completion or TEAM-BACKEND-001 completion.

## Backend reality

The backend foundation now includes Firebase UID-rooted Firestore paths, durable task/event state contracts, deterministic scheduler eligibility, explicit execution authorization, an atomic task-lease contract, a scheduler-to-execution runtime bridge, ProviderRuntime authorization gates, server-owned PayPal correlation, and the merged task execution gate.

The existing `teamai-domain-bootstrap` runtime proves the authenticated Firebase UID → Firestore domain hierarchy persistence boundary. The new runtime bridge deliberately stops at interfaces for atomic leasing, approval, state loading, and execution so that concrete Firestore transaction implementation can be added without moving authority into the browser.

The remaining TEAM-BACKEND-001 frontier includes concrete Firebase transactional lease/runtime integration, concurrency/restart evidence, durable result/artifact recording, final audit/traceability evidence, and live PayPal transaction/webhook runtime evidence.

## Frontend reality

The spatial frontend is an inhabited presentation shell with shared theme root and F0–F7 field vocabulary, Shell/Navigation/Deck/Workplace/Seats/Planning/Working/Approvals/Artifacts/Settings compositions, one shared F7 E4 modal surface, deterministic Playwright coverage, and responsive/reduced-motion handling.

The current spatial data is still deliberately fixture-backed. Fixtures are presentation content, not durable domain authority.

## Known brittle points

### 1. Canonical-state drift

Reconcile documentation to the current implemented frontier without promoting implementation into completion.

### 2. Branch accumulation

Numerous historical or superseded branches remain. Before reusing any non-main branch, compare it with current `main` and classify it.

### 3. Frontend/backend contract boundary

Do not inject browser Firebase/domain behavior ad hoc. Consume backend-owned read models and trusted runtime facts through explicit contracts.

### 4. Firestore write-authority review

User-owned configuration and TeamAi-managed authoritative state remain distinct. Browser writes must not become the scheduler/execution authority.

### 5. Concurrency and recovery

The scheduler is pure and the lease contract now exists, but the concrete Firestore transaction must prove single-winner leasing and safe restart/recovery behavior.

### 6. PayPal evidence frontier

Gate 5C implementation/available-environment verification is complete as a source boundary; live transaction/webhook runtime evidence is still outstanding.

### 7. Dual API-server ambiguity

`src/main.ts` launches `src/api/server.ts`. `src/server.ts` remains present as a legacy-looking alternate server. Do not delete it blindly; prove dependency first and retire only through an explicit bounded reconciliation.

## Rules for high-concurrency agents

1. `main` is the baseline for current work.
2. Before reusing an old branch, compare it with current `main`.
3. Do not merge based on branch naming, stale PR descriptions, or old screenshots.
4. A PR must identify governing Masterplan item, concrete skill routing, verification scope, and limitations.
5. Do not turn fixture UI into claimed live domain behavior without an explicit integration contract and runtime evidence.
6. Do not create page-local Product Law, scheduler, identity, entitlement, commerce, or durable-state authority.
7. Do not resume Vercel without explicit user approval.

## Immediate next slice

**TEAM-BACKEND-001 — concrete Firestore transactional runtime adapter + recovery proof.**

Scope:

`UID-authenticated state load → atomic task lease → durable approval transition → trusted execution → durable result/event → restart/concurrency verification`

Out of scope:

`browser Firestore authority, provider-to-provider orchestration, PayPal transaction activity, Vercel activation, Product Law rewrite, second frontend theme/root.`

## Evidence language

Use precise state labels:

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade a state label by implication.
