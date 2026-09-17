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

## Canonical public live-site validation

For public live website testing, use only `https://RbrtMrlsIII.github.io/TeamAi/`. Preserve the `TeamAi` path casing in recorded evidence. Browser/network hostname lowercasing is normal URL handling. Vercel and guessed/retired routes are not live acceptance targets. Public live-site validation is evidence only and does not change Product Law, hosting authority, or promotion status.

**Verified 2026-09-17:** HTTP `200 OK`; title `TeamAi — Web AI Living Workspace`; visible landing content; `Enter 3D world` present; GitHub Pages 404 absent; redirect count `0`.

## PR discipline

- Substantive work starts as a **Draft PR**.
- Required checks and applicable browser/runtime evidence remain active on Draft PRs.
- **Governance Integrity is a substantive validation surface and runs on Draft PRs.** It is not a merge-only check.
- `review-readiness` is a promotion-stage check. It may be skipped while a PR is Draft by design and must not be interpreted as a passed gate.
- When a PR becomes Ready for review, the required validation set must be current on the exact head and `review-readiness` must evaluate the review/authorization conditions.
- A `pull_request_review` submission or dismissal may re-trigger `review-readiness` so late approval or dismissal state is reflected without changing the exact-head authorization rule.
- A skipped downstream job is never evidence that the skipped condition passed.
- Required checks, evidence, canonical synchronization, and review-readiness must pass before ready-for-review.
- **Auto-merge is not used or relied upon for product changes.**
- A PR may contain multiple related commits and multiple checklist items.
- One slice is not required to equal one PR or one merge.
- `main` changes through governed PRs only.

### Nemotron quota discipline

Nemotron automatic review is treated as a scarce verification resource. The controlled workflow permits at most one **automatic** Nemotron review per PR, using the first eligible non-draft lifecycle event (`opened`, `reopened`, or `ready_for_review`) that occurs before any prior automatic review marker exists. `synchronize` pushes do not automatically consume another model request. Later-head re-review remains available only through an intentional `/nemotron` invocation or authorized `workflow_dispatch`. This protects provider quota without weakening substantive validators or review evidence requirements.

## Validation-stage model

Use this lifecycle when interpreting CI:

| PR state | Expected validation role |
|---|---|
| **Draft** | Run substantive Governance Integrity, evidence-consistency, agent validation, Full-System, Security, and applicable Browser/Runtime verification against the exact PR head. Promotion authorization is not yet evaluated. |
| **Ready for review** | Reconfirm exact-head substantive validation and run `review-readiness`, including the repository's independent review/authorization requirements. |
| **Merge candidate** | All required checks must be current and passing on the exact head; no automation may substitute for the repository's normal merge/review path. |

A validation that is skipped because of lifecycle gating is **not** equivalent to a passing validation. When a check is intentionally skipped, the owning workflow or PR record should make the reason explicit.

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

## Model-assisted review

The Nemotron Copilot Review Skill and workflow are advisory verification aids. They may inspect an exact PR diff and post model-generated findings. They do not create authority, replace required CI, replace human review, or upgrade a claim from verified to accepted. Before invoking the model, the workflow must wait for the required exact-head `Repository Governance Integrity`, `Repository Full-System Verification`, `Security Static Analysis`, and `Canonical Browser Verification` workflows to complete successfully. Missing, pending, failed, stale, or head-mismatched validator evidence fails the model-review path closed. The review packet must include exact-head execution evidence, current governing context, and the owning Issue state. An approval submission is disabled on ordinary PR events and requires an explicit authorized workflow dispatch; repository branch protection and human governance remain authoritative.

## Evidence discipline

Distinguish:

`specified ≠ implemented ≠ verified ≠ runtime-proven ≠ completed ≠ accepted`

A passing test proves only the contract it exercises. Deployment, browser output, screenshots, and CI are evidence and do not independently change product authority. A model review may analyze evidence but cannot manufacture missing execution proof or treat an open Issue as resolved.

<!-- #361 reconciliation: merged semantic topology/adaptive clearance; runtime-proof frontier remains open. -->
