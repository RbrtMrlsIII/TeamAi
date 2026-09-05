# TeamAi — Product Knowledge

**Status:** BASELINE KNOWLEDGE LIBRARY + VALIDATED WORKFORCE PROJECTION
**Purpose:** Retain validated, distilled lessons from TeamAi execution and preserve the connected reasoning that explains how Product Law concepts flow into implementation. This file is subordinate to `PRODUCT_LAW.md`; it MUST NOT become a second Product Law or silently add authority.

## 0. How the whole Product Law connects and flows

The most useful way to understand TeamAi is as one connected chain rather than as isolated laws, documents, services, branches, skills, or Seats.

```text
                         HUMAN USER AUTHORITY
                                  │
                                  ▼
                           PRODUCT_LAW.md
                    what TeamAi must remain true
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
             MASTERPLAN                      POLICY / ORUCAVEAM
          when / in what order                 how a command is
             work is done                     evaluated / executed
                 │                                 │
                 └──────────────┬──────────────────┘
                                ▼
                       DEVELOPMENT FIELD
                     what responsibility is owned
                                │
                                ▼
                    RESPONSIBILITY PROFILE
             which Seat may perform which role
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
        WORKSPACE RULESET                    SKILLS
     how the selected workspace       how the responsibility is
       natively operates              performed in that context
                │                               │
                └───────────────┬───────────────┘
                                ▼
                       CAPABILITIES / TOOLS
                         available mechanisms
                                │
                                ▼
                          AUTHORIZATION
                          permitted control
                                │
                                ▼
                       DURABLE TASK STATE
                                │
                                ▼
                     SCHEDULER ELIGIBILITY
                       who may act next
                                │
                                ▼
                     TRUSTED EXECUTION
                                │
                                ▼
                  DURABLE RESULT / EVENT / ARTIFACT
                                │
                  ┌─────────────┴─────────────┐
                  ▼                           ▼
             VERIFICATION              INTEGRATION /
              proves what              RECONCILIATION
              was exercised             joins the parts
                  │                           │
                  └─────────────┬─────────────┘
                                ▼
                        HANDOVER / ENDORSEMENT
                                │
                                ▼
                        PRODUCT KNOWLEDGE
                                │
                                ▼
               REUSABLE SKILL / WORKSPACE LEARNING
```

### 0.1 Conceptual descriptions

**Product Law → Masterplan.** Product Law establishes durable product meaning and authority boundaries. Masterplan turns those constraints into an ordered build/checklist path. A plan item may not quietly contradict a Product Law concept.

**Masterplan → ORUCAVEAM.** A planned action still requires command-level discipline. ORUCAVEAM keeps objective, restrictions, user authority, canonical authority, action, verification, efficiency, audit, and resource-minimalism in one project-wide execution discipline.

**ORUCAVEAM → Development Field.** Once the action is legitimate, TeamAi identifies which responsibility field owns the work. This prevents every Seat or branch from becoming a general-purpose authority.

**Field → Responsibility Profile.** A Field says what responsibility is being covered. The Responsibility Profile says which configured Web AI Seat covers it, with which primary/secondary fields, skills, tools, scopes, operations, prohibitions, approvals, and escalation target.

**Responsibility Profile → Workspace Ruleset + Skills.** The workspace ruleset supplies the native operating context. Skills supply the procedure. Neither may grant authority by itself.

**Skills → Capabilities → Authorization.** A skill can teach a Seat how to use a mechanism; capability says the mechanism is available; authorization says the Seat is actually permitted to control it. These are distinct checks.

**Authorization + Task State → Scheduler Eligibility.** A Seat becomes executable only when its responsibility, skills, capabilities, authorization, connection health, scope, approvals, and task state all satisfy the task requirements. The Scheduler chooses eligibility; conversation recency and branch naming do not.

**Execution → Durable Evidence.** Trusted actions must leave durable task/event/artifact evidence appropriate to their authority boundary. In-memory success is not a substitute for durable state where durable state is required.

**Evidence → Integration → Handover/Endorsement.** Verification proves only the behavior actually exercised. Integration reconciles contributions into the assembled product. Handover preserves what the next worker needs. Endorsement records authorized completion/acceptance where applicable.

