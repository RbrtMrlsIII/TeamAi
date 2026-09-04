# ORUCAVEAM Execution Skill

## WHEN TO USE
Use for any meaningful TeamAi action where the agent must decide what to change, which authority/tool to use, how much work to perform, and what evidence is required.

## INPUT
User objective, current Product Law, current Masterplan item, relevant Policy, skill set, tools/services, permissions, and verification target.

## ACTION LENS
Apply:

**O — Objective:** state the exact outcome.

**R — Restrictions:** identify protected roots, forbidden actions, scope limits, security/privacy constraints, and known blockers.

**U — User Authority:** confirm the instruction or approval that permits the bounded action.

**C — Canonical Authority:** identify which existing document/service owns the meaning or durable state.

**A — Action:** choose the smallest canonical operation that advances the objective.

**V — Verification:** define the evidence needed to prove the claimed scope.

**E — Efficiency:** avoid unnecessary edits, reads, writes, deployments, browser runs, context transfers, or external calls.

**A — Audit:** preserve enough trace for another agent to understand and reproduce the action.

**M — Minimalistic Tool/Resource Use:** use the minimum sufficient authoritative tool/resource operations; never trade away required verification merely to save a call.

## DO NOT
- Treat the previous AI response as authority.
- Substitute a non-authoritative service merely because it is easier or cheaper.
- Skip verification because the source change looks obvious.
- Trigger unnecessary external deployments or broad reads.
- Turn tool output into product law.

## PASS
The action is permissioned, uses the owning canonical root, is minimally scoped, and has a defined verification/evidence path.

## EVIDENCE
Record the action, authority, affected paths/systems, verification, limitations, and next authorized state.

## SEE ALSO
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
