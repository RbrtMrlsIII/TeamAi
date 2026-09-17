# AI_ASSISTANT_READ_ME — current session boundary

**Role:** current session state, recovery, handover, endorsement decision, validation-change guide, and active context pointer. It is not Product Law, not a second Masterplan, and not a permanent procedure manual.

## Session anchor

- Last given prompt: **Nemotron Copilot Review wiring**
- Session date: **2026-09-17**
- Governance foundation: **#346 merged** into `main`
- Post-#346 control-plane: **#352 merged** into `main`
- Machine Hero candidate: **#353 merged** into `main` and remains non-production
- Active 029 ledger: **#278**
- Governance lifecycle authority: **#133** / `POLICY.md` / repository workflow gates
- Current main baseline: **`daf182b5022a3ca32d8b617e26cd2d5d04105d53`**, merge of #352

## Canonical authority path

`Product_Law/PRODUCT_LAW.md → Product_Law/WIRING.md → Masterplan/MASTERPLAN.md → Masterplan/NEXT_SLICES.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → applicable Skill(s) → owning Issue → PR → implementation → verification/evidence`

## Current truth

- `Product_Law/PRODUCT_LAW.md` is the single Product Law.
- `Product_Law/WIRING.md` defines development fields and their purposes/routing only.
- `Masterplan/MASTERPLAN.md` is the ordered checklist.
- `Masterplan/NEXT_SLICES.md` contains exactly one Current Slice with Status, Objective, Dependencies, Verification, and Current blocker.
- `POLICY.md` owns ORUCAVEAM and draft-first/no-auto-merge execution discipline.
- `docs/SKILL_WIRING.md` owns Skill routing.
- Reusable procedures live only under `skills/**/SKILL.md`.
- This file owns current session state, recovery, handover, endorsement decisions, and validation-change guidance.
- `PRODUCT-KNOWLEDGE.md` owns durable validated concepts only, never volatile session state.
- `docs/archive/` and `handover/` are historical storage only.
- Active `HandOver.md`, `Endorsement.md`, and `OBSOLETE_FILES.md` are forbidden.
- `docs/skills/` is not an active Skill namespace.

## Current control-plane state

- #346 and #348 are merged and no longer active migration vessels.
- #351 Vercel retirement is merged; Vercel is no longer an active delivery/provider surface.
- #352 is merged; its post-#346 reconciliation and validation-lifecycle changes are part of `main`.
- #353 is the current merged machine candidate implementation and remains non-production.
- Issue #278 remains the active 029 product-experience ledger. C8/C9/C10 remain incomplete.
- Historical records remain provenance, not current instruction.

## Validation lifecycle guide

| PR state | Active validation | Promotion/review gate |
|---|---|---|
| **Draft** | Governance Integrity, evidence consistency, agent validation, Full-System, Security, and applicable Browser/Runtime checks continue against the exact PR head. | `review-readiness` may be skipped by lifecycle design. A skipped job is not a pass. |
| **Ready for review** | Substantive exact-head validation remains current. | `review-readiness` evaluates review and authorization conditions, including required independent approval. |
| **Merge candidate** | Required checks and evidence remain current on the exact head. | Normal governed GitHub review/merge path only; no auto-merge. |

A downstream **skipped** job is never evidence that the underlying requirement passed. Recovery must inspect the controlling upstream job and the exact current head.

## Durable evidence / session continuity

Chat is transient. A substantive slice is not considered durably recoverable until its owning PR/Issue contains the observed data, exact baseline/head, diagnosis, discrepancy, implementation result, verification state, residual uncertainty, and explicit execution disposition. The PR/Issue record is the durable investigation ledger; this file is the current session/recovery pointer.

The live PR head in GitHub is the **source of truth for the current verification commit**. Validation evidence is admissible only when it is tied to that same exact PR head; do not infer current state from an older workflow attempt, stale comment, synthetic merge ref, or local assumption.

## Validation-change guide

Before modifying a test, validator, browser assertion, workflow gate, Skill, acceptance criterion, fixture, or evidence requirement because an authorized change conflicts with it, record:

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

Then:

`warning → authority reconciliation → implementation → replacement validation → verification → evidence → durable PR/Issue record → session update`

Never weaken validation merely to make CI green.

## Model-assisted review

`skills/governance/nemotron-copilot-review/SKILL.md` and `.github/workflows/nemotron-copilot-review.yml` provide bounded model-assisted PR review through OpenRouter/Nemotron. The workflow checks out the exact PR head, constructs a bounded diff packet, posts advisory findings, and keeps approval behind an explicit authorized workflow dispatch. The model is not a Product Law source, merge authority, or replacement for required CI, browser/runtime evidence, review-readiness, or human authorization.

The configured model is `nvidia/nemotron-3-ultra-550b-a55b:free`. This is operational configuration and may change independently of Product Law.

## Handover

There is no live `HandOver.md`. Current continuation and recovery state belongs here. Historical handover evidence may remain under `handover/` or `docs/archive/` and is not current instruction.

## Endorsement decision

There is no active `Endorsement.md`. Acceptance decisions are recorded against the exact Issue/PR/evidence scope and reflected here for continuity. A green workflow is not an endorsement.

## Machine boundary

PR #353 is the current merged machine candidate. Its semantic path is:

`semantic identity → payload → expansion footprint → connection topology → adaptive geometry → transition → semantic subject → camera relationship → rendering`

Prototype coordinates, old timing, mesh indexes, retired camera identifiers, and decorative effects are not universal machine authority. #353 does not become backend, authorization, scheduler, entitlement, commerce, or durable-state authority.

## Next governance gate

The next product frontier remains TEAM-EXPERIENCE-029 in Issue #278. No Hero promotion or 029 release claim is implied by merged #353 alone. Model-assisted review is now available as bounded advisory evidence, but required repository gates and human authorization remain decisive.
