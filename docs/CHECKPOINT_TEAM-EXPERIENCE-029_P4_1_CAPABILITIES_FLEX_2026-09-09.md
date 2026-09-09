# Checkpoint — TEAM-EXPERIENCE-029 P4.1 SEAT_CAPABILITIES visual flex

**Date:** 2026-09-09  
**Slice:** P4.1 — capabilities branch visual flex + keyboard K  
**Evidence:** IMPLEMENTED (apply script + source contract tests) · **no 029-released claim**

## Wiring

- Import P4 capabilities branch APIs into `hero-flex.js`
- Frame: `tickCapabilitiesBranch`
- Draw: `branchBoost` on SEAT_CAPABILITIES plate
- Labels: `capabilitiesFaceAccessibleName`
- Keyboard **K** → `requestCapabilitiesConfigureHandoff`
- `TeamAiHero` helpers

## Boundaries

CAPABILITY ≠ AUTHORIZATION · presentation only · no entitlement

## Verify

```bash
node scripts/apply-p4.1-capabilities-flex.mjs
node --test tests/hero-p4.1-capabilities-flex.test.mjs tests/hero-p4-seat-capabilities.test.mjs
```

## Next

**P5 SEAT_AUTHORIZATION** (separate face — not capability)
