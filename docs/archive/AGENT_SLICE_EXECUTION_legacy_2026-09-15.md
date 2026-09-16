# TeamAi — Agent slice execution contract

**Status:** OPERATING CONTRACT / NOT PRODUCT LAW  
**Date:** 2026-09-07  
**ORUCAVEAM link:** Complements `skills/execution/orucaveam/SKILL.md` (especially A / V / A-Audit / M). Does not grant permission.

## Problem this solves

Green CI is **necessary** but not **sufficient** for a complete agent turn. Agents must also:

1. respect Product Law / Masterplan / Issue assumptions;
2. record **what changed and why**;
3. leave a **next-slice** checkpoint with desired output;
4. note **workarounds** when the ideal path is blocked.

## Required loop (every meaningful slice)

```text
O Objective          → one Issue or Masterplan item
R Restrictions       → out of scope + authority boundary
U User authority     → explicit approval / ongoing lead
C Canonical           → Product Law, CURRENT_STATE, skills
A Action             → smallest compliant change
V Verification       → tests / Playwright / live proof as required
E Efficiency         → minimal tools/files
A Audit              → reasons + limitations on PR or Issue comment
M Minimal resources  → no speculative second systems
```

Then:

```text
green CI  →  optional merge when user policy allows
          →  Issue evidence comment (not a second constitution)
          →  next-slice suggestion (desired output + blockers + workarounds)
```

## Auto-commit / merge policy

| Condition | Agent may… |
|-----------|------------|
| User granted ongoing lead + CI green + Issue/Masterplan alignment | Propose or merge per user standing instruction |
| CI green but contradicts Product Law / out of scope | **Do not merge** — fix or open boundary Issue |
| CI red | Fix or document blocker; do not claim COMPLETED |
| Docs-only | Still require CI when branch protection demands it |

**Green does not invent Endorsement.** Endorsement remains a separate governance step when the gate requires it.

## Required audit fields (PR body or Issue comment)

1. **Changes** — files / behaviors touched  
2. **Reasons** — why this is the smallest compliant path  
3. **Assumptions** — Product Law / Issue criteria held  
4. **Verification** — which checks passed  
5. **Limitations** — what is still presentation-only / not RUNTIME-PROVEN  
6. **Next slice** — desired output, acceptance sketch, workarounds if blocked  

## Workarounds

When blocked (secrets, external provider, Vercel cutoff, missing duration helper, etc.):

- Prefer a **bounded code fix** over silent skip.  
- Document the workaround in the Issue comment.  
- Do not invent a second theme root, 3D Hero skill, or browser Firestore write path as a “temporary” escape.

## Relationship to ORUCAVEAM

ORUCAVEAM already defines discipline letters. This document hardens the **post-verification continuation** pattern used by multi-session agents so “green” always pairs with **audit + next checkpoint**.
