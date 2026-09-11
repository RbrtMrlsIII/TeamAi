# CAM-R1 — Selected-seat subject-lock (post-#259)

**Status:** IMPLEMENTATION (presentation only) · **no 029-released claim**  
**Authority:** Issue #258 residual · PR #259 baseline · `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md`  
**Does not revive:** `TURN_FOLLOW`, `HERO_LOW_ORBIT` → `docs/archive/superseded/`

## Intent

After CAM-R-RETIRE, seat-relative framing uses **selected-seat subject-lock**, not a separate turn-follow camera identity.

```text
HERO_WIDE     → world baseline
SEAT_CLOSE    → dock toward selectedSeat (subject-lock)
DETAIL_ANCHOR → tighter dock toward selectedSeat
shell open    → force seat dock even if camera id is HERO_WIDE (Cam-6)
```

## Behavior (CAM-R1)

1. `resolveSelectedSeatDock` / `dockTowardSeat` remain the only seat look-at path (Cam-5/6).
2. Turn-loop handoff → next FOCUS uses **`SEAT_CLOSE`** (subject-lock), not `TEAM_ORBIT` and never `TURN_FOLLOW`.
3. `retargetSubjectLock` / `setSelectedSeat` re-resolve the dock without new camera ids.
4. Closed hierarchy + `HERO_WIDE` does **not** force a seat dock (world baseline).

## Forbidden

- Reintroducing `TURN_FOLLOW` or `HERO_LOW_ORBIT` ids, UI, or turn-loop calls
- Second camera system / second WebGL root
- Durable backend or entitlement claims

## Proof

- Unit: `tests/hero-cam-r1-subject-lock.test.mjs`
- Existing: Cam-5/6 + V0.3 subject-lock regression suites
- Static: retired cameras still absent

## Related

- `public/hero-cam5-selected-tree-center.js`
- `scripts/apply-cam2-tree-follow-flex.mjs`
- Archive: `docs/archive/superseded/TURN_FOLLOW.md`
