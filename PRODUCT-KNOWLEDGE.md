# TeamAi — Product Knowledge

**Status:** BASELINE KNOWLEDGE LIBRARY
**Purpose:** Retain validated, distilled lessons from TeamAi execution without becoming a second Product Law. No screenshot or generated-image evidence belongs here.

## 1. Validated Patterns [DO]

| ID | Pattern | Evidence | Applies To | Status |
|---|---|---|---|---|
| PK-BASE-001 | Canonical work should trace Product Law → Masterplan → Policy/skill → implementation → verification → handover/endorsement. | Current TeamAi governance baseline and existing implementation traceability contract. | TeamAi | BASELINE |
| PK-BASE-002 | Skill references should point to complete executable paths and deeper context should be linked with explicit `See also` references. | Baseline wiring design. | TeamAi | BASELINE |
| PK-BASE-003 | Deterministic browser verification belongs in Playwright when real browser behavior is required; deployment surfaces remain non-authoritative. | Browser verification architecture baseline. | TeamAi | BASELINE |

## 2. Anti-Patterns & Dead Ends [DONT]

| ID | Anti-Pattern | Consequence | Evidence | Never Retry Unless |
|---|---|---|---|---|
| AP-BASE-001 | Keeping duplicate execution-discipline documents when the same rules can live in Policy + skills. | Rule drift and ambiguous navigation. | Baseline reconciliation. | The authority model is explicitly changed. |
| AP-BASE-002 | Treating a skill index as the wiring authority. | Skills become difficult to resolve from canonical plan items. | Baseline reconciliation. | The skill architecture explicitly changes. |
| AP-BASE-003 | Treating screenshots as canonical proof of backend, persistence, authorization, or payment state. | Visual evidence can be mistaken for authoritative state. | Execution-policy baseline. | A future evidence policy explicitly permits it. |
| AP-BASE-004 | Using deployment suppression to conceal or bypass an expected deployment/verification problem. | Failures disappear instead of being diagnosed. | Deployment-discipline baseline. | Release policy explicitly changes. |

## 3. Contract & Dependency Gotchas

| Authority | Consumer | Gotcha | Resolution | ID |
|---|---|---|---|---|
| Product Law | Masterplan | A new feature must amend the existing canonical idea when applicable rather than append a duplicate concept. | Inspect existing logic before editing; warn on discrepancy. | PK-BASE-005 |
| Masterplan | Skills | Executable checklist items need an explicit skill path or an explicit no-skill rationale. | Route each checklist item through `docs/SKILL_WIRING.md`. | PK-BASE-006 |
| Policy | Skills | Skills describe procedure but cannot grant permission or override authority. | Permission remains in Product Law/policy/user approval. | PK-BASE-007 |

## 4. Environment & Tool Quirks

| Quirk | Impact | Workaround | ID |
|---|---|---|---|
| Vercel deployment availability can be externally constrained. | Hosted browser verification may be temporarily unavailable. | Keep source/CI verification authoritative and record hosted evidence as a separate boundary. | PK-BASE-008 |
| Firebase and external services can consume finite read/write or runtime resources. | Wasteful probing can increase cost or trigger limits. | Apply ORUCAVEAM-M minimalistic tool/resource usage while preserving authoritative verification. | PK-BASE-009 |

## 5. Evidence Rules

- Evidence must describe exactly what was exercised and where.
- Textual, reproducible evidence is preferred.
- Generated screenshots, captures, and decorative images are not canonical Product Knowledge evidence.
- A green CI run, deployment, or screenshot does not by itself prove a broader completion claim.

## 6. Learning Promotion

A lesson enters this file only after execution evidence supports it. A TeamAi-specific lesson may later become a ToolKit candidate only after validation/generalization demonstrates that the lesson applies beyond TeamAi.

## Rules

- Never use this file to redefine Product Law.
- Never store raw session logs or speculative ideas here.
- Never delete a knowledge row silently; supersede it with a reference when needed.
- Preserve the evidence path for every validated pattern.
