# TeamAi — Current State Control Index

**Status:** CANONICAL RECOVERY / EXECUTION INDEX  
**Revision basis:** `main` @ Hero contribution absorption ([PR #107](https://github.com/RbrtMrlsIII/TeamAi/pull/107), `903bc014…`) plus manufactured light rig (#104), authenticated `teamai-task-execute` live proof, Firestore contention/recovery run #7, PayPal Sandbox + aggregate re-read. `TEAM-BACKEND-001` remains **ENDORSED** for the bounded recorded scope.

This document is a compact operational index for agents. It does not replace Product Law, Masterplan, Policy/ORUCAVEAM, concrete skills, implementation contracts, verification evidence, HandOver, Endorsement, or live runtime proof.

## Authority order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/** → implementation → verification → evidence → HandOver / Endorsement`

## Current execution posture

- `TEAM-BACKEND-001`: **ENDORSED for bounded recorded scope**. Live lease contention/recovery, authenticated `teamai-task-execute`, PayPal Sandbox delivery/HTTP 200, and post-v13 Firestore aggregate re-read are RUNTIME-PROVEN. Broader authenticated product-path integration remains distinct.
- `TEAM-BACKEND-002`: **IMPLEMENTED** on `main`.
- `TEAM-EXPERIENCE-029`: **presentation inhabited**. Command Deck remains fixture-backed. Hero slices 1–3 (theme-lighting adapter, manufactured light rig, contribution corridor / absorb / traces) are on `main` as **presentation-only**. Issue #86 implementation is merged; formal HandOver/Endorsement for the Hero ladder may still be recorded. Seat Identity Inspection remains its own gate.
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

Full operational detail is in `docs/TEAM-BACKEND-002_READ_WRITE_ECONOMY.md`.

## Merged implementation frontier

The 029 spatial progression on `main` remains Shell → Deck → F7 → Workplace → Seats → Planning → Working → Approvals → Artifacts → Settings, plus presentation-only Hero:

- Theme → lighting via `frontend/spatial/hero-theme-lighting-adapter.js` (one theme root only)
- Manufactured light rig + WebGL Hero (`public/hero-flex.js`, authored meshes)
- Lifecycle `FOCUS → ACTIVE → CONTRIBUTE → ABSORB → REFLECT → HANDOFF` with workspace traces (#107)

Hero uses the existing spatial skill family. **There is no 3D Hero skill and no second theme root.**

Backend execution on `main`:

`ProviderRuntime gate → task execution gate → authorization + durable domain state + scheduler eligibility → Firestore lease (live-proven) → durable execution-result store (live-proven) → authenticated teamai-task-execute (live-proven) → read/write economy controls`

## Live PayPal commerce evidence

**Status:** bounded isolated runtime gate **RUNTIME-PROVEN**.

Canonical path: `accounts/{uid}/commerce/{correlationId}` (+ events, entitlements, correlation index).

Recorded 2026-09-06: correlationId `68b4ef3a-4132-46bf-8a01-43ebe97ba51e`; provider event `WH-71666988RB043112X-1WA30416DF8293903`.

Re-read workflow: `.github/workflows/firestore-commerce-aggregate-read.yml` — run #1 attempt 2 (`34089143256`) passed.

Evidence: `docs/evidence/TEAMAI_COMMERCE_PAYPAL_RUNTIME_PROOF_2026-09-06.md`

## TEAM-BACKEND-001 conclusion

Bounded recorded gates DONE / ENDORSED. Broader authenticated product-path scheduler/approval integration remains open.

## Frontend reality

Spatial frontend remains fixture-backed except local theme/Hero presentation. Do not turn fixture UI into claimed live domain behavior. Hero remains presentation-only until a later gate explicitly joins live domain.

## Known brittle points

1. Canonical-state drift.
2. Branch accumulation.
3. Frontend/backend contract boundary.
4. Firestore write-authority boundary.
5. Broader product-path scheduler/approval integration remains open.
6. Dual API-server: `src/main.ts` launches `src/api/server.ts`; `src/server.ts` remains.
7. Firestore commit `name` format must be resource names, not HTTPS URLs.

## Rules for high-concurrency agents

1. `main` is the baseline.
2. Before reusing an old branch, compare it with current `main`.
3. Do not merge based on branch naming or stale screenshots.
4. A PR must identify governing Masterplan item, skill routing, verification, and limitations.
5. Do not turn fixture UI into claimed live domain behavior.
6. Do not create page-local Product Law, scheduler, identity, entitlement, commerce, or durable-state authority.
7. Do not resume Vercel without explicit user approval.
8. Do not add a 3D Hero skill.
9. Hero 3D dependencies (theme, lighting, motion, camera, reduced-motion) stay code-bound to the single theme root and existing spatial skills — no parallel engine skill.

## Immediate next gate

Priority suggestions (pick one track):

1. **Hero #86 evidence/HandOver** — close Issue #86 formally if acceptance criteria are met.
2. **Seat Identity Inspection** — next 029 presentation gate after backend hold cleared.
3. **Broader product-path** — authenticated scheduler/approval integration (larger; separate from Hero).

Out of scope unless explicitly approved:

`browser Firestore write authority, provider-to-provider orchestration, Vercel activation, Product Law rewrite, second frontend theme/root, Turso or alternate DB, a 3D Hero skill, simultaneous full dark-glassmorphism pass as a second visual system.`

## Evidence language

`PLANNED → IMPLEMENTED → DEPLOYED → RUNTIME-PROVEN → LEARNED → COMPLETED`

Do not upgrade a state label by implication.
