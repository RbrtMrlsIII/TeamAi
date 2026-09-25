# TEAMAI 3D WORLD / PR #404 — MASTER EXECUTION CHECKLIST

Owner vehicle: PR #404 frontend/029-spatial-world-reconstruction
Dedicated Issue: #405
Scope: all remaining 029 spatial construction, feature integration, cleanup, documentation alignment, verification, acceptance, and ProMax polish.
Rule: no additional implementation PRs for S0-S33. PR #404 remains the sole spatial implementation vehicle.

## Evidence navigation contract

This checklist is the **status ledger**. It does not duplicate proof details.
Detailed proof references, exact-head runs, geometry-history evidence, artifact hashes, and evidence-state boundaries are maintained in [TEAMAI_3D_WORLD_404_EVIDENCE.md](./TEAMAI_3D_WORLD_404_EVIDENCE.md).

Use the evidence IDs in section-level notes below rather than creating one evidence record per checkbox. The PR #404 description is the newcomer-readable entry point and links back to this checklist and the evidence registry.

## A. Verified starting-state diagnosis

### A1. Repository baseline
- [x] PR #398 is merged into main at 87f466fb0edac3784280128785a8fd2dc757e749.
- [x] PR #398 is treated as reviewed structural baseline, not final 029 completion.
- [x] Canonical renderer source is frontend/spatial/machine-world-renderer.js.
- [x] Browser mirror is public/machine-world-renderer.js.
- [x] Controller/input boundary remains public/hero-flex.js.
- [x] PR #402 / Issue #401 remains separate backend/runtime production-evidence vehicle.
- [x] #392 remains authoritative for Seat budget, usage, handoff, continuation, and cooperation.

### A2. Current physical world census from source
- [x] Current core layout contains 1 HUB-CORE + 10 inner Seat pods + 4 outer housings = 15 physical modules at maximum capacity.
- [x] Current R1 catalog contains 3 presentation display items: docs, rules, connect.
- [x] Current R2 catalog contains 4 presentation items: setup engine, login, register, config branch.
- [x] Current Seat division catalog contains 7 concrete divisions: Connection, Behavior, Toolkit, Capabilities, Authorization, Workspace Scope, Task Evidence.
- [x] Current division fan span is 150 degrees across the seven indexed positions.
- [x] Current Seat division port radius is 0.28 × parent scale.
- [x] Current division radial offset is parent max horizontal dimension × (1.7 + 0.5 × expansion).

### A3. Current numeric spatial findings
At the current maximum 10-seat profile:
- [x] workspace footprint = 5.95
- [x] authored Seat-shell centerline radius = 4.55
- [x] runtime closed Seat-shell radius = 5.05
- [x] runtime fully expanded Seat-shell radius = 5.55
- [x] authored outer-housing centerline radius = 7.15
- [x] runtime closed outer-housing radius = 9.85
- [x] runtime fully expanded outer-housing radius = 10.55
- [x] R0 receiving-core radius = 4.046 at the current non-expanded workspace geometry
- [x] current 10-seat ring envelope resolves approximately R1 = 4.214, R2 = 4.382, R3 = 4.55 with approximately 0.168 inter-ring gap
- [x] current maximum-density closed adjacent Seat center spacing = approximately 2.812
- [x] current maximum-density fully expanded adjacent Seat center spacing = approximately 3.430
- [x] current Pod max horizontal dimension = 1.34
- [x] full-expansion Seat + division radial-center reach = approximately 8.498, with approximately 2.052 radial-envelope margin before component extents

Evidence: E404-NUMERIC in TEAMAI_3D_WORLD_404_EVIDENCE.md.

### A5. Root inheritance and world-expression contract
- [x] S0-S10 are explicitly declared as the canonical structural roots of the 029 spatial machine, not merely sequential implementation phases.
- [x] Every later slice S11-S33 is declared to consume applicable S0-S10 contracts rather than creating parallel spatial grammar or authority.
- [x] Product features and facilities, including S13 Workspace and S18-S20 Storage/Commerce/Settings, must project through the inherited machine roots instead of becoming isolated UI islands or invented Seat children.
- [x] S22-S29 are explicitly declared as cross-cutting world-expression and interaction layers over S0-S21, not an independent visual architecture.
- [x] Light Spatial Skeuomorphism and Dark Spatial Glassmorphism are explicitly derived from the single canonical unified theme root owned by Product Law.
- [ ] Each construction slice records and verifies the specific S0-S10 roots it consumes before declaring the slice complete.
- [x] S0/S1 root metadata enforcement is covered by `machine-spatial-root-contract.js` and its contract tests.
- [ ] Any structural constraint discovered by S22-S29 is resolved at its owning root rather than by a parallel late-stage workaround.

