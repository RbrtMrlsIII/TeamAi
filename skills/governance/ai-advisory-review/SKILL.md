# AI Advisory Review Skill

**Role:** reusable advisory procedure for model-assisted pull-request review through controlled GitHub Actions workflows.

## Authority boundary

This Skill does not create Product Law, grant merge authority, replace human review, or override governance validators. It operates below `Product_Law/PRODUCT_LAW.md`, `POLICY.md`, the Masterplan, and the owning Issue/PR contract.

## Procedure

1. Resolve the exact PR number, base SHA, and head SHA.
2. Wait for the required **substantive execution check-runs** to complete successfully for that exact head before invoking a reviewer model.
3. Do **not** wait on `review-readiness` as part of the model gate. `review-readiness` is the separate human authorization/promotion gate and may fail legitimately while independent human approval is absent.
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

The automatic lifecycle is one ordered sequence per PR, not a parallel matrix:

`Nemotron → 5-minute interval → DeepSeek → 5-minute interval → Qwen`

The sequence is entered only by the first eligible non-draft `pull_request` lifecycle event among `opened`, `reopened`, or `ready_for_review`. Draft PRs consume no automatic model calls. `synchronize` never restarts the sequence.

A durable sequence-claim marker is written before the first model invocation. That claim is the quota boundary for the PR's automatic sequence. If the initial head changes during an interval, the next reviewer fails its exact-head guard and later automatic stages do not run. This prevents a later stage from reviewing a stale revision.

Each stage uses its own provider secret and model identity. A missing key fails that stage closed and never falls through to another provider secret. A reviewer verdict does not determine whether the next stage runs; only successful execution of the previous reviewer stage and exact-head freshness permit progression.

## Manual re-review

Reviewer-specific commands remain available for deliberate later-head analysis:

- `/nemotron`
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

| Reviewer | Secret | OpenRouter model | Automatic order |
|---|---|---|---:|
| Nemotron | `OPENROUTER_API_KEY` | `nvidia/nemotron-3-ultra-550b-a55b:free` | 1 |
| DeepSeek | `OPENROUTER_API_KEY_DEEPSEEK` | `deepseek/deepseek-v4.1-flash` | 2 |
| Qwen | `OPENROUTER_API_KEY_GWEN` | `qwen/qwen3.8-max-0902` | 3 |

`GWEN` is retained as the configured secret alias supplied by the repository owner; the model/provider represented by that alias is Qwen. This distinction is intentional until the secret name is normalized.

## Evidence contract

Every reviewer comment must identify the exact PR head and invocation class. A model review is advisory evidence only. A model verdict or model-generated approval never substitutes for governance-drift, evidence-consistency, agent-validation, Full-System, Security, Browser/Runtime, `review-readiness`, or human authorization. Required substantive validators must pass before automatic model invocation.

The automatic-review budget is a provider-resource protection mechanism, not evidence of implementation or acceptance. The sequence's ordering is an orchestration invariant only; Product Law, human authorization, and merge governance remain authoritative.
