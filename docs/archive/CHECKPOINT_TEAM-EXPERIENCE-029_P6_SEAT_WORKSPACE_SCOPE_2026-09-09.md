# Checkpoint — TEAM-EXPERIENCE-029 P6 SEAT_WORKSPACE_SCOPE branch runtime

**Date:** 2026-09-09  
**Slice:** P6 — SEAT_WORKSPACE_SCOPE workspace scope face (runtime)  
**Evidence:** IMPLEMENTED (apply script + node tests) · **no 029-released claim**

## Product rule

**CAPABILITY ≠ AUTHORIZATION ≠ WORKSPACE ≠ FIRESTORE.**  
Workspace scope face must not present as durable store authority or entitlement.

## On this slice

- `WORKSPACE_SCOPE_BRANCH_MS` (280)
- `tickWorkspaceScopeBranch` / `getWorkspaceScopeBranchAmount`
- `workspaceScopeFaceAccessibleName` / `requestWorkspaceScopeConfigureHandoff`
- Mutual exclusion with CONNECTION / BEHAVIOR / TOOLKIT / CAPABILITIES / AUTHORIZATION
- Open parent still defaults to CONNECTION (P1 order)

## Boundaries

Presentation only · not Firestore · no entitlement · no durable policy

## Deferred

**P6.1** visual flex + keyboard **W** in `hero-flex.js`

## Verify

```bash
node scripts/apply-p6-seat-workspace-scope.mjs
node --test tests/hero-p6-seat-workspace-scope.test.mjs tests/hero-p5-seat-authorization.test.mjs
```
