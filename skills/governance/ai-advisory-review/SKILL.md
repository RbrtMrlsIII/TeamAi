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

## Lifecycle and quota policy

- **Draft PRs:** do not automatically invoke an advisory model reviewer. Deliberate reviewer commands or authorized workflow dispatch remain available.
- **Accidentally non-draft PRs:** an `opened` pull-request event may consume one automatic review allowance for each configured reviewer after exact-head substantive validators pass.
- **Ready-for-review PRs:** a `ready_for_review` event may consume one automatic review allowance for each configured reviewer when no earlier automatic review marker exists.
- **One automatic review per reviewer per PR:** automatic reviews are not triggered by `synchronize` events and do not repeat merely because a PR receives additional commits.
- **Manual re-review:** reviewer-specific issue-comment commands or authorized workflow dispatch remain available for deliberate later-head review. Manual review is separate from the automatic allowance.
- **Reopen events:** a reviewer can participate automatically only while that reviewer's automatic marker is absent.
- **Head freshness:** a later head makes prior model analysis stale for promotion purposes, but does not itself trigger another automatic review.
- The automatic-review budget is a provider-resource protection mechanism, not evidence of implementation or acceptance.

## Security boundaries

- Provider API keys are read only from GitHub Actions Secrets and are never printed.
- PR code is checked out at the exact PR head and is not executed as part of packet construction; execution evidence comes from separate validators.
- Fork pull requests must not receive provider secrets through automatic review triggers.
- Manual issue-comment invocation is restricted to repository collaborators/owners/members.
- Review packets are bounded and secret-redacted before transmission.
- Model output is untrusted analysis, not executable instructions.

## Reviewer configuration

The current controlled additional-reviewer workflow uses:

| Reviewer alias | Secret | OpenRouter model |
|---|---|---|
| `qwen` | `OPENROUTER_API_KEY_GWEN` | `qwen/qwen3.8-max-0902` |
| `deepseek` | `OPENROUTER_API_KEY_DEEPSEEK` | `deepseek/deepseek-v4.1-flash` |

`GWEN` is retained as the configured secret alias supplied by the repository owner; the model/provider represented by that alias is Qwen. This distinction is intentional until the secret name is normalized.

## Evidence contract

Every reviewer comment must identify the exact PR head and invocation class. A model review is advisory evidence only. A model verdict or model-generated approval never substitutes for governance-drift, evidence-consistency, agent-validation, Full-System, Security, Browser/Runtime, `review-readiness`, or human authorization. Required substantive validators must pass before automatic model invocation.