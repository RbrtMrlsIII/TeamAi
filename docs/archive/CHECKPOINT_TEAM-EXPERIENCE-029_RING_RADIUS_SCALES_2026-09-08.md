# Checkpoint — Ring radius scales (§9) Slice B

**Date:** 2026-09-08  
**Branch:** `feat/029-ring-radius-scales-s9`  
**Skills:** teamai-project → hierarchy-runtime → workspace-ring  

## Delivered

| Constant | Value | Home |
|----------|-------|------|
| `RING_R1_SCALE` | `1.18` | baseline §9 + runtime |
| `RING_R2_SCALE` | `1.42` | baseline §9 + runtime |

Code paths: `hero-flex.js` (R1), `hero-r2-setup-ring.js` (R2).  
Tests: doc↔code + no magic multipliers.

## Status
**starting** — promote to measured after in-browser review.

## Next
Slice C — camera orbit polish / semantic NAVIGATE bind, or D — SEAT_TOOLKIT v0.
