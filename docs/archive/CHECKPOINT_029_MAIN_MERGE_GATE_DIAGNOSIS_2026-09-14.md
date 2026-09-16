# CHECKPOINT — 029 MAIN MERGE GATE DIAGNOSIS

**Date:** 2026-09-14  
**Ledger:** Issue #278  
**Diagnostic record:** Issue #314 TODO #8  
**Status:** DIAGNOSED  
**No 029-release claim.**

## Purpose

Investigate whether GitHub's active protection/ruleset for `main` actually enforces the repository's documented PR and validation discipline.

This checkpoint is **not a secondary `Masterplan/MASTERPLAN.md`**, not a replacement for Product Law, Vision, Issue #278, Issue #284, Policy/ORUCAVEAM, Skill Wiring, or the governance validator. It records control-plane evidence only. It does **not** modify the GitHub ruleset.

## Observed GitHub ruleset

Exactly one repository ruleset applies to `main`:

- **id:** `22304846`
- **name:** `Main Merging AI Protection`
- **target:** `refs/heads/main`
- **enforcement:** `active`
- **bypass_actors:** none
- **current_user_can_bypass:** `never`

GET payload `rules` currently:

1. `pull_request` — required PR; `required_approving_review_count: 0`; allowed methods `merge` / `squash` / `rebase`
2. `required_status_checks` — contexts `evidence-consistency`, `agent-validation`, `governance-drift` (GitHub Actions integration `15368`); `strict_required_status_checks_policy: false`
3. `non_fast_forward`
4. `code_scanning` — CodeQL, alerts threshold `errors`, security alerts `high_or_higher`

Rule-suite evaluations additionally report a `code_quality` rule as `active` even though that type is **not** listed in the GET `rules` array. Observed suites did **not** evaluate an unattributed-change extra-approval rule.

Correction vs the preliminary #320 record: the earlier wording listed “unattributed-change extra-approval” and a standalone “code-quality severity threshold” as GET-visible rules. Those are **not** in the current GET `rules` inventory. `code_quality` is still observed at evaluation time; unattributed-change is not.

## Workflow check contexts actually published

| Workflow file | Workflow `name` | Job `name` / check context |
|---|---|---|
| `.github/workflows/governance.yml` | TeamAi Governance | `governance-drift` |
| `.github/workflows/governance.yml` | TeamAi Governance | `evidence-consistency` |
| `.github/workflows/governance.yml` | TeamAi Governance | `agent-validation` |
| `.github/workflows/TeamAi.yml` | TeamAi | `Recovery integrity` |
| `.github/workflows/TeamAi.yml` | TeamAi | `Project tests + canonical package` |
| `.github/workflows/playwright.yml` | Playwright browser verification | `Playwright browser verification` |
| `.github/workflows/codeql.yml` | CodeQL | CodeQL analyze / CodeQL |

The GitHub-required status-check contexts match the **job names**, not the `TeamAi / …` prefix documented in `docs/GOVERNANCE_FAIL_CLOSED.md`.

`docs/GOVERNANCE_FAIL_CLOSED.md` currently says the ruleset must require:

```text
TeamAi / governance-drift
TeamAi / evidence-consistency
TeamAi / agent-validation
```

The live ruleset and live check runs use the bare job names. That prefix is a **documentation naming discrepancy**, not evidence that the three governance jobs are unenforced.

## Canonical document comparison

### `docs/GOVERNANCE_FAIL_CLOSED.md` — GitHub enforcement contract

This document is the specific ruleset inventory. It requires exactly the three governance jobs on `main`. It does **not** list `Project tests + canonical package` or `Playwright browser verification` as GitHub-required status checks.

Relative to this document, omitting Playwright and project tests from the ruleset is **CURRENT / ALIGNED**.

### Issue #133 — merge-discipline contract

Issue #133 item 2 says a PR may merge only when **required checks pass**, including “TeamAi project validation and, **when applicable**, Playwright/browser verification and other configured required checks.”

That is broader than the GitHub-required context list. Relative to Issue #133, GitHub will not technically block a merge whose Playwright or project-test job failed if the three governance checks are green.

### Agent / contribution procedure

`docs/AGENT_SLICE_EXECUTION.md`, `skills/governance/pr-squash-merge/SKILL.md`, and `skills/workspace/ws.contribution.flow/SKILL.md` still require agents not to merge on failed applicable verification. GitHub Actions is a verification surface, not product authority (`Product_Law/PRODUCT_LAW.md`).

## Hidden-enforcement question

No second repository ruleset exists. `get_rules_for_branch(main)` returns the same `22304846` source for pull-request, required-status-checks, non-fast-forward, and code-scanning.