**Review test:** a cold reviewer must be able to trace any later feature, facility, effect, camera state, or interaction back to its semantic owner, physical assembly, topology, signal, camera, and verification roots without inventing a new machine grammar.

Exit: root inheritance is explicit, traceable, and enforceable across the entire S0-S33 program.

### A4. Visual reference reconciliation
- [x] Activation storyboard is treated as a visual/mechanical reference, not Product Law or a numeric capacity authority.
- [x] Storyboard reference shows 8 inner pods, while the canonical 029 machine supports 1–10 durable Seat slots / 10 maximum presentation modules; this is a documented reference-vs-product-capacity discrepancy, not a reason to hard-code 8.
- [x] Storyboard names four specialized outer mechanisms (telescope, fin deployment, rotating core analysis, sensor array); S7 V4 now maps all four facility destinations to authored machine grammars and first-class payload surfaces.
- [x] Storyboard timestamps are panel labels only; no video-specific timing is inferred because no video asset is part of the current project evidence.
- [x] White studio/cinematic lighting, blue/white/orange energy, metallic/glass surfaces, and holographic blueprint cues are treated as visual inputs to S22-S29, subordinate to the single Product Law theme root.
- [x] During S7, map each specialized outer module to a real semantic/product owner and replace placeholder silhouettes without creating a second facility hierarchy.
- [ ] During S33/human acceptance, verify that the final world can express the reference composition at the intended seat population without overriding the canonical 1–10 capacity model.

### A4. Active geometry discrepancy
- [x] Current full-division radial offset is approximately 2.948 for the current Pod dimension.
- [x] Current full-expansion Seat + division radial-center reach is approximately 8.498 from world center.
- [x] At the current 10-seat density, the adaptive world profile yields a fully expanded outer-housing radius of 10.55, exceeding the 8.498 Seat + division radial-center reach by 2.052 units before component extents.
- [x] The previously reported approximately 0.148-unit radial overrun is resolved in the current adaptive world profile: the 10-seat fully expanded outer-housing envelope is 10.55 versus an 8.498 Seat + division radial-center reach.
- [x] Verify actual articulated division paths against all seven-child index positions and outer-facility envelopes.
- [x] Replace the current simple envelope assumptions with geometry-aware collision/clearance calculation.

Evidence: E404-GEOM. The current proof uses authored component subjects sampled through travel, conservative AABB clearance, and the full 1–10 Seat × 3 shell-state × 7-division matrix. Triangle-level mesh collision is not claimed.

Diagnosis: the earlier 0.148-unit radial-envelope discrepancy is closed. Current proof closes the authored-path and conservative geometry-clearance contract; remaining gaps are formal acceptance, production/runtime evidence, human acceptance, and final visual/product integration.

## B. S0 — Forensics and baseline freeze
- [ ] Re-read Product Law, #278, #396, #400, #392, #83 and current Masterplan.
- [ ] Reconcile merged #398 state against main.
- [ ] Freeze physical module inventory.
- [ ] Freeze semantic tree/branch/division inventory.
- [ ] Inventory geometry owners.
- [ ] Inventory choreography owners.
- [ ] Inventory topology owners.
- [ ] Inventory browser entrypoints.
- [ ] Classify structural, compatibility, historical and obsolete files.
- [ ] Record available visual reference assets.
- [ ] Do not infer unavailable video timing.
Exit: one authoritative baseline and replaceable scaffolding list.

## C. S1 — Spatial scene grammar
- [x] Establish the canonical structural-root inheritance metadata contract (owner, semantic boundary, construction slice, required S0-S10 roots for later slices).
- [ ] Define World scene graph.
- [ ] Define PhysicalModule contract.
- [ ] Define PodAssembly contract.
- [ ] Define FacilityAssembly contract.
- [ ] Define Division contract.
- [ ] Define ExpansionMechanism contract.
- [ ] Define Port contract.
- [ ] Define Corridor contract.
- [ ] Define Edge contract.
- [ ] Define CameraSubject contract.
- [ ] Define state/effect projection contract.
- [ ] Keep semantic identity independent of mesh index and coordinates.
- [ ] Keep renderer as projection/orchestration layer.
Exit: every physical system has one explicit owner.

