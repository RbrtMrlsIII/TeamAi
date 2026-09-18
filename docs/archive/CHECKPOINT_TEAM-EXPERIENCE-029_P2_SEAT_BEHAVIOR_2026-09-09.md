# Checkpoint — TEAM-EXPERIENCE-029 P2 SEAT_BEHAVIOR

**Date:** 2026-09-09  
**Slice:** P2 — SEAT_BEHAVIOR branch runtime (safe)  
**Evidence:** IMPLEMENTED (source + node tests) · not RUNTIME-PROVEN live WebGL · **no 029-released claim**

## Changes

- `public/hero-hierarchy-runtime.js`: `BEHAVIOR_BRANCH_MS` (360), `behaviorBranchAmount` ease/snap, `tickBehaviorBranch`, `getBehaviorBranchAmount`, `behaviorFaceAccessibleName`, `requestBehaviorConfigureHandoff`
- Mutual exclusion with CONNECTION branch when focusing BEHAVIOR / other children
- `tests/hero-p2-seat-behavior.test.mjs` (8 cases; P1 suite still green)

## Boundaries held

- Presentation only — no Firestore write, no durable policy, no entitlement
- One theme root unchanged
- Open parent still defaults focus to CONNECTION (P1 order)
- Visual flex + keyboard **B** deferred to **P2.1** (same pattern as P1 → P1.1)

## Verification

```text
node --test tests/hero-p1-seat-connection.test.mjs tests/hero-p2-seat-behavior.test.mjs
→ 13 pass
```

## Next

**P2.1** — hero-flex visual branchBoost for BEHAVIOR + keyboard B handoff (optional small delta)  
Then **P3 SEAT_TOOLKIT** (optional equip face)