**Handover/Endorsement → Product Knowledge.** Only evidence-backed lessons belong here. A learning may improve future skills or workspace rules, but it does not automatically change Product Law.

### 0.2 Whole-team knowledge continuity

A Web AI Seat working through a separate external application cannot safely rely only on its own local chat or branch. The required context is the project material relevant to the task:

```text
user authority
+ project purpose/current state
+ relevant team discussion
+ durable task/event state
+ applicable workspace state
+ restrictions/decisions
+ verification/evidence
+ handover context
        │
        ▼
AUTHORIZED CONTEXT PACKET
        │
        ▼
WEB AI SEAT
```

The practical lesson is that separation of providers is acceptable; separation of authoritative project knowledge is not. TeamAi must connect the separated Seats through authorized context, durable structured events, summaries, handoffs, workspace records, and explicit state transitions rather than direct provider-to-provider control.

### 0.3 Workspace-aware configuration flow

Workspace choice is a configuration input, not an authority switch:

`user workspace choice → workspace ruleset → Responsibility Profile → workspace-aware skill resolution → capability set → authorization → task eligibility → native workspace action`

GitHub is the first concrete coding workspace model. Its validated conceptual flow is:

`repository → branch/ref → commit → pull request → review → Issue/task → verification → merge → main`

A future workspace must be mapped from its actual native primitives instead of being forced into GitHub semantics.

### 0.4 Skill-evolution loop

```text
new requirement / observed learning
            │
            ▼
Product Law / Masterplan reconciliation
            │
            ▼
Policy / ORUCAVEAM routing
            │
            ▼
skill design or change
            │
            ▼
implementation
            │
            ▼
deterministic verification
            │
            ▼
evidence + Product Knowledge
            │
            ▼
versioned/reusable skill promotion
```

The critical safeguard is the split between **knowledge improvement** and **authority expansion**. A better procedure may improve an already-authorized Seat. New control requires explicit authorization and the applicable governance reconciliation.

### 0.5 Authority/source-of-truth boundaries

| Concern | Canonical authority | Knowledge lesson |
|---|---|---|
| Human intent/approval | User | AI output cannot become authority merely by being newer. |
| Product meaning/invariants | `PRODUCT_LAW.md` | Lower documents and skills derive from Product Law. |
| Chronological execution plan | `MASTERPLAN.md` | Plan order does not override Product Law. |
| Execution discipline | `POLICY.md` + ORUCAVEAM | One project-wide execution constitution. |
| Direct operational procedure | `skills/**/SKILL.md` | Skills guide execution; they do not grant authority. |
| Durable TeamAi domain state | Firestore `(default)` | UI must not self-attest durable truth. |
| Identity root | Firebase Auth / Firebase UID | Client IDs do not prove ownership. |
| Trusted server execution | Supabase Edge Functions | Trusted execution is distinct from durable domain-state authority. |
| External payment events | PayPal | Provider event authority remains external; TeamAi owns correlation/projection rules. |
| Engineering/source state | GitHub | Branches are work surfaces, not independent authorities. |
| Engineering verification | GitHub Actions / deterministic checks | Green CI proves only the checks actually executed. |
| Web visual presentation | Spatial UI | Theme is a human-facing map, not source of truth. |
| Workspace-native behavior | Workspace Ruleset Repository | Rulesets are adapters, not alternative Product Laws. |
| Validated learning | `PRODUCT-KNOWLEDGE.md` | Knowledge records lessons; it does not redefine product authority. |

## 1. Validated Patterns [DO]

