# ENT-R4 — Entrance ↔ machine layer Playwright

**Status:** IMPLEMENTATION (presentation only) · **no 029-released claim**  
**Depends on:** #259 ENT-T1/R2/R3 · CAM-R1–R3 on main

## Intent

1. Default: `data-hero-layer="entrance"`.
2. **Open engine** → `machine`; brand not visible; **Return to entrance** visible.
3. **Return** → `entrance`; brand visible again.
4. Still one `#hero-canvas`.

## Proof

`tests/e2e/hero-ent-r4-layer.spec.ts`
