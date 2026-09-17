# AI_ASSISTANT_READ_ME — current session boundary

**Role:** current session state, recovery, handover, endorsement decision, validation-change guide, and active context pointer. It is not Product Law, not a second Masterplan, and not a permanent procedure manual.

## Session anchor

- Last given prompt: **resume the forgotten governance lifecycle fix after #361 and continue the 029 frontier**
- Session date: **2026-09-17**
- Governance foundation: **#346 merged** into `main`
- Post-#346 control-plane: **#352 merged** into `main`
- Governance review fix: **#362 closed/superseded; #367 open** on `governance/review-readiness-late-approval-retrigger`
- Machine Hero candidate: **#353 merged** into `main` and remains non-production
- Semantic topology/adaptive clearance: **#361 merged** into `main` as `6c8f650bf978e47650246af67291a26fe83c4934`
- Active 029 ledger: **#278**
- Governance lifecycle authority: **#133** / `POLICY.md` / repository workflow gates
- Current `main` baseline: **`c4bb03d0feeafd919c582657741751f12a40a6a6`**, post-#361 reconciliation

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

`skills/governance/ai-advisory-review/SKILL.md` defines the shared bounded model-review contract. `.github/workflows/nemotron-copilot-review.yml` retains the controlled OpenRouter/Nemotron reviewer, while `.github/workflows/additional-ai-advisory-reviews.yml` adds the configured Qwen and DeepSeek advisory reviewers. These workflows check out the exact PR head, wait for required exact-head Governance, Full-System, Security, and Browser/Runtime validators to complete successfully, collect their execution evidence plus current governing documents and owning Issue state, then invoke the configured model. Pending, failed, stale, or head-mismatched execution evidence blocks model invocation. Model output remains advisory and cannot create Product Law authority, merge authority, acceptance, or human review authorization.

Automatic review is deliberately quota-bounded per reviewer. Draft PRs do not consume automatic allowance. For each configured reviewer, an accidentally non-draft `opened` PR or a `ready_for_review` PR may consume one automatic invocation. Later `synchronize` pushes do not automatically invoke any reviewer. Later-head re-review is deliberate through reviewer-specific commands (`/qwen` or `/deepseek` for the additional reviewers, `/nemotron` for Nemotron) or authorized workflow dispatch.

Additional reviewer configuration currently is:

| Reviewer | Secret alias | OpenRouter model |
|---|---|---|
| Qwen | `OPENROUTER_API_KEY_GWEN` | `qwen/qwen3.8-max-0902` |
| DeepSeek | `OPENROUTER_API_KEY_DEEPSEEK` | `deepseek/deepseek-v4.1-flash` |

`GWEN` is retained exactly as the owner-supplied secret name and is treated as an alias for the Qwen provider/model configuration. There is no separate Product Law identity named Gwen. The OpenRouter model configuration is operational and can change independently of Product Law.

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
