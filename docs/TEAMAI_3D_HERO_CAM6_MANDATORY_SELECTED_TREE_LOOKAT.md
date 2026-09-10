# Cam-6 — Mandatory selected-tree look-at

**Issue:** #212  
**Claim:** presentation only · **no 029-released claim**

## Problem

Selection moves the camera near the seat, but look-at `t` stays on hero center `[0, y, 0]`.

## Phase 1 (this slice)

| Rule | Behavior |
|------|----------|
| One XYZ authority | `seatWorldTarget` / `dockTowardSeat` (same angle as `buildSeats`) |
| Seat shell open | **Force** seat look-at on `setCamera` + `applyNavCamera` |
| Dock id | Framing only (`SEAT_CLOSE`, `DETAIL_ANCHOR`) |
| Closed / HERO_WIDE | World center OK |

## Deferred

- Free zoom up to **200%** (navZoom clamp)
- Child face look-at offset
- Tree colors
- Full seat smoke

## Success

Selected seat is the focus of the shot; orbit pivots on that tree.
