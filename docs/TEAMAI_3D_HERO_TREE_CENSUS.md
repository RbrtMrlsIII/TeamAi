# TeamAi 3D Hero Tree Census

**Status:** DESIGN BASELINE / NOT IMPLEMENTATION-COMPLETE

This document is the human-readable census and construction contract for the intended 3D Hero tree system. It records semantic tree identity, tree contents, branch responsibilities, implementation anchors, expansion rules, connection requirements, and verification boundaries.

The census is a **truth inventory**, not a product roadmap and not a second Masterplan. `docs/VISION.md` explains the experience meaning; `Masterplan/MASTERPLAN.md` governs execution order; this census records the structural state of every tree/branch/division that has actually been defined or implemented.

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