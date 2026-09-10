# V3.4 — Get-started → machine baseline handoff

**Status:** Implemented (presentation) · **no 029-released claim**  
**Date:** 2026-09-10  
**Authority:** VISION §1 Layer A/B · §6 V3.4 · ENTRANCE_IA_LAYOUT_CONTRACT · SP-07  
**Class:** Adjust handoff — **no second WebGL runtime**

## Objective

When the user takes a primary get-started / open-engine action, the product moves from **Layer A (entrance)** to **Layer B (machine)** on the **same** Hero instance: set `data-hero-layer="machine"`, request world baseline `HERO_WIDE`, and allow return to entrance without destroying the canvas.

## Owners

| Piece | Owner |
|-------|--------|
| Layer flag | `.hero-shell[data-hero-layer]` |
| Machine UI flag | `.hero-shell[data-hero-machine-ui]` (existing consumers) |
| Baseline camera | `[data-camera="HERO_WIDE"]` · existing Cam / hierarchy path |
| Module | `public/hero-layer-handoff.js` |
| Engine-open event | `teamai:web-ai-hero-engine-open` (from `hero-auth-handoff.js`) |
| Return | `[data-inspection-reset]` → entrance layer |

## Flow

```text
Layer A (entrance)
  → Open engine / demo (get-started)
      → data-hero-layer="machine" + data-hero-machine-ui="1"
      → request HERO_WIDE baseline
      → (auth panel may still open — presentation handoff only)
  ← Inspection Reset / returnToEntranceLayer()
      → data-hero-layer="entrance"
      → clear data-hero-machine-ui
      → HERO_WIDE again; Hero instance kept
```

## Forbidden

- Second `<canvas>` / second Three.js app  
- Firestore / OAuth / durable auth from this module  
- Treating auth panel as domain authority  
- 029-released claim  

## Tests

`tests/hero-v3.4-get-started-handoff.test.mjs`

## Next

**V3.5** — Far-environment clarity.
