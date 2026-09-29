# PR #404 — Evidence Registry

**Historical implementation vehicle:** PR #404 (merged 2026-09-28)  
**Active continuation vehicle:** PR #424 `frontend/029-spatial-world-continuation`  
**Governing issue:** #405  
**Purpose:** one canonical evidence index for the 029 spatial reconstruction program.

This file is the **evidence ledger**, not a second roadmap. The detailed construction checklist remains in [TEAMAI_3D_WORLD_404_CHECKLIST.md](./TEAMAI_3D_WORLD_404_CHECKLIST.md), the ownership map remains in [TEAMAI_3D_WORLD_404_AUTHORITY_MATRIX.md](./TEAMAI_3D_WORLD_404_AUTHORITY_MATRIX.md), and the broader construction contract remains in [TEAMAI_3D_WORLD_MASTER_CONSTRUCTION_PLAN.md](../docs/TEAMAI_3D_WORLD_MASTER_CONSTRUCTION_PLAN.md).

## How the evidence system works

Use three layers, in this order:

1. **Successor PR** = newcomer-readable navigation and current-state summary for the post-#404 continuation; PR #404 remains historical provenance.
2. **Masterplan/** = durable execution status plus evidence references.
3. **Source / tests / CI artifacts** = primary proof.

A checkbox is a **status marker**, not the proof itself. A proof claim is admissible only when it points to a concrete source, test, exact-head run, artifact, or controlled runtime observation.

Evidence state remains:

IMPLEMENTED → REPOSITORY-VERIFIED → LIVE-DEPLOYED → RUNTIME-PROVEN → HUMAN-ACCEPTED

A higher state does not follow automatically from a lower one.

## Historical latest validated spatial implementation anchor

> This anchor belongs to the merged PR #404 lineage. It is preserved as immutable provenance and must not be treated as current #424 proof.

- **latest validated spatial implementation head from the pre-continuation evidence ledger:** f4132eb5e3f6c5d730d698a6cbf6d72586e514cc
- **main at that historical validation point:** 76da305f0ec3efb3d368b22fb70748f0051f4d15
- **historical interpretation:** the evidence below is retained from the #404 vehicle and is not current continuation acceptance.

## Current continuation evidence state

- **Active vehicle:** PR #424 `frontend/029-spatial-world-continuation`
- PR #404 is merged into `main` as `13356cae7e6ef8179f7e2e552211bb4d187f37fb`.
- The first post-#404 source behavior slice on #424 routes renderer material aliases through `authoredHeroMaterialSet`; source/public material and renderer mirrors are byte-identical.
- Historical #404 evidence remains immutable provenance and must not be relabeled as #424 proof.
- Fresh exact-head Governance, Full-System, Security, Deep Security, and Canonical Browser evidence is required for the S24 continuation.

- **main at that validation point:** 76da305f0ec3efb3d368b22fb70748f0051f4d15
- **at that validation point:** #404 was **290 commits ahead / 0 behind**
- **PR state:** OPEN / DRAFT / GitHub reports mergeable
- **full project tests:** **1,117 passed / 0 failed / 0 skipped**
- **canonical browser verification:** **PASS, 76 passed / 4 skipped**
- **security/governance checks:** PASS
- **review-readiness:** SKIPPED because the PR remains Draft. This is lifecycle state, not approval.
- **evidence note:** later documentation-only commits may advance the branch head without changing this implementation anchor.

## Current decision and findings register — 2026-09-29

This section prevents material engineering decisions from existing only in chat. It is a compact evidence/decision register, not a second roadmap.

| ID | Decision / finding | Current status | Durable implication |
|---|---|---|---|
| D-029-01 | #424 is the sole active 029 spatial continuation after merged #404; global current slice remains #401 | ACCEPTED / CURRENT | spatial work stays bounded in #424 and does not absorb backend/runtime authority |
| D-029-02 | S4 compact-radius regression required owner-side factor max(1.66, 0.9 + 1.3 × expansion) | REPAIRED / VERIFIED | do not restore the old formula or weaken geometry tests |
| D-029-03 | Y0 feature/leaf descent precedes further spatial expression | GOVERNED | terminal controls/payloads must be inventoried before physical completion is treated as final |
| D-029-04 | Y1 target renderer substrate is Three.js + WebGL2 with one scene/canvas/renderer/animation/camera authority | GOVERNED / NOT IMPLEMENTED | migrate by adapter stages; raw WebGL remains transition architecture until parity/proof |
| D-029-05 | Post-S26 visual checkpoint is VC1/AB1, non-blocking, while S33 remains final polish | GOVERNED | qualitative coherence is observed before late polish and is not a new roadmap slice |
| D-029-06 | Current Browser failure is a legacy machine-core-preview temporal contract, not S4 geometry proof | DIAGNOSED / OPEN | fix deterministic state/clock boundary; no arbitrary sleeps and no assertion weakening |
| D-029-07 | Material project decisions must be promoted from chat into #409, this evidence ledger, the checklist, WIRING, or the owning Issue/PR according to ownership | GOVERNED | no chat-only decision is treated as project truth |
| D-029-08 | S6 physically allocates 11 non-Seat product facilities, but four S6 source references do not resolve to matching frontend/spatial modules (projects-library, skills-responsibility, orchestration-scheduler, auth-gateway) | Y0 GAP / EXPLICIT | physical dock presence is not leaf coverage; resolve real owning UI/read-model contracts before inventing spatial subassemblies |
| D-029-09 | Three S6 facility IDs used labels (orchestration-scheduler, settings-control, authentication-gateway) instead of canonical Feature Registry IDs | REPAIRED / VERIFIED | S6 facility identity now uses canonical ids (orchestration, settings, auth-gateway); sourceModule remains descriptive/non-authoritative |
| D-029-10 | Y1 target renderer package candidate was resolved to three@0.186.1 from the npm registry; the package exports a WebGL renderer and the upstream WebGL capability surface targets WebGL2 | ACCEPTED / IMPLEMENTED SUBSTRATE | pin the exact package version, generate browser runtime modules during build, and keep the adapter outside semantic/geometry authority |
| D-029-11 | Y1 adapter converts actual S2 Core + S3 Seat 1 descriptors into one Three.js scene in an isolated proof surface before production Hero migration | IMPLEMENTED / BROWSER-PENDING ON CURRENT HEAD | production Hero renderer remains unchanged until fixed-state parity/performance/rollback evidence exists |

### Application-head verification recorded before documentation sync

Application head 208c5570a8325bda10e2b427b97a30c3f439f111 recorded:
- Governance rerun 36542676832: PASS
- Full-System / canonical package 36542509326: PASS
- Security-family checks: PASS
- Evidence consistency: PASS
- Playwright Browser workflow 36542509289: in progress at last observation

The earlier Browser failure on 2258a910 was isolated to tests/e2e/machine-core.spec.ts:21. Branch selection started the standalone preview's expansion path before the explicit Expand action. The owning preview/controller repair is contained in commit b485342f3cf71718c2c154d1224fdbd28ad834f8, with the Y0 registry classifier following in 208c5570a8325bda10e2b427b97a30c3f439f111.

This final documentation synchronization is documentation-only relative to application head 208c5570. Exact-head CI must still be refreshed for the resulting documentation head before the repository is described as fully green.
## Evidence index

### E404-BASE — branch and authority reconciliation

**Claim:** The current spatial branch has been reconciled to current main without mixing advisory-control-plane work into the spatial implementation.

**Primary evidence**
- [Reconciliation commit 8944ece](https://github.com/RbrtMrlsIII/TeamAi/commit/8944ececfd6dfee15a39833107dd3bac932411bd)
- [#404 base-reconciliation checkpoint](https://github.com/RbrtMrlsIII/TeamAi/pull/404#issuecomment-5826894819)
- The 97ea7f9 → 8944ece comparison contains 12 commits and changes only governance/control-plane surfaces.

**Interpretation:** branch-state evidence only. It does not imply 029 completion.

### E404-GEOM — A4 / S4 / S5 articulated geometry and clearance

**Claim:** The earlier radial-envelope issue was followed by explicit authored geometry, articulated subject derivation, intermediate travel sampling, and dense clearance proof.

**Proof history**
- 4549914 — structural outer-facility clearance envelope
- ef22968 — seat/division envelope balancing
- 965f0fb — structural safety envelopes for S5
- 35f3443 — physical subjects derived from articulated component geometry
- 13a8064 — canonical division geometry sampled through expansion travel
- 05c897d — articulated subject-envelope tests
- d8cb9e9 — sampled expansion-clearance proof on actual geometry
- 0b6753f / d248eb4 — exact dense-collision diagnosis and subject tracing
- 8adba6c / df26908 — authored travel-angle preservation and regression proof
- d264df5 — diagnostic cleanup

Representative exact commits:
- https://github.com/RbrtMrlsIII/TeamAi/commit/35f34431345828e22efbfef0e9ec641ff36ba5fd
- https://github.com/RbrtMrlsIII/TeamAi/commit/13a8064130688276397655265bb3141ece736abd
- https://github.com/RbrtMrlsIII/TeamAi/commit/05c897d1807db6afdb63cd41d423b06a62f9b871
- https://github.com/RbrtMrlsIII/TeamAi/commit/d8cb9e901e98be6dbdea3dec97fd78c92763b7ed
- https://github.com/RbrtMrlsIII/TeamAi/commit/0b6753feca865eabf402ffe2ef37edf11d489508
- https://github.com/RbrtMrlsIII/TeamAi/commit/d248eb4967e7ba1488fc57e780a42c68dad6cc90
- https://github.com/RbrtMrlsIII/TeamAi/commit/8adba6cdc0a6a31f82bdbb2574ec17a9877dc0c8

**Current implementation anchors**
- frontend/spatial/seat-division-geometry.js
- frontend/spatial/machine-seat-division-presentation.js
- frontend/spatial/machine-seat-division-assembly.js
- frontend/spatial/machine-expansion-mechanism.js
- frontend/spatial/hero-world-profile.js

**Exact-head regression evidence**
- S4 physical subjects follow authored attachment translation and rotation
- S5 clearance samples canonical intermediate subjects instead of only endpoint envelopes
- S5 division subject sampling matches the owning S4 assembly at intermediate travel
- S5 full Seat-density expansion stays clear of all authored machine obstacles
- S5 real Seat-01 envelope plans are bounded against the existing outer facility ring

**Current S5 matrix**
- Seat populations: 1–10
- shell expansion states: 0 / 0.5 / 1
- divisions: all 7
- obstacles: outer housings + sibling Seat Pods
- required outcome: closed clearance satisfied, no collision, maxSafeAmount = 1

The planner samples 64 points across the travel interval and binary-refines the first collision interval. The collision model is conservative AABB subject clearance, not triangle-level mesh collision. That limitation is explicit.

### E404-NUMERIC — current world-profile geometry values

The authored profile and the effective runtime safety envelope are intentionally distinct.

At 10 Seats:

| Quantity | Value |
|---|---:|
| authored Seat-shell radius | 4.55 |
| runtime closed Seat-shell radius | 5.05 |
| runtime fully expanded Seat-shell radius | 5.55 |
| authored outer-housing radius | 7.15 |
| runtime closed outer-housing radius | 9.85 |
| runtime fully expanded outer-housing radius | 10.55 |
| full-expansion division radial offset | 2.948 |
| full-expansion Seat + division radial-center reach | 8.498 |
| radial-envelope margin before component extents | 2.052 |
| maximum-density closed adjacent Seat spacing | ≈2.812 |
| maximum-density fully expanded adjacent Seat spacing | ≈3.430 |
| Pod maximum horizontal dimension | 1.34 |

The old 7.998 figure is historical geometry from the earlier/raw profile. It is not the current runtime envelope.

Primary sources:
- [hero-world-profile.js](https://github.com/RbrtMrlsIII/TeamAi/blob/8944ececfd6dfee15a39833107dd3bac932411bd/frontend/spatial/hero-world-profile.js)
- [machine-core-layout.js](https://github.com/RbrtMrlsIII/TeamAi/blob/8944ececfd6dfee15a39833107dd3bac932411bd/frontend/spatial/machine-core-layout.js)

### E404-S0 — baseline freeze and formal S0–S10 ledger reconciliation

**Claim:** The 029 baseline is frozen as a truthful, replaceable implementation baseline, and the current S0–S10 ledger is reconciled without converting repository capability evidence into premature release completion.

**Audit basis**
- current #404 repository state before this documentation reconciliation: `0e07fad0ff00503491d9b65a3938f9514b771f31`
- canonical `main`: `76da305f0ec3efb3d368b22fb70748f0051f4d15`
- reviewed #398 merge baseline: `87f466fb0edac3784280128785a8fd2dc757e749`

**Authority sources inspected**
- `Product_Law/PRODUCT_LAW.md`
- Issue #278 — 029 product-experience execution ledger
- Issue #396 — 029 spatial construction guide
- Issue #400 — canonical frontend/product contract
- Issue #392 — Seat budget / handoff / continuation authority
- Issue #83 — visual/material direction
- `Masterplan/MASTERPLAN.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.{csv,json,md}`
- `docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml`
- `Masterplan/TEAMAI_3D_WORLD_404_AUTHORITY_MATRIX.md`

**Frozen baseline inventory**
- Top-level physical machine composition: **1 HUB-CORE + up to 10 Seat/Pod assemblies + 4 outer facility housings**. Internal authored component roles remain owned by their existing S2/S3/S6/S7 assemblies.
- Semantic domain tree remains `Account → Workplace → Project → Seat`.
- Hero Seat hierarchy remains `Seat Shell → Connection → Behavior → Toolkit → Capabilities → Authorization → Workspace Scope → Task/Evidence`.
- Seat division inventory remains the seven authored divisions: `SEAT_CONNECTION`, `SEAT_BEHAVIOR`, `SEAT_TOOLKIT`, `SEAT_CAPABILITIES`, `SEAT_AUTHORIZATION`, `SEAT_WORKSPACE_SCOPE`, `SEAT_TASK_EVIDENCE`.
- Product facilities remain broader than the Seat hierarchy and are not converted into invented Seat children.
- Geometry ownership remains separated between authored world profile/core layout, S4 division assembly/presentation, S5 expansion mechanism, S6 facility assembly, S7 facility machinery, and camera subjects.
- Choreography ownership remains partitioned across semantic hierarchy state, physical expansion, S8 topology, S9 signal projection, S10 camera specification, and the renderer/controller orchestration boundary.
- Aggregate topology remains owned by `frontend/spatial/machine-world-topology.js`; renderable connections remain projections of semantic edges.
- Browser entrypoints remain the classic public entrance at `/` plus the direct world surface at `/hero/`, with `public/experience-rebaseline.js` owning layer/route choreography and `public/hero-flex.js` owning the controller/input boundary.
- Active structural implementation is in `frontend/spatial/*` with synchronized public delivery copies; historical material remains under `docs/archive/` and retired routing is not treated as active authority.
- The available endorsed visual reference is `assets/3D_Vision/hailuo.mp4`, explicitly non-authoritative and interpreted by `docs/TEAMAI_3D_HERO_VISION_REFERENCE_HAILUO.md`. The archived PRE-029 reference board `docs/spatial-exploration/TEAM-EXPERIENCE-027-SPATIAL-EXPLORATION-REFERENCE-BOARD.png` remains preserved as archive material.
- No unavailable video timing is inferred. Current timing values remain implementation measurements / starting values until final browser evidence establishes a better motion contract.

**Formal ledger decision**
- **S0: CLOSED** as a baseline-freeze/inventory slice.
- **S1: PARTIAL / OPEN** because state/effect projection remains deliberately unresolved until S9/S28/S29.
- **S2: CAPABILITY PROVEN / FORMAL EXIT OPEN**.
- **S9: CAPABILITY PROVEN / FORMAL EXIT OPEN**.
- **S10: CAPABILITY PROVEN / FORMAL EXIT OPEN**.
- S3–S8 remain repository-verified capabilities under their existing evidence records; they are not reopened.

**Status:** RECONCILED. This record distinguishes baseline closure from implementation completion and preserves the remaining formal gaps without creating a new implementation authority.


### E404-S1 — root inheritance and authority

Primary evidence:
- frontend/spatial/machine-spatial-root-contract.js
- Masterplan/TEAMAI_3D_WORLD_404_AUTHORITY_MATRIX.md
- exact-head project tests

The root contract validates the expected structural prefix, not merely the presence of a root field. The authority matrix separates semantic hierarchy state, physical expansion, physical assembly, topology, camera specification, and renderer projection.

The S1 state/effect ownership row intentionally remains open until the later state/effect owners are reconciled.

### E404-S2 — Central Core

Repository capability evidence:
- frontend/spatial/machine-core-assembly.js
- tests/machine-core-assembly.test.mjs
- layered core + root ownership test
- concentric mechanism monotonicity test
- fail-closed ownership corruption test
- seat-ring clearance rejection test

The current core contains six authored component roles and four semantic ports.

**Status:** repository-proven capability. Formal S2 completion remains a separate acceptance gate.

### E404-S3 — Pod assembly

Repository evidence:
- frontend/spatial/machine-pod-assembly.js
- tests/machine-pod-assembly.test.mjs
- exact-head tests for 1–10 Seat population, payload density, maximum-density clearance, local interfaces, identity, and root ownership

**Status:** implemented and repository-verified capability.

### E404-S4 — Division assembly

Seven authored division families are represented by distinct component profiles and attachment mechanisms.

Primary source:
- frontend/spatial/machine-seat-division-assembly.js

Primary tests:
- tests/machine-seat-division-assembly.test.mjs

The current S4 assembly preserves semantic identity while allowing physical articulation to change with expansion.

**Status:** implemented and repository-verified capability, with A4 geometry proof linked through E404-GEOM.

### E404-S5 — Expansion

Primary source:
- frontend/spatial/machine-expansion-mechanism.js

Physical expansion owns travel, clearance, corridor-reservation projection, and subject sampling. Semantic OPEN/CLOSE state remains elsewhere.

Exact-head tests cover PREPARING, OPENING, ACTIVE, CLOSING, interruption, reduced motion, endpoint sampling, intermediate sampling, the dense 1–10 matrix, outer-facility clearance, and sibling-Pod clearance.

**Status:** implemented and repository-verified capability. Final acceptance remains separately gated.

### E404-S8 — Topology and corridors

Primary source:
- frontend/spatial/machine-world-topology.js

Exact-head tests establish:
- 70 division edges at 10 Seats
- 10 facility edges
- 4 facility↔facility edges
- 4 workspace contribution edges
- 9 adjacent-Seat edges
- unique semantic edge identities
- route continuity
- reserved corridors tied to semantic edges
- dynamic rerouting with expansion
- core-route obstacle validation across 1–10 Seats and shell states

**Status:** implemented and repository-verified capability.

### E404-S9 — Signal projection

Primary source:
- frontend/spatial/machine-signal-state.js

Exact-head tests prove that signal state requires a real semantic edge, then cover active Seat, active branch, contribution transfer, workspace receiving, absorb/reflect, handoff, waiting, blocked/error, reduced motion, and semantic idleness of inactive declared edges.

**Status:** implemented and repository-verified capability. Full S1 state/effect closure and later product choreography remain open.

### E404-S10 — Camera

Primary source:
- frontend/spatial/machine-camera.js

Exact-head tests prove world, pod, division, facility, expansion, and return modes; Workspace → canonical S2 Core subject; root inheritance; division focus → authored subject envelope; safe pod fallback; deterministic overhead framing.

**Status:** implemented and repository-verified capability. Continuous tree travel and final camera acceptance remain later gates.

### E404-S11 — Guest machine

**Claim:** S11 is a coherent guest showroom boundary over the existing S0–S10 machine, with ten-slot presentation capacity, limited guest interaction, automatic world orbit, and authentication handoff that stops guest orbit without granting backend authority.

**Primary implementation**
- frontend/spatial/machine-guest-state.js — canonical S11 guest-state projection
- public/machine-guest-state.js — browser-delivered synchronized copy
- public/_flex_src/hero-flex.base.js — canonical Hero controller/input boundary
- public/hero-flex.js — browser runtime artifact
- public/experience-rebaseline.js — classic entrance → world transition and auth intent wiring
- public/hero-auth-handoff.js — presentation-only Login / Sign up handoff
- public/index.html — public entrance and world surfaces
- frontend/spatial/seat-capacity.js — canonical 1–10 Seat capacity rule

**Exact-head evidence — 2026-09-26**
- head: `6ac89b6afea376adfa5232621ac22c62a983baa9`
- PR #404: OPEN / DRAFT
- main base: `76da305f0ec3efb3d368b22fb70748f0051f4d15`
- Repository Full-System Verification: [36238256329](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36238256329) — **PASS**
  - Project tests: **1,098 passed / 0 failed / 0 skipped**
  - typecheck, trusted Edge typecheck, committed machine spatial runtime parity, Full Project ZIP, and recovery integrity all passed.
- Canonical Browser Verification: [36238256320](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36238256320) — **PASS**
  - exact-head checkout, canonical Hero synchronization, machine runtime parity, focused browser machine tests, and Playwright verification all passed.
  - Playwright result: **67 passed**.
- Security Static Analysis: [36238256336](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36238256336) — **PASS**; CodeQL completed successfully.
- Deep Security Static Analysis: [36238256378](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36238256378) — **PASS**; gosec, MobSF, Semgrep CE, Bandit, SonarQube/SonarCloud, and Brakeman completed successfully.
- Governance Integrity: [36238299283](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36238299283) — **PASS**; evidence-consistency, governance-drift, and agent-validation succeeded. Review-readiness was skipped because #404 remains Draft.
- Browser artifact: `browser-verification-6ac89b6afea376adfa5232621ac22c62a983baa9`, artifact ID `10904517583`, 1,962,265 bytes, SHA-256 `e60f744b049855ae467d3fa06ef52ae841d736a72ca936cbf2caf5f0694a9db5`, expires 2026-10-11.
- Full-project artifact: `full-project-6ac89b6afea376adfa5232621ac22c62a983baa9`, artifact ID `10905081338`, 6,467,023 bytes, SHA-256 `467935385cf13acde40ccacd21733f0e491ad8b8cc9d636e61eb1f5b8ac59bfd`, expires 2026-10-11.

**Browser / product proof exercised by the current suite**
- classic / entrance exposes explicit Enter 3D world and returns through the Website control.
- /hero/ exposes the complete ten-seat presentation surface.
- guest state is GUEST_LIMITED; restricted product facilities are presented as discoverable but locked.
- guest automatic orbit advances after the navigation quiet period and freezes when authentication transition opens.
- Login and Sign up remain presentation-only and do not submit credentials.
- reduced-motion disables automatic orbit while preserving semantic guest state.
- the capacity rule clamps presentation from 1 through 10 slots; the browser proof uses the canonical presentation API rather than an entitlement-named event.

**Root inheritance**
`machine-guest-state.js` constructs S11 with `constructionLayer=product-runtime`, `semanticBoundary=presentation-only`, and the complete inherited structural root set `S0` through `S10`. This is the intended dependency relationship: S11 consumes the roots; it does not reopen or rebuild them.

**Discrepancy corrected in this slice**
The Hero status label previously described the default presented Seat slots as "unlocked". That wording conflicted with Product Law and the S11 guest-state contract because guest presentation capacity is not durable Seat entitlement. It is now "presented", and the browser proof follows the same semantic vocabulary. This is a semantic-contract correction, not a capacity or authorization change.

**Boundary**
S11 does not create durable Seats, grant entitlement, authenticate users, execute turns, or establish provider/runtime state. Authenticated restoration remains S12 / backend-owned and production Firestore evidence remains Issue #401.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED at exact head `6ac89b6afea376adfa5232621ac22c62a983baa9`. Formal downstream acceptance remains S30–S32; S11 is closed as an implementation/evidence slice.

### E404-S12 — Authenticated restoration presentation/read-model seam

**Claim:** S12 provides an authenticated-world restoration projection seam that consumes an already-authoritative backend read model and projects truthful identity/context/readiness/durable Seat state into the existing spatial machine without introducing Firebase, Firestore, authorization, entitlement, scheduler, provider, or durable-write authority into the renderer.

**Primary implementation**
- `frontend/spatial/machine-authenticated-restoration.js` — canonical S12 normalization/projection contract
- `public/machine-authenticated-restoration.js` — exact browser-delivered mirror
- `public/_flex_src/hero-flex.base.js` — canonical Hero application seam for authenticated/restored presentation state
- `public/hero-flex.js` — synchronized browser runtime
- `public/hero-layer-handoff.js` — existing machine-layer return owner
- `frontend/spatial/workspace-runtime-read-model.js` — existing Workspace readiness/context normalization owner

**Implementation proof head — 2026-09-26**
- implementation head: `e571ef4032b7843ac2074861a0a7cebead613623`
- PR #404: OPEN / DRAFT
- main base: `76da305f0ec3efb3d368b22fb70748f0051f4d15`
- Full-System: [36244319117](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36244319117) — **PASS**
  - project tests: **1,107 passed / 0 failed / 0 skipped**
  - machine source/public parity passed
  - typecheck, trusted Edge typecheck, recovery integrity, and package artifact passed
- Canonical Browser: [36244319104](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36244319104) — **PASS**
  - Playwright: **70 passed / 4 skipped**
  - exact-head checkout, canonical Hero synchronization, machine parity, and browser verification passed
  - Browser S12 scenarios covered successful restoration, fail-closed incomplete context, and durable Seat preservation during readiness degradation
- Security: [36244319106](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36244319106) — **PASS**
- Deep Security: [36244319130](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36244319130) — **PASS**
- The Governance Integrity run [36244319114](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36244319114) is **historical / inadmissible for promotion** because it began while #404 was accidentally Ready for Review and failed only after the PR was returned to Draft; its log records that exact lifecycle transition. A fresh Draft-state Governance run is required for current-head governance evidence.

**Contract proof**
- S12 construction context is `S12`, `product-runtime`, `presentation-only`, owned by `frontend/spatial/machine-authenticated-restoration.js`, and inherits the complete S0–S10 structural root set.
- Identity requires an explicit Firebase-backed subject identifier in the supplied read model; the module does not acquire tokens or establish sessions.
- Workplace / Project / Team restoration consumes explicit backend-owned context.
- Authorization and entitlement remain explicit read-model facts and are never inferred from presentation state.
- Durable Seat projection requires explicit `durable: true` Seat records and rejects populations above the canonical maximum instead of silently clamping impossible durable state.
- Restoration is evaluated before final readiness. An authorized durable Seat population remains represented even when scheduler eligibility or runtime health is unavailable.
- Fully usable state requires the existing readiness dimensions, including scheduler eligibility and health.
- Incomplete authenticated context becomes `AUTHENTICATED_UNAVAILABLE` with a concrete reason code.
- Successful restoration becomes `AUTHENTICATED_READY`, projects the exact durable Seat count through the canonical Hero presentation API, closes the temporary auth handoff, and returns to the existing machine layer.
- The module emits the existing Workspace runtime read-model event rather than creating a duplicate Workspace data store.
- Browser proof exercises both successful two-Seat restoration, fail-closed Project-unavailable restoration, and restored Seats surviving scheduler-unavailable readiness.
- Source/public S12 runtime copies are byte-identical.

**Authority boundary**
S12 is a presentation/read-model seam. It does not call Firebase SDK APIs, read/write Firestore, authorize users, grant entitlement, select scheduler actors, hold provider credentials, execute tasks, or establish durable domain state.

**Important limitation**
The browser tests use synthetic backend-read-model fixtures to validate the renderer contract. They do **not** establish that production Firebase Auth or Firestore currently supplies those records. Live identity, durable Seat population, and production runtime evidence remain owned by the existing backend/runtime gates, especially Issue #401.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED as an S12 presentation/read-model slice. It does not imply LIVE-DEPLOYED, RUNTIME-PROVEN, HUMAN-ACCEPTED, or 029 release authorization.

### E404-S21 — Loading / recovery presentation contract

**Claim:** S21 now has an exact-head repository-verified transaction presentation layer spanning the governed transaction vocabulary, read-model ingress, failure/recovery affordances, cancellation intent capture, and false-success protection. This is presentation/read-model proof only; it does not establish live provider execution, runtime cancellation, Firebase/Firestore authority, or production recovery.

**Primary implementation**
- `frontend/spatial/seat-runtime-presentation.js` — governed transaction kinds and normalized authority/action flags
- `public/seat-runtime-presentation.js` — synchronized browser contract
- `frontend/spatial/machine-transaction-presentation.js` — guarded transaction orb/presentation seam
- `public/machine-transaction-presentation.js` — synchronized browser presenter
- `frontend/spatial/machine-transaction-presentation.css`
- `public/machine-transaction-presentation.css`
- `public/hero-seat-stack-action-bridge.js` — existing task/evidence read-model → spatial presentation bridge

**Exact-head evidence — implementation head `f4132eb5e3f6c5d730d698a6cbf6d72586e514cc`**
- Repository Full-System Verification: [36249899816](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36249899816) — **PASS**
  - project tests: **1,117 passed / 0 failed / 0 skipped**
  - canonical package, source/public parity, and recovery integrity passed.
- Canonical Browser Verification: [36249899841](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36249899841) — **PASS**
  - Playwright: **76 passed / 4 skipped**
  - exact-head checkout, Hero source synchronization, runtime parity, and browser verification passed.
- Security Static Analysis: [36249899874](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36249899874) — **PASS**
- Deep Security Static Analysis: [36249899828](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36249899828) — **PASS**
- Governance Integrity: [36249899835](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36249899835) — **PASS**

**S21 implementation checkpoints**
- `2cfe242a` — non-authoritative `COMPLETED` transaction presentations fail closed.
- `50291d37` — authoritative backend-supplied Retry / Cancel flags become guarded presentation affordances and emit explicit non-authoritative intent events.
- `52bbd140` — existing task/evidence read-model transactions are forwarded into the S21 presenter through the live Hero bridge.
- `f4132eb5` — browser matrix proof exercises all ten governed transaction operation families through the public transaction API:
  navigation, retrieval, connection-test, MCP invocation, AI execution, handoff/continuation, storage operation, commerce verification, authorization, recovery.

**Proven presentation rows**
The exact-head browser contract proves shared LOADING presentation for all ten governed operation families, plus:
- provider-unavailable reason-bearing recovery presentation;
- guarded Retry intent;
- guarded Cancel intent;
- non-authoritative completion rejection / no false-success effect;
- transaction-state ingress from the existing task/evidence runtime read model.

**Authority boundary**
S21 remains presentation/read-model only. Retry and Cancel are user intents, not executions. Runtime/provider layers must re-check authorization, transaction validity, idempotency, entitlement, provider state, and cancellation/retry semantics in their owning domains.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED for the S21 spatial presentation/read-model layer. LIVE-DEPLOYED, RUNTIME-PROVEN, and HUMAN-ACCEPTED remain separate gates.

### E404-CI — exact-head repository verification

Exact head 8944ece was checked out by GitHub Actions.

**Project test run:** [36095498928](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36095498928)
- 1,050 tests
- 1,050 passed
- 0 failed
- 0 skipped
- typecheck passed
- trusted Edge typecheck passed
- committed machine spatial runtime parity passed
- Full Project ZIP created and verified

**Browser run:** [36095498965](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36095498965)
- exact-head checkout passed
- canonical source synchronization passed
- machine source/public parity passed
- Playwright browser verification passed
- browser evidence artifact created

**Browser artifact**
- name: browser-verification-8944ececfd6dfee15a39833107dd3bac932411bd
- size: 1,961,699 bytes
- SHA-256: 562f078007d15fee0881696719d98114bd359118f825527945f41bf569e1406f
- retention: through 2026-10-10

**Full-project artifact**
- name: full-project-8944ececfd6dfee15a39833107dd3bac932411bd
- size: 6,417,893 bytes
- SHA-256: e82af8e693b9b730dd2a3d649531908b004a4f656b922231ab190fd3e90ca87a

All substantive security scanners on the exact head completed successfully: CodeQL, Semgrep OSS, Bandit, Semgrep CE, gosec, Brakeman, MobSF, SonarQube/SonarCloud.

### E404-CI exact-head addendum — 2026-09-28

The historical `E404-CI` anchor above remains immutable provenance. The following records the exact-head verification unit for PR #404 after the S23 governance/evidence reconciliation. Later documentation-only branch heads do not mutate this evidence record.

**Verified exact head**
- Evidence-bearing head: `53d41d7ecc38e617a1f108ba52e1d8490ac66819`
- Branch relation at that verification point: **380 ahead / 0 behind** main
- State: **OPEN / DRAFT**
- This head is a documentation-only successor to behavior head `0607b2ddb5bf77355a1684135da3c924ad6f03b8`.

**Repository Governance Integrity**
- Run `36382059037` — **PASS**
- `governance-drift`, `evidence-consistency`, and `agent-validation` — PASS
- `review-readiness` — **SKIPPED** because the PR remains Draft; this is not approval evidence.

**Repository Full-System Verification**
- Run `36382059073` — **PASS**
- Project tests: **1,128 passed / 0 failed / 0 skipped**
- build-system audit, backend authority audit, typecheck, trusted Edge typecheck, machine spatial source/public parity, recovery integrity, and Full Project ZIP verification all passed.

**Security**
- Security Static Analysis run `36382059095` — **PASS**; CodeQL JavaScript/TypeScript job passed.
- Deep Security run `36382059092` — **PASS**; applicable configured scanners passed, while non-applicable language-specific scanners followed their normal skip paths.

**Canonical Browser Verification**
- Run `36382059034` — **PASS**
- Exact-head checkout, Hero runtime parity, machine-spatial runtime parity, and Playwright verification all passed.
- Browser: **87 passed / 4 skipped**
- Artifact ID: `10952998381`
- SHA-256: `ee483ca8c51caf5539bb052ef33100c2b4af61113d01307d05645f5ea1a39046`

**Full Project artifact**
- Artifact ID: `10952444638`
- SHA-256: `a17794664b32d035fee52e80ddb5529420155530d2c3ba74cc63c36e3983cf7a`

**Interpretation**
- This exact-head set proves repository governance, source/runtime parity, tests, browser behavior, and configured security checks at `53d41d7`.
- It does **not** prove production deployment, live Firestore state, live provider execution, human acceptance, or 029 release authorization.

### E404-RUNTIME — production boundary

Repository proof does **not** prove live Firestore Seat shape, live provider execution, live continuation, production deployment observation, or human acceptance.

Those remain in the separate #401/backend boundary and later #404 acceptance gates.

### E404-OPEN — genuinely open work

These are not being reopened merely because earlier capability proof exists:

- S0 formal baseline-freeze exit
- unresolved S1 state/effect ownership closure
- formal S2 exit where acceptance exceeds current repository capability evidence
- S11–S29 product/runtime/world-expression completion
- S30 exact-head evidence package as a formal gate
- S31 production/runtime reconciliation
- S32 human acceptance
- S33 ProMax polish

The distinction is deliberate:

**implemented/proven capability ≠ completed 029 release.**

## Evidence hygiene rules

Do not create a new evidence slice when an existing Evidence ID already owns the claim.

Create a new evidence entry only when the observable claim is genuinely new, the previous record cannot contain it without changing its semantic scope, the new record points to primary evidence, the state is explicit, and no second implementation owner is created.

Prefer one evidence record per proof claim or tightly coupled claim family, not one record per commit.

Prefer exact-head run IDs and stable file paths over screenshots as primary proof. Screenshots are supporting observation, not geometry or authority.

Historical evidence remains historical. Do not silently refresh old claims to a new SHA without recording the new exact-head anchor.

## Navigation from PR #404

PR #404 is the human-readable entry point. It points here for detailed proof references and then to the execution checklist for slice status. Later documentation-only commits do not invalidate the immutable proof records linked above.

That keeps the PR body understandable without turning it into a second 476-row execution plan.

### E404-S13 — Workspace HQ root inheritance

**Claim:** The S13 Workspace HQ spatial facility explicitly inherits the complete S0–S10 structural root contract instead of introducing a parallel product-space grammar.

**Primary source**
- frontend/spatial/workspace-capability-facility.js — `WORKSPACE_FACILITY_SPATIAL_CONTEXT`
- public/workspace-capability-facility.js — exact runtime mirror

**Repository proof**
- tests/workspace-capability-facility.test.mjs — S13 root inheritance contract test
- validation requires construction slice `S13`, canonical owner `frontend/spatial/workspace-capability-facility.js`, semantic target `WORKSPACE_CENTER`, and inherited roots exactly equal to `S0` through `S10`.
- frontend/spatial/workspace-runtime-read-model.js + public mirror — explicit backend-read-model normalization seam
- the read-model contract fails closed without authenticated/authorized/entitled/healthy context and only exposes Workplace / Project / Team context when the complete readiness contract is satisfied
- the facility derives project-scoped Workspace branch identity from the read model and no longer contains fixed Workplace/Project choices

**Boundary:** this proves spatial inheritance and the presentation read-model seam. It does not prove that a live backend currently supplies Workspace state, nor does it prove live authorization, entitlement, scheduler eligibility, durable state, or execution.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED once the fresh exact-head CI run passes.


### E404-S14 — Team / Agents runtime read-model seam

**Claim:** S14 Team / Agents participates through the inherited spatial machine while Agent identity, Seat assignment context, skill bundle, capability profile, readiness, and assignment intent are supplied through a fail-closed runtime read-model boundary.

**Primary source**
- frontend/spatial/team-agents-runtime-read-model.js
- frontend/spatial/team-agents-facility.js
- frontend/spatial/team-agents.js
- public mirrors of the runtime read-model/facility modules

**Repository proof**
- tests/team-agents-facility.test.mjs
- tests/team-agents.test.mjs
- S14 construction context validates canonical owner, semantic target `TEAM_AGENTS`, and inherited S0-S10 roots.
- Assignment branch generation no longer requires Agent membership in the static presentation catalog; only the governed role vocabulary remains canonical.
- The facility does not embed Agent or Seat identities and cannot request assignment intent until an authorized, healthy Team/Seat read model is available.

**Boundary:** this proves the repository-side S14 product/runtime presentation seam. It does not prove live Firestore Agent/Team data, authorization, entitlement, scheduler eligibility, persistence, provider execution, or human acceptance.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED once fresh exact-head CI passes.



### E404-S15 — MCP / Capability runtime presentation seam

**Claim:** S15 presents the governed MCP / Capability lifecycle through the inherited spatial machine without creating a second capability authority. Discovery, inspection, installation, authentication handoff, configuration, health/test, and equip remain presentation/runtime intents whose authoritative state belongs to the backend/runtime owner.

**Primary source**
- frontend/spatial/mcp-capability-facility.js — `MCP_FACILITY_SPATIAL_CONTEXT`, lifecycle presentation, target-owned branch projection, and intent dispatch
- frontend/spatial/mcp-capability-runtime-read-model.js — fail-closed capability/readiness normalization and guest discovery vocabulary
- public mirrors of the S15 runtime modules

**Repository proof**
- tests/mcp-capability-facility.test.mjs — S15 root inheritance, backend-read-model wiring, no local runtime identities, lifecycle-intent boundary, live Hero wiring, and source/public parity
- tests/mcp-capability-runtime-read-model.test.mjs — guest lock, incomplete authenticated state, ready state, distinct credential boundary, target/branch normalization, and source/public parity
- tests/e2e/mcp-capability.spec.ts — browser presentation/interaction coverage for the governed capability surface

**Boundaries**
- External provider credentials remain outside the spatial presentation layer.
- Backend authorization, entitlement, installation, project scope, Seat eligibility, provider health, and execution remain authoritative outside #404.
- Guest discovery is vocabulary-only; authenticated capability/target state must arrive through the runtime read model.
- Equip and lifecycle actions are explicit intents and require authoritative runtime confirmation; visual readiness is never execution proof.
- Issue #412 remains the backend+frontend MCP capability contract owner.

**Evidence-bearing verification anchor**
- Exact-head verified parent: `53d41d7ecc38e617a1f108ba52e1d8490ac66819`
- Current exact-head substantive verification is recorded in the **E404-CI current-head addendum** below.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED. This is a spatial presentation/read-model proof, not live provider execution, live authorization, or 029 release acceptance.


### E404-S16 — Seat budget / energy / handoff presentation contract

**Claim:** S16 presents the #392-governed Seat budget, usage, handoff, continuation, and cooperation envelope through the spatial machine without creating a second accounting authority.

**Primary source**
- frontend/spatial/seat-budget-settings.js — normalized Seat budget read model, energy segments, save intent, and control intent
- frontend/spatial/seat-budget-settings-facility.js — S16 spatial facility, backend-read-model rendering, configuration/control intent dispatch
- public mirrors of both modules

**Repository proof**
- tests/seat-budget-settings.test.mjs — authorization/configurability separation, no invented live usage, protected handoff reserve, presentation-only save/control intents, S16 root inheritance, no direct backend/storage calls, and source/public parity
- The normalized model keeps configured/effective/output/reasoning/reserve/consumed/remaining/completion/continuation dimensions distinct and leaves authoritative persistence to the trusted runtime.

**Boundaries**
- #392 remains authoritative for budget, usage, handoff, continuation, and cooperation semantics.
- The spatial facility can dispatch configuration/control intents but cannot persist durable Seat budget state itself.
- Provider usage and completion are not inferred from visual meters or local counters.
- Authentication, authorization, Seat identity, provider credentials, scheduler state, durable execution results, and continuation authorization remain outside #404.

**Evidence-bearing verification anchor**
- Exact-head verified parent: `53d41d7ecc38e617a1f108ba52e1d8490ac66819`
- Current exact-head substantive verification is recorded in the **E404-CI current-head addendum** below.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED for the spatial presentation/read-model contract. This does not promote #392 completion, runtime proof, or 029 acceptance.


### E404-S17 — Task / Evidence / Report runtime read-model seam

**Claim:** S17 presents task, evidence, result, report, and handoff continuity from a dedicated backend runtime read model while preserving the S0-S10 machine roots and refusing fixture-shaped or unauthorized truth.

**Primary source**
- frontend/spatial/seat-task-evidence-runtime-read-model.js — S17 spatial context and fail-closed task/evidence/report normalization
- frontend/spatial/shell-nav.js — dedicated S17 read-model event consumption at the existing Hero shell
- public mirrors of the S17 runtime/read-model modules

**Repository proof**
- tests/seat-task-evidence-runtime-read-model.test.mjs — S17 root inheritance, unavailable/default state, authorized completed-turn normalization, authorization fail-closed behavior, dedicated read-model event, browser mirror parity, and rejection of non-backend availability flags
- tests/e2e/seat-task-evidence.spec.ts — browser-level task/evidence/report presentation through the canonical Hero machine
- The read model requires backend-read-model provenance and explicit Seat authorization/readiness before exposing report content.
- Artifact references remain metadata-only; binary/content transfer stays outside this presentation seam.

**Boundaries**
- Durable task execution, evidence creation, result persistence, authorization, and artifact content remain owned by the backend/runtime systems.
- The spatial shell presents authoritative read-model state and dispatches intent; it does not declare a task completed, fabricate evidence, or grant continuation.
- Historical and live records remain distinguished by the dedicated runtime-read-model ingress.
- No #401, #412, or #392 authority is moved into the spatial renderer.

**Evidence-bearing verification anchor**
- Exact-head verified parent: `53d41d7ecc38e617a1f108ba52e1d8490ac66819`
- Current exact-head substantive verification is recorded in the **E404-CI current-head addendum** below.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED for the presentation/read-model boundary. This does not prove live backend task execution, provider termination, or human acceptance.


### E404-S18 — Storage / artifact inventory contract

**Claim:** The S18 Storage facility now has an explicit inherited-machine contract and separates item inventory state from explicit artifact state while remaining read-only presentation.

**Primary source**
- frontend/spatial/storage-inventory-facility.js — `STORAGE_FACILITY_SPATIAL_CONTEXT`
- frontend/spatial/storage-inventory.js — `STORAGE_ARTIFACT_STATES` and normalized item contract
- public mirrors of both modules

**Repository proof**
- tests/storage-inventory.test.mjs — S18 root inheritance, explicit artifact-state, no-upload/content-transfer, and source/public parity contracts
- tests/e2e/storage-inventory.spec.ts — guest lock, authenticated read-model metadata/selection/inspection, and reduced-motion browser behavior
- exact-head machine source/public parity verified by CI

**Boundaries**
- The facility does not read Firestore directly, call Supabase Storage, upload, transfer binaries, or write content.
- An item without an explicit `artifactState` remains `UNKNOWN`; generic item `status` does not manufacture artifact readiness.
- The semantic branch remains item-owned and presentation-only.
- Production content, authorization, entitlement, retention, quotas, and storage mutation remain outside this spatial facility.

**Exact-head verification — 2026-09-25**
- PR #404 head: `292346063ad47b6022f40655de41399b8f9369e3`
- Base: `529fede864df0218947377e1d50e48f096c4a7c7`
- Repository Full-System Verification: [36137892064](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36137892064) — **PASS**
- Project tests: **1,082 passed / 0 failed**
- Browser verification: [36137892131](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36137892131) — **PASS**
- Machine spatial runtime parity: **68 modules verified**
- Governance Integrity: [36137892051](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36137892051) — **PASS**
- Security Static Analysis: [36137892231](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36137892231) — **PASS**
- Deep Security Static Analysis: [36137892141](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36137892141) — **PASS**
- Browser artifact: `browser-verification-292346063ad47b6022f40655de41399b8f9369e3`, artifact ID `10864623660`, SHA-256 `42731647b19890004135f70ae61b8a27413ab9f924802f5fa2274654299e27cd`
- Full-project artifact: `full-project-292346063ad47b6022f40655de41399b8f9369e3`, artifact ID `10864763276`, SHA-256 `cf08976b37a554dba90f7fd0519c32c8c21a9d2d097bf31c4914224c454f9c93`

**Status:** REPOSITORY-VERIFIED. This does not imply LIVE-DEPLOYED, RUNTIME-PROVEN, HUMAN-ACCEPTED, or 029 release authorization.


### E404-S19 — Marketplace / commerce spatial contract

**Claim:** S19 Marketplace / Commerce is represented by one spatial facility with a formal inherited S0–S10 machine contract while payment, entitlement, and durable commerce authority remain outside the renderer.

**Primary source**
- frontend/spatial/marketplace-commerce-facility.js — `MARKETPLACE_FACILITY_SPATIAL_CONTEXT`
- frontend/spatial/marketplace-commerce.js — offer families, tier catalog, dynamic offer-owned branch, and presentation decisions
- public mirrors of both modules

**Repository proof**
- tests/marketplace-commerce-facility.test.mjs — S19 root inheritance and source/public parity
- tests/e2e/marketplace-commerce.spec.ts — guest catalog, Team Quality/Team Population presentation, Seat 2–10 capacity catalog, entitlement projection, higher-tier replacement warning, lower-tier locking, checkout gating, hosted billing boundary, and authentication handoff
- exact-head machine source/public parity and project verification passed

**Boundary**
- The facility emits a presentation-only commerce intent; it does not charge, mutate entitlement, write Firestore, or become payment authority.
- Hosted billing is external and the facility does not collect or store card credentials.
- Visual tier state never self-attests payment completion or durable entitlement.
- The Marketplace offer branch is dynamic and offer-owned; it does not become a new Seat hierarchy or authority root.

**Exact-head verification — 2026-09-25**
- PR #404 head: `6e1950302ea92929bf01edf24f08c2582a69bd90`
- Base: `529fede864df0218947377e1d50e48f096c4a7c7`
- Repository Full-System Verification: [36138780358](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36138780358) — **PASS**
- Project tests: **1,082 passed / 0 failed**
- Browser verification: [36138780475](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36138780475) — **PASS**
- Machine spatial runtime parity: **68 modules verified**
- Governance Integrity: [36138780512](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36138780512) — **PASS**
- Security Static Analysis: [36138780437](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36138780437) — **PASS**
- Deep Security Static Analysis: [36138780384](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36138780384) — **PASS**
- Browser artifact: `browser-verification-6e1950302ea92929bf01edf24f08c2582a69bd90`, artifact ID `10865826119`, SHA-256 `0e6afa8e9a5ac639c0062a818a251ee25e9ba7a48ab8eebb9dc7ec4fa0ff834f`
- Full-project artifact: `full-project-6e1950302ea92929bf01edf24f08c2582a69bd90`, artifact ID `10866000612`, SHA-256 `f2a3d13159ec9ca2a4e231524c8e05d998b0a6449f74b051ab46f30299b8e452`

**Status:** REPOSITORY-VERIFIED. This does not imply LIVE-DEPLOYED, RUNTIME-PROVEN, HUMAN-ACCEPTED, or 029 release authorization.


### E404-S20 — Settings / control boundary

**Claim:** The current Settings experience is a cross-cutting normal-UI control taxonomy. It consumes the canonical Hero machine without creating a second hierarchy and delegates durable configuration/authentication authority to their owning application/backend boundaries.

**Primary source**
- frontend/spatial/hero-root-contract.js — canonical Hero Settings root with S20 control metadata and inherited S0–S10 structural roots
- public/hero-root-contract.js — browser delivery mirror
- public/hero-settings-shell.js — Settings shell owner for theme, motion, UI scale, language scaffold, and presentation smoke controls
- public/experience-rebaseline.js — world navigation / Settings entry / world↔classic return orchestration
- public/hero-auth-handoff.js — authentication handoff owner
- public/seat-budget-settings-facility.js — budget control facility remains separately owned

**Proven repository/browser proof**
- tests/hero-root-contract.test.mjs — S20 Settings root is explicitly normal-UI, presentation-only, inherits S0–S10, and is not a Seat child
- tests/hero-experience-rebaseline.test.mjs — one coherent world navigation/settings destination and dedicated auth ownership
- tests/hero-v2.3-settings-shell.test.mjs — Settings shell scaffold, dedicated settings mount, retired machine-nav boot, and settings chrome ownership
- tests/hero-v2.4-theme-polish.test.mjs — Settings uses the single document theme root
- tests/hero-v2.5-ui-scale.test.mjs — bounded UI scale control
- tests/hero-v2.6-language-scaffold.test.mjs — language scaffold remains explicitly scaffolded until copy catalog exists
- tests/e2e/hero.spec.ts — Settings smoke, authentication Login/Sign up separation, return-to-entrance flow, reduced-motion presentation
- tests/e2e/seat-budget-settings.spec.ts — Budget settings access/read/write flow remains independently verified under its S16 owner

**Open boundaries intentionally retained**
- Semantic Settings tree/branch navigation is not yet a separately verified integrated taxonomy over every product branch.
- Seat settings remain owned by the Seat hierarchy and dedicated Seat/runtime contracts rather than duplicated into Settings.
- Logout is not claimed because live Firebase Auth session authority is not yet established in this browser build.
- A universal Back contract is not claimed; individual facilities expose their own governed close/back-to-world controls.

**Exact-head verification — 2026-09-25**
- Verified code head: `ce25a4b4de2f3e9b7c2174a18af0ff0b730ff940`
- PR #404 base: `529fede864df0218947377e1d50e48f096c4a7c7`
- Repository Full-System Verification: [36139736678](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36139736678) — **PASS**
- Project tests: **1,082 passed / 0 failed**
- Browser verification: [36139736547](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36139736547) — **PASS**
- Machine spatial runtime parity: **68 modules verified**
- Governance Integrity: [36139736561](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36139736561) — **PASS**
- Security Static Analysis: [36139736714](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36139736714) — **PASS**
- Deep Security Static Analysis: [36139736711](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/36139736711) — **PASS**
- Full-project artifact: `full-project-ce25a4b4de2f3e9b7c2174a18af0ff0b730ff940`, artifact ID `10865782523`, SHA-256 `1042094c8e66f3cd2f04651dfbd2bf9b40c0ba6c821d7fdaf52a96c1ddfd5d59`
- Browser artifact: `browser-verification-ce25a4b4de2f3e9b7c2174a18af0ff0b730ff940`, artifact ID `10865903169`, SHA-256 `2865cd8dc35bc55f01575f0f105367d9f814ec01626be8b65ed53f3311e7deae`

**Status:** PARTIALLY REPOSITORY-VERIFIED. The checked items above have current proof; S20 is not a release-complete exit while the remaining boundaries are open.

### E404-S22 — Accessibility keyboard navigation

**Claim:** S22 keyboard navigation makes the live Hero world-menu disclosure operable without a pointer and isolates spatial shortcuts from focused chrome. This is presentation/keyboard proof only. It does not complete S22, prove visible-focus/announcement/reduced-motion rows, or authorize 029 release.

**Primary source**
- `public/hero-accessibility.js` — S22 keyboard owner: menu arrow/Home/End traversal, chrome Enter/Space activation, spatial-shortcut isolation, existing dialog Escape restore
- `public/experience-rebaseline.js` — existing disclosure open/close/Escape return
- `public/index.html` — world-menu disclosure buttons remain buttons, not `role="menu"`

**Repository proof**
- `tests/hero-accessibility.test.mjs` — menu-index contract and chrome-isolation source contract
- `tests/e2e/hero.spec.ts` — keyboard open, first-item focus, Arrow/Home/End traversal, keyboard Settings activation; prior S22 Escape/announcement/form-isolation scenarios retained

**Boundary**
- Spatial canvas shortcuts remain available when focus is not on chrome.
- Visible focus, deterministic names, announcements, non-color meaning, reduced-motion equivalence, and accessibility smoke remain later S22 rows.
- No Firebase/Firestore/auth/scheduler/commerce authority is introduced.

**Status:** IMPLEMENTED. Exact-head CI on this head is the repository-verification vehicle. This does not imply LIVE-DEPLOYED, RUNTIME-PROVEN, HUMAN-ACCEPTED, or 029 release authorization.



### E404-S22G — Accessibility Escape / back and return-to-parent

**Claim:** Existing Hero Escape behavior respects the semantic hierarchy: dialog context returns to its real trigger, while machine hierarchy context unwinds from leaf to parent to world. No second navigation stack is introduced.

**Implementation**
- `public/hero-accessibility.js` owns dialog Escape/trigger restoration.
- `public/hero-flex.js` owns machine hierarchy Escape semantics.
- `public/hero-hierarchy-runtime.js` owns leaf clearing and animated parent closure.

**Fresh exact-head proof — 2026-09-28**
- behavior head: `69e69071a6df97e977328f2d5eebb310d33d23ba`
- Canonical Browser run: `36374403519` — **PASS**
- Playwright: **84 passed / 4 skipped**
- S22 Escape test: **PASS**
  - opened `SEAT_SHELL#0`
  - first Escape cleared `focusedLeafId` while retaining the parent and focused child
  - second Escape completed the hierarchy return
  - final semantic state: no open parent, no focused child, `IDLE`, `HERO_WIDE`
- Existing accessibility baseline simultaneously proves dialog Escape from Settings/Auth restores focus to the real invoking trigger.
- Full-System run `36374403524`: **PASS**, **1,122 passed / 0 failed**, package create/verify **PASS**, 1,059 files.
- Security run `36374403526`: **PASS**
- Deep Security run `36374403677`: **PASS**
- Governance run `36374403543`: **PASS**
- Browser artifact: `browser-verification-69e69071a6df97e977328f2d5eebb310d33d23ba`, artifact ID `10950890364`, SHA-256 `69dc440638b396ad33fa1b3e58392844a8217db8056dc710c7c816647b177938`

**Trial/error record**
- First browser attempt checked for immediate hierarchy closure and observed `SEAT_SHELL#0` still present after the second Escape. The source showed an intentional animated `CLOSING` phase, so the test was corrected to wait for semantic closure instead of changing implementation timing.

**Boundary**
- This closes Escape/back and Return-to-parent at repository/browser verification level.
- Reduced-motion semantic equivalence and broader accessibility smoke remain open.
- No backend/runtime/geometry authority moved.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED. This does not imply LIVE-DEPLOYED, RUNTIME-PROVEN, HUMAN-ACCEPTED, or 029 release authorization.

### E404-S22F — Accessibility non-color-only meaning

**Claim:** Semantic state meaning on the Hero remains understandable without relying on hue alone. State-bearing surfaces expose text labels and/or programmatic state, while color and glow remain supplemental visual styling.

**Repository findings**
- `public/hero-seat-stack.js` maps health states to text labels: `OFF`, `DEG`, `OK`; authorization states to `AVL`, `BLK`, `UNA`, `DEG`, `NAV`; task states to `IDL`, `QUE`, `RUN`, `BLK`, `DONE`, `FAIL`.
- The same state-bearing layers expose `data-*` state attributes, `aria-pressed`, or reason-bearing `title` / `aria-label` values.
- `public/index.html` spatial-part controls use visible labels such as Surface / Focus / Trace and programmatic `aria-pressed` state.
- `public/machine-transaction-presentation.js` exposes transaction state as visible text and error detail; the glow/progress styling is supplemental.
- This matches WCAG 2.2 SC 1.4.1 guidance that color must not be the only visual means of conveying information. 

**Fresh exact-head proof — 2026-09-28**
- behavior head: `58a46235f90d00e5d5d3574a7f85288a0eeae4cf`
- Canonical Browser run: `36373842367` — **PASS**
- Playwright: **83 passed / 4 skipped**
- S22 non-color-only test: **PASS**
  - spatial part selected state: visible `Focus` text + `aria-pressed=true`
  - connection offline state: visible `OFF` text + `title`
  - authorization blocked state: visible `BLK` text + reason-bearing `aria-label`
  - task blocked state: visible `BLK` text + reason-bearing `aria-label`
  - transaction unavailable state: visible `Unavailable` text + `PROVIDER_UNAVAILABLE` detail
- Full-System run `36373842458`: **PASS**, **1,122 passed / 0 failed**, package create/verify **PASS**, 1,059 files.
- Security run `36373842355`: **PASS**
- Deep Security run `36373842522`: **PASS**
- Governance run `36373842452`: **PASS**
- Browser artifact: `browser-verification-58a46235f90d00e5d5d3574a7f85288a0eeae4cf`, artifact ID `10950123775`, SHA-256 `97278818cda3ad243c958000c80439769732cf81f890d15ff8b0944cd2c797dc`

**Trial/error record**
- First browser attempt failed because the test used a pointer click on the spatial-part button, which the current 3D composition does not reliably expose to pointer hit-testing. The existing semantic owner `TeamAiHeroSpatial.setPart()` was used instead.
- A second assertion pass targeted computed accessible names on Seat-stack containers. Those names are already owned/proved separately by S22 Deterministic accessible names, so this non-color row was narrowed to state attributes, text cues, and reason-bearing metadata.

**Boundary**
- This closes the Non-color-only meaning row at repository/browser verification level.
- It does not certify full WCAG conformance across every route or every visual surface.
- Escape / back, Return-to-parent, Reduced-motion semantic equivalence, and Browser accessibility smoke remain open S22 rows.
- No backend/runtime/geometry authority moved.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED. This does not imply LIVE-DEPLOYED, RUNTIME-PROVEN, HUMAN-ACCEPTED, or 029 release authorization.

### E404-S22E — Accessibility error / blocked reasons

**Claim:** User-facing blocked states expose a deterministic, presentation-only reason without changing the control's existing accessible name or claiming backend authorization failure. Transaction error codes remain separately exposed by the existing transaction presenter.

**Implementation**
- `public/experience-rebaseline.js` — guest `DISCOVERABLE_LOCKED` feature controls receive `aria-describedby="hero-guest-feature-blocked-reason"`.
- The referenced description states: `Guest presentation: discoverable, blocked until authenticated runtime context is available.`
- `data-guest-reason="BLOCKED_UNTIL_AUTHENTICATED"` records the same canonical presentation vocabulary for the testable surface.
- Existing `aria-label` values are preserved, preventing accessible-name drift.
- No authorization, entitlement, or backend decision is inferred in the browser.

**Fresh exact-head proof — 2026-09-28**
- behavior head: `e3000a4a682d9e226f86f533404099cb1215ce96`
- Canonical Browser run: `36372895502` — **PASS**
- Playwright: **82 passed / 4 skipped**
- S22 blocked-reason test: **PASS** across all visible `[data-feature-id]` world-menu controls.
- Each control retained its existing accessible name, referenced the shared reason node through `aria-describedby`, exposed the exact blocked description, and avoided misleading `unauthorized` / `permission denied` language.
- Existing transaction recovery test continues to expose `PROVIDER_UNAVAILABLE` through the transaction detail surface.
- Full-System run `36372895448`: **PASS**, **1,122 passed / 0 failed**, package create/verify **PASS**, 1,059 files.
- Security run `36372895500`: **PASS**
- Deep Security run `36372895646`: **PASS**
- Governance run `36372895461`: **PASS**

**Trial/error record**
1. The first blocked-reason attempt put the descriptive text into `aria-label`, which changed the computed accessible names and broke existing navigation/name contracts.
2. The implementation was redesigned to preserve the name and use `aria-describedby` for the additional reason.
3. The next browser attempt failed only because the test called `toContain` on a nullable `aria-label` result when the attribute was intentionally absent; the test was normalized to an empty string.
4. The corrected implementation/test pair passed without weakening validators.

**Boundary**
- This closes the Error / blocked reasons row at repository/browser verification level.
- Non-color-only meaning remains a distinct S22 row. The current proof does not claim that every state across every facility is independently non-color dependent.
- Escape/back, return-to-parent, reduced-motion semantic equivalence, and browser accessibility smoke remain open.
- No backend/runtime/geometry authority moved.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED. This does not imply LIVE-DEPLOYED, RUNTIME-PROVEN, HUMAN-ACCEPTED, or 029 release authorization.

### E404-S22D — Accessibility state announcements

**Claim:** The existing Hero state display is itself a live status region, so semantic state transitions are announced without a second accessibility event bus. This closes the S22 State announcements row at repository/browser verification level.

**Implementation**
- `public/index.html` — existing `#state-label` now carries `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`.
- `public/hero-flex.js` — existing `setState()` updates that same node through `updateLabels()`; no parallel state machine or announcement channel was added.

**Fresh exact-head proof — 2026-09-28**
- behavior head: `49ac0bc2da89d69eaab9072acabb1b60cc4e2125`
- Canonical Browser run: `36370931490` — **PASS**
- Playwright: **81 passed / 4 skipped**
- S22 state-announcement test: **PASS**; it verified the live-region attributes and the state transition `IDLE → FOCUS → IDLE` using the real Start/Stop turn-loop controls.
- S22 deterministic accessible names: **PASS**
- S22 keyboard navigation: **PASS**
- S22 accessibility baseline: **PASS**
- Full-System run `36370931461`: **PASS**, **1,121 passed / 0 failed**, package create/verify **PASS** with 1,059 files.
- Security run `36370931454`: **PASS**
- Deep Security run `36370931458`: **PASS**
- Governance run `36370931448`: **PASS**

**Trial/error record**
1. Initial state-announcement test asserted an accessible name on the `role=status` node. Chromium correctly returned an empty accessible name because the live region's job is to expose changed text, not to possess a separate naming layer. The assertion was removed; the live-region semantics and text-transition proof stayed intact.
2. No production markup/state behavior was weakened to obtain green CI.

**Boundary**
- This row proves state-transition announcement semantics on the Hero surface only.
- Error/blocked reasons, non-color-only meaning, Escape/back, return-to-parent, reduced-motion semantic equivalence, and broader accessibility smoke remain open S22 rows.
- No backend/runtime/geometry authority moved.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED. This does not imply LIVE-DEPLOYED, RUNTIME-PROVEN, HUMAN-ACCEPTED, or 029 release authorization.

### E404-S22C — Accessibility deterministic accessible names

**Claim:** Interactive controls that are actually exposed on the active Hero world surface have deterministic, non-empty computed accessible names. The test also checks the main 3D canvas, the world-menu action items, and the settings controls reached through the public menu.

**Fresh exact-head Browser proof**
- behavior head: `bc4eb576d7079eb61257e2ee3cc1f9f09f9af2df`
- Canonical Browser run: `36370243851` — **PASS**
- Playwright: **80 passed / 4 skipped**
- `#hero-canvas`: accessible name `Interactive 3D Web AI workspace`
- visible active Hero controls: every matched visible button/link/form control had a non-empty computed accessible name
- world-menu items: every visible menu button had a non-empty computed accessible name
- Settings panel controls: every visible button/input/select reached through the world menu had a non-empty computed accessible name
- Full-System run `36370243859`: **PASS**, project suite **1,121 passed / 0 failed**, package create/verify **PASS** with 1,059 files
- Security run `36370243823`: **PASS**
- Deep Security run `36370243827`: **PASS**
- Governance run `36370243828`: **PASS**

**Supporting implementation**
- `public/index.html` provides the stable main-canvas label and world-navigation naming.
- `public/hero-seat-stack.js` already assigns explicit labels to the legacy Seat-stack controls when that surface is exposed.
- `public/hero-hierarchy-runtime.js` provides semantic accessible-name generators for hierarchy/ring subjects.
- `public/hero-flex.js` keeps the semantic status name synchronized with the active hierarchy/ring focus state.

**Trial/error record**
1. First browser attempt `274fe102...` treated hidden legacy Seat-stack buttons as active and failed because that stack is intentionally `display:none` on the machine layer. Classified as test scope error.
2. Second attempt failed because `menuItems.getByRole('button', { name: 'Settings' })` searched for a descendant button inside a button locator, so it could not match the actual menu action. Classified as test locator error.
3. Corrected bounded census at `bc4eb576...` passed without changing production markup.

**Boundary**
- This closes deterministic naming at the repository/browser surface only.
- State announcements, error/blocked reasons, non-color-only meaning, Escape/back, return-to-parent, reduced-motion semantic equivalence, and broader accessibility smoke remain open S22 rows.
- No backend/runtime/geometry authority moved.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED. This does not imply LIVE-DEPLOYED, RUNTIME-PROVEN, HUMAN-ACCEPTED, or 029 release authorization.

### E404-S22B — Accessibility visible focus

**Claim:** The live Hero public controls retain a visible keyboard focus indicator, including the keyboard-traversed world-menu disclosure items. This closes the S22 Visible focus row at the repository-verification level only.

**Primary implementation**
- `public/hero.css` — global `:focus-visible` rule for links, buttons, form controls, and tabindex surfaces.
- `public/hero-accessibility.js` — keyboard world-menu traversal/focus owner.

**Fresh exact-head proof — 2026-09-28**
- head: `3e08cb71232e40afcb9e6035db97d2c690eb4a07`
- Canonical Browser: run `36368733995` — **PASS**
- Playwright: **79 passed / 4 skipped**
- The S22 keyboard-navigation test directly verified the first two keyboard-traversed world-menu buttons expose a solid **3px** focus outline and match `:focus-visible`.
- The baseline accessibility smoke also continues to prove keyboard focus is visible on the initial Tab target.
- Browser artifact: `browser-verification-3e08cb71232e40afcb9e6035db97d2c690eb4a07`, artifact ID `10948766610`, SHA-256 `4bb63204a3559e4468548bad014d6ca22efbb9c7c29fbaa519aec51bea250a68`.

**Supporting repository proof**
- `tests/e2e/hero.spec.ts` — exact browser assertion for focus ring style and `:focus-visible` on keyboard menu items.
- `tests/hero-accessibility.test.mjs` — source contract requiring the public Hero `:focus-visible` rule, 3px outline, and offset.

**Trial/error note**
- The prior exact-head Browser run on `5f6eace...` failed because the first newly added assertion still called nonexistent Playwright `toEvaluate`. This was classified as a test defect, not a product defect. The corrective head `3e08cb7...` removes the stale call and re-proves the full Browser suite green.

**Boundary**
- This row proves visibility of focus, not complete accessibility. Deterministic naming, non-color meaning, broader announcements/error semantics, reduced-motion equivalence, and accessibility smoke remain open S22 rows.
- No backend/runtime/geometry authority moved.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED. This does not imply LIVE-DEPLOYED, RUNTIME-PROVEN, HUMAN-ACCEPTED, or 029 release authorization.


### E404-S22H - Accessibility reduced-motion semantic equivalence

**Claim:** Reduced-motion presentation preserves the same semantic machine states and hierarchy/backstack meaning while removing or snapping non-essential motion. It does not create a second accessibility state machine.

**Implementation**
- `public/hero-flex.js` and `public/hero-hierarchy-runtime.js` carry reduced-motion state through the existing hierarchy/camera/turn owners.
- Reduced motion snaps hierarchy opening/closing, disables non-essential ambient motion, and retains the same semantic turn lifecycle.
- The canonical S22 reduced-motion browser scenario remains part of the full Hero suite.

**Fresh exact-head proof - 2026-09-28**
- exact PR head: `9515f57b63fc043600812c445cb267dcbe6dd954`
- Canonical Browser run: `36376500367` - **PASS**
- Playwright: **86 passed / 4 skipped**
- Reduced-motion test: **PASS**
  - hierarchy opened at `SEAT_SHELL#0`
  - canonical phase `open`
  - `openAmount=1`
  - focused child remained semantically addressable
  - camera remained `SEAT_CLOSE`
  - Hero state remained `FOCUS`
  - reduced-motion state remained enabled
  - the turn lifecycle retained the semantic sequence through `HANDOFF`
- Full-System run `36376500301`: **PASS**, **1,122 passed / 0 failed**, package create/verify **PASS**, 1,059 files.
- Security run `36376500318`: **PASS**
- Deep Security run `36376500400`: **PASS**
- Governance run `36376500340`: **PASS**

**Boundary**
- This is repository/browser proof only.
- It does not certify complete reduced-motion behavior across every route or certify human acceptance.
- No backend/runtime/geometry authority moved.

**Status:** IMPLEMENTED -> REPOSITORY-VERIFIED.

### E404-S22I - Accessibility browser smoke coverage

**Claim:** The canonical `/hero/` browser surface has a compact accessibility smoke contract that checks the integrated seams already proven by the individual S22 rows without creating a second accessibility architecture.

**Implementation**
- `tests/e2e/hero.spec.ts` adds a single canonical Hero-route smoke test.
- The smoke contract covers accessible names, live state, Menu disclosure/focus, blocked reasons, Settings Escape/trigger restoration, menu Escape ordering, leaf -> parent -> world backstack, reduced-motion state, HERO_WIDE/IDLE restoration, and transaction error announcement.

**Fresh exact-head proof - 2026-09-28**
- exact PR head: `9515f57b63fc043600812c445cb267dcbe6dd954`
- Canonical Browser run: `36376500367` - **PASS**
- Playwright: **86 passed / 4 skipped**
- New S22 browser accessibility smoke: **PASS**
- Browser artifact: `browser-verification-9515f57b63fc043600812c445cb267dcbe6dd954`
- Artifact ID: `10951336520`
- Artifact digest: `sha256:50bcbcdb2d7d603af5561bec1dab36d080390cddff8be47d9ea04d3c9761e71b`
- Full-System run `36376500301`: **PASS**, **1,122 passed / 0 failed**, package create/verify **PASS**, 1,059 files.
- Security run `36376500318`: **PASS**
- Deep Security run `36376500400`: **PASS**
- Governance run `36376500340`: **PASS**

**Trial/error record**
1. Initial smoke sequencing on `e61fd23c12023ce22fbdf27dbb88a18c7e32e4cd` failed because the world-menu popover remained open after Settings closed; its owning Escape handler correctly consumed the next Escape before machine hierarchy handling.
2. Source inspection confirmed this was an intentional ownership boundary in `public/experience-rebaseline.js`, not a product defect.
3. The smoke setup was corrected to close the world menu and verify focus returned to the Menu trigger before exercising machine hierarchy Escape.
4. Corrected exact-head `9515f57b63fc043600812c445cb267dcbe6dd954` passed the complete five-gate verification set.

**Boundary**
- This closes S22 Browser accessibility smoke coverage at repository/browser verification level.
- It does not claim universal WCAG conformance, live deployment, runtime proof, human acceptance, or 029 release authorization.
- No backend/runtime/geometry authority moved.

**Status:** IMPLEMENTED -> REPOSITORY-VERIFIED.


### E404-S23 — Responsive machine bounded proof

**Claim:** S23 has a single canonical responsive presentation contract across desktop, compact/tablet, and phone viewport tiers. The contract may adapt framing, panel containment, pointer affordances, and presentation density, but it does not change semantic identity or backend authority. This record captures the current repository/browser proof only; it does not close the S23 formal exit.

**Current exact head**
- Evidence-bearing head: `53d41d7ecc38e617a1f108ba52e1d8490ac66819`
- The live branch may advance through documentation-only reconciliations; that does not rewrite this immutable evidence anchor.
- Behavior head: `0607b2ddb5bf77355a1684135da3c924ad6f03b8`.
- Canonical Browser: run `36382059034` — **PASS**, **87 passed / 4 skipped**
- Full-System: run `36382059073` — **PASS**, **1,128 passed / 0 failed / 0 skipped**
- Security: run `36382059095` — **PASS**
- Deep Security: run `36382059092` — **PASS**
- Governance: run `36382059037` — **PASS**
- Governance `review-readiness` is **SKIPPED** because #404 remains Draft.
- Browser proof runs the S23 viewport matrix at **1280×800 desktop**, **820×1180 compact**, and **390×844 phone**.
- The Browser test checks responsive tier/orientation, canvas responsive metadata, zero horizontal/vertical overflow at those viewports, camera-radius adaptation, 10-seat presentation, settings-panel containment on compact/phone, touch-pointer orbit response, and reduced-motion state continuity.
- Commit `0607b2dd` corrected the S23 browser harness to use the canonical `TeamAiResponsive.getState()` owner; no duplicate Hero responsive API was retained.
- Independent Node/container reproduction of the responsive contract passed for the same desktop/compact/phone cases, aspect-driven camera multipliers, capability metadata, and preservation of the user-controlled `data-density` attribute.
- Source/public parity is exact for the responsive module (`c384a69...`), camera (`48df62...`), world renderer (`64c198...`), and Hero base/runtime (`b04a22...`).

**Rows directly supported by current proof**
- Desktop classification
- Tablet/compact classification
- Phone classification
- Camera adaptation
- Panel/overlay containment on compact/phone
- 10-seat presentation/capacity exercise
- Browser-level touch-pointer orbit response
- Reduced-motion tier/state continuity, with deeper semantic equivalence already covered by E404-S22H

**Still open / not overclaimed**
- Responsive density adaptation as a measured layout policy is not yet separately proven.
- Pod/facility readability at compact/phone and maximum-density configurations is not yet demonstrated with a semantic readability/visual acceptance contract.
- The touch proof uses synthetic `PointerEvent` input in Chromium; it is not a physical-device acceptance test.
- No production deployment, production runtime, human acceptance, or 029 release authorization is inferred.

**Boundary:** Responsive behavior remains presentation-only. It does not alter Product Law, authorization, entitlement, Seat identity, provider state, scheduler authority, topology identity, or geometry ownership.

**Status:** IMPLEMENTED → PARTIALLY REPOSITORY-VERIFIED. The current exact-head repository gates pass, but the S23 product proof remains partial because density policy, Pod/facility readability, and physical-device touch acceptance are not yet demonstrated. The next S23 work should deepen those evidence gaps or repair a concrete failure, not add a parallel responsive system.

### E404-S23A — Responsive density/readability exact-head repository proof

**Claim:** S23 responsive classification, camera adaptation, presentation density, and measured screen-space readability now have exact-head repository/browser proof. The responsiveness remains presentation-only. Physical-device acceptance remains outside this proof boundary.

**Immutable executable evidence anchor**
- Exact executable head: `415bfdf609c9bd9e55c830cd64bab8c4d1608a9c`
- Main/base: `76da305f0ec3efb3d368b22fb70748f0051f4d15`
- Branch relation at the evidence head: **429 ahead / 0 behind**
- Browser run: `36393207424` (#3898) — **PASS**, **88 passed / 4 skipped**
- Browser artifact ID: `10957735482`
- Browser artifact SHA-256: `b5acfe7a755c9f040fa6072fc5e8e9f3e3f51ac2237a9027c24dd2b2382f7371`
- Full-System run: `36393207406` (#2357) — **PASS**, **1,133 passed / 0 failed / 0 skipped**
- Full-System artifact ID: `10957401242`
- Full-System artifact SHA-256: `85da7404a44ee902a42d02d9735bbc202ac38ae898be9a47e97fd4957abaa789`
- Security run: `36393207403` (#2774) — **PASS**
- Deep Security run: `36393207430` (#617) — **PASS**
- Governance run: `36393207480` (#3319) — **PASS**

**Responsive presentation contract**
- desktop: density mode `balanced`, minimum projected Seat-center separation **56 px**, minimum feature **20 px**
- compact/tablet: density mode `compressed`, minimum projected Seat-center separation **48 px**, minimum feature **18 px**
- phone: density mode `compact`, minimum projected Seat-center separation **32 px**, minimum feature **14 px**
- phone facility feature presentation scale: **1.13×**
- general `cameraDistanceMultiplier` remains unchanged from the established S10 contract: desktop **1**, compact/narrow **1.10/1.25**, phone **1.25**
- desktop readability scaling is isolated to `worldOverviewDistanceMultiplier = 0.83`, applied only to `WORLD_OVERVIEW` and `RETURN_TO_WORLD`
- focused S10 camera modes therefore retain their established radius behavior

**Independent geometry proof**
The exact renderer path was reconstructed outside CI from the same Full-System project artifact, using the actual scene geometry and camera pipeline rather than reproducing the readiness helper's scalar proxy.

| Tier | Projected Seat spacing | Projected Pod feature | Projected Facility feature | Result |
|---|---:|---:|---:|---|
| desktop | **57.67 px** | **57.93 px** | **20.21 px** | PASS |
| compact | **54.99 px** | **54.72 px** | **20.28 px** | PASS |
| phone | **33.88 px** | **33.71 px** | **14.12 px** | PASS |

The Browser run independently confirms these conditions at runtime, including the Pixel 5 `mobile-chromium` maximum-density 10-seat exercise.

**Root-cause history retained**
- Earlier S23 Browser failures exposed:
  1. render-scope loss of `seatRingRadius`
  2. stale renderer regression assertion
  3. readiness helper using camera-spec radius instead of final camera pose
  4. phone facility margin of **13.99 px** against a **14 px** guard
  5. desktop world-view readability below the **56/20 px** guards
  6. an initially global desktop camera multiplier that incorrectly changed S10 focused camera radii
- The final architecture keeps the strict readability thresholds and isolates responsive framing to the world overview, preserving S10 focused-camera behavior.

**Proof boundary**
- This is repository/browser evidence only.
- Synthetic Chromium touch input does **not** constitute physical-device acceptance.
- No production deployment, live provider execution, production Firestore state, human acceptance, or 029 release authorization is inferred.

**Status:** IMPLEMENTED → **REPOSITORY-VERIFIED** for the repository-level S23 density/readability contract. **Physical-device acceptance remains open.**