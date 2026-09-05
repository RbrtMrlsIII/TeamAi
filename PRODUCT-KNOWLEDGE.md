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
| PK-WF-001 | Web AI responsibility is best modeled as a responsibility profile rather than a simple provider/model assignment. | Product Law population-to-seat model merged in PR #51. | Web AI Team | VALIDATED TEAMAI PATTERN |
| PK-WF-002 | The canonical frontend/backend seam is an Application Integration & Contract Field that reconciles facts and contracts without becoming a second backend or frontend authority. | Product Law Development Fields model merged in PR #51. | Frontend + Backend | VALIDATED TEAMAI PATTERN |
| PK-WF-003 | Population size changes how responsibilities are distributed: smaller teams combine more Fields per Seat; larger teams can specialize Fields into narrower responsibilities. | Product Law 2–8 population and scaling model merged in PR #51. | Web AI Team | VALIDATED TEAMAI PATTERN |
| PK-WF-004 | A skill is guided operational capability, not authorization. Effective responsibility is the intersection of Seat, Field, Skill, Capability, Authorization, connection/entitlement state, workspace/ref scope, task requirements, and scheduler eligibility. | Product Law Responsibility Profile and Scheduler model merged in PR #51. | Skills + Scheduler | VALIDATED TEAMAI PATTERN |
| PK-WF-005 | Main Integration / Team Lead is a distinct coordination responsibility. Its authority concerns contribution flow into `main`, not automatic ownership of every specialist Field. | Product Law Main Integration model merged in PR #51. | GitHub coding workspace | VALIDATED TEAMAI PATTERN |
| PK-WF-006 | Team conversation summarisation is a coordination capability and must preserve material contributions, decisions, disagreements, constraints, warnings, unresolved questions, and evidence without becoming authorization by itself. | Product Law team-lead/summarisation model merged in PR #51. | Web AI Team | VALIDATED TEAMAI PATTERN |
| PK-WF-007 | Branches are working/reconciliation surfaces; commits, PRs, Issues, checkpoints, evidence, handover, and endorsement preserve history. Branch count is not a measure of completeness or history quality. | Product Law branch/history model merged in PR #51. | GitHub | VALIDATED TEAMAI PATTERN |
| PK-WF-008 | User-facing team configuration must expose not only the Seat and provider/model, but the responsibility, skills, capabilities, scope, permitted/prohibited operations, approval requirements, and integration role. | Product Law user-accessible configuration requirements merged in PR #51. | Team Settings | VALIDATED TEAMAI PATTERN |
| PK-WF-009 | Web AI Seats should cooperate through explicit stateful boundaries and scheduler eligibility rather than direct uncontrolled provider-to-provider authority transfer. | Existing orchestration Product Law plus population/scheduler model merged in PR #51. | Web AI Team | VALIDATED TEAMAI PATTERN |
| PK-WF-010 | GitHub is the first concrete workspace model for the coding-focused responsibility system: repository → branch → commit → PR → review → Issue → verification → merge → main. | Product Law GitHub workspace model merged in PR #51. | Coding workspace | VALIDATED TEAMAI PATTERN |
| PK-WF-011 | A four-seat coding team can be organized as three specialist Seats on controlled working branches plus one Main Integration/Team Lead Seat coordinating PR/commit/Issue flow, reconciliation, verification, summarisation, and merge readiness. | Product Law explicit four-seat topology merged in PR #51. | GitHub coding workspace | VALIDATED TEAMAI PATTERN |
| PK-WF-012 | Responsibility coverage, branch inventory, and historical provenance are separate dimensions and should be evaluated separately during repository reconciliation. | Product Law branch/history and Development Field model merged in PR #51. | GitHub governance | VALIDATED TEAMAI PATTERN |

## 2. Responsibility-to-Skill Guidance [DO]

| Responsibility Field | Typical skill family | Core responsibility | Negative boundary |
|---|---|---|---|
| Product & Governance | ORUCAVEAM + governance + product-law | Authority, constraints, Product Law, policy and decision boundaries. | Does not silently implement product behavior or grant permissions merely by documenting a rule. |
| Backend & Runtime | backend/runtime + state + provider/execution + commerce skills | Identity, durable state, task lifecycle, execution gates, provider boundaries, commerce and scheduler-owned eligibility. | Does not become visual authority. |
| Frontend & Experience | frontend + spatial + accessibility + browser skills | Presentation, interaction, responsive behavior, frontend validation/presentation of backend-owned facts. | Does not invent backend truth or scheduler authority. |
| Application Integration & Contracts | contract + integration + adapter + cross-field verification skills | Frontend/backend contracts, schemas, adapters, status/error mapping, reconciliation and semantic-drift prevention. | Does not become a shadow backend, second scheduler, or replacement frontend authority. |
| Verification & CI/Browser | verification + Playwright + CI skills | Deterministic proof of claimed behavior. | Passing verification does not itself grant product authority or mean external runtime proof exists. |
| Documentation, Knowledge & Handover | documentation + learning/handover skills | Traceability, handover, endorsement and validated learning. | Does not invent implementation truth. |
| Recovery, History & Reconciliation | recovery + minimal-tool + branch/reconciliation skills | Checkpoints, provenance, safe branch reconciliation and history preservation. | Does not rewrite history or become an independent product authority. |
| Delivery & Operations | release/hosting/runtime-observation skills | Bounded delivery, hosting, operational observation and evidence. | Does not replace Product Law, backend authority, or scheduler authority. |

