# Checkpoint — SP-03 Cam-4 browser proof

**Date:** 2026-09-10  
**Slice:** SP-03 (spatial execution basis · Issue #232 residual)  
**Claim:** presentation verification only · **no 029-released claim**

## ORUCAVEAM

| Letter | Application |
|--------|-------------|
| **O** | Trace Cam-4 module → apply wire → browser input; prove edge / inverse / reduced-motion / look-at coexistence |
| **R** | No new camera subsystem; no backend; no Hero live bind; no apply architecture rewrite |
| **U** | Ongoing lead + #133 validation-and-discipline gate |
| **C** | `public/hero-cam4-edge-swipe.js` · `scripts/apply-cam2-tree-follow-flex.mjs` · Cam-6 look-at · spatial basis SP-03 |
| **A** | Unit matrix + Playwright e2e proof |
| **V** | `tests/hero-sp03-cam4-browser-proof.test.mjs` · `tests/e2e/hero-cam4-edge-proof.spec.ts` |
| **E / M** | Existing owners only |

## Evidence

- Edge pressure zero at center; non-zero only in edge bands
- Reduced motion → dYaw/dPitch = 0
- Inverse swipe flips drag direction
- Apply script embeds Cam-4 import, edgePointerNorm, inverseSwipeDelta, edgeDriftDelta under `shouldApplyTreeNav` + `!reducedMotion`
- Free nav remains allowed while seat shell open; Cam-6 look-at stays off world origin
- Playwright: module loads in page, edge pointer + hierarchy open + reduced motion coexist

## Evidence class

`IMPLEMENTED` + browser interaction proof (Playwright) — not full visual endorsement of feel.

## Next authorized command

**SP-04** apply-path integrity (fail loud on no-op) **or** **V3.3** gentle Hero atmosphere — still presentation-only; Conn-3 Edge/OAuth only.
