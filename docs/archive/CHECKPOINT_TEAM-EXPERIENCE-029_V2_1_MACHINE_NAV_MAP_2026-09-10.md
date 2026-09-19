# Checkpoint — V2.1 machine nav map data 2026-09-10

**Evidence:** IMPLEMENTED (source) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §3.1 · §6 V2.1  
**Owner:** pure data over hierarchy / Cam-2 docks — `public/hero-machine-nav-map.js`

## What

- `MACHINE_NAV_MAP` lists world home, rings, seat shell + branch faces
- No second rail UI yet — **V2.2** binds this map to existing right chrome / seat-stack

## Verify

```bash
node --test tests/hero-v2.1-machine-nav-map.test.mjs
```
