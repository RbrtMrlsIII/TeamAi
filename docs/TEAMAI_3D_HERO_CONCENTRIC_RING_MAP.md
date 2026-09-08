# TeamAi 3D Hero — Concentric Ring Map (presentation)

**Status:** Spec baseline (docs first) — not fully implemented in meshes  
**Date:** 2026-09-08  
**Authority:** PRODUCT_LAW.md (Family J presentation) → Machine Interaction Contract → Hierarchy Runtime Baseline → this map  
**Skills:** teamai-project → hierarchy-runtime · seat-shell-hierarchy (Seat ring only)  

## 1. Status of the ring map

| Layer | Documented before? | Status |
|-------|--------------------|--------|
| **Center — Workspace** | Yes (Machine Interaction Contract §4.2) | Implemented (workspace ring + artifacts/traces) |
| **Outer — Web AI Seats** | Yes (Contract §4.1; Seat Shell v1) | Implemented (seat ring + open hierarchy) |
| **Intermediate rings** | **Not fully set** | **This document establishes the map** |

Whole-machine gears (subscription / discussion / coding / settings) remain mechanisms (Contract §4.3); they are **not** the same as the concentric intermediate rings below.

## 2. Concentric order (center → outward)

```text
R0  WORKSPACE CORE          middle — shared work surface
R1  BACKEND DISPLAY RING    platform rules/docs + connection threads
R2  SETUP / CONFIG RING     major configuration branches & mechanical setup
R3  SEAT RING               Web AI Seats (outer)
```

Radii increase with ring index. Exact numbers live in baseline §9 when measured; do not invent private tables in code without amending §9.

### R0 — Workspace core (middle)

- User’s chosen / configured **workspace surface**
- Contribution, absorb / reflect / handoff, traces
- Hosts **workspace-tier** presentation: `WORKSPACE_ZIPSKILLS` (governance equip), future workspace services stubs
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
| Contribution paths / traces | R0 ↔ R3 (R9) |
| Seat ring `seatPos` / `drawSeat` | R3 |
| Intermediate R1/R2 meshes | **Not yet** — sheet + stubs later |
| `MECHANISM_ZIPSKILLS` (legacy dictionary / e2e) | Reconcile toward `WORKSPACE_ZIPSKILLS` / workspace tree over time |

## 5. Implementation ladder (slice sequence)

1. **This map** (docs) — PASS when merged.  
2. Baseline § note + optional static test for ring IDs.  
3. R1 presentation stubs (backend display faces + thread segments).  
4. R2 setup/auth mechanical stubs (no durable auth).  
5. Reconcile legacy `MECHANISM_ZIPSKILLS` naming where tests allow.

## 6. Explicit non-goals (this slice)

- No new WebGL meshes required to merge the map  
- No OAuth / API keys / Firestore writes  
- No 029-released claim  
- No change to Seat Shell v1 child order  

## 7. Design principle

**Center works. Threads explain backends. Setup gears configure. Outer seats participate.**
