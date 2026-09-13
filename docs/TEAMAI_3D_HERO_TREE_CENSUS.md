# TeamAi 3D Hero Tree Census

**Status:** DESIGN BASELINE / NOT IMPLEMENTATION-COMPLETE

This document is the human-readable census and construction contract for the intended 3D Hero tree system. It records semantic tree identity, tree contents, branch responsibilities, implementation anchors, expansion rules, connection requirements, and verification boundaries.

The census is a **truth inventory**, not a product roadmap and not a second Masterplan. `docs/VISION.md` explains the experience meaning; `MASTERPLAN.md` governs execution order; this census records the structural state of every tree/branch/division that has actually been defined or implemented.

It must never claim that a tree is complete merely because a Seat tree prototype works.

## 1. Current semantic tree families

### TREE-DOMAIN

`Account → Workplace → Project → Seat`

The domain tree represents durable TeamAi domain structure. Its authority remains outside the renderer. The visual domain/multi-seat tree is not yet proven complete.

### TREE-HERO-SEAT

`Seat Shell → Connection → Behavior → Toolkit → Capabilities → Authorization → Workspace Scope → Task/Evidence`

This is the currently proven presentation hierarchy portion. It is **PARTIAL**, not the completed TeamAi tree system.

### TREE-SKILL-RESPONSIBILITY

`ToolKit upstream → WebAi Seat responsibility boundary → skill bundle → governance/adaptation/capacity`

This is a capability/responsibility presentation model. Skills instruct; policy and authorized contracts govern. This tree must never become entitlement or authorization.

## 2. Tree identity and census maintenance

Every intended tree must have a stable semantic `treeID` before the runtime treats it as an implementation identity. Every branch must have a stable `branchId` derived from semantic parentage.

**Identity is semantic. Coordinates do not define identity.**

The census representations are:

- `docs/TEAMAI_3D_HERO_TREE_CENSUS.csv`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.json`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.md`
- `docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml`

Whenever a tree/branch/division is **added, removed, renamed, materially restructured, or reimplemented**, the same governed PR must reconcile the affected census records. The agent must update the census even when the implementation is only a partial/staged reimplementation, and must preserve the truthful status rather than upgrading it because the runtime surface exists.

A census change without corresponding implementation truth is a planning/design statement. An implementation change without a corresponding census update is governance drift.

## 3. Branches are real integrations

A branch is not a decorative child mesh.

A real branch must have:

- a stable `branchId`;
- semantic purpose;
- parent and child ownership;
- responsibility definition;
- associated UI/product payload;
- feature/configuration/accessibility payload where applicable;
- an expansion region;
- clearance from adjacent machine divisions;
- connection points/path ownership;
- camera subject/travel relationship;
- responsive behavior;
- reduced-motion behavior;
- verification evidence.

A tree may contain broad branches, nested sub-branches, and multiple levels of depth. Do not assume a universal two-level tree, equal heights, equal widths, or equal branch counts.

## 4. Root-to-tree construction rule

Every new tree is built from authoritative semantics before geometry:

```text
ROOT TRUTH
→ semantic children
→ stable treeID / branchId
→ responsibility
→ UI/product payload
→ expansion/collapse states
→ connection graph
→ adaptive geometry
→ camera subject / travel path
→ interaction
→ contribution/electricity routing
→ verification
```

Never begin by copying the previous tree's coordinates and then inventing semantics around them.

## 5. Geometry is payload-driven

Each tree can legitimately differ in:

- branch count;
- recursion/depth;
- branch width;
- branch height;
- radial distance;
- angular spread;
- vertical separation;
- label density;
- feature density;
- control density;
- configuration surface size;
- accessibility surface size;
- expansion footprint.

Current prototype geometry is a measured/starting baseline, not a universal geometry contract.

Geometry must leave enough physical room for the division's real payload and its neighboring machine topology. A branch that needs a larger configuration/accessibility surface is allowed to occupy a larger machine division.

## 6. Expansion-space contract

Every expanding division must reserve sufficient space to open without colliding with:

- adjacent branches;
- adjacent trees;
- wiring/connection corridors;
- camera travel paths;
- workspace visibility;
- other active UI surfaces.

Expansion space is therefore part of the tree's design contract, not an animation afterthought.

The Hero maximum expanded state must be derived from the combined footprint of the participating active divisions and their payload-driven geometry.

## 7. Full-turn expansion state

During the final turn-loop/contribution state, the participating tree/branch divisions are expected to be **active/open** so that their connection points can form a continuous semantic wiring network.

```text
active WebAi turn
→ participating tree / branch selection
→ required divisions become active/open
→ connection points and corridors are spatially available
→ signal follows actual wiring paths
→ connected adjacent trees/branches participate
→ signal reaches workspace center
```

The turn loop must not try to traverse hidden/collapsed divisions whose intended connection topology is unavailable in the active visual state.

## 8. Expansion animation contract

Expansion must not be implemented as an instantaneous visibility switch, teleport, or abrupt coordinate replacement.

