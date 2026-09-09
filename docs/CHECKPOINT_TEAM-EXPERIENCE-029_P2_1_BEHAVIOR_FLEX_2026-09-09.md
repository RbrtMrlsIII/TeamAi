# Checkpoint — TEAM-EXPERIENCE-029 P2.1 SEAT_BEHAVIOR visual flex

**Date:** 2026-09-09  
**Slice:** P2.1 — behavior branch visual flex + keyboard B  
**Evidence:** IMPLEMENTED (apply script + source contract tests) · **no 029-released claim**

## Wiring (via `scripts/apply-p2.1-behavior-flex.mjs`)

- Import P2 behavior branch APIs into `hero-flex.js`
- Frame: `tickBehaviorBranch` after connection tick
- Draw: `branchBoost` scale/emit on SEAT_BEHAVIOR plate
- Labels: `behaviorFaceAccessibleName`
- Keyboard **B** → `requestBehaviorConfigureHandoff`
- `TeamAiHero` helpers

## Boundaries

Presentation only · no Firestore write · no durable policy · no entitlement

## Verify

```bash
node scripts/apply-p2.1-behavior-flex.mjs
node --test tests/hero-p2.1-behavior-flex.test.mjs tests/hero-p2-seat-behavior.test.mjs
```

## Next

**P3 SEAT_TOOLKIT** (optional equip face) or owner visual endorsement path
