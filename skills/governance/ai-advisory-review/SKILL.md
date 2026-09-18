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
OpenRouter Free Router → 5 parallel slots → no inter-slot interval; terminal slot outcome is explicit; actual routed model/provider recorded on successful review
Execution state is separate from advisory content: each slot records one terminal outcome (`SUCCEEDED`, `PROVIDER_FAILED`, `REVIEW_POST_FAILED`, or `PRE_PROVIDER_FAILURE`); only a successful slot publishes advisory review content, while a failed slot publishes compact failure evidence. Execution completion does not imply advisory approval or human acceptance.
There is no automatic interval before or between slots. The first eligible non-draft lifecycle event that passes substantive exact-head validation writes the durable one-sequence claim and fans out five reusable reviewer jobs concurrently with fail-fast disabled. Each job targets openrouter/free, receives the original triggering head, and independently revalidates that head immediately before model invocation.
The sequence does not restart on synchronize or reopen after a claim exists. A provider failure is execution evidence for its slot and does not trigger secret substitution, retry through another slot, or automatic reordering. Sequence completion is a separate terminal check requiring five terminal slot outcomes.

## Manual re-review
Manual later-head review uses /openrouter-free or /free-1 through /free-5 and authorized workflow dispatch. Manual review is outside the automatic sequence allowance and uses the same openrouter/free route. Each manual invocation remains advisory and exact-head bound.

## Security boundaries

- Provider API keys are read only from GitHub Actions Secrets and are never printed.
- PR code is checked out at the exact PR head and is not executed as part of packet construction; execution evidence comes from separate validators.
- Fork pull requests must not receive provider secrets through automatic review triggers.
- Manual issue-comment invocation is restricted to repository collaborators/owners/members.
- Review packets are bounded and secret-redacted before transmission.
- Model output is untrusted analysis, not executable instructions.

## Reviewer configuration
| Reviewer slot | Secret | OpenRouter route | Cost class | Automatic stage |
| OpenRouter Free Slot 1 | OPENROUTER_API_KEY | openrouter/free | Free | 1 |
| OpenRouter Free Slot 2 | OPENROUTER_API_KEY | openrouter/free | Free | 1 |
| OpenRouter Free Slot 3 | OPENROUTER_API_KEY | openrouter/free | Free | 1 |
| OpenRouter Free Slot 4 | OPENROUTER_API_KEY | openrouter/free | Free | 1 |
| OpenRouter Free Slot 5 | OPENROUTER_API_KEY | openrouter/free | Free | 1 |
OpenRouter documents openrouter/free as a dynamic router over currently available free models. Because the selected model can change, the runner must record the actual model and provider returned by the API rather than assigning a fixed reviewer identity. The one-sequence quota remains capped at five automatic HTTP requests.

## Evidence contract

Every reviewer comment must identify the exact PR head and invocation class. A model review is advisory evidence only. A model verdict or model-generated approval never substitutes for governance-drift, evidence-consistency, agent-validation, Full-System, Security, Browser/Runtime, `review-readiness`, or human authorization. Required substantive validators must pass before automatic model invocation.

The automatic-review budget is a provider-resource protection mechanism, not evidence of implementation or acceptance. Stage ordering is an orchestration invariant only; Product Law, human authorization, and merge governance remain authoritative.
