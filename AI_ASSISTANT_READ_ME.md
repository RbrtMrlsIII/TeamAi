# AI_ASSISTANT_READ_ME — current session boundary

**Role:** current session state, recovery, handover, endorsement decision, validation-change guide, and active context pointer. It is not Product Law, not a second Masterplan, and not a permanent procedure manual.

## Session anchor

- Last given prompt: **implement the ordered advisory model review pipeline after adding Qwen and DeepSeek OpenRouter secrets**
- Session date: **2026-09-17**
- Governance foundation: **#346 merged** into `main`
- Post-#346 control-plane: **#352 merged** into `main`
- Governance review fix: **#362 closed/superseded; #367 open** on `governance/review-readiness-late-approval-retrigger`
- Machine Hero candidate: **#353 merged** into `main` and remains non-production
- Semantic topology/adaptive clearance: **#361 merged** into `main` as `6c8f650bf978e47650246af67291a26fe83c4934`
- Active 029 ledger: **#278**
- Governance lifecycle authority: **#133** / `POLICY.md` / repository workflow gates
- Current `main` baseline: **`c4bb03d0feeafd919c582657741751f12a40a6a6`**, post-#361 reconciliation
- Active governance implementation PR: **#368** on `governance/nemotron-review-budget`, currently Draft and unmerged

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
- #361 is merged; it generalizes semantic machine connection topology and payload-adaptive clearance validation while preserving the bounded presentation/evidence boundary.
- #362 is closed/superseded because its implementation branch violated the current responsibility-prefix rule and its base was stale; its late-approval diagnosis and intended fix are carried forward by #367.
- #367 is the active governance repair for `review-readiness` lifecycle re-evaluation on submitted/dismissed human reviews. It does not change what counts as human authorization.
- Issue #278 remains the active 029 product-experience ledger. C8/C9/C10 remain incomplete.
- #368 is the active governance slice for ordered model-assisted PR review and remains Draft/unmerged.
- Historical records remain provenance, not current instruction.

## Canonical public live website URL

**Use exactly one live-site URL for public website testing:**

`https://RbrtMrlsIII.github.io/TeamAi/`

This is the canonical GitHub Pages public entrance for live validation evidence. Preserve the `TeamAi` path casing when recording, reviewing, or comparing browser evidence. Browser/network hostname lowercasing is normal URL handling and does not create a second target.

Do not use Vercel URLs, retired `/spatial/` routes, guessed `/3d/`, `/3d-world/`, or other alternate public URLs as live acceptance targets. Candidate/PR validation remains exact-head project and browser evidence and is separate from this live-site check.

**Verified 2026-09-17:** HTTP `200 OK`; title `TeamAi — Web AI Living Workspace`; visible TeamAi landing content; `Enter 3D world` present; GitHub Pages 404 absent; redirect count `0`.

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

`skills/governance/ai-advisory-review/SKILL.md` defines the shared bounded model-review contract. `.github/workflows/ai-advisory-review-sequence.yml` is the automatic entrypoint, with the explicit order **Nemotron → 2 minutes 30 seconds → DeepSeek → 2 minutes 30 seconds → Qwen**. `.github/workflows/nemotron-copilot-review.yml` remains the deliberate manual Nemotron entrypoint, while `.github/workflows/additional-ai-advisory-reviews.yml` remains the deliberate manual Qwen/DeepSeek entrypoint. `.github/workflows/ai-advisory-review-runner.yml` owns the reusable exact-head validation, bounded packet, model call, advisory posting, and optional explicitly authorized Nemotron approval boundary.

Automatic review begins only on the first eligible non-draft `opened`, `reopened`, or `ready_for_review` event. Draft PRs do not consume automatic model calls. `synchronize` does not restart the sequence. A durable sequence-claim comment is written before the first model call. Every stage receives the original triggering head SHA and fails closed if the PR head changes before that stage. The sequence therefore never lets a later reviewer silently analyze a newer or stale revision.

Each reviewer has an independent secret/model binding:

| Reviewer | Secret alias | OpenRouter model | Automatic stage |
|---|---|---|---:|
| Nemotron | `OPENROUTER_API_KEY` | `nvidia/nemotron-3-ultra-550b-a55b:free` | 1 |
| DeepSeek | `OPENROUTER_API_KEY_DEEPSEEK` | `deepseek/deepseek-v4.1-flash` | 2 |
| Qwen | `OPENROUTER_API_KEY_GWEN` | `qwen/qwen3.8-max-0902` | 3 |

`GWEN` is retained exactly as the owner-supplied secret name and is treated as an alias for Qwen. There is no separate Product Law identity named Gwen. OpenRouter currently exposes the Qwen3.8 Max (0902) and DeepSeek V4.1 Flash model families.

### Observed automatic sequence run #2

Exact PR head: `4477854a425453c2754a50bad941f81113ee5655`.

- `eligibility` passed.
- `validation_gate` passed with all seven required substantive exact-head validators successful.
- `claim` passed and recorded the durable automatic-sequence marker.
- Nemotron completed and posted an advisory review. Its verdict was `APPROVE`, but its review text contained a stale 5-minute interval description and is not treated as authority.
- The first 2-minute-30-second delay completed.
- DeepSeek completed and posted `CHANGES_REQUESTED`, identifying the real canonical-surface interval contradiction.
- The second 2-minute-30-second delay completed.
- Qwen reached the model-call stage but failed after three attempts; no advisory comment was posted. The prior runner did not expose the sanitized provider error response, so the exact HTTP/provider cause remains unverified and is being corrected without weakening fail-closed behavior.
- Human collaborator review independently requested changes for the same interval contradiction and Qwen failure.

Reviewer verdicts remain advisory and cannot create Product Law authority, merge authority, acceptance, or human review authorization. Missing provider secrets fail the affected stage closed and never fall through to another secret. Manual reviewer commands remain deliberate later-head paths and are separate from the automatic sequence allowance.

## Handover

There is no live `HandOver.md`. Current continuation and recovery state belongs here. Historical handover evidence may remain under `handover/` or `docs/archive/` and is not current instruction.

## Endorsement decision

There is no active `Endorsement.md`. Acceptance decisions are recorded against the exact Issue/PR/evidence scope and reflected here for continuity. A green workflow is not an endorsement.

## Machine boundary

PR #353 is the current merged machine candidate, and #361 is the current merged semantic connection/topology baseline. The bounded semantic path is:

`semantic identity → payload → expansion footprint → connection topology → adaptive geometry → transition → semantic subject → camera relationship → rendering`

#361 does not establish complete inter-division topology, final electrical choreography, C8/C9/C10, or production Hero promotion. Prototype coordinates, old timing, mesh indexes, retired camera identifiers, and decorative effects are not universal machine authority.

## Next product frontier

The next substantive 029 slice is **runtime proof of the generalized semantic topology/adaptive geometry path**: prove the current machine candidate against real renderer consumption, multiple payload densities, transition/interruption behavior, branch-aware subject targeting, responsive and reduced-motion behavior, and the canonical live/public boundary. Then reconcile evidence and census state. No Hero promotion or 029 release claim is implied.