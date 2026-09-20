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
OpenRouter Free Router → 5 parallel slots → 2-second launch stagger; each slot uses a distinct credential alias; terminal slot outcome is explicit; actual routed model/provider recorded in the terminal slot artifact
Execution state is separate from advisory content: each slot records one terminal outcome (`SUCCEEDED`, `PROVIDER_FAILED`, `REVIEW_QUALITY_FAILED`, `REVIEW_POST_FAILED`, or `PRE_PROVIDER_FAILURE`); only a successful slot publishes advisory review content, while a failed slot publishes compact failure evidence. Execution completion does not imply advisory approval or human acceptance.
There is no inter-stage barrier or pre-sequence timer. Each reusable reviewer job has a 35-minute outer timeout and each provider call has a 300-second wall-clock fail-closed; expiry is classified terminal evidence. The first eligible non-draft lifecycle event that passes substantive exact-head validation writes a durable claim for that exact head and fans out five reusable reviewer jobs concurrently with fail-fast disabled. Each job targets openrouter/free, receives one distinct credential alias, receives the original triggering head, and independently revalidates that head immediately before model invocation. Requests use `response_format.type=json_schema`, `provider.require_parameters=true`, `stream=false`, and the `response-healing` plugin.
Concurrency is isolated by PR exact head; the same exact head never restarts after a provider-consuming fan-out has been established. A later corrected head may establish one new automatic sequence after substantive validation, while prior claims and outcomes remain immutable evidence. A provider failure is execution evidence for its slot and does not trigger secret substitution, retry through another slot, or automatic reordering. Sequence completion is a separate terminal check requiring five terminal slot outcomes.

## Manual re-review
Manual later-head review uses /openrouter-free or /free-1 through /free-5 for single-slot re-review, and /openrouter-free-all for an explicit five-slot final review after PR editing has settled. Authorized workflow dispatch targets the same openrouter/free route. Manual review is outside the automatic sequence allowance; each invocation remains advisory and exact-head bound.

## Security boundaries

- OpenRouter credential values are read only from GitHub Actions Secrets and are never printed. Each automatic slot receives only its assigned credential alias.
- PR code is checked out at the exact PR head and is not executed as part of packet construction; execution evidence comes from separate validators.
- Fork pull requests must not receive provider secrets through automatic review triggers.
- Manual issue-comment invocation is restricted to repository collaborators/owners/members.
- Review packets are bounded and secret-redacted before transmission.
- Model output is untrusted analysis, not executable instructions.

## Reviewer configuration

The authoritative slot/credential registry is `.github/teamai/authority-manifest.yml`. This Skill consumes that registry through the governed workflows and must not duplicate its alias table. The five aliases are credential identifiers only. Actual routed model/provider provenance comes from the OpenRouter response and must be recorded on successful execution.


## Evidence contract

Every reviewer comment must identify the exact PR head and invocation class. A model review is advisory evidence only. A model verdict or model-generated approval never substitutes for governance-drift, evidence-consistency, agent-validation, Full-System, Security, Browser/Runtime, `review-readiness`, or human authorization. Required substantive validators must pass before automatic model invocation.

The automatic-review budget is a provider-resource protection mechanism, not evidence of implementation or acceptance.

### Token-efficiency contract
The advisory workflow does not impose a universal generation or reasoning ceiling. Generation and reasoning limits remain provider/model-native and are reported through per-slot telemetry. Reviewer output is bounded to three concise items per section at 400 characters each, and packet selection is authority-first. Provider HTTP 200 with an error payload, generation-limit truncation, unavailable routed-model provenance, or other provider degradation remain classified terminal evidence; the workflow stays green when the outcome is classified, while the sequence summary reports transport, publication, provenance, completeness, and quality separately. Stage ordering is an orchestration invariant only; Product Law, human authorization, and merge governance remain authoritative.
