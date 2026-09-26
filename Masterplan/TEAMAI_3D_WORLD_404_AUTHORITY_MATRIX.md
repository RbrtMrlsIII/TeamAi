# PR #404 / S1-C1 Authority Matrix

Status: reconciled on PR #404 and enforced by tests/machine-authority-boundaries.test.mjs; the PR head is the authoritative current revision.

## Governing rule

A responsibility has one canonical authority. Layered ownership is allowed only when each layer has a non-overlapping scope and consumers are explicit. Presentation modules may consume an authority, but they may not recreate it.

| Contract | Canonical authority | Consumers | Explicit non-owner boundary | Evidence |
|---|---|---|---|---|
| World scene graph | frontend/spatial/machine-hero-scene.js | renderer, topology | frontend/spatial/machine-world-renderer.js orchestrates projection and WebGL only | existing S1 C1 row + source ownership |
| PhysicalModule | frontend/spatial/machine-hero-scene.js::makeMachinePart | all spatial projections | no renderer-owned replacement part model | existing S1 C1 row + function contract |
| PodAssembly | frontend/spatial/machine-pod-assembly.js::deriveMachinePodAssembly | core layout, S4+, topology | machine-core-layout.js owns population and placement, not Pod composition | existing S1 C1 row + S3 tests |
| FacilityAssembly | frontend/spatial/machine-facility-assembly.js::deriveMachineFacilityAssemblies | S7 machinery, S8 topology | S7 machinery consumes S6 destinations; it does not create a second facility hierarchy | C1 regression test |
| Division | frontend/spatial/machine-seat-division-assembly.js::deriveMachineSeatDivisionAssembly | S5 physical expansion, S8 topology | hierarchy runtime names/focuses semantic children but does not author their physical subassembly grammar | C1 regression test + S4 tests |
| Expansion lifecycle | semantic lifecycle: public/hero-hierarchy-runtime.js; physical lifecycle: frontend/spatial/machine-expansion-mechanism.js | renderer, S5/S8 consumers | S5 owns travel/clearance/reservation projection only; it does not own semantic OPEN/CLOSE state | static boundary assertions + S5 tests |
| Port derivation | each physical assembly derives its own ports; topology validates endpoint continuity | S8 world topology | machine-world-topology.js consumes ports and must not silently replace authored port positions | C1 regression test |
| Corridor reservation | S8 owns the canonical aggregate topology corridor; S5 owns only the expansion-local reservation projection returned with its clearance plan | renderable-edge projection and later consumers; S5 expansion presentation consumes its local plan | renderer consumes corridor geometry; it does not create the canonical aggregate reservation | C1 regression test + S8 tests |
| Edge identity/topology | frontend/spatial/machine-world-topology.js is the canonical aggregate graph; local builders own only their typed subgraphs | S9+ signal/camera/world expression | renderer and signal projection cannot create semantic edges or identities | unique-ID/owner assertions + S8 validator |
| CameraSubject | frontend/spatial/machine-subject.js | renderer, S10 camera | subject derivation does not own scene graph, topology, or camera policy | S1 C1 row + subject contract |
| Semantic camera specification | frontend/spatial/machine-camera.js | canonical world renderer, controller state | camera spec consumes semantic camera ids and subjects; it does not create geometry, hierarchy state, topology, or backend authority | S10 camera contract tests |
| State/effect projection | DEFERRED: S9+ effect/state owners remain slice-specific | later renderer/world-expression layers | no S1 closure claim is made until S9/S28/S29 reconcile the remaining projection responsibilities | checklist row 117 remains open |

## Boundary decisions

Facility destinations remain S6-owned. S7 consumes those exact destination identities, outer-housing anchors, ports, subjects, and product-facility references.

Division physical grammar remains S4-owned. S5 may animate an authored division assembly, and S8 may connect its ports, but neither may redefine its semantic family or component grammar.

Expansion has two deliberately separated authorities. The semantic hierarchy runtime owns semantic OPEN/CLOSE/focus state. The S5 mechanism owns physical interpolation, travel limits, clearance, an expansion-local corridor reservation projection, and subject projection. S8 owns the canonical aggregate topology corridor reservations consumed by later graph consumers. The regression test rejects a direct S5 dependency on the semantic hierarchy runtime.

Ports are intentionally derived at their physical assembly roots rather than centralized into a parallel spatial hierarchy. S8 validates continuity and consumes those authored points. This keeps a single producer for each port attached to its owning assembly while avoiding a duplicate global port table.

Corridors and aggregate edge identity are S8 concerns. Local edge builders remain implementation layers for core and division subgraphs; the world topology is the sole aggregate graph exposed to later slices. Renderable edge objects are projections of those semantic edges.

The S1/C1 state/effect row stays unresolved by design. S9 signal state already declares itself a projection over an existing S8 edge, but full S1 closure depends on the later state/effect projection work called out by the checklist.

## Exit interpretation

C1 is reconciled for FacilityAssembly, Division, ExpansionMechanism, Port, Corridor, and Edge. S1 itself is not declared fully closed while the state/effect projection row remains open, consistent with the checklist exit rule.
