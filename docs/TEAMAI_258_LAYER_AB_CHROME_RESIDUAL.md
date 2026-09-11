# #258 residual — Layer A/B legibility + machine chrome consolidation

**Status:** MERGED baseline via PR **#259** — current implementation truth until deliberately superseded.  
**Date:** 2026-09-11  
**Authority:** VISION §1 · §3 · ENTRANCE_IA · V3.4 handoff · Issue #258  
**Scope:** Presentation only. No second WebGL. No backend/domain authority change. **No 029-released claim.**

## Acceptance (ENT-R1)

| Layer | User must perceive | Entrance-primary | Machine-primary |
|-------|--------------------|------------------|-----------------|
| **A — Entrance** | Branded web face; Hero backdrop | Brand/lede, Open engine / get-started | Not a wall of seat chips |
| **B — Machine** | Inside the instrument | Brand **retired**; get-started demoted | **One** parts/trees dropdown + settings beside it |

## Delivered in #259

- **ENT-T1 / ENT-R2:** entrance brand/copy gone on `data-hero-layer="machine"` (not merely blurred).
- **ENT-R3:** Return to entrance control present.
- **CHR-R1/R2:** soft-hide legacy seat-stack modules on machine UI; machine-nav retained.
- **CAM-R-RETIRE:** `HERO_LOW_ORBIT` and `TURN_FOLLOW` removed from UI, action map, and runtime existence; residual calls map to `HERO_WIDE`.

## CAM-R1 — subject-lock (implementation)

**Status:** implementation PR · presentation only · post-#259 baseline

- Turn-loop next FOCUS → `setCamera('SEAT_CLOSE')` (subject-lock toward `selectedSeat`)
- `retargetSubjectLock` / `setSelectedSeat` re-resolve dock without new camera ids
- Apply: `scripts/apply-cam-r1-subject-lock.mjs` (after cam2 flex apply)
- Contract: `docs/TEAMAI_258_CAM_R1_SUBJECT_LOCK.md`
- Still **not** `TURN_FOLLOW` / `HERO_LOW_ORBIT` (archive only)

## Forbidden

- Second canvas / second theme root / second settings island
- Stealing `data-hero-machine-ui` ownership from hierarchy absorption
- 029-released claim
- Resurrecting archived camera ids

## Later on #258

CAM-R2/R3 subject-lock polish · CHR-R3–R6 · ENT-T3–T5 / Playwright entrance path

## Governance

Spatial `public/` change requires sync of `MASTERPLAN.md`, `docs/TEAMAI_029_CURRENT_STATE_MAP.md`, `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`.

Load `skills/governance/active-index-coupling/SKILL.md` before spatial PRs.

Archive: `docs/archive/superseded/INDEX.md` · Protocol: `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md`
