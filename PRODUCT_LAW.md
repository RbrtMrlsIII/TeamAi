# PRODUCT LAW — TeamAi Canonical Front Door

`PRODUCT_LAW.md` is the highest product authority for TeamAi. It defines what TeamAi is, what must remain true, which responsibilities are distinct, how they connect, and which boundaries cannot be silently crossed. Implementation, UI, deployment, provider, workspace, branch, skill, tool, or documentation conventions MUST NOT override it.

This document is a **connected law system**. Repeated logic is consolidated into law families. Each family is explained by definition, purpose, conceptual flow, authority boundary, and connections to the other families. The numbered laws 101–110 are retained as hard cross-cutting invariants and are mapped back into those families rather than treated as isolated rules.

## 0. Whole Product Law system

The product is governed as one connected system:

```text
HUMAN USER AUTHORITY
        │
        ▼
PRODUCT LAW
(product meaning + invariants + authority boundaries)
        │
        ├───────────────┐
        ▼               ▼
PROJECT PURPOSE     ORUCAVEAM DISCIPLINE
        │               │
        └───────┬───────┘
                ▼
DEVELOPMENT RESPONSIBILITY
(Field)
                │
                ▼
WEB AI RESPONSIBILITY PROFILE
(Seat + role + scopes + operations + prohibitions)
                │
        ┌───────┴────────┐
        ▼                ▼
WORKSPACE RULES       SKILLS
(native context)      (procedure/knowledge)
        │                │
        └───────┬────────┘
                ▼
CAPABILITIES / TOOLS
                │
                ▼
AUTHORIZATION
                │
                ▼
TASK REQUIREMENTS
+ DURABLE STATE
                │
                ▼
SCHEDULER ELIGIBILITY
                │
                ▼
TRUSTED EXECUTION
                │
                ▼
DURABLE RESULT / EVENT / ARTIFACT
                │
        ┌───────┴────────┐
        ▼                ▼
VERIFICATION       INTEGRATION /
                    RECONCILIATION
        │                │
        └───────┬────────┘
                ▼
HANDOVER / ENDORSEMENT
                │
                ▼
PRODUCT KNOWLEDGE
                │
                ▼
SKILL / WORKSPACE KNOWLEDGE EVOLUTION
                └──────────────↺
```

### 0.1 How the system flows

**Human User Authority** is the highest operational authority. AI output is never authority merely because it is newer or more persuasive.

**Product Law** defines what TeamAi means and the invariant boundaries inside which every lower layer must operate.

**Project Purpose** explains what the requested work is trying to accomplish. **ORUCAVEAM** evaluates how a command may be acted upon without creating a second project constitution.

**Development Responsibility** identifies which Field owns the responsibility. A Field partitions work, not product authority.

**Responsibility Profile** binds that responsibility to a configured Web AI Seat and explicitly defines skills, capabilities, scope, operations, prohibitions, approvals, escalation, and coordination role.

**Workspace Rules** explain the selected workspace's native operating behavior. **Skills** explain how an authorized responsibility is performed. Neither is permission by itself.

**Capabilities** represent available mechanisms. **Authorization** decides which mechanisms may actually be controlled by the Seat for the task and scope.

**Durable Task State** records the state in which a task or event exists. **Scheduler Eligibility** decides whether a Seat is eligible to act now. Execution is not selected from conversation recency or branch naming.

**Trusted Execution** crosses the appropriate service boundary and produces durable evidence. **Verification** proves the behaviors actually exercised. **Integration** reconciles contributions into the canonical assembled state.

**Handover/Endorsement** preserves continuity and authorized acceptance. **Product Knowledge** records validated lessons. Those lessons can improve future skills and workspace rules, but they do not silently rewrite Product Law.

### 0.2 Central control invariant

```text
Field defines responsibility
        ↓
Skill defines how to perform it
        ↓
Capability defines available mechanisms
        ↓
Authorization defines permitted control
        ↓
Workspace defines operating context
        ↓
Task state defines present condition
        ↓
Scheduler defines when the Seat may act
```

No Seat, branch, skill, workspace, UI, provider, package, or tool may silently elevate itself above this invariant.

## 1. LAW FAMILY A — HUMAN AUTHORITY, PRODUCT IDENTITY, AND TEAM BOUNDARY

### Definition
TeamAi has two different operational domains: the **TeamAi Development Team**, which builds/governs/delivers TeamAi, and the **Web AI Team**, which is the user's configured collection of externally operated AI applications/providers that TeamAi connects to, equips, coordinates, and orchestrates.

A **Web AI Seat** is a TeamAi participation identity/configuration for an externally operated AI application/runtime. External provider ownership remains external.

