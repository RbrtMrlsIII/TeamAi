# POLICY — ORUCAVEAM execution discipline

**Authority boundary:** `PRODUCT_LAW.md` defines product meaning and protected architecture. This file defines execution discipline only.

## ORUCAVEAM

`O — Objective → R — Restrictions → U — User Authority → C — Canonical Authority → A — Action → V — Verification → E — Efficiency → A — Audit → M — Minimalistic Efficiency / Resource Use`

### O — Objective
State the bounded outcome before acting.

### R — Restrictions
Identify what must not be changed, bypassed, inferred, exposed, or revived.

### U — User Authority
Confirm the action is directly authorized or explicitly covered by an approved project routine.

### C — Canonical Authority
Identify which Product Law concept, service, state store, repository surface, or external authority owns the meaning involved.

### A — Action
Perform the smallest coherent authorized change. Do not create a competing authority, duplicate chronology, or shadow state.

### V — Verification
Choose evidence that matches the claim: syntax/static → unit/contract → governance → integration → build/package → browser → deployed/runtime → owner acceptance.

### E — Efficiency
Reuse authoritative evidence where scope is unchanged. Prefer targeted reads, bounded changes, deterministic tests, safe/idempotent retries, and one coherent PR over fragmented churn.

### A — Audit
Leave enough trace for another agent to reconstruct the decision, changed paths, evidence, limitations, and current truth.

### M — Minimalistic Efficiency / Resource Use
Use the minimum sufficient authoritative tool/resource operations while never skipping a verification or evidence step required to establish trust.

## Canonical document discipline

- `PRODUCT_LAW.md` = product meaning and architecture authority.
- `MASTERPLAN.md` = executable chronology/checklist only.
- `NEXT_SLICES.md` = one active frontier only.
- `POLICY.md` = ORUCAVEAM only.
- `docs/SKILL_WIRING.md` = routing map only.
- `skills/**/SKILL.md` = bounded reusable procedure.
- `AI_ASSISTANT_READ_ME.md` = live session recovery, handover, validation, and endorsement state.
- `PRODUCT-KNOWLEDGE.md` = validated reusable concepts and lessons without live-session context.
- `docs/project-guide/Endorsement.md` = acceptance record only.
- `docs/archive/` = historical material; never current authority.

## Session synchronization

Every substantive PR must reconcile the active documents affected by its change in the same PR. At minimum, implementation changes update `AI_ASSISTANT_READ_ME.md`; changes to execution order update `MASTERPLAN.md` and `NEXT_SLICES.md`; Skill changes update `docs/SKILL_WIRING.md`.

Historical evidence is preserved, not rewritten. Retired material is archived and redirected.

## Merge discipline

Substantive product changes start as **draft PRs**. Merge requires the applicable required checks, evidence, reconciliation, and explicit review readiness. Auto-merge is not an execution policy. One slice does not imply one PR or one merge.

## Validation-change rule

When a validation fails, classify it first:

`implementation drift → fix implementation`

or

`intentional authorized truth change → update canonical contract first → update validation → verify new truth`

Never weaken a validator solely to obtain green CI.