Each division requires a smooth, polished, stateful opening and closing choreography appropriate to its geometry and payload.

The final timing language is **not yet established**. Existing hierarchy/camera timing values remain living implementation baselines rather than final animation law.

A correct expansion animation should preserve:

- semantic continuity;
- spatial continuity;
- connection continuity;
- readable intermediate states;
- adjacent-division clearance;
- stable camera subject relationship;
- responsive/mobile coherence;
- reduced-motion semantic equivalence;
- deterministic verification.

## 9. Camera relationship

Camera behavior must consume semantic tree/branch identity and geometry rather than treating a named dock as the identity itself.

The current baseline documents named camera docks and a measured `700 ms` lerp. This is current implementation evidence, not proof of final hierarchy travel.

Future branch travel must support meaningful subject-to-subject spatial movement between different tree/branch identities.

## 10. Electrical connection model

The final contribution animation must represent an actual connection graph.

A participating node/branch therefore needs a stable connection/path point before the final electrical choreography is authored.

The expected semantic model is:

```text
active turn source
→ branch connection
→ intermediate connected divisions
→ adjacent trees/branches
→ inward path
→ workspace destination
```

The effect must remain valid when trees differ in geometry, depth, branch count, and expansion footprint.

## 11. TREE-HERO-SEAT truth baseline

`TREE-HERO-SEAT` is the existing Seat presentation hierarchy. This section reconciles the already-defined Seat shell with the existing Seat lifecycle, Responsibility Unit, Universal/TeamAi Skill, and product orchestration contracts. **It does not create a second Seat hierarchy.**

### 11.1 Existing structural branches

```text
SEAT_SHELL
├── SEAT_CONNECTION
├── SEAT_BEHAVIOR
├── SEAT_TOOLKIT
├── SEAT_CAPABILITIES
├── SEAT_AUTHORIZATION
├── SEAT_WORKSPACE_SCOPE
└── SEAT_TASK_EVIDENCE
```

These branch IDs remain the structural presentation vocabulary. Deeper configuration facets may be represented as payload or recursive descendants only when they acquire a governed semantic identity. Do not invent new sibling branches merely because a configuration field exists.

### 11.2 Seat configuration facets map onto the existing branches

The canonical Seat is more than a model label. Existing project contracts distinguish application, provider, service/runtime, model/variant, connection, Seat, skills, tools/MCP, workstation, scope, entitlement, and authorization. The census records those as **configuration facets** of the existing Seat structure rather than a parallel tree.

| Existing Seat branch | Existing configuration/lifecycle meaning |
|---|---|
| `SEAT_SHELL` | Seat identity/overview; provider/runtime/model identity facets; lifecycle presentation |
| `SEAT_CONNECTION` | external provider/application relationship, OAuth/provider handoff, bind, connection test, health |
| `SEAT_BEHAVIOR` | Seat-local behavior/defaults and constraints only; it does **not** own global team turn policy |
| `SEAT_TOOLKIT` | resolved TeamAi/common skill and procedure equipment for this Seat; optional presentation |
| `SEAT_CAPABILITIES` | available mechanisms, tools/plugins/MCP/model/runtime capability inventory |
| `SEAT_AUTHORIZATION` | reason-bearing permission/approval/authorization state; presentation only, never a grant authority |
| `SEAT_WORKSPACE_SCOPE` | workplace/project/repository/path/workstation scope |
| `SEAT_TASK_EVIDENCE` | task/result/event/evidence continuity |

The existing Seat lifecycle remains the canonical lifecycle vocabulary:

`Discover → External Setup → Import/Authorize → Capability Test → Bind → Equip → Activate → Run → Observe → Degrade/Suspend → Recover/Revalidate → Rebind/Retire`

A Seat may reference an external Connection, but Connection and Seat remain distinct concepts.

### 11.3 TEAMAI COMMON SKILL / Universal ToolKit boundary

`TEAMAI COMMON SKILL` is the project's given/common skill equipment available for Seat use. It is not a separate Seat hierarchy and is not duplicated into eight independent skill libraries.

The existing Responsibility Unit model remains the allocation mechanism:

```text
TEAMAI COMMON SKILLS / Universal ToolKit
→ Responsibility Unit catalog
→ Seat responsibility allocation
→ smallest sufficient applicable skill bundle
→ capability/tool resolution
→ authorization/policy
→ usable Seat
```

Agent count changes **allocation**, not the underlying common skill definitions.

With two unlocked Seats, a Seat may carry several Responsibility Units and therefore a broader resolved skill bundle. With up to eight unlocked Seats, the same Responsibility Unit/skill definitions are partitioned more finely across the participating Seats. This is a resource-allocation and resolution problem, not eight copies of the skill library.

User-provided or user-edited skill material, when implemented, must remain distinguishable from TeamAi common skills. Editing a user-owned skill must not silently mutate the canonical TeamAi common skill authority. Skills instruct; policy, authorization, entitlement, and project contracts govern.

