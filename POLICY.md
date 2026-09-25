# POLICY — ORUCAVEAM execution discipline

**Role:** execution policy only. Product meaning belongs to `Product_Law/PRODUCT_LAW.md`. Procedures belong to `skills/**/SKILL.md`. Current slice belongs to `Masterplan/NEXT_SLICES.md`.

## 2026-09-21 spatial PR migration checkpoint

PR #398 is the reviewed 029 structural baseline merged into `main`. Current production-data/runtime work continues under Issue #401 / PR #402 on `backend/030-production-runtime-evidence`. It was created from exact PR #397 head `23a83ae166f0983b598910d616b1203ebf600096`; #397 is closed and historical. The active spatial renderer ownership is now `frontend/spatial/machine-world-renderer.js` → `public/machine-world-renderer.js`, while `public/hero-flex.js` remains the controller boundary.

## 2026-09-22 production-runtime successor checkpoint

Reviewed PR #398 has merged into `main` at `87f466fb0edac3784280128785a8fd2dc757e749`. Issue #401 / successor PR #402 now owns the production Firestore authority, security, and runtime-evidence frontier. This is a current routing clarification only; it does not change Product Law authority or the draft-first/no-auto-merge discipline.

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
Repository Governance Integrity lifecycle concurrency is keyed to the PR identity (or protected ref for push), so a newer PR event supersedes stale governance executions. Exact-head validation remains enforced inside each run and stale runs do not become current-state evidence.

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
- When a PR becomes Ready for review, the required substantive validation set must be current on the exact head and `review-readiness` evaluates the review/authorization conditions for the promotion/merge path. Submitted or dismissed human review events also re-trigger the same exact-head readiness evaluation.
- A `pull_request_review` submission or dismissal may re-trigger `review-readiness` so late approval or dismissal state is reflected without changing the exact-head authorization rule.
- A skipped downstream job is never evidence that the skipped condition passed.
- **Required checks, evidence, canonical synchronization, and review-readiness must all pass before the PR is treated as a merge candidate or authorized for merge.** They are not a prerequisite for the Ready-for-review transition itself, because `review-readiness` is evaluated after that transition.
- **Auto-merge is not used or relied upon for product changes.**
- A PR may contain multiple related commits and multiple checklist items.
- One slice is not required to equal one PR or one merge.
- `main` changes through governed PRs only.

### Model-review sequence discipline

The advisory reviewer uses provider/model-native generation and reasoning controls rather than a TeamAi-imposed generation ceiling. TeamAi keeps only the structured evidence contract bounded: three concise items per section at 400 characters each, with authority-first packet selection. Provider HTTP 200, generation-limit truncation, unavailable routed-model provenance, and provider error payloads are terminal evidence states, not merge blockers; transport success, publication, provenance, completeness, and quality remain separate signals.
Model-assisted advisory review is a bounded verification resource. The automatic path is one provider-consuming five-slot sequence per exact PR head: OpenRouter Free Router → 5 parallel credential-isolated slots → 2-second launch stagger, capped at an 8-second spread. Each provider call has a 300-second wall-clock fail-closed and each reusable runner job has a 35-minute outer timeout; timeout is terminal slot evidence, not a retry signal.
The workflow run is the sequence boundary and structured terminal slot artifacts are the execution state. PR comments are publication/evidence only and are never read as orchestration state. A later corrected head may establish a new sequence; the same exact head may not consume another provider sequence.
Each slot uses its dedicated credential alias, revalidates the original triggering head immediately before provider invocation, and fails closed on drift. Provider failure is terminal slot evidence and never authorizes secret substitution or replacement calls. Automatic provider failures are recorded in the structured slot artifact and do not become provider-success claims; the orchestration may complete once every slot reaches a terminal state, while sequence completion remains distinct from provider success. Automatic sequence concurrency is isolated by PR exact head, so a duplicate lifecycle event for the same exact head cannot cancel a live sequence before its provider fan-out is recorded.


### Reviewer billing boundary
The automatic advisory path uses the manifest-defined `openrouter/free` route and five credential-isolated slots. `.github/teamai/authority-manifest.yml` is the single source for slot identity, credential aliases, and launch timing; workflows and Skills consume or validate that registry rather than maintaining duplicate alias tables. Aliases identify credentials only. The selected model/provider is dynamic runtime evidence. Cost status and provider data-use terms remain separate concerns.


### Runtime-repair evidence boundary

