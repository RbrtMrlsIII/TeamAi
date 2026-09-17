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
- **A Draft PR must remain Draft while its required substantive validations are still running or incomplete. Marking a Draft PR Ready for review is a governance promotion action only after the required substantive validation set has completed successfully on the exact current head.**
- GitHub may technically permit a user to click **Ready for review** before those checks finish; TeamAi automation must treat that transition as pending and must not claim or invoke an automatic model review until the required exact-head substantive validators are complete and successful.
- When a PR becomes Ready for review, the required substantive validation set must be current on the exact head and `review-readiness` evaluates the review/authorization conditions for the promotion/merge path.
- A `pull_request_review` submission or dismissal may re-trigger `review-readiness` so late approval or dismissal state is reflected without changing the exact-head authorization rule.
- A skipped downstream job is never evidence that the skipped condition passed.
- **Required checks, evidence, canonical synchronization, and review-readiness must all pass before the PR is treated as a merge candidate or authorized for merge.** They are not a prerequisite for the Ready-for-review transition itself, because `review-readiness` is evaluated after that transition.
- **Auto-merge is not used or relied upon for product changes.**
- A PR may contain multiple related commits and multiple checklist items.
- One slice is not required to equal one PR or one merge.
- `main` changes through governed PRs only.

### Model-review sequence discipline

Model-assisted advisory review is treated as a scarce verification resource. The automatic path is one ordered three-stage cohort sequence per PR:

`Nemotron → 2 minutes 30 seconds → OpenAI + Poolside → 2 minutes 30 seconds → DeepSeek + Qwen`

There is **no automatic interval before Nemotron**. Nemotron is the frontline reviewer. It starts only when the first eligible non-draft `opened`, `reopened`, or `ready_for_review` event has passed the required substantive exact-head validation gate.

After Nemotron reaches a `success` or `failure` execution result, the sequence waits exactly 150 seconds before starting the second-stage pair. A `skipped` or `cancelled` Nemotron job does **not** open the barrier and must not start stage 2. OpenAI and Poolside are peer reviewers in that stage and execute concurrently against the same original triggering head.

After both second-stage reviewers reach a `success` or `failure` execution result, the sequence waits another 150 seconds before starting the third-stage pair. A `skipped` or `cancelled` OpenAI or Poolside job does **not** open the barrier and must not start stage 3. DeepSeek and Qwen are peer reviewers in that stage and execute concurrently against the same original triggering head.

The inter-stage waits are **cohort barriers**, not reviewer timers. A provider failure is execution evidence and does not cause another provider to substitute for it, reorder the stages, or launch early. The sequence may proceed to the next cohort after an allowed provider failure, but only while the completed reviewer job result is `success` or `failure` and exact-head freshness remains intact. A PR-head change during a wait or between stages fails closed and prevents later automatic stages from reviewing stale code.

The sequence can begin only on the first eligible non-draft `opened`, `reopened`, or `ready_for_review` event **after the required substantive validation set has completed successfully on that exact PR head**. Draft PRs consume no automatic model calls. `synchronize` does not restart the sequence. The automatic sequence gate polls the required validator check-runs while they are pending and fails closed on missing, failed, timed-out, stale, or head-mismatched evidence. A durable sequence-claim marker is recorded only after that validation gate passes and before Nemotron starts.

Each reviewer has its own provider secret and model identity. Missing reviewer secrets fail the affected stage closed and never fall through to another reviewer secret.

### Reviewer billing boundary

The automatic review path must not be treated as cost-free merely because the reviewer name identifies a provider. Pricing is determined by the configured OpenRouter model route. With a zero-credit OpenRouter account, paid model bindings must not be invoked. Free variants are rate-limited and remain separately subject to their provider data-use terms.

Current binding status as audited 2026-09-17:

