# TeamAi — When to open a GitHub Issue

**Status:** OPERATING NOTE / NOT PRODUCT LAW  
**Date:** 2026-09-04

Issues are a **lightweight tracker**. They do not grant permission, amend Product Law, or replace Masterplan / POLICY / skills / PRs.

## Prefer a PR (+ slice or skill doc) when

- Work is a bounded TEAM-EXPERIENCE-029 presentation slice
- Verification is GitHub Actions / Playwright
- The change is the implementation itself

## Open an Issue when

| Situation | Typical label |
|-----------|---------------|
| Authority / CI / delivery boundary must outlive one PR | `boundary` |
| Backend gate or domain hold needs a durable reminder | `backend-001` |
| 029 work is **blocked** or needs a decision before code | `029` |
| Docs/skills/wiring debt that keeps recurring | `docs` |
| Discrepancy/noise that must not die in chat | `noise` |

## Do not open an Issue for

- Every small PR
- Restating Product Law
- Chat-only questions already answered in freeze docs
- Turning Vercel external status into architecture failure (see cutoff / POLICY)

## Labels (keep small)

`029` · `backend-001` · `boundary` · `docs` · `noise`

Plus existing: `ci` · `deployment` when useful.

## Templates

See `.github/ISSUE_TEMPLATE/`:

- **Boundary / authority**
- **029 presentation slice**
- **Backend gate / domain**

Blank issues remain allowed for odd cases; prefer a template.

## Linking

Link PR ↔ issue only when the PR actually resolves durable debt (`Fixes #N`). Do not invent issues just to satisfy a keyword.

## Authority reminder

`PRODUCT_LAW → MASTERPLAN → POLICY/ORUCAVEAM → skills → implementation → verification → evidence`

Issues sit beside that path as memory, not above it.