Direct-push attempts to `main` are blocked. Rule suite `4053630407` (`teamaiofficialph`, 2026-09-13) **failed** with:

- `pull_request` fail — “Changes must be made through a pull request.”
- `required_status_checks` fail — “3 of 3 required status checks are expected.”
- `code_scanning` fail — waiting for CodeQL
- `code_quality` pass
- `non_fast_forward` pass

Playwright and `TeamAi.yml` jobs were **not** among the failing required rules. They are therefore **not** a hidden GitHub-required check.

## Recent merge behavior

Observed `main` rule suites on 2026-09-14 (including the #320 merge `1a327a364b129189f51f8c6ecbbdfef857985710`) evaluated `pass` for pull-request, the three required status checks, code scanning, code quality, and non-fast-forward.

PR #320 itself published both `Project tests + canonical package` and `Playwright browser verification` as successful check runs, but those contexts are not GitHub-required. This diagnosis did not observe a merged PR whose Playwright or project-test job had failed. The bypass is therefore a **technical capability**, not a proven used path.

`strict_required_status_checks_policy: false` means GitHub does not require the PR head to be up to date with `main` before those three required checks count.

## Answers to the diagnostic questions

1. **Is omitting TeamAi/Playwright intentional, or drift?**  
   Intentional **relative to** `docs/GOVERNANCE_FAIL_CLOSED.md`. A **control gap candidate relative to** Issue #133 item 2. Not proven accidental.

2. **Is there another hidden mechanism?**  
   No second ruleset. PR-only + three governance contexts + CodeQL (+ evaluated `code_quality`) are what GitHub enforces. Playwright/project tests execute as workflows only.

3. **Can a PR merge with TeamAi or Playwright failed while governance is green?**  
   **Yes, technically**, via GitHub's current required-check list. Agent merge policy forbids it. Not observed in the sampled 2026-09-14 suites.

4. **Must those checks be GitHub-required, or merely executed?**  
   Two layers exist and currently disagree in breadth: GOVERNANCE_FAIL_CLOSED = GitHub-required three governance jobs; Issue #133 = those plus project validation and Playwright when applicable as merge-discipline. This diagnosis does not collapse the two layers.

5. **Canonical owner for any ruleset change?**  
   **Issue #133.** High-impact validation-change requires source-of-truth approval (#133 §4). Issue #314/#278 must not edit the ruleset. Do not invent or weaken a required-check contract from this record.

## Classification

**REQUIRES GOVERNED RECONCILIATION / CONTROL GAP CANDIDATE**

Broken down:

| Layer | Classification |
|---|---|
| Three governance jobs GitHub-required | **CURRENT** vs `GOVERNANCE_FAIL_CLOSED.md` (job names match; `TeamAi /` prefix is stale wording) |
| Playwright + project tests not GitHub-required | **INTENTIONAL** vs `GOVERNANCE_FAIL_CLOSED.md`; **CONTROL GAP** vs Issue #133 item 2 |
| PR-only / non-fast-forward / no bypass | **CURRENT** (direct-push suites fail) |
| `TeamAi /` documented prefix vs bare job names | **DOCUMENTATION DISCREPANCY** — do not rename live checks to chase the prefix |
| `strict_required_status_checks_policy: false` | recorded; not classified as a defect here |

Safe remediation options (owner decision on #133, not this slice):

- A. Add `Project tests + canonical package` and `Playwright browser verification` as GitHub-required contexts so technical enforcement matches Issue #133.
- B. Keep the three GitHub-required governance jobs and clarify Issue #133 / `GOVERNANCE_FAIL_CLOSED.md` that Playwright and project tests are agent-discipline / executed workflows, not GitHub-required contexts.
- C. Fix only the `TeamAi /` prefix wording to the live job names.

This slice implements none of A–C.

## Non-assumptions

- Do not change the ruleset from this diagnostic record.
- Do not invent a required-check contract the canonical governance documents do not authorize.
- Do not weaken or rename existing required checks merely to make the gate appear complete.
- Do not equate an inaccessible legacy branch-protection endpoint with absence of protection; the active ruleset is directly observable.
- Do not create a second merge policy in this document.
- Do not claim 029 released, TEAM-BACKEND-001 complete, or C9 acceptance.

## Related authorities

- `Product_Law/PRODUCT_LAW.md`
- `Masterplan/MASTERPLAN.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `docs/GOVERNANCE_FAIL_CLOSED.md`
- `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md`
- `docs/AGENT_SLICE_EXECUTION.md`
- `skills/governance/pr-squash-merge/SKILL.md`
- Issue #278
- Issue #314
- Issue #133
