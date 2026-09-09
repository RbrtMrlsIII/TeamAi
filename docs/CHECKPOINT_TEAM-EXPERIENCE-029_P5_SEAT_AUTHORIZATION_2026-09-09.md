# Checkpoint — TEAM-EXPERIENCE-029 P5 SEAT_AUTHORIZATION branch runtime

**Date:** 2026-09-09  
**Slice:** P5 — SEAT_AUTHORIZATION authorization face (runtime)  
**Evidence:** IMPLEMENTED (apply script + node tests) · **no 029-released claim**

## Product rule

**CAPABILITY ≠ AUTHORIZATION ≠ WORKSPACE ≠ FIRESTORE.**  
Authorization face must not present as capability grant or entitlement.

## On this slice

- `AUTHORIZATION_BRANCH_MS` (300)
- `tickAuthorizationBranch` / `getAuthorizationBranchAmount`
- `authorizationFaceAccessibleName` / `requestAuthorizationConfigureHandoff`
- Mutual exclusion with CONNECTION / BEHAVIOR / TOOLKIT / CAPABILITIES
- Open parent still defaults to CONNECTION (P1 order)

## Boundaries

Presentation only · not capability · no entitlement · no durable policy

## Deferred

**P5.1** visual flex + keyboard **A** in `hero-flex.js`

## Verify

```bash
node scripts/apply-p5-seat-authorization.mjs
node --test tests/hero-p5-seat-authorization.test.mjs tests/hero-p4-seat-capabilities.test.mjs
```