| ID | Pattern | Evidence | Applies To | Status |
|---|---|---|---|---|
| PK-BASE-001 | Canonical work should trace Product Law → Masterplan → Policy/ORUCAVEAM → applicable skill(s) → implementation → verification → handover/endorsement. | Current TeamAi governance baseline and existing implementation traceability contract. | TeamAi | BASELINE |
| PK-BASE-002 | Skill references should point to complete executable paths and deeper context should be linked with explicit `See also` references. | Baseline wiring design. | TeamAi | BASELINE |
| PK-BASE-003 | Deterministic browser verification belongs in Playwright when real browser behavior is required; deployment surfaces remain non-authoritative. | Browser verification architecture baseline. | TeamAi | BASELINE |
| PK-BASE-004 | Every ORUCAVEAM letter should resolve to a small direct execution skill, and field/domain skills compose with the applicable letters instead of duplicating the execution constitution. | ORUCAVEAM baseline skill-family reconciliation. | TeamAi | BASELINE |
| PK-BASE-011 | F0–F7 is field identity only; legal boxes remain Shell · Panel · Card · Control · Navigation; F6 Status and F7 Modal are system surfaces. | 029 reconciliation + skill adaptation + theme-root foundation. | TeamAi 029 | BASELINE |
| PK-BASE-012 | Backend-owned execution facts should cross into spatial UI through an explicit typed fact contract, a read-only frontend validation/presentation layer, and a separate backend runtime authority boundary. | PR #46 typed validator, PR #47 spatial UI contract, PR #49 backend runtime-validation gate. | TeamAi 029 / TEAM-BACKEND-001 | VALIDATED TEAMAI PATTERN |
| PK-WF-001 | Web AI responsibility is best modeled as a Responsibility Profile rather than a simple provider/model assignment. | Product Law workforce model merged in PR #51; extended by current workspace-aware reconciliation. | Web AI Team | VALIDATED TEAMAI PATTERN |
| PK-WF-002 | The canonical frontend/backend seam is an Application Integration & Contract Field that reconciles facts and contracts without becoming a second backend or frontend authority. | Product Law Development Fields model merged in PR #51; PR #46/#47 validator contracts. | Frontend + Backend | VALIDATED TEAMAI PATTERN |
| PK-WF-003 | Population size changes how responsibilities are distributed: smaller teams combine more Fields per Seat; larger teams can specialize into narrower responsibilities. | Product Law 2–8 population and scaling model merged in PR #51. | Web AI Team | VALIDATED TEAMAI PATTERN |
| PK-WF-004 | A skill is guided operational capability, not authorization. Effective responsibility is the intersection of Seat, Field, Skill, Capability, Authorization, connection/entitlement state, workspace/ref scope, task requirements, and scheduler eligibility. | Product Law Responsibility Profile and Scheduler model merged in PR #51. | Skills + Scheduler | VALIDATED TEAMAI PATTERN |
| PK-WF-005 | Main Integration / Team Lead is a distinct coordination responsibility. Its authority concerns contribution flow into `main`, not automatic ownership of every specialist Field. | Product Law Main Integration model merged in PR #51. | GitHub coding workspace | VALIDATED TEAMAI PATTERN |
| PK-WF-006 | Team conversation summarisation is a coordination capability and must preserve material contributions, decisions, disagreements, constraints, warnings, unresolved questions, and evidence without becoming authorization by itself. | Product Law team-lead/summarisation model merged in PR #51. | Web AI Team | VALIDATED TEAMAI PATTERN |
| PK-WF-007 | Branches are working/reconciliation surfaces; commits, PRs, Issues, checkpoints, evidence, handover, and endorsement preserve history. Branch count is not a measure of completeness or history quality. | Product Law branch/history model merged in PR #51. | GitHub | VALIDATED TEAMAI PATTERN |
| PK-WF-008 | User-facing team configuration must expose not only Seat and provider/model, but responsibility, skills, capabilities, scope, permitted/prohibited operations, approval requirements, and integration role. | Product Law user-accessible configuration requirements merged in PR #51. | Team Settings | VALIDATED TEAMAI PATTERN |
| PK-WF-009 | Web AI Seats should cooperate through explicit stateful boundaries and scheduler eligibility rather than direct uncontrolled provider-to-provider authority transfer. | Existing orchestration Product Law plus population/scheduler model. | Web AI Team | VALIDATED TEAMAI PATTERN |
| PK-WF-010 | GitHub is the first concrete workspace model for the coding-focused responsibility system: repository → branch → commit → PR → review → Issue → verification → merge → main. | Product Law GitHub workspace model. | Coding workspace | VALIDATED TEAMAI PATTERN |
| PK-WF-011 | A four-seat coding team can be organized as three specialist Seats on controlled working branches plus one Main Integration/Team Lead Seat coordinating PR/commit/Issue flow, reconciliation, verification, summarisation, and merge readiness. | Product Law explicit four-seat topology merged in PR #51. | GitHub coding workspace | VALIDATED TEAMAI PATTERN |
| PK-WF-012 | Responsibility coverage, branch inventory, and historical provenance are separate dimensions and should be evaluated separately during repository reconciliation. | Product Law branch/history and Development Field model merged in PR #51. | GitHub governance | VALIDATED TEAMAI PATTERN |

