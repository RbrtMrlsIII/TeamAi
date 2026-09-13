# TeamAi 3D Hero — Machine Construction Note

**Status:** CONSTRUCTION CONTRACT / NOT A SECOND CHRONOLOGY  
**Date:** 2026-09-13  
**Ledger:** Issue **#278** (029 product-experience)  
**Recovery map:** `docs/TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md`  
**No 029-release claim.**

## What this is

A short **how layers connect** note for establishing trees, branches, divisions, expansion, camera subjects, connection topology, electricity, and ambient/effects.

It does **not** replace:

- `PRODUCT_LAW.md` / `docs/PRODUCT_LAW_FRONTEND_HIGHEST_STAKE.md`
- `MASTERPLAN.md` (C0–C10 order)
- `docs/TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md`
- Issue **#278** body (active 029 ledger)
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.*` (structural inventory)
- `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` (spatial gates)
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`

Use those for authority and program order. Use **this** file when an agent asks: *how do we establish one tree, and what must be true before animation/effects?*

## 1. Connection law (single pipeline)

```text
ROOT TRUTH
  → stable treeID / branchId
  → purpose / responsibility
  → UI / product payload
  → expansion / collapse states
  → connection graph (semantic edges)
  → adaptive geometry (footprint from payload)
  → camera subject / travel path
  → interaction (select / open / back / close)
  → contribution / electricity route
  → verification (census + tests + browser)
```

**Never** start from coordinates, ambient particles, theme polish, or a copied Seat mesh and invent semantics afterward.

Historical camera paths, prototype coordinates, ambient timings, and retired Command Deck mechanisms are **replaceable baselines**. They must not constrain adaptive tree/branch/division geometry or semantic electrical topology.

## 2. Layer dependency map

| Layer | Job | Depends on | Must not |
|---|---|---|---|
| **Semantic identity** | `treeID`, `branchId`, parentage | Product Law + census | Be defined by mesh index or dock name |
| **Payload** | Real UI / config / status content | Identity (+ authorized read model when live) | Be empty “drama” expansion |
| **Division** | Spatial container for one branch payload | Payload size + labels + controls | Share one universal size |
| **Expansion state** | `CLOSED → PREPARING → OPENING → ACTIVE → CLOSING → CLOSED` | Division + clearance | Instant show/hide or teleport |
| **Connection topology** | Stable ports + corridors + edge list | Open divisions in the active graph | Decorative lines with no edge identity |
| **Camera** | Subject follows semantic identity | Open parent/child + footprint | Steal subject via stale global preset |
| **Electricity / turn-loop** | Visualize *existing* edges during a turn | Topology + open participating divisions | Fake “alive” without a real edge |
| **Ambient / theme / effects** | Communicate interaction state | State vocabulary below | Prove backend execution |
| **Census** | Truth inventory (csv / json / md / xml) | Same PR as structural change | Upgrade status past evidence |

### Spatial scales

```text
Level 0  WORLD     — seat ring, workspace center, global corridors
Level 1  TREE      — selected semantic tree gets camera + expansion budget
Level 2  DIVISION  — branch opens; footprint from payload + clearance + corridor + camera envelope
```

### Interaction-state vocabulary

```text
INACTIVE → ACTIVE → HOVER → SELECTED → FOCUS → PRESSED
  → OPENING → OPEN → CLOSING → DISABLED / UNAVAILABLE → ERROR / BLOCKED
```

Presentation precedence (does not change backend authority):

```text
blocked/error > disabled > pressed > selected/open* > focus > hover > active > inactive
```

### Camera capabilities (product capability set)

```text
WORLD_OVERVIEW · TREE_FOCUS · DIVISION_FOCUS · EXPANSION_FOLLOW
RETURN_TO_PARENT · RETURN_TO_WORLD · CONTINUOUS_TREE_TRAVEL
RESPONSIVE_FRAMING · REDUCED_MOTION_EQUIVALENT
```

Subject identity is semantic. Named docks and ~`700 ms` lerp are **implementation baselines**, not final travel law. Continuous tree-to-tree travel and deep branch subject resolution remain incomplete on current `main`.

### Electricity law

```text
active WebAi turn
  → active tree / branch
  → participating divisions ACTIVE / OPEN
  → connection points + corridors available
  → signal follows actual wiring paths
  → adjacent trees / branches participate
  → workspace center
```

If divisions stay collapsed, the path does not exist. **Do not author electricity first.**

### Effects law

Effects communicate semantics: pulse → activity; flow → **real edge**; error field → blocked; expansion motion → real payload open. Decorative effects MUST NOT be treated as evidence of lease, entitlement, provider success, or durable events.

## 3. Establish-one-tree checklist (Phases A–H)

Execute under Issue **#278**. One vertical at a time. Comments on #278 remain evidence-only.

