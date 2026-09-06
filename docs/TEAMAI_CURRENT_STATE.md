# TeamAi — Current State Control Index

**Status:** CANONICAL RECOVERY / EXECUTION INDEX  
**Revision basis:** `main` @ authenticated `teamai-task-execute` live runtime proof (2026-09-06) plus live Firestore contention/recovery run #7 (`d50f6ab5…`) — both bounded runtime gates are RUNTIME-PROVEN.

This document is a compact operational index for agents. It does not replace Product Law, Masterplan, Policy/ORUCAVEAM, concrete skills, implementation contracts, verification evidence, HandOver, Endorsement, or live runtime proof.

## Authority order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/** → implementation → verification → evidence → HandOver / Endorsement`

## Current execution posture

- `TEAM-BACKEND-001`: **IN IMPLEMENTATION** with **RUNTIME-PROVEN** bounded sub-gates for (a) live two-worker lease contention + durable result restart/recovery (GitHub Actions run #7) and (b) authenticated `teamai-task-execute` Edge execution. Still open: final audit/traceability, HandOver/Endorsement, separate live PayPal runtime evidence, and remaining authenticated product-path integration beyond this bounded Edge slice.
- `TEAM-BACKEND-002`: **IMPLEMENTED** on `main` (settings draft/Save boundary, conversation-turn durability, transcript working-set read reduction, result retrieval, token-cache / read-write economy). Live probe secrets and workflow are operational; economy rules are source-tested and used by the live probe path.
- `TEAM-EXPERIENCE-029`: **presentation implementation materially inhabited; backend/live-domain integration and full completion frontier remain open**.
- GitHub is the engineering/source authority.
- Firebase `(default)` Firestore is the durable application/domain-state authority.
- Firebase Auth owns identity / Firebase UID ownership.
- Supabase Edge Functions own trusted server execution and PayPal webhook handling.
- PayPal is external payment-provider event authority.
- Firebase Hosting is current TeamAi web delivery authority.
- GitHub Pages is validation-only static browser publication for the spatial UI.
- Vercel is **paused/cut off by current policy** and must not be resumed without explicit user approval.

## Read/write economy

The engineering rule is:

**EDIT is not SAVE. STREAMING is not PERSISTENCE. CACHE is not AUTHORITY.**

Settings changes accumulate in a local draft and become durable only at explicit Save. A save with no changes performs no durable mutation. A successful save becomes the new local comparison baseline.

Web AI transcript state follows the same economy: typing and streaming stay local; a human submit or completed Web AI response becomes one durable conversation turn. The orchestrator loads an existing transcript once per run and reuses a local working set instead of repeatedly re-reading the same transcript for each AI response.

Terminal result persistence does not perform a read-only `hasResult()` preflight. The result document is create-only, so the write itself is the uniqueness boundary. Google service-account access tokens are cached in-process rather than exchanged for every operation.

Full operational detail is in `docs/TEAM-BACKEND-002_READ_WRITE_ECONOMY.md`.

## Merged implementation frontier

The 029 spatial progression currently present on `main` remains the established Shell → Deck → F7 → Workplace → Seats → Planning → Working → Approvals → Artifacts → Settings composition.

The backend execution progression currently present on `main` is:

`ProviderRuntime gate → task execution gate → authorization + durable domain state + scheduler eligibility + runtime bridge → concrete Firestore lease transaction (live-proven single-winner) → AtomicTaskLeaseStore adapter → durable execution-result store (live-proven persist + restart retrieval) → authenticated teamai-task-execute Edge path (live-proven) → read/write economy controls`

These are bounded implementation slices and do **not** by themselves establish full 029 completion or full TEAM-BACKEND-001 completion.

## Backend reality

The backend foundation now includes Firebase UID-rooted paths, durable task/event state, deterministic Seat eligibility, explicit authorization, atomic lease contract, scheduler-to-execution bridge, trusted ProviderRuntime execution, and a concrete server-side Firestore transaction implementation for `ready → leased` task acquisition.

The concrete Firestore lease boundary is deliberately split: `FirestoreLeaseTransaction` owns transaction mechanics, while `FirestoreAtomicTaskLeaseStore` maps the result into the canonical scheduler lease contract. It carries explicit Firebase UID, workplace, and TeamAi project scope; TeamAi `projectId` is not treated as the Firebase infrastructure project ID.

Terminal execution results are modeled separately from task events and persisted under the same UID/workplace/project/task hierarchy, keyed by terminal event identity. The execution service persists the normalized result before appending the terminal `COMPLETE` or `FAIL` event. Create-only semantics prevent silent replacement of a previously durable terminal result.

TEAM-BACKEND-002 adds a direct result retrieval contract for restart recovery and a create-only durable conversation-turn store for the Web AI transcript boundary.

**Live evidence (2026-09-05):** workflow run [#7](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/33981670897) on `main` proved:

1. Isolated READY task create under scoped UID/workplace/TeamAi project.
2. Two concurrent worker processes; **exactly one** lease winner.
3. Durable terminal result persist.
4. Fresh process retrieves result by `(taskId, projectId, eventId)` after “restart.”
5. Cleanup of probe documents.

**Live evidence (2026-09-06):** Supabase Edge Function `teamai-task-execute` was invoked from Cloud Shell with a fresh Firebase ID token against `workplaceId=e2e-probe-003` and `projectId=e2e-project-003`.

The observed response was:

- HTTP `201`
- `ok=true`
- `phase=complete`
- `taskId=exec-f3d8f07f-354354`
- `leaseId=lease-f3d8f07f-354354`
- `eventId=complete-f3d8f07f-354354`
- `provider=stub-edge-runtime`

The emitted result path was UID/workplace/project/task scoped. The Edge function only returns the `201` success response after persisting the create-only execution result and marking the task completed.

Commit writes use Firestore **resource names** (not full `https://` URLs). Worker children inherit `TEAMAI_LIVE_RUN_ID` / `TEAMAI_LIVE_TASK_ID` / `TEAMAI_LIVE_RESULT_EVENT_ID` so they do not regenerate a different task identity.

All unit/contract tests remain source-level evidence. Run #7 is the runtime proof for contention + recovery; the 2026-09-06 Edge call is the runtime proof for the bounded authenticated task-execute path.

The existing `teamai-domain-bootstrap` runtime remains the live authenticated UID → Firestore domain hierarchy proof.

Evidence record: `docs/evidence/TEAM-BACKEND-001_EDGE_RUNTIME_PROOF_2026-09-06.md`

## Live recovery probe

Manual workflow: `.github/workflows/firestore-live-recovery.yml`  
Script: `scripts/firestore-live-contention-recovery.mjs`

**Status: RUNTIME-PROVEN** (run #7, conclusion `success`).

Required repository secrets (names only; never commit values):

- `TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON`
- `TEAMAI_FIREBASE_TEST_UID`
- `TEAMAI_FIREBASE_TEST_WORKPLACE_ID`
- `TEAMAI_FIREBASE_TEST_PROJECT_ID`

Hard-coded in workflow env: `TEAMAI_FIREBASE_PROJECT_ID=team-ai-official`.

## Remaining TEAM-BACKEND-001 frontier

1. ~~Successful live Firestore transactional lease exercise with two concurrent workers proving single-winner behavior.~~ **DONE (run #7).**
2. ~~Successful restart/recovery proof after a fresh process loses its in-memory state.~~ **DONE (run #7).**
3. ~~Successful live durable result retrieval after process restart.~~ **DONE (run #7).**
4. ~~Bounded authenticated `teamai-task-execute` Edge runtime path.~~ **DONE / RUNTIME-PROVEN (2026-09-06).**
5. Final audit/traceability, HandOver, and Endorsement evidence for TEAM-BACKEND-001.
6. Full authenticated product-path integration beyond the bounded Edge slice, including any required scheduler/approval contract integration not exercised by this operator call.
7. Separate live PayPal sandbox transaction/webhook runtime evidence.

## Frontend reality

The spatial frontend remains fixture-backed presentation. Fixtures are presentation content, not durable domain authority. Backend-owned read-model integration is still a separate controlled slice.

## Known brittle points

### 1. Canonical-state drift
Keep documentation synchronized with the implementation frontier without promoting partial gates into full completion.

### 2. Branch accumulation
Before reusing any non-main branch, compare it with current `main` and classify it.

### 3. Frontend/backend contract boundary
Do not inject browser Firebase/domain behavior ad hoc. Consume backend-owned read models and trusted runtime facts through explicit contracts.

### 4. Firestore write-authority boundary
Browser writes must not become scheduler or execution authority.

### 5. Concurrency and recovery
Transactional lease + durable result + restart retrieval are **live-proven** for the isolated probe path. The bounded authenticated Edge task-execute path is now also **live-proven**. Broader authenticated product-path scheduler/approval integration remains open.

### 6. PayPal evidence frontier
Gate 5C implementation/available-environment verification is complete as a source boundary; live transaction/webhook runtime evidence remains outstanding.

### 7. Dual API-server ambiguity
`src/main.ts` launches `src/api/server.ts`. `src/server.ts` remains present and must not be removed without dependency proof and explicit reconciliation.

### 8. Firestore commit `name` format
Commit writes must use resource names `projects/{id}/databases/(default)/documents/...`, not full HTTPS URLs. GET/PATCH HTTP endpoints still use the full URL.

## Rules for high-concurrency agents

1. `main` is the baseline for current work.
2. Before reusing an old branch, compare it with current `main`.
3. Do not merge based on branch naming, stale PR descriptions, or old screenshots.
4. A PR must identify governing Masterplan item, concrete skill routing, verification scope, and limitations.
5. Do not turn fixture UI into claimed live domain behavior without an explicit integration contract and runtime evidence.
6. Do not create page-local Product Law, scheduler, identity, entitlement, commerce, or durable-state authority.
7. Do not resume Vercel without explicit user approval.

## Immediate next gate

**TEAM-BACKEND-001 — final audit/traceability + HandOver/Endorsement, with remaining broader integration and separate PayPal evidence kept distinct.**

The bounded `teamai-task-execute` authenticated Edge runtime gate is now **RUNTIME-PROVEN** and should not be re-run merely to increase confidence. Reuse the recorded evidence unless a defined regression requires a new test.

Out of scope for the next slice unless explicitly approved:

`browser Firestore write authority, provider-to-provider orchestration, PayPal live activity, Vercel activation, Product Law rewrite, second frontend theme/root, Turso or alternate DB migration.`

## Evidence language

Use precise state labels:

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade a state label by implication.
