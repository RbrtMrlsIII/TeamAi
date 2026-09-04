# Product Law Change Skill

## WHEN TO USE
Use before changing `PRODUCT_LAW.md` because a user has added, removed, or changed product behavior, architecture meaning, or a non-negotiable constraint.

## INPUT
Current user instruction, current `PRODUCT_LAW.md`, relevant `MASTERPLAN.md` section, related contract/policy/skill paths, and known evidence/anti-patterns.

## AUTHORITY
`PRODUCT_LAW.md` is the product authority. User authority is above agent preference. `POLICY.md` governs execution but cannot silently redefine product meaning.

## ACTION
1. Apply the applicable ORUCAVEAM O/R/U/C checks before proposing the change.
2. Read the existing Product Law section related to the request.
3. Identify the existing canonical concept instead of creating a duplicate.
4. Inspect consumers and linked contracts/skills.
5. Check `PRODUCT-KNOWLEDGE.md` anti-patterns and relevant field/domain skills.
6. Identify discrepancies or incompatible consequences.
7. Warn the user before proceeding when the requested change conflicts with an existing law or protected root.
8. With permission, amend the existing canonical logic coherently.
9. Update the affected Masterplan item and exact skill wiring, including new/changed field skills when required.
10. Apply V/A/E/A/M as appropriate to verify, record, and minimize the change without weakening evidence.
11. Record any newly learned rule through the learning/handover path.

## DO NOT
- Append a duplicate rule merely because the wording is new.
- Replace Product Law with implementation details.
- Treat a skill, deployment, tool result, or previous AI output as authority.
- Hide a conflict by editing a lower-level document instead.
- Skip required downstream skill wiring after changing a canonical concept.

## PASS
The requested change is represented once in the correct Product Law concept, affected consumers are identified, relevant ORUCAVEAM and field/domain skills are resolved, and the plan/skill wiring remains consistent.

## EVIDENCE
Record the changed Product Law path, affected Masterplan item, ORUCAVEAM/field skill routing, verification, and handover/endorsement when applicable.

## SEE ALSO
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `skills/execution/orucaveam/SKILL.md`
- `skills/governance/masterplan-skill-wiring/SKILL.md`
