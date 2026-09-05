# PRODUCT LAW — TeamAi Canonical Front Door

`PRODUCT_LAW.md` is the highest product authority for TeamAi. It defines what must remain true about the product, its responsibilities, its boundaries, and its canonical authorities. Implementation, UI, deployment, provider, tool, branch, skill, workspace, or documentation conventions MUST NOT silently override it.

This document is intentionally written as a connected law system rather than a collection of isolated rules. Repeated concepts are defined once and then referenced by the flow in which they participate.

## 0. Canonical Product Law Flow

The whole product follows one project-wide authority and execution chain:

```text
Human User Authority
        │
        ▼
PRODUCT LAW
(product meaning, invariants, authority boundaries)
        │
        ▼
MASTERPLAN
(chronological plan, gates, dependencies)
        │
        ▼
POLICY / ORUCAVEAM
(how an authorized command is evaluated and executed)
        │
        ▼
DEVELOPMENT FIELD
(responsibility boundary)
        │
        ▼
RESPONSIBILITY PROFILE
(Seat + Fields + permissions + scope + negative boundaries)
        │
        ├───────────────┐
        ▼               ▼
WORKSPACE RULESET    REQUIRED SKILLS
(native workspace    (how to perform the
operating context)    responsibility)
        │               │
        └───────┬───────┘
                ▼
CAPABILITIES / TOOLS
(available mechanisms)
                │
                ▼
AUTHORIZATION
(permitted control)
                │
                ▼
TASK REQUIREMENTS + DURABLE TASK STATE
                │
                ▼
SCHEDULER ELIGIBILITY
(when this Seat may act)
                │
                ▼
TRUSTED ACTION / EXECUTION
                │
                ▼
DURABLE RESULT / EVENT / ARTIFACT
                │
        ┌───────┴────────┐
        ▼                ▼
VERIFICATION      INTEGRATION / RECONCILIATION
        │                │
        └───────┬────────┘
                ▼
HANDOVER / ENDORSEMENT
                │
                ▼
PRODUCT KNOWLEDGE
(validated learning)
                │
                ▼
REUSABLE SKILL / WORKSPACE KNOWLEDGE PROMOTION
(without silent authority expansion)
```

### 0.1 Meaning of the flow

**Product Law** answers what TeamAi is and what may never be violated. **Masterplan** converts those invariants into a chronological build and delivery path. **ORUCAVEAM** governs the command itself. A **Development Field** says which responsibility area is being addressed. A **Responsibility Profile** says which configured Seat is responsible and what it may and may not do. A **Workspace Ruleset** supplies the selected workspace's native procedures without becoming a second constitution. **Skills** describe how the authorized responsibility is performed. **Capabilities** describe the mechanisms available to the Seat. **Authorization** determines which controls are actually permitted. **Durable task state** and the **Scheduler** determine whether the Seat is eligible to act now. Execution produces durable state and evidence. Verification and integration reconcile the result. Handover and endorsement preserve continuation and acceptance. Product Knowledge captures validated lessons so the same learning can improve future skills and workspace rules.

### 0.2 Project-wide invariant

The project-wide invariant is:

`Product Law → ORUCAVEAM → responsibility → workspace context → skills → capabilities → authorization → scheduler eligibility → execution → evidence → integration → learning`

Changing a workspace, Seat, skill bundle, provider, branch, or UI configuration MUST NOT create a parallel authority chain.

## 1. Current execution authority

The current execution sequence is:

