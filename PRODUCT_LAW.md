# PRODUCT LAW — TeamAi Canonical Front Door

`PRODUCT_LAW.md` is the product authority and MUST NOT be overridden by implementation, UI, deployment, provider, or tool conventions. The synchronized project package contains the complete Product Law text during this reconciliation window; this repository file is the engineering-visible authority front door for agent recovery.

## Current execution authority
The current sequence is:

`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

**Current phase:** `TEAM-BACKEND-001 — IN IMPLEMENTATION`.

## Core authority invariants
- Human user authority remains above AI authority.
- **The TeamAi Development Team and the Web AI Team are different entities.** The TeamAi Development Team develops, governs, tests, documents, and delivers the TeamAi product. The Web AI Team is the user's configured collection of externally operated AI applications/providers that TeamAi connects to, equips, coordinates, and orchestrates. They MUST NOT be conflated.
- The term **AI Team** MUST be interpreted in product context. It does not mean the TeamAi Development Team. When referring to the connected product experience, use **Web AI Team** where ambiguity could occur.
- TeamAi does not claim ownership of externally operated AI applications, provider accounts, provider subscriptions, provider models, or provider-native workspaces. External setup and provider ownership remain external; TeamAi owns the connection, participation, policy, durable state, and orchestration boundaries it provides.
- A Web AI Team AI Seat is a TeamAi participation identity/configuration for an externally operated AI application/runtime. `application ≠ provider ≠ service/runtime ≠ model ≠ connection ≠ seat ≠ skill ≠ tool/MCP ≠ workstation ≠ entitlement ≠ authorization`.
- The same provider/model may participate through multiple distinct AI Seats with different roles, skills, tools, workstations, scopes, permissions, limits, and approval rules.
- Firebase Auth owns identity and Firebase UID ownership.
- Firestore `default` owns TeamAi durable domain/application state.
- Supabase Edge Functions own trusted server execution and PayPal webhook receipt.
- PayPal is the external payment-event authority.
- GitHub is the engineering/source authority.
- Firebase Hosting is the current TeamAi web hosting/delivery authority.
- Vercel is a controlled web development, preview, and browser-verification surface; it is not TeamAi hosting authority, backend authority, or production deployment authority.
- Supabase Postgres is platform infrastructure only and is not the TeamAi domain/application database.
- Retired PostgreSQL implementation is historical-only and must not remain an active/recoverable TeamAi backend path.
- Web AI and Development AI are separate operational domains.
- Universal ToolKit is upstream-only: validated/generalized TeamAi lessons may flow upstream; ToolKit does not become TeamAi authority.

## Connected Platform Authority Map

The following connected-platform roles are Product Law. A technical connection does not grant a platform authority that is not explicitly assigned here. Each platform has a bounded usage and evidence role, and expanding that role requires Product Law / architecture reconciliation before implementation.

| Platform / surface | TeamAi usage | Authority / evidence boundary |
|---|---|---|
| Firebase Authentication | User sign-in and authenticated Firebase UID establishment. | Identity authority only. |
| Cloud Firestore `(default)` | Durable TeamAi application/domain state, including accounts, workplaces, projects, teams/Seats, tasks, and events. | Durable TeamAi state authority. |
| Firebase Hosting | Delivery of the current TeamAi web application. | Current web delivery/hosting authority. |
| Supabase Edge Functions | Trusted server execution, including protected TeamAi operations and the PayPal webhook receiver. | Trusted execution authority; not domain-state authority. |
| Supabase Postgres | Supabase platform infrastructure where required. | Infrastructure only; never TeamAi domain/application state. |
| PayPal | External payment events used by TeamAi's server-owned commerce correlation and entitlement projection. | External payment-event authority; TeamAi retains its correlation/projection rules. |
| GitHub | Source repository, commits, pull requests, issues, reviews, and engineering history. | Engineering/source/change authority. |
| GitHub Actions | CI validation, authority audits, tests, recovery checks, and repository automation. | Verification/execution surface for engineering workflows; it does not replace GitHub source authority or TeamAi runtime authority. |
| Vercel | Controlled web development, preview, deployment inspection, and browser verification for relevant web work. | Non-authoritative web development/preview/browser-verification surface only. |
| Founder Pulse | Read-only observation of Issue flow and delivery patterns for product-operations visibility. | Observation/management layer only; no mutation or authorization authority. |
| External AI applications/providers | Models/runtimes that participate in the Web AI Team through authorized connections and Seats. | Provider ownership remains external; TeamAi owns its connection, policy, Seat, orchestration, and durable-state boundary. |
| MCP/tools/plugins/integrations | Bounded capabilities exposed to authorized Web AI Seats. | Capability/integration surface only. |
| Universal ToolKit | Upstream knowledge/process repository receiving validated generalized lessons. | Upstream knowledge surface only; never TeamAi state or authority. |

### Deployment and browser-verification boundary

A Git commit or pull request is first a GitHub engineering/review event. It causes Vercel deployment activity only when an applicable Vercel deployment mechanism is configured and enabled, such as a connected Vercel Project with Git integration, a deployment hook, or an explicit Vercel deployment command/API call.

With Vercel Git integration, repository events can automatically create preview or production-related deployments according to the Vercel Project's branch/environment configuration. A Vercel deployment may retain Git metadata such as the triggering commit SHA/ref and, where applicable, pull-request identity.

Therefore the causal model is:

`commit/push → Git repository event → configured Vercel trigger → Vercel build/deployment → controlled web surface → browser verification`

and not:

`commit → Vercel automatically`

or

`pull request → Vercel automatically`.

The repository event alone has no TeamAi authority over Vercel. The currently authorized Vercel Project/control surface and its configuration determine whether an event consumes Vercel deployment activity. TeamAi MUST NOT infer a project, domain, deployment target, or environment from stale comments, historical bot output, screenshots, naming, or memory.

Vercel browser/web verification is opt-in and phase-bound to active web development/verification. It may cover UI work, UI-plus-backend integration, authenticated browser flows, commerce-facing browser flows, responsive behavior, controlled preview environments, and end-to-end browser smoke tests. It MUST NOT become a general prerequisite for backend, Firestore, commerce, documentation, recovery, or other non-web changes. Vercel quota/unavailability is a verification limitation, not a TeamAi architecture failure.

A Vercel deployment is an environment artifact. A browser-integrity run is verification evidence. Neither is TeamAi delivery authority, backend proof, commerce proof, scheduler authority, or final architecture acceptance. Firebase Hosting remains the TeamAi web delivery authority.

### Engineering verification boundary

GitHub source/review state and GitHub Actions execution state are related but distinct:

`GitHub repository / commit / PR → GitHub Actions workflow → CI execution/result → engineering evidence`

A green GitHub Actions run proves only the checks actually executed by that workflow. It does not prove Vercel browser behavior, Firebase runtime behavior, PayPal live behavior, or deployment success unless those exact checks were explicitly exercised and their evidence is recorded.

GitHub Actions MUST NOT be treated as a general orchestration authority for the Web AI Team. Product/runtime orchestration remains owned by TeamAi's scheduler and trusted execution boundaries.

### Firestore usage and resilience boundary

Cloud Firestore `(default)` remains the canonical durable TeamAi domain/application store. TeamAi MUST reduce unnecessary Firestore usage rather than replace Firestore authority. Preferred techniques include targeted reads, bounded queries, cursor pagination, safe client caching/offline persistence, selective realtime listeners, aggregation/summary patterns, idempotent writes, and external artifact storage with Firestore metadata/reference.

UI behavior MUST NOT claim durable mutation success until the authoritative Firestore write is confirmed. Under quota or temporary unavailability pressure, the system SHOULD detect the bounded failure, preserve local/recovery state where safe, avoid destructive retries, surface a truthful status, and reconcile when authoritative persistence becomes available.

Any alternate durable TeamAi domain store requires explicit Product Law / architecture reconciliation before implementation.

### Founder Pulse boundary

Founder Pulse is a read-only product-operations observation layer over GitHub/GitLab Issue flow. It may report movement, remaining open work, age, labels, visible delivery relationships, or process friction. It MUST NOT mutate repositories, authorize changes, initiate Vercel activity, become a scheduler, or become a parallel source of project truth.

GitLab support in Founder Pulse is observation capability only and does not add GitLab to the TeamAi architecture/control plane. The current decision to defer GitLab from TeamAi architecture/control-plane work remains in force until deliberately revisited.

## Product Team Boundary

TeamAi is a product built by one development domain for use with another AI-team domain:

`TeamAi Development Team → builds TeamAi → connects/equips/coordinates/orchestrates → Web AI Team`

The Web AI Team is not a collection of TeamAi source-code contributors by definition. It is the connected AI participation environment through which users can conduct planning, discussion, handoffs, working execution, tool use, and coordinated AI work.

TeamAi MUST preserve this boundary in terminology, UI, data models, permissions, documentation, and orchestration contracts. Planning or working behavior of the Web AI Team MUST NOT be represented as the internal development process of the TeamAi Development Team.

## Development Fields, Integration Boundary, and AI Responsibility Model

TeamAi SHALL use **Development Fields** to partition responsibility without partitioning product authority. A Development Field is a bounded area of responsibility inside the single TeamAi Development Team. The fields are complementary contributors to `main`, not separate product authorities.

The canonical connector between frontend and backend responsibilities is the **Application Integration & Contract Field**. It owns the contracts, adapters, validation boundaries, and reconciliation work required for frontend consumers and backend authorities to agree on the same facts and semantics. It MUST NOT become a shadow backend, a second scheduler, or a second frontend authority.

The responsibility model is:

`Product/Governance Field → defines authority and constraints`
`Backend/Runtime Field → owns server/domain/execution implementation within those constraints`
`Frontend/Experience Field → owns user-facing presentation and interaction within those constraints`
`Application Integration & Contract Field → reconciles the frontend/backend contract and prevents semantic drift`
`Verification/CI Field → proves the claimed behavior through deterministic checks and browser verification where applicable`
`Documentation/Knowledge Field → preserves traceability, handover, endorsement, and validated learning`
`Recovery/History Field → preserves recoverability, checkpoints, provenance, and safe reconciliation without rewriting history`
`Delivery/Operations Field → owns bounded release, hosting, runtime-observation, and operational evidence concerns without replacing product authority`

These fields describe **what responsibility is covered**, not how many permanent branches must exist. A repository MAY implement a field through one or more short-lived working branches, but the field remains the conceptual unit of responsibility.

### Frontend scope and backend scope

The **Frontend/Experience Field** includes presentation, interaction, accessibility, responsive behavior, frontend state presentation, and frontend-facing validation of backend-owned facts. It MUST NOT invent backend truth, mutate durable domain state directly outside authorized APIs, choose the scheduler's next actor, invoke external providers as an uncontrolled shortcut, or redefine Product Law.

The **Backend/Runtime Field** includes identity verification, durable domain/application state, task lifecycle, provider invocation boundaries, trusted execution, commerce correlation, entitlement projection, scheduler-owned eligibility, and durable execution evidence. It MUST NOT silently become the visual authority or redesign user-facing product semantics without reconciliation.

The **Application Integration & Contract Field** is the seam between those scopes. It exists to make the interface explicit: typed contracts, backend-fact schemas, adapters, error/status mappings, contract tests, integration fixtures, and reconciliation rules. It does not own either endpoint's domain authority. It is a **bridge, not a replacement authority**.

### Example: three Web AI Seats acting as a development team

A user may configure three Web AI Seats for TeamAi development:

- **AI-1 — Backend Seat:** works primarily in the Backend/Runtime Field and applies the backend skills needed for server, state, execution, provider, and commerce work.
- **AI-2 — Frontend Seat:** works primarily in the Frontend/Experience Field and applies frontend/spatial/accessibility/browser-facing skills.
- **AI-3 — Integration/Team Lead Seat:** works primarily in the Application Integration & Contract Field and coordinates the contribution flow. It can inspect both sides, create or update PRs/commits, reconcile contracts, run or request verification, and lead integration through the approved repository process.

AI-3 does **not** gain backend or frontend authority merely because it coordinates them. Leadership is a coordination responsibility, not an entitlement to override the specialized field owner's authority or the Product Law.

The same pattern may be used with more or fewer AI Seats. Seat role is determined by explicit project configuration, applicable skills, capabilities, authorization, connection health, task requirements, and scheduler eligibility; not by a branch name alone.

### Web AI cooperation and responsibility distribution

The Development Field model is directly relevant to the Web AI Team because it establishes the same separation principle TeamAi applies to connected AI Seats: **cooperation happens through explicit boundaries, not through uncontrolled direct authority transfer**.

For Web AI cooperation, the canonical conceptual chain is:

`AI Seat → assigned responsibility/skill bundle → eligible task → authorized action/tool → durable result/event → contract/state reconciliation → next eligible Seat`

An AI Seat may contribute research, critique, implementation, verification, documentation, or coordination according to its configured role. A Seat MUST NOT inherit another Seat's authority merely because its output is newer, more persuasive, or adjacent in time. Scheduler eligibility, authorization, task state, and durable events determine when another Seat may act.

Thus a Web AI Team can cooperate as a real team without requiring every AI to have the same skills or access. Responsibility is distributed by **Seat + Field + Skill + Capability + Authorization + Scheduler eligibility**, while TeamAi remains the common coordination and durable-state boundary.

### Main branch and history preservation

`main` is the canonical assembled TeamAi state. A branch is a **working field or temporary reconciliation surface**, not a second Product Law and not a mandatory permanent archive.

TeamAi MUST NOT create or retain branches solely to preserve history when the same history is already represented by commits, merged pull requests, issues, tags/checkpoints, evidence records, and handover/endorsement documents. Historical branches MAY be retained when they carry useful provenance or recovery value, but branch count is not a measure of product completeness.

The target operating model is a **small set of coverage fields** capable of covering the whole `main` surface. The initial target is approximately **7–8 canonical responsibility fields**, subject to future reconciliation:

1. Product & Governance
2. Backend & Runtime
3. Frontend & Experience
4. Application Integration & Contracts
5. Verification & CI/Browser
6. Documentation, Knowledge & Handover
7. Recovery, History & Reconciliation
8. Delivery & Operations

These are coverage categories, not a demand to keep exactly eight live branches at all times. The project SHOULD prefer a small number of active, purpose-specific branches and SHOULD close, supersede, or classify old branches once their unique value is captured and safely merged or preserved elsewhere.

A branch inventory therefore answers **where current work is happening**; the coverage model answers **whether the assembled `main` is fully represented**; the historical record answers **how the product got there**. These are different questions and MUST remain distinct.

## Web AI Population, Responsibility Allocation, Skill Control, and Main Integration

A **Web AI population** is the set of Web AI Seats configured by a user for a particular TeamAi Workplace/Project and operating purpose. Population size changes how responsibilities are distributed; it does not create additional product authorities.

TeamAi SHALL support responsibility allocation across a bounded practical population, with **2–8 Web AI Seats as the canonical configuration range for the team-development operating model**. A user MAY configure fewer or more Seats only where a future product rule explicitly permits it; this law defines the baseline 2–8 model and does not imply that every user must have eight Seats.

The user-facing configuration MUST therefore answer, before execution:

`Who is this Seat? → What Field(s) does this Seat cover? → Which skills are equipped? → Which capabilities/tools are enabled? → Which repository/branch scope is allowed? → Which actions are permitted? → Which actions require review/approval? → Which tasks may the scheduler assign?`

Seat population is not itself authority. The effective responsibility of a Seat is the intersection of:

`Seat identity + assigned Field + effective Skill bundle + Capability set + Authorization + Connection/entitlement state + branch/ref scope + Task requirements + Scheduler eligibility`

A skill MUST guide execution inside an allowed responsibility boundary; a skill MUST NOT grant authority by itself. A Seat with a backend skill but no backend authorization cannot perform backend-authoritative work. A Seat with merge capability but no Main Integration authorization cannot merge into `main`. A Seat with documentation skills but no canonical-document authorization cannot silently rewrite Product Law or another canonical authority.

### Canonical population examples

**Two-seat population — compact team:**

One Seat MAY combine Backend/Runtime + Frontend/Experience as a specialist/full-stack Seat, while the second Seat serves as Integration/Team Lead with Application Integration, Verification, repository coordination, PR/Issue flow, and team-conversation summarization responsibilities. Alternatively, two specialist Seats MAY split Frontend and Backend while the user remains the integration authority; the selected configuration MUST explicitly identify who owns integration and final merge responsibility.

**Three-seat population — balanced implementation team:**

The canonical example is Backend Seat + Frontend Seat + Integration/Team Lead Seat. This gives the two implementation domains independent responsibility while keeping contract reconciliation and contribution flow explicit.

**Four-seat population — user example / three contributors plus lead:**

The user MAY configure three specialist Web AI Seats, each working from its own controlled working branch, plus one **Main Integration/Team Lead Seat** responsible for reviewing contributions, managing PR/commit/Issue flow, reconciling the work, leading team conversation summarisation, coordinating verification, and determining what is ready to enter `main` through the approved repository process.

In this pattern:

`AI-1 branch → specialist contribution`
`AI-2 branch → specialist contribution`
`AI-3 branch → specialist contribution`
`AI-4 / Main Integration Seat → review + reconcile + verify + PR/merge coordination + summarise`

The Main Integration Seat MUST NOT use its leadership role as an unrestricted write path into `main`. The normal path remains:

`specialist branch → PR → verification/review → Main Integration decision → merge → main`

The Main Integration Seat may coordinate the repository process and may hold explicit merge authority where the project's authorization policy grants it. That authority is repository/change coordination authority, not automatic ownership of every underlying product field.

**Five-seat population:**

The four-seat model MAY be expanded by separating another responsibility such as Verification/CI, Documentation/Knowledge, or Recovery/History from a combined specialist role. The integration lead remains explicit rather than being hidden inside an unrelated specialist role.

**Six-seat population:**

The population MAY assign dedicated Backend/Runtime, Frontend/Experience, Integration/Contracts, Verification/CI, Documentation/Knowledge, and Main Team Lead responsibilities. Some fields MAY still be combined where workload does not justify a separate Seat.

**Seven-seat population:**

The population MAY additionally separate Recovery/History/Reconciliation from Documentation/Knowledge or give Delivery/Operations its own specialized Seat. The resulting team can cover most of the canonical fields without requiring every Seat to possess every skill.

**Eight-seat population — full field-oriented configuration:**

A user MAY assign one Seat primarily to each of the eight canonical Development Fields, with the Product/Governance or Main Integration/Team Lead responsibility explicitly configured as the supervisory coordination seat. The exact mapping MUST remain configurable because one external provider/model may appear through multiple Seats and because Seat capability, connection health, entitlement, authorization, and task demand can vary.

No population size changes the authority hierarchy. More Seats increase parallel responsibility capacity; they do not create more Product Laws, more canonical durable stores, more schedulers, or more independent product authorities.

### Skill equipment and control model

Every configured Web AI Seat SHOULD have an explicit **Responsibility Profile** containing at least:

`Seat → primary Field(s) → allowed secondary Field(s) → required skills → optional skills → allowed capabilities/tools → repository/ref scope → permitted operations → prohibited operations → approval requirements → escalation target`

The effective skill set SHOULD be resolved deterministically from the applicable TeamAi skill wiring and the Seat's authorized role. Skill selection MUST remain subordinate to Product Law, Masterplan, Policy/ORUCAVEAM, service authority, and task authorization.

The responsibility profile MUST distinguish **can read**, **can propose**, **can implement**, **can create PR/commit**, **can approve**, **can merge**, **can modify canonical documents**, and **can summarise/lead**. These actions are not interchangeable.

The profile MUST also encode negative boundaries. Examples include:

- A Frontend Seat may consume backend facts but MUST NOT become backend authority.
- A Backend Seat may implement runtime contracts but MUST NOT become visual authority.
- An Integration Seat may reconcile frontend/backend contracts but MUST NOT silently replace either endpoint's domain authority.
- A Verification Seat may prove behavior but MUST NOT create product authority by passing a test.
- A Documentation/Knowledge Seat may preserve traceability and learning but MUST NOT invent implementation truth.
- A Main Integration/Team Lead Seat may control contribution flow and merge coordination when authorized, but MUST NOT bypass Product Law, required review/approval, or scheduler policy.

A Seat's skill bundle MUST therefore be treated as **guided operational capability within an authorization envelope**, not as a grant of unrestricted power.

### Main Integration Seat and team conversation leadership

When a user configures a dedicated Main Integration/Team Lead Seat, TeamAi SHOULD expose explicit controls for:

`main/repository coordination + PR/commit/Issue coordination + contract reconciliation + verification coordination + team discussion summarisation + handover preparation + escalation`

Team conversation summarisation is a coordination capability. It MUST preserve materially relevant contributions, disagreements, decisions, constraints, warnings, unresolved questions, and evidence references. Summarisation MUST NOT silently become approval or implementation authority.

The Main Integration Seat MAY recommend that a task is ready for merge, but the effective merge authority is determined by the repository permission model and TeamAi authorization. Where human approval is required, the Main Integration Seat cannot replace it.

### Branch allocation rule for Web AI Seats

A working branch MAY represent a Seat's active contribution, a Field's active work, or a temporary integration/reconciliation workspace. The branch assignment is an execution aid, not the source of identity or authority.

For multi-seat development, TeamAi SHOULD prefer:

`one canonical main + a small number of active Seat/Field working branches + PR-based contribution flow`

rather than creating branches solely as permanent archives. A branch MAY be reused for successive tasks when doing so preserves a clean review boundary, or a fresh branch MAY be created when task isolation requires it.

The Main Integration Seat's special responsibility is to control **what enters `main`**, not to make `main` a personal workspace for unreviewed changes. `main` remains the canonical assembled state and must be advanced through the approved repository process.

### Scheduler and Web AI responsibility selection

The TeamAi scheduler MUST select the next eligible Web AI Seat from durable task state and the responsibility/authorization model rather than from conversational recency or branch naming.

A task is eligible for a Seat only when its task requirements intersect the Seat's assigned Field(s), effective skills, enabled capabilities/tools, authorization, connection health, repository scope, approval state, and other applicable constraints.

The scheduler MUST be able to represent situations where:

`a Seat has the skill but not the authorization`
`a Seat has the authorization but not the skill`
`a Seat has both but the connection is unhealthy`
`a Seat has both but the task is blocked or not yet eligible`
`a Seat can propose but cannot execute`
`a Seat can create a PR but cannot merge`
`a Seat can coordinate but cannot override a specialist authority`

These distinctions are essential to controlling heterogeneous Web AI populations safely and predictably.

### Responsibility distribution is a product feature

The user-accessible Team configuration MUST not merely ask **how many AI Seats** the user wants. It MUST help the user understand and configure **what each Seat is responsible for**, **what skills it is equipped with**, **what it may control**, and **what it must not control**.

The configuration model MUST make responsibility visible enough that a user can construct a two-seat, three-seat, four-seat, or larger team while preserving the same Product Law and authority boundaries. The UI MAY simplify presentation, but it MUST NOT hide the underlying responsibility model from TeamAi's authorization and scheduling layers.

`Web AI population size → responsibility distribution → skill equipment → capability/authorization envelope → branch/workspace scope → scheduler eligibility → execution → durable event → team coordination`

The purpose of the population model is not to force identical teams. It is to let the user shape a Web AI Team whose Seats have complementary responsibilities while TeamAi preserves one coherent product authority and one auditable history.

## Web AI Team Operating Stages

The Web AI Team may operate through distinct product stages. At minimum, TeamAi MUST preserve the distinction between:

**Planning Team stage** — deliberative discussion and planning controlled by the user. Configured Web AI Seats participate according to the user's turn settings. Contributions accumulate into a meaning-preserving discussion. A selected Web AI Team Lead/Summarizer may synthesize the discussion into a structured handoff for user review. The planning result is not execution authorization by itself.

**Working/Coding Team stage** — execution after the user approves or commands the transition from planning. The approved plan/handoff is decomposed into tasks and dependencies; the TeamAi scheduler selects eligible AI Seats, tools, or human interventions; actions produce durable results/events; and subsequent work becomes eligible through the orchestrator. Working execution MUST NOT silently rewrite the approved plan.

The Planning Team and Working/Coding Team are stages/operating modes of the Web AI Team experience. They are NOT the TeamAi Development Team, and they are NOT the two fundamental teams in the project.

## User Intent and AI-to-AI Orchestration

TeamAi MUST preserve the user's authority across multi-AI discussion and execution.

Every Planning Team turn MUST be grounded in the current authoritative user instruction plus the accumulated materially relevant team discussion and approved project context. The immediately previous AI response is only one contribution. **Latest AI ≠ latest authority.** Context compression, summaries, retrieval, and artifact references may reduce payload size but MUST preserve materially relevant meaning, including objectives, clarifications, contributions, disagreements, decisions, constraints, warnings, unresolved questions, and important findings/artifacts/events.

AI applications/providers MUST NOT directly orchestrate one another. The canonical coordination path is:

`AI result/action proposal → durable structured event → task/state transition → scheduler eligibility → next AI Seat/tool/human → new event`

The TeamAi scheduler owns next-actor selection and policy evaluation. MCP, plugins, and provider-native mechanisms are capability/integration surfaces, not TeamAi orchestration authority.

## Team Leader, Summarizer, and Authority

The Web AI Team Leader is a supervisory AI Seat/capability within the Web AI Team experience. It may monitor participation, stalled work, contradictions, missing handoffs, repeated failures, verification gaps, or budget anomalies and recommend bounded coordination actions. It MUST NOT bypass TeamAi authorization or human approval boundaries.

The selected Web AI Summarizer is a distinct seat/capability for synthesizing the relevant Planning Team discussion into a structured handoff. It preserves material disagreements and unresolved questions and returns the result to the user for review. Summarization alone is not authorization and is not an unrestricted document-mutation authority.

Where one AI is selected to formally document an agreed planning change, that role is an explicit product authorization/configuration decision; other Web AI Seats may remain advisory and may critique, investigate, or provide pros/cons without becoming the canonical document author.

## Web AI Connection and Seat Boundary

External AI applications may require setup outside TeamAi. The canonical product relationship is:

`External AI application/provider account → user-authorized connection → TeamAi capability test → Workplace/Project → Web AI AI Seat → runtime/model + skills + tools/plugins + workstation + scopes + limits`

A Connection represents the externally authorized relationship. An AI Seat represents the TeamAi participation identity and policy configuration. A Seat may reference a Connection, but these concepts MUST remain distinct.

A capability is not automatically usable merely because it exists. TeamAi MUST preserve the distinction:

`available ≠ configured ≠ TeamAi-entitled ≠ provider-compatible ≠ authorized ≠ project-scoped ≠ seat-allowed ≠ healthy ≠ usable`

Loss of authorization, entitlement, compatibility, scope, workstation availability, or health MUST block only the affected capability/Seat while preserving diagnostic and recovery state.

## Capability and Tool Boundary

Plugins, tools, and MCP are capabilities/integration mechanisms, not intelligence or orchestration authority.

`Web AI Seat → authorized tool intent → TeamAi policy/permission boundary → project-scoped integration → invocation → result/artifact → durable event`

Tool results MUST NOT silently grant permissions. Secrets MUST remain outside ordinary chat content. Tool invocations MUST be attributable to the requesting Seat and project.

TeamAi-native capabilities and optional external Tool Quality capabilities MUST remain distinct. Base TeamAi capability categories may include project/team context, structured handoff, task/state reporting, authorized artifacts/files, authorized search/research, human approval/intervention, and coordination/readiness visibility. Not every capability must be implemented as MCP.

## Commercial Capability Boundary

The commercial planning model separates three concepts:

`Team Quality ≠ Tool Quality ≠ Provider Entitlement`

Team Quality is the future TeamAi product axis for Solo/Team operating mode, AI-seat capacity, model allocation, orchestration capacity, and related resource limits.

Tool Quality is the future capability axis for Base TeamAi capabilities plus optional tools/plugins/MCP servers and specialist integrations.

Provider entitlement remains externally owned. A TeamAi subscription MUST NOT masquerade as a provider subscription. An advanced model entitlement MUST NOT automatically imply additional tools, and a Tool Quality purchase MUST NOT automatically grant a provider subscription or model entitlement.

Exact prices, model catalogs, seat counts, provider bundles, tool packs, and commercial limits remain planning-only until explicitly approved.

## TEAM-EXPERIENCE-029 Visual Experience Law

TeamAi uses a single overall theme setting with two mode-specific visual treatments:

- **Dark mode = Dark Spatial Glassmorphism.**
- **Light mode = Light Spatial Skeuomorphism.**

The two modes are one bounded theme system, not two competing design authorities. The user-facing light/dark setting switches the active treatment; it does not duplicate application state, business rules, permissions, scheduler semantics, or backend authority.

The visual system MUST be implemented through shared design tokens/primitives and canonical spatial UI roots so that the semantic behavior of a component remains equivalent across both modes. Spatial depth, material treatment, elevation, translucency, borders, controls, typography, motion, focus, status feedback, responsive behavior, and accessibility remain implementation concerns under this visual law.

The theme MUST preserve legibility, focus visibility, keyboard navigation, reduced-motion behavior, responsive behavior, and semantic accessibility. Visual effects MUST NOT become a prerequisite for or source of durable application state.

The spatial theme is a 029 product-experience requirement and must be executed chronologically through the Masterplan, Policy/ORUCAVEAM, the applicable frontend spatial skill, system implementation, browser/accessibility verification, evidence, HandOver, Endorsement, and Product Knowledge when a reusable lesson is validated.

## LAW 101 — IMPLEMENTATION TRACEABILITY IS A HARD COMPLETION GATE
Every implementation claim MUST be traceable from its governing Product Law and Masterplan execution item through the applicable Policy/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone MUST NOT be treated as implementation completion. A missing traceability link blocks the affected completion claim until an explicit, evidence-backed exception is recorded by the authorized human.

## LAW 102 — SERVICE AUTHORITY MUST BE EXECUTABLE
The canonical service-authority map is not merely documentation. Backend code MUST reject authority mismatches so that identity, application state, execution, payment, engineering, and delivery responsibilities cannot silently migrate between services.

## LAW 103 — DURABLE STATE PRECEDES TRUSTED EXECUTION
A task or external event MUST have a durable identity, ownership context, lifecycle/idempotency identity, and evidence model before trusted execution or commerce mutation is considered complete. In-memory success is not durable completion.

## LAW 104 — FIREBASE UID IS THE DOMAIN OWNERSHIP ROOT
TeamAi application/domain paths MUST be rooted in the authenticated Firebase UID. Client-provided identifiers MUST NOT be treated as proof of ownership. Server-side correlation is required wherever an external provider, including PayPal, establishes an event or entitlement.

## LAW 105 — FIREBASE PROJECT IDENTITY IS AN ARCHITECTURE INVARIANT
The authoritative TeamAi Firebase project is `team-ai-official`. Firebase project identity MUST be explicit and MUST NOT be inferred from repository/product names, screenshots, historical artifacts, remembered context, or similarly named projects. `homefinder-official` and other Firebase projects are distinct and non-authoritative unless a future architecture change explicitly replaces the current project and updates the canonical identity contract first.

All Firebase-dependent surfaces MUST reconcile to the same authoritative project: Firebase Auth, Firestore `(default)`, Hosting, Web SDK `projectId`, CLI target, and trusted Edge-runtime service-account `project_id`. If these identities conflict, the affected deployment or verification MUST STOP until reconciliation is complete. A public Web SDK configuration may identify a project but MUST NOT be treated as a privileged credential. Admin/service-account credentials MUST remain secret.

Project identity reconciliation MUST precede Firebase runtime diagnosis. Historical project evidence may establish provenance but MUST NOT override current authoritative configuration.

## CANONICAL BACKEND EXTENSION INVARIANT
The canonical backend is a multi-authority system, not a single endpoint or wire. Canonical Auth, canonical durable domain state, canonical trusted execution, canonical commerce, and canonical execution evidence are distinct responsibilities with explicit authorities and contracts.

Adding payment buttons, subscription products/plans, promotional variants, or additional PayPal-facing commercial flows MUST extend the existing canonical commerce contracts and preserve the same server-owned correlation to the authenticated Firebase UID. Adding another sign-in/authentication method MUST extend the canonical Firebase Auth identity boundary and preserve the same authoritative Firebase UID/domain ownership model.

Such extensions MUST NOT require moving TeamAi domain state to another database, replacing the Firebase UID ownership root, allowing the browser to self-attest payment or entitlement state, or creating a parallel authority path. A new provider, authentication method, payment product, delivery/verification surface, or UI control is an extension of an existing authority boundary unless an explicit Product Law / architecture change replaces that boundary first.

## Phase 0 disposition
Phase 0 is the clean development-entry gate. It verifies the active repository baseline, retired-backend removal from supported paths, service authority boundaries, team/toolkit boundaries, and synchronization of the current execution gate before TEAM-BACKEND-001 implementation.

## TEAM-BACKEND-001 implementation disposition
The first executable foundation contracts are implemented and recorded: service authority assertions, UID-rooted Firestore path construction, deterministic effective-skill resolution, durable task transitions, durable event identity requirements, and the server-owned commerce correlation contract.

### Live Firebase milestone — 2026-09-03
The authoritative Firebase project `team-ai-official` is live and its `(default)` Firestore database is reachable. The `teamai-domain-bootstrap` trusted persistence slice has passed its executable Firebase persistence gate:

`Firebase ID token → verified Firebase UID → Firestore hierarchy → independent Firestore confirmation → repeat-call idempotency`

Evidence includes:
- invalid Firebase ID token rejected with HTTP 401;
- missing Firebase Authorization rejected with HTTP 401;
- valid authenticated bootstrap persisted the gate-3 test hierarchy with HTTP 200;
- the exact nested Firestore seat document was independently read and returned actual stored values;
- an identical authenticated repeat request returned HTTP 200 with existing-value results.

Detailed evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE3_2026-09-03.md` and `docs/backend/FIREBASE_EDGE_PERSISTENCE_IMPLEMENTATION_2026-09-03.md`.

