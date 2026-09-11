# #258 residual — Layer A/B legibility + machine chrome consolidation

**Status:** MERGED baseline via PR **#259** (`4b9a74d`) — current implementation truth until deliberately superseded.  
**Scope:** Presentation only. No second WebGL. No backend/domain authority change. **No 029-released claim.**

## Delivered in #259

- **ENT-T1 / ENT-R2:** entrance brand/copy gone on `data-hero-layer="machine"` (not merely blurred).
- **ENT-R3:** Return to entrance control present.
- **CHR-R1/R2:** soft-hide legacy seat-stack modules on machine UI; machine-nav retained.
- **CAM-R-RETIRE:** `HERO_LOW_ORBIT` and `TURN_FOLLOW` removed from UI, action map, and runtime existence; residual calls map to `HERO_WIDE`.

## CAM-R1 — subject-lock (this slice)

**Status:** in implementation PR · presentation only

- Turn-loop next FOCUS → `setCamera('SEAT_CLOSE')` (subject-lock toward `selectedSeat`)
- `retargetSubjectLock` / `setSelectedSeat` re-resolve dock without new camera ids
- Contract: `docs/TEAMAI_258_CAM_R1_SUBJECT_LOCK.md`
- Apply: `scripts/apply-cam-r1-subject-lock.mjs` (after cam2 flex apply)
- Still **not** `TURN_FOLLOW` / `HERO_LOW_ORBIT`

## Archive redirects (post-merge #259)

- `HERO_LOW_ORBIT` → `docs/archive/superseded/HERO_LOW_ORBIT.md`
- `TURN_FOLLOW` → `docs/archive/superseded/TURN_FOLLOW.md`
- Protocol → `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md`

## Still open (authorized residuals only)

- CAM-R2/R3 polish / browser proof of subject-lock
- ENT-T3–T5 where product authorizes further entrance/machine polish
- Owner visual endorsement when environment is fair
