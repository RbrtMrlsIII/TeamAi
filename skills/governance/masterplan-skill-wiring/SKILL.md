# Masterplan Skill-Wiring Skill

## WHEN TO USE
Use whenever `MASTERPLAN.md` gains, changes, completes, reopens, or reorganizes an executable checklist item.

## INPUT
Target Masterplan section/item, Product Law concept, field/domain, phase, current implementation state, applicable tools/services, verification target.

## AUTHORITY
`MASTERPLAN.md` plans execution under `PRODUCT_LAW.md`. `docs/SKILL_WIRING.md` is the routing map. A skill cannot authorize a plan change.

## ACTION
1. Locate the governing Product Law concept.
2. Preserve the existing checklist logic; do not create duplicate checklist items.
3. Classify the item by field/domain and affected authority.
4. Find an existing skill that is sufficient.
5. If none is sufficient, record a skill gap and propose/create a bounded skill before execution where practical.
6. Add the complete skill path to `docs/SKILL_WIRING.md`.
7. Identify the tool/system and verification method.
8. Mark completion only after the stated evidence exists.

## DO NOT
- Use `skills/SKILLS_INDEX.md` from another repository as a wiring substitute.
- Mark a checklist complete because source code or deployment exists.
- Hide missing procedure coverage by writing an ad-hoc checklist note.

## PASS
Every executable item has an unambiguous skill path or an explicit no-skill rationale, with tool and verification boundaries understood.

## EVIDENCE
Masterplan item, wiring-map row, skill path, verification result, and continuation record.

## SEE ALSO
- `PRODUCT_LAW.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