The following identities MUST remain distinct:

`application ≠ provider ≠ service/runtime ≠ model ≠ connection ≠ seat ≠ skill ≠ capability/tool/MCP ≠ workstation ≠ entitlement ≠ authorization`

### Why it exists
Without this separation, an external model, provider account, connection, branch, skill, or UI surface could be mistaken for TeamAi authority.

### Conceptual flow

```text
User purpose
   ↓
TeamAi product boundary
   ├── TeamAi Development Team
   └── Web AI Team
          ↓
     Web AI Seat
          ↓
 external application/runtime
```

### Boundary
TeamAi does not claim ownership of external AI provider accounts, provider subscriptions, provider-native workspaces, or provider models. TeamAi owns the participation, connection, policy, durable-state, and orchestration boundaries it provides.

### Connections
This family is the identity foundation for Fields, Seats, workspace selection, authorization, and multi-provider cooperation.

## 2. LAW FAMILY B — CANONICAL SERVICE, INFRASTRUCTURE, AND DELIVERY AUTHORITY

### Definition
Every connected platform has a bounded role. A technical connection does not grant additional authority.

| Platform / surface | Canonical role | Authority boundary |
|---|---|---|
| Firebase Authentication | Sign-in and Firebase UID establishment | Identity authority only |
| Cloud Firestore `(default)` | TeamAi accounts, Workplaces, Projects, Seats, tasks, events, and durable domain/application state | Canonical durable TeamAi state authority |
| Firebase Hosting | Current TeamAi web delivery | Current web delivery authority |
| Supabase Edge Functions | Trusted server execution and protected operations, including PayPal webhook receipt | Trusted execution authority; not domain-state authority |
| Supabase Postgres | Supabase platform infrastructure where required | Infrastructure only; never TeamAi domain/application authority |
| PayPal | External payment events | External payment-event authority; TeamAi owns correlation/projection rules |
| GitHub | Repository/source/change history | Engineering/source/change authority |
| GitHub Actions | Engineering CI, checks, tests, recovery checks, repository automation | Verification/engineering surface; not runtime Web AI orchestration authority |
| Vercel | Optional controlled web development/preview/browser-verification surface | Non-authoritative; currently paused/cut off and MUST NOT be reused without explicit user approval |
| Founder Pulse | Read-only issue/delivery observation | Observation only; no mutation, scheduler, or authorization authority |
| External AI applications/providers | External runtimes/models | Provider ownership remains external; TeamAi owns the participation boundary |
| MCP/tools/plugins/integrations | Bounded capabilities | Capability/integration surface only |
| Universal ToolKit | Upstream validated/generalized knowledge | Knowledge surface only; never TeamAi product authority |

### Why it exists
Authority must be located deliberately. Otherwise services drift into competing sources of truth.

### Conceptual flow

```text
Identity authority
   ↓
Durable-state authority
   ↓
Trusted execution authority
   ↓
External event authority
   ↓
Engineering/source authority
   ↓
Delivery/verification surfaces
```

### Boundary
The service map is executable where authority can otherwise migrate. UI, deployment surfaces, provider integrations, plugins, or skills MUST NOT silently become a canonical service authority.

GitHub Actions verifies engineering workflows but MUST NOT become the Web AI runtime scheduler. Firebase Hosting remains current web delivery authority. Vercel remains non-authoritative and paused/cut off until explicit user approval.

### Connections
This family supplies the service boundaries required by Families C, E, H, and K.

## 3. LAW FAMILY C — IDENTITY OWNERSHIP, DURABLE STATE, AND TRUSTED EXECUTION

### Definition
TeamAi durable domain ownership is rooted in the authenticated Firebase UID. Durable task/event identity, ownership context, lifecycle/idempotency identity, and evidence must exist before trusted execution or commerce mutation can be treated as complete.

### Why it exists
Transient state cannot safely establish ownership, replay protection, recovery, auditability, or durable completion.

### Conceptual flow

```text
Firebase ID token
      ↓
verified Firebase UID
      ↓
UID-rooted account/domain path
      ↓
durable task/event identity
      ↓
authorization + lifecycle state
      ↓
trusted server operation
      ↓
durable result/event/artifact
```

### Boundary
Client-provided identifiers cannot prove ownership. External provider events, including PayPal events, MUST be correlated server-side to the authenticated UID. The browser MUST NOT self-attest durable state, payment state, entitlement state, or authorization.

### Firebase project identity invariant
The authoritative TeamAi Firebase project is `team-ai-official`. Firebase project identity MUST be explicit across Firebase Auth, Firestore `(default)`, Hosting, Web SDK `projectId`, CLI target, and trusted Edge-runtime `project_id`.