`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

**Current phase:** `TEAM-BACKEND-001 — IN IMPLEMENTATION`.

This status is part of the current project state; it is not a license to treat unfinished external evidence as complete.

## 2. Core authority invariants

1. Human user authority remains above AI authority.
2. **TeamAi Development Team and Web AI Team are different entities.** The TeamAi Development Team builds, governs, tests, documents, and delivers TeamAi. The Web AI Team is the user's configured collection of externally operated AI applications/providers that TeamAi connects to, equips, coordinates, and orchestrates.
3. When the connected product experience is meant, use **Web AI Team** rather than the ambiguous phrase **AI Team**.
4. TeamAi does not own externally operated AI provider accounts, subscriptions, provider-native workspaces, or provider models. TeamAi owns the connection, participation, policy, durable-state, and orchestration boundaries it provides.
5. A **Web AI Seat** is a TeamAi participation identity/configuration for an externally operated AI application/runtime. The distinctions below are permanent:

`application ≠ provider ≠ service/runtime ≠ model ≠ connection ≠ seat ≠ skill ≠ capability/tool/MCP ≠ workstation ≠ entitlement ≠ authorization`

6. The same provider/model may participate through multiple Seats with different roles, skills, tools, workstations, scopes, permissions, limits, and approval requirements.
7. Web AI and Development AI are separate operational domains.
8. Universal ToolKit is upstream-only. Validated/generalized TeamAi learning may flow into ToolKit; ToolKit does not become TeamAi authority.

## 3. Canonical service and platform authority map

A technical connection does not grant authority. Each platform is bounded to the role below.

| Platform / surface | Canonical TeamAi usage | Authority boundary |
|---|---|---|
| Firebase Authentication | Sign-in and authenticated Firebase UID establishment. | Identity authority only. |
| Cloud Firestore `(default)` | Durable TeamAi domain/application state, including accounts, Workplaces, Projects, Seats, tasks, and events. | Canonical durable TeamAi state authority. |
| Firebase Hosting | Delivery of the current TeamAi web application. | Current TeamAi web delivery authority. |
| Supabase Edge Functions | Trusted server execution, protected server operations, and PayPal webhook receipt. | Trusted execution authority; not TeamAi domain-state authority. |
| Supabase Postgres | Supabase platform infrastructure where needed. | Infrastructure only; never TeamAi domain/application authority. |
| PayPal | External payment events used by TeamAi commerce correlation and entitlement projection. | External payment-event authority; TeamAi retains correlation and projection rules. |
| GitHub | Repository, commits, branches/refs, pull requests, Issues, reviews, and engineering history. | Engineering/source/change authority. |
| GitHub Actions | CI, repository checks, automated verification, authority audits, recovery checks, and engineering automation. | Verification/engineering execution surface; not Web AI runtime orchestration authority. |
| Vercel | Controlled web development/preview/browser-verification surface when explicitly authorized for relevant web work. | Non-authoritative web surface. It is currently paused/cut off for TeamAi verification and MUST NOT be resumed or used without explicit user approval. |
| Founder Pulse | Read-only observation of issue flow and delivery patterns. | Observation/management layer only. |
| External AI applications/providers | External runtimes/models participating through authorized connections and Seats. | Ownership remains external; TeamAi controls its participation and coordination boundary. |
| MCP/tools/plugins/integrations | Capabilities exposed to authorized Seats. | Capability/integration surface only. |
| Universal ToolKit | Upstream validated knowledge/process repository. | Upstream knowledge only; never TeamAi domain authority. |

### 3.1 Engineering source and verification are distinct

`GitHub repository / commit / PR → GitHub Actions workflow → CI execution/result → engineering evidence`

A green Actions run proves only the checks actually executed. It does not automatically prove Firebase runtime behavior, PayPal live behavior, browser behavior on an external deployment surface, or overall product completion.

GitHub Actions MUST NOT become a general Web AI Team scheduler. Product/runtime orchestration remains owned by TeamAi's scheduler and trusted execution boundaries.

### 3.2 Browser/deployment boundary

A commit or pull request is first a GitHub engineering/review event. A deployment on another platform requires an explicit configured trigger or authorized deployment mechanism.

The conceptual causal chain is:

`commit/push → repository event → configured deployment trigger → deployment → controlled web surface → browser verification`

A deployment artifact is not proof of architecture or backend authority. Browser verification is evidence for the browser behaviors actually exercised.

Vercel is an optional/non-authoritative verification surface. Current policy places Vercel in a paused/cutoff state; TeamAi MUST NOT infer a project, deployment target, environment, or resumed access from stale comments, screenshots, bot messages, memory, or naming.

### 3.3 Firestore usage and resilience

Cloud Firestore `(default)` remains the canonical durable TeamAi store. TeamAi SHOULD reduce unnecessary reads/writes without changing that authority through targeted reads, bounded queries, cursor pagination, safe caching/offline persistence where appropriate, selective realtime listeners, aggregation/summary patterns, idempotent writes, and external artifact storage with Firestore metadata/reference.

UI behavior MUST NOT claim durable mutation success until the authoritative write is confirmed. Under bounded quota or temporary unavailability, the system SHOULD detect the failure, preserve local/recovery state where safe, avoid destructive retries, expose truthful status, and reconcile when authoritative persistence is available.

Any alternate durable TeamAi domain store requires explicit Product Law / architecture reconciliation before implementation.

### 3.4 Founder Pulse boundary

Founder Pulse is a read-only observation layer over issue flow and delivery patterns. It MAY report movement, remaining work, age, labels, visible delivery relationships, or process friction. It MUST NOT mutate repositories, authorize changes, initiate deployments, become a scheduler, or become a parallel source of project truth.

GitLab use within Founder Pulse is observation capability only and does not add GitLab to the TeamAi architecture/control plane unless Product Law is explicitly changed.

## 4. Product Team boundary

The product relationship is:

`TeamAi Development Team → builds TeamAi → connects/equips/coordinates/orchestrates → Web AI Team`

The Web AI Team is not, by definition, TeamAi source-code contributors. It is the connected AI participation environment for planning, discussion, handoffs, working execution, tool use, and coordinated AI work.

This distinction MUST remain stable across terminology, UI, data models, permissions, documentation, orchestration, and user guidance.

## 5. Development Fields

A **Development Field** is a bounded responsibility area inside the single TeamAi Development Team. Fields partition responsibility without partitioning product authority.

The canonical responsibility surface is:

1. Product & Governance
2. Backend & Runtime
3. Frontend & Experience
4. Application Integration & Contracts
5. Verification & CI/Browser
6. Documentation, Knowledge & Handover
7. Recovery, History & Reconciliation
8. Delivery & Operations

These are coverage categories, not a requirement for exactly eight permanent branches.

### 5.1 Field relationships

`Product/Governance → defines authority and constraints`

`Backend/Runtime → owns server/domain/execution implementation inside those constraints`

`Frontend/Experience → owns user-facing presentation and interaction inside those constraints`

`Application Integration & Contracts → reconciles frontend/backend contracts and prevents semantic drift`

`Verification/CI → proves the claimed behavior through deterministic checks and browser verification where applicable`

`Documentation/Knowledge → preserves traceability, handover, endorsement, and validated learning`

`Recovery/History → preserves checkpoints, provenance, recoverability, and safe reconciliation without rewriting history`

`Delivery/Operations → handles bounded release, hosting, runtime observation, and operational evidence without replacing product authority`

A Field defines responsibility, not permission by itself.

### 5.2 Frontend, backend, and integration boundaries

**Frontend/Experience** includes presentation, interaction, accessibility, responsive behavior, and frontend presentation/validation of backend-owned facts. It MUST NOT invent backend truth, bypass authorized APIs, choose the scheduler's next actor, invoke providers through uncontrolled shortcuts, or redefine Product Law.

**Backend/Runtime** includes identity verification, durable domain state, task lifecycle, provider invocation boundaries, trusted execution, commerce correlation, entitlement projection, scheduler-owned eligibility, and durable execution evidence. It MUST NOT silently become visual authority.

**Application Integration & Contracts** is the explicit seam: typed contracts, backend-fact schemas, adapters, error/status mappings, contract tests, fixtures, and reconciliation rules. It is a bridge, not a second backend, second scheduler, or replacement frontend authority.

## 6. Branches, main, and history

`main` is the canonical assembled TeamAi state.

A branch is a working Field, Seat contribution surface, or temporary reconciliation workspace. It is not a second Product Law and is not automatically a permanent archive.

The project SHOULD prefer:

`one canonical main + a small set of active purpose-specific branches + PR-based contribution flow`

rather than branch accumulation.

History MAY be preserved through commits, merged PRs, Issues, tags/checkpoints, evidence, handover, endorsement, and branch retention where a branch carries unique provenance or recovery value.

Three questions MUST remain separate:

`branch inventory = where current work is happening`

`coverage model = whether the assembled main is fully represented`

`historical record = how the product got here`

Branch count is not a measure of product completeness.

## 7. Web AI workforce model

A **Web AI population** is the set of Web AI Seats configured for a TeamAi Workplace/Project and operating purpose.

TeamAi's canonical team-development baseline is **2–8 Web AI Seats**. Population size changes responsibility distribution; it does not create additional product authorities.

The user-facing configuration must make the following relationship explicit:

`Seat identity → Field(s) → skills → capabilities/tools → scope → permitted/prohibited operations → approval requirements → scheduler eligibility`

### 7.1 Responsibility Profile

Each configured Seat SHOULD have a Responsibility Profile containing:

`Seat → primary Field(s) → allowed secondary Field(s) → required skills → optional skills → capabilities/tools → workspace/repository/ref scope → permitted operations → prohibited operations → approval requirements → escalation target → coordination role`

The effective operating authority is the intersection of:

`Seat identity + assigned Field + effective Skill bundle + Capability set + Authorization + Connection/entitlement state + Workspace/ref scope + Task requirements + Scheduler eligibility`

The following permissions are distinct and MUST remain distinct:

`can read ≠ can propose ≠ can implement ≠ can commit ≠ can create PR ≠ can approve ≠ can merge ≠ can modify canonical documents ≠ can coordinate ≠ can summarise`

A skill is guided operational capability inside an authorization envelope. It is not a permission grant.

### 7.2 Population scaling

**2 Seats:** broader responsibility bundles may be necessary; integration/final-merge authority must still be explicit.

**3 Seats:** Backend + Frontend + Integration/Lead is the canonical balanced pattern.

**4 Seats:** three specialist contributors plus a dedicated Main Integration/Team Lead Seat is a canonical parallel-development pattern.

**5–8 Seats:** additional specialization MAY be introduced for Verification, Documentation, Recovery, Delivery/Operations, or other explicitly reconciled responsibilities.

A larger population MAY use narrower skills; a smaller population MAY combine more responsibilities. Neither model permits authority to escape its authorization envelope.

## 8. Main Integration / Team Lead Seat

A dedicated Main Integration / Team Lead Seat is a coordination role, not automatic ownership of every Field.

It MAY coordinate:

`main/repository flow + PR/commit/Issue coordination + contract reconciliation + verification coordination + team summarisation + handover preparation + escalation`

It MUST NOT use leadership as an unrestricted write path into `main`.

The normal repository contribution flow is:

```text
Specialist Seat / Field
        ↓