### Gate 5B — server-owned PayPal correlation contract — PASS
The backend encodes a bounded server-owned commerce correlation contract in `src/backend/commerce.ts`. A trusted server flow establishes a pending `firebaseUid + correlationId + provider` intent; only a verified PayPal provider event may bind the PayPal event ID to that intent, with an idempotency key derived from the provider event ID. This preserves Firebase UID ownership and prevents browser-provided ownership data from becoming payment authority.

Direct source-contract validation passed in a temporary local workspace using TypeScript 5.8.3 with strict NodeNext settings and Node.js 22.16.0. The behavioral assertions covered server-owned intent creation, verified-event binding, preserved UID ownership, deterministic idempotency key derivation, empty provider-event rejection, and Firebase-UID-rooted commerce paths.

Observed result: `GATE5B_DIRECT_TEST=PASS`.

Detailed evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE5B_2026-09-03.md` and `docs/evidence/GATE5B_DIRECT_VALIDATION_2026-09-03.md`.

This is an evidence-backed source-contract pass, not TEAM-BACKEND-001 completion. No live PayPal transaction, webhook business processing, entitlement activation, or replay-protection completion claim is made by Gate 5B.

### Gate 5C — implementation and available-environment verification — PASS / CLOSED
Gate 5C implementation and available-environment verification are complete. The canonical commerce runtime boundary verifies PayPal webhook authenticity, applies replay/idempotency controls, durably records authenticated commerce events in Firestore under the Firebase UID, and projects entitlement state only from authenticated provider events correlated to a server-owned intent.

The remaining evidence item is **live PayPal transaction/webhook runtime validation**. This is an external/live runtime evidence requirement, not an unfinished Gate 5C implementation. The current environment constrains that live PayPal test; it MUST NOT be represented as a failed Gate 5C architecture or implementation.

Until that live PayPal evidence is captured, TEAM-BACKEND-001 final completion endorsement remains pending. No broader 5C implementation work should be reopened merely because the live external test remains outstanding.

## Canonical execution-document relationship
`PRODUCT_LAW.md` establishes durable product/architecture invariants. `MASTERPLAN.md` translates those invariants into the chronological execution plan and checklist. `POLICY.md` establishes execution discipline through the single ORUCAVEAM framework. `docs/SKILL_WIRING.md` maps executable concepts/checklist items to the applicable skill path, tool/system, and verification route. `skills/**/SKILL.md` provide direct operational instructions without becoming product authority. `PRODUCT-KNOWLEDGE.md` retains validated, distilled lessons. `docs/project-guide/HandOver.md` preserves continuation and learning transfer. `docs/project-guide/Endorsement.md` records authorized completion and accepted learning. `AI_ASSISTANT_READ_ME.md` provides practical agent memory and recovery guidance.

Lower-level documents MUST NOT silently redefine Product Law. A change to a canonical product concept MUST be reconciled against the existing logic before editing, and any discrepancy that affects authority, architecture, scope, or protected roots MUST be surfaced before proceeding.

This front door MUST remain synchronized with active authority changes.
