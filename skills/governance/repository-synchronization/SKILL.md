# Repository Synchronization Skill

## WHEN TO USE
Use before and during any substantive TeamAi change that can affect current state, execution order, skills, verification, workflows, or active repository structure.

## INPUT
Changed paths, governing Product Law concept, Masterplan parent, owning Issue, current PR state, verification scope, and affected canonical documents.

## AUTHORITY
`PRODUCT_LAW.md` → `MASTERPLAN.md` → `POLICY.md / ORUCAVEAM` → `docs/SKILL_WIRING.md` → this Skill and other applicable Skills.

## ACTION
1. Classify every changed path.
2. Identify the canonical document that owns the meaning or chronology.
3. Update affected active documents in the same substantive PR.
4. Keep `NEXT_SLICES.md` to one current frontier.
5. Keep `AI_ASSISTANT_READ_ME.md` current for the session.
6. Keep `PRODUCT-KNOWLEDGE.md` free of live-session context.
7. Move retired operating documents to `docs/archive/` and preserve historical content.
8. Run `build-system/scripts/repository-canonical-governance-audit.py`.
9. Run the required field/domain verification and record evidence.

## DO NOT
- Create another project roadmap, current-state index, handover manual, or governance constitution.
- Create or revive `OBSOLETE_FILES.md`.
- Rewrite immutable historical evidence to match current state.
- Treat a Skill as permission.
- Change a validator merely to obtain green CI.
- Use auto-merge for substantive product changes.
- Treat one slice as requiring one PR or one merge.

## PASS
All required active documents exist, forbidden duplicate operating documents are absent, the active frontier is singular, same-PR reconciliation rules are satisfied, and the governance audit passes.

## EVIDENCE
Record the exact PR/commit, changed paths, verification results, limitations, and current state in `AI_ASSISTANT_READ_ME.md` or the owning evidence record.

## SEE ALSO
- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `AI_ASSISTANT_READ_ME.md`
- `PRODUCT-KNOWLEDGE.md`
- `docs/archive/`
