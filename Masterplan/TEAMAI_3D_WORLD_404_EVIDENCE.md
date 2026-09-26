# PR #404 — Evidence Registry

**Owner vehicle:** PR #404  
**Governing issue:** #405  
**Purpose:** one canonical evidence index for the 029 spatial reconstruction program.

This file is the **evidence ledger**, not a second roadmap. The detailed construction checklist remains in [TEAMAI_3D_WORLD_404_CHECKLIST.md](./TEAMAI_3D_WORLD_404_CHECKLIST.md), the ownership map remains in [TEAMAI_3D_WORLD_404_AUTHORITY_MATRIX.md](./TEAMAI_3D_WORLD_404_AUTHORITY_MATRIX.md), and the broader construction contract remains in [TEAMAI_3D_WORLD_MASTER_CONSTRUCTION_PLAN.md](../docs/TEAMAI_3D_WORLD_MASTER_CONSTRUCTION_PLAN.md).

## How the evidence system works

Use three layers, in this order:

1. **PR #404** = newcomer-readable navigation and current-state summary.
2. **Masterplan/** = durable execution status plus evidence references.
3. **Source / tests / CI artifacts** = primary proof.

A checkbox is a **status marker**, not the proof itself. A proof claim is admissible only when it points to a concrete source, test, exact-head run, artifact, or controlled runtime observation.

Evidence state remains:

IMPLEMENTED → REPOSITORY-VERIFIED → LIVE-DEPLOYED → RUNTIME-PROVEN → HUMAN-ACCEPTED

A higher state does not follow automatically from a lower one.

## Latest validated spatial implementation anchor

- **latest validated spatial implementation head:** 8944ececfd6dfee15a39833107dd3bac932411bd
- **main:** 529fede864df0218947377e1d50e48f096c4a7c7
- **at that validation point:** #404 was **117 commits ahead / 0 behind**
- **PR state:** OPEN / DRAFT / GitHub reports mergeable
- **reconciliation commit:** 8944ecec
- **full project tests:** **1,050 passed / 0 failed / 0 skipped**
- **canonical browser verification:** PASS
- **security/governance checks:** PASS
- **review-readiness:** SKIPPED because the PR remains Draft. This is lifecycle state, not approval.

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