A reusable advisory-review transport or parser repair is a Verification & CI/Browser implementation concern, not a new authority layer. Configuration presence, static workflow consistency, and successful non-provider validators do not constitute provider runtime proof. The runtime-proof claim requires a fresh eligible exact-head lifecycle event after the repaired runner is governed, with observed provider invocation and terminal slot evidence. The diagnostic #370 parser failure and stale-head containment remain historical evidence for that specific proof vehicle.
The reusable runner path is `.github/workflows/ai-advisory-review-runner.yml`. It is `workflow_call`-only, so direct push is not an advisory invocation and does not enter the provider runner.

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

## 2026-09-24 029 spatial acceptance correction boundary

PR #404 remains a Draft implementation vehicle under the 029 lineage while the canonical current slice remains controlled by `Masterplan/NEXT_SLICES.md`. The exact head `965f0fb7db1ccf85fca8e30e7790d5f48404f768` contains a structural geometry correction rather than a validator-only workaround: the shared world profile provides explicit Seat-shell and outer-housing safety envelopes, the authored S4 division fan is preserved, and S5 evaluates its authored travel against outer housings and sibling Pods. The corresponding source-contract assertions now follow the current S5 renderer ownership.

The correction is considered **implemented, not yet verified** until exact-head Full-System and Browser validators complete successfully. Governance synchronization is required because the PR changes governed spatial records. A green check may prove only the contract it runs; it does not close 029, establish deployment, or authorize merge.

## Model-assisted review
The shared AI Advisory Review Skill plus the automatic OpenRouter Free Router sequence are advisory verification aids. They may inspect an exact PR diff and post model-generated findings. They do not create authority, replace required CI, replace human review, or upgrade a claim from verified to accepted. Before automatic invocation, the reviewer gate waits for the required substantive exact-head validator check-runs to complete successfully. Each automatic sequence then fans out to five parallel OpenRouter Free Router slots, records routed model/provider provenance in terminal slot artifacts, and waits for all five slot jobs to reach terminal workflow state before evaluating sequence completion. The runner requires provider parameter support, non-streaming structured output, and response healing; failures remain explicit slot evidence.
The automatic advisory sequence is synchronized across the active workflow, Policy, Skill wiring, advisory Skill, Masterplan, current slice, Product Law wiring, and session snapshot. The canonical structural validator enforces five aliases, the fixed openrouter/free route, no model-specific approval inputs, artifact-backed terminal state, and retired-surface removal. A passing test proves only the contract it exercises. Deployment, browser output, screenshots, CI, and model analysis are evidence and do not independently change product authority.

## Evidence discipline

Distinguish:

`specified ≠ implemented ≠ verified ≠ runtime-proven ≠ completed ≠ accepted`

A passing test proves only the contract it exercises. Deployment, browser output, screenshots, and CI are evidence and do not independently change product authority. A model review may analyze evidence but cannot manufacture missing execution proof or treat an open Issue as resolved.

<!-- #361 reconciliation: merged semantic topology/adaptive clearance; runtime-proof frontier remains open. -->

### Draft proof target parser boundary

The `Draft proof target` is a required PR proof contract. Its parser must recognize the repository's canonical level-2/3 Markdown section heading, including `### Draft proof target`, and must not require contributors to distort the PR structure to satisfy a parser implementation detail.


## 3D world authority and census enforcement

The 3D world has no independent Product Law or merge authority. Its Tree Authority XML, Machine Interaction Contract, implementation entry, and four-file Tree Census are subordinate structural records under Product Law, Masterplan, Policy, and the active 029 Issue.

Governance Integrity must machine-check this structural record and execute the existing census synchronization contract against the full PR diff. Semantic tree/branch/division changes therefore cannot silently bypass Census reconciliation. Presentation-only proof modules remain outside Census synchronization only while they remain presentation-only and do not change semantic identity or structure.

A passing structural audit establishes governance consistency only. It does not promote a tree, prove browser behavior, establish backend authority, satisfy C8/C9/C10, or authorize acceptance or merge.


## Canonical current-slice consumption

The current execution slice is owned exclusively by `Masterplan/NEXT_SLICES.md`. Policy and downstream validators/procedures must **consume that canonical current-slice record rather than hard-code a specific Issue number**. Historical Issue/PR identifiers may appear as evidence, but they do not become current execution authority merely by being mentioned here.

### Advisory issue declaration control

The advisory reviewer pipeline treats `Owning Issue: #N` / `Governing Issue: #N` as machine-readable metadata. Automatic fan-out validates this declaration once before provider execution, and `Owning Issue: none` or `n/a` is an explicit valid no-issue state. Provider/model reviews remain advisory evidence and do not authorize merge, acceptance, or release.