Current truth: the common-skill/Responsibility architecture is defined, but the complete user-facing skill configuration/editor flow is **NOT IMPLEMENTATION-COMPLETE**. Do not fabricate a complete common-skill catalog or claim that all intended skills are already implemented.

### 11.4 Global Turn Configuration is not a Seat branch

Turn-loop policy belongs to the **overall team/orchestration configuration**, not to individual `TREE-HERO-SEAT` branches.

```text
TEAM / ORCHESTRATION CONFIGURATION
├── participating Seats
├── actions/turns per participating Seat
├── turn order / scheduling policy
├── round or stopping conditions
├── summarizer selection
├── resource/time limits
└── turn-loop mode
        ↓
Scheduler
        ↓
individual Seat execution
```

`SEAT_BEHAVIOR` may expose Seat-local defaults or constraints that participate in this policy, but it must not become the owner of global turn behavior. The existing `TREE-ORCHESTRATION` / scheduler contract remains the proper semantic home for the team-wide turn configuration.

This distinction is required for the product question: **how many actions each participating Seat may perform before the configured loop ends**. It must be evaluated once at the overall team configuration level and then enforced by the scheduler against each participating Seat.

### 11.5 Cross-tree controls are not Seat branches

The following already-defined product surfaces must remain outside `TREE-HERO-SEAT`:

- `(?)` / **Complex Dictionary / User Guide**: public Entrance guidance and vocabulary surface;
- **Return BTN**: authenticated-world navigation back to the public Entrance, not a Seat child;
- **Logout**: authentication lifecycle operation, not Seat removal;
- **Remove/Retire Seat/Agent**: Seat lifecycle operation that retires the configured Seat/provider binding and clears governed Seat data as specified by the durable contract; it does not imply deletion of the user's root account;
- **Settings**: cross-cutting authenticated configuration/navigation taxonomy, not a second semantic machine hierarchy.

### 11.6 Eight-seat population rule

The default world presentation supports eight Seat slots, but a rendered slot is not automatically a durable configured Seat. Actual durable Seat population is restored from authorized user/project state and mapped to available world slots.

All eight Seats consume the same canonical Seat configuration vocabulary and common-skill substrate. Their provider, model, connection, skill allocation, capability set, authorization, workspace scope, and readiness may differ.

### 11.7 Truth/status rule for Seat census rows

The census must distinguish structural existence from implementation completeness. Existing Seat faces are presentation evidence, not proof of live authenticated configuration.

Use truthful states such as:

`IMPLEMENTED_PARTIAL`, `STUB`, `SEMANTIC_ONLY`, `DEFINED_NOT_IMPLEMENTED`, `PENDING`, `NOT_PROVEN`.

Do not upgrade a Seat branch to complete because its mesh, face, fixture, or local animation exists.

## 12. Current completion truth

| Tree | Current status |
|---|---|
| `TREE-DOMAIN` | INCOMPLETE |
| `TREE-HERO-SEAT` | PARTIAL |
| `TREE-SKILL-RESPONSIBILITY` | INCOMPLETE |
| Complete multi-tree Hero machine | NOT COMPLETE |
| Complete branch/division product payload inventory | NOT COMPLETE |
| Complete adaptive geometry | NOT COMPLETE |
| Full semantic connection topology | NOT COMPLETE |
| Final turn-loop electrical choreography | NOT COMPLETE |
| Final machine-opening choreography | NOT COMPLETE |
| Complete Seat configuration/editor lifecycle | NOT COMPLETE |
| Complete global turn-configuration UI/runtime | NOT COMPLETE |

The Seat tree is evidence of an existing mechanism. It is not evidence that all TeamAi trees, branches, divisions, wiring, expansions, Seat configuration, common-skill resolution, or global turn configuration are complete.

## 13. Primary source anchors

- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md`
- `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md`
- `docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md`
- `docs/WEB_AI_SEAT_RESPONSIBILITY_TREE.md`
- `docs/WEB_AI_SEAT_TOOLKIT_BOUNDARY.md`
- `docs/VISION.md`
- `docs/TEAMAI_CURRENT_STATE.md`
- `MASTERPLAN.md`
- `Issue #278 — 029 Canonical Product-Experience Baseline & Governed Execution Ledger`

This census is a design/recovery baseline. It does not itself authorize implementation or claim acceptance.

## 14. Census ownership rule

The census is maintained alongside implementation, not after the fact. When code introduces or materially changes a tree/branch/division, the corresponding census entry is part of that same PR's definition of current truth.

The census is intentionally **not** the place where final product-roadmap sequence is invented. It records structural truth and known context; `MASTERPLAN.md` and Issue #278 determine execution order.

Chronological execution remains:

```text
Product Law
→ Masterplan / C0–C10 execution baseline
→ applicable contracts + Skills
→ implementation
→ validation
→ evidence
→ merge
→ new current truth
→ census reconciliation
```

The Seat truth reconciliation in this baseline therefore changes **known structural context**, not the chronological execution authority. Any future implementation slice must update the affected census row(s) in the same governed change and must not create a second checklist or parallel Seat hierarchy.