| Reviewer | Secret alias | Current OpenRouter model | Cost class | Stage |
|---|---|---|---|---:|
| Nemotron | `OPENROUTER_API_KEY` | `nvidia/nemotron-3-ultra-550b-a55b:free` | **Free** | 1 |
| OpenAI | `OPENROUTER_API_KEY_OPENAI` | `openai/gpt-oss-120b:free` | **Free** | 2 |
| Poolside | `OPENROUTER_API_KEY_POOLSIDE` | `poolside/laguna-s-2.1:free` | **Free** | 2 |
| DeepSeek | `OPENROUTER_API_KEY_DEEPSEEK` | `deepseek/deepseek-v4-flash:free` | **Free** | 3 |
| Qwen | `OPENROUTER_API_KEY_GWEN` | `qwen/qwen3-coder:free` | **Free** | 3 |

The cost classification is an OpenRouter model-route audit on 2026-09-17. The `:free` suffix denotes the explicit free model route. Provider identity and billing class are separate, and the configured reviewer routes are now deliberately deterministic free variants rather than the previously audited paid routes.

Free model routes can also carry provider-specific logging or training terms. Repository review packets can contain source and governance material, so model-cost decisions must be kept distinct from data-handling decisions.

Manual `/nemotron`, `/openai`, `/poolside`, `/deepseek`, and `/qwen` commands and authorized workflow dispatch remain available for deliberate later-head review. Manual review is separate from the automatic sequence allowance. Model output and any model approval remain advisory and cannot satisfy human review-readiness or merge authorization.

## Validation-stage model

Use this lifecycle when interpreting CI:

| PR state | Expected validation role |
|---|---|
| **Draft** | Run substantive Governance Integrity, evidence-consistency, agent validation, Full-System, Security, and applicable Browser/Runtime verification against the exact PR head. Promotion authorization is not yet evaluated. |
| **Ready for review** | Reconfirm exact-head substantive validation and run `review-readiness`, including the repository's independent review/authorization requirements. The automatic AI sequence may begin only after the substantive validation set has completed successfully. Human approval may still be pending at this stage. `review-readiness` remains pending while that independent approval is absent. |
| **Merge candidate** | All required checks, evidence, canonical synchronization, and review-readiness must be current and passing on the exact head; no automation may substitute for the repository's normal merge/review path. |

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

The shared AI Advisory Review Skill plus model-specific manual wrappers and the automatic sequence are advisory verification aids. They may inspect an exact PR diff and post model-generated findings. They do not create authority, replace required CI, replace human review, or upgrade a claim from verified to accepted. Before every automatic stage, the reusable reviewer runner waits for required substantive exact-head Governance, Full-System, Security, and Browser/Runtime validator check-runs to complete successfully. The automatic sequence adds a pre-claim gate so a Ready-for-review transition occurring while validations are still running does not start or claim the model sequence prematurely. Missing, pending, failed, stale, or head-mismatched validator evidence fails the reviewer path closed. The review packet must include exact-head execution evidence, current governing context, and the owning Issue state. Repository branch protection and human governance remain authoritative.

The staged reviewer timing is a synchronized governance invariant across `ai-advisory-review-sequence.yml`, this Policy, `docs/SKILL_WIRING.md`, `skills/governance/ai-advisory-review/SKILL.md`, `Masterplan/MASTERPLAN.md`, `Masterplan/NEXT_SLICES.md`, `Product_Law/WIRING.md`, and `AI_ASSISTANT_READ_ME.md`. Drift in the declared stage order, cohort membership, or 150-second inter-stage waits is a governance inconsistency and must fail validation rather than being silently normalized by one surface.

## Evidence discipline

Distinguish:

`specified ≠ implemented ≠ verified ≠ runtime-proven ≠ completed ≠ accepted`

A passing test proves only the contract it exercises. Deployment, browser output, screenshots, and CI are evidence and do not independently change product authority. A model review may analyze evidence but cannot manufacture missing execution proof or treat an open Issue as resolved.

<!-- #361 reconciliation: merged semantic topology/adaptive clearance; runtime-proof frontier remains open. -->