Working branch
        ↓
Commit
        ↓
Pull Request
        ↓
Verification / Review
        ↓
Main Integration decision
        ↓
Authorized merge
        ↓
main
```

The Main Integration Seat MAY recommend readiness and coordinate the flow. Effective merge authority is determined by repository permissions and TeamAi authorization, with human approval retained wherever required.

## 9. Web AI cooperation and whole-team knowledge continuity

Every active Web AI Seat MUST have enough authoritative project knowledge for the task at hand, including the objective, current state, relevant dependencies, assigned responsibility, restrictions, material decisions, unresolved questions, verification state, and handoff expectations.

A Seat MUST NOT be expected to cooperate safely using only its own conversation, branch, or most recent response.

The canonical continuity packet is:

```text
User authority
     +
Project context
     +
Relevant team discussion
     +
Durable task/event state
     +
Applicable workspace state
     +
Evidence / handover
     ↓
Authorized context packet
     ↓
Web AI Seat
```

Separate external AI applications MUST be connected through TeamAi-authorized context, structured events, summaries, handoffs, workspace records, or other approved integration mechanisms.

### 9.1 Orchestration boundary

Direct provider-to-provider orchestration is prohibited.

The canonical coordination path is:

`AI result/action proposal → durable structured event → task/state transition → scheduler eligibility → next Web AI Seat/tool/human → new event`

The latest response is not the latest authority. Context compression MUST preserve materially relevant meaning, including objectives, clarifications, contributions, disagreements, decisions, constraints, warnings, unresolved questions, and important findings/artifacts/events.

### 9.2 Planning and Working stages

**Planning Team stage:** deliberative discussion under user control. Configured Web AI Seats participate according to user turn settings. A selected Summarizer/Team Lead MAY synthesize a structured handoff for user review. The planning result is not execution authorization by itself.

**Working/Coding Team stage:** execution after user approval/command. The approved plan/handoff is decomposed into tasks and dependencies. The scheduler selects eligible Seats, tools, or human intervention. Actions produce durable results/events. The approved plan MUST NOT be silently rewritten during execution.

Planning and Working are stages of the Web AI Team experience. They are not the TeamAi Development Team.

## 10. Web AI connection, capability, and tool boundaries

External setup may occur outside TeamAi. The canonical participation relationship is:

`External application/provider account → user-authorized connection → TeamAi capability test → Workplace/Project → Web AI Seat → runtime/model + skills + capabilities + tools + workstation + scopes + limits`

A Connection is the externally authorized relationship. A Seat is the TeamAi participation identity/configuration. They are distinct.

A capability is not automatically usable. TeamAi MUST preserve:

`available ≠ configured ≠ TeamAi-entitled ≠ provider-compatible ≠ authorized ≠ project-scoped ≠ seat-allowed ≠ healthy ≠ usable`

Loss of authorization, entitlement, compatibility, scope, workstation availability, or health MUST block only the affected capability/Seat while preserving diagnostic and recovery state where possible.

Plugins, tools, and MCP are capability/integration mechanisms, not intelligence or orchestration authority.

```text
Web AI Seat
    ↓
