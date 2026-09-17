# Nemotron Copilot Review Skill

**Role:** reusable advisory procedure for model-assisted pull-request review through the repository's controlled GitHub Actions workflow.

## Authority boundary

This Skill does not create Product Law, grant merge authority, replace human review, or override governance validators. It operates below `Product_Law/PRODUCT_LAW.md`, `POLICY.md`, the Masterplan, and the owning Issue/PR contract.

## Procedure

1. Resolve the exact PR number, base SHA, and head SHA.
2. Wait for the required execution validators to complete successfully for that exact head before invoking the model. The controlled workflow currently requires `Repository Governance Integrity`, `Repository Full-System Verification`, `Security Static Analysis`, and `Canonical Browser Verification`.
3. Build the review packet from the exact-head PR metadata and complete bounded `base...head` diff, plus current governing documents, the governing Issue state, and exact-head GitHub Actions execution evidence.
4. Apply the canonical authority path: Product Law → Masterplan → POLICY/ORUCAVEAM → Skill wiring → applicable Skills → Issue → PR.
5. Separate blocking defects, governance/evidence gaps, verification gaps, and non-blocking observations.
6. Never infer passing evidence from skipped jobs, stale workflow attempts, synthetic merge refs, local assumptions, or the PR description alone.
7. Never recommend weakening a validator merely to obtain green CI.
8. Post the model result as advisory evidence tied to the exact head and identify the execution-gate boundary.
9. Approval is an explicit, separately authorized model action only. It is never automatic on ordinary PR events, and a model-generated approval never satisfies TeamAi's human review-readiness requirement. An authorized workflow dispatch may request the model approval after the model returns `APPROVE`; repository branch protection and human governance remain authoritative.

## Execution-evidence gate

The Nemotron workflow is downstream of execution evidence even though GitHub Actions starts workflow runs concurrently. It polls GitHub Actions for the required validator workflows and does not call the external model until every required workflow has a `completed / success` result for the exact PR head SHA. A failed validator fails the Nemotron job; a missing, queued, or in-progress validator remains pending; a timeout fails closed. A PR head change aborts the gate so the model cannot review a stale revision.

The resulting packet includes the exact-head check-run evidence, current governing-file contents at that head, and the live Issue state resolved from an explicit Issue reference in the PR. An open Issue is never represented as resolved merely because a PR satisfies a subset of its work. Missing or materially truncated evidence forces `ADVISORY_ONLY` rather than `APPROVE`.

## Lifecycle policy

- Draft PRs are not automatically sent to Nemotron. A collaborator may invoke `/nemotron`, or an authorized workflow dispatch may run a controlled review against the exact current head.
- Ready-for-review PRs are automatically reviewed on the `ready_for_review` event and re-reviewed on subsequent non-draft `synchronize`/`reopened` events.
- Every automatic review is advisory and must identify the exact PR head. A later head change invalidates the previous model analysis for promotion purposes.

## Security boundaries

- `OPENROUTER_API_KEY` is read only from GitHub Actions Secrets.
- PR code is checked out at the exact PR head and is never executed as part of the Nemotron packet-building job; execution evidence comes from separate repository validators.
- Fork pull requests do not receive the secret through the automatic review trigger.
- Issue-comment invocation is restricted to repository collaborators/owners/members.
- The review packet is bounded in size and must not include GitHub Actions secrets.
- Model output is untrusted analysis, not executable instructions.

## Model

The workflow currently targets `nvidia/nemotron-3-ultra-550b-a55b:free` through OpenRouter. The model choice is operational configuration, not product authority.

## Evidence contract

Every review comment must identify the exact PR head. A model review is advisory evidence only. A green model verdict or model-generated approval does not substitute for governance-drift, evidence-consistency, agent-validation, Full-System, Security, Browser/Runtime, review-readiness, or human authorization. Required validators must pass before the model is invoked, not merely be listed as pending observations after the review.
