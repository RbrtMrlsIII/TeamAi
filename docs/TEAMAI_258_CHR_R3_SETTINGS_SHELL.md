# CHR-R3 — Dedicated Settings shell on machine layer

**Status:** IMPLEMENTATION (presentation only) · **no 029-released claim**  
**Depends on:** #259 CHR-R1/R2 · ENT-R4 (#265)

## Intent

On machine layer, the **dedicated Settings shell** remains a single instrument chrome surface and does not depend on the retired machine-nav.

- No second settings root outside residual owners
- Does not set `data-hero-machine-ui`

## Proof

- CSS: `public/hero-res-258-layer.css` (CHR-R3 block)
- Unit: `tests/hero-chr-r3-settings-shell.test.mjs`
