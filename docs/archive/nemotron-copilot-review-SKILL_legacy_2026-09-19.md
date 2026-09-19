# Legacy Named-Reviewer Compatibility Skill

**Role:** reusable advisory procedure for model-assisted pull-request review through the repository's controlled GitHub Actions workflow.

## Authority boundary

This Skill does not create Product Law, grant merge authority, replace human review, or override governance validators. It operates below `Product_Law/PRODUCT_LAW.md`, `POLICY.md`, the Masterplan, and the owning Issue/PR contract.

## Procedure

1. Resolve the exact PR number, base SHA, and head SHA.
2. Wait for the required **substantive execution check-runs** to complete successfully for that exact head before invoking the model. The controlled workflow currently requires `governance-drift`, `evidence-consistency`, `agent-validation`, `Recovery integrity`, `Project tests + canonical package`, `CodeQL analyze (javascript-typescript)`, and `Playwright browser verification`.
3. Do **not** wait on `review-readiness` as part of this model gate. `review-readiness` is the separate human authorization/promotion gate and may fail legitimately while no independent approval exists.
4. Build the review packet from the exact-head PR metadata and complete bounded `base...head` diff, plus current governing documents, the governing Issue state, and exact-head GitHub Actions execution evidence.
5. Apply the canonical authority path: Product Law → Masterplan → POLICY/ORUCAVEAM → Skill wiring → applicable Skills → Issue → PR.
6. Separate implementation defects, governance discrepancies, documentation discrepancies, Issue-state discrepancies, verification gaps, and non-blocking observations.
7. Never infer passing evidence from skipped jobs, stale workflow attempts, synthetic merge refs, local assumptions, or the PR description alone.
8. Never recommend weakening a validator merely to obtain green CI.
9. Post the model result as advisory evidence tied to the exact head and identify the execution-gate boundary.
10. Approval is an explicit, separately authorized model action only. It is never automatic on ordinary PR events, and a model-generated approval never satisfies TeamAi's human review-readiness requirement. An authorized workflow dispatch may request the model approval after the model returns `APPROVE`; repository branch protection and human governance remain authoritative.

## Execution-evidence gate

GitHub Actions starts validator workflows concurrently, so the Nemotron workflow performs a separate **exact-head check-run gate** rather than depending on an entire validator workflow's final state. This distinction is required because `Repository Governance Integrity` contains both substantive validation jobs and the separate `review-readiness` human-authorization job. The Nemotron gate requires only the substantive validator check-runs listed above.

For each required check-run, the workflow accepts only `completed / success` for the exact PR head SHA. Missing, queued, in-progress, skipped, cancelled, failed, or head-mismatched checks do not pass. A failed required check fails the Nemotron job; pending checks are polled; timeout fails closed. A PR head change aborts the gate so the model cannot review a stale revision.

The resulting packet includes exact-head check-run evidence, current governing-file contents at that head, and live Issue state resolved from an explicit Issue reference in the PR. An open Issue is never represented as resolved merely because a PR satisfies a subset of its work. Missing or materially truncated governance, Issue, or execution context forces `ADVISORY_ONLY` rather than `APPROVE`.

## Lifecycle policy

- **Draft PRs:** do not automatically invoke the compatibility workflow. Manual /openrouter-free review remains available through the active advisory workflow.
- **Legacy compatibility dispatch:** explicit workflow dispatch may invoke one free-router review against the exact current head.
- **No model-specific approval:** the former Nemotron-only model approval path is retired because the dynamic router does not guarantee a Nemotron model.
- Every model review is advisory and must identify the exact PR head. A later head change makes the previous model analysis stale for promotion purposes, but does not itself trigger another automatic review.

## Security boundaries

- `OPENROUTER_API_KEY` is read only from GitHub Actions Secrets.
- PR code is checked out at the exact PR head and is never executed as part of the Nemotron packet-building job; execution evidence comes from separate repository validators.
- Fork pull requests do not receive the secret through the automatic review trigger.
- Issue-comment invocation is restricted to repository collaborators/owners/members.
- The review packet is bounded in size and must not include GitHub Actions secrets.
- Model output is untrusted analysis, not executable instructions.

## Model

The legacy compatibility workflow now routes through the OpenRouter Free Router using openrouter/free. It no longer asserts a specific model identity or permits model-specific approval.

## Evidence contract

Every review comment must identify the exact PR head. A model review is advisory evidence only. A green model verdict or model-generated approval does not substitute for governance-drift, evidence-consistency, agent-validation, Full-System, Security, Browser/Runtime, review-readiness, or human authorization. Required substantive validators must pass before the model is invoked; `review-readiness` remains a separate human authorization gate.

The automatic-review budget is a quota-protection mechanism, not an evidence claim: one automatic review per PR is the default, while deliberate manual re-review remains available when a later head materially changes the work.
