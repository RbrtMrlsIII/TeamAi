# AI_ASSISTANT_READ_ME — current session boundary

**Role:** current session state, recovery, handover, endorsement decision, validation-change guide, and active context pointer. It is not Product Law, not a second Masterplan, and not a permanent procedure manual.

## Session anchor

- Last given prompt: **1**
- Session date: **2026-09-15**
- Governance PR: **#346** `governance/repository-foundation` — Draft
- Current #346 head: `c5c77cf8ec38e5797a53b04bca67a62e7ce328fa`
- Machine Hero candidate: **#344** `feat/machine-hero-foundation` — Draft and not promoted
- Active 029 ledger: **#278**
- Governance issue: **#133**, reconciled to draft-first/no-auto-merge policy
- Main baseline for #346: `e14e9be670866c13d565f4b47dda30bebe4c51c8`

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

## Current reconciliation work

- #346 remains the repository governance migration vessel and remains Draft.
- #344 remains the new 3D Hero replacement candidate and remains Draft.
- Product Law is being moved from the root into `Product_Law/` without semantic truncation.
- The complete Masterplan remains intact while its active location moves under `Masterplan/`; only `Masterplan/NEXT_SLICES.md` owns the current frontier.
- `HandOver.md` and `Endorsement.md` are retired from active use; historical records remain available only for provenance.
- Governance procedures route through the single `skills/**/SKILL.md` system, including repository synchronization and machine builder.
- Issue #133 now separates Draft/ready-for-review/merge states, rejects auto-merge as product execution policy, permits multi-commit/multi-slice PRs, and requires validation-change reconciliation.
- The governance audit proves the PR's declared proof target against the complete `base...head` delta rather than the last commit.
- Exact-head governance, full-system, and browser workflows are used so verification evidence is tied to the actual PR head rather than a synthetic merge ref.
- The current CI queue must be evaluated only for the exact recorded #346 head above.

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

`warning → authority reconciliation → implementation → replacement validation → verification → evidence → session update`

Never weaken validation merely to make CI green.

## Handover

There is no live `HandOver.md`. Current continuation and recovery state belongs here. Historical handover evidence may remain under `handover/` or `docs/archive/` and is not current instruction.

## Endorsement decision

There is no active `Endorsement.md`. Acceptance decisions are recorded against the exact Issue/PR/evidence scope and reflected here for continuity. A green workflow is not an endorsement.

## Machine boundary

PR #344 is the machine replacement candidate. Its semantic path is:

`semantic identity → payload → expansion footprint → connection topology → adaptive geometry → transition → semantic subject → camera relationship → rendering`

Prototype coordinates, old timing, mesh indexes, retired camera identifiers, and decorative effects are not universal machine authority. #344 does not become backend, authorization, scheduler, entitlement, commerce, or durable-state authority.

## Next governance gate

#346 is not review-ready until active references to retired roots are eliminated, obsolete validators/procedures no longer appear in active routing, Issue #133 and the repository control plane agree, the governance migration tests pass, and fresh governance/full-system/security/browser evidence agrees on the same head.
