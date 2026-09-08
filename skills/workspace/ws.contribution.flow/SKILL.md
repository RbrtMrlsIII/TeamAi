# WORKSPACE_SKILL — ws.contribution.flow

**Kind:** `WORKSPACE_SKILLS` · `ws.contribution.flow`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW

## WHEN TO USE

Use when contributing code or docs to a TeamAi-governed repository under this workplace’s source rules.

## INPUT

- Repository permissions of the human / connection
- Current branch policy and required checks
- Product Law / Masterplan constraints for the change class

## AUTHORITY

Defines **project contribution procedure**. Does not grant GitHub rights or merge authority.

## ACTION

1. Prefer: working branch → commit → pull request → verification → review → authorized merge → `main`.
2. Do not push experimental work straight to `main` unless an explicit human policy exception exists.
3. PR description must state boundaries (presentation only, no 029-released claim, R-table when hierarchy work).
4. Green CI is necessary but not sufficient for Product Law endorsement.
5. Main Integration / Team Lead may recommend readiness; may not bypass required review or human approval.

## DO NOT

- Do not treat branch name as authorization.
- Do not merge on green alone when Product Law gates are unmet.
- Do not put secrets in commits or PR bodies.

## PASS

Change reached `main` only through the agreed flow with verification and authorized merge.

## SEE ALSO

- `PRODUCT_LAW.md` Family E (contribution flow)
- `docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md`