### Phase A — Define before drawing

1. Name the tree (registry root or governed new ID).
2. List branches: `branchId`, purpose, parent, children.
3. Payload inventory per branch (fixture allowed until C8).
4. Backend seam: read model / Edge action, or explicit presentation-only.
5. Census rows in the **same** PR when structure changes.
6. If undefined → stop; do not invent geometry or electricity.

### Phase B — Division and expansion

7. Footprint formula: `base + payload + controls + labels + neighbor clearance + corridor width + camera envelope + mobile constraints`.
8. Clearance map against adjacent branches / trees / workspace.
9. Stateful OPENING / CLOSING (no toggle teleport).
10. Timing: record `starting` vs `measured`; 700 ms is baseline only.
11. Reduced-motion semantic equivalent.

### Phase C — Connection topology (before electricity)

12. Stable connection ports on participating branches.
13. Explicit edge list `(from branchId → to branchId)`.
14. Reserved corridors so edges stay readable when open.
15. Open-for-turn rule: participating nodes must be ACTIVE/OPEN.
16. No particle path without an edge id.

### Phase D — Camera binding

17. Subject = semantic id (never dock name as identity).
18. Precedence: reduced-motion → inspection dock → look-at / center lock → free orbit about that center → responsive → DOM request.
19. On open: mechanical growth first; camera follows resulting subject.
20. On close / back: return to parent / world on a defined path.
21. Expansion follow frames full payload + corridors (not a universal distance).

### Phase E — Interaction and accessibility

22. Input path: select parent → open → child / leaf → Back → Next → close.
23. Focus ≠ hover; keyboard focus visible independently.
24. Blocked / error is reason-bearing; no false-success glow.
25. `APP_UI_HANDOFF` only when WebGL cannot honestly host the control.

### Phase F — Ambient, theme, effects (last)

26. Theme / light-skeuo track (**#83**) after structure; do not hide missing topology with polish.
27. Ambient: low-frequency on INACTIVE; stronger local field on ACTIVE / OPEN.
28. Effects only for semantic states (see Effects law).
29. Never use effects as proof of backend success.

### Phase G — Electricity / turn-loop (only after C–D)

30. One vertical edge first (e.g. fixture `SEAT_TASK_EVIDENCE → workspace center`).
31. Force participating divisions open in the harness.
32. Animate along edges only.
33. Label evidence `presentation-only` until durable events exist.

### Phase H — Verification packet

34. Static / unit for identity + expansion state machine.
35. Playwright for open / close, subject change, reduced motion.
36. Census status truthful (`IMPLEMENTED_PARTIAL`, `STUB`, … — not false complete).
37. #278 evidence comment: EXECUTED / diagnosis / observed data only.

## 4. Recommended first vertical

Smallest honest machine slice:

1. One existing `TREE-HERO-SEAT` branch (e.g. `SEAT_CONNECTION`) with fixture payload.
2. Prove OPENING → OPEN → CLOSING with clearance + camera subject follow.
3. Add one connection port + one edge toward workspace center (fixture).
4. Only then: minimal electricity along that edge.
5. Census + Playwright in the same PR.
6. Repeat for the next branch; grow the graph — do not invent a parallel Seat hierarchy.

## 5. Current truth (do not inflate)

| Item | Status on current program |
|---|---|
| `TREE-HERO-SEAT` | **PARTIAL** |
| `TREE-DOMAIN` / `TREE-SKILL-RESPONSIBILITY` | **INCOMPLETE** |
| Adaptive payload geometry | **NOT COMPLETE** |
| Full connection topology | **NOT COMPLETE** |
| Continuous tree travel | **NOT COMPLETE** |
| Final electrical choreography | **NOT COMPLETE** |
| C8 auth workspace | **NOT COMPLETE** |
| C9 owner acceptance | **BLOCKED** |
| C10 ProMax | Gated behind C9 |

Command Deck is **retired** as a product door. Useful behavior is re-owned under the world machine, not revived on `/spatial/`.

## 6. Pointers

| Need | Open |
|---|---|
| Program order / main vs plan | `docs/TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md` |
| Compact recovery | `docs/TEAMAI_CURRENT_STATE.md` |
| Census | `docs/TEAMAI_3D_HERO_TREE_CENSUS.md` (+ csv/json/xml) |
| Spatial gates | `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` |
| Interaction law | `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md` |
| Implementation entry | `docs/TEAMAI_3D_HERO_IMPLEMENTATION_ENTRY.md` |
| Highest-stake sequence | `docs/PRODUCT_LAW_FRONTEND_HIGHEST_STAKE.md` |
| 029 ledger | Issue #278 |
| Backend ledger | Issue #284 |
| Later visual track | Issue #83 (after structure) |

**No 029-release claim.**
