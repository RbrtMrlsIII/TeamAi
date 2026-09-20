# NEXT SLICES — current slice

**Role:** exactly one current execution frontier. Historical queues do not belong here.

## Current Slice

FRONTEND — TEAM-EXPERIENCE-029 mechanical R1/R2 world rings (Issue #396, Draft PR #398)

## Status

IN PROGRESS — Draft PR #398 is the active non-production implementation vehicle on `frontend/029-machine-world-convergence`. This slice does not claim 029 release, C8/C9/C10 completion, or TEAM-BACKEND-001 completion.

## Objective

Current governing program: TEAM-EXPERIENCE-029 progression. PR #395 merged the #394/#393 baseline into `main` at `d8b1e767898be9fe640f002d72cf7771842865b6`. The current frontier is the first open 029 machine-world Next row: mechanical R1 backend-display presentation and mechanical R2 setup/config presentation, with the renderer remaining presentation-only.

Preserve the already-migrated machine-world architecture on Draft PR #398:

- `public/hero-flex.js` remains the controller/input/hierarchy boundary
- `frontend/spatial/machine-world-renderer.js` remains the authoritative production WebGL source
- `public/machine-world-renderer.js` remains its synchronized browser copy
- Guest entrance/machine boundary, 1–10 Seat capacity, and Tree 1–8 vocabulary stay distinct
- Product Law §15 remains unchanged and authoritative

## Dependencies

- Product_Law/PRODUCT_LAW.md
- Product_Law/WIRING.md
- Product_Law/FRONTEND_EXPERIENCE.md
- Masterplan/MASTERPLAN.md
- POLICY.md
- docs/SKILL_WIRING.md
- docs/TEAMAI_3D_HERO_R1_R2_READINESS.md
- docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md
- skills/governance/repository-synchronization/SKILL.md
- skills/governance/machine-builder/SKILL.md
- skills/frontend/spatial/workspace-ring/SKILL.md
- skills/frontend/spatial/hierarchy-runtime/SKILL.md
- AI_ASSISTANT_READ_ME.md
- Issue #396
- Draft PR #398
- Merged #394 / #393 implementation: PR #395 / `d8b1e767898be9fe640f002d72cf7771842865b6`
- Reconstruction baseline: #391 / `867944b03776f47fb01bd2cddf90ed4c70ab3b68`
- Parallel owners: #278, #360, #392, #83, #204, #284
- Enduring governance contract: #133

## Verification

- current-slice pointer no longer names #394 as the live frontier
- Draft PR #398 remains Draft and non-production
- R1 backend-display and R2 setup/config stay presentation-only
- no canvas OAuth, Firestore write, entitlement, scheduler, or durable-auth authority
- 1–10 Seat capacity remains distinct from Tree 1–8
- Product Law §15 is unchanged
- no 029 release, C8/C9/C10, or TEAM-BACKEND-001 completion claim
- existing product/runtime tests remain governed; no validator is weakened
- browser/runtime evidence for this slice is exact-head scoped to Draft PR #398

## Current slice boundary

Issue #396 / Draft PR #398 own only the TEAM-EXPERIENCE-029 mechanical R1/R2 world-ring presentation increment. This slice does not absorb #278, #360, #284, #204, #83, or #392. Later #396 frontiers (complete Seat branches, full semantic topology, electricity choreography, authenticated world boundary) remain later work. Merged #394/#393 records stay historical provenance.

## Current blocker

Draft PR #398 currently has failing Project tests + canonical package and Playwright browser verification on head `f79b8016a80461162d3f7fb8234c285235c01163`. The next implementation session must inspect those exact-head failures before adding R1/R2 presentation, and must not weaken validators to obtain green CI.
