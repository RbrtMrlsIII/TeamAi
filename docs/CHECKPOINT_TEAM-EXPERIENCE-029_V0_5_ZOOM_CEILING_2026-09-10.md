# Checkpoint — V0.5 zoom ceiling ~200% 2026-09-10

**Evidence:** IMPLEMENTED (source) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §6 V0.5  
**Owner:** `NAV_ZOOM_MAX` in `public/hero-hierarchy-runtime.js` + §9 in hierarchy baseline

## What

- `NAV_ZOOM_MAX`: `1.55` → **`2.0`** (≈200% relative to default zoom 1)
- §9 table updated; reduced-motion max unchanged (still tighter)
- Subject lock (Cam-6) and free nav (V0.4) unchanged

## Verify

```bash
node --test tests/hero-v0.5-zoom-ceiling.test.mjs tests/hero-nav-orbit.test.mjs
```
