# Checkpoint — TEAM-EXPERIENCE-029 P7 SEAT_TASK_EVIDENCE branch runtime

**Date:** 2026-09-09  
**Slice:** P7 — SEAT_TASK_EVIDENCE task evidence face (runtime)  
**Evidence:** IMPLEMENTED (apply script + node tests) · **no 029-released claim**

## Product rule

Presentation only · evidence face must not claim durable authority or entitlement.

## On this slice

- `TASK_EVIDENCE_BRANCH_MS` (260)
- `tickTaskEvidenceBranch` / `getTaskEvidenceBranchAmount`
- `taskEvidenceFaceAccessibleName` / `requestTaskEvidenceConfigureHandoff`
- Mutual exclusion with prior seat faces
- Open parent still defaults to CONNECTION (P1 order)

## Boundaries

Presentation only · not authority · no entitlement · no durable policy

## Deferred

**P7.1** visual flex + keyboard **E** in `hero-flex.js`

## Verify

```bash
node scripts/apply-p7-seat-task-evidence.mjs
node --test tests/hero-p7-seat-task-evidence.test.mjs tests/hero-p6-seat-workspace-scope.test.mjs
```