`homefinder-official` and other projects are distinct and non-authoritative unless an explicit future architecture change replaces the current identity contract.

If Firebase project identities conflict, the affected deployment or verification MUST STOP until reconciled. Public Web SDK configuration is not a privileged credential; admin/service-account credentials remain secret.

### Resilience boundary
Firestore remains the canonical durable store. TeamAi SHOULD reduce unnecessary usage through targeted reads, bounded queries, cursor pagination, safe caching/offline persistence where appropriate, selective listeners, aggregation/summary patterns, idempotent writes, and external artifact storage with Firestore metadata/reference. No alternate durable domain store may be introduced without explicit Product Law / architecture reconciliation.

### Connections
Families B and C jointly establish where trusted execution lives and what durable evidence it must leave.

## 4. LAW FAMILY D — DEVELOPMENT RESPONSIBILITY FIELDS

### Definition
A **Development Field** is a bounded responsibility area inside the single TeamAi Development Team. Fields partition responsibility without partitioning product authority.

Canonical coverage fields:

1. Product & Governance
2. Backend & Runtime
3. Frontend & Experience
4. Application Integration & Contracts
5. Verification & CI/Browser
6. Documentation, Knowledge & Handover
7. Recovery, History & Reconciliation
8. Delivery & Operations

### Why it exists
A growing project needs responsibility coverage without creating many independent authorities.

### Field flow

```text
Product/Governance
        ↓
Backend / Frontend / Integration
        ↓
Verification / Documentation / Recovery / Delivery
        ↓
contribution to one canonical main
```

### Boundary
A Field defines responsibility, not permission. Eight Fields do not require eight permanent branches. A repository MAY implement a Field through one or more temporary working branches.

### Frontend/backend seam
**Frontend/Experience** owns presentation, interaction, accessibility, responsive behavior, and presentation/validation of backend-owned facts. It MUST NOT invent backend truth, bypass authorized APIs, choose the scheduler's actor, or become provider execution authority.

**Backend/Runtime** owns identity verification, durable domain state, task lifecycle, provider invocation boundaries, trusted execution, commerce correlation, entitlement projection, scheduler-owned eligibility, and durable execution evidence. It MUST NOT silently become visual authority.

**Application Integration & Contracts** owns typed contracts, backend-fact schemas, adapters, status/error mappings, fixtures, contract tests, and semantic-drift reconciliation. It is a bridge, not a second backend, second scheduler, or replacement frontend authority.

### Connections
Fields are consumed by Responsibility Profiles and are later resolved through workspace rules, skills, capabilities, authorization, and scheduling.

## 5. LAW FAMILY E — WEB AI SEATS, RESPONSIBILITY PROFILES, AND POPULATION

### Definition
A **Web AI population** is the set of Web AI Seats configured for a TeamAi Workplace/Project and operating purpose. The canonical team-development baseline is **2–8 Web AI Seats**.

Population size changes responsibility distribution; it does not create additional product authorities.

### Responsibility Profile

```text
Seat
 → primary Field(s)
 → secondary Field(s)
 → required skills
 → optional skills
 → capabilities/tools
 → workspace/repository/ref scope
 → permitted operations
 → prohibited operations
 → approval requirements
 → escalation target
 → coordination role
```

### Effective responsibility

```text
Seat identity
 + assigned Field
 + effective Skill bundle
 + Capability set
 + Authorization
 + Connection/entitlement state
 + Workspace/ref scope
 + Task requirements
 + Scheduler eligibility
```

### Distinct operations

`can read ≠ can propose ≠ can implement ≠ can commit ≠ can create PR ≠ can approve ≠ can merge ≠ can modify canonical documents ≠ can coordinate ≠ can summarise`

### Population scaling

**2 Seats:** broader responsibility combinations may be necessary, with integration/final-merge responsibility still explicit.

**3 Seats:** Backend + Frontend + Integration/Lead is the canonical balanced pattern.

**4 Seats:** three specialist contributors plus a Main Integration/Team Lead Seat is a canonical parallel-development topology.

**5–8 Seats:** additional specialization MAY be introduced for Verification, Documentation, Recovery, Delivery/Operations, or other reconciled responsibilities.

### Why it exists
The workforce model lets users build complementary AI teams instead of merely selecting a provider/model count.

### Boundary
A skill is guided operational capability within an authorization envelope. A branch does not define Seat authority. Leadership does not imply unrestricted authority.

### Main Integration / Team Lead
The Main Integration Seat coordinates:

