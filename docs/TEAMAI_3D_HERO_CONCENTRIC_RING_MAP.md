# TeamAi 3D Hero — Concentric Ring Map (presentation)

**Status:** Active implementation baseline — R1/R2 mechanical presentation implemented-partial; 029 not released  
**Date:** 2026-09-08  
**Authority:** `Product_Law/PRODUCT_LAW.md` (Family J presentation) → Machine Interaction Contract → Hierarchy Runtime Baseline → this map  
**Skills:** `skills/frontend/spatial/hierarchy-runtime/SKILL.md` · `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md` (Seat ring only)  

## 1. Status of the ring map

| Layer | Documented before? | Status |
|-------|--------------------|--------|
| **Center — Workspace** | Yes (Machine Interaction Contract §4.2) | Implemented (workspace ring + artifacts/traces) |
| **Outer — Web AI Seats** | Yes (Contract §4.1; Seat Shell v1) | Implemented (seat ring + open hierarchy) |
| **Intermediate rings** | **Partially implemented** | **R1/R2 now have source-owned mechanical presentation modules; complete topology/choreography remains bounded work** |

Whole-machine gears (subscription / discussion / coding / settings) remain mechanisms (Contract §4.3); they are **not** the same as the concentric intermediate rings below.

## 2. Concentric order (center → outward)

```text
R0  WORKSPACE CORE          middle — shared work surface
R1  BACKEND DISPLAY RING    platform rules/docs + connection threads
R2  SETUP / CONFIG RING     major configuration branches & mechanical setup
R3  SEAT RING               Web AI Seats (outer)
```

Radii increase with ring index. Runtime centerlines are derived by the shared hero-ring-envelope.js owner from the actual R0 workspace-core radius and the physical R3 Seat-shell envelope. The broader workspace footprint is not itself an R0 centerline. Machine-core inner pods/Seat mechanisms and outer housings are separate geometry layers and are not interchangeable radius inputs. Requested clearance may compress when the physical span is tight; neither the workspace core nor Seat envelope is moved merely to satisfy ring spacing.

### R0 — Workspace core (middle)

- User’s chosen / configured **workspace surface**
- Contribution, absorb / reflect / handoff, traces
- Hosts **workspace-tier** presentation: `WORKSPACE_ZIPSKILLS` (optional governance equip — **implemented stub**, inner crown `RING_R0_ZIP_SCALE`)
- Not empty decoration

### R1 — Backend display ring

- **Backend platforms** the team uses or intends to use — **presentation displays**
- Content: rules and documentation faces a specific backend platform must follow
- **Connections** between platforms (or platform ↔ workspace / seats) as **animated threads** (R9 wiring language)
- Presentation only: no live bind, OAuth, or durable credentials from the canvas
- Example part IDs (catalog, not all required at once):
  - `WORKSPACE_BACKEND_DISPLAY`
  - `WORKSPACE_BACKEND_THREAD` (animated connection segment)
  - Platform-specific display faces later (`WORKSPACE_BACKEND_*`)

### R2 — Setup / configuration ring

- **Major configuration branches** and **setup engines**
- Includes **login / register** and related **mechanical parts** (presentation of flow stages — not auth authority)
- Branch / responsibility continuity may be visualized here (ties to `WORKSPACE_ZIPSKILLS` governance story)
- Example part IDs:
  - `WORKSPACE_SETUP_ENGINE`
  - `WORKSPACE_AUTH_MECHANISM` (login / register mechanical presentation)
  - `WORKSPACE_CONFIG_BRANCH`

### R3 — Seat ring (outer)

- **Web AI Seats** — participants
- Seat Shell Hierarchy v1: open one seat → children → health leaf
- `SEAT_TOOLKIT` deferred **seat-scoped**; **not** `WORKSPACE_ZIPSKILLS`

## 3. Cross-ring rules

1. **Presentation only** unless a named backend contract authorizes more.  
2. **Animated threads** (R1) are visual wiring (R9); they do not grant entitlement.  
3. **Login / register** on R2 are mechanical / staged presentation — durable auth remains domain authority.  
4. **One open parent** grammar still applies when a ring part opens a shell (same as Seat).  
5. **WORKSPACE_ZIPSKILLS** equips on the **workspace tree** (R0 / workspace governance), not on R3 seats.  
6. Free orbit / zoom remains Hierarchy Runtime camera **may-evolve**, unrelated to ring index naming.

## 4. Mapping to existing code (debt awareness)