### C1. S1 existing-owner reconciliation
- [x] World scene graph ownership identified in `machine-hero-scene.js`, with WebGL orchestration remaining in `machine-world-renderer.js`.
- [x] PhysicalModule ownership identified in `machine-hero-scene.js::makeMachinePart`.
- [x] PodAssembly ownership established in `machine-pod-assembly.js::deriveMachinePodAssembly`; `machine-core-layout.js::createBranchConnectionCore` retains population/placement responsibility.
- [x] Resolve partitioned FacilityAssembly ownership before S6/S7 completion.
- [x] Resolve partitioned Division contract ownership before S4 completion.
- [x] Resolve partitioned ExpansionMechanism lifecycle ownership before S5 completion.
  - Current reconciliation: public/hero-hierarchy-runtime.js remains semantic OPEN/CLOSE state authority; frontend/spatial/machine-expansion-mechanism.js owns physical travel, clearance, expansion-local corridor reservation projection, and camera-subject projection constraints; frontend/spatial/machine-world-topology.js owns canonical aggregate corridor reservations. S5 must not create a competing semantic hierarchy state machine or replace S8 topology ownership.

- [x] Resolve partitioned Port derivation before S8 completion.
- [x] Resolve partitioned Corridor reservation ownership before S8 completion.
- [x] Resolve partitioned Edge identity/topology ownership before S8 completion.
- [x] CameraSubject ownership identified in `machine-subject.js`.
- [ ] Resolve partitioned state/effect projection ownership before S9/S28/S29 completion.

**Exit:** S1 is not considered structurally closed while a partitioned row can still produce a second competing authority. Established rows may be consumed immediately; unresolved rows must be closed at their owning construction slice.

## D. S2 — Central Core reconstruction
**Evidence:** E404-S2
- [ ] Authored outer shell.
- [ ] Layered core chamber.
- [ ] Receiving surface.
- [ ] Internal concentric mechanisms.
- [ ] Core energy intake/outflow ports.
- [ ] Workspace payload surface.
- [ ] Core state indicators.
- [ ] Receive/absorb/reflect/handoff states.
- [ ] Core camera subject.
- [ ] Geometry envelope verification.
Exit: center is an authored machine assembly.

## E. S3 — Pod assembly reconstruction
**Evidence:** E404-S3
**Implementation status:** checked rows below mean the Pod capability is implemented in the repository. They do not, by themselves, close the final A4 mathematical/geometry proof or later runtime/acceptance gates.
- [x] Reusable authored Pod shell.
- [x] Outer collar.
- [x] Inner chamber.
- [x] Local articulation.
- [x] Local payload surface.
- [x] Division attachment points.
- [x] Local energy/data interfaces.
- [x] Local status presentation.
- [x] 1–10 population support.
- [x] Maximum-density verification.
- [x] Responsive density model.
Exit: Pods are true assemblies and safely replicable.

## F. S4 — Division system reconstruction
**Evidence:** E404-S4 + E404-GEOM
**Implementation status:** checked rows below mean the division construction capability is implemented. Final articulated-path collision/clearance evidence remains governed by A4 and S30 proof gates.
- [x] Payload-driven division envelope.
- [x] Connection division.
- [x] Behavior division.
- [x] Toolkit division.
- [x] Capability division.
- [x] Authorization division.
- [x] Workspace Scope division.
- [x] Task/Evidence division.
- [x] Distinct geometry families where semantics require them.
- [x] Distinct attachment mechanisms where appropriate.
- [x] Stable division identity.
- [x] Geometry-aware ports.
- [x] Geometry-aware clearance.
Exit: divisions are subsystems, not scaled primitives.

## G. S5 — Expansion mechanisms
**Evidence:** E404-S5 + E404-GEOM
**Implementation status:** checked rows below mean the expansion lifecycle/mechanism capability is implemented. They do not establish exhaustive exact-path safety across every articulated child/facility combination.
- [x] CLOSED.
- [x] PREPARING.
- [x] OPENING.
- [x] ACTIVE/OPEN.
- [x] CLOSING.
- [x] Interrupted opening.
- [x] Interrupted closing.
- [x] Payload-driven travel distance.
- [x] Corridor reservation.
- [x] Collision avoidance.
- [x] Camera subject recomputation.
- [x] Reduced-motion semantic equivalent.
Exit: expansion is mechanically authored and spatially safe.

## H. S6 — Product facility assemblies
**Evidence:** E404-S3/S4/S5 implementation ancestry and current facility tests
- [x] Workspace HQ.
- [x] Projects Library.
- [x] Artifacts / Inventory.
- [x] Storage.
- [x] Team / Agents.
- [x] MCP / Capability.
- [x] Skills / Responsibility.
- [x] Orchestration / Scheduler presentation.
- [x] Marketplace / Commerce / Entitlement.
- [x] Settings / Control.
- [x] Authentication Gateway.
- [x] Verify facilities are not forced into Seat children.
Exit: product facilities have deliberate physical destinations.

