# Checkpoint — Cam-5 Selected Tree Center (2026-09-10)

**Slice:** Cam-5  
**Prior:** Cam-2–Cam-4 merged  
**Claim:** presentation only · **no 029-released claim**

## Problem

Camera switched to `SEAT_CLOSE` / `DETAIL_ANCHOR` on hierarchy open, but dock look-at stayed at **world origin** `[0, y, 0]`. Selected seat trees did not appear centered.

## Delivered

- `public/hero-cam5-selected-tree-center.js` — `seatWorldTarget`, `dockTowardSeat`, `resolveSelectedSeatDock`
- `setCamera` / `applyNavCamera` use selected seat ring position for `SEAT_CLOSE` / `DETAIL_ANCHOR`
- Angle formula matches `buildSeats`: `-π/2 + i * 2π/n`

## Historical status and deferred boundary

Cam-5 records the selected-tree centering correction. Subsequent Cam-6 and Vision V0–V2 work refined the surrounding experience.

The remaining verification question is browser-level confirmation across representative seats and interaction states. That belongs to the current spatial verification sequence, not to an immediate coloring pass.

**Tree colors/material art direction are explicitly deferred until the pre-backend / pre-coloring spatial execution basis is satisfied.** Do not treat this checkpoint as authorization to start color work.

Use `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` and `docs/TEAMAI_CAMERA_CAM_V_LADDER_RECONCILIATION.md` for current continuation.
