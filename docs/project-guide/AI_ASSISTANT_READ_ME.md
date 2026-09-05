# TeamAi Project Guide — AI Assistant Entry Point

**Status:** OPERATIONAL ENTRY GUIDE / BASELINE

This file is the project-guide companion to the root `AI_ASSISTANT_READ_ME.md`. It does not replace the root authority chain.

## Start here

Read in this order:

1. `README.md`
2. `PRODUCT_LAW.md`
3. `MASTERPLAN.md`
4. `POLICY.md`
5. `docs/SKILL_WIRING.md`
6. `/AI_ASSISTANT_READ_ME.md`
7. `docs/TEAMAI_CURRENT_STATE.md`
8. the applicable phase/domain contract
9. the applicable skill/guard before changing code or canonical documents
10. the applicable implementation/verification/evidence records
11. `docs/project-guide/HandOver.md` and `docs/project-guide/Endorsement.md` when completing or transferring work

## Current phase

`TEAM-EXPERIENCE-029 — FRONTEND CATCH-UP / RECONCILIATION + POLISH`

`TEAM-BACKEND-001` remains **IN IMPLEMENTATION / intentionally slowed** at its remaining external/live evidence and completion frontier. The repository is not waiting for a nonexistent frontend: the 029 spatial UI is materially inhabited and is now being reconciled, polished, and prepared for a separately authorized live integration boundary.

## Non-negotiable working rules

- Human user authority is above AI authority.
- A previous AI response is not a replacement for the user's instruction.
- Planning discussion is not authorization.
- Documentation is not proof of implementation.
- Deployment is not proof of runtime correctness.
- One provider must not become the global scheduler.
- UI must not become an alternative authority for backend/domain state.
- TeamAi subscription concepts must not be mistaken for provider subscriptions.
- MCP/tool availability must not be mistaken for authorization.
- ToolKit is upstream-only and does not own TeamAi state.
- Vercel is currently paused. Do not resume Vercel project, deployment, preview, or browser-verification activity without explicit user approval in the active execution context. The canonical rule is `docs/UI_BROWSER_INTEGRITY_VERIFICATION_POLICY.md`.
- GitHub Actions + Playwright and approved local/browser paths remain valid verification routes while Vercel is paused.
- The Full Project ZIP is a first-class project-state package, not an optional add-on; it must follow `docs/PROJECT_ZIP_AND_ARTIFACT_POLICY.md`.

## Execution discipline — ORUCAVEAM

ORUCAVEAM is the single execution-discipline framework. It is an integrated sequence containing **M — Minimalistic Efficiency / Resource Use** as its final dimension. There is no separate O-R-U-C-A-V-E-A lifecycle or secondary execution framework.

`Objective → Restrictions → User Authority → Canonical Authority → Action → Verification → Efficiency → Audit → Minimalistic Efficiency / Resource Use`

Use `docs/SKILL_WIRING.md` to select the applicable ORUCAVEAM letter and field/domain skill; then use `skills/**/SKILL.md` for the direct procedure.

## Product Law change

When the user adds or changes a feature, inspect the existing Product Law logic first. Amend the existing canonical concept when applicable instead of appending a duplicate. Warn the user before proceeding when the requested change creates a discrepancy with an existing protected root or canonical rule.

Use `skills/governance/product-law-change/SKILL.md` together with the applicable ORUCAVEAM skills.

## Learning and teach-back

When an AI Development Team agent discovers a better, safer, clearer, more accurate, or more efficient method, record it with execution evidence. Put the continuation/learning note in `docs/project-guide/HandOver.md`, obtain the applicable endorsement, then update the affected skill and/or `AI_ASSISTANT_READ_ME.md`. Promote to `PRODUCT-KNOWLEDGE.md` only when validated. Propose a ToolKit upstream lesson only after generalization is demonstrated.

Use `skills/governance/learning-handover/SKILL.md`.

## Controlled Vercel web verification

The complete rule is `docs/UI_BROWSER_INTEGRITY_VERIFICATION_POLICY.md`.

Vercel is currently paused. Do not resume it without explicit user approval. When/if that approval is given, Vercel may be used as a non-authoritative web development / preview / browser-verification surface for the exact exercised scope.

The browser result proves only the web behavior actually exercised. Backend, Firestore, PayPal, identity, entitlement, authorization, scheduler, deployment, and architecture evidence remain owned by their canonical authorities.

## Full Project ZIP and artifact discipline

The Full Project ZIP is the portable bulk-edit, handover, recovery, and transfer representation of the canonical GitHub project tree. It is derived from the pinned GitHub commit; it does not become a competing source authority.

The package must be flattened at the project root, preserve exact tracked file bytes and relative paths, and verify that the extracted tree matches the canonical tracked tree byte-for-byte.

Generated artifacts are not project source. Screenshots, browser captures, visual evidence images, preview output, build output, test/coverage output, logs, caches, local emulator state, deployment caches, editor state, and local secrets must not enter the package. Such verification artifacts may remain attached to the relevant GitHub Actions workflow run as evidence/reference, separate from the Full Project ZIP.

See `docs/PROJECT_ZIP_AND_ARTIFACT_POLICY.md`.

## Founder Pulse

Founder Pulse is a read-only operational observation layer over GitHub/GitLab Issue flow. Its observations are continuity/management evidence, not mutation authority or implementation proof. GitLab support in Founder Pulse does not place GitLab inside the current TeamAi architecture.

## Planning and Working Team

Planning Team:

`User objective → configured participants → one response at a time → accumulated discussion → selected summarizer → structured handoff → user review → next command`

Working Team:

`Approved handoff → task/dependency graph → Scheduler → AI/tool/human execution → durable event/result → next eligible work → review/recovery`

The latest AI contribution never replaces accumulated user intent.

## Connection and Seat

Do not combine these meanings:

`AI application ≠ provider ≠ runtime ≠ model ≠ connection ≠ Seat ≠ skill ≠ tool/MCP ≠ workstation ≠ entitlement ≠ authorization`

Provider/application setup may happen outside TeamAi. TeamAi then tests, scopes, equips, binds, authorizes, and activates the participating AI Seat.

## Before changing anything

`inspect Product Law → inspect Masterplan → inspect Policy/ORUCAVEAM → resolve skill → inspect existing roots → check knowledge/anti-patterns → confirm permission → change → verify → evidence → handover/endorsement`

When a rule is unclear or contradictory, stop the affected path and reconcile it instead of inventing a new authority.
