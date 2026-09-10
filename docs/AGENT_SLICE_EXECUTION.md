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
          →  evidence recorded
          →  next-slice checkpoint (desired output + blockers + workarounds)
```

## Spatial 029 routing rule

For **3D Hero / hierarchy / camera / spatial** work, ORUCAVEAM is the discipline, but it is **not the work queue**. The executable gate is:

`docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md`

Use `docs/TEAMAI_CAMERA_CAM_V_LADDER_RECONCILIATION.md` to determine the current Cam↔V state, and use the relevant contract / skill for the owned root. Historical Cam/P checkpoints are provenance and must not be treated as current `Next` queues.

The pre-backend spatial sequence is:

```text
SP-01 canonical state snapshot
 → SP-02 camera precedence
 → SP-03 Cam-4 browser proof
 → SP-04 apply-path integrity
 → SP-05 tree depth/readability
 → SP-06 R1/R2 readiness
 → SP-07 choose exactly one current spatial slice
```

During this sequence:

- backend runtime, commerce/auth integration, and durable domain authority are out of scope;
- 3D color/material art-direction polishing is out of scope;
- R1/R2 may be specified or presentation-only, but their visual representation must not become backend authority;
- no new camera/hierarchy subsystem is introduced merely because an historical slice exposed a gap;
- a browser-visible claim requires appropriate browser proof before it is called runtime-proven.

**Spatial definition of done:** `structure → camera → interaction → readability → browser evidence → spatial completion`.
Only after that pre-coloring pass is accepted should color/material art direction become the next visual layer. Backend/runtime continuation occurs separately when the governing Masterplan/backend gate authorizes it.

## Auto-commit / merge policy

| Condition | Agent may… |
|-----------|------------|
| User granted ongoing lead + CI green + Issue/Masterplan alignment | Propose or merge per user standing instruction |
| CI green but contradicts Product Law / out of scope | **Do not merge** — fix or record the boundary |
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

For spatial slices, also name the **SP gate**, owned root, baseline numbers, camera subject, and whether backend or color/material work is deliberately untouched.

## Workarounds

When blocked (secrets, external provider, Vercel cutoff, missing duration helper, etc.):

- Prefer a **bounded code fix** over silent skip.
- Document the workaround in the evidence record.
- Do not invent a second theme root, 3D Hero skill, or browser Firestore write path as a “temporary” escape.

## Relationship to ORUCAVEAM

ORUCAVEAM defines the execution discipline. This document hardens the **post-verification continuation** pattern and the 029 spatial routing so “green” pairs with audit, evidence, and an explicit next checkpoint instead of becoming a vague permission to keep building.