**Learning:** Skill families should map to responsibility Fields, but the same skill may be useful across multiple Seats. The deciding factor is the configured Responsibility Profile and authorization envelope, not the skill name alone.

## 3. Seat Control Model [DO]

A Web AI Seat should be treated as a configured participation identity for an externally operated AI application/runtime. A useful Responsibility Profile is:

`Seat → primary Field(s) → allowed secondary Field(s) → required skills → optional skills → capabilities/tools → workspace/repository scope → branch/ref scope → permitted operations → prohibited operations → approval requirements → escalation target → coordination role`

The effective operating authority is:

`Seat identity + assigned Field + effective Skill bundle + Capability set + Authorization + Connection/entitlement state + workspace/ref scope + Task requirements + Scheduler eligibility`

The following distinctions should be preserved in every future Seat design:

`can read ≠ can propose ≠ can implement ≠ can commit ≠ can create PR ≠ can approve ≠ can merge ≠ can modify canonical documents ≠ can coordinate ≠ can summarise`

**Learning:** A well-designed team does not merely decide which AI is “frontend” or “backend.” It decides which operations that AI may perform inside its responsibility boundary and which operations are explicitly prohibited.

## 4. Population Scaling Model [DO]

The current coding-focused baseline uses 2–8 Web AI Seats as the responsibility-design range.

| Population | Useful topology pattern | Design consequence |
|---:|---|---|
| 2 | Broad implementation Seat + Integration/Lead Seat, or two specialist Seats with user-owned integration | Fewer Seats means broader responsibility and stronger need to combine skills while retaining clear negative boundaries. |
| 3 | Backend + Frontend + Integration/Lead | Separates core implementation domains from coordination. |
| 4 | Three specialist contributors + Main Integration/Team Lead | Introduces explicit branch-based parallel contribution with a dedicated integration gate. |
| 5 | Four-seat model + dedicated Verification, Documentation, or Recovery responsibility | Starts separating supporting control functions from specialist implementation. |
| 6 | Backend + Frontend + Contracts + Verification + Documentation + Main Lead | More narrow responsibility and more parallelism. |
| 7 | Six-seat model + Recovery/History or Delivery/Operations | Greater specialization and coordination complexity. |
| 8 | Field-oriented configuration across the canonical responsibility surface | Maximum baseline specialization without changing the underlying authority hierarchy. |

**Learning:** As the population grows, the responsibility weight per Seat can become narrower while coordination complexity increases. As the population shrinks, several Fields must be combined into fewer Seats without removing those responsibilities from the team's coverage model.

## 5. GitHub Workspace Model [DO]

GitHub is the first concrete workspace model for TeamAi's coding-focused workforce because it gives the responsibility system explicit collaboration primitives:

`repository → working branch → commit → pull request → review → Issue → verification → merge → main`

A specialist Seat may work in a controlled branch. A Main Integration Seat may coordinate contribution flow. The canonical path into `main` should remain reviewable and auditable.

A branch should be treated as a workspace for work, isolation, or reconciliation. It should not be treated as a source of Seat identity, skill authority, or historical permanence.

### Four-seat example

A four-seat development population can be represented as:

`AI-1 → Specialist Field → Branch 1`

`AI-2 → Specialist Field → Branch 2`

`AI-3 → Specialist Field → Branch 3`

`AI-4 → Main Integration / Team Lead → PR/commit/Issue coordination + verification coordination + reconciliation + team summarisation`

Normal contribution flow:

`specialist branch → commit → PR → verification/review → Main Integration decision → merge → main`

**Learning:** A dedicated integration Seat creates a clear answer to “who controls what enters main?” without requiring that the integration Seat own the implementation responsibilities of the other Seats.

## 6. Frontend–Backend Contract Pattern [DO]

The frontend must consume backend-owned facts through explicit contracts rather than inventing or re-deriving authoritative state.

The recommended seam is:

`Backend authority → typed backend fact/contract → Application Integration & Contract Field → frontend validation/presentation → user`

The integration layer may perform schema validation, adapters, compatibility checks, status/error mapping, and contract reconciliation.

The integration layer does not become a second database, scheduler, provider runtime, or source of truth.

