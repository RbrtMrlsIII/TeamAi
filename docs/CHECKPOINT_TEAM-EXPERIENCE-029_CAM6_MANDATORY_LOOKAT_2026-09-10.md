# Checkpoint — Cam-6 Mandatory selected-tree look-at (2026-09-10)

**Slice:** Cam-6  
**Issue:** #212  
**Prior:** Cam-5 module on main  
**Claim:** presentation only · **no 029-released claim**

## Delivered

- `resolveSelectedSeatDock(..., { force | hierarchyOpen })` — mandatory while seat shell open
- Loader `setCamera` / `applyNavCamera` pass `{ force: true }` when `openParentId` includes `SEAT_SHELL`
- Tests cover different seats producing different look-at targets
- Plan doc linked from Issue #212

## Historical status

Cam-6 is the selected-tree look-at correction and is part of the fulfilled camera architecture. The current execution path is the Vision V-series plus the spatial reconciliation gates, not a new Cam queue.

The historical deferred notes are superseded where later work already landed, including the V0.5 `NAV_ZOOM_MAX = 2.0` ceiling. Do not reopen those items from this checkpoint.

## Remaining boundary

Browser-level seat smoke, camera precedence, and integration evidence remain governed by `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md`. Tree colors/material art direction remain explicitly blocked until the pre-coloring spatial pass completes.
