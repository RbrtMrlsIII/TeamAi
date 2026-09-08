# Checkpoint — Slice I.2: motion / transition token alignment (#95)

**Date:** 2026-09-08  
**Branch:** `feat/029-motion-transition-alignment-i2`  
**Skills:** teamai-project → hierarchy-runtime · motion · transition · accessibility (reduced)

## Delivered

- Alignment doc: `docs/TEAMAI_3D_HERO_MOTION_TRANSITION_TOKEN_ALIGNMENT.md`
- Static tests: `tests/hero-motion-transition-alignment.test.mjs`
- §9 names bound to runtime exports (520 / 420 / 700 / snap true)
- Motion + transition skill DO NOT language asserted
- **No numeric change** to §9; **no** new CSS timing namespace

## R1–R10 accounting

| Root | This slice |
|------|------------|
| R5 motion | Documented role map + reduced snap contract |
| R3 camera | CAMERA_LERP_MS → long move role |
| Others | Deferred |

## Next

**I.3** responsive + accessibility wiring + reduced-motion regression  
Then **J** #88 visual evidence

## Boundaries

Presentation only · no 029-released claim · Merge gate #133
