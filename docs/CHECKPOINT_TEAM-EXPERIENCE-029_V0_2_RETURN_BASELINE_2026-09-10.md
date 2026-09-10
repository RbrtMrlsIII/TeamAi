# Checkpoint — V0.2 return-to-baseline (HERO_WIDE) 2026-09-10

**Evidence:** IMPLEMENTED (source) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §2.3 · §6 V0.2  
**Owner:** `returnFromSeatShell` / `closeHierarchyParent` via `scripts/apply-cam2-tree-follow-flex.mjs`  
**Baseline dock:** `WORLD_BASELINE_DOCK_ID` (`HERO_WIDE`) from Cam-2 / V0.1

## What

- Leave tree / close parent → `setCamera(WORLD_BASELINE_DOCK_ID)`  
- Free-nav home: `navOrbitYaw = navOrbitPitch = 0`, `navZoom = 1`  
- No second camera system; Cam-5/6 subject lock unchanged while shell open  

## Verify

```bash
node --test tests/hero-v0.2-return-baseline.test.mjs
```
