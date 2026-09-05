# TeamAi — Product Knowledge

**Status:** BASELINE KNOWLEDGE LIBRARY
**Purpose:** Retain validated, distilled lessons from TeamAi execution without becoming a second Product Law. No screenshot or generated-image evidence belongs here.

## 1. Validated Patterns [DO]

| ID | Pattern | Evidence | Applies To | Status |
|---|---|---|---|---|
| PK-BASE-001 | Canonical work should trace Product Law → Masterplan → Policy/ORUCAVEAM → applicable skill(s) → implementation → verification → handover/endorsement. | Current TeamAi governance baseline and existing implementation traceability contract. | TeamAi | BASELINE |
| PK-BASE-002 | Skill references should point to complete executable paths and deeper context should be linked with explicit `See also` references. | Baseline wiring design. | TeamAi | BASELINE |
| PK-BASE-003 | Deterministic browser verification belongs in Playwright when real browser behavior is required; deployment surfaces remain non-authoritative. | Browser verification architecture baseline. | TeamAi | BASELINE |
| PK-BASE-004 | Every ORUCAVEAM letter should resolve to a small direct execution skill, and field/domain skills compose with the applicable letters instead of duplicating the execution constitution. | ORUCAVEAM baseline skill-family reconciliation. | TeamAi | BASELINE |
| PK-BASE-011 | F0–F7 is field identity only; legal boxes remain Shell · Panel · Card · Control · Navigation; F6 Status and F7 Modal are system surfaces. | 029 reconciliation + skill adaptation + theme-root foundation. | TeamAi 029 | BASELINE |
| PK-BASE-012 | Backend-owned execution facts should cross into spatial UI through an explicit typed fact contract, a read-only frontend validation/presentation layer, and a separate backend runtime authority boundary. | PR #46 typed validator, PR #47 spatial UI contract, PR #49 backend runtime-validation gate. | TeamAi 029 / TEAM-BACKEND-001 | VALIDATED TEAMAI PATTERN |

## 2. Anti-Patterns & Dead Ends [DONT]

| ID | Anti-Pattern | Consequence | Evidence | Never Retry Unless |
|---|---|---|---|---|
| AP-BASE-001 | Keeping duplicate execution-discipline documents when the same rules can live in Policy + skills. | Rule drift and ambiguous navigation. | Baseline reconciliation. | The authority model is explicitly changed. |
| AP-BASE-002 | Treating a skill index as the wiring authority. | Skills become difficult to resolve from canonical plan items. | Baseline reconciliation. | The skill architecture explicitly changes. |
| AP-BASE-003 | Treating screenshots as canonical proof of backend, persistence, authorization, or payment state. | Visual evidence can be mistaken for authoritative state. | Execution-policy baseline. | A future evidence policy explicitly permits it. |
| AP-BASE-004 | Using deployment suppression to conceal or bypass an expected deployment/verification problem. | Failures disappear instead of being diagnosed. | Deployment-discipline baseline. | Release policy explicitly changes. |
| AP-BASE-005 | Creating a duplicate M/minimal-tool skill when an existing reusable minimal-tool-use procedure already satisfies the ORUCAVEAM M requirement. | Duplicate procedures drift and agents must choose between equivalent instructions. | ORUCAVEAM skill reconciliation. | The tool/resource-use domain needs materially different behavior. |
| AP-BASE-006 | Blocking merges or claiming architecture failure because Vercel is rate-limited or disconnected from GitHub. | Non-authoritative surface becomes a false gate. | 2026-09-04 cutoff + Product Law platform authority. | Vercel is intentionally re-enabled and required for a specific browser evidence plan. |
| AP-BASE-012 | Treating a frontend validation result as backend authorization, scheduler authority, execution completion, or entitlement truth. | Presentation validation can silently become a second execution authority and misrepresent system state. | PR #46/#47 validator contract and PR #49 runtime-gate separation. | Product Law explicitly changes the authority model. |

## 3. Contract & Dependency Gotchas

| Authority | Consumer | Gotcha | Resolution | ID |
|---|---|---|---|---|
| Product Law | Masterplan | A new feature must amend the existing canonical idea when applicable rather than append a duplicate concept. | Inspect existing logic before editing; warn on discrepancy. | PK-BASE-006 |
| Masterplan | Skills | Executable checklist items need explicit ORUCAVEAM letter routing plus concrete field/domain skill paths or an explicit no-skill rationale. | Route each checklist item through `docs/SKILL_WIRING.md`. | PK-BASE-007 |
| Policy | Skills | Skills describe procedure but cannot grant permission or override authority. | Permission remains in Product Law/policy/user approval. | PK-BASE-008 |

## 4. Environment & Tool Quirks

| Quirk | Impact | Workaround | ID |
|---|---|---|---|
| Vercel deployment availability can be externally constrained or cut off from GitHub. | Hosted browser verification may be unavailable; status checks may fail. | Keep GitHub Actions + Playwright authoritative; record `VERCEL=PARKED/CUTOFF`; do not block merges on Vercel alone. | PK-BASE-009 |
| Firebase and external services can consume finite read/write or runtime resources. | Wasteful probing can increase cost or trigger limits. | Apply ORUCAVEAM-M minimalistic tool/resource usage while preserving authoritative verification. | PK-BASE-010 |

## 5. Evidence Rules

- Evidence must describe exactly what was exercised and where.
- Textual, reproducible evidence is preferred.
- Generated screenshots, captures, and decorative images are not canonical Product Knowledge evidence.
- A green CI run, deployment, or screenshot does not by itself prove a broader completion claim.
- A red Vercel badge during cutoff is not a TeamAi architecture failure.
- Deterministic frontend/runtime validation does not prove live external-service completion unless the relevant external environment was actually exercised.

## 6. Learning Promotion

A lesson enters this file only after execution evidence supports it. A TeamAi-specific lesson may later become a ToolKit candidate only after validation/generalization demonstrates that the lesson applies beyond TeamAi.

## Rules

- Never use this file to redefine Product Law.
- Never store raw session logs or speculative ideas here.
- Never delete a knowledge row silently; supersede it with a reference when needed.
- Preserve the evidence path for every validated pattern.
