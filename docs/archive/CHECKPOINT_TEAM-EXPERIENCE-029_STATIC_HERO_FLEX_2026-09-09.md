# Checkpoint — Static full hero-flex restore (2026-09-09)

**Slice:** Static `public/hero-flex.js` via `_flex_src` parts (Cam-2+3+4)  
**Prior:** Cam-4 #194 merged  
**Claim:** presentation only · **no 029-released claim**

## Delivered

- `public/_flex_src/part00.txt`…`part03.txt` — full WebGL Hero source (Cam-2/3/4 wired)
- Apply script **assembles parts first** (no network when present)
- Replaces dependence on emergency loader + pre-loader SHA fetch

## Why

Main shipped a short emergency loader; CI/Pages rewrote via apply. Static parts make `/hero/` rebuild deterministic offline.

## Next (optional)

- Depth-readable faces for general tree
- Absorb interim DOM chrome into machine trees
- Graphics / Family J materials polish
