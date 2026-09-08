# Evidence — Seat Shell Hierarchy v1 (Issue #144)

**Date:** 2026-09-08  
**Branch:** `feat/029-seat-shell-hierarchy-v1`  
**Skills:** teamai-project → hierarchy-runtime → seat-shell-hierarchy  
**Authority:** Product Law E+J → Masterplan 029 → baseline §9 → Seat Shell v1 sheet  

## Static verification

| Check | Result |
|-------|--------|
| hierarchy-runtime + seat-shell skills exist + WHEN/AUTHORITY/ACTION/DO NOT/PASS | PASS |
| §9 named numbers (SEAT_REST_Y, SEAT_OPEN_LIFT, CHILD_STEP_*, OPEN/CLOSE_DURATION_MS) | PASS |
| SEAT_SHELL_V1_CHILDREN order; Toolkit/ZipSkills **not** in array | PASS |
| one-open + open/close pose + reduced-motion snap | PASS |
| child stack helpers + drawHierarchyChildren | PASS |
| SEAT_CONNECTION_HEALTH_FACE + HEALTH_STATUS fixture | PASS |
| focusLeaf under Connection; accessible name presentation-only | PASS |
| hero-flex: drawHealthLeaf, aria-live, Enter/Escape leaf path | PASS |
| no firestore / paypal / OAuth / API key entry | PASS |

**Test run:** `node --test tests/hero-seat-shell-hierarchy.test.mjs tests/hero-hierarchy-runtime-baseline.test.mjs` → **14 pass / 0 fail**.

## Hierarchy Runtime R1–R10 (Seat v1 fill)

| Root | Seat Shell v1 |
|------|----------------|
| R1 State | HierarchyRuntimeState + openParentId / phase / openAmount / focusedChildId / focusedLeafId / healthStatus |
| R2 Pose | SEAT_REST_Y, SEAT_OPEN_LIFT, CHILD_STEP_Y/R; tickHierarchyPose |
| R3 Camera | Dock SEAT_CLOSE on select; HERO_WIDE on close (semantic only; free orbit may-evolve) |
| R4 Input | Click/Enter select; Escape close; ←/→ child focus; Enter leaf; Escape clear leaf |
| R5 Motion | OPEN/CLOSE_DURATION_MS; HIERARCHY_REDUCED_SNAP |
| R6 Parts | SEAT_SHELL + v1 children + SEAT_CONNECTION_HEALTH_FACE |
| R7 Theme | documentElement theme only (no second theme root) |
| R8 A11y | aria-live seat label; healthLeafAccessibleName |
| R9 Density/profile | existing profile(); artifacts unchanged |
| R10 Presentation boundary | durable:false; open ≠ entitlement; fixture health only |

## Deferred (sheet)

- `SEAT_TOOLKIT`, `SEAT_ZIPSKILLS` — **deferred** (not in SEAT_SHELL_V1_CHILDREN)
- Workspace middle-ring backend services — follow-on (not this PR)
- Free orbit / zoom — R3/R4 may-evolve

## Claim

Presentation continuity only. **No 029-released claim.**
