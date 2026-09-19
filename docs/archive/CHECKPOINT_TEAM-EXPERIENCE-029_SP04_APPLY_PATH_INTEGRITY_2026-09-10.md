# Checkpoint — SP-04 Apply-path integrity

**Date:** 2026-09-10  
**Slice:** SP-04 (spatial execution basis Gate S8) · Issue #232 residual  
**Claim:** presentation verification only · **no 029-released claim**

## ORUCAVEAM

| Letter | Application |
|--------|-------------|
| **O** | Make hero-flex reconstruction fail loudly on missing expected patches |
| **R** | No architecture rewrite; no backend; no Hero live bind |
| **U** | Ongoing lead + #133 validation-and-discipline gate |
| **C** | `scripts/apply-cam2-tree-follow-flex.mjs` · spatial basis SP-04 |
| **A** | `scripts/flex-apply-integrity.mjs` + assert at end of apply |
| **V** | `tests/hero-sp04-apply-path-integrity.test.mjs` |
| **E / M** | One helper + wire; existing apply path |

## Evidence

- Expected markers: Cam-2…5 imports, followHierarchyTreeCamera, shouldApplyTreeNav, resolveSelectedSeatDock, poseAboutTreeCenter, edgeDriftDelta, inverseSwipeDelta, WORLD_BASELINE_DOCK_ID
- Emergency loader / non-full assembly → exit 1
- Partial missing markers → exit 1
- Full assembly with all markers → OK

## Evidence class

`IMPLEMENTED` (unit + apply-script wire) — does not claim runtime-proven visual feel.

## Next authorized command

**SP-05** tree depth/readability matrix **or** **V3.3** gentle Hero atmosphere — still presentation-only.
