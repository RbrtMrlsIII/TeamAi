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

## 11. Current completion truth

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

The Seat tree is evidence of an existing mechanism. It is not evidence that all TeamAi trees, branches, divisions, wiring, and expansions are complete.

## 12. Primary source anchors

- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md`
- `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md`
- `docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md`
- `docs/WEB_AI_SEAT_RESPONSIBILITY_TREE.md`
- `docs/VISION.md`
- `docs/TEAMAI_CURRENT_STATE.md`
- `MASTERPLAN.md`

This census is a design/recovery baseline. It does not itself authorize implementation or claim acceptance.

## 13. Census ownership rule

The census is maintained alongside implementation, not after the fact. When code introduces or materially changes a tree/branch/division, the corresponding census entry is part of that same PR's definition of current truth.

The census is intentionally **not** the place where final product-roadmap sequence is invented. It records structural truth and known context; `MASTERPLAN.md` and Issue #278 determine execution order.
