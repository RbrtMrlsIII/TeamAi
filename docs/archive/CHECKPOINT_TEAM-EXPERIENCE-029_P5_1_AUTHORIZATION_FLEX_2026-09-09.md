# Checkpoint — TEAM-EXPERIENCE-029 P5.1 SEAT_AUTHORIZATION visual flex

**Date:** 2026-09-09  
**Slice:** P5.1 — authorization branch visual flex + keyboard A  
**Evidence:** IMPLEMENTED (apply script + source contract tests) · **no 029-released claim**

## Wiring

- Import P5 authorization branch APIs into `hero-flex.js`
- Frame: `tickAuthorizationBranch`
- Draw: `branchBoost` on SEAT_AUTHORIZATION plate
- Labels: `authorizationFaceAccessibleName`
- Keyboard **A** → `requestAuthorizationConfigureHandoff`
- `TeamAiHero` helpers

## Boundaries

AUTHORIZATION ≠ CAPABILITY · presentation only · no entitlement

## Verify

```bash
node scripts/apply-p5.1-authorization-flex.mjs
node --test tests/hero-p5.1-authorization-flex.test.mjs tests/hero-p5-seat-authorization.test.mjs
```

## Next

**P6 SEAT_WORKSPACE_SCOPE** (or product-deferred)