## I. S7 — Specialized facility machinery
**Evidence:** current facility machinery tests + E404-S8 topology dependency
**Implementation status:** checked rows below mean the specialized machinery capability is implemented. Final world-wide spatial validation remains a separate proof concern.
- [x] Telescoping analysis facility.
- [x] Fin/structural deployment facility.
- [x] Rotational core/analysis facility.
- [x] Sensor/communication facility.
- [x] Facility-specific mechanism graph.
- [x] Facility-specific payload surface.
- [x] Facility-specific camera subject.
- [x] Facility-specific ports.
- [x] Facility-specific clearance.
Exit: outer world contains genuinely different machines.

## J. S8 — Topology and corridors
**Evidence:** E404-S8
**Implementation status:** checked rows below mean the topology/routing capability is implemented and tested. They do not replace the final geometry-aware clearance proof required by A4/S30.
- [x] Core ↔ Pod edges.
- [x] Pod ↔ Division edges.
- [x] Pod ↔ Facility edges.
- [x] Facility ↔ Facility edges.
- [x] Workspace contribution edges.
- [x] Adjacent Seat paths where semantically valid.
- [x] Unique semanticEdgeId for every edge.
- [x] Port continuity.
- [x] Corridor reservations.
- [x] Obstacle avoidance.
- [x] Route continuity.
- [x] Dynamic geometry rerouting.
- [x] Independent topology verification.
Exit: every meaningful connection is real in the semantic graph and physical route.

## K. S9 — Electricity / signal
**Evidence:** E404-S9
- [ ] Idle state.
- [ ] Active Seat state.
- [ ] Active branch state.
- [ ] Contribution transfer.
- [ ] Workspace receiving.
- [ ] Absorb.
- [ ] Reflect.
- [ ] Handoff-ready.
- [ ] Waiting for continuation.
- [ ] Blocked/error.
- [ ] Reduced-motion signal state.
- [ ] Remove visual paths without semantic edges.
Exit: energy flow is a projection of the declared machine graph.

## L. S10 — Camera/navigation
**Evidence:** E404-S10
- [ ] WORLD_OVERVIEW.
- [ ] POD_FOCUS.
- [ ] DIVISION_FOCUS.
- [ ] FACILITY_FOCUS.
- [ ] EXPANSION_FOLLOW.
- [ ] RETURN_TO_PARENT.
- [ ] RETURN_TO_WORLD.
- [ ] CONTINUOUS_TREE_TRAVEL.
- [ ] Responsive framing.
- [ ] Reduced-motion equivalent.
- [ ] Semantic subject identity.
- [ ] Subject envelope follows expanded geometry.
- [ ] Retired camera identifiers remain retired.
Exit: camera movement is spatially meaningful and payload-aware.

## M. S11-S21 — Inheritance contract for product/runtime slices
**Every S11-S21 slice inherits S0-S10. A later feature may extend the machine but may not replace its scene grammar, assembly ownership, topology, signal model, or semantic camera contracts.**

**Reviewer example:** S13 Workspace must be implemented as a projection of the S0-S10 machine, including the S1 scene graph, S2 Core/Workspace center, S6 facility ownership, S8 topology/corridors, S9 signal semantics, and S10 camera subjects. It must not become an isolated UI island or invent a parallel facility geometry authority.

Exit: a cold reviewer can trace each product/runtime feature back to the S0-S10 structural roots before reviewing feature-specific behavior.

## M. S11 — Guest machine
- [ ] Public entrance.
- [ ] Explicit Enter 3D world.
- [ ] Ten-seat presentation capacity.
- [ ] Gentle automatic orbit.
- [ ] Guest lock/limited-action state.
- [ ] Login/Sign Up invitation.
- [ ] Orbit stop during auth transition.
Exit: guest machine is coherent showroom behavior.

## N. S12 — Authenticated restoration
- [ ] Firebase identity handoff.
- [ ] Workplace restore.
- [ ] Project restore.
- [ ] Actual durable Seat population.
- [ ] Seat-to-Pod projection.
- [ ] Readiness dimensions.
- [ ] Reason-bearing unavailable state.
- [ ] No fabricated durable state.
- [ ] Correct return path.
Exit: authenticated world reflects authoritative state.

