# Checkpoint — Cam-2 Tree Camera Follow (2026-09-09)

**Slice:** Cam-2  
**Prior:** Cam-1 #191 merged  
**Claim:** presentation only · **no 029-released claim**

## Delivered

- `public/hero-cam2-tree-follow.js` — `resolveTreeCamera` / `TREE_CAMERA`
- Open seat shell / child / leaf → dock on that tree (SEAT_CLOSE or DETAIL_ANCHOR)
- Close → HERO_WIDE
- World default elevation ~**45°** (`HERO_WIDE` p:[0,d,d])
- User may still maneuver under NAVIGATE according to later Cam-3/4 behavior
- Flex wire via `scripts/apply-cam2-tree-follow-flex.mjs`

## Historical status

Cam-2 is **fulfilled historical architecture**. Cam-3 and Cam-4 subsequently merged, and Vision V0–V2 later refined the camera experience. Agents must not use this checkpoint to schedule Cam-3 or Cam-4 as new work.

Use `docs/TEAMAI_CAMERA_CAM_V_LADDER_RECONCILIATION.md` for the current camera execution chronology and `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` for the current pre-backend / pre-coloring verification sequence.

Any remaining camera work must be justified as a specific current V-series or residual verification item, not as “Cam-3 next.”
