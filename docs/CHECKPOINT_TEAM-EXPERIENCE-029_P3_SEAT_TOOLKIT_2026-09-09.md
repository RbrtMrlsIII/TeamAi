# Checkpoint — TEAM-EXPERIENCE-029 P3 SEAT_TOOLKIT branch runtime

**Date:** 2026-09-09  
**Slice:** P3 — SEAT_TOOLKIT optional equip face (runtime)  
**Evidence:** IMPLEMENTED (apply script + node tests) · **no 029-released claim**

## Product rule

SEAT_TOOLKIT / SEAT_SKILLS are **optional**. Presentation must not imply entitlement or required setup.

## On this slice

- `TOOLKIT_BRANCH_MS` (340)
- `tickToolkitBranch` / `getToolkitBranchAmount`
- `toolkitFaceAccessibleName` / `requestToolkitConfigureHandoff`
- Mutual exclusion with CONNECTION and BEHAVIOR branches
- Open parent still defaults to CONNECTION (P1 order)

## Boundaries

Presentation only · no durable policy · no entitlement · optional equip

## Deferred

**P3.1** visual flex + keyboard **T** in `hero-flex.js` (same split as P1→P1.1 / P2→P2.1)

## Verify

```bash
node scripts/apply-p3-seat-toolkit.mjs
node --test tests/hero-p3-seat-toolkit.test.mjs tests/hero-p2-seat-behavior.test.mjs tests/hero-p1-seat-connection.test.mjs
```
