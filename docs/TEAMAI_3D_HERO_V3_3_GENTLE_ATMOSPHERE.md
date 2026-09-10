# V3.3 — Gentle Hero atmosphere (Layer A)

**Status:** Implemented (presentation) · **no 029-released claim**  
**Date:** 2026-09-10  
**Authority:** VISION §1 Layer A · §6 V3.3 · ENTRANCE_IA_LAYOUT_CONTRACT · SP-07 frontier decision  
**Class:** Adjust existing owners — **no second WebGL runtime**

## Objective

On the public entrance (Layer A), the existing 3D Hero remains a **gentle atmosphere backdrop** — inviting, not demanding interaction. Soft aura drift supports the canvas; reduced-motion users get static auras.

## Owners (adjust only)

| Piece | Owner |
|-------|--------|
| Canvas | `#hero-canvas` · `data-entrance-region="atmosphere"` |
| Aura nodes | `.hero-aura.hero-aura-a` · `.hero-aura.hero-aura-b` |
| Lighting / atmosphere vars | `public/hero-aura.js` |
| Styles | `public/hero.css` |
| Layer marker | `.hero-shell[data-hero-layer="entrance"]` |

## Behavior

1. Default shell layer is **entrance**.  
2. `hero-aura.js` sets `data-atmosphere="gentle"` and `--hero-atmosphere` while on entrance.  
3. CSS drifts auras slowly when `data-atmosphere-motion="drift"`.  
4. Reduced motion (`prefers-reduced-motion` or `data-atmosphere-motion="static"`) disables aura animation.  
5. **One canvas only** — no second Three.js / WebGL app.

## Forbidden

- Second `<canvas>` or second Hero bootstrap  
- Backend / OAuth / Firestore from atmosphere path  
- Color/material art-direction rewrite of the machine  
- Seat config as entrance primary action  

## Tests

`tests/hero-v3.3-gentle-atmosphere.test.mjs`

## Next

**V3.4** — Get-started → machine baseline handoff (`data-hero-layer="machine"` via existing paths).
