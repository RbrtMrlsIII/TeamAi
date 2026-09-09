# Checkpoint — TEAM-EXPERIENCE-029 P3.1 SEAT_TOOLKIT visual flex

**Date:** 2026-09-09  
**Slice:** P3.1 — toolkit branch visual flex + keyboard T  
**Evidence:** IMPLEMENTED (apply script + source contract tests) · **no 029-released claim**

## Wiring (via `scripts/apply-p3.1-toolkit-flex.mjs`)

- Import P3 toolkit branch APIs into `hero-flex.js`
- Frame: `tickToolkitBranch` after behavior tick
- Draw: `branchBoost` scale/emit on SEAT_TOOLKIT plate
- Labels: `toolkitFaceAccessibleName`
- Keyboard **T** → `requestToolkitConfigureHandoff`
- `TeamAiHero` helpers

## Boundaries

Optional equip · presentation only · no entitlement · no durable policy

## Verify

```bash
node scripts/apply-p3.1-toolkit-flex.mjs
node --test tests/hero-p3.1-toolkit-flex.test.mjs tests/hero-p3-seat-toolkit.test.mjs
```

## Next

**P4** SEAT_CAPABILITIES (or product-deferred skip)