`main/repository flow + PR/commit/Issue coordination + contract reconciliation + verification coordination + team summarisation + handover preparation + escalation`

The normal contribution flow is:

```text
Specialist Seat / Field
      ↓
working branch
      ↓
commit
      ↓
pull request
      ↓
verification / review
      ↓
Main Integration decision
      ↓
authorized merge
      ↓
main
```

The Main Integration Seat may recommend readiness but may not bypass repository permission, TeamAi authorization, Product Law, required review, or human approval.

### Connections
This family is the human-configurable layer over Families D, F, G, and H.

## 6. LAW FAMILY F — WHOLE-TEAM KNOWLEDGE CONTINUITY AND WEB AI ORCHESTRATION

### Definition
Every active Web AI Seat MUST receive enough authoritative project knowledge to perform its task safely, including objective, current state, relevant dependencies, assigned responsibility, restrictions, material decisions, unresolved questions, verification state, and handoff expectations.

### Why it exists
Separate external AI applications may be isolated in their own local conversations, but TeamAi cannot permit authoritative project knowledge to fragment with them.

### Context-packet flow

```text
user authority
 + project context/current state
 + relevant team discussion
 + durable task/event state
 + applicable workspace state
 + restrictions/decisions
 + evidence
 + handover context
            ↓
AUTHORIZED CONTEXT PACKET
            ↓
eligible Web AI Seat
```

### Orchestration rule
Direct provider-to-provider orchestration is prohibited.

The canonical coordination path is:

`AI result/action proposal → durable structured event → task/state transition → scheduler eligibility → next Web AI Seat/tool/human → new event`

The latest AI response is not the latest authority.

### Planning and Working stages

**Planning Team stage:** user-controlled deliberation. Web AI Seats contribute according to turn configuration. A selected Summarizer/Team Lead may synthesize a structured handoff. The planning result is not execution authorization by itself.

**Working/Coding Team stage:** after user approval/command, the handoff is decomposed into tasks/dependencies; the scheduler selects eligible Seats/tools/human interventions; actions create durable results/events. Working execution MUST NOT silently rewrite the approved plan.

### Boundary
A Seat cannot inherit another Seat's authority merely because its output is newer. Summaries preserve material contributions, disagreements, decisions, constraints, warnings, unresolved questions, and evidence but do not automatically become approvals.

### Connections
Family F consumes Family E profiles and Family G workspace/skill context and drives Family H scheduling/execution.

## 7. LAW FAMILY G — WORKSPACE CONTEXT AND WORKSPACE RULESET REPOSITORIES

### Definition
A **Workspace** is the operating context in which collaboration and execution occur. A **Workspace Ruleset Repository** is a platform-specific operational adapter describing native workspace behavior.

For the current coding-focused product scope, **GitHub is the first concrete workspace model**.

### GitHub flow

`repository → branch/ref → commit → pull request → review → Issue/task → verification → merge → main`

### Ruleset contents
A workspace ruleset MAY define:

`workspace primitives + native roles + review flow + task flow + ref/branch behavior + workspace permissions + verification mechanisms + failure/recovery behavior + mapping into TeamAi responsibilities`

### Why it exists
Users should be able to choose a workspace that behaves naturally without forcing every future platform to imitate GitHub or forcing TeamAi to maintain a separate constitution for each platform.

### Boundary
A workspace ruleset MUST NOT redefine:

`human authority + Product Law + ORUCAVEAM + TeamAi service authorities + Web AI Seat identity + canonical durable state + scheduler authority + protected approvals`

Workspace choice changes operating context, not TeamAi constitutional authority.

Each ruleset SHOULD identify platform/version assumptions, evidence basis, applicable Fields, applicable skills, known limitations, and mapping back to Product Law.

### Connections
Family G feeds Family E Seat configuration and Family I skill resolution.

## 8. LAW FAMILY H — SKILLS, CAPABILITIES, AUTHORIZATION, AND SCHEDULER ELIGIBILITY

### Definition
Skills are procedural knowledge. Capabilities are available mechanisms. Authorization is permitted control. Scheduler eligibility is the decision that a Seat may act on a task now.

### Resolution flow

`Product Law → project purpose → Development Field → Responsibility Profile → workspace ruleset → required skills → allowed capabilities/tools → authorization → task requirements → scheduler eligibility`

### Why it exists
This separates **knowing how**, **having a mechanism**, **being allowed to use it**, and **being eligible to act now**.

### Skill evolution
Skills MAY be created, extended, specialized, composed, deprecated, superseded, versioned, or retired as evidence accumulates.

The canonical growth loop is:

