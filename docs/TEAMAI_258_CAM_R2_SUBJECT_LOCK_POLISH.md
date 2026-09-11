# CAM-R2 — Subject-lock continuity polish

**Status:** IMPLEMENTATION (presentation only) · **no 029-released claim**  
**Depends on:** CAM-R1 · PR #262 merged  
**Does not revive:** `TURN_FOLLOW` / `HERO_LOW_ORBIT`

## Intent

1. `getSubjectLockSnapshot()` reports whether subject-lock is active and which seat is framed.
2. After `setSelectedSeat` / shell-open, dock target matches that seat (Cam-5/6).
3. World baseline (`HERO_WIDE` + closed shell) remains unlocked.

## Proof

`tests/hero-cam-r2-subject-lock-polish.test.mjs`
