# CAM-R3 — Subject-lock browser proof

**Status:** IMPLEMENTATION (presentation only) · **no 029-released claim**  
**Depends on:** CAM-R1 (#262) · CAM-R2 (#263)  
**Does not revive:** `TURN_FOLLOW` / `HERO_LOW_ORBIT`

## Intent

1. `TeamAiHero.getSubjectLockSnapshot` exists in the loaded runtime.
2. Selecting **Seat** activates subject-lock (`SEAT_CLOSE`).
3. Changing selected seat updates snapshot `selectedSeat`.
4. **Wide** returns to unlocked world baseline when hierarchy is closed.

## Proof

`tests/e2e/hero-cam-r3-subject-lock.spec.ts`