authorized tool intent
    ↓
TeamAi policy / permission boundary
    ↓
project-scoped integration
    ↓
invocation
    ↓
result / artifact
    ↓
durable event
```

Tool results MUST NOT silently grant permissions. Secrets MUST remain outside ordinary chat content. Invocations MUST be attributable to the requesting Seat and project.

TeamAi-native capabilities and optional external Tool Quality capabilities remain distinct. TeamAi capability categories may include team/project context, structured handoff, task/state reporting, authorized artifacts/files, authorized search/research, human approval/intervention, and coordination/readiness visibility.

## 11. Commercial boundary

The commercial model separates:

`Team Quality ≠ Tool Quality ≠ Provider Entitlement`

**Team Quality** is the planned TeamAi product axis for Solo/Team operation, Seat capacity, model allocation, orchestration capacity, and related resource limits.

**Tool Quality** is the planned capability axis for Base TeamAi capabilities plus optional tools/plugins/MCP servers and specialist integrations.

**Provider entitlement** remains externally owned. A TeamAi subscription MUST NOT masquerade as a provider subscription. An advanced provider model entitlement does not automatically grant TeamAi tools, and a Tool Quality purchase does not automatically grant a provider subscription or model entitlement.

Exact prices, model catalogs, seat counts, provider bundles, tool packs, and commercial limits remain planning-only until explicitly approved.

## 12. Workspace law

The user MAY select a workspace model for a project. The selected workspace supplies native collaboration primitives, repository concepts, review mechanisms, branch/ref behavior, issue/task mechanisms, verification hooks, permissions, and operational controls.

For the current coding-focused scope, **GitHub is the first concrete workspace model**.

The GitHub conceptual flow is:

`repository → branch/ref → commit → pull request → review → Issue/task → verification → merge → main`

Workspace selection changes operating context; it does not change Product Law, human authority, ORUCAVEAM, TeamAi service authority, Seat identity, or canonical durable-state ownership.

### 12.1 Workspace Ruleset Repositories

TeamAi MAY maintain a separate **Workspace Ruleset Repository** for each supported workspace platform or major workspace variant.

A ruleset repository is a platform-specific operational adapter. It MAY contain:

`workspace primitives + native roles + review flow + task flow + branch/ref behavior + workspace permissions + verification mechanisms + failure/recovery behavior + mapping into TeamAi responsibilities`

It MUST NOT redefine:

`human authority + Product Law + ORUCAVEAM + TeamAi service authorities + Web AI Seat identity + canonical durable state + scheduler authority + protected approvals`

Each ruleset SHOULD identify its supported platform/version assumptions, evidence basis, applicable Fields, applicable skills, known limitations, and mapping back to Product Law.

### 12.2 Workspace-aware skill resolution

The canonical skill-resolution chain is:

`Product Law → project purpose → Development Field → Responsibility Profile → workspace ruleset → required skills → allowed capabilities/tools → authorization → task requirements → scheduler eligibility`

A GitHub-specific skill is not automatically suitable for another workspace. Workspace-specific skills MAY contain native concepts that have no direct GitHub equivalent.

Workspace choice therefore changes skill recommendation and packaging without elevating authority.

### 12.3 Workspace expansion law

The current scope is coding-first. Future support for other workspace platforms, backend systems, company/business functions, specialist applications, MCP servers, or broader workforce domains requires explicit study of actual platform primitives, boundaries, evidence requirements, and integration semantics before adoption.

The reusable future chain is:

`responsibility → skills → capabilities → authorization → workspace → execution → verification → integration → learning`

## 13. Skill evolution law

Skills MUST be capable of growing as TeamAi grows, but skill growth is an evidence-backed process.

The canonical growth path is:

`new requirement / learning → Product Law or Masterplan reconciliation → Policy/ORUCAVEAM routing → skill design/change → implementation → deterministic verification → evidence → Product Knowledge → reusable skill/version promotion`

A skill MAY be created, extended, specialized, composed, deprecated, superseded, or upgraded. It MUST NOT silently expand authority.

Every material skill upgrade SHOULD preserve a distinction between:

`knowledge improvement` and `authority expansion`

Better knowledge may teach an already-authorized Seat a better procedure. Authority expansion requires explicit authorization and applicable Product Law/policy reconciliation.

Skills SHOULD be versionable and traceable to the Product Law, applicable workspace ruleset, evidence, and validated Product Knowledge.

Where an existing skill can be specialized or composed to satisfy a new requirement, TeamAi SHOULD prefer that over an unnecessary duplicate skill family.

## 14. ZipSkills law

**ZipSkills** is the planned commercial packaging mechanism for validated TeamAi skill bundles, workspace-specific skill bundles, or capability-oriented skill collections.

ZipSkills packages validated operational knowledge and composition. It MUST NOT sell Product Law authority.

Purchase or enabling of a ZipSkills package MUST NOT, by itself, grant repository permissions, backend authority, merge authority, scheduler control, provider subscriptions, payment entitlements, or unrestricted tool access unless those rights are separately and explicitly defined by authorization policy.

A ZipSkills package MAY contain:

`skill versions + applicable Fields + workspace mappings + capability recommendations + verification expectations + compatibility metadata + learning references`

Packages SHOULD be versioned and traceable. A package update SHOULD explain what changed, what workspace assumptions changed, what evidence supports the change, and whether the change is behavioral, compatibility-related, or explanatory.

Commercial pricing, package names, package limits, and catalog contents remain planning-only until explicitly approved.

## 15. Backend account and Seat wiring

The authenticated Firebase UID is the ownership root for TeamAi account/domain state.

Within that root, durable state MAY represent Workplaces, Projects, Web AI Seats, Connections, Responsibility Profiles, skill assignments, capability/tool assignments, workspace selections, repository/ref scopes, permissions, tasks, task state, team discussion, summaries, and evidence.

The conceptual durable relationship is:

`Firebase UID → account/workspace/project → Web AI Seat → Connection → runtime/model → Responsibility Profile → workspace ruleset → effective skills → capabilities → authorization → task eligibility`

The browser and visual theme MUST NOT self-attest this durable truth. User-facing settings may present or request changes; authoritative persistence and authorization remain backend responsibilities.

## 16. Spatial Theme law

TeamAi uses one overall theme system with two visual treatments:

`Dark mode = Dark Spatial Glassmorphism`

`Light mode = Light Spatial Skeuomorphism`

These are two modes of one bounded theme, not two authorities.

The Spatial Theme SHOULD make the workforce legible through:

`Seat → responsibility → skills → capability → authorization → workspace → task → status → evidence → integration`

The spatial interface is the **human-facing map of the workforce**. It is not the source of truth for durable state, authorization, scheduler eligibility, workspace authority, provider status, or execution completion.

The theme MUST preserve legibility, focus visibility, keyboard navigation, reduced-motion behavior, responsive behavior, and semantic accessibility. Visual effects MUST NOT become a prerequisite for durable application state.

The 029 experience MUST continue to use shared spatial primitives/tokens and the established F0–F7 system. F0–F7 identify fields within the spatial design contract; they do not by themselves create new authority or legal boxes.

## 17. Guides and product dictionary

User guides, help text, and dictionary surfaces MUST derive their canonical terminology from Product Law, workspace rulesets, skills, and backend contracts.

At minimum, the dictionary MUST distinguish:

`Web AI Team`
`AI Seat`
`Development Field`
`Responsibility Profile`
`Skill`
`Capability`
`Connection`
`Authorization`
`Workspace`
`Workspace Ruleset`
`Branch/ref scope`
`Main Integration Seat`
`Scheduler eligibility`
`Durable event`
`ZipSkills`

Workspace-specific guides MAY explain native concepts, but those concepts MUST map back to the TeamAi vocabulary rather than introduce contradictory definitions.

Guidance SHOULD be responsibility-aware and workspace-aware. A GitHub project should expose GitHub-native explanations and controls. Another supported workspace may expose its own native terminology while retaining the same TeamAi-wide authority model.

## 18. Canonical execution-document relationship

The project documents are connected as follows:

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/**/SKILL.md → implementation → verification/evidence → docs/project-guide/HandOver.md → docs/project-guide/Endorsement.md → PRODUCT-KNOWLEDGE.md`