## 2. Workforce model — emerging reusable design knowledge

The following patterns are intentionally separated from implementation proof because they describe the current reconciled workforce architecture and future product direction.

| ID | Pattern | Evidence basis | Status |
|---|---|---|---|
| PK-WF-013 | Whole-team knowledge continuity should be treated as a first-class coordination requirement: every eligible Seat needs sufficient authoritative project context for its task. | Product Law workspace/continuity reconciliation. | GOVERNANCE-DESIGN / VALIDATED MODEL |
| PK-WF-014 | Workspace-specific rule repositories should act as subordinate adapters, with platform-native concepts mapped back to TeamAi Fields, Skills, Capabilities, Authorization, and Scheduler eligibility. | Product Law workspace ruleset model. | GOVERNANCE-DESIGN / VALIDATED MODEL |
| PK-WF-015 | Workspace selection should change native configuration and skill recommendation without creating a separate TeamAi constitution. | Product Law workspace-choice model. | GOVERNANCE-DESIGN / VALIDATED MODEL |
| PK-WF-016 | Skill growth should be evidence-backed, versioned, and traceable, with knowledge improvement separated from authority expansion. | Product Law skill-evolution model. | GOVERNANCE-DESIGN / VALIDATED MODEL |
| PK-WF-017 | ZipSkills should package validated operational skills and workspace mappings without becoming an authority or permission grant. | Product Law ZipSkills boundary. | PLANNING / GOVERNANCE-DESIGN |
| PK-WF-018 | Spatial Theme, guides, and dictionary surfaces should be derived from the same canonical workforce vocabulary so users see one coherent model across settings and execution. | Product Law Spatial/Guides/Dictionary model plus 029 baseline. | GOVERNANCE-DESIGN / VALIDATED MODEL |

## 3. Responsibility-to-Skill Guidance [DO]

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

**Learning:** Skill families map to responsibility Fields, but the same skill may be useful across multiple Seats. The deciding factor is the configured Responsibility Profile and authorization envelope, not the skill name alone.

## 4. Seat Control Model [DO]

A Web AI Seat is a configured participation identity for an externally operated AI application/runtime. A useful Responsibility Profile is:

`Seat → primary Field(s) → allowed secondary Field(s) → required skills → optional skills → capabilities/tools → workspace/repository scope → branch/ref scope → permitted operations → prohibited operations → approval requirements → escalation target → coordination role`

The effective operating authority is:

`Seat identity + assigned Field + effective Skill bundle + Capability set + Authorization + Connection/entitlement state + workspace/ref scope + Task requirements + Scheduler eligibility`

The following distinctions should be preserved in every future Seat design:

`can read ≠ can propose ≠ can implement ≠ can commit ≠ can create PR ≠ can approve ≠ can merge ≠ can modify canonical documents ≠ can coordinate ≠ can summarise`

**Learning:** A well-designed team does not merely decide which AI is “frontend” or “backend.” It decides which operations that AI may perform inside its responsibility boundary and which operations are explicitly prohibited.

## 5. Population Scaling Model [DO]

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

**Learning:** As population grows, responsibility weight per Seat can become narrower while coordination complexity increases. As population shrinks, several Fields must be combined into fewer Seats without removing those responsibilities from the coverage model.

## 6. GitHub Workspace Model [DO]

GitHub is the first concrete workspace model for TeamAi's coding-focused workforce:

`repository → working branch → commit → pull request → review → Issue → verification → merge → main`

A specialist Seat may work in a controlled branch. A Main Integration Seat may coordinate contribution flow. The canonical path into `main` should remain reviewable and auditable.

