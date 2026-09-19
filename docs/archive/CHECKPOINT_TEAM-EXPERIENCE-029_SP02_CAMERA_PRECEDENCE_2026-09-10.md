# Checkpoint — SP-02 Camera precedence matrix

**Date:** 2026-09-10  
**Slice:** SP-02 (spatial execution basis Gate S3) · Issue #232 residual  
**Claim:** presentation verification only · **no 029-released claim**

## ORUCAVEAM

| Letter | Application |
|--------|-------------|
| **O** | Make Gate S3 competing camera authorities explicit and testable |
| **R** | No feature expansion; no new camera subsystem; no backend |
| **U** | Ongoing lead + #133 validation-and-discipline gate |
| **C** | `docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md` Gate S3 · Cam-2/3/5/6 owners |
| **A** | Deterministic unit matrix in `tests/hero-sp02-camera-precedence.test.mjs` |
| **V** | node:test against runtime + contract presence |
| **E / M** | One test file; existing owners only |

## Evidence

- Closed → `HERO_WIDE` / world baseline; free nav only in NAVIGATE
- Seat open → `SEAT_CLOSE` + follow; Cam-3 free nav on open; Cam-6 force look-at leaves origin
- Child → near dock; Leaf/detail → `DETAIL_ANCHOR`
- Setup fill context wins
- Back/close → world baseline (V0.2)
- Spatial basis Gate S3 rows present in docs

## Evidence class

`IMPLEMENTED` (unit matrix) — not RUNTIME-PROVEN browser interaction (that remains SP-03 Cam-4).

## Next authorized command

**SP-03** Cam-4 browser proof **or** **V3.3** gentle Hero atmosphere — still presentation-only; parallel Conn-3 Edge/OAuth only.