This pattern is consistent with the existing backend-validator work: presentation-layer validation remains separate from backend runtime authority.

## 7. TeamAi Spatial Theme Integration [DO]

The TeamAi spatial theme is a presentation responsibility, not an authority layer.

The canonical visual model is:

`one theme system → Dark Spatial Glassmorphism / Light Spatial Skeuomorphism → shared primitives/tokens → responsive/accessibility behavior`

Theme state MUST NOT duplicate business authority, backend state, permissions, scheduler semantics, or Web AI Seat authority.

A Frontend/Experience Seat may own implementation of this visual system through its applicable spatial/frontend skills. A Verification Seat may verify browser behavior. An Integration Seat may reconcile the UI contract with backend facts. Backend/Runtime remains responsible for authoritative state and execution.

**Learning:** The visual system should plug into the responsibility topology through the Frontend and Verification Fields rather than becoming a separate product authority.

## 8. Backend Account and Service Wiring [DO]

Backend account and service boundaries should connect to the workforce model through explicit authority contracts rather than through Seat-specific shortcuts.

Current canonical backend relationships include:

`Firebase Authentication → Firebase UID identity authority`

`Firestore (default) → durable TeamAi domain/application state`

`Supabase Edge Functions → trusted server execution`

`PayPal → external payment-event authority`

`GitHub → engineering/source authority`

The Web AI Seat is a TeamAi participation configuration layered above these authorities. A Seat does not replace them.

**Learning:** A future Team Settings screen should configure how a Seat may use an authority, not transfer the authority itself to the Seat.

## 9. Skill Wiring and Execution Discipline [DO]

The canonical implementation trace remains:

`Product Law → Masterplan → Policy/ORUCAVEAM → applicable skill(s) → tool/system → implementation → verification → evidence → handover → endorsement`

A field-specific responsibility should therefore resolve to the appropriate direct skills while ORUCAVEAM remains the execution constitution.

Skills should be reusable and composable. Duplicate skills should not be created when an existing direct skill already satisfies the needed procedure.

**Learning:** The workforce model increases the importance of deterministic skill resolution. As Seats specialize, TeamAi must know which skills are required, which are optional, which are unavailable, and which are forbidden for the configured responsibility.

## 10. Anti-Patterns & Dead Ends [DONT]

| ID | Anti-Pattern | Consequence | Resolution |
|---|---|---|---|
| AP-BASE-001 | Keeping duplicate execution-discipline documents when the same rules can live in Policy + skills. | Rule drift and ambiguous navigation. | Keep Policy canonical and route through skills. |
| AP-BASE-002 | Treating a skill index as the wiring authority. | Skills become difficult to resolve from canonical plan items. | Use explicit skill wiring. |
| AP-BASE-003 | Treating screenshots as canonical proof of backend, persistence, authorization, or payment state. | Visual evidence can be mistaken for authoritative state. | Use authoritative runtime/source evidence. |
| AP-BASE-004 | Using deployment suppression to conceal or bypass an expected deployment/verification problem. | Failures disappear instead of being diagnosed. | Diagnose and record the bounded limitation. |
| AP-BASE-005 | Creating a duplicate M/minimal-tool skill when an existing reusable minimal-tool-use procedure already satisfies the ORUCAVEAM M requirement. | Duplicate procedures drift. | Reuse the existing minimal-tool-use procedure. |
| AP-BASE-006 | Blocking merges or claiming architecture failure because Vercel is rate-limited or disconnected from GitHub. | Non-authoritative surface becomes a false gate. | Keep the authoritative verification model and record the cutoff. |
| AP-BASE-012 | Treating a frontend validation result as backend authorization, scheduler authority, execution completion, or entitlement truth. | Presentation validation becomes a second execution authority. | Preserve backend runtime authority and typed read-only fact contracts. |
| AP-WF-001 | Assigning every AI Seat every skill “just in case.” | Responsibility boundaries become meaningless and authorization becomes difficult to reason about. | Equip each Seat according to its Responsibility Profile. |
| AP-WF-002 | Assuming a branch name defines Seat authority. | Branch identity becomes confused with permission. | Derive authority from Seat profile, authorization, task state and repository policy. |
| AP-WF-003 | Making the Main Integration Seat an unrestricted writer to `main`. | Integration becomes an uncontrolled authority bypass. | Use PR/review/verification/authorization gates. |
| AP-WF-004 | Treating population size as the number of branches that must permanently exist. | Branch accumulation and historical duplication increase without improving coverage. | Separate population, Fields, active branches and historical provenance. |
| AP-WF-005 | Treating a team summary as an authoritative implementation or approval record without explicit authorization. | Coordination artifacts silently become product truth. | Preserve summary as coordination evidence and retain explicit approval boundaries. |
| AP-WF-006 | Mapping GitHub's branch/PR concepts directly onto every future workspace platform. | Platform semantics become distorted and authority boundaries may be wrong. | Map each workspace's native primitives into the TeamAi responsibility model. |

