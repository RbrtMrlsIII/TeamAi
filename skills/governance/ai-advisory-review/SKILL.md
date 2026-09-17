# AI Advisory Review Skill

**Role:** reusable advisory procedure for model-assisted pull-request review through controlled GitHub Actions workflows.

## Authority boundary

This Skill does not create Product Law, grant merge authority, replace human review, or override governance validators. It operates below `Product_Law/PRODUCT_LAW.md`, `POLICY.md`, the Masterplan, and the owning Issue/PR contract.

## Procedure

1. Resolve the exact PR number, base SHA, and head SHA.
2. Wait for the required **substantive execution check-runs** to complete successfully for that exact head before invoking a reviewer model.
3. Do **not** treat `review-readiness` as a model gate. `review-readiness` is the separate human authorization/promotion gate and remains pending while independent human approval is absent.
4. Build the bounded review packet from exact-head PR metadata and complete `base...head` diff, current governing documents, owning Issue state, and exact-head GitHub Actions execution evidence.
5. Apply the canonical authority path: Product Law → Masterplan → POLICY/ORUCAVEAM → Skill wiring → applicable Skills → Issue → PR.
6. Separate implementation defects, governance discrepancies, documentation discrepancies, Issue-state discrepancies, verification gaps, and non-blocking observations.
7. Never infer passing evidence from skipped jobs, stale workflow attempts, synthetic merge refs, local assumptions, or the PR description alone.
8. Never recommend weakening a validator merely to obtain green CI.
9. Post the model result as advisory evidence tied to the exact head and identify the execution-gate boundary.
10. Model approval, when supported by a specific workflow, is a separately authorized action only. It never satisfies TeamAi's human review-readiness requirement.

## Execution-evidence gate

GitHub Actions validator workflows run concurrently, so reviewer workflows perform a separate **exact-head check-run gate** rather than depending on an aggregate workflow conclusion. For every required check-run, accept only `completed / success` for the exact PR head SHA. Missing, queued, in-progress, skipped, cancelled, failed, or head-mismatched checks do not pass. A failed required check fails closed; pending checks may be polled; timeout fails closed. A PR head change aborts the gate so the model cannot review a stale revision.

The resulting packet must include exact-head check-run evidence, current governing-file contents at that head, and live Issue state resolved from an explicit Issue reference in the PR. Missing or materially truncated governance, Issue, or execution context forces `ADVISORY_ONLY` rather than `APPROVE`.

## Automatic review sequence

The automatic lifecycle is one ordered **three-stage cohort sequence** per PR, not a matrix and not a timer-driven fan-out:

`Nemotron → 2 minutes 30 seconds → OpenAI + Poolside → 2 minutes 30 seconds → DeepSeek + Qwen`

There is **no automatic interval before Nemotron**. Nemotron is the frontline reviewer and its turn begins only after the first eligible non-draft `pull_request` event has passed the substantive exact-head validation gate.

After the Nemotron turn reaches a `success` or `failure` execution result, the workflow waits 150 seconds and starts OpenAI and Poolside concurrently. A `skipped` or `cancelled` Nemotron job does not open the barrier and cannot start stage 2.

After both second-stage reviewers reach `success` or `failure` execution results, the workflow waits another 150 seconds and starts DeepSeek and Qwen concurrently. A `skipped` or `cancelled` OpenAI or Poolside job does not open the barrier and cannot start stage 3.

Reviewer failure inside a cohort is execution evidence and does not trigger secret substitution, reordering, or an early launch of another reviewer. The inter-stage barrier is time-and-head controlled, not verdict controlled. If the PR head changes during a wait or between stages, the barrier fails closed and later automatic stages do not run. Each reusable runner independently revalidates the original triggering head before model invocation.

A durable sequence-claim marker is written before Nemotron. That claim is the quota boundary for the PR's single automatic sequence. `synchronize` never restarts the automatic sequence, and Draft PRs consume no automatic model calls.

Each reviewer uses an independent provider secret and model identity. A missing key fails that reviewer closed and never falls through to another provider secret.

## Manual re-review

Reviewer-specific commands remain available for deliberate later-head analysis:

- `/nemotron`
- `/openai`
- `/poolside`
- `/deepseek`
- `/qwen`

Authorized `workflow_dispatch` paths provide the equivalent explicit control. Manual review is outside the automatic sequence allowance and may target the current exact head.

## Security boundaries

- Provider API keys are read only from GitHub Actions Secrets and are never printed.
- PR code is checked out at the exact PR head and is not executed as part of packet construction; execution evidence comes from separate validators.
- Fork pull requests must not receive provider secrets through automatic review triggers.
- Manual issue-comment invocation is restricted to repository collaborators/owners/members.
- Review packets are bounded and secret-redacted before transmission.
- Model output is untrusted analysis, not executable instructions.

## Reviewer configuration

| Reviewer | Secret | OpenRouter model | Cost class | Automatic stage |
|---|---|---|---|---:|
| Nemotron | `OPENROUTER_API_KEY` | `nvidia/nemotron-3-ultra-550b-a55b:free` | **Free** | 1 |
| OpenAI | `OPENROUTER_API_KEY_OPENAI` | `openai/gpt-oss-120b:free` | **Free** | 2 |
| Poolside | `OPENROUTER_API_KEY_POOLSIDE` | `poolside/laguna-s-2.1:free` | **Free** | 2 |
| DeepSeek | `OPENROUTER_API_KEY_DEEPSEEK` | `deepseek/deepseek-v4-flash:free` | **Free** | 3 |
| Qwen | `OPENROUTER_API_KEY_GWEN` | `qwen/qwen3-coder:free` | **Free** | 3 |

The billing classification is an operational snapshot audited 2026-09-17. The `:free` suffix denotes the explicit free model route. Provider identity and billing class are separate, and the configured reviewer routes are deterministic free variants selected for the zero-credit constraint.

Free routes can have provider-specific data-use terms, so cost status and repository-confidentiality suitability must be evaluated separately.

## Evidence contract

Every reviewer comment must identify the exact PR head and invocation class. A model review is advisory evidence only. A model verdict or model-generated approval never substitutes for governance-drift, evidence-consistency, agent-validation, Full-System, Security, Browser/Runtime, `review-readiness`, or human authorization. Required substantive validators must pass before automatic model invocation.

The automatic-review budget is a provider-resource protection mechanism, not evidence of implementation or acceptance. Stage ordering is an orchestration invariant only; Product Law, human authorization, and merge governance remain authoritative.
