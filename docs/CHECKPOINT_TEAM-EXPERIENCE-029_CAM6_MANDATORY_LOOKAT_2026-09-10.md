# Checkpoint — Cam-6 Mandatory selected-tree look-at (2026-09-10)

**Slice:** Cam-6  
**Issue:** #212  
**Prior:** Cam-5 module on main  
**Claim:** presentation only · **no 029-released claim**

## Delivered

- `resolveSelectedSeatDock(..., { force | hierarchyOpen })` — mandatory while seat shell open
- Loader `setCamera` / `applyNavCamera` pass `{ force: true }` when `openParentId` includes `SEAT_SHELL`
- Tests: different seats → different look-at; force centers non-SEAT ids
- Plan doc linked from Issue #212

## Verify

```bash
node --test tests/hero-cam5-selected-tree-center.test.mjs tests/hero-cam6-mandatory-lookat-wire.test.mjs
```

Hard-refresh Hero; open seat 0 vs seat 2 — gaze must differ and not stare at ring center.

## Deferred

Free zoom 200% · child offsets · tree colors · seat smoke
