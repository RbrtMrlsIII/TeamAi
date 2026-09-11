# Archived baseline: TURN_FOLLOW

```text
Archived idea / baseline: TURN_FOLLOW
Status: RETIRED
Original intent: Force a camera mode for turn-loop follow presentation.
What was learned: A separate turn-follow camera fought selected-seat / world ownership.
Why retired: User-directed model (Issue #258 / PR #259) requires world baseline + future subject-lock, not a parallel TURN_FOLLOW identity.
Replacement: HERO_WIDE fallback; selected-seat subject-lock where authorized.
What must NOT be revived: DOM action, runtime camera-table entry, turn-loop setCamera('TURN_FOLLOW'), or hidden alias.
Related: PR #259, Issue #258, Issue #260
Date retired: 2026-09-11 (merge #259 → main 4b9a74d)
Revival authorization required: YES
```

**Redirect:** `RETIRED → docs/archive/superseded/TURN_FOLLOW.md`
