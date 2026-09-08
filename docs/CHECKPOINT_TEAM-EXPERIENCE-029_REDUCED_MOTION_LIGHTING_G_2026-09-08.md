# Checkpoint — Slice G: reduced-motion lighting contract (#89)

**Date:** 2026-09-08  
**Branch:** `feat/029-reduced-motion-lighting-g`  
**Issue:** #89  
**Skills:** teamai-project → hierarchy-runtime → workspace-ring · spatial accessibility companions

## Delivered

- Formal contract: `docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md` (RM-L1–L6)
- Static tests: `tests/hero-reduced-motion-lighting.test.mjs`
- NEXT_SLICES ladder: E merged, G in this PR, I blocked until G lands
- Confirmed existing pulse/choreography gates in hero-flex + adapter `reducedMotionChoreography`

## R1–R10 accounting

| Root | This slice |
|------|------------|
| R1 state | Deferred |
| R2 pose | Deferred |
| R3 camera | Snap already held (R5) |
| R4 input | Deferred |
| R5 motion | **Contract locked** — reduced freezes continuous light choreography |
| R6 display | Materials unchanged; emit static under reduced |
| R7 viewport | Deferred |
| R8 prefs | documentElement `data-motion` only |
| R9 wiring | Presentation only |
| R10 theme | Isolation preserved |

## Boundaries

Presentation only · no 029-released claim · Merge gate #133
