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
| Baseline camera | existing Cam / `TeamAiHero.setCamera` / event |
| Module | `public/hero-layer-handoff.js` |
| Engine-open event | `teamai:web-ai-hero-engine-open` (from `hero-auth-handoff.js`) |
| Return | `returnToEntranceLayer()` · optional `[data-hero-layer-return]` |
| `data-hero-machine-ui` | **Not set by V3.4** — owned by hierarchy DOM chrome absorption |
| Inspection reset | **Remains** inspection-spine owner |

## Flow

```text
Layer A (entrance)
  → Open engine / demo (get-started)
      → data-hero-layer="machine"
      → request HERO_WIDE baseline (API/event; no synthetic control click)
      → (auth panel may still open — presentation handoff only)
  ← returnToEntranceLayer() or [data-hero-layer-return]
      → data-hero-layer="entrance"
      → HERO_WIDE again; Hero instance kept
```

## Forbidden

- Second `<canvas>` / second Three.js app  
- Setting `data-hero-machine-ui` from this module (hides control-row)  
- Firestore / OAuth / durable auth from this module  
- Stealing `data-inspection-reset`  
- 029-released claim  

## Tests

`tests/hero-v3.4-get-started-handoff.test.mjs`

## Next

**V3.5** — Far-environment clarity.