## O. S13 — Workspace capability facility
- [ ] Workspace center.
- [ ] Current project/team context.
- [ ] Active task presentation.
- [ ] Evidence/result surface.
- [ ] Workspace capabilities.
- [ ] Authorized normal-UI handoffs.
- [x] Read-model ingress/normalization is explicit and fail-closed; it does not fabricate Workplace/Project identity. Evidence: E404-S13.
Exit: Workspace is both physical core and capability surface.

- [x] S13 Workspace HQ records and validates its spatial construction context as S13-owned and inheriting the complete S0-S10 structural root set. Evidence: E404-S13.

## P. S14 — Team / Agents
- [x] Agent/application identity comes from the runtime Team / Agents read model; no facility-local Agent identity. Evidence: E404-S14.
- [x] Responsibility uses the governed Agent role vocabulary; role labels do not grant authorization. Evidence: E404-S14.
- [x] Seat assignment context comes from the runtime Team / Seat read model rather than local sample Seat choices. Evidence: E404-S14.
- [x] Skill bundle is normalized as presentation metadata and remains distinct from authorization/entitlement. Evidence: E404-S14.
- [x] Capability profile is projected from runtime Agent metadata. Evidence: E404-S14.
- [x] Readiness preserves authenticated/context/authorization/entitlement/health boundaries and fails closed. Evidence: E404-S14.
- [x] Assignment/configuration is an explicit presentation intent, not durable mutation authority. Evidence: E404-S14.
- [x] Role selection cannot imply authorization. Evidence: E404-S14.
Exit: participation is spatially legible.

## Q. S15 — MCP / Capability / Toolkit
- [x] Discover. Guest inventory is vocabulary-only; authenticated inventory is supplied through the MCP runtime read model. Evidence: E404-S15.
- [x] Inspect. Capability metadata and independent readiness dimensions are normalized without inventing backend state. Evidence: E404-S15.
- [x] Install. Lifecycle intent resolves the next canonical stage from backend-supplied readiness rather than a local installed flag. Evidence: E404-S15.
- [x] Authentication handoff. Guest/authenticated separation dispatches the existing auth handoff without owning provider credentials. Evidence: E404-S15.
- [x] Configure. Permission/project-scope requirements remain distinct lifecycle states and produce explicit presentation intents. Evidence: E404-S15.
- [x] Health/test. Connection-test and health states remain distinct from usable/READY. Evidence: E404-S15.
- [x] Equip. Equip is an explicit presentation intent and requires backend confirmation; target eligibility comes from the runtime read model. Evidence: E404-S15.
- [x] Dynamic target-owned branch. Branch identity derives from capability + runtime target + runtime branch path. Evidence: E404-S15.
- [x] Recursive capability branches. Branch paths are payload-driven and bounded, with no universal fixed branch shape. Evidence: E404-S15.
- [x] Credential boundary. External-provider credentials remain outside TeamAi presentation; TeamAi-native capabilities do not inherit that provider boundary. Evidence: E404-S15.
- [x] Presentation/runtime truth separation. Guest state is discoverable/locked, incomplete authenticated state is backend-state-required, and no target/branch is exposed without ready context. Evidence: E404-S15.
Exit: capabilities become physical equipment without authority leakage.

## R. S16 — #392 budget / energy / handoff / continuation
- [x] Configured budget. Evidence: E404-S16.
- [x] Effective budget. Evidence: E404-S16.
- [x] Reasoning allocation where supported. Evidence: E404-S16.
- [x] Work/output allocation. Evidence: E404-S16.
- [x] Consumption. Evidence: E404-S16.
- [x] Remaining. Evidence: E404-S16.
- [x] Handoff reserve. Evidence: E404-S16.
- [x] Warning threshold. Evidence: E404-S16.
- [x] HANDOFF_REQUIRED. Evidence: E404-S16.
- [x] WAITING_FOR_CONTINUATION. Evidence: E404-S16.
- [x] EXHAUSTED. Evidence: E404-S16.
- [x] COMPLETED. Evidence: E404-S16.
- [x] BLOCKED. Evidence: E404-S16.
- [x] Continue/reconfigure/close/new-command presentation. Evidence: E404-S16.
- [x] Backend remains authoritative. Evidence: E404-S16.
Exit: execution envelope is understandable without invented accounting.

