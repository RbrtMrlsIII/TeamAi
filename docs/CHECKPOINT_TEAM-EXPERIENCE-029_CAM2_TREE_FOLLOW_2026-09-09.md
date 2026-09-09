# Checkpoint — Cam-2 Tree Camera Follow (2026-09-09)

**Slice:** Cam-2  
**Prior:** Cam-1 #191 merged  
**Claim:** presentation only · **no 029-released claim**

## Delivered

- `public/hero-cam2-tree-follow.js` — `resolveTreeCamera` / `TREE_CAMERA`
- Open seat shell / child / leaf → dock on that tree (SEAT_CLOSE or DETAIL_ANCHOR)
- Close → HERO_WIDE
- World default elevation ~**45°** (`HERO_WIDE` p:[0,d,d])
- User may still maneuver (scroll zoom, drag/pitch) under NAVIGATE / future Cam-3–4
- Flex wire via `scripts/apply-cam2-tree-follow-flex.mjs` (idempotent; tests auto-run)

## Next

Cam-3 free zoom on current tree center while parent open; Cam-4 edge/inverse-swipe.
