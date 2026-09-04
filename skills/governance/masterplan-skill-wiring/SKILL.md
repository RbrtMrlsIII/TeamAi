# Masterplan Skill-Wiring Skill

## WHEN TO USE
Use whenever `MASTERPLAN.md` gains, changes, completes, reopens, or reorganizes an executable checklist item.

## INPUT
Target Masterplan section/item, governing Product Law concept, field/domain, phase, current implementation state, applicable tools/services, ORUCAVEAM letters, and verification target.

## AUTHORITY
`MASTERPLAN.md` plans execution under `PRODUCT_LAW.md`. `docs/SKILL_WIRING.md` is the routing map. `POLICY.md` defines ORUCAVEAM execution discipline. A skill cannot authorize a plan change.

## ACTION
1. Locate the governing Product Law concept.
2. Preserve the existing checklist logic; do not create duplicate checklist items.
3. Classify the item by field/domain and affected authority.
4. Determine the ORUCAVEAM letters applicable to the item.
5. Find existing skills that are sufficient for those letters and the field/domain.
6. If a required bounded procedure has no sufficient skill, record the skill gap and propose/create the smallest reusable skill before execution where practical.
7. Add each concrete skill path to `docs/SKILL_WIRING.md`.
8. Identify the tool/system and verification method.
9. Mark completion only after the stated evidence exists and the wiring remains valid.

## DO NOT
- Use `skills/README.md` or a skill-library index as the TeamAi wiring substitute.
- Treat an entire field folder as sufficient routing without a concrete skill.
- Mark a checklist complete because source code or deployment exists.
- Hide missing procedure coverage by writing an ad-hoc checklist note.
- Create a taxonomy-only skill that has no recurring bounded use.

## PASS
Every executable item has an unambiguous canonical concept, applicable ORUCAVEAM letter skill(s), concrete field/domain/tool skill path(s), and verification/evidence boundary, or an explicit no-skill rationale.

## EVIDENCE
Masterplan item, ORUCAVEAM letter routing, wiring-map row, concrete skill path(s), verification result, and continuation record.

## SEE ALSO
- `PRODUCT_LAW.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `skills/execution/orucaveam/SKILL.md`
