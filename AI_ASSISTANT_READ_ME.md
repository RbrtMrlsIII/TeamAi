# AI_ASSISTANT_READ_ME — current session boundary

## SESSION SNAPSHOT

- main baseline: 6dc96ff929d1ea874afd3dc44cad9f95fa8096c8
- replacement branch: rebuild/clean-mainline-20260919
- current slice: GOVERNANCE — clean canonical mainline reconstruction (Issue #389)
- open implementation vehicles: #389 only
- source-only / do-not-execute: #388, #386, #385, #379
- do not execute: retired model-specific reviewer paths, 1→2→2 choreography, shared-key semantics, comment-driven advisory orchestration, or the retired current-state map
- next allowed work: finish the clean control-plane/corpus/session audit and prove the replacement branch before new 029 product execution
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

- Issue #389 is the sole active clean-mainline reconstruction vehicle.
- #388/#386/#385/#379 are source/history only and must not be merged wholesale.
- Automatic advisory review is five parallel credential-isolated slots using openrouter/free.
- The five credential aliases are OPENROUTER_API_KEY, OPENROUTER_API_KEY_OPENAI, OPENROUTER_API_KEY_POOLSIDE, OPENROUTER_API_KEY_DEEPSEEK, and OPENROUTER_API_KEY_GWEN.
- Credential aliases identify only which secret a slot receives. They do not identify a reviewer, model, or provider.
- Actual model/provider is runtime evidence from OpenRouter.
- Structured terminal slot artifacts are orchestration state. PR comments are evidence/publication only.
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
- Do not resume new 029 feature/runtime slices until Issue #389 produces the clean replacement branch.
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

The clean-mainline reconstruction preserves the evidence-integrity contract while adapting validator assertions to the replacement advisory transport: PR comments remain publication evidence, structured workflow artifacts hold orchestration state, and the exact-head requirement is retained. The advisory validator's old broad comment-read assertion was replaced with a precise read-pattern assertion rather than weakening comment publication.

## Evidence rules

specified ≠ implemented ≠ verified ≠ runtime-proven ≠ completed ≠ accepted

A passing test proves only the contract it exercises. Never weaken a validator to obtain green CI. Historical execution records remain immutable evidence for their original heads.

## Handover

There is no live HandOver.md. Future sessions start from this Session Snapshot, then verify live GitHub branch/PR/Issue state.

## Endorsement

There is no active `Endorsement.md`. Acceptance decisions remain scope-bound to the applicable Issue/PR/evidence and are never inferred from a green workflow.

## Machine boundary

The merged machine candidate remains non-production. Semantic identity, payload meaning, topology ownership, adaptive geometry, transition state, camera relationship, and rendering remain distinct concerns. Renderer output cannot become backend, identity, entitlement, scheduler, acceptance, or merge authority.