## 11. Contract & Dependency Gotchas

| Authority | Consumer | Gotcha | Resolution | ID |
|---|---|---|---|---|
| Product Law | Masterplan | A new feature must amend the existing canonical idea when applicable rather than append a duplicate concept. | Inspect existing logic before editing; warn on discrepancy. | PK-BASE-006 |
| Masterplan | Skills | Executable checklist items need explicit ORUCAVEAM letter routing plus concrete field/domain skill paths or an explicit no-skill rationale. | Route each checklist item through `docs/SKILL_WIRING.md`. | PK-BASE-007 |
| Policy | Skills | Skills describe procedure but cannot grant permission or override authority. | Permission remains in Product Law/policy/user approval. | PK-BASE-008 |
| Responsibility Profile | Scheduler | Seat assignment alone does not make a task executable. | Recalculate eligibility from skills, capabilities, authorization, connection health, scope and task state. | PK-WF-013 |
| GitHub branch | Main Integration Seat | Branch ownership and merge authority are separate concepts. | Require repository authorization and the approved PR/review flow. | PK-WF-014 |
| Frontend | Backend | Frontend consumers may display backend facts but should not manufacture authoritative backend state. | Use typed contract/fact boundaries and backend runtime authority. | PK-WF-015 |
| Other workspace | TeamAi responsibility model | GitHub terms may not have one-to-one equivalents elsewhere. | Translate native workspace primitives into TeamAi Fields and Responsibility Profiles. | PK-WF-016 |

## 12. Environment & Tool Quirks

| Quirk | Impact | Workaround | ID |
|---|---|---|---|
| Vercel deployment availability can be externally constrained or cut off from GitHub. | Hosted browser verification may be unavailable; status checks may fail. | Keep GitHub Actions + Playwright authoritative; record `VERCEL=PARKED/CUTOFF`; do not block merges on Vercel alone. | PK-BASE-009 |
| Firebase and external services can consume finite read/write or runtime resources. | Wasteful probing can increase cost or trigger limits. | Apply ORUCAVEAM-M minimalistic tool/resource usage while preserving authoritative verification. | PK-BASE-010 |

## 13. Evidence Rules

- Evidence must describe exactly what was exercised and where.
- Textual, reproducible evidence is preferred.
- Generated screenshots, captures, and decorative images are not canonical Product Knowledge evidence.
- A green CI run, deployment, or screenshot does not by itself prove a broader completion claim.
- A red Vercel badge during cutoff is not a TeamAi architecture failure.
- Deterministic frontend/runtime validation does not prove live external-service completion unless the relevant external environment was actually exercised.
- A Product Law statement is an authority claim; Product Knowledge records the validated lesson and evidence path explaining how that claim was learned or applied.
- Branch count, Seat count, skill count, and PR count must never be used individually as proxies for product completeness.

## 14. Learning Promotion

A lesson enters this file only after execution evidence supports it. A TeamAi-specific lesson may later become a ToolKit candidate only after validation/generalization demonstrates that the lesson applies beyond TeamAi.

Workforce-model lessons should be promoted only when they remain useful across repeated TeamAi team configurations or are explicitly adopted by Product Law, Masterplan, Policy, or a direct skill.

## 15. Current Canonical Workforce Lesson

The most important reusable TeamAi workforce lesson established in this cycle is:

> **TeamAi is not merely a connector between AI applications. TeamAi constructs and governs a coordinated Web AI workforce by mapping a user's Web AI population into responsibility Fields, Responsibility Profiles, skills, capabilities, authorization boundaries, workspace/ref scopes, scheduler eligibility, and integration rules. Population size changes the breadth or specialization of responsibility, but the complete required development surface must remain covered. `main` remains the canonical assembled state, and branches remain controlled work surfaces rather than the archive of history.**

This lesson connects the principal TeamAi layers:

`Product Law → Development Fields → Responsibility Profiles → Skills → Capabilities → Backend authorities → Frontend presentation → GitHub workspace → Scheduler → Web AI Seats → verification → main → durable history`

It is the foundation for the next design stage: translating the canonical workforce model into the user-accessible Team Settings experience and then determining how the same responsibility model should map to other workspace platforms without assuming that their primitives are identical to GitHub.

## Rules

- Never use this file to redefine Product Law.
- Never store raw session logs or speculative ideas here.
- Never delete a knowledge row silently; supersede it with a reference when needed.
- Preserve the evidence path for every validated pattern.
- Keep Product Knowledge subordinate to `PRODUCT_LAW.md`.
- Do not treat the current GitHub workforce model as universal proof for other workspace platforms; validate each platform separately before generalizing.
