# AI_ASSISTANT_READ_ME — live session boundary

**Role:** current agent/session memory, recovery, handover, validation, and endorsement guide.  
**Update rule:** update this file in every substantive session before closing a governed change.

## Session anchor

- Last given prompt: **1**
- Current session date: **2026-09-15**
- Current governance PR: **#346** `governance/repository-foundation` (draft)
- Current machine PR: **#344** `feat/machine-hero-foundation` (draft)
- Superseded governance PR: **#343** closed, not merged
- Active 029 owner: **#278**
- Merge-gate owner: **#133**

## Authority order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md → docs/SKILL_WIRING.md → applicable Skill(s) → implementation → verification/evidence → endorsement → PRODUCT-KNOWLEDGE.md`

Issues, PRs, branches, workflow output, and Skills operate below Product Law. Archive material is historical only.

## Current truth

- Production Hero remains the existing implementation until an explicit replacement decision.
- #344 is a replacement candidate, not production truth.
- #346 is the repository-governance cleanup vessel, not a new constitution.
- No document in this session grants itself authority.

## Required session workflow

1. Read Product Law and identify the canonical concept.
2. Read Masterplan and select the parent checklist item.
3. Read Policy and apply ORUCAVEAM.
4. Resolve the applicable Skill through `docs/SKILL_WIRING.md`.
5. Inspect current `main`, active Issue, PR, branch, and workflow state.
6. Implement the smallest coherent change.
7. Verify at the claim's required strength.
8. Reconcile all affected active documents in the same substantive PR.
9. Record evidence and limitations.
10. Update this file before session handover/closure.
11. Record endorsement only when its exact scope is actually authorized and proven.
12. Promote only validated reusable lessons into Product Knowledge.

## Canonical document update matrix

| Change | Update in same substantive PR |
|---|---|
| Product meaning / protected architecture | `PRODUCT_LAW.md` + `MASTERPLAN.md` + this file |
| Execution order / checklist | `MASTERPLAN.md` + `NEXT_SLICES.md` + this file |
| New current frontier | `NEXT_SLICES.md` + this file |
| Skill created/changed/retired | `docs/SKILL_WIRING.md` + applicable Masterplan item + this file |
| Frontend/backend implementation | this file + applicable Masterplan frontier; update other canonical docs when their meaning/status changes |
| Evidence / verification | this file + evidence record; do not rewrite historical evidence |
| Accepted reusable lesson | this file → `PRODUCT-KNOWLEDGE.md` only after validation |

## Validation-change discipline

When a gate fails:

`observe → classify drift vs intentional truth change → inspect canonical authority → fix implementation OR update contract first → update validation → verify again`.

Never weaken a validator to obtain a green result.

## Draft-first merge discipline

Substantive product work starts as a draft PR. Conversion to ready-for-review is a promotion action after required checks, evidence, reconciliation, and review readiness. Auto-merge is not used as a product execution policy.

## Handover rule

There is no second live HandOver manual. Current continuation state belongs here. Historical handover records, when retained, live under `docs/archive/`.

## Endorsement rule

Endorsement records acceptance; it does not create authority. It must name the exact scope, evidence, limitations, and authority decision. A green workflow alone is never an endorsement.

## Current machine frontier

The machine candidate is a semantic branch machine:

`10 generated seats + 4 distinct outer housings + 1 hub → 15 independent modules → semantic ports → lattice topology → geometry-derived subject/camera → expansion → interaction → branch UI → animation`

It remains presentation-only and must not become backend, authorization, scheduler, entitlement, or durable-state authority.