`AI_ASSISTANT_READ_ME.md` provides practical recovery and agent-entry guidance across this chain.

`PRODUCT_LAW.md` defines **what** must remain true.

`MASTERPLAN.md` defines **when/where** the approved work is executed.

`POLICY.md` and ORUCAVEAM define **how a command is evaluated and executed safely**.

`docs/SKILL_WIRING.md` resolves the applicable direct skills and verification path.

`skills/**/SKILL.md` provide the operational procedure; they do not become Product Law.

Implementation realizes the approved behavior.

Verification proves only the behavior actually exercised.

`HandOver.md` preserves continuation and learning transfer.

`Endorsement.md` records authorized completion and accepted learning.

`PRODUCT-KNOWLEDGE.md` preserves validated lessons without redefining Product Law.

Lower-level documents MUST NOT silently redefine a Product Law concept. A change to a canonical concept requires reconciliation against the existing logic before editing.

## 19. Canonical law register — 101–110

The numbered laws below summarize the highest-leverage completion, service, state, identity, workspace, skill, knowledge, and commerce-package invariants. The surrounding sections explain the domain context; these laws state the non-optional rule.

### LAW 101 — IMPLEMENTATION TRACEABILITY IS A HARD COMPLETION GATE

**Rule.** Every implementation claim MUST be traceable from its governing Product Law requirement and Masterplan execution item through the applicable Policy/skill path, actual implementation, verification evidence, and completion/endorsement record.

