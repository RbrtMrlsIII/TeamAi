# Checkpoint — TEAM-EXPERIENCE-029 P-R0 WORKSPACE_ZIPSKILLS crown

**Date:** 2026-09-09  
**Slice:** P-R0 — optional ZipSkills crown branch on **workspace tree** (R0)  
**Evidence:** IMPLEMENTED (runtime + hero-flex + skill + tests) · **no 029-released claim**

## Wiring
- `ZIPSKILLS_BRANCH_MS` (300) in runtime + baseline §9
- `tickZipskillsBranch` / `getZipskillsBranchAmount` / `beginZipskillsBranch`
- Draw crown scales/lifts with branch when R0 focused
- Keyboard **z/x** cycle + **G** / Enter → `APP_UI_HANDOFF` (presentation only)
- Skill: `skills/frontend/spatial/workspace-zipskills/SKILL.md`

## Boundaries
Not a seat child · optional · not entitlement · not required setup  
`MECHANISM_ZIPSKILLS` remains legacy alias to same dock.

## Verify
```bash
node --test tests/hero-p-r0-workspace-zipskills-crown.test.mjs tests/hero-workspace-zipskills.test.mjs tests/hero-zipskills-alias.test.mjs
```

## Next
Owner visual endorsement · remaining #89 close-out · domain health leaf (F) when contract exists.
