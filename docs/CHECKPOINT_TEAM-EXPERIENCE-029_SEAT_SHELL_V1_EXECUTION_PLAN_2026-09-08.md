# Checkpoint — Seat Shell Hierarchy v1 Execution Plan

**Date:** 2026-09-08  
**Issue:** #144  
**Branch:** `feat/029-seat-shell-hierarchy-v1`  
**Status:** CODING — Steps 1–2 complete; Steps 3–7 pending  
**Authority:** Product Law E+J → Masterplan 029 (presentation continuity) → hierarchy-runtime + seat-shell-hierarchy skills → sheet + baseline §9  

## PR strategy

**One PR** (bigger slice) executed through **smaller steps** until merge-ready under Issue #133.

## Ladder (track progress)

| Step | Content | Status |
|------|---------|--------|
| 0 | Sheet confirmed; issue #144; branch | DONE |
| 1 | State model: SeatShellState → HierarchyRuntimeState | DONE |
| 2 | Select Seat + dock SEAT_CLOSE; one-open | DONE (selectSeatShell + Enter/Escape) |
| 3 | Open/close pose (§9 names; reduced-motion snap) | PENDING |
| 4 | Place v1 children (Connection layer + stubs) | PENDING |
| 5 | Leaf SEAT_CONNECTION_HEALTH_FACE + a11y | PENDING |
| 6 | Static tests + optional browser frames | PENDING |
| 7 | PR body R1–R10 table; CI green; merge under #133 | PENDING |

## Named numbers (consume only; amend via §9)

- `SEAT_REST_Y` = 0.62 (measured)
- `SEAT_OPEN_LIFT` = 0.28 (starting — free to learn)
- `CHILD_STEP_Y` = 0.22 / `CHILD_STEP_R` = -0.14 (starting)
- `OPEN_DURATION_MS` = 520 / `CLOSE_DURATION_MS` = 420 (starting)
- `HIERARCHY_REDUCED_SNAP` = true

## PASS (from seat-shell-hierarchy skill)

One Seat can open; v1 children visible in order; one leaf inside the shell; one-open rule; numbers named; presentation-only; tests + optional frames; **no 029-released claim**.

## Next action

Next: **Step 3 — Open/close pose** using §9 `SEAT_REST_Y` / `SEAT_OPEN_LIFT` / durations; reduced-motion snap.
