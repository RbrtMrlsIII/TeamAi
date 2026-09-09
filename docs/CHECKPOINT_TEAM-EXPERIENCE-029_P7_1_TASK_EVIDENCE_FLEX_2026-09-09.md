# Checkpoint — TEAM-EXPERIENCE-029 P7.1 SEAT_TASK_EVIDENCE visual flex

**Date:** 2026-09-09  
**Slice:** P7.1 — task evidence branch visual flex + keyboard E  
**Evidence:** IMPLEMENTED (apply script + source contract tests) · **no 029-released claim**

## Wiring

- Import P7 task evidence branch APIs into `hero-flex.js`
- Frame: `tickTaskEvidenceBranch`
- Draw: `branchBoost` on SEAT_TASK_EVIDENCE plate
- Labels: `taskEvidenceFaceAccessibleName`
- Keyboard **E** → `requestTaskEvidenceConfigureHandoff`
- `TeamAiHero` helpers

## Boundaries

Evidence face · presentation only · no entitlement · not authority

## Verify

```bash
node scripts/apply-p7.1-task-evidence-flex.mjs
node --test tests/hero-p7.1-task-evidence-flex.test.mjs tests/hero-p7-seat-task-evidence.test.mjs
```

## Next

Seat-shell hierarchy ladder complete (P1–P7.1).  
Optional: refresh `TEAMAI_CURRENT_STATE.md` · P-R2 setup ring · Owner endorsement.
