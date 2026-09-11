# Skill: user-directed-validation

**Status:** Active governance skill (Issue #260)  
**When to use:** User request conflicts with tests, Playwright, governance validators, CI gates, active indexes, skills routing, acceptance criteria, or evidence requirements — or when retiring a product concept after merge.

## Authority

- `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` (canonical)
- `docs/GOVERNANCE_FAIL_CLOSED.md`
- `docs/archive/superseded/INDEX.md`
- Product Law / ORUCAVEAM

## Action

1. Classify **A** (drift) vs **B** (intentional truth change).
2. If validation surfaces must change → emit **VALIDATION CHANGE WARNING** before edits.
3. Update **contract + active indexes** with implementation (no index truncation).
4. Update validation to enforce the **new** truth (e.g. assert absence of retired cameras).
5. On retirement: add archive record + INDEX row + compact active redirect.
6. After merge: treat merged state as **current truth** until deliberately superseded.

## Do not

- Weaken or skip `governance-drift` / `evidence-consistency` to go green.
- Resurrect archived concepts to satisfy old tests.
- Rewrite historical evidence.
- Delete recovery/numeric contracts without retain **or** redirect.
- Self-authorize high-impact validation-boundary changes (need human/source-of-truth approval; PR #132).

## Pass

Warning recorded; contracts and gates agree; CI fail-closed still holds; archive/redirect present when concepts are retired.