## S17 — Task / evidence / report
- [x] Active task presentation. The existing Seat Task/Evidence branch remains the semantic presentation surface. Evidence: E404-S17.
- [x] Task lifecycle. Completion state and transaction state remain backend-derived presentations. Evidence: E404-S17.
- [x] Evidence state. Evidence references are normalized from the supplied runtime read model. Evidence: E404-S17.
- [x] Result state. Result and summary are projected without local execution inference. Evidence: E404-S17.
- [x] Seat report/handoff. Existing Seat report surface now exposes result, summary, findings, unresolved items, decisions, evidence refs, and next handoff context. Evidence: E404-S17.
- [x] Historical/live separation. The shell accepts the dedicated backend-read-model event rather than a direct fixture-style report event. Evidence: E404-S17.
- [x] Provenance. Read-model source is explicitly required to be backend-read-model. Evidence: E404-S17.
- [x] Artifact inspection. Evidence references are exposed as metadata only; artifact content remains outside this presentation seam. Evidence: E404-S17.
Exit: users can follow work and continuity.

## T. S18 — Storage / artifacts
- [x] Inventory state. Evidence: E404-S18.
- [x] Item selection. Evidence: E404-S18.
- [x] Metadata. Evidence: E404-S18.
- [x] Ready/empty/blocked states. Evidence: E404-S18.
- [x] Artifact state. Evidence: E404-S18.
- [x] Deferred upload remains deferred. Evidence: E404-S18.
- [x] No fabricated content. Evidence: E404-S18.
Exit: storage and artifacts are distinct honest facilities.

## U. S19 — Marketplace / commerce
- [x] Team Quality presentation. Evidence: E404-S19.
- [x] Team Population presentation. Evidence: E404-S19.
- [x] Seat capacity state. Evidence: E404-S19.
- [x] Entitlement state. Evidence: E404-S19.
- [x] Purchase intent. Evidence: E404-S19.
- [x] Transaction verification/loading. Evidence: E404-S19.
- [x] External billing authority. Evidence: E404-S19.
- [x] No visual-only purchase completion. Evidence: E404-S19.
Exit: commerce state is a projection of authoritative entitlement.

## V. S20 — Settings / control
- [x] Settings facility. Evidence: E404-S20.
- [ ] Semantic tree/branch navigation.
- [ ] Seat settings.
- [x] Budget settings. Evidence: E404-S16 + E404-S20.
- [x] Feature controls. Evidence: E404-S20.
- [x] Login/Sign Up separation. Evidence: E404-S20.
- [ ] Logout.
- [x] Return. Evidence: E404-S20.
- [ ] Back.
Exit: controls are consistently discoverable.

## W. S21 — Loading / recovery
- [ ] Navigation loading.
- [ ] Data retrieval.
- [ ] Connection test.
- [ ] MCP/tool invocation.
- [ ] AI execution.
- [ ] Handoff/continuation.
- [ ] Storage operation.
- [ ] Commerce verification.
- [ ] Authorization.
- [ ] Provider unavailable.
- [ ] Retry/recovery.
- [ ] Cancellation.
- [ ] No false-success effect.
Exit: failure states remain understandable.

## X. S22 — Accessibility
**Inherited roots: S0-S10. Cross-cutting over S0-S21; must not fork machine meaning.**
- [ ] Keyboard navigation.
- [ ] Visible focus.
- [ ] Deterministic accessible names.
- [ ] State announcements.
- [ ] Error/blocked reasons.
- [ ] Non-color-only meaning.
- [ ] Escape/back.
- [ ] Return-to-parent.
- [ ] Reduced-motion semantic equivalence.
- [ ] Browser accessibility smoke coverage.
Exit: machine is operable without mouse/color/animation dependence.

## Y. S23 — Responsive machine
**Inherited roots: S0-S10. Responsive changes may alter framing, density, and affordances, never semantic identity.**
- [ ] Desktop.
- [ ] Tablet/compact.
- [ ] Phone.
- [ ] Camera adaptation.
- [ ] Density adaptation.
- [ ] Panel/overlay adaptation.
- [ ] Pod/facility readability.
- [ ] Maximum-density 10-seat case.
- [ ] Touch interaction.
- [ ] Reduced-motion interaction.
Exit: phone is a designed machine view.

## Z. S24 — Materials / lighting
**Inherited roots: S0-S10. Theme authority: Product Law canonical unified theme root.**
- [ ] Light-skeomorphic environment.
- [ ] Primary structural material.
- [ ] Secondary machinery material.
- [ ] Glass/translucency.
- [ ] Energy material.
- [ ] Holographic material.
- [ ] Semantic emissive strength.
- [ ] Shadow/depth separation.
- [ ] Canonical theme bridge.
- [ ] Dark-glass mode remains future-gated.
Exit: materials reinforce hierarchy and state.

