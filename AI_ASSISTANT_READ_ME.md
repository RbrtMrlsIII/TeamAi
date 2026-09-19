# AI_ASSISTANT_READ_ME — current session boundary

## SESSION SNAPSHOT

- Last given prompt: complete the current-state reconciliation, normalize the absorbed advisory-control-plane cleanup, and prepare PR #395 for governed closure without changing product/runtime logic.
- #346 governance foundation lineage remains the historical baseline for the current control-plane authority chain.
- #353 machine Hero candidate is merged on main as the non-production implementation baseline.

- main baseline: `867944b03776f47fb01bd2cddf90ed4c70ab3b68` (PR #391 merge)
- current main: `867944b03776f47fb01bd2cddf90ed4c70ab3b68`
- current slice: GOVERNANCE — current baseline truth and Issue topology reconciliation (Issue #394)
- replacement branch: governance/baseline-truth-reconciliation-20260919
- open implementation vehicles: PR #395 / Issue #394 (closure-pending until merge)
- active implementation slices: #278, #360, #392, #83, #284, #204
- closure-pending governance slices: #394 / #393, both implemented in PR #395
- completed reconstruction: #391 / #389
- historical/superseded: #347, #368, #369, #387, #388, #386, #385, #379
- do not execute: retired model-specific reviewer paths, 1→2→2 choreography, shared-key semantics, comment-driven advisory orchestration, or the retired current-state map
- next allowed work: complete the governed human-review/merge path for PR #395, then advance `Masterplan/NEXT_SLICES.md` to the next separately owned product/backend/verification slice
- handoff rule: chat is transient; start from this snapshot plus live GitHub state and the owning Issue/PR, not PR archaeology
- validation state: CI green, Corpus clean, and Session current are separate claims
- live PR head: the GitHub PR head is the source of truth for the current verification commit; evidence is admissible only when tied to that exact head
- snapshot rule: recorded main baseline must be checked against the PR base before mutation; live GitHub branch/head state remains authoritative for current commit truth

## Canonical authority path

Product_Law/PRODUCT_LAW.md → Product_Law/WIRING.md → Masterplan/MASTERPLAN.md → Masterplan/NEXT_SLICES.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → applicable Skill(s) → owning Issue → PR → implementation → verification/evidence

## Current truth

- Product_Law/PRODUCT_LAW.md is the single Product Law.
- Product_Law/WIRING.md owns development-field routing only.
- Masterplan/MASTERPLAN.md is the ordered checklist.
- Masterplan/NEXT_SLICES.md contains exactly one Current Slice.
- POLICY.md owns ORUCAVEAM and execution discipline.
- docs/SKILL_WIRING.md owns Skill routing.
- AI_ASSISTANT_READ_ME.md owns volatile session/recovery state.
- PRODUCT-KNOWLEDGE.md owns durable validated concepts.
- docs/archive/ is historical only.
- Active HandOver.md, active Endorsement.md, OBSOLETE_FILES.md, and docs/skills/ are forbidden.

## Current replacement-branch control plane

- Issue #389 is completed; its reconstruction is merged into main. Issue #394 is the current baseline-reconciliation vehicle.
- #388/#386/#385/#379 are source/history only and must not be merged wholesale.
- Automatic advisory review is five credential-isolated openrouter/free slots with a nominal 2-second launch stagger and an 8-second maximum spread.
- Advisory slot/credential identity is defined by `.github/teamai/authority-manifest.yml`; this session record does not duplicate secret aliases.
- Credential aliases identify only which secret a slot receives. They do not identify a reviewer, model, or provider.
- Previous merged-main advisory proof: exact head `be9d234ee41a2771ccb737e7435dff5d3481897b`, terminal slots 5/5, publishable advisory reviews 4/5, one terminal `PROVIDER_RESPONSE_TRUNCATED`.
- Current PR #395 advisory evidence: workflow run `35451109816` on exact head `c2a6f11a5a2bc31fa7212ab74e66454c0a4e3a06` reached 5/5 terminal slots, 4/5 provider HTTP 2xx responses, 1/5 published reviews, 3/5 `PROVIDER_RESPONSE_TRUNCATED`, 1/5 HTTP 429 from provider `Liquid`, and 0/5 provenance gaps. Slot 5 published successfully with runtime provenance `dots-studio/dots-3-note-preview:free` via `AtlasCloud`.
- Actual model/provider is runtime evidence from OpenRouter.
- Structured terminal slot artifacts are orchestration state. PR comments are evidence/publication only. A terminal provider failure remains visible in the slot artifact and is not converted into a false provider-success claim.
- The automatic sequence is bound to the exact PR head. A later corrected head may establish a new sequence; the same exact head may not consume another provider sequence.
- Execution completion is not advisory approval, human acceptance, merge authorization, or release.

## Authority and delivery boundaries

- GitHub is engineering/source truth.
- Firebase Auth owns identity; Firestore (default) owns durable TeamAi application state; Supabase Edge is the trusted server execution/webhook boundary; PayPal is external payment-provider event authority.
- Firebase Hosting is current product delivery authority.
- GitHub Pages is the canonical public validation surface at https://RbrtMrlsIII.github.io/TeamAi/.
- Vercel remains non-authoritative and paused.

## Product boundary while reconstruction is active

- Preserve current machine candidate and semantic topology work already on main.
- Do not advance to a new 029 feature/runtime slice until PR #395 is merged and `Masterplan/NEXT_SLICES.md` is advanced from the closure-pending #394 slice.
- No Product Law, entitlement, authorization, scheduler, durable-state, acceptance, or merge authority is created by the advisory workflow or renderer.

## Validation lifecycle guide

| PR state | Active validation | Promotion/review gate |
|---|---|---|
| Draft | Governance Integrity, evidence consistency, agent validation, Full-System, Security, and applicable Browser/Runtime checks continue against the exact PR head. | review-readiness may be skipped by lifecycle design. A skipped job is not a pass. |
| Ready for review | Substantive exact-head validation remains current. | review-readiness evaluates review and authorization conditions and remains pending while independent approval is absent. |
| Merge candidate | Required checks and evidence remain current on the exact head. | Normal governed GitHub review/merge path only; no auto-merge. |

A downstream skipped job is never evidence that the underlying requirement passed. Recovery must inspect the controlling upstream job and the exact current head.

## Validation-change guide

Before modifying a test, validator, browser assertion, workflow gate, Skill, acceptance criterion, fixture, or evidence requirement because an authorized change conflicts with it, record:

```
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

## Current validation-change record

The clean-mainline reconstruction preserves the evidence-integrity contract while adapting validator assertions to the replacement advisory transport: PR comments remain publication evidence, structured workflow artifacts hold orchestration state, and the exact-head requirement is retained. Review-readiness distinguishes missing/in-progress checks from completed failures and waits for required checks instead of treating an absent conclusion as terminal failure. The automatic reviewer fan-out uses a bounded 2-second launch stagger to reduce burst traffic without reviving staged barriers. The advisory validator's old broad comment-read assertion was replaced with a precise read-pattern assertion rather than weakening comment publication. The canonical governance parser's Draft-proof-target boundary was corrected from a level-2-or-3 closing lookahead to a level-2 closing lookahead so nested proof-target subsections are included; the required governance/canonical content is therefore validated rather than accidentally discarded.

## Evidence rules

specified ≠ implemented ≠ verified ≠ runtime-proven ≠ completed ≠ accepted

A passing test proves only the contract it exercises. Never weaken a validator to obtain green CI. Historical execution records remain immutable evidence for their original heads.

## Handover

There is no live `HandOver.md`. Future sessions start from this Session Snapshot, then verify live GitHub branch/PR/Issue state.

## Endorsement

There is no active `Endorsement.md`. Acceptance decisions remain scope-bound to the applicable Issue/PR/evidence and are never inferred from a green workflow.

## Machine boundary

The merged machine candidate remains non-production. Semantic identity, payload meaning, topology ownership, adaptive geometry, transition state, camera relationship, and rendering remain distinct concerns. Renderer output cannot become backend, identity, entitlement, scheduler, acceptance, or merge authority.


## CURRENT ISSUE OWNERSHIP

- #394 = current baseline/session/Issue-topology reconciliation
- #278 = 029 canonical product-experience execution ledger
- #360 = 029 machine-candidate/runtime/browser/provenance slice
- #392 = AI Seat budget, usage, handoff, shared context, and cooperation product feature
- #83 = frontend spatial visual/material track
- #284 = backend durable/runtime ledger
- #204 = Conn-3 GitHub OAuth/bind integration
- #133 = enduring validation/promotion governance contract
- #393 = governance/advisory normalization implemented in PR #395; closure-pending

Historical Issues are evidence, not active routing.
