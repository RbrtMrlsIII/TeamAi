# Checkpoint — Cam-5 Selected Tree Center (2026-09-10)

**Slice:** Cam-5
**Prior:** Cam-2–Cam-4 merged
**Status:** IMPLEMENTED / EVIDENCE FRONTIER — not a new visual-polish queue
**Claim:** presentation only · **no 029-released claim**

## Problem solved

Camera docks for a selected seat now use that seat's world position rather than the workspace origin. This addresses the earlier selected-tree centering defect.

## Delivered

- `public/hero-cam5-selected-tree-center.js` — `seatWorldTarget`, `dockTowardSeat`, `resolveSelectedSeatDock`
- `setCamera` / `applyNavCamera` use selected seat ring position for `SEAT_CLOSE` / `DETAIL_ANCHOR`
- Seat angle formula matches `buildSeats`

## Current evidence boundary

The remaining work is verification quality, not a justification to restart the camera ladder:

1. deterministic unit/wiring checks;
2. real Hero browser proof for at least distinct seat targets;
3. reconciliation with Cam-6 mandatory look-at behavior;
4. classification of any remaining failure as a bounded defect or a verified new spatial slice.

## Deferred, separately classified

- Tree colors/material art direction: later visual layer
- Full seat-by-seat smoke: broader spatial verification
- Normal-UI GitHub bind POST: Conn-3/backend boundary, not Cam-5

## Current continuation

Do not treat “then optional tree color pass” as an automatic next command. The current-state map and SP-07 decision gate determine whether coloring is actually authorized after spatial evidence closes.