A branch is a workspace for work, isolation, or reconciliation. It is not a source of Seat identity, skill authority, or historical permanence.

### Four-seat example

`AI-1 → Specialist Field → Branch 1`

`AI-2 → Specialist Field → Branch 2`

`AI-3 → Specialist Field → Branch 3`

`AI-4 → Main Integration / Team Lead → PR/commit/Issue coordination + verification coordination + reconciliation + team summarisation`

Normal contribution flow:

`specialist branch → commit → PR → verification/review → Main Integration decision → merge → main`

**Learning:** A dedicated integration Seat creates a clear answer to “who coordinates what enters main?” without requiring that the integration Seat own the implementation responsibilities of the other Seats.

## 7. Frontend–Backend Contract Pattern [DO]

The frontend must consume backend-owned facts through explicit contracts rather than inventing or re-deriving authoritative state.

`Backend authority → typed backend fact/contract → Application Integration & Contract Field → frontend validation/presentation → user`

The integration layer may perform schema validation, adapters, compatibility checks, status/error mapping, and contract reconciliation.

The integration layer does not become a second database, scheduler, provider runtime, or source of truth.

## 8. TeamAi Spatial Theme Integration [DO]

The TeamAi Spatial Theme is a presentation responsibility, not an authority layer.

`one theme system → Dark Spatial Glassmorphism / Light Spatial Skeuomorphism → shared primitives/tokens → responsive/accessibility behavior`

Theme state MUST NOT duplicate business authority, backend state, permissions, scheduler semantics, or Web AI Seat authority.

A Frontend/Experience Seat may own implementation of the visual system through its applicable spatial/frontend skills. A Verification Seat may verify browser behavior. An Integration Seat may reconcile UI contracts with backend facts. Backend/Runtime remains responsible for authoritative state and execution.

**Learning:** The visual system plugs into the responsibility topology through Frontend and Verification Fields rather than becoming a separate product authority.

## 9. Backend Account and Service Wiring [DO]

Canonical service relationships include:

`Firebase Authentication → Firebase UID identity authority`

`Firestore (default) → durable TeamAi domain/application state`

`Supabase Edge Functions → trusted server execution`

`PayPal → external payment-event authority`

`GitHub → engineering/source authority`

The Web AI Seat is a TeamAi participation configuration layered above these authorities. A Seat does not replace them.

**Learning:** Team Settings should configure how a Seat may use an authority, not transfer the authority itself to the Seat.

## 10. Skill Wiring and Execution Discipline [DO]

The canonical implementation trace is:

`Product Law → Masterplan → Policy/ORUCAVEAM → applicable skill(s) → tool/system → implementation → verification → evidence → handover → endorsement`

A field-specific responsibility should resolve to the appropriate direct skills while ORUCAVEAM remains the execution constitution.

Skills should be reusable and composable. Duplicate skills should not be created when an existing direct skill already satisfies the needed procedure.

**Learning:** The workforce model increases the importance of deterministic skill resolution. As Seats specialize, TeamAi must know which skills are required, optional, unavailable, and forbidden for the configured responsibility.

## 11. Anti-Patterns & Dead Ends [DONT]

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
| AP-WF-007 | Allowing workspace selection to replace project-wide ORUCAVEAM or Product Law. | Each workspace becomes a competing constitution. | Keep one project-wide Product Law and ORUCAVEAM; use workspace rulesets only as adapters. |
| AP-WF-008 | Upgrading a skill in a way that silently adds permission or authority. | Knowledge changes become undeclared control changes. | Reconcile authority expansion explicitly and version the skill. |
| AP-WF-009 | Assuming an external AI's local conversation is sufficient whole-team knowledge. | Seats act on partial or stale project state. | Build the authorized context packet from durable project/team state. |
| AP-WF-010 | Treating ZipSkills purchase as automatic technical authorization. | Commerce becomes an undeclared permission path. | Keep package entitlement separate from authorization. |

## 12. Contract & Dependency Gotchas