```text
new requirement / learning
        ↓
Product Law or Masterplan reconciliation
        ↓
Policy / ORUCAVEAM routing
        ↓
skill design/change
        ↓
implementation
        ↓
deterministic verification
        ↓
evidence
        ↓
Product Knowledge
        ↓
reusable/versioned skill promotion
```

A skill upgrade MUST distinguish:

`knowledge improvement ≠ authority expansion`

Better procedure for an authorized task does not grant new permissions. Authority expansion requires explicit authorization and applicable Product Law/policy reconciliation.

### Scheduler rule
The scheduler MUST select the next eligible Seat from durable task state plus responsibility, skills, capabilities, authorization, connection health, scope, approval state, and other task constraints.

It MUST be able to distinguish:

`skill without authorization`
`authorization without skill`
`both but unhealthy connection`
`both but blocked task`
`can propose but cannot execute`
`can PR but cannot merge`
`can coordinate but cannot override specialist authority`

### Connection/capability boundary

```text
available ≠ configured ≠ TeamAi-entitled ≠ provider-compatible ≠ authorized ≠ project-scoped ≠ seat-allowed ≠ healthy ≠ usable
```

Plugins, tools, and MCP are capability/integration mechanisms, not orchestration authority. Tool results MUST NOT silently grant permission. Secrets remain outside ordinary chat content. Invocations MUST be attributable to the requesting Seat and project.

### Connections
Family H operationalizes Families E and G and feeds scheduling/execution in Family J.

## 9. LAW FAMILY I — COMMERCE, ZIPSKILLS, AND PROVIDER ENTITLEMENT

### Definition
Commercial packaging must remain separate from technical authority.

The commercial model separates:

`Team Quality ≠ Tool Quality ≠ Provider Entitlement`

**Team Quality** is the planned TeamAi axis for Solo/Team operation, Seat capacity, model allocation, orchestration capacity, and related resource limits.

**Tool Quality** is the planned capability axis for base TeamAi capabilities plus optional tools/plugins/MCP servers and specialist integrations.

**Provider entitlement** remains externally owned.

### ZipSkills
**ZipSkills** is the planned commercial packaging mechanism for validated TeamAi skill bundles, workspace-aware skill bundles, or capability-oriented skill collections.

A package MAY contain:

`skill versions + applicable Fields + workspace mappings + capability recommendations + verification expectations + compatibility metadata + learning references`

### Why it exists
TeamAi can commercialize validated operational knowledge without turning commerce into an undeclared permission system.

### Boundary
Purchasing/enabling ZipSkills MUST NOT, by itself, grant repository permissions, backend authority, scheduler control, merge authority, payment authority, provider subscriptions, entitlement authority, or unrestricted tools unless those rights are separately and explicitly authorized.

Exact prices, package names, package limits, model catalogs, provider bundles, and commercial limits remain planning-only until explicitly approved.

### Connections
Family I depends on Families H and G for skill/package identity and uses Family C's server-owned commerce correlation model for future commercial runtime behavior.

## 10. LAW FAMILY J — SPATIAL EXPERIENCE, GUIDES, DICTIONARY, AND HUMAN-FACING CONTROL

### Definition
The TeamAi Spatial Theme is the human-facing map of the workforce. It is not a second authority layer.

The canonical visual system is:

`Dark mode = Dark Spatial Glassmorphism`

`Light mode = Light Spatial Skeuomorphism`

### Workforce visualization flow

`Seat → responsibility → skills → capability → authorization → workspace → task → status → evidence → integration`

### Boundary
The spatial UI, settings, theme, guides, and dictionary MUST NOT self-attest durable backend truth, scheduler authority, execution completion, provider entitlement, or protected approval state.

The visual system MUST preserve legibility, focus visibility, keyboard navigation, reduced-motion behavior, responsive behavior, and semantic accessibility. Visual effects MUST NOT become a prerequisite for durable application state.

The 029 spatial system remains a shared-primitives system using the established F0–F7 design contract. F0–F7 identify spatial fields; they do not create new authority or legal boxes.

### Guides and dictionary
User guides, help text, and dictionary surfaces MUST derive canonical terminology from Product Law, workspace rulesets, skills, and backend contracts.

At minimum they MUST distinguish:

`Web AI Team`, `AI Seat`, `Development Field`, `Responsibility Profile`, `Skill`, `Capability`, `Connection`, `Authorization`, `Workspace`, `Workspace Ruleset`, `Branch/ref scope`, `Main Integration Seat`, `Scheduler eligibility`, `Durable event`, `ZipSkills`.

Workspace-specific guidance MAY explain native terminology, but must map it back to TeamAi vocabulary rather than introduce contradictions.

