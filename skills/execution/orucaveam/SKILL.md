# ORUCAVEAM Execution Skill

## WHEN TO USE
Use for any meaningful TeamAi action where the agent must determine the objective, restrictions, authority, action, verification, efficiency, audit trace, and minimal sufficient resource/tool usage.

## INPUT
Current user instruction/approval, applicable Product Law concept, Masterplan checklist item, Policy, field/domain, tools/services, permissions, verification target, and known evidence/anti-patterns.

## AUTHORITY
`PRODUCT_LAW.md` is product authority. `MASTERPLAN.md` is execution-plan authority. `POLICY.md` is execution-discipline authority. This skill does not grant permission or redefine any of them.

## ACTION
Apply the single ORUCAVEAM discipline:

**O — Objective** → `skills/execution/orucaveam/objective/SKILL.md`

**R — Restrictions** → `skills/execution/orucaveam/restrictions/SKILL.md`

**U — User Authority** → `skills/execution/orucaveam/user-authority/SKILL.md`

**C — Canonical Authority** → `skills/execution/orucaveam/canonical-authority/SKILL.md`

**A — Action** → `skills/execution/orucaveam/action/SKILL.md`

**V — Verification** → `skills/execution/orucaveam/verification/SKILL.md`

**E — Efficiency** → `skills/execution/orucaveam/efficiency/SKILL.md`

**A — Audit** → `skills/execution/orucaveam/audit/SKILL.md`

**M — Minimalistic Efficiency / Resource Use** → `skills/tools/minimal-tool-usage/SKILL.md`

Compose the required ORUCAVEAM skills with the smallest sufficient field/domain and tool/system skills for the Masterplan item.

When the task is spatial/UI, resolve `skills/frontend/spatial/UI_UX-Promax-Skill.md` after C. F0–F7 is field identity only; legal boxes remain Shell · Panel · Card · Control · Navigation.

## DO NOT
- Treat ORUCAVEAM as a second authority.
- Create a second ORUCAVEA/ORUCAVEAM lifecycle.
- Treat the previous AI response as authority.
- Assume every letter needs the same depth for every task; resolve only the applicable skills.
- Skip a field-specific skill merely because ORUCAVEAM is present.
- Skip required verification or evidence in the name of efficiency.
- Treat F6 Status or F7 Modal as new legal boxes.

## PASS
The action has a clear objective, bounded restrictions, explicit authority, identified canonical owner, direct action skill(s), verification path, audit trace, and minimal sufficient resource/tool plan.

## EVIDENCE
Record the applicable ORUCAVEAM letters, selected skill paths, affected canonical paths/systems, tools/resources used, verification, limitations, and next authorized state.

## SEE ALSO
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `skills/governance/masterplan-skill-wiring/SKILL.md`
- `skills/tools/minimal-tool-usage/SKILL.md`
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
