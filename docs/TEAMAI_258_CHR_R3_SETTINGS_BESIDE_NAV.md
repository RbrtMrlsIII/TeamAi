# CHR-R3 — Settings beside machine-nav

**Status:** IMPLEMENTATION (presentation only) · **no 029-released claim**  
**Depends on:** #259 CHR-R1/R2 · ENT-R4 (#265)

## Intent

On machine layer, **settings** and **machine-nav** form one chrome strip (beside, not a second island).

- No second settings root outside residual owners
- Does not set `data-hero-machine-ui`

## Proof

- CSS: `public/hero-res-258-layer.css` (CHR-R3 block)
- Unit: `tests/hero-chr-r3-settings-beside-nav.test.mjs`
