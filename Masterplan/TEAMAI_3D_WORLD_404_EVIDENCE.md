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

**Boundary:** this proves the spatial inheritance contract only. It does not prove live Workspace data, authorization, scheduler eligibility, durable state, or execution.

**Status:** IMPLEMENTED → REPOSITORY-VERIFIED once the fresh exact-head CI run passes.

