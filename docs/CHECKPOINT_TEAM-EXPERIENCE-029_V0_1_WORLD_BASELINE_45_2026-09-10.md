# Checkpoint — V0.1 world baseline ~45° (HERO_WIDE) 2026-09-10

**Evidence:** IMPLEMENTED (source) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §1 Layer B · §4 ownership · §6 V0.1  
**Owner:** `HERO_WIDE` in `public/hero-flex.js` cameras() via `scripts/apply-cam2-tree-follow-flex.mjs`  
**Module notes:** `public/hero-cam2-tree-follow.js` (`DEFAULT_WORLD_ELEVATION_DEG`, `WORLD_BASELINE_DOCK_ID`)

## What

- Product baseline elevation remains **45°** (eye y/z = 1 on HERO_WIDE: `p:[0,d,d]`).
- Apply path continues to rewrite legacy `d*.67` (~34°) → `d,d`.
- Tests lock the constant, dock id, flex geometry, and apply ownership.
- **No** second camera table; Cam-5/6 / hierarchy runtime untouched.

## Forbidden (this slice)

- New world camera subsystem
- Changes to seat dock look-at (Cam-6)
- Theme, settings, entrance layout

## Verify

```bash
node --test tests/hero-v0.1-world-baseline-45.test.mjs
```
