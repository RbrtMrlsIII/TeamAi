# TeamAi 3D Hero — Hierarchy Runtime Baseline

**Status:** Living documentation (presentation domain)
**Authority:** PRODUCT_LAW Family J → Machine Interaction Contract → this baseline → skill hierarchy-runtime
**Numbers:** Free to learn. Amend §9 in the same PR when measured values change. Docs hold numbers; code consumes named constants.

## Purpose
Canonical state, phase, pose, camera, and input contracts for hierarchical 3D Hero parents (Seat Shell first). Presentation only. No durable writes or entitlement from canvas.

## R1–R10 roots (must be accounted for every hierarchy PR)

| Root | Intent | Status |
|------|--------|--------|
| R1 State model | openParentId, focusedChildId, focusedLeafId, phase, openAmount, cameraId, inputMode | Living |
| R2 Phase machine | rest → opening → open → closing; one-open parent | Living |
| R3 Pose math | altitudes, radii, child step, shell lift | Living |
| R4 Camera dock | named semantic ids; DETAIL_ANCHOR for full-area | Living |
| R5 Input ownership | NAVIGATE orbit/zoom; INSPECT lock to dock | Living |
| R6 Reduced motion | HIERARCHY_REDUCED_SNAP; snap open/close | Living |
| R7 Responsive FOV | responsiveFovBoost / FOV_BOOST_NARROW | Living |
| R8 Accessibility | accessible names; keyboard path; no exclusive pointer | Living |
| R9 Theme isolation | document.documentElement only; no body fallback | Living |
| R10 Presentation-only | presentationOnly:true, durable:false stamps | Living |

## §9 Living numbers table

| Name | Value | Status | Notes |
|------|-------|--------|-------|
| `SEAT_REST_Y` | `0.62` | starting | |
| `SEAT_OPEN_LIFT` | `0.28` | starting | |
| `CHILD_STEP_Y` | `0.18` | starting | |
| `CHILD_STEP_R` | `0.12` | starting | |
| `OPEN_DURATION_MS` | `420` | starting | |
| `CLOSE_DURATION_MS` | `320` | starting | |
| `RING_R0_ZIP_SCALE` | `0.22` | starting | R0 crown |
| `RING_R1_SCALE` | `1.18` | starting | |
| `RING_R2_SCALE` | `1.42` | starting | |
| `NAV_ZOOM_MIN` | `0.72` | starting | |
| `NAV_ZOOM_MAX` | `1.55` | starting | |
| `NAV_ZOOM_REDUCED_MAX` | `1.2` | starting | R4/R5 |
| `SETUP_RING_FILL_MS` | `480` | starting | R2/R3 camera-fill |
| `SETUP_RING_FOV_FILL` | `3` | starting | R7 camera-fill |
| `ZIPSKILLS_BRANCH_MS` | `300` | starting | R0 ZipSkills branch |

Full measured table remains authoritative on `main` history; amend rows in the same PR when values change.

## Phases
`REST` | `OPENING` | `OPEN` | `CLOSING`

One open parent at a time. Presentation only.

## Camera
Named semantic ids. Full-area content (login/signup/config) uses `DETAIL_ANCHOR` and camera-fill until readable. Free orbit/zoom only in `NAVIGATE`.

## Input
`NAVIGATE` · `INSPECT` · `DEMO`. Wheel + touch drag/pinch for orbit/zoom when allowed.

## Viewport / reduced motion
`document.documentElement` attributes only. `HIERARCHY_REDUCED_SNAP` forces snap open/close.