### Connections
Family J presents the state established by Families C, E, G, H, and K without becoming their authority.

## 11. LAW FAMILY K — BRANCHES, MAIN, INTEGRATION, VERIFICATION, AND HISTORY

### Definition
`main` is the canonical assembled TeamAi state. A branch is a working Field, Seat contribution surface, or temporary reconciliation workspace.

### Why it exists
Parallel work requires isolation; it does not require multiple permanent authorities or permanent archive branches.

### Flow

```text
specialist contribution
        ↓
working branch
        ↓
commit
        ↓
PR / review
        ↓
deterministic verification
        ↓
Main Integration decision
        ↓
authorized merge
        ↓
main
```

### Boundary
A branch MUST NOT define Seat identity, Product Law authority, skill authority, or merge permission.

The project SHOULD prefer:

`one canonical main + a small set of active purpose-specific branches + PR-based contribution flow`

History MAY also be represented by commits, merged PRs, Issues, tags/checkpoints, evidence, handover, endorsement, and retained branches where they carry unique provenance or recovery value.

Three questions remain separate:

`branch inventory = where current work is happening`

`coverage model = whether the assembled main is fully represented`

`historical record = how the product got here`

### Verification boundary
A green GitHub Actions run proves only the checks it actually executed. It does not automatically prove Firebase runtime behavior, PayPal live behavior, external browser behavior, or whole-product completion.

A deployment artifact is not architecture proof. Browser verification is evidence of the browser behaviors actually exercised.

### Firestore/UI resilience boundary
UI behavior MUST NOT claim durable mutation success until the authoritative write is confirmed. Under bounded quota/unavailability, preserve safe recovery state, avoid destructive retries, surface truthful status, and reconcile when authority becomes available.

### Founder Pulse boundary
Founder Pulse is read-only observation over issue/delivery flow. It MUST NOT mutate repositories, authorize changes, initiate deployments, become a scheduler, or become a parallel source of truth. GitLab support here is observation only unless Product Law explicitly changes.

### Connections
Family K closes the action loop from Family J back into durable evidence and Family L learning.

## 12. LAW FAMILY L — LEARNING, HANDOVER, ENDORSEMENT, AND PRODUCT GROWTH

### Definition
Validated experience becomes reusable learning only after evidence supports it. Product Knowledge records the lesson; it does not become a second Product Law.

### Learning flow

```text
executed work
    ↓
verification / evidence
    ↓
handover / endorsement
    ↓
validated lesson
    ↓
Product Knowledge
    ↓
skill/workspace improvement
    ↓
future execution
```

### Boundary
Product Knowledge cannot silently redefine Product Law. A learning that changes product authority MUST return to governance reconciliation first.

The same principle applies to Universal ToolKit: validated/generalized lessons may flow upstream, but ToolKit does not become TeamAi authority.

### Growth invariant
TeamAi SHOULD grow through:

`one Product Law + one project-wide ORUCAVEAM discipline + bounded Fields + configurable Web AI Seats + workspace-specific rulesets + composable/versioned skills + authoritative backend state + durable evidence`

Growth must increase coverage, knowledge, and coordination without multiplying constitutions.

## 13. LAW 101–110 — HARD CROSS-CUTTING INVARIANTS

The following laws are the hard invariants that cross the law families above. They are intentionally not treated as isolated concepts; each is anchored to one or more law families.

### LAW 101 — IMPLEMENTATION TRACEABILITY IS A HARD COMPLETION GATE
**Definition.** An implementation claim is complete only when its intended behavior can be traced from governing Product Law and Masterplan through the applicable execution discipline/skill, implementation, verification evidence, and completion/endorsement record.

**Conceptual flow.**
`Law → plan → ORUCAVEAM/skill → implementation → verification → evidence → handover/endorsement`

**Boundary.** A planning statement, document, deployment, green test, or endorsement alone does not establish exact implementation completion.

**Connected families.** A, D, H, K, L.

### LAW 102 — SERVICE AUTHORITY MUST BE EXECUTABLE
**Definition.** Canonical service ownership must be enforced at the boundary where silent authority migration could occur.

**Conceptual flow.**
`declared service authority → executable boundary → authorized operation → rejected mismatch`

**Boundary.** UI, provider, plugin, deployment surface, or tool cannot silently assume authority owned by another canonical service.

**Connected families.** B, C, K.

### LAW 103 — DURABLE STATE PRECEDES TRUSTED EXECUTION
**Definition.** Trusted execution or commerce mutation is not complete without durable identity, ownership, lifecycle/idempotency identity, and appropriate evidence.

**Conceptual flow.**
`durable identity → ownership → lifecycle/idempotency → authorized execution → durable result/event → evidence`