## AA. S25 — Holograms / blueprints
**Inherited roots: S0-S10. Payload and geometry remain semantic sources of truth.**
- [ ] Holographic core.
- [ ] Feature blueprint surfaces.
- [ ] Facility schematics.
- [ ] Data payloads.
- [ ] Labels.
- [ ] State/status indicators.
- [ ] Payload-specific detail.
Exit: machine surfaces communicate product meaning.

## AB. S26 — Ambient environment
**Inherited roots: S0-S10. Ambient effects remain subordinate to machine state and performance.**
- [ ] Star field.
- [ ] Atmospheric depth.
- [ ] Negative-space composition.
- [ ] Controlled particles.
- [ ] Ambient motion.
- [ ] State-aware ambient intensity.
- [ ] No ambient effect used as runtime proof.
Exit: environment supports machine focus.

## AC. S27 — Performance / resource discipline
**Inherited roots: S0-S10. Measure the full inherited machine, not merely cosmetic effects.**
- [ ] Frame-time measurements.
- [ ] GPU/buffer measurements.
- [ ] Duplicate-context check.
- [ ] Geometry reuse.
- [ ] Dynamic resource disposal.
- [ ] Particle budget.
- [ ] 10-seat stress case.
- [ ] Phone performance case.
- [ ] Memory/leak regression.
Exit: visual complexity is sustainable.

## AD. S28 — Cross-feature choreography
**Inherited roots: S0-S10. Cross-feature choreography must use the same semantic machine and topology.**
- [ ] Workspace ↔ Seat.
- [ ] Seat ↔ Connection.
- [ ] Seat ↔ Toolkit.
- [ ] Seat ↔ Capability.
- [ ] Capability ↔ Workspace.
- [ ] Seat ↔ Task.
- [ ] Task ↔ Evidence.
- [ ] Turn ↔ Budget.
- [ ] Budget ↔ Handoff.
- [ ] Handoff ↔ Continuation.
- [ ] Commerce ↔ Entitlement.
- [ ] Storage ↔ Inventory.
- [ ] GitHub capability projection.
- [ ] MCP ↔ Capability.
- [ ] Auth ↔ restoration.
- [ ] Settings ↔ feature state.
Exit: one machine grammar spans the product.

## AE. S29 — Final interaction choreography
**Inherited roots: S0-S10. Final choreography integrates the inherited machine; it does not create a replacement interaction model.**
- [ ] Focus → highlight.
- [ ] Highlight → mechanical deploy.
- [ ] Deploy → payload settle.
- [ ] Payload → controls actionable.
- [ ] Action → semantic loading.
- [ ] Result → settle.
- [ ] Failure → reason-bearing recovery.
- [ ] Back → parent compaction.
- [ ] Next → semantic next subject.
- [ ] Close → parent/world.
- [ ] Turn → semantic signal.
- [ ] Handoff → continuity.
- [ ] Continuation → fresh turn.
Exit: major feature classes behave consistently.

## AF. S30 — Exact-head repository verification
**Evidence:** E404-CI
- [ ] Governance Integrity.
- [ ] Full-System.
- [ ] Security.
- [ ] Deep Security.
- [ ] Canonical Browser.
- [ ] Geometry checks.
- [ ] Source/public parity.
- [ ] Responsive browser proof.
- [ ] Reduced-motion browser proof.
- [ ] Accessibility proof.
- [ ] Stale-reference audit.
- [ ] No validator weakening.
Exit: all claims are exact-head grounded.

## AG. S31 — Runtime / deployment reconciliation
- [ ] Re-check #402 current state.
- [ ] Re-check production Firestore evidence.
- [ ] Re-check authoritative read-model surfaces.
- [ ] Confirm deployed artifact.
- [ ] Confirm canonical hosting.
- [ ] Browser-observe production.
- [ ] Record runtime evidence.
- [ ] Keep runtime proof separate from spatial proof.
Exit: deployed presentation matches actual runtime truth.

## AH. S32 — Human acceptance
- [ ] Desktop.
- [ ] Phone.
- [ ] Guest.
- [ ] Authentication transition.
- [ ] Seat/pod interaction.
- [ ] Division expansion.
- [ ] Facility navigation.
- [ ] Camera travel.
- [ ] Energy/turn.
- [ ] Handoff/continuation presentation.
- [ ] Loading/recovery.
- [ ] Accessibility.
- [ ] Reduced motion.
Exit: authorized human accepts the integrated machine.

