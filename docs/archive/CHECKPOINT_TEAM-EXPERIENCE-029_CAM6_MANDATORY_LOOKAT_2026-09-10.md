# Checkpoint — Cam-6 Mandatory selected-tree look-at (2026-09-10)

**Slice:** Cam-6
**Issue:** #212
**Prior:** Cam-5 module on main
**Status:** IMPLEMENTED CAMERA REFINEMENT / EVIDENCE FRONTIER
**Claim:** presentation only · **no 029-released claim**

## Delivered

- `resolveSelectedSeatDock(..., { force | hierarchyOpen })` is mandatory while a seat shell is open.
- Loader `setCamera` / `applyNavCamera` pass `{ force: true }` when `openParentId` includes `SEAT_SHELL`.
- Different seats resolve to different look-at targets; force mode also protects non-SEAT semantic calls.

## Verification boundary

Static tests establish the selected-tree look-at contract. The remaining browser task is to prove the real Hero gaze changes with the selected seat and remains compatible with the current navigation/interaction contract.

That browser proof is evidence for an implemented refinement. It is not a request to create another Cam slice.

## Deferred, separately owned

- Free zoom 200%: governed by the existing zoom baseline / V-series evidence.
- Child offsets: hierarchy spatial verification.
- Tree colors/materials: later visual polish.
- Full seat smoke: broader browser verification.

## Current continuation

Use `docs/TEAMAI_029_CURRENT_STATE_MAP.md` and the spatial execution basis to decide whether the evidence frontier closes, exposes a bounded defect, or reveals a genuinely new V-series slice.
