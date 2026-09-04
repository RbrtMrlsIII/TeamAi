# Product Law Change Skill

## WHEN TO USE
Use before changing `PRODUCT_LAW.md` because a user has added, removed, or changed product behavior, architecture meaning, or a non-negotiable constraint.

## INPUT
Current user instruction, current `PRODUCT_LAW.md`, relevant `MASTERPLAN.md` section, related contract/policy/skill paths.

## AUTHORITY
`PRODUCT_LAW.md` is the product authority. User authority is above agent preference. `POLICY.md` governs execution but cannot silently redefine product meaning.

## ACTION
1. Read the existing Product Law section related to the request.
2. Identify the existing canonical concept instead of creating a duplicate.
3. Inspect consumers and linked contracts/skills.
4. Check `PRODUCT-KNOWLEDGE.md` Anti-Patterns and relevant skills.
5. Identify discrepancies or incompatible consequences.
6. Warn the user before proceeding when the requested change conflicts with an existing law or protected root.
7. With permission, amend the existing canonical logic coherently.
8. Update the affected Masterplan item and skill wiring.
9. Record any newly learned rule through the learning/handover path.

## DO NOT
- Append a duplicate rule merely because the wording is new.
- Replace Product Law with implementation details.
- Treat a skill, deployment, or previous AI output as authority.
- Hide a conflict by editing a lower-level document instead.

## PASS
The requested change is represented once in the correct Product Law concept, affected consumers are identified, and the plan/skill wiring remains consistent.

## EVIDENCE
Record the changed Product Law path, affected Masterplan item, skill wiring, verification, and handover/endorsement when applicable.

## SEE ALSO
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `skills/governance/masterplan-skill-wiring/SKILL.md`