**Why.** Planning text, documentation presence, deployment presence, a green unit-test run, or an endorsement alone cannot establish that the exact claimed behavior exists and has been verified.

**Flow.**

`Law → Masterplan → Policy/skill → implementation → verification → evidence → handover/endorsement`

**Boundary.** A missing traceability link blocks the affected completion claim unless an explicit, evidence-backed exception is recorded by the authorized human.

### LAW 102 — SERVICE AUTHORITY MUST BE EXECUTABLE

**Rule.** The service-authority map MUST be enforced by executable backend boundaries where authority can otherwise migrate silently.

**Why.** A documented service map that code does not enforce becomes advisory and can drift into multiple competing sources of truth.

**Flow.**

`identity authority → durable-state authority → trusted-execution authority → commerce authority → engineering/source authority → delivery/verification surfaces`

**Boundary.** Backend code MUST reject authority mismatches. UI, deployment, plugins, or provider integrations MUST NOT silently acquire an authority already assigned to a canonical service.

### LAW 103 — DURABLE STATE PRECEDES TRUSTED EXECUTION

**Rule.** A trusted task or externally initiated event MUST have durable identity, ownership context, lifecycle/idempotency identity, and an evidence model before trusted execution or commerce mutation can be treated as complete.

**Why.** In-memory success cannot provide reliable replay protection, attribution, recovery, or auditability.

**Flow.**

`durable identity → ownership → lifecycle/idempotency → authorized execution → durable result/event → evidence`

**Boundary.** In-memory or transient success is not durable completion.

### LAW 104 — FIREBASE UID IS THE DOMAIN OWNERSHIP ROOT

**Rule.** TeamAi application/domain paths MUST be rooted in the authenticated Firebase UID.

**Why.** Client-provided identifiers cannot prove ownership.

**Flow.**

`authenticated Firebase ID token → verified UID → UID-rooted domain path → authorized server operation → durable state`

**Boundary.** External provider events, including PayPal events, MUST be correlated server-side to the authenticated UID. Browser-supplied ownership claims cannot replace server verification.

### LAW 105 — FIREBASE PROJECT IDENTITY IS AN ARCHITECTURE INVARIANT

**Rule.** The authoritative TeamAi Firebase project is `team-ai-official`.

Firebase project identity MUST be explicit and MUST NOT be inferred from repository names, screenshots, historical artifacts, remembered context, or similarly named projects. `homefinder-official` and other projects remain distinct and non-authoritative unless a future architecture change explicitly replaces the current project and updates the identity contract first.

**Flow.**

`Firebase Auth + Firestore(default) + Hosting + Web SDK projectId + CLI target + Edge-runtime service-account project_id → SAME authoritative project`

**Boundary.** Any conflict MUST stop the affected deployment/verification until reconciled. Public Web SDK configuration is not a privileged credential. Admin/service-account credentials remain secret. Project-identity reconciliation precedes Firebase runtime diagnosis.