**Boundary.** In-memory success is not durable completion.

**Connected families.** C, H, K.

### LAW 104 — FIREBASE UID IS THE DOMAIN OWNERSHIP ROOT
**Definition.** TeamAi application/domain paths are owned through the authenticated Firebase UID.

**Conceptual flow.**
`ID token → verified UID → UID-rooted path → authorized server operation → durable state`

**Boundary.** Client IDs cannot prove ownership; external provider events must be correlated server-side.

**Connected families.** A, B, C, I.

### LAW 105 — FIREBASE PROJECT IDENTITY IS AN ARCHITECTURE INVARIANT
**Definition.** `team-ai-official` is the current authoritative Firebase project identity and must remain explicit across all Firebase-dependent surfaces.

**Conceptual flow.**
`Auth + Firestore + Hosting + Web SDK + CLI + Edge runtime → same Firebase project identity`

**Boundary.** Conflicting identities stop affected deployment/verification until reconciled.

**Connected families.** B, C, J, K.

### LAW 106 — WORKSPACE RULESETS ARE SUBORDINATE ADAPTERS
**Definition.** A Workspace Ruleset Repository adapts TeamAi to a selected platform's native operating model without becoming an alternative constitution.

**Conceptual flow.**
`Product Law → ORUCAVEAM → TeamAi responsibility → workspace ruleset → native workspace action`

**Boundary.** Rulesets cannot redefine Product Law, ORUCAVEAM, Seat identity, durable-state authority, scheduler authority, or protected approvals.

**Connected families.** D, E, G, H.

### LAW 107 — SKILLS MUST EVOLVE WITHOUT SILENTLY EXPANDING AUTHORITY
**Definition.** Skills may grow, specialize, compose, version, deprecate, supersede, and retire, but their evolution cannot silently create new authority.

**Conceptual flow.**
`learning → governance reconciliation → skill change → verification → Product Knowledge → version promotion`

**Boundary.** Knowledge improvement and authority expansion are different changes; new authority requires explicit authorization.

**Connected families.** E, G, H, I, L.

### LAW 108 — TEAM KNOWLEDGE MUST SURVIVE SEPARATED AI APPLICATIONS
**Definition.** Separated external AI applications must still receive sufficient authoritative project context for safe cooperation.

**Conceptual flow.**
`project context + team discussion + durable state + workspace state + evidence/handover → authorized context packet → eligible Seat`

**Boundary.** Direct provider-to-provider control is prohibited.

**Connected families.** A, E, F, G, K, L.

### LAW 109 — ZIPSKILLS IS A SKILL PACKAGE, NOT AN AUTHORITY PACKAGE
**Definition.** ZipSkills packages validated operational knowledge and workspace-aware skill bundles for future commerce.

**Conceptual flow.**
`validated skills → versioned package → compatibility/verification metadata → purchase/enablement → separately evaluated authorization`

**Boundary.** Package possession cannot itself grant repository, backend, scheduler, merge, payment, entitlement, or Product Law authority.

**Connected families.** H, I, L.

### LAW 110 — WORKSPACE CHOICE MUST SHAPE CONFIGURATION WITHOUT FRAGMENTING TEAMAI
**Definition.** Workspace choice changes native configuration, skill recommendation, guides, dictionary, and verification behavior while preserving one TeamAi-wide authority model.

**Conceptual flow.**
`user workspace choice → workspace ruleset → Responsibility Profile → skill resolution → capability/authorization → task eligibility → native workspace operation`

**Boundary.** Workspace choice cannot create another Product Law, ORUCAVEAM, scheduler, durable-state authority, or Seat identity model.

**Connected families.** E, F, G, H, J.

## 14. Canonical backend extension invariant

The canonical backend is a multi-authority system: Auth, durable domain state, trusted execution, commerce, and execution evidence are distinct responsibilities with explicit contracts.

Adding payment buttons, subscription products, promotional variants, additional PayPal flows, new authentication methods, new providers, new delivery surfaces, or new UI controls MUST extend an existing authority boundary unless an explicit Product Law / architecture change replaces that boundary.

Such extensions MUST NOT require moving TeamAi domain state to an alternate database, replacing the Firebase UID ownership root, allowing browser self-attestation of payment/entitlement, or creating a parallel authority path.

## 15. Current execution state and backend evidence

The current execution sequence is:

