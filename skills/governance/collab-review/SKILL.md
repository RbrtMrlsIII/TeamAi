# Collab Review Skill

## WHEN TO USE
Use for independent TeamAi PR review, project-wide health review, documentation/governance review, or when a session is assigned the reviewer/collab-review role. Use when a review must transfer across sessions.

## INPUT
PR number or project scope, exact head SHA for PR reviews, claimed proof target, required checks, and owning Issue if any.

## AUTHORITY
This Skill is **procedural only**. It has no Product Law, permission, identity, entitlement, scheduler, commerce, durable-state, or merge authority.

`Product_Law/PRODUCT_LAW.md` → `Masterplan/MASTERPLAN.md` → `Masterplan/NEXT_SLICES.md` → `POLICY.md / ORUCAVEAM` → `docs/SKILL_WIRING.md` → this Skill and other applicable Skills.

A green CI run is evidence, not endorsement. An APPROVE is not a merge.

## ALWAYS LOAD
1. ORUCAVEAM (`skills/execution/orucaveam/**`).
2. `skills/governance/repository-synchronization/SKILL.md`.
3. `skills/governance/masterplan-skill-wiring/SKILL.md`.
4. `skills/governance/user-directed-validation/SKILL.md` when tests or validators change.
5. `AI_ASSISTANT_READ_ME.md` as the session surface (not a Skill).

## LOAD BY DIFF CLASS
- Product Law / policy / wiring → `product-law-change`
- Session / handover surfaces → `learning-handover`
- Skill add/delete/reroute → `masterplan-skill-wiring`
- Authority / platform map → `authority-contract`
- Frontend Hero / camera / hierarchy → applicable `skills/frontend/spatial/**`
- Machine Hero candidate → `machine-builder` + spatial companions
- Backend / commerce / edge → matching `skills/backend/**`
- Browser-visible claim → `skills/verification/browser-smoke`

Do not load the full spatial tree for governance-only reviews.

## ACTION — PR review
1. Pin the exact head SHA. Read files on that ref; do not rely on default-branch search alone.
2. Compare the PR proof target to the actual diff.
3. Check authority boundaries. Presentation must not claim delivery or durable-state authority.
4. Hunt active residuals (deleted Skill still wired, live enum, policy still routing).
5. Read check runs on that head. Distinguish required gates from optional noise.
6. If validators changed, require validation-change discipline (old invariant → new invariant).
7. Issue a verdict on that SHA only — APPROVE, COMMENT, or REQUEST_CHANGES.
8. Use a non-author account when repository policy requires independent approval.
9. Do not merge unless the user explicitly orders merge and policy allows.

## ACTION — project-wide review
1. Read Product Law path, Masterplan, single Current Slice, and AI_ASSISTANT_READ_ME.
2. List open programs and whether active documents match merged reality.
3. Flag stale Current Slice or session anchors as synchronization defects.
4. Separate governance complete from product complete (029, backend proof, Machine Hero promotion).
5. Recommend one next spine action. Do not create a second checklist file.

## DO NOT
- Approve only because approval was requested.
- Self-approve as author when policy requires non-author.
- Treat a screenshot or optional green check as domain proof.
- Rewrite historical archives to match current preference.
- Create a parallel Masterplan or review checklist document.
- Promote Machine Hero or claim 029-released from a review.

## PASS
Proof target matches the diff, residuals are dispositioned or parked with reason, required checks are understood, the verdict is recorded on the exact head, and known stale active truth is named rather than ignored.

## EVIDENCE
PR review body or issue comment with head SHA, checks summary, residuals, and verdict. Update `AI_ASSISTANT_READ_ME.md` only when that surface is in the authorized change scope.

## CROSS-SESSION TRANSFER
Canonical path after merge: `skills/governance/collab-review/SKILL.md`. New sessions open this Skill first for review work.

## SEE ALSO
- `docs/SKILL_WIRING.md`
- `skills/execution/orucaveam/SKILL.md`
- `skills/governance/repository-synchronization/SKILL.md`
- `skills/governance/pr-squash-merge/SKILL.md`
- `AI_ASSISTANT_READ_ME.md`
