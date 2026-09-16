# POLICY — ORUCAVEAM execution discipline

**Role:** execution policy only. Product meaning belongs to `Product_Law/PRODUCT_LAW.md`. Procedures belong to `skills/**/SKILL.md`. Current slice belongs to `Masterplan/NEXT_SLICES.md`.

## ORUCAVEAM

`O → R → U → C → A → V → E → A → M`

- **O — Objective:** exact authorized outcome.
- **R — Restrictions:** protected boundaries, dependencies, and prohibited shortcuts.
- **U — User Authority:** user decision, scope, and explicit permission.
- **C — Canonical Authority:** resolve meaning from Product Law, then checklist/current slice and owning Issue.
- **A — Action:** smallest coherent change satisfying the authorized objective.
- **V — Verification:** test the behavior actually claimed.
- **E — Efficiency:** avoid duplicate documents, redundant tools, speculative refactors, and unnecessary runtime work.
- **A — Audit:** reconcile code, contracts, Skills, indexes, evidence, and current state.
- **M — Minimalistic Efficiency / Resource Use:** final implementation and evidence surface is no larger than required.

## Governance

- `Product_Law/PRODUCT_LAW.md` is the single product authority.
- `Product_Law/WIRING.md` owns field purposes and navigation only.
- `Masterplan/MASTERPLAN.md` is the ordered checklist.
- `Masterplan/NEXT_SLICES.md` is exactly one current slice with six required sections.
- `docs/SKILL_WIRING.md` owns Skill routing.
- Reusable procedures live only under `skills/**/SKILL.md`.
- `AI_ASSISTANT_READ_ME.md` owns current session, recovery, handover, endorsement decisions, and validation-change guidance.
- `PRODUCT-KNOWLEDGE.md` owns durable validated concepts only.
- `docs/archive/` and `handover/` are historical storage only.
- Active `HandOver.md`, active `Endorsement.md`, a parallel Skill namespace, and `OBSOLETE_FILES.md` are forbidden.

## PR discipline

- Substantive work starts as a **Draft PR**.
- Required checks, evidence, canonical synchronization, and review-readiness must pass before ready-for-review.
- **Auto-merge is not used or relied upon for product changes.**
- A PR may contain multiple related commits and multiple checklist items.
- One slice is not required to equal one PR or one merge.
- `main` changes through governed PRs only.

## Validation-change protocol

When a request conflicts with an existing validation surface:

```text
VALIDATION CHANGE WARNING
Protected old invariant:
Authorized new rule:
Why the old invariant is obsolete/retained:
Replacement invariant:
Implementation impact:
Validation impact:
Evidence/browser impact:
Residual uncertainty:
```

Then execute:

`warning → authority reconciliation → implementation → replacement validation → verification → evidence → session update`

Never weaken a validator merely to obtain green CI. Existing tests must be classified as retained, obsolete, or replaced before their assertions are changed.

## Evidence discipline

Distinguish:

`specified ≠ implemented ≠ verified ≠ runtime-proven ≠ completed ≠ accepted`

A passing test proves only the contract it exercises. Deployment, browser output, screenshots, and CI are evidence and do not independently change product authority.

<!-- #348 canonical synchronization marker: proof-target surface -->
<!-- #349 post-merge recovery synchronization: #346/#348 merged; this policy remains execution-only. -->