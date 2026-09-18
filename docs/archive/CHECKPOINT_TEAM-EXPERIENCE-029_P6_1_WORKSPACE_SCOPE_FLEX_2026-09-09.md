# Checkpoint — TEAM-EXPERIENCE-029 P6.1 SEAT_WORKSPACE_SCOPE visual flex

**Date:** 2026-09-09  
**Slice:** P6.1 — workspace scope branch visual flex + keyboard W  
**Evidence:** IMPLEMENTED (apply script + source contract tests) · **no 029-released claim**

## Wiring

- Import P6 workspace scope branch APIs into `hero-flex.js`
- Frame: `tickWorkspaceScopeBranch`
- Draw: `branchBoost` on SEAT_WORKSPACE_SCOPE plate
- Labels: `workspaceScopeFaceAccessibleName`
- Keyboard **W** → `requestWorkspaceScopeConfigureHandoff`
- `TeamAiHero` helpers

## Boundaries

WORKSPACE ≠ durable store · presentation only · no entitlement

## Verify

```bash
node scripts/apply-p6.1-workspace-scope-flex.mjs
node --test tests/hero-p6.1-workspace-scope-flex.test.mjs tests/hero-p6-seat-workspace-scope.test.mjs
```

## Next

**P7 SEAT_TASK_EVIDENCE**