| Authority | Consumer | Gotcha | Resolution | ID |
|---|---|---|---|---|
| Product Law | Masterplan | A new feature must amend the existing canonical idea when applicable rather than append a duplicate concept. | Inspect existing logic before editing; warn on discrepancy. | PK-BASE-006 |
| Masterplan | Skills | Executable checklist items need explicit ORUCAVEAM letter routing plus concrete field/domain skill paths or an explicit no-skill rationale. | Route each checklist item through `docs/SKILL_WIRING.md`. | PK-BASE-007 |
| Policy | Skills | Skills describe procedure but cannot grant permission or override authority. | Permission remains in Product Law/policy/user approval. | PK-BASE-008 |
| Responsibility Profile | Scheduler | Seat assignment alone does not make a task executable. | Recalculate eligibility from skills, capabilities, authorization, connection health, scope and task state. | PK-WF-013 |
| GitHub branch | Main Integration Seat | Branch ownership and merge authority are separate concepts. | Require repository authorization and the approved PR/review flow. | PK-WF-014 |
| Frontend | Backend | Frontend consumers may display backend facts but should not manufacture authoritative backend state. | Use typed contract/fact boundaries and backend-owned mutation paths. | PK-WF-015 |
| Workspace choice | Skill resolver | A workspace changes native operating procedures and applicable skill context. | Resolve skills from the selected workspace ruleset plus Responsibility Profile. | PK-WF-016 |
| Workspace Ruleset | Product Law | A platform adapter must not become a competing constitution. | Keep the ruleset subordinate and require Product Law mapping/evidence. | PK-WF-017 |
| Skill upgrade | Authorization | A skill change can improve procedure without increasing permission. | Separate knowledge change from authority change and require explicit authorization for the latter. | PK-WF-018 |
| Team discussion | Next Seat | A local summary may omit material project context. | Build the next context packet from discussion + durable state + evidence + handover. | PK-WF-019 |
| ZipSkills package | Authorization | Commercial package ownership does not equal repository/backend/merge/provider authority. | Evaluate package entitlement separately from technical authorization. | PK-WF-020 |

## 13. Environment & Tool Quirks

| Quirk | Impact | Workaround | ID |
|---|---|---|---|
| Vercel deployment availability can be externally constrained or cut off from GitHub. | Hosted browser verification may be unavailable; status checks may fail. | Keep GitHub Actions + Playwright authoritative; record `VERCEL=PARKED/CUTOFF`; do not block merges on Vercel alone. | PK-BASE-009 |
| Firebase and external services can consume finite read/write or runtime resources. | Wasteful probing can increase cost or trigger limits. | Apply ORUCAVEAM-M minimalistic tool/resource usage while preserving authoritative verification. | PK-BASE-010 |

## 14. Evidence Rules

- Evidence must describe exactly what was exercised and where.
- Textual, reproducible evidence is preferred.
- Generated screenshots, captures, and decorative images are not canonical Product Knowledge evidence.
- A green CI run, deployment, or screenshot does not by itself prove a broader completion claim.
- A red Vercel badge during cutoff is not a TeamAi architecture failure.
- Deterministic frontend/runtime validation does not prove live external-service completion unless the relevant external environment was actually exercised.
- A Product Law design projection may describe a future architecture, but it must not be mislabeled as completed runtime implementation.
- Workspace ruleset existence, skill-package design, Team Settings concepts, or ZipSkills concepts do not prove that the corresponding user-facing/runtime implementation already exists.

## 15. Learning Promotion

A lesson enters this file only after execution evidence supports it. A TeamAi-specific lesson may later become a ToolKit candidate only after validation/generalization demonstrates that the lesson applies beyond TeamAi.

For workforce learning, promotion should preserve:

`source evidence → affected Product Law / Masterplan concept → applicable workspace → affected Field → skill/version → verification → Product Knowledge entry`

A learning that changes authority must stop at governance reconciliation until explicit authorization is established.

## Rules

- Never use this file to redefine Product Law.
- Never store raw session logs or speculative ideas here.
- Never delete a knowledge row silently; supersede it with a reference when needed.
- Preserve the evidence path for every validated pattern.
- Keep future workspace implementations, Team Settings UI, ZipSkills commerce, and unimplemented cross-application connectors clearly labeled as planning/design unless runtime evidence exists.
- Treat Product Law connectivity as a model of dependency and flow, not as permission to collapse distinct authorities into one.
