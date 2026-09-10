# Checkpoint — Cam-5 Selected Tree Center (2026-09-10)

**Slice:** Cam-5  
**Prior:** Cam-2–Cam-4 merged  
**Claim:** presentation only · **no 029-released claim**

## Problem

Camera switched to `SEAT_CLOSE` / `DETAIL_ANCHOR` on hierarchy open, but dock look-at stayed at **world origin** `[0, y, 0]`. Selected seat trees did not appear centered.

## Delivered

- `public/hero-cam5-selected-tree-center.js` — `seatWorldTarget`, `dockTowardSeat`, `resolveSelectedSeatDock`
- `setCamera` / `applyNavCamera` (via flex wire) use selected seat ring position for SEAT_CLOSE / DETAIL_ANCHOR
- Angle formula matches `buildSeats`: `-π/2 + i * 2π/n`

## Deferred

- Tree **colors** (later)
- Full **seat-by-seat** product testing (later)
- Normal-UI Connect GitHub bind POST

## Next

Operator verifies selected seat is centered when opening a seat shell; then optional tree color pass.
