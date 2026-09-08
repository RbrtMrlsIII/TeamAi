# TeamAi 3D Hero — Hierarchy Runtime Baseline

**Status:** Living baseline (required for hierarchy slices; **not frozen**)  
**Date:** 2026-09-08  
**Authority:** PRODUCT_LAW.md (Family J + hard invariants) → MASTERPLAN.md → Machine Interaction Contract → Project-Wide Census → Seat Shell Hierarchy v1 → **this baseline** → implementation  
**Companion skills:** `skills/frontend/spatial/hierarchy-runtime/SKILL.md` (execution) · `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md` (first parent fill)

---

## 0. How to use this document (sessions)

### 0.1 Living, not frozen

This baseline is the **shared root set** every hierarchy/open-machine slice must **account for**. It is intentionally **not** a frozen graphics standard:

- Numeric ranges, mesh altitudes, gesture maps, and transition timings **will be adjusted** as Seat shell v1 and later parents teach us what works.
- Structure (roots, phases, authority boundaries, validation *kinds*) should stay stable unless Product Law or Machine Interaction Contract changes.
- Amendments are expected. **Omitting** a root without recording why is what fails validation — not discovering that a constant needs tuning.

### 0.2 Required for execution slices

Any PR/slice that opens/closes a hierarchical parent, adds child/leaf faces, or changes camera dock / hierarchy motion must name part IDs, account for R1–R10, and avoid second theme roots or durable browser authority.

### 0.3 Validation (fail when not followed)

| Check | Fail if |
|-------|---------|
| Authority | Slice claims entitlement/auth from open/camera/gear motion |
| Theme | New theme tokens or body-level theme authority for Hero materials |
| Hierarchy model | Open UI without part IDs / open state / one-open rule when applicable |
| Motion | Continuous choreography required under `data-motion=reduced` |
| Amendment silence | Root behavior changed in code with no note in PR body or this doc |

---

## 1. Purpose

Provide one place that lists the **runtime roots** shared by every mechanical hierarchy animation: lighting/theme · camera/PoV · input · transitions · animation display · layout math · viewport · graphic preferences · wiring/trajectories · altitudes · part↔theme binding.

---

## 2. Product Law boundary (non-negotiable)

- Family **J** presents; engines own durable truth.  
- Open shells, gears, camera pose, and leaf faces **never** grant entitlement.  
- One theme law via `document.documentElement`.  
- Reduced motion, keyboard, and accessible names remain mandatory.

---

## 3. Runtime roots (R1–R10)

### R1 — Hierarchy state model
One fully open parent at a time (v1). Part IDs stable. Phase drives motion; camera does not authorize.

### R2 — Layout & pose math
`profile(seatCount)`, seat ring placement, named altitudes (`SEAT_REST_Y`, `SEAT_OPEN_LIFT`, `CHILD_STEP_Y`/`R`). Numbers live in §9.

### R3 — Camera & normal PoV angles
Semantic cameras; dock on hierarchy select; free orbit **may-evolve**.

### R4 — Input
Distinct select parent / child / leaf / close intents. Keyboard when hierarchy active.

### R5 — Motion phases & transitions
`rest → opening → open → closing → rest`. Reduced motion snaps.

### R6 — Animation display design
Readable silhouette; stubs vs interactive layers distinct without implying permission.

### R7 — Viewport & UI size
Narrow readable open; FOV boost anchors.

### R8 — Graphic / motion preferences
Read `data-motion` from documentElement.

### R9 — Wiring, trajectories, connections
Contribution paths and future backend **threads** are presentation, not network truth.

### R10 — Theme & material binding
Same `heroMaterialContext` pipeline; Isolation preserved.

---

## 9. Living numbers table (documentation holds numbers)

**Rule:** This table is the **number home**. Skills tell sessions how to consume and amend it.

| Name | Value | Status | Root |
|------|-------|--------|------|
| `SEAT_REST_Y` | `0.62` | measured | R2 |
| `SEAT_OPEN_LIFT` | `0.28` | starting | R2 |
| `CHILD_STEP_Y` | `0.22` | starting | R2 |
| `CHILD_STEP_R` | `-0.14` | starting | R2 |
| `CAMERA_LERP_MS` | `700` | measured | R3/R5 |
| `OPEN_DURATION_MS` | `520` | starting | R5 |
| `CLOSE_DURATION_MS` | `420` | starting | R5 |
| `HIERARCHY_REDUCED_SNAP` | `true` | contract | R5 |
| `WORKSPACE_R_MIN` | `4.35` | measured | R2 |
| `WORKSPACE_R_MAX` | `5.95` | measured | R2 |
| `SEAT_R_MIN` | `4.25` | measured | R2 |
| `SEAT_R_MAX` | `6.45` | measured | R2 |
| `REDUCED_MOTION_K` | `0.35` | measured | R5/R8 |
| `FOV_BOOST_NARROW` | `+4` | measured | R7 |
| `ROUGH_LIGHT` | `0.48` | measured | R10 |
| `REFL_DARK` | `0.54` | measured | R10 |

Full measured table remains authoritative on `main` history; amend rows in the same PR when values change.

---

## 10. Design principle

**Shared roots, living numbers. Docs hold the numbers. Skills execute them. Authority never rides the camera. Leaves stay inside the machine.**

---

## Concentric ring map (pointer)

Full map: `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`.

| Ring | Name | Role |
|------|------|------|
| R0 | Workspace core | Shared work surface; `WORKSPACE_ZIPSKILLS` |
| R1 | Backend display | Platform rules/docs + animated connection threads |
| R2 | Setup / config | Configuration branches; login/register mechanical presentation |
| R3 | Seat ring | Web AI Seats (Seat Shell Hierarchy v1) |

Radii / §9 numbers for intermediate rings are **TBD measured** — amend §9 when stubs land. Do not invent private radius tables in code without this doc + §9.
