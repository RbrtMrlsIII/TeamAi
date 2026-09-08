# Checkpoint — Seat Shell Hierarchy v1 Execution Plan

**Date:** 2026-09-08  
**Issue:** #144  
**Branch:** `feat/029-seat-shell-hierarchy-v1`  
**Status:** CODING — Step 1 complete; Steps 2–7 pending  
**Authority:** Product Law E+J → Masterplan 029 (presentation continuity) → hierarchy-runtime + seat-shell-hierarchy skills → sheet + baseline §9  

## PR strategy

**One PR** (bigger slice) executed through **smaller steps** until merge-ready under Issue #133.

Do not open parallel PRs for the same parent. Commit per ladder step if useful; open/update one PR when PASS is reachable.

## Skills to load every hierarchy edit

1. `skills/execution/orucaveam/` (discipline)
2. `skills/frontend/spatial/hierarchy-runtime/SKILL.md`
3. `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md`
4. `skills/frontend/spatial/UI_UX-Promax-Skill.md` (+ motion / responsive / accessibility as needed)
5. Seat read-model only if feeding health later (v1 may stay fixture)

## Ladder (track progress)

| Step | Content | Status |
|------|---------|--------|
| 0 | Sheet confirmed; issue #144; branch | DONE |
| 1 | State model: SeatShellState → HierarchyRuntimeState | DONE (hero-flex + static tests) |
| 2 | Select Seat + dock SEAT_CLOSE; one-open | PENDING |
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

## DO NOT

- Expand `hero-seat-stack.js` as permanent hierarchy home
- Treat health as entitlement without `source: 'domain'`
- Other domain gears in this PR
- Invent numbers / second theme root / durable browser writes
- Claim TEAM-EXPERIENCE-029 released

## Files expected to change (implementation)

- `public/hero-flex.js` (state, select, dock, pose, draw children/leaf)
- Possibly small helpers; prefer extend existing over parallel framework
- `tests/` new or extended static tests for part IDs / one-open / leaf-inside
- Optional: authored mesh adjustments only if required for open silhouette
- This checkpoint + HandOver note when complete

## Workarounds (if stuck)

See session target contract: proxy pose if mesh hard; snap if motion flaky; fixture health enums; defer Toolkit/ZipSkills; stop at skill STOP line.

## Next action

Next: **Step 2 — Select Seat + dock SEAT_CLOSE; one-open** (wire select path to openParentId later; dock camera).
