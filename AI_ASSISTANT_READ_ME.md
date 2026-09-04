# TeamAi — AI Assistant Read Me

This is the operational recovery and continuation entry point for AI Development Team agents working on TeamAi.

## Authority and navigation order

1. `PRODUCT_LAW.md` — canonical product/architecture authority.
2. `MASTERPLAN.md` — chronological plan, checklist, dependencies, and gates.
3. `POLICY.md` — execution constitution and ORUCAVEAM discipline.
4. `docs/SKILL_WIRING.md` — end-to-end concept → checklist → skill → tool → verification map.
5. `skills/**/SKILL.md` — direct operational procedures for the current work class.
6. `PRODUCT-KNOWLEDGE.md` — validated and distilled lessons; read relevant Anti-Patterns/evidence before repeating work.
7. `docs/project-guide/HandOver.md` — durable continuation and learning handoff.
8. `docs/project-guide/Endorsement.md` — authorized completion and learning acceptance.
9. Domain contracts, implementation, verification evidence, and historical records.

Do not reconstruct current authority from chat memory when the repository contains the authority.

## Before any meaningful action

`inspect Product Law → inspect Masterplan → inspect Policy/ORUCAVEAM → resolve applicable skill set → inspect existing roots/implementation → check known anti-patterns → classify impact → confirm permission → implement smallest canonical change → verify → record evidence → handover/endorsement → update knowledge when learned`

## Product Law change rule

When the user adds or changes a feature, read the existing `PRODUCT_LAW.md` logic first. Amend the existing canonical concept when applicable instead of appending a duplicate. Inspect affected consumers and skills. Warn the user before proceeding when the request introduces a discrepancy with an existing protected root or canonical rule.

Use `skills/governance/product-law-change/SKILL.md`.

## Masterplan and skill wiring

Every executable Masterplan checklist item must resolve through `docs/SKILL_WIRING.md` to an applicable skill or an explicit no-skill rationale. `skills/README.md` explains the skill library; it is not the wiring authority.

Use `skills/governance/masterplan-skill-wiring/SKILL.md`.

## Execution discipline

The outer lifecycle remains:

`Observe → Record → Understand → Classify → Align → Validate → Endorse → Advance`

The inner action lens is ORUCAVEAM:

`Objective → Restrictions → User Authority → Canonical Authority → Action → Verification → Efficiency → Audit → Minimalistic Tool/Resource Use`

Use `skills/execution/orucaveam/SKILL.md` for meaningful actions.

## Learning and teach-back

When an agent discovers a better, safer, clearer, more accurate, or more efficient approach, do not bury it in chat. Tie it to the executed checklist and evidence, capture it in `HandOver.md`, obtain the appropriate endorsement, then update the affected skill and/or this file. Promote to `PRODUCT-KNOWLEDGE.md` only when validated. Propose a ToolKit upstream lesson only after generalization is demonstrated.

Use `skills/governance/learning-handover/SKILL.md`.

## Canonical service boundaries

- Firebase Auth = identity / Firebase UID ownership.
- Firestore `(default)` = TeamAi durable application/domain state.
- Supabase Edge Functions = trusted server execution and PayPal webhook receiver.
- PayPal = external payment-provider event authority.
- GitHub = engineering/source authority.
- Firebase Hosting = current TeamAi web delivery authority.
- Vercel = controlled web development, preview, and browser-verification surface; not TeamAi source, domain-state, backend, commerce, or scheduler authority.

The authoritative Firebase project is `team-ai-official`.

## Browser verification

When a real browser is required, use deterministic Playwright verification. Do not invent UI selectors for UI that does not yet exist. A browser pass proves only the exercised scope. Generated screenshots are not canonical evidence.

Use `skills/verification/browser-smoke/SKILL.md`.

## Packaging

The Full Project ZIP is a derived project-state package. It must be produced from a pinned canonical repository tree and verified by extracted-path and file-byte/hash equality. It never becomes a second source authority.

Use `skills/packaging/project-package/SKILL.md`.

## Recovery rule

Preserve current authority, unresolved limitations, and next authorized action across sessions. A previous green deployment or AI answer is not proof of current correctness. Distinguish planned, implemented, verified, runtime-proven, completed, and generalized states.