`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

**Current phase:** `TEAM-BACKEND-001 — IN IMPLEMENTATION`.

The first executable backend foundation contracts are implemented and recorded, including service-authority assertions, UID-rooted Firestore path construction, deterministic effective-skill resolution, durable task transitions, durable event identity requirements, and server-owned commerce correlation.

### Live Firebase milestone — 2026-09-03
The authoritative `team-ai-official` Firebase project and `(default)` Firestore database were reachable during the recorded milestone. The `teamai-domain-bootstrap` persistence slice passed:

`Firebase ID token → verified UID → Firestore hierarchy → independent Firestore confirmation → repeat-call idempotency`

Observed evidence included invalid/missing authorization rejection, valid authenticated persistence, independent nested seat-document confirmation, and successful repeat-call idempotency behavior.

Detailed evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE3_2026-09-03.md` and `docs/backend/FIREBASE_EDGE_PERSISTENCE_IMPLEMENTATION_2026-09-03.md`.

### Gate 5B — server-owned PayPal correlation contract — PASS
The backend encodes a bounded server-owned commerce correlation contract in `src/backend/commerce.ts`. A trusted server flow establishes pending `firebaseUid + correlationId + provider` intent; only a verified PayPal event may bind the provider event ID, with deterministic idempotency derived from that provider event.

Direct source-contract validation passed with the documented Node/TypeScript environment and covered intent creation, verified-event binding, preserved UID ownership, idempotency derivation, empty provider-event rejection, and Firebase-rooted commerce paths.

Observed result: `GATE5B_DIRECT_TEST=PASS`.

Detailed evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE5B_2026-09-03.md` and `docs/evidence/GATE5B_DIRECT_VALIDATION_2026-09-03.md`.

This remains source-contract evidence, not TEAM-BACKEND-001 final completion.

### Gate 5C — implementation and available-environment verification — PASS / CLOSED
Gate 5C implementation and available-environment verification are complete. The commerce runtime boundary verifies PayPal webhook authenticity, applies replay/idempotency controls, durably records authenticated commerce events in Firestore under the Firebase UID, and projects entitlement state only from authenticated provider events correlated to a server-owned intent.

The remaining evidence item is **live PayPal transaction/webhook runtime validation**. This is an external/live evidence requirement, not an unfinished Gate 5C implementation. Until that evidence is captured, TEAM-BACKEND-001 final completion endorsement remains pending.

## 16. Phase 0 disposition

Phase 0 is the clean development-entry gate. It verifies the active repository baseline, retired-backend removal from supported paths, service authority boundaries, team/toolkit boundaries, and synchronization of the execution gate before TEAM-BACKEND-001 implementation.

## 17. Canonical document relationship

The following is a document traceability path, not a replacement for the law-to-law conceptual model above:

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/**/SKILL.md → implementation → verification/evidence → docs/project-guide/HandOver.md → docs/project-guide/Endorsement.md → PRODUCT-KNOWLEDGE.md`

`AI_ASSISTANT_READ_ME.md` provides practical agent-entry/recovery guidance across this chain.

Lower-level documents MUST NOT silently redefine Product Law. A change to a canonical concept requires reconciliation against the existing law family and connected flow before editing.

## 18. Final non-negotiable constraints

- Direct provider-to-provider orchestration is prohibited.
- A skill cannot grant authority.
- A branch cannot define authority.
- A UI cannot self-attest durable backend truth.
- A workspace ruleset cannot replace Product Law.
- Product Knowledge cannot redefine Product Law.
- ZipSkills cannot sell undeclared authority.
- GitHub Actions cannot become the runtime scheduler.
- Vercel cannot become the hosting or backend authority; current Vercel access remains paused/cut off pending explicit user approval for reuse.
- Alternate durable TeamAi domain databases require explicit Product Law / architecture reconciliation.
- Historical project evidence cannot override current authoritative configuration.
- More Seats create more execution capacity, not more constitutions.

## 19. Product Law closure

The complete concept is one governed system:

```text
USER
 │
 ├── chooses purpose + workspace
 │
 ▼
TEAMAI
 │
 ├── preserves Product Law + project-wide ORUCAVEAM
 ├── owns durable state under Firebase UID
 ├── configures Web AI Seats + Responsibility Profiles
 ├── resolves workspace rules + skills + capabilities + authorization
 ├── schedules eligible work
 ├── executes through trusted boundaries
 ├── records durable results/events
 ├── verifies + reconciles
 ├── hands over + endorses
 └── promotes validated learning
 │
 ▼
WEB AI TEAM
 ├── Planning Team stage
 ├── Working/Coding Team stage
 └── coordinated multi-Seat participation
```

The Web AI Team may grow in Seats, provider diversity, workspaces, skills, capabilities, and commercial packaging. The governing law remains one system. Growth MUST increase coverage, knowledge, and coordination without creating competing constitutions.