### LAW 106 — WORKSPACE RULESETS ARE SUBORDINATE ADAPTERS

**Rule.** A Workspace Ruleset Repository adapts TeamAi to a selected workspace's native behavior. It does not replace Product Law, ORUCAVEAM, human authority, Seat identity, durable-state authority, scheduler authority, or protected approvals.

**Why.** TeamAi must be able to support many workspaces without multiplying constitutions.

**Flow.**

`Product Law → ORUCAVEAM → TeamAi responsibilities → selected workspace ruleset → native workspace action`

**Boundary.** A workspace ruleset may explain how a GitHub PR, branch, Issue, review, Action, or protected ref is handled; it may not redefine what a Seat or Field means in TeamAi.

### LAW 107 — SKILLS MUST EVOLVE WITHOUT SILENTLY EXPANDING AUTHORITY

**Rule.** Skills MAY grow, specialize, compose, version, deprecate, supersede, or retire as evidence accumulates, but a skill change MUST NOT silently expand a Seat's authority.

**Why.** Knowledge improvement and permission expansion are different kinds of change.

**Flow.**

`new learning → law/plan reconciliation → ORUCAVEAM routing → skill change → implementation → verification → evidence → Product Knowledge → promoted skill version`

**Boundary.** Better procedure for an authorized task does not grant new permissions. New authority requires explicit authorization and the applicable Product Law/policy reconciliation.

### LAW 108 — TEAM KNOWLEDGE MUST SURVIVE SEPARATED AI APPLICATIONS

**Rule.** When Web AI Seats operate across separate external applications or isolated workspace sessions, TeamAi MUST preserve sufficient project-wide knowledge continuity for the next eligible Seat to understand the relevant state and safely cooperate.

**Why.** A multi-provider team cannot remain coherent if each Seat only knows its own local conversation.

**Flow.**

`user authority + project context + discussion + durable state + workspace state + evidence/handover → authorized context packet → next Seat`

**Boundary.** Direct provider-to-provider control is prohibited. TeamAi preserves cooperation through durable events, task transitions, scheduler eligibility, authorized context, summaries, handoffs, and workspace records.

### LAW 109 — ZIPSKILLS IS A SKILL PACKAGE, NOT AN AUTHORITY PACKAGE

**Rule.** ZipSkills MAY package and commercialize validated skill bundles and workspace-aware skill packages, but possession or purchase MUST NOT by itself grant repository, backend, scheduler, merge, payment, entitlement, or Product Law authority.

**Why.** Commerce must package capability knowledge without creating an undeclared permission path.

**Flow.**

`validated skills → versioned ZipSkills package → compatibility/verification metadata → user purchase/enablement → separately evaluated authorization`

**Boundary.** Commercial entitlement and technical authorization remain distinct. Package contents, prices, and limits remain planning-only until explicitly approved.

### LAW 110 — WORKSPACE CHOICE MUST SHAPE CONFIGURATION WITHOUT FRAGMENTING TEAMAI

**Rule.** A user's workspace choice MUST shape configuration, skill recommendation, guides, dictionary terms, verification, and native operating controls while preserving one TeamAi-wide authority model.

**Why.** Users need workspace-native behavior without having to adopt a different TeamAi constitution for every platform.

**Flow.**

`user workspace choice → workspace ruleset → workspace-aware Responsibility Profile → skill resolution → capability/authorization evaluation → task eligibility → native workspace operation`

**Boundary.** Workspace choice MUST NOT create another Product Law, ORUCAVEAM, durable-state authority, scheduler, or Seat identity model.

## 20. Canonical backend extension invariant

The canonical backend is a multi-authority system, not a single endpoint or wire. Canonical Auth, durable domain state, trusted execution, commerce, and execution evidence remain distinct responsibilities with explicit authorities and contracts.

Adding payment buttons, subscription products, promotional variants, or additional PayPal-facing flows MUST extend the existing commerce contracts and preserve server-owned correlation to the authenticated Firebase UID.

Adding another sign-in/authentication method MUST extend the canonical Firebase Auth boundary and preserve the same authoritative Firebase UID/domain ownership model.

These extensions MUST NOT require moving TeamAi domain state to another database, replacing the Firebase UID ownership root, allowing the browser to self-attest payment or entitlement state, or creating a parallel authority path.

A new provider, authentication method, payment product, delivery/verification surface, or UI control is an extension of an existing authority boundary unless an explicit Product Law / architecture change replaces that boundary first.

## 21. Current backend implementation disposition

The first executable TEAM-BACKEND-001 foundation contracts are implemented and recorded, including service-authority assertions, UID-rooted Firestore path construction, deterministic effective-skill resolution, durable task transitions, durable event identity requirements, and server-owned commerce correlation.

### Live Firebase milestone — 2026-09-03

The authoritative Firebase project `team-ai-official` is live and its `(default)` Firestore database is reachable. The `teamai-domain-bootstrap` trusted persistence slice passed its executable Firebase persistence gate:

`Firebase ID token → verified Firebase UID → Firestore hierarchy → independent Firestore confirmation → repeat-call idempotency`

Evidence included:

- invalid Firebase ID token rejected with HTTP 401;
- missing Firebase Authorization rejected with HTTP 401;
- valid authenticated bootstrap persisted the gate-3 test hierarchy with HTTP 200;
- the exact nested Firestore seat document was independently read and returned actual stored values;
- an identical authenticated repeat request returned HTTP 200 with existing-value results.

Detailed evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE3_2026-09-03.md` and `docs/backend/FIREBASE_EDGE_PERSISTENCE_IMPLEMENTATION_2026-09-03.md`.

### Gate 5B — server-owned PayPal correlation contract — PASS

The backend encodes a bounded server-owned commerce correlation contract in `src/backend/commerce.ts`. A trusted server flow establishes a pending `firebaseUid + correlationId + provider` intent; only a verified PayPal provider event may bind the PayPal event ID to that intent, with idempotency derived from the provider event ID.

Direct source-contract validation passed in a temporary local workspace using TypeScript 5.8.3 with strict NodeNext settings and Node.js 22.16.0. Assertions covered server-owned intent creation, verified-event binding, preserved UID ownership, deterministic idempotency key derivation, empty provider-event rejection, and Firebase-UID-rooted commerce paths.

Observed result: `GATE5B_DIRECT_TEST=PASS`.

Detailed evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE5B_2026-09-03.md` and `docs/evidence/GATE5B_DIRECT_VALIDATION_2026-09-03.md`.

This is an evidence-backed source-contract pass, not TEAM-BACKEND-001 completion. No live PayPal transaction, webhook business processing, entitlement activation, or replay-protection completion claim is made by Gate 5B.

### Gate 5C — implementation and available-environment verification — PASS / CLOSED

Gate 5C implementation and available-environment verification are complete. The canonical commerce runtime boundary verifies PayPal webhook authenticity, applies replay/idempotency controls, durably records authenticated commerce events in Firestore under the Firebase UID, and projects entitlement state only from authenticated provider events correlated to a server-owned intent.

The remaining evidence item is **live PayPal transaction/webhook runtime validation**. This is an external/live runtime evidence requirement, not an unfinished Gate 5C implementation. The current environment constrains that live PayPal test; it MUST NOT be represented as a failed Gate 5C architecture or implementation.

Until that live PayPal evidence is captured, TEAM-BACKEND-001 final completion endorsement remains pending. No broader Gate 5C implementation work should be reopened merely because the live external test remains outstanding.

## 22. Phase 0 disposition

Phase 0 is the clean development-entry gate. It verifies the active repository baseline, retired-backend removal from supported paths, service authority boundaries, team/toolkit boundaries, and synchronization of the current execution gate before TEAM-BACKEND-001 implementation.

## 23. Product-wide control invariant

The most important cross-domain distinction is:

`Field defines responsibility → Skill defines how to perform it → Capability defines available mechanisms → Authorization defines permitted control → Workspace defines operating context → Scheduler defines when the Seat may act`

This invariant applies whether the workforce has two Seats or eight Seats, whether the task is planning, coding, verification, documentation, recovery, commerce, or another reconciled responsibility, and whether the selected workspace is GitHub or a future validated workspace.

No Seat, skill, branch, workspace, tool, provider, UI, or commercial package may silently elevate itself above this chain.

## 24. Non-negotiable product constraints

- Direct provider-to-provider orchestration is prohibited.
- A skill cannot grant authority.
- A branch cannot define authority.
- A UI cannot self-attest durable backend truth.
- A workspace ruleset cannot replace Product Law.
- Product Knowledge cannot redefine Product Law.
- ZipSkills cannot sell undeclared authority.
- GitHub Actions cannot become the runtime scheduler.
- Vercel cannot become the hosting or backend authority, and current Vercel access is paused/cut off pending explicit user approval for any reuse.
- Alternate durable TeamAi domain databases require explicit Product Law / architecture reconciliation.
- Historical project evidence cannot override current authoritative configuration.
- More Seats create more execution capacity, not more constitutions.

## 25. Final Product Law closure

The complete TeamAi concept can be understood as one governed system:

```text
USER
 │
 ├── chooses purpose and workspace
 │
 ▼
TEAMAI
 │
 ├── preserves Product Law + ORUCAVEAM project-wide
 │
 ├── stores authoritative state under Firebase UID
 │
 ├── configures Web AI Seats and Responsibility Profiles
 │
 ├── resolves workspace rules + skills + capabilities + authorization
 │
 ├── schedules eligible work
 │
 ├── executes through trusted boundaries
 │
 ├── records durable events/results
 │
 ├── verifies and reconciles
 │
 ├── hands over and endorses
 │
 └── promotes validated learning into Product Knowledge and future skill/workspace versions
 │
 ▼
WEB AI TEAM
 │
 ├── Planning Team stage
 ├── Working/Coding Team stage
 └── coordinated multi-Seat participation
```

The Web AI Team may grow in Seat count, provider diversity, workspace diversity, skills, capabilities, and commercial packaging. The governing chain does not fragment. Growth MUST increase coverage, knowledge, and coordination without creating competing product authorities.