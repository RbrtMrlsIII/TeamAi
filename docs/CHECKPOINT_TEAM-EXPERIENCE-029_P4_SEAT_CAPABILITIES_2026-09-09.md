# Checkpoint — TEAM-EXPERIENCE-029 P4 SEAT_CAPABILITIES branch runtime

**Date:** 2026-09-09  
**Slice:** P4 — SEAT_CAPABILITIES capability face (runtime)  
**Evidence:** IMPLEMENTED (apply script + node tests) · **no 029-released claim**

## Product rule

**CAPABILITY ≠ AUTHORIZATION ≠ WORKSPACE ≠ FIRESTORE.**  
Presentation must not imply entitlement or grant authority.

## On this slice

- `CAPABILITIES_BRANCH_MS` (320)
- `tickCapabilitiesBranch` / `getCapabilitiesBranchAmount`
- `capabilitiesFaceAccessibleName` / `requestCapabilitiesConfigureHandoff`
- Mutual exclusion with CONNECTION / BEHAVIOR / TOOLKIT
- Open parent still defaults to CONNECTION (P1 order)

## Boundaries

Presentation only · not authorization · no entitlement · no durable policy

## Deferred

**P4.1** visual flex + keyboard **K** in `hero-flex.js`

## Verify

```bash
node scripts/apply-p4-seat-capabilities.mjs
node --test tests/hero-p4-seat-capabilities.test.mjs tests/hero-p3-seat-toolkit.test.mjs
```
