# TeamAi — Current State Control Index

**Status:** CANONICAL RECOVERY / EXECUTION INDEX  
**Revision basis:** `main` @ post-#59 (TEAM-BACKEND-002 merged).

This document is a compact operational index for agents. It does not replace Product Law, Masterplan, Policy/ORUCAVEAM, concrete skills, implementation contracts, verification evidence, HandOver, Endorsement, or live runtime proof.

## Authority order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/** → implementation → verification → evidence → HandOver / Endorsement`

## Current execution posture

- `TEAM-BACKEND-001`: **IN IMPLEMENTATION**; scheduler/domain-state contracts, runtime bridge, concrete Firestore lease transaction source, `AtomicTaskLeaseStore` adapter, durable execution-result persistence source, and live-proof probe/workflow preparation are implemented; successful live Firebase contention/restart evidence, authenticated end-to-end execution wiring, and PayPal runtime evidence remain open.
- `TEAM-BACKEND-002`: **IMPLEMENTED ENGINEERING SLICE on main**; settings draft/save boundary, conversation-turn durability contract, transcript working-set read reduction, result retrieval, and token-cache/read-write economy rules are on main after #59.
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

**EDIT is not SAVE. STREAMING is not PERSISTENCE. CACHE is not AUTHORITY.**

Settings changes accumulate in a local draft and become durable only at explicit Save. A save with no changes performs no durable mutation. A successful save becomes the new local comparison baseline.

Web AI transcript state follows the same economy: typing and streaming stay local; a human submit or completed Web AI response becomes one durable conversation turn. The orchestrator loads an existing transcript once per run and reuses a local working set instead of repeatedly re-reading the same transcript for each AI response.

Terminal result persistence does not perform a read-only `hasResult()` preflight. The result document is create-only, so the write itself is the uniqueness boundary. Google service-account access tokens are cached in-process rather than exchanged for every operation.

Full operational detail: `docs/TEAM-BACKEND-002_READ_WRITE_ECONOMY.md`.  
New sessions: `docs/START_HERE_FOR_NEW_SESSIONS.md`.  
Skill: `skills/backend/read-write-economy/SKILL.md`.

## Merged implementation frontier

The 029 spatial progression on `main` remains Shell → Deck → F7 → Workplace → Seats → Planning → Working → Approvals → Artifacts → Settings.

Backend progression on `main`:

`ProviderRuntime gate → task execution gate → authorization + durable domain state + scheduler eligibility + runtime bridge → Firestore lease transaction → AtomicTaskLeaseStore adapter → durable execution-result store → restart retrieval contract → read/write economy controls`

These slices do **not** by themselves establish full 029 completion or TEAM-BACKEND-001 completion.

## Backend reality

Firebase UID-rooted paths, durable task/event state, Seat eligibility, authorization, atomic lease, scheduler-to-execution bridge, ProviderRuntime, and concrete Firestore `ready → leased` transactions are implemented in source.

`FirestoreLeaseTransaction` owns transaction mechanics; `FirestoreAtomicTaskLeaseStore` maps into the scheduler lease contract. TeamAi `projectId` is not the Firebase infrastructure project ID.

Terminal results persist under UID/workplace/project/task hierarchy, keyed by terminal event identity, **before** COMPLETE/FAIL. Create-only prevents silent overwrite.

Conversation turns and configuration drafts follow the economy rules above.

All current Firestore tests are **source-level**. They are not live Firebase runtime proof.

## Live recovery probe

`.github/workflows/firestore-live-recovery.yml` runs `scripts/firestore-live-contention-recovery.mjs` (workflow_dispatch only).

The probe: creates an isolated READY task → two concurrent workers → one lease winner → durable terminal result → fresh recovery process retrieves by identity → cleanup.

Loser may see `CONFLICT` or `NOT_READY`; invariant is **one winner only**.

Secrets (names only — never in source):

- `TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON`
- `TEAMAI_FIREBASE_TEST_UID`
- `TEAMAI_FIREBASE_TEST_WORKPLACE_ID`
- `TEAMAI_FIREBASE_TEST_PROJECT_ID`

## Remaining TEAM-BACKEND-001 frontier

1. Successful live two-worker lease (single winner).
2. Successful restart/recovery after process loss of memory.
3. Successful live durable result retrieval after restart.
4. Authenticated end-to-end UID → scheduler → lease → approval → execution → evidence.
5. Final audit/traceability, HandOver, Endorsement.
6. Separate live PayPal sandbox transaction/webhook evidence.

## Frontend reality

Spatial frontend remains fixture-backed presentation. Fixtures are not durable domain authority.

## Known brittle points

1. Canonical-state drift — keep docs aligned without promoting labels.
2. Branch accumulation — compare non-main branches to current main.
3. Frontend/backend contract — no ad hoc browser domain authority.
4. Firestore write-authority — browser must not own scheduler/execution writes.
5. Concurrency/recovery — source ready; live evidence still required.
6. PayPal live evidence still open.
7. Dual API entry (`src/main.ts` vs `src/server.ts`) — do not delete without proof.

## Rules for high-concurrency agents

1. `main` is the baseline.
2. Compare old branches to current main before reuse.
3. Do not merge from stale descriptions or screenshots alone.
4. PRs name Masterplan item, skill routing, verification scope, limitations.
5. Fixtures ≠ live domain.
6. No page-local Product Law / scheduler / entitlement authority.
7. Do not resume Vercel without explicit user approval.
8. Do not revive closed PR #50.

## Immediate next gate

**TEAM-BACKEND-001 — live Firestore concurrency/recovery + durable result retrieval.**

Scope: `verified Firebase UID → task read → transactional lease → approval → trusted execution → durable result/event → restart recovery`

Out of scope: browser Firestore authority, provider-to-provider orchestration, PayPal activity, Vercel, Product Law rewrite, second theme root.

## Evidence language

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade a state label by implication.
