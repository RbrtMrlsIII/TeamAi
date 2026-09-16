# AI_ASSISTANT_READ_ME — current session boundary

**Role:** current session state, recovery, handover, endorsement decision, validation-change guide, and active context pointer. It is not Product Law, not a second Masterplan, and not a permanent procedure manual.

## Session anchor

- Last given prompt: **durable evidence + #353 machine-core repair**
- Session date: **2026-09-16**
- Governance PR: **#346** `governance/repository-foundation` — merged
- Machine Hero candidate: **#353** `frontend/machine-hero-foundation-current` — Draft, not promoted
- Active 029 ledger: **#278**
- Governance issue: **#133**, reconciled to draft-first/no-auto-merge policy
- Current main baseline: **a714271e9ed91fcfbbab9c88160107cc38bf7d01**

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

## Durable evidence rule

Every substantive implementation slice must leave a durable evidence record in its owning PR or Issue before the slice is considered complete. Chat is transient investigation only and is never the sole repository memory.

Each record must preserve:

```text
SLICE EVIDENCE RECORD
Slice / objective:
Exact base + head:
Observed symptoms:
Evidence collected (tests/browser/runtime/git):
Root-cause diagnosis:
Discrepancies / contradictions:
Implementation applied:
Validation impact:
Verification result:
Remaining uncertainty / blockers:
Next authorized slice:
```

Future sessions must be able to reconstruct the active slice from GitHub without relying on chat history. Negative, blocked, or inconclusive findings must also be recorded. Exact commit/head and validation scope are mandatory for material findings. Do not compress distinct failures into generic status or manufacture green evidence.

## Current reconciliation work

- #346 is merged and is no longer an active governance vessel.
- #348 is merged and established the Node runtime entry correction later followed by removal of Vercel as an active delivery dependency.
- #353 is the current 10-seat modular machine Hero candidate and remains Draft until exact-head implementation/browser/security evidence and required review conditions are satisfied.
- Product Law remains canonical under `Product_Law/` without semantic truncation.
- The complete Masterplan is under `Masterplan/`; only `Masterplan/NEXT_SLICES.md` owns the current frontier.
- Historical records remain provenance only.

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

## #353 current verified slice

At head **4809f127b8eb7a09985e34b8816902548bda5434**, the exact-head required validation set passed:

- Repository Governance Integrity: PASS
- Repository Full-System Verification: PASS
- Security Static Analysis: PASS
- Canonical Browser Verification: PASS

Browser verification completed successfully after the machine-core default seat-count correction in the visual, interaction, and semantic fallback consumers. The prior 40-pass/5-fail browser result was tied to head `f9da716d...` and is historical for this slice, not current proof.

The remaining inline `machine-core-preview.html` parser duplication is a tracked cleanup concern; it was not the source of the final browser failure and no test was weakened to obtain the green result.

<!-- Durable evidence contract established during #353 -->
