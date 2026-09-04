# TeamAi — End-to-End AI Development Journey: `Endorsement → PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → system/tool execution → verification → evidence → HandOver → Endorsement → PRODUCT-KNOWLEDGE.md → repeat`

This is the operational recovery and continuation entry point for AI Development Team agents working on TeamAi.

## Authority and navigation order

1. `PRODUCT_LAW.md` — canonical product/architecture authority.
2. `MASTERPLAN.md` — chronological plan, checklist, dependencies, and gates.
3. `POLICY.md` — execution constitution and single ORUCAVEAM discipline.
4. `docs/SKILL_WIRING.md` — end-to-end concept → checklist → ORUCAVEAM → field/domain skill → tool → verification map.
5. `skills/**/SKILL.md` — direct operational procedures for the current work class.
6. `PRODUCT-KNOWLEDGE.md` — validated and distilled lessons; read relevant anti-patterns/evidence before repeating work.
7. `docs/project-guide/HandOver.md` — durable continuation and learning handoff.
8. `docs/project-guide/Endorsement.md` — authorized completion and learning acceptance.
9. Domain contracts, implementation, verification evidence, and historical records.

The end-to-end journey is cyclic. An endorsed result becomes the next reliable recovery point: `Endorsement → PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → system/tool execution → verification → evidence → HandOver → Endorsement → PRODUCT-KNOWLEDGE.md → repeat`.

Do not reconstruct current authority from chat memory when the repository contains the authority.

## Before any meaningful action

`inspect Product Law → inspect Masterplan → inspect Policy/ORUCAVEAM → resolve applicable ORUCAVEAM skill set → resolve field/domain skills → inspect existing roots/implementation → check known anti-patterns → classify impact → confirm permission → implement smallest canonical change → verify → record evidence → handover/endorsement → update knowledge when learned`

## Product Law change rule

When the user adds or changes a feature, read the existing `PRODUCT_LAW.md` logic first. Amend the existing canonical concept when applicable instead of appending a duplicate. Inspect affected consumers and skills. Warn the user before proceeding when the request introduces a discrepancy with an existing protected root, canonical rule, contract, permission boundary, or authority.

Use `skills/governance/product-law-change/SKILL.md` together with the applicable ORUCAVEAM skills.

## Masterplan and skill wiring

Every executable Masterplan checklist item must resolve through `docs/SKILL_WIRING.md` to the applicable ORUCAVEAM letter skills plus relevant field/domain/tool skills, or an explicit no-skill rationale.

A checklist item is not fully wired merely because it names a domain. The concrete procedure must resolve to an existing direct skill, or the required skill must be proposed/updated before the item is considered executable.

Use `skills/governance/masterplan-skill-wiring/SKILL.md`.

## Execution discipline — ORUCAVEAM

ORUCAVEAM is the single execution-discipline framework. It is an integrated sequence containing **M — Minimalistic Efficiency / Resource Use** as its final dimension. There is no separate O-R-U-C-A-V-E-A lifecycle or secondary execution framework.

`O — Objective → R — Restrictions → U — User Authority → C — Canonical Authority → A — Action → V — Verification → E — Efficiency → A — Audit → M — Minimalistic Efficiency / Resource Use`

Each letter resolves to one or more small direct execution skills under `skills/execution/orucaveam/`, except **M**, which resolves to the existing reusable `skills/tools/minimal-tool-usage/SKILL.md` because that tool/resource procedure already provides the required bounded operation.

Use `skills/execution/orucaveam/SKILL.md` first, then resolve only the applicable letter and domain skills needed for the bounded action.

## Permission to proceed

A skill never creates permission. Permission comes from direct user authorization, an approved Masterplan item within scope, or a permitted policy-defined routine that remains inside its recorded scope. Changes to Product Law, protected canonical roots, destructive history, security/authorization boundaries, entitlement, or other high-impact architecture require the appropriate approval/reconciliation gate.

## Learning and teach-back

When an agent discovers a better, safer, clearer, more accurate, or more efficient approach, do not bury it in chat. Tie it to the executed checklist and evidence, capture it in `HandOver.md`, obtain the appropriate endorsement, then update the affected skill and/or this file. Promote to `PRODUCT-KNOWLEDGE.md` only when validated. Propose a ToolKit upstream lesson only after generalization is demonstrated.

An improved procedure belongs in the relevant skill when it is reusable and bounded. This file remains the practical recovery/memory layer and must not become a second policy or product authority.

Use `skills/governance/learning-handover/SKILL.md`.

## Canonical service boundaries

- Firebase Auth = identity / Firebase UID ownership.
- Firestore `(default)` = TeamAi durable application/domain state.
- Supabase Edge Functions = trusted server execution and PayPal webhook receiver.
- PayPal = external payment-provider event authority.
- GitHub = engineering/source authority.
- Firebase Hosting = current TeamAi web delivery authority.
- GitHub Pages = validation-only static browser surface; it may publish the canonical `frontend/spatial` UI for human/browser verification but is not a second TeamAi source, backend, commerce, scheduler, or production-web authority.
- Vercel = controlled web development, preview, and browser-verification surface; not TeamAi source, domain-state, backend, commerce, or scheduler authority.

The authoritative Firebase project is `team-ai-official`.

## GitHub branch and deployment guard

The default branch is protected by the repository ruleset and must not be bypassed. The development team must preserve the repository's PR-based progression and deployment gate.

For live browser validation, GitHub Pages is configured with **Source = GitHub Actions**. A dedicated Pages workflow may publish `frontend/spatial` under the project route `/spatial/` without moving or duplicating the canonical HTML. The intended publication shape is `dist/spatial/index.html`, preserving the existing application route.

When a protected/default-branch ruleset requires a successful deployment, do not disable or bypass the rule to make a change. Resolve the required Pages deployment through the normal PR/deployment path, then collect real deployment and browser evidence. Treat a ruleset that is marked Active but targets zero branches/resources as not effectively protecting the intended branch; ensure the intended target is configured.

A successful GitHub Pages deployment is deployment evidence only. It does not replace deterministic Playwright CI evidence, backend verification, or Product Law authority. Do not treat a prior green Pages deployment as proof of current correctness.

## Browser verification

When a real browser is required, use deterministic Playwright verification. For human validation, use the current GitHub Pages `/spatial/` deployment when available. Do not invent UI selectors for UI that does not yet exist. A browser pass proves only the exercised scope. Generated screenshots are not canonical evidence.

Use `skills/verification/browser-smoke/SKILL.md` and applicable ORUCAVEAM verification/audit skills.

## Packaging

The Full Project ZIP is a derived project-state package. It must be produced from a pinned canonical repository tree and verified by extracted-path and file-byte/hash equality. It never becomes a second source authority.

Use `skills/packaging/project-package/SKILL.md` with applicable ORUCAVEAM skills, especially verification, audit, efficiency, and M.

## Recovery rule

Preserve current authority, unresolved limitations, evidence boundaries, and next authorized action across sessions. A previous green deployment or AI answer is not proof of current correctness. Distinguish planned, implemented, verified, runtime-proven, completed, and generalized states.
