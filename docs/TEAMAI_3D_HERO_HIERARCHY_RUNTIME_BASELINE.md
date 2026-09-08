# TeamAi 3D Hero — Hierarchy Runtime Baseline

**Status:** Living documentation (presentation domain)
**Authority:** PRODUCT_LAW Family J → Machine Interaction Contract → this baseline → skills
**Companion skill:** `skills/frontend/spatial/hierarchy-runtime/SKILL.md`

---

## 1. Purpose

Single baseline for hierarchy runtime numbers, phases, and presentation boundaries on the 3D Hero.

This document is the **number home**. Code exports and skills consume these names; amend table and code in the same change when values are learned.

---

## 2. Shared roots (R1–R10)

| Root | Concern |
|------|--------|
| R1 | State machine (IDLE → FOCUS → …) |
| R2 | Pose / altitude math (seat rest, open lift, child stack) |
| R3 | Camera semantic docks |
| R4 | Input modes (NAVIGATE / INSPECT / DEMO) |
| R5 | Motion phases + reduced-motion snap |
| R6 | Hierarchy open/close parent contract |
| R7 | Viewport / responsive FOV |
| R8 | Document motion attribute sync |
| R9 | Seat shell children / leaves |
| R10 | Theme material context subset |

---

## 3. State and phases

Hierarchy phase: `rest` → `opening` → `open` → `closing` → `rest`.
One open parent at a time. Presentation only.

---

## 4. Pose math

`profile(seatCount)`, seat ring placement, named altitudes (`SEAT_REST_Y`, `SEAT_OPEN_LIFT`, `CHILD_STEP_Y`/`R`). Numbers live in §9.

---

## 5. Motion

`OPEN_DURATION_MS`, `CLOSE_DURATION_MS`, `HIERARCHY_REDUCED_SNAP`, `CAMERA_LERP_MS`.

---

## 6. Input modes

`NAVIGATE` | `INSPECT` | `DEMO` — R4. Orbit/zoom belong to NAVIGATE; seat inspect uses semantic docks.

---

## 7. Viewport

`responsiveFovBoost` — narrow aspect adds FOV (R7).

---

## 8. Theme

`heroMaterialContext` reads `document.documentElement` only (R10). Isolation preserved — no cross-root import.

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
| `RING_R1_SCALE` | `1.18` | starting | R1 ring |
| `RING_R2_SCALE` | `1.42` | starting | R2 ring |

Full measured table remains authoritative on `main` history; amend rows in the same PR when values change.

---

## 10. Design principle

**Shared roots, living numbers. Docs hold the numbers. Skills execute them. Authority never rides the camera. Leaves stay inside the machine.**

---

## Concentric ring map (pointer)

Full map: `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`.

| Ring | Name | Role |
|------|------|------|
| R0 | Workspace core | Shared work surface; `WORKSPACE_ZIPSKILLS` (optional equip — not required platform config) |
| R1 | Backend display | Platform rules/docs + animated connection threads |
| R2 | Setup / config | Configuration branches; login/register mechanical presentation |
| R3 | Seat ring | Web AI Seats (Seat Shell Hierarchy v1); `SEAT_TOOLKIT` optional seat-scoped bundles |

R1/R2 radius multipliers are **named** (`RING_R1_SCALE`, `RING_R2_SCALE`) in this table and in `hero-hierarchy-runtime.js`. Status **starting** until measured in-browser; amend §9 + code together. Do not invent private radius tables outside this doc.

**Note:** Workspace ZipSkills and Seat Toolkit are **not required** setups. Users may assign skills/toolkits outside the platform; presentation stubs must not imply entitlement or mandatory bind.