| Existing | Ring |
|----------|------|
| `workspace()` in `hero-flex.js` | R0 |
| `drawWorkspaceZipskills` (`WORKSPACE_ZIPSKILLS_V1`) | R0 optional ZipSkills crown |
| Contribution paths / traces | R0 ↔ R3 (R9) |
| Seat ring `seatPos` / `drawSeat` | R3 |
| Intermediate R1/R2 meshes | **Implemented-partial** — source-owned modules with mechanical presentation; complete service topology and final transform choreography remain later slices |
| `MECHANISM_ZIPSKILLS` (legacy dictionary / e2e) | Reconcile toward `WORKSPACE_ZIPSKILLS` / workspace tree over time |

## 5. Implementation ladder (slice sequence)

1. **This map** (docs) — PASS when merged.  
2. Baseline § note + optional static test for ring IDs.  
3. R1 mechanical presentation owner (backend display faces + restrained service traces).  
4. R2 setup/auth mechanical owner (no durable auth).  
5. Reconcile legacy `MECHANISM_ZIPSKILLS` naming where tests allow.

## 6. Explicit non-goals (this slice)

- No new WebGL meshes required to merge the map  
- No OAuth / API keys / Firestore writes  
- No 029-released claim  
- No change to Seat Shell v1 child order  

## 6.5 Current Slice-D reconciliation

Issue #396 Slice D now has concrete source owners for both intermediate rings:

- R1 display: `frontend/spatial/hero-r1-backend-display.js` → `public/hero-r1-backend-display.js`
- R1 presentation threads: `frontend/spatial/hero-r1-backend-threads.js` → `public/hero-r1-backend-threads.js`
- R2: `frontend/spatial/hero-r2-setup-ring.js` → `public/hero-r2-setup-ring.js`
- Canonical Hero remains the single WebGL renderer and retains small wrapper seams for existing assembly/apply contracts.
- R1/R2 placement is derived from the active workspace envelope and catalog rather than a second coordinate authority.
- R1 threads consume declared display-face IDs, resolve missing endpoints by failing closed, and route deterministically outside the workspace center.
- These ring modules remain presentation-only. No OAuth, credentials, provider execution, entitlement, or durable backend state is introduced.
- Final service/backend topology, richer mechanical R1 articulation, complete R2 choreography, and final electricity remain later work in #396.

## 6.6 Current Slice-D/E/F/G/H reconciliation

The active implementation now has one shared geometry and semantic chain across the intermediate ring and Seat-machine layers:

- hero-ring-envelope.js is the sole R1/R2 centerline envelope. R1 display faces, R1 presentation threads, and R2 setup faces consume its resolved radii.
- R1/R2 catalogs are source-owned by their ring modules; the hierarchy runtime re-exports them rather than defining duplicate catalog identities.
- SETUP_CONFIG_V1 uses the canonical WORKSPACE_CONFIG_BRANCH#prefs identity for the configuration branch.
- Seat division presentation receives focusedChildId, focusedChildIndex, and the hierarchy-owned branch amount from the controller. It does not rebuild SEAT_SHELL_V1_CHILDREN.
- Machine core connections now carry coordinate-independent semanticEdgeId values and are checked by machine-core-topology.js for branch endpoints, ports, routes, uniqueness, and expected edge classes.
- Electricity is a presentation flow over declared semantic edge routes. The selected-seat pulse follows an existing machine-core edge; Seat-1 workspace transfer follows the declared TREE-HERO-SEAT#0:SEAT_CONNECTION→WORKSPACE_CENTER edge. No guessed electrical route is introduced.
- R2 auth/setup remains presentation-only. teamai:app-ui-handoff is received by the normal UI auth/settings controller; the spatial renderer never performs auth/provider work.

These are structural implementation steps, not a 029 completion claim. Browser exact-head validation and deeper mechanical choreography remain required verification layers.



### Geometry authority note

The current implementation distinguishes three related but different values:

- workspace footprint: the broader world/profile extent used for framing and payload density;
- R0 centerline: the actual workspace receiving-core radius produced by hero-workspace-core.js;
- R3 Seat envelope: the actual Seat-shell radius from machine-core layout, not the four outer housing modules.

R1/R2 are fitted inside that physical R0→R3 span. This prevents a large workspace profile from incorrectly forcing intermediate rings outside the Seat machine.

## 7. Design principle

**Center works. Threads explain backends. Setup gears configure. Outer seats participate.**
