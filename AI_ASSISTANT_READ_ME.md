# AI_ASSISTANT_READ_ME — live session boundary

**Role:** current agent/session memory, recovery, handover, validation, and endorsement guide.  
**Update rule:** update this file in every substantive session before closing a governed change.

## Session anchor

- Last given prompt: **1**
- Current session date: **2026-09-15**
- Current governance PR: **#346** `governance/repository-foundation` (draft)
- Current machine PR: **#344** `feat/machine-hero-foundation` (draft)
- Superseded governance PR: **#343** closed, not merged
- Superseded legacy Hero PRs: **#336, #338, #339** closed; history preserved
- Active 029 owner: **#278**
- Merge-gate owner: **#133**

## Authority order

`PRODUCT_LAW.md → MASTERPLAN.md → NEXT_SLICES.md → POLICY.md → docs/SKILL_WIRING.md → applicable Skill(s) → implementation → verification/evidence → AI_ASSISTANT_READ_ME.md → Endorsement → PRODUCT-KNOWLEDGE.md`

Issues, PRs, branches, workflow output, Skills, and archives operate below Product Law. Archive material is historical only.

## Current truth

- `PRODUCT_LAW.md` remains the highest product authority. Its semantics are preserved; its document traceability now points to the canonical active chain.
- `MASTERPLAN.md` is checklist/chronology only.
- `NEXT_SLICES.md` owns one current frontier only.
- `POLICY.md` owns ORUCAVEAM execution discipline and workspace naming discipline only.
- `docs/SKILL_WIRING.md` owns routing only.
- `AI_ASSISTANT_READ_ME.md` owns live continuation/recovery/session state.
- `PRODUCT-KNOWLEDGE.md` owns validated reusable concepts only, never volatile session state.
- `docs/project-guide/Endorsement.md` records acceptance only.
- Historical handover/current-state/agent/governance operating guides are retired from active use and preserved under `docs/archive/`.
- `OBSOLETE_FILES.md` is forbidden and does not define the archive.
- #346 is repository-foundation work only and does not promote #344.
- #344 remains the Machine Hero replacement candidate; production Hero remains unchanged by default.

## This session — executed reconciliation

- Consolidated active governance/documentation into the canonical chain above.
- Archived/retired duplicate handover, current-state, chronology, agent-execution, and governance-procedure surfaces from active routing.
- Rewired active Skills, Vision, Grok alignment, and navigation tests to canonical roots.
- Added fail-closed repository canonical-document synchronization audit.
- Added repository synchronization Skill and removed duplicate active governance procedures.
- Added workspace branch naming and workflow responsibility naming discipline.
- Renamed workflow identities to: `Repository Governance Integrity`, `Repository Full-System Verification`, `Security Static Analysis`, `Canonical Browser Verification`, `Spatial Validation Delivery`.
- Tightened PR template for draft-first, same-PR canonical synchronization, no-auto-merge, and authority-boundary checks.
- Closed superseded legacy Hero and governance Issues/PRs while preserving Git history.
- Closed the superseded #343 governance proposal; #346 is now the single governance foundation draft.
- Corrected archive validation to allow moving a live document into `docs/archive/` while preventing mutation of already-archived evidence.
- Corrected canonical marker validation to include Endorsement and to validate the declared manifest version shape rather than a fixed revision.

## Required session workflow

1. Read Product Law and identify the canonical concept.
2. Read Masterplan and select the parent checklist item.
3. Read `NEXT_SLICES.md` and identify the one active frontier.
4. Read Policy and apply ORUCAVEAM.
5. Resolve the applicable Skill through `docs/SKILL_WIRING.md`.
6. Inspect current `main`, active Issue, PR, branch, and workflow state.
7. Implement the smallest coherent change.
8. Verify at the claim's required strength.
9. Reconcile all affected active documents in the same substantive PR.
10. Record evidence and limitations.
11. Update this file before session handover/closure.
12. Record endorsement only when exact scope, authority, and evidence support it.
13. Promote only validated reusable lessons into Product Knowledge.

## Canonical document update matrix

| Change | Update in same substantive PR |
|---|---|
| Product meaning / protected architecture | `PRODUCT_LAW.md` + `MASTERPLAN.md` + this file |
| Execution order / checklist | `MASTERPLAN.md` + `NEXT_SLICES.md` + this file |
| New current frontier | `NEXT_SLICES.md` + this file |
| Skill created/changed/retired | `docs/SKILL_WIRING.md` + applicable Masterplan item + this file |
| Frontend/backend implementation | this file + applicable Masterplan frontier; update canonical docs when their meaning/status changes |
| Evidence / verification | this file + evidence record; do not rewrite historical evidence |
| Accepted reusable lesson | this file → `PRODUCT-KNOWLEDGE.md` only after validation |

## Validation-change discipline

When a gate fails:

`observe → classify drift vs intentional truth change → inspect canonical authority → fix implementation OR update contract first → update validation → verify again`.

Never weaken a validator to obtain a green result.

## Draft-first merge discipline

Substantive product work starts as a draft PR. Conversion to ready-for-review is a promotion action after required checks, evidence, reconciliation, and review readiness. Auto-merge is not a product execution policy.

## Workspace discipline

New durable branches use purpose-specific prefixes: `frontend/`, `backend/`, `governance/`, `verification/`, `docs/`, `recovery/`, or `delivery/`. Temporary branches use a disposable prefix such as `tmp/`. Existing historical branches are not deleted automatically; cleanup requires no open dependency and no unique recovery/provenance value.

Workflow names state responsibility and verification purpose. Avoid vague names such as `TeamAi`, `AI`, `Build`, or `Test` when a precise responsibility can be stated. Stable workflow filenames may remain unchanged when renaming them would create needless integration churn.

## Handover rule

There is no second live HandOver manual. Current continuation/recovery state belongs here. Historical handover records, when retained, live under `docs/archive/`.

## Endorsement rule

Endorsement records acceptance; it does not create authority. It must name exact scope, evidence, limitations, and the authority decision. A green workflow alone is never an endorsement.

## Current machine frontier

The machine candidate is a semantic branch machine:

`10 generated seats + 4 distinct outer housings + 1 hub → 15 independent modules → semantic ports → lattice topology → geometry-derived subject/camera → expansion → interaction → branch UI → animation`

It remains presentation-only and must not become backend, authorization, scheduler, entitlement, commerce, or durable-state authority.

## Next governance gate

The repository-foundation PR is not complete until the fresh renamed governance, full-system, browser, and security workflows agree on the same head. After that, #346 can move to review readiness only if its diff remains minimal and historically safe. #344 remains independently draft and promotion-gated.
