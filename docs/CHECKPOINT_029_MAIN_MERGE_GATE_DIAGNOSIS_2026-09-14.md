# CHECKPOINT — 029 MAIN MERGE GATE DIAGNOSIS

**Date:** 2026-09-14
**Ledger:** Issue #278
**Diagnostic record:** Issue #314
**Status:** DIAGNOSIS / GOVERNANCE MERGE-GATE INVESTIGATION
**No 029-release claim.**

## Purpose

Investigate whether GitHub's active protection/ruleset for `main` actually enforces the repository's documented PR and validation discipline.

This checkpoint is **not a secondary `MASTERPLAN.md`**, not a replacement for Product Law, Vision, Issue #278, Issue #284, Policy/ORUCAVEAM, Skill Wiring, or the governance validator. It records control-plane evidence only.

## Observed GitHub ruleset

The repository exposes an active ruleset named **Main Merging AI Protection** targeting `refs/heads/main`.

Current rules include:

- non-fast-forward protection;
- pull-request requirement with zero required approving reviews;
- unattributed-change extra-approval requirement;
- code-quality severity threshold `errors`;
- required status checks: `evidence-consistency`, `agent-validation`, `governance-drift`;
- CodeQL code-scanning threshold at high-or-higher alerts / errors;
- no configured bypass actors, and current user bypass is `never`.

## Material discrepancy to diagnose

The active ruleset does **not** currently require the repository's main `TeamAi` project test context or the `Playwright browser verification` context as required status checks.

Therefore distinguish:

`workflow executes` != `workflow passes` != `GitHub merge gate requires the workflow`

The repository has documented expectations that implementation changes be validated by project tests and browser verification, but GitHub's active `main` ruleset currently makes only the governance contexts and CodeQL explicit required checks.

## Questions

1. Is the omission of TeamAi and Playwright intentional, or is it a governance drift?
2. Are those checks enforced through another repository/ruleset mechanism not visible in the accessible ruleset response?
3. Does any current merge path permit a PR to merge with TeamAi or Playwright failed while the required governance checks remain green?
4. Does the documented governance/merge discipline require these checks to be GitHub-required, or merely executed and recorded?
5. What is the safest canonical owner for a decision to change the GitHub ruleset?

## Non-assumptions

- Do not change the ruleset from this diagnostic PR.
- Do not invent a required-check contract that the canonical governance documents do not authorize.
- Do not weaken or rename existing required checks merely to make the gate appear complete.
- Do not equate an inaccessible legacy branch-protection endpoint with absence of protection; the active ruleset is directly observable.
- Do not create a second merge policy in this document.

## Verification protocol

`current main ruleset → documented governance expectations → workflow names/contexts → recent merged PR validation behavior → bounded control classification → canonical owner for any remediation`

## Current classification

**REQUIRES GOVERNED RECONCILIATION / CONTROL GAP CANDIDATE**

The evidence is sufficient to establish that TeamAi and Playwright are not among the explicitly required status checks in the active `main` ruleset. It is not yet sufficient to declare that this is an accidental bypass path without checking the governing documents and any additional enforcement mechanism.

## Related authorities

- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md`
- `docs/TEAMAI_029_CURRENT_STATE_MAP.md`
- Issue #278
- Issue #314
- Issue #133