## AI. S33 — ProMax polish
- [ ] Silhouette refinement.
- [ ] Mechanical micro-motion.
- [ ] Material refinement.
- [ ] Lighting refinement.
- [ ] Hologram refinement.
- [ ] Energy-flow refinement.
- [ ] Depth cues.
- [ ] Transition refinement.
- [ ] Mobile refinement.
- [ ] Micro-interactions.
- [ ] Visual hierarchy cleanup.
- [ ] Dead geometry removal.
- [ ] Safe obsolete compatibility cleanup.
- [ ] Full verification rerun.
Exit: polish improves a correct machine.

## AJ. Documentation and cleanup alignment

### AJ1. Current-state routing cleanup
- [x] Reconcile Product_Law/WIRING.md so #398 is historical baseline and #404 is current spatial execution vehicle.
- [x] Reconcile POLICY.md spatial migration checkpoint.
- [x] Reconcile Masterplan/MASTERPLAN.md.
- [x] Reconcile Masterplan/NEXT_SLICES.md.
- [x] Reconcile AI_ASSISTANT_READ_ME.md.
- [x] Reconcile docs/SKILL_WIRING.md.
- [x] Reconcile docs/TEAMAI_3D_HERO_TREE_CENSUS.*.
- [x] Reconcile docs/TEAMAI_3D_HERO_MACHINE_CONSTRUCTION.md.
- [x] Reconcile docs/TEAMAI_3D_HERO_R1_R2_READINESS.md.
- [x] Reconcile docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md.
- [x] Preserve historical/archive references as historical.
- [x] Do not erase provenance merely to remove stale wording.

### AJ2. Canonical checklist alignment
- [x] This file remains the detailed execution checklist under Masterplan/.
- [x] Masterplan/NEXT_SLICES.md remains the single current-frontier summary.
- [x] No second current-slice checklist is created.
- [x] PR #404 and Issue #405 are the sole spatial execution pair.
- [x] #396/#278 remain product/ledger authorities, not additional implementation vehicles.
- [x] #402/#401 remain backend/runtime counterpart only.

### AJ3. Structural inventory cleanup
- [x] Audit stale Command Deck documents against current spatial authority; four unreferenced obsolete slice artifacts were archived with provenance, while referenced planning context remains subordinate and is not treated as current machine authority.
- [x] Tree Census records truthful status and now records the non-semantic S0-S10 construction-root metadata alongside unchanged semantic identities.
- [ ] New physical assemblies map to semantic owners.
- [ ] New facilities do not get invented Seat child identities.
- [ ] Removed/replaced structures are recorded, not silently disappeared.
- [ ] Source/public pairs remain synchronized.
- [ ] Compatibility modules are clearly labeled.
- [ ] Retired modules remain historical or are removed only after dependency proof.

### AJ4. Documentation quality
- [ ] Remove claims that imply #398 is still Draft/active.
- [ ] Remove claims that imply current primitive renderer is final.
- [ ] State clearly that R1/R2 are implemented-partial, not final machine completion.
- [ ] Record the 10-seat geometry discrepancy and its resolution when closed.
- [x] Record actual evidence runs by exact head in TEAMAI_3D_WORLD_404_EVIDENCE.md.
- [ ] Keep screenshots/video references separate from Product Law.
- [ ] Update session/recovery state after major slice boundaries.

## AK. Acceptance gates
- [ ] G1 Semantic completeness.
- [ ] G2 Physical machine completeness.
- [ ] G3 Interaction completeness.
- [ ] G4 Spatial/geometry completeness.
- [ ] G5 Runtime truthfulness.
- [ ] G6 Visual completeness.
- [ ] G7 Production/browser evidence.
- [ ] G8 Human acceptance.
- [ ] G9 ProMax polish.

Evidence vocabulary: IMPLEMENTED → REPOSITORY-VERIFIED → LIVE-DEPLOYED → RUNTIME-PROVEN → HUMAN-ACCEPTED

## AL. Hard constraints
- [ ] No second implementation PR for this scope.
- [ ] No backend rewrite in #404.
- [ ] No fabricated production data.
- [ ] No duplicate geometry authority.
- [ ] No duplicate topology authority.
- [ ] No facility forced into Seat hierarchy merely for convenience.
- [ ] No universal fixed branch geometry.
- [ ] No primitive scaling presented as the final machine mechanism.
- [ ] No electricity before semantic topology.
- [ ] No visual effect treated as runtime proof.
- [ ] No provider credentials in renderer/browser state.
- [ ] No Firebase/Auth authority in renderer.
- [ ] No scheduler authority in renderer.
- [ ] No revival of Command Deck.
- [ ] No revival of retired camera identifiers.
- [ ] No old prototype timing treated as architecture.
- [ ] No validator weakening to make CI green.
- [ ] No 029-release claim before G1-G8.
