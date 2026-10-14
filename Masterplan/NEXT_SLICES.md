# NEXT SLICES — current slice

**Role:** exactly one current execution frontier. Historical queues do not belong here.

## Current Slice

TEAM-BACKEND-030 production Firestore authority, security, and runtime evidence (Issue #401)

## Status

IMPLEMENTATION ACTIVE / BLOCKED ON AUTHORIZED LIVE DATA. PR #398, PR #416, PR #417, PR #419, PR #421, and PR #422 are merged baselines. Current canonical `main` is `13356cae7e6ef8179f7e2e552211bb4d187f37fb`. PR #413 is merged and Firestore index deploy/readback is RUNTIME-PROVEN by default-branch run `36146692843`. Issue #401 remains the sole implementation frontier, but there is currently no open #401 implementation PR. Gate 3 remains blocked because the configured diagnostic scope has zero team documents. The existing default-branch `firestore-production-evidence.yml` already accepts explicit `team_id` and `seat_id`, so a separate selector implementation is unnecessary. The live branch head is the source of truth for current verification.

| Authority area | Implemented / source state | Repository proof | Live / human proof |
|---|---|---|---|
| Spatial renderer | Canonical source renderer, controller split, semantic topology, adaptive geometry, R0/R1/R2, Seat-1 wiring, camera choreography | exact-head source/test + Browser proof on current head | final deployed visual acceptance remains open |
| Firestore Seat | Canonical team-nested resolver, explicit persisted-to-domain identity mapping, Seat-owned budget/config | repository contracts and tests; missing-Seat path classifies `operator_hierarchy_absent` | real production Seat inspection remains open; documented Gate 3 selectors currently list zero team documents |
| Seat connection/provider | Seat-owned binding, credential loading, active connection resolution | repository + deployed function source reconciliation | production execution-capable relationship remains unproven |
| Task execution | Real-provider Edge source with canonical Seat-owned connection authority, truthful termination, durable handoff checkpoint, continuation execution | Full-System/Security/contract proof | live `teamai-task-execute` remains v12; promotion gated |
| Continuation | Durable checkpoint, explicit request, waiting state, fresh-turn semantics | repository E2E + deployed request boundary | live provider continuation remains open |
| Frontend/product | #400 representative MCP, Workspace, Team/Agents, Marketplace, Storage, and #392 presentation contracts | representative Browser proof | authoritative backend wiring intentionally bounded |
| Delivery | Firebase Hosting is production authority; GitHub Pages is validation-only | repository workflow/contracts | production deployment/browser observation remains open |

### 029 spatial sub-frontier (bounded, not a second current slice)

PR #424 remains the active bounded 029 spatial continuation vehicle. It does not replace the single global Current Slice above.

Current spatial order inside #424:

Y0 feature/leaf coverage → Y1 Three.js/WebGL2 renderer-substrate readiness → S2–S10 structural visual embodiment → S24 → S25 → S26 → VC1/AB1 → S27 → S28 → S29 → S30 → S31 → S32 → S33

Historical structural baseline from S8 V3 / S7-V16 / S3 V6 remains provenance: `48ddce11f365683fd4cd9e7a66df5a0154e11bb1`; prior S7-OUTER-BODY-V4 + Analysis service-bay implementation anchor: `c0542d7c6d9a8836329c64e4235e6c0fdc40137b`, with test-only E2E repair `db54ae8ac0a4203dcabc7a097ed1cff12986ad36` and its own historical five-gate proof retained below. The live PR head remains authoritative.

Historical exact-head Browser artifacts remain diagnostic provenance. S7-V21 machinery detail counts remain Analysis 18, Operations 20, Control 20 and Access-Commerce 23; S7-OUTER-BODY-V4 owns 20 presentation-only shell descriptors across four families. Production Facility Focus and menu closure are both Browser-verified: the exact fully verified head is `e15480e25684efa5587336c3e86e825c0516965b`, with Full-System `38117728770` (1,276 passed / 0 failed), Governance `38117728795`, Security `38117728783`, Deep Security `38117728814`, and Browser `38117728815` (92 passed / 4 skipped / 0 failed). Browser artifact `11693602957`, SHA-256 `cfc05fed93769a16ec7d9b9b7ba32875a55de387741d6f6657f88c33004e7c8c`. The clean production screenshots show the remaining visual discrepancy is broad selected main-shell/shoulder facets masking internal machinery, not missing focus access, the menu, or geometry topology. See `E424-2026-10-11E` for measured ROI baselines and the single-variable alpha experiment.

The persistent handoff/evidence surfaces for this sub-frontier are Issue #409 and Masterplan/TEAMAI_3D_WORLD_404_EVIDENCE.md; do not create another current-slice pointer.

#### Latest verified #424 code-bearing spatial checkpoint: 2026-10-14, S7 Control V23 load-path correction

- **Verified producing head:** [\`fe5fd4c6a513a72afec50c50115fad59290967d7\`](https://github.com/RbrtMrlsIII/TeamAi/commit/fe5fd4c6a513a72afec50c50115fad59290967d7). PR #424 OPEN / DRAFT / mergeable; Issue #401 remains the only global Current Slice. This upcoming docs-only head must receive its own exact-head gates before it is called current-and-verified.
- **V23 correction:** supersedes V22's inward bearing shift. Bearing tangent returns to \`0.18W\`; hub diameter becomes \`0.33W\` (from \`0.28W\`); drive-link tangent becomes \`0.135W\` (from \`0.12W\`). The V22 inward shift raised bearing/chamber boundary intersections from 27/60 to 39/60, so that candidate was not retained.
- **Shape-aware regression:** 30 states (Seat 1–10 × expansion 0 / 0.5 / 1), 60 bearing blocks. Uses actual renderer planar outlines for 16-side \`CYL\`, tapered Pod-outline \`CUBE\`, \`BOX\`, and 24-segment \`TORUS\` with 0.72 annulus bore; verifies bearing → hub/ring/drive-link/support and drive-link → hub/ring engagement plus no increase above the inherited 27/60 bearing/chamber boundary-intersection budget. This proves projected footprint plus Y-range engagement, not triangle-level mesh collision.
- **Exact-head gates:** Full-System [38526691986](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/38526691986) PASS, 1,298/1,298; Governance [38526691937](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/38526691937) PASS; Security [38526691997](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/38526691997) PASS; Deep Security [38526692312](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/38526692312) PASS; Canonical Browser [38526692009](https://github.com/RbrtMrlsIII/TeamAi/actions/runs/38526692009) PASS, 92 passed / 4 skipped / 0 failed.
- **Artifacts:** Browser \`11876004074\`, 13,209,159 bytes, SHA-256 \`4bd50b33ac45de20d7857162d7b2aa86c0246c2e513dc5b498fae3aaddbfd830\`; Full Project \`11876316276\`, 6,832,291 bytes, SHA-256 \`3a9bfbb3614f404435bcfdd373a707cd0c04ea939e29af37973dfbdc536d882d\`; nested project ZIP SHA-256 \`a68132ba3f25485149fb4a5ded7ca36d1817baf82554229e919101db98de76d6\`, 1,114 entries. All ZIPs pass integrity checks.
- **Local independent checks:** 26/26 focused machinery/renderer tests; 83-module source/public parity; source/public machinery files identical. Browser screenshot inspected; overall machine still reads dark/sparse compared with Hailuo/PNG. Human visual acceptance remains OPEN.
- **Next:** map remaining Control \`rotor ring → stanchion → chassis\` and collar/shaft junctions using shape-aware footprints and vertical ranges across the same 30-state matrix. Hold camera, global materials, other S7 families, ports, topology, Seat law, and backend scope.

#### Historical #424 spatial checkpoint: 2026-10-14, S7 Control V6 focus metallic hierarchy (superseded by S7-V23)

- **Historical code-bearing head:** `0c3509df8f17056e687fd343f766b68e23cf26f5`; PR #424 remains OPEN / DRAFT / mergeable. Global Current Slice remains Issue #401.
- **Visual experiment chain:** V9 `eeaa542f...` added the flared Gamma shoulder reveal; V4 `32e87778...` raised selected-focus specular gain from 0.48 to 0.72 without demonstrating a reliable luma win; V5 `fada0b37...` applied focus-only cool-silver shell albedo; V6 `0c3509df...` now renders only Control's `rotor-ring`, `rotor-ring-secondary`, and `control-collar` with neutral metallic colour [0.64, 0.68, 0.70], emit 0.02, glow 0.025 and alpha 0.94 during valid Gamma facility focus. The actual energy core stays emissive/cyan.
- **Scope/invariants:** only selected `BRANCH-OUTER-GAMMA` component presentation changes. World Overview, Analysis/Operations/Access-Commerce, camera, geometry, shell/cradle descriptor count 24, topology, ports, Seat 1–10 law, V5 shell albedo and V4 focus shader constants are unchanged. Source/public renderer copies are byte-identical.
- **Independent verification:** Full-System `38434440968` PASS (1,297/1,297); Governance `38434441046` PASS; Security `38434440888` PASS; Deep Security `38434440833` PASS; Canonical Browser `38434440887` PASS (92 passed / 4 skipped / 0 failed), all at the exact current SHA. Local exact-package focused tests 10/10 pass and the parity checker verifies 83 modules. Full Project package is 1,114 files, and outer and nested ZIP integrity checks pass.
- **Artifacts:** Full Project artifact `11832163566`, SHA-256 `b7e7fe90998cf56edaa3dfa29df7fa4f18aaa92ad7d56105cfcbce8d3d9df557` (outer ZIP); nested Full Project archive SHA-256 `1169c5aa95bb4558414a00a4280e53bf03ef81aad610055e3c77251d59009b71`. Browser artifact `11833026150`, SHA-256 `c6ac5bb2703ab22122552799e43798b19e4799b07f5155073e48efce8a320e6b`. Production screenshot `facility-focus-control.png`, 1440×900, SHA-256 `4d29e9e672d1273b2e94a48443fe8c5279cfb63aa3cacfdee07842cce72dfd32`.
- **Measured rendered effect:** V5→V6 frame differs at max-channel RGB delta ≥5 on 9.59% pixels (mean absolute RGB delta 2.455). Fixed rotor-crown ROI (610,365)-(850,450) moves mean RGB [27.19,84.79,109.20] → [55.58,79.79,94.18], mean luma 74.31 → 75.68, and blue-minus-red >30 occupancy 83.73% → 41.68%. This is consistent with more neutral mechanical hardware and clearer cyan energy hierarchy. Browser frames are time-dependent, so these values are comparative diagnostics, not deterministic same-frame photometry.
- **Remaining visual gap:** whole scene still has broad, sparse outer massing versus the Hailuo/PNG references. Next slice: map a single real S7 load path from rotor ring → stanchion → chassis and the collar/shaft attachment from the exact V6 capture/video; extend only the existing S7 owner, independently test Seats 1–10 × expansion 0/0.5/1 plus the conservative 0.16 clearance floor, then rerun all five exact-head gates and inspect Browser artifact. Do not start Operations or bundle global material/camera changes.
- **Backend frontier:** Issue #401 remains blocked by `operator_hierarchy_absent`. Do not create Seat documents or call privileged `teamai-domain-bootstrap` as read-only lookup. Real Firebase Auth token production is absent from the current login handoff; `teamai-seat-budget-runtime` is not deployed; live `teamai-task-execute` remains v12 stub. Keep spatial iteration separate from the safe backend sequence: Auth/session → authorized Team/Seat evidence → field inventory/Rules → budget read model promotion → provider/continuation gate.
- **Acceptance boundary:** V6 is repository/security/governance/Browser verified and provides a demonstrated visual refinement, not final human visual acceptance. Production deployment, runtime proof, triangle-level collision proof, formal S30/S0–S33 exit, merge/release authorization and 029 completion remain OPEN.

#### Historical #424 spatial checkpoint: 2026-10-13, S7 Control V9 flared shoulder reveal (superseded by V5/V6 focus material experiments)


- **Code-bearing head:** `eeaa542fb2f66b55dcac87b759ecafc3d291d86c` on `frontend/029-spatial-world-continuation`; PR #424 remains OPEN / DRAFT / mergeable. Global Current Slice remains Issue #401.
- **Implemented geometry:** `S7-OUTER-BODY-V9` replaces the constant-width Gamma shoulder aperture with a wider rotor-facing chamber and narrower rear throat. The width/back-width ratios are `0.62 / 0.42` against the main-shell min(X,Z); flare begins at radial ratio `-0.16`; rear edge stays aligned to the existing main-shell reveal at `-0.25`. Four facilities and 24 shell/cradle descriptors are unchanged. No camera, material, alpha, topology, ports, Seat law, or backend authority changed.
- **Independent geometry checks:** Seats 1–10 × expansion `0 / 0.5 / 1` (30 states) pass simple-polygon/triangulation, authored-envelope containment, world-space shell containment, exact rear-edge alignment, annular-collar clearance through the tapered opening, full descriptor validation, fail-closed missing-profile checks, and conservative `0.16` Pod clearance.
- **Source/public parity:** shell blobs are identical (`dadfee84e95b8eedc9bf80a170bea7494ea9b053`); renderer source/public blobs are identical (`970a7d28741eafd07d20b2e5e29967405fc25fc3`); Three.js adapter source/public blobs are identical (`9353fb22ceeb9f48e3818ad6b654d8150342d339`). Canonical Browser steps verified machine runtime parity.
- **Exact code-head gates:** Full-System `38339029250` PASS (1,295 / 1,295); Governance Integrity `38339029201` PASS; Security Static Analysis `38339029297` PASS; Deep Security Static Analysis `38339029235` PASS; Canonical Browser `38339029161` PASS (92 passed / 4 skipped / 0 failed). Full Project artifact `11785917325`, SHA-256 `cf614638e01136c34e4cbd8ed87545db167c3954130684b2dbeb29840eea9d70`; Browser artifact `11786657383`, SHA-256 `b0859fe95870952eff0afd905e76d16e1b1c47aec36e72fdf4821bb2c20bb89a`. Both were downloaded; local hashes match and ZIP integrity passes.
- **Visual disposition:** the actual `/hero/` Control focus capture shows the flared opening and exposed axial rotor/collars. This improves mechanism visibility, but the shell remains dark and visually bulky relative to the endorsed Hailuo/PNG direction. Treat that as an engineering observation, not human visual acceptance. Human acceptance remains OPEN.
- **Next:** explicitly review/accept or reject the Control/Gamma capture. Do not begin Operations or add further visual/geometry variables until that decision. If the gap remains, use the V9 capture as a fixed baseline and change one measurable variable at a time.
- **Head discipline:** this evidence/docs update advances HEAD; V9 gates above are for the code-bearing parent only. The documentation head needs fresh exact-head gates and its own inspected Browser artifact. No merge, deployment, release, or human-acceptance authorization is implied.

#### Historical #424 spatial checkpoint: 2026-10-12, S7 Control V8 shoulder-reveal implementation (superseded by V9)

The V8 code-bearing checkpoint and its runner stall remain historical evidence for that exact head only; V9 now supersedes the stalled Browser attempt. Do not transfer any V8 gate status to V9, or V9 gate status to the resulting documentation head.

- **Code-bearing head:** `c88661c5f85c248f6eb43369e14eece284252a7e` on `frontend/029-spatial-world-continuation`; PR #424 remains OPEN / DRAFT. Global Current Slice stays Issue #401.
- **Implemented geometry:** `S7-OUTER-BODY-V8` adds `control-rotor-shoulder-reveal-v1` for Control/Gamma only. The opening width is 0.52 of the shoulder's smaller X/Z footprint; its rear endpoint is referenced to the main-shell scale and compensated for the shoulder radial offset. Existing radial-axis core, two annular collars with open bores, two stanchions, and all other family geometry remain. Shell/cradle descriptor count remains 24. No camera, material, alpha, topology, port, Seat-law, or backend-authority change.
- **Independent exact-package geometry run:** Seats 1–10 × expansion 0 / 0.5 / 1 (30 states); zero containment, triangulation, descriptor-validation, or world-space rear-edge-alignment failures. Maximum calculated rear-midpoint delta is (1.78\times10^{-15}) scene units. The minimum conservative cradle/inner-Pod gap was 3.208 units against the required 0.16 floor; minimum shoulder-to-main-shell axis-aligned envelope margin was 0.0873 units.
- **Exact code-head verification:** Full-System run `38259483705` PASS (1,295 / 1,295 tests); Governance `38259483585` PASS; Security `38259483598` PASS; Deep Security `38259483588` PASS. Full Project artifact `11751392851` (6,814,192 bytes), SHA-256 `73b9b5bd7074173cf9dcec437ecc7dff85e7ab253478905110a6207daf3c387a`; download matches the CI digest and ZIP integrity. Exact-package Node syntax checks pass and source/public shell copies are byte-identical.
- **Browser status:** Code-head run `38259483608` remained at `Install Playwright Chromium` with no artifact; the equivalent install step took 23 seconds on the preceding successful run but exceeded 10 minutes in this attempt. This is a runner/setup stall, not a geometry-test failure, and is NOT a Browser pass. The subsequent exact-head Browser attempt owns the next terminal result; track that result and artifact in Issue #409 without committing repeated evidence-only pointers.
- **Visual disposition:** NOT YET ASSESSED for V8. Human visual acceptance remains OPEN; the prior V7 screenshot still shows the broad shell competing with the mechanism. Keep camera/material/alpha and all non-Control families frozen while inspecting the V8 production Hero capture.
- **Next action:** inspect the next exact-head Browser artifact and compare the Control/Gamma focus capture against the preserved V7 baseline plus the MP4/endorsed PNG as visual direction only. Confirm that the core and collars are easier to read without shell escape, UI regression, or a Seat/Pod/port invariant change. Do not start Operations until the visual decision is made. No merge, deployment, release, or production mutation is authorized.

#### Historical #424 spatial checkpoint: 2026-10-12, S7 Control V7 (superseded by V8)

- **Verified code head:** `3d84bfdcc8c327cfcbc3147eeff22b6429c1fa73` on `frontend/029-spatial-world-continuation`. PR #424 remains OPEN / DRAFT / mergeable. Issue #401 remains the sole global Current Slice.
- **Implemented geometry:** `S7-OUTER-BODY-V7` adds the authored radial-axis Control rotor profile (`radial-axial-v1`) with a lengthwise cylindrical energy core, two closed annular collars with open bores, and the existing two stanchions. Total S7 shell/cradle descriptors remain 24 (20 base + 4 cradle); source/public shell, WebGL renderer, and Three.js adapter pairs are byte-identical.
- **Independent geometry:** focused S7 tests cover Seat counts 1–10 and expansion amounts 0 / 0.5 / 1. Real Three.js core/ring bounds, custom WebGL cap/wall winding, open collar bores, descriptor normalization, authored-envelope containment, and the governed `0.16` conservative Pod-clearance floor pass.
- **Exact-head proof:** Full-System `38253448663` PASS (1,294 / 1,294); Governance `38253448327` PASS; Security `38253448362` PASS; Deep Security `38253448438` PASS; Canonical Browser `38253448413` PASS (92 passed / 4 skipped / 0 failed). Full Project artifact `11749098398`, SHA-256 `9022a1602de3badb1a218f8802b420deb116ed1d13ebed6b63d94239cf17431c`; Browser artifact `11749249090`, SHA-256 `770f1de57e46d1ae985239e4e1af0336b78f23d0ca690c5d48c8ae02b856f539`. ZIPs downloaded and integrity-checked.
- **Visual disposition:** improved, not accepted. The new rotor axis and paired collars are visible in the production Hero focus capture; compared with V6, about 7.84% of full-frame pixels and 13.04% of the mechanism ROI changed above the comparison threshold. The selected outer housing still dominates the machine, and the reference reads the internal rotor more clearly. Human visual acceptance remains open.
- **Next bounded slice:** stay on Control/Gamma. Design and independently sweep a narrower shoulder-plate reveal before modifying that layer; a copied wide reveal previously failed authored-envelope checks in 6–9 of 30 configurations. Require a simple/triangulatable outline, no occupied geometry outside the canonical envelope, topology/ports/Seat law unchanged, and the `0.16` clearance gate preserved. Keep camera, materials, alpha, and other facility families frozen while comparing a new exact-head Hero capture against `assets/3D_Vision/hailuo.mp4` and the endorsed storyboard PNG. Do not start Operations before this visual decision.

#### 2026-10-11 exact-head S4/S5 and rendered return-midpoint verification

The current code-bearing head is `23e103e251f8cc0cbe297c4d7ba43702a9a5f50f` on the existing PR #424 branch. Exact-head five-gate proof:
- Full-System `38151012015`: **PASS, 1,287 / 1,287 tests**; Full Project artifact `11706629159`, SHA-256 `83e9b21df1d1f634e142d8dad379c360ba5919fc7d6e5ee35b996bf8f8d8dc37`.
- Governance `38151012000`: PASS.
- Security `38151012037`: PASS.
- Deep Security `38151012038`: PASS.
- Canonical Browser `38151012021`: **PASS, 92 passed / 4 skipped / 0 failed**; Browser artifact `11705524834`, SHA-256 `f2b7649c35285da032f29ac6b1ea5522ef968b01f1ddb09374bb4685387ee049`.
- Both downloaded artifacts match their CI SHA-256 digests and pass ZIP integrity.

Current S4 fan: uniform 180° for Seats 1–9; symmetric 165° for Seat 10 at angles −82.5°, −56.35°, −30.2°, 0°, 30.2°, 56.35°, 82.5°; radial factor `2.16 + 0.02 × expansionAmount`; Connection coupler travel 0.18. The previous 1.66 compact factor remains historical. S5 authored-subject matrices pass both Seats 1–10 × shell states 0 / 0.5 / 1 × seven divisions against world obstacles, then with six sibling divisions, at the 0.16 conservative AABB floor. Triangle-mesh collision proof is still separate.

Rendered preview return proof is now real rather than telemetry-only. The QA-only `?testMode=1` pause seam freezes the actual RAF at return progress 0.504 / transformation 0.494 and saves the visible canvas before resuming. At per-pixel max RGB delta >8: transform-mid changes 69,607 / 846,080 pixels (8.23%); return-mid changes 65,267 / 846,080 (7.71%) from both World and settled Return. The initial World and settled Return canvas PNGs are exact byte matches; the return-mid PNG has its own verified hash. See `E424-2026-10-11G`.

**Current verified spatial slice: Control nested rotor cradle (`S7-OUTER-BODY-V5`, `control-rotor-cradle-v1`).** Code-bearing head `0bfc1b7cb3e54b81aee701e14389948b22116db1`; Full-System `38199544335` PASS (1,287/1,287), Governance `38199544313` PASS, Security `38199544336` PASS, Deep Security `38199544324` PASS, Browser `38199544300` PASS (92 passed / 4 skipped / 0 failed). Full Project artifact `11724783433` SHA-256 `881f659f6ca88be61dfb7e740b89f0aca8c70a3be1897f3fb67a9a6072ba9978`; Browser artifact `11725270062` SHA-256 `932dc2eb6702b829ede89c2b41a0a91fabd30a3dc22e51f011dd8373821ca169`. Both downloads matched CI and passed ZIP integrity.



Control is `BRANCH-OUTER-GAMMA`: four presentation-only descriptors (two annular `TORUS` rotor rings and two tangent `BOX` stanchions) frame the existing energy-core housing. Descriptor count increases 20 → 24. Existing Analysis service bay remains; Operations and Access-Commerce are unchanged. Geometry tests cover Seats 1–10 × expansion 0 / 0.5 / 1, require containment in the authored main-shell AABB, positive core gap, and conservative XZ pod clearance above 0.16. Topology, ports, Seat cardinality, base materials, and backend authority do not change.



The telemetry correction keeps `data-machine-world-facility-focus-normal-shell-count = 5` for five authored shell surfaces and reports the four selected cradle parts separately via `data-machine-world-facility-focus-normal-nested-massing-count = 4` on Control / Gamma (0 for the other focused families). It does not alter surface-normal shading.



**Next action is visual/reference acceptance, not another implementation family yet.** Compare the successful current production-route Hero capture against `assets/3D_Vision/hailuo.mp4` and the endorsed PNG/reference board. Assess whether the cradle reads as a physically coherent frame around the core or remains overly masked by the broad outer shell. Keep alpha and materials fixed. If the nested massing is accepted after that cold comparison, the next bounded family is Operations (fin deploy), with the same 1–10 Seat and 0.16 clearance discipline.



Human visual acceptance, production deployment/runtime proof, formal S30 exit, merge/release authorization, and 029 completion remain open. The MP4/PNG are visual direction, not frontend or semantic authority; the final rocket frame is not a required product target. See `E424-2026-10-12B` and `E424-2026-10-11G`.

### 2026-10-08 S8 endpoint/junction embodiment

Producing application head: `3a95a1bca311df2ffd99b98177ff523e068626f5` (S8 V3 + S7-V16 chassis depth + S3 V6 Pod face framing).

- 8 machine endpoint collars + 11 facility-port flanges = 19 presentation-only descriptors.
- Independent connector-segment clearance regression passes across Seats 1–10 and expansion states 0/1 at the governed 0.16 floor.
- Canonical Browser `37762854016`: **PASS**, 92 passed / 4 skipped on the exact producing application head.
- Artifact `11543143062`; SHA-256 `sha256:b26b2e285a0291a45f9190b42db9f10bf8270f8f6dbd08804cf0494ab02b7614`.
- Artifact inspection confirms the connector/junction layer is no longer pixel-identical to its earlier V1 raster path. Across the newer documentation-head capture and the old V1 capture, comparable world views differ by 1.246% of pixels, though intervening S3/S7 changes also contribute to that delta.
- V3 extends the existing authored machine/facility interface points along their radial basis with longer cylindrical connector spans and terminal collars. It introduces no topology authority, new product identity, camera authority, or backend/runtime authority.
- The current exact branch head `789c0fff8031acbb0e0bacb43fc9288a6b974565` adds documentation alignment only and has its own five-gate pass: Browser run `37764252683`, 92 passed / 4 skipped, artifact `11543389954`, SHA-256 `sha256:a529e2ca248680f958d29ab4101deda02a3d96ce758bb93737dc60e7fb623e95`.
- The production Hero surface remains darker and more skeletal than the endorsed visual direction, and the outer machine bodies still lack convincing nested mechanical attachment. Human visual acceptance is therefore open.
- Next bounded visual slice inside #424: test selected-family shell opacity only during production `FACILITY_FOCUS`. The exact `e15480e…` screenshots establish fixed ROI baselines; reduce the selected `main-shell` alpha from 0.80 to 0.32 and selected `shoulder-plate` from 0.88 to 0.42 only while facility focus is valid. Keep World Overview values, unselected family values, base collar/upper cap, materials, shader normals, depth-write behavior, geometry, topology, ports, Seat law and 0.16 clearance unchanged. Browser-test the focus-specific profile, capture the same ROIs and compare luma/highlight values and screenshots before choosing the next owner-level change.
- Manifest hygiene follow-up is closed: direct renderer import coverage is guarded; the previously omitted renderer dependencies are published; the source-side owner for `hero-cam3-tree-center-zoom.js` has been restored.


### 2026-10-07 real-product visual finding

The exact-head Browser artifact now contains an actual `/hero/` video capture. It confirms the 10-seat product surface is interactive and traverses selection, division focus, return, and turn-loop states. It also confirms the remaining visual gap directly on the product surface: the scene is still darker, more skeletal, and less mechanically dense than the bright manufactured-machine reference. The final rocket-hologram storyboard frame is not a required target. Product Law remains authoritative at 10 seats.

The next structural order remains inside S0-S10. Current verified embodiment now covers S2 Core and S3 Pods, plus the previously verified S7 analysis and operations families. The next family must be selected from the real remaining physical gaps, independently measured before implementation; it must not be inferred from the storyboard alone.

### 2026-10-08 S7-V14 facility body production parity

The bounded structural slice promotes the already-authored S7 facility body shell grammar into the canonical production Hero renderer.

- Four existing S7 facilities retain their existing semantic identities and family roles.
- Each facility receives five presentation-only layers: main shell, base collar, shoulder plate, upper cap, and mechanism housing.
- The runtime therefore renders **20** authored body descriptors with four distinct silhouettes.
- The authored shell module is now included in the spatial runtime publication manifest, with source/public renderer and shell copies synchronized.
- Independent conservative XZ shell-versus-Pod clearance was sampled at Seat counts 1, 5, and 10 across closed, half, and expanded states. The minimum measured margin is approximately **2.7371 units**, above the governed **0.16** requested clearance.
- Exact-head Browser artifact: `11498924852`; independently matched ZIP SHA-256: `sha256:acf913a735414db54a761737d5834047b0b5ce5edd2e45070cb1e6061d80f7e3`.
- The actual `/hero/` capture now contains the promoted outer body masses. The Hailuo MP4 and endorsed PNG remain visual-direction references only; the storyboard's eight-Pod composition does not override TeamAi's 1–10 Seat Product Law.

This closes **S7-V14 repository/browser verification** only. Human visual acceptance, production deployment/runtime proof, and merge/release authorization remain open.

## Exact-head Browser completion discipline

For the 029 spatial companion, **CI running is not a terminal evidence state**. A change remains unaccepted until the Canonical Browser workflow has finished on the exact current head and produced its terminal report/artifact. A failed, cancelled, stale, or missing Browser result must be diagnosed, not treated as completion.

While the required CI/Browser validators are running, non-conflicting work may continue in the same #424 vehicle: repository history/debris/stale-reference search, Product Law and feature-coverage reconciliation, authority-graph review, independent geometry calculations, visual-reference comparison against the preserved Hailuo MP4/PNG inputs, and preparation of the next bounded commit. Do not mutate the tested proof target blindly while a current exact-head validation is still running.

## 029 acceptance objective

The spatial continuation is accepted only as a **product-integrated semantic machine**. Visual fidelity to the Hailuo MP4 and endorsed PNG/reference-board is necessary design guidance, but it is not sufficient. Product Law, the canonical frontend feature grammar (#400), the 029 product ledger (#278/#405), interaction/read-model contracts, S0-S10 geometry/mechanics/topology/camera, and applicable S22-S33 acceptance gates must all remain coherent. No visual effect, material pass, or screenshot resemblance may substitute for a missing product or structural contract.

## Objective

Converge the 029 Spatial World implementation and the #392/#400 runtime/product surfaces without creating competing authority.

The current chain is:

```
Product Law
  → current Issue/PR execution boundary
  → canonical spatial source
  → canonical Firestore Seat/domain state
  → trusted Edge runtime
  → durable result/checkpoint
  → explicit continuation
  → frontend read-model + user intent
  → exact-head verification
  → controlled deployment
  → production observation
```

The audited ownership fixes now include a neutral machine-subject geometry owner instead of a production-to-preview dependency, and identical uncapped candidate discovery semantics between Node and Edge canonical Seat resolution.

## Dependencies

- `Product_Law/PRODUCT_LAW.md`
- `Product_Law/WIRING.md`
- `Masterplan/MASTERPLAN.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- Issue #396 — historical 029 Spatial World construction guide, superseded for active execution by #405
- Issue #400 — Canonical Frontend Feature & Spatial UX Contract
- #392 — Seat budget, usage, handoff, continuation, and cooperation runtime
- Merged PR #398 — reviewed 029 structural baseline
- Issue #401 — 030 production Firestore authority/security/runtime evidence
- `.github/teamai/authority-manifest.yml`
- `backend/BACKEND_LIVE_SERVICE_STATUS.md`
- `docs/RECONCILIATION_FIRESTORE_WRITE_AUTHORITY_REVIEW.md`

## Verification

All substantive claims are admissible only for the exact PR `base...head` under review.

- **Governance Integrity:** active authority graph, forbidden/historical routing, current-slice grammar, proof-target consistency.
- **Full-System:** typecheck, trusted Edge compilation, machine source/public parity, project tests, package verification.
- **Security Static Analysis:** source and secret-boundary analysis.
- **Canonical Browser:** observable entrance, machine world, facility, responsive, and reduced-motion behavior.
- **Independent geometry:** 1–10 Seat density, maximum-density ring separation, semantic subject bounds, topology continuity, connection corridors, and route sampling.
- **Production Firestore diagnostic:** read-only metadata-only inspection of the real authorized Coder Seat.
- **Runtime proof:** controlled new task-executor deployment only after Seat-shape/connection validation, then provider incomplete termination → durable checkpoint → explicit continuation request → target Seat-owned connection → fresh budgeted turn → truthful completion.
- **Deployment proof:** governed Firebase Hosting deployment followed by production browser observation. GitHub Pages remains validation-only.

Green CI does not prove Firebase runtime state, provider execution, production deployment, or human acceptance.

## Completed capability slices — 2026-09-22
- Production Firestore Seat diagnostic workflow/script wiring is now contract-tested; the live diagnostic remains manually dispatched and requires protected secrets plus a real Seat ID.
- Backend cleanup removed the duplicate `src/server.ts` in-memory Fastify runtime. `src/main.ts` is the sole configured local Node entrypoint, guarded by `tests/backend-runtime-entrypoint.test.mjs`.

- R0 workspace receiving choreography now has a semantic presentation model and canonical WebGL rendering pass from the Seat connection route into `WORKSPACE_CENTER`.
- Seat Budget Settings is a real end-to-end configuration capability through a trusted Edge boundary and canonical Seat transaction. Its live function is deployed as `teamai-seat-budget-settings` v1.
- Seat Budget durable runtime read model is implemented and exact-head verified. It reads the latest Seat-owned `execution-results` evidence and distinguishes authoritative budget accounting from legacy raw usage.
- Firestore collection-group index configuration is checked into `firestore.indexes.json`, with a manual indexes-only deployment workflow. At this 2026-09-22 checkpoint, live promotion of `teamai-seat-budget-runtime` was blocked pending index deployment; the prerequisite was subsequently satisfied and is now RUNTIME-PROVEN by run `36146692843`.

- R1/R2 browser regression was diagnosed from the exact-head Browser artifact and repaired at `b2957c4430ac66d970ab0db695bc04b3f90eed4c`; the canonical Browser gate passes. A dedicated canonical R1/R2 articulation browser contract now runs on every exact head. This closes the observed render-loop exception and adds runtime proof, but does not complete final spatial visual acceptance.

- Default-branch `firestore-seat-shape-diagnostic.yml` now invokes the exact-path evidence probe so the first 030 Seat evidence run can be dispatched without merging #402 first. Live Seat inspection remains unproven until that dispatch succeeds.
## Evidence-state contract for pre-merge review

Use these states consistently in the checklist and review discussion:

```text
IMPLEMENTED
  source/architecture exists and is covered by repository contracts

REPOSITORY-VERIFIED
  exact-head automated tests prove the stated behavior

LIVE-DEPLOYED
  connected service inventory/source inspection proves the artifact is deployed

RUNTIME-PROVEN
  a real runtime interaction produced the claimed durable/observable result

HUMAN-ACCEPTED
  the authorized human reviewer/operator accepted the behavior for promotion
```

A checked implementation item must not be read as LIVE-DEPLOYED, RUNTIME-PROVEN, or HUMAN-ACCEPTED. Production data that is no longer needed for evidence is handled only by a governed cleanup/probe procedure, never by manual field deletion.

## Post-#398 production-data strategy

After #398 is merged, the next vehicle should create **fresh run-scoped Firestore evidence** using the canonical runtime/data path. New probe documents should carry a unique run namespace and should not reuse or mutate historical probe documents. The first run must be read/write scoped to an operator-authorized test hierarchy and must never print provider secrets.


## Historical 029 continuity

TEAM-EXPERIENCE-029 remains the governing 029 product lineage. The post-#346 control-plane reconstruction remains historical context; PR #398 is the reviewed structural baseline now landed on `main`. No historical vehicle is reopened as a parallel current implementation path.

## 2026-09-28 029 spatial acceptance companion

PR #404 is the merged historical 029 reconstruction vehicle. PR #424 `frontend/029-spatial-world-continuation` is the active bounded spatial continuation vehicle; it does not replace the single global current slice above. S22 Accessibility is now repository/browser-verified through the canonical Browser smoke contract. Fresh exact-head evidence was captured on `9515f57b63fc043600812c445cb267dcbe6dd954`: Browser run `36376500367` passed **86 tests / 4 skipped**, Full-System run `36376500301` passed **1,122 / 1,122**, and Security, Deep Security, and Governance all passed. The detailed spatial evidence remains in `TEAMAI_3D_WORLD_404_EVIDENCE.md`, with `TEAMAI_3D_WORLD_404_CHECKLIST.md` as the status ledger.

S22 now has repository/browser proof for keyboard navigation, visible focus, deterministic accessible names, state announcements, error/blocked reasons, non-color-only meaning, Escape/back, return-to-parent, reduced-motion semantic equivalence, and Browser accessibility smoke. These are repository implementation/evidence facts, not 029 completion claims. No production deployment, human acceptance, provider execution, or merge authorization is inferred from these results.

### S24 continuation boundary

S23 remains repository/browser-verified with physical-device touch acceptance open. PR #424 may advance S24 material/lighting integration as an explicitly bounded 029 companion while Issue #401 remains the global current-slice authority. S24 completion requires fresh exact-head proof and a post-material S23 readability/contrast recheck because materials can change perceived visibility without changing screen-space geometry.

## 030 successor frontier

The first successor implementation slice is deliberately additive:

- fresh run-scoped Firestore metadata evidence under `runtime-diagnostics/{runId}`;
- exact canonical Seat/connection inspection without mutation of canonical Seat/Connection documents;
- production evidence remains manually dispatched and protected by Actions secrets;
- the default-branch `firestore-seat-shape-diagnostic.yml` filename remains the historical Gate 3 fixed-selector dispatch vehicle;
- the default-branch `firestore-production-evidence.yml` is the existing generalized protected dispatch vehicle and accepts explicit `team_id` + `seat_id` selectors;
- Rules hardening is downstream of observed field inventory;
- live `execution-results` index deployment/readback is RUNTIME-PROVEN by run `36146692843`;
- real-provider execution remains separately gated behind Gate 3 Seat proof.

## Review-readiness guidance checkpoint

Issue #415 is a governance/verification infrastructure vehicle and does **not** replace or create the singular current slice above. It reconciles the active reviewer procedure with the PR lifecycle: proof-target-first review, exact-head evidence, explicit distinction between PR verification gaps and broader Issue backlog, and the boundary between AI advisory evidence, `review-readiness`, human approval, and merge authorization. Issue #414 remains historical runtime evidence for the underlying advisory-output symptom.

## Current blocker

- **Alternate Gate 3 dispatch capability is already present.** The default-branch `firestore-production-evidence.yml` requires `team_id` and `seat_id` and passes them to the existing metadata-only probe. This is a capability fact only; it does not authorize a live Team/Seat pair.

- **Production Firestore Seat shape remains unverified and is classified as `operator_hierarchy_absent`.** Fresh Gate 3 run `36141179411` on main `529fede864df0218947377e1d50e48f096c4a7c7` returned 404 for documented `gate3-test-team` / `gate3-test-seat` with `teamDocumentCount=0` and `teamListError=null` (run-scoped evidence `run-2026-09-25T13-28-39-012Z-7f6a60cf-a26`). Earlier exact-path run `35763013851` recorded the same empty-hierarchy condition. This is not a collection-group HTTP 400, not an index defect, and not a probe-auth failure. The probe does not create Seat documents. The archived 2026-09-03 Gate 3 PASS proves that the same named hierarchy was successfully exercised under a verified Firebase UID at that earlier time, but the archived record does not expose the UID value; the current diagnostic scope is the protected `TEAMAI_FIREBASE_TEST_UID` secret. Therefore repository evidence does not establish whether the current empty hierarchy is a deletion/reset event or a scope/identity change. Inspection cannot proceed until an operator-authorized Team/Seat pair is supplied through the existing generalized dispatch vehicle or an authorized hierarchy exists under the documented selector. Seat authorization, entitlement, budget, and execute-capable connection remain unproven.
- **The live task executor is still v12.** The newer repository Edge implementation remains gated behind the production Seat proof.
- **Real provider continuation is unproven.** Repository continuation tests cannot substitute for the live exhaustion/checkpoint/continuation/completion chain.
- **Firestore index verification is RUNTIME-PROVEN.** PR #413 merged at `ce1656b7190fa8657253385fd884837ff7d12653`. Fresh default-branch run `36146692843` passed deploy and normalized readback (`requiredCount=1`, `deployedCount=2`, `missing=[]`). The unrelated extra live index remains preserved; no `--force` deletion was used. This is no longer a current implementation blocker.
- **`teamai-seat-budget-runtime` remains undeployed.** The former index prerequisite is satisfied; live promotion is now gated on Gate 3 Seat-shape evidence, not on index presence.
- **Firestore field-level Rules hardening is not yet final.** The real Seat field inventory must be reconciled before narrowing authenticated owner writes.
- **Final spatial acceptance remains open.** The 10-seat envelope, R0 receiving choreography, R1/R2 articulation, responsive behavior, reduced motion, and accessibility interaction matrix need final evidence.
- **Merge authority remains separate.** #398, #402, and #413 are merged baselines. PR #404 is merged historical provenance and must not be reopened; PR #424 is the active spatial implementation vehicle and must not absorb #401 backend authority. PR #416 is governance/review-readiness infrastructure only.

### Shared CI support: advisory issue preflight

PR #407 is infrastructure support for Issue #406. It is not a replacement current slice and does not create a second product implementation frontier. The advisory control plane validates issue metadata once before provider fan-out and treats explicit `none`/`n/a` as no owning issue.

The reusable advisory-runner path and direct-push event-graph repair are infrastructure support only. They are not a replacement current slice, not 029 completion, and must not be mixed into Draft PR #404.


### 2026-09-29 successor-session checkpoint

Active spatial vehicle: PR #424 / `frontend/029-spatial-world-continuation`.
Current exact head: `6007a87a14175a85de0cbc40fb0a95f51d876596`.
Current relation to `main`: 150 ahead / 0 behind.

Fresh exact-head evidence:
- Full-System `36582031552` PASS
- Governance `36582031480` PASS; review-readiness skipped because #424 is Draft
- Security `36582031514` PASS
- Deep Security `36582031459` PASS
- Canonical Browser `36582031551` PASS
- Browser artifact `11041060023`
- Browser artifact digest `39261cb7b7858465f38cdde49e02c041ce15b38f83d814fd187bf147d123b6ae`

The final Browser artifact was inspected. The structural candidate is executable and coherent, but S2-S10 human visual acceptance remains open because the current Three.js embodiment is still intentionally substrate-like/skeletal compared with the target manufactured-machine direction.

A final hygiene correction on this exact lineage removed one duplicated `data-structural-material-model` assignment from the public structural preview and restored frontend/public parity. Do not treat this as a functional feature change.

### 2026-10-07 S7 Operations fin-deploy actuator slice

The bounded structural frontier now deepens the existing Operations / fin-deployment machine without changing semantic identity, topology, Seat capacity, camera authority, or backend/runtime authority.

- S7 machinery advances `S7-V11 → S7-V12`.
- Two presentation-only mechanical actuator housings are added: `fin-actuator-primary` and `fin-actuator-secondary`.
- Each actuator is parented to the corresponding existing deployment-fin role and included in the S7 machine subject/envelope.
- Independent representative 10-seat Beta geometry leaves approximately `0.18675` and `0.20219` units of tight-edge margin for the primary and secondary actuator respectively, above the regression minimum of `0.03`.
- Frontend/public `machine-facility-machinery.js` parity is exact.
- Exact-head Full-System, Governance, Security, Deep Security, and Browser proof remains pending until the resulting head terminates through the current CI cycle.

The reference MP4/PNG remain visual-direction inputs only. This slice adds mechanical support structure and does not claim final S7 visual acceptance or S24/S25/S26 completion.

### 2026-10-07 verified S7 Operations checkpoint

The S7 Operations fin-deploy reinforcement is exact-head verified at `af4be5fdf8e0bded3612d9ecf12efd6a19155080`. S7-V12 contains paired presentation-only actuator housings under the existing deployment-fin parents. Independent Beta housing margins are approximately `0.18675` and `0.20219` units. Full-System `37641487389`, Governance `37641487516`, Security `37641487409`, Deep Security `37641487485`, and Canonical Browser `37641487397` all pass. Human visual acceptance and downstream S24+ visual completion remain open.

### 2026-10-07 S7 Control rotor-drive-link slice

The bounded structural frontier deepens the Gamma / Control facility with two presentation-only `rotor-drive-link` members under the existing `rotor-hub`.

- S7 machinery advances `S7-V12 → S7-V13`.
- Independent 1–10 Seat geometry validation gives a minimum conservative housing margin of approximately `0.08767` units, above the governed `0.03` floor.
- Frontend/public `machine-facility-machinery.js` remains byte-identical.
- No semantic hierarchy, topology state, Seat cardinality, port authority, camera authority, or backend/runtime authority changed.

Final exact-head proof for this implementation-plus-documentation state is complete.


### 2026-10-07 S7 Control exact-head proof result

- Exact head: `4d67ac6237e614d9fb6e74c1c46389cc9691c7e5`
- Full-System: `37649479000` PASS
- Governance: `37649478928` PASS
- Security: `37649478908` PASS
- Deep Security: `37649479006` PASS
- Browser: `37649478815` PASS, `92 passed / 4 skipped`
- Browser artifact: `11496462178`
- Browser artifact SHA-256: `sha256:f86ef0cf6528585f9a11017bb31f31083b2738bd92c7d8c4fc054266f5ed8b0a`
- Real-product recording: VP8/WebM, 800×500, 25 fps, 13.0 s; video SHA-256 `339c240dcd8390dc954642e33b0a3c83c0088ca4b7307ffcc265cfa6496e8ac2`
- Current Gamma geometry minimum conservative housing margin across 1–10 Seats: `0.08767` units against the `0.03` regression floor.
- Browser captures show stable world/transform/Seat/return composition. The current facility capture is Beta/Operations, so it does not visually isolate the Gamma links; Gamma acceptance rests on authored source, focused regression, independent geometry matrix, and the overall exact-head browser pass.

### 2026-10-09 S8 outer-spine carrier production integration

**Producing application head:** `48ddce11f365683fd4cd9e7a66df5a0154e11bb1`

- Full-System `37893061074`: **PASS**.
- Governance `37893061114`: **PASS**.
- Security `37893061040`: **PASS**.
- Deep Security `37893061045`: **PASS**.
- Canonical Browser `37893061246`: **PASS**, 92 passed / 4 skipped, exact-head checkout.
- Browser artifact `11599691063`; SHA-256 `sha256:8eb129a0dc1e44af34b86670e8828a05328f15a60d2623cadbdf95c4801c5142`.
- Artifact ZIP independently downloaded; local SHA-256 matched the workflow artifact digest.
- Production carrier telemetry confirms 20 descriptors rendered: 12 beam stages + 8 hinge collars, world-overview scope only.
- Independent carrier cross-section regression passes Seats 1–10 with expansion amounts 0, 0.5, and 1 against the governed 0.16 clearance budget.
- Actual `/hero/` wide capture versus prior exact-head parent `88a5d6239caaa380231605cca418bdedf5faf70c`: 5,364 pixels changed beyond 5/255 RGB, 0.582% of pixels, bounding box x=300..1118 / y=232..534. This is a measurable but modest visual contribution, not human visual acceptance.
- The separate `s2-s10-*.png` assets belong to the Three.js structural preview and are not used as evidence for this raw-WebGL production-renderer change.

**Implementation:** `S8-FACILITY-CARRIER-V2` consumes the four existing `outer-spine` edges from canonical `machine-world-topology`; it creates no new semantic edge or topology authority. The source/public carrier and renderer are byte-identical. The manifest publishes the carrier, and direct-renderer-import closure remains guarded.

Historical selected-shell-alpha experiment proposal (completed; not the current next slice): during valid `FACILITY_FOCUS`, main-shell alpha was set to 0.32 and shoulder-plate alpha to 0.42 and compared against fixed Analysis/Operations ROIs. The measured result is recorded in E424-F: mean luma improved, but high-highlight occupancy barely moved. Do not re-run this experiment as the next slice. The current bounded next slice is structural S7 nested-machine embodiment as stated in the current overlay above.


### Historical exact-head override — 2026-10-11 checkpoint (superseded by current spatial proof above)

Latest completed code/test proof is `db54ae8ac0a4203dcabc7a097ed1cff12986ad36`: all five gates PASS, with Browser artifact `11676005427` / SHA-256 `cf7610dfc24683ac8a14e4e14c76347fbc31d00c7d3cf936125e920f8f62065c`. The prior `45c896e…` and `23da77a…` records below are historical checkpoints only. See E424-2026-10-11C for the actual Hailuo MP4 hash, inspected frame states, exact production screenshot, descriptive luma comparison and the newly confirmed production Facility Focus connectivity gap. The structural Three.js Facility screenshot remains QA evidence, not production-path evidence.


### Historical current-head override — selected-shell alpha experiment (completed; superseded by E424-2026-10-11G)

This is historical provenance for the selected-shell-alpha experiment before it ran. The experiment is complete and its measured results are recorded in E424-F. The live exact-head verification, rendered return capture proof, and current structural next slice are in the 2026-10-11 current overlay and E424-G above.
