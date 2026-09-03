# TEAM-EXPERIENCE-029 — Canonical UI Planning Contract

**Status:** PLANNING DISCUSSION — NOT IMPLEMENTATION AUTHORITY
**Date:** 2026-09-03
**Purpose:** Durable planning record for the next frontend/UI phase before production implementation begins.

## 1. Why this exists

TEAM-EXPERIENCE-029 must build the correct product experience, not merely render the already-designed routes. The central product capability is a human-controlled web environment in which multiple AI applications can participate as configured team seats, exchange authorized work through durable structured state, trigger subsequent work through the orchestrator, and use explicitly granted tools/plugins/integrations.

This record preserves the planning discussion so the team does not rely on conversation memory when the discussion becomes cold.

## 2. Phase boundary

029 is the canonical UI/product-experience implementation phase after the backend foundation boundary. It may discover new backend requirements through actual UI use, but those requirements must return through the owning backend/authority contract instead of silently creating frontend-owned authority.

029 does **not** by itself claim:
- TEAM-BACKEND-001 completion;
- PayPal runtime completion or live transaction proof;
- provider subscription/API entitlement equivalence;
- unrestricted provider-to-provider invocation;
- browser authority over identity, entitlement, permissions, or durable state.

## 3. Two operating stages

### 3.1 Planning Team stage

The Planning Team is a deliberation mode.

Primary flow:

`User idea/instruction → configured AI turns → one response at a time → discussion → user-selected summarizer → structured summary → user review → next command`

Rules:
- The user defines the turn plan, participating seats, turns-per-AI, and optional summarizer seat.
- The scheduler controls speaker order and turn limits; no provider chooses the next provider.
- Each AI receives only the minimum relevant prior context required for its turn, plus authoritative project context explicitly exposed to that seat.
- One AI may be designated to document the agreed discussion result. The other participants may continue analysis, challenge assumptions, perform field-specific checks, or propose alternatives through chat.
- Only one document-authoring path should receive authority to mutate the canonical planning document for that discussion.
- A summarizer produces a structured handoff containing decisions, rationale, alternatives, unresolved questions, constraints, acceptance criteria, proposed document targets, and recommended next action.
- Summarization does not authorize durable mutation. The user chooses `APPROVE`, `EDIT`, `MORE`, or `REJECT` before canonical planning documents or Workplace state are changed.
- The Planning Team may recommend implementation details, but recommendation is not implementation.
- The conversation may end with the selected Web AI Team Leader/Summarizer, but the user remains the final authority and determines the next command.

### 3.2 Coding / Working Team stage

The Working Team applies an approved plan.

Primary flow:

`Approved plan/handoff → task decomposition → scheduler → assigned AI seat/tool → action → durable result/event → next eligible task/seat → review`

Rules:
- The whole configured team may participate in execution, but permissions remain per seat and per tool/connection.
- The working team consumes the approved plan as structured context; it does not rely on the raw planning transcript as the sole source of truth.
- Execution produces durable task/event/result/handoff state.
- A completed action or task may make downstream work eligible; the previous AI does not directly select its successor.
- Human approval is required for configured high-impact actions.
- Working-team autonomy is bounded by project scope, permissions, budget, runtime limits, provider capability, connection state, and approval policy.
- Working-team execution does not retroactively rewrite the approved planning decision without a new planning/review path.

## 4. AI-to-AI orchestration model

The core mechanism is:

`AI response/action → durable structured event → task/state transition → scheduler eligibility → next AI/tool/human → new event`

AI providers are workers/capabilities behind TeamAi adapters. They do not become the global orchestration authority.

A downstream worker should receive a structured, minimal handoff rather than an unbounded transcript. A useful handoff may reference findings, decisions, files, artifacts, task IDs, event IDs, and required capabilities.

## 5. Connecting external AI applications into a Team

User setup may occur outside the TeamAi web UI when required by the provider or application. The TeamAi product should therefore support a **connection import/activation model**, not assume every provider can be provisioned entirely in-app.

Canonical conceptual setup:

`External AI application/provider account → user-authorized connection → TeamAi capability test → Team/Workplace seat binding → provider/runtime/model + skills + tools/plugins + scopes + limits`

The user should be able to:
- create or select a Workplace;
- create or select a Project;
- connect an external AI application/provider account using the provider's supported authorization flow;
- select the provider service/runtime and exact model/variant where applicable;
- bind that connection to an AI seat;
- choose the seat's role (discussion, summarizer, worker/executor, reviewer, leader/supervisor, or other supported role);
- equip the seat with the appropriate skills;
- equip the seat with allowed tools/plugins/MCP capabilities;
- bind a workstation/repository/path scope where the runtime requires one;
- define permissions, approval gates, budget/rate/storage limits, and context visibility;
- run a capability/connection test before activation.

The same AI provider/model may appear as multiple seats when supported, because seat identity is an instance/configuration, not merely a model name.

## 6. How one AI uses its individual plugins/tools

Plugins are capabilities, not intelligence.

Canonical path:

`AI seat → authorized tool intent → Tool Policy Engine → project-scoped connection/plugin → tool invocation → result/artifact → durable event`

Requirements:
- each plugin declares its capabilities and scopes;
- the user/project grants actual scope;
- provider credentials remain outside ordinary AI message content;
- the AI receives a capability handle/authorized tool surface, not raw secrets;
- tool execution is attributable to the requesting seat and project;
- outputs are bounded, summarized, or stored as artifacts when large;
- tool results never silently grant new permissions;
- plugin/MCP capabilities must follow current provider/service terms and compatibility rules.

MCP may be used as a standardized tool/context integration surface. TeamAi's scheduler, identity authority, permissions, durable event model, and human approval rules remain TeamAi responsibilities. The 2026-07-28 MCP specification also formalizes Tasks and extensions while hardening authorization, so the integration layer must remain version/profile aware.

## 7. How AIs can read messages from other AIs

The premium chat experience may visually present a shared conversation, but context delivery must remain explicit and minimal.

Canonical model:

`Visible team conversation → message/event records → relevance/context selector → authorized context packet → receiving AI`

A receiving AI can read:
- prior AI contributions explicitly included for its turn;
- human interventions;
- structured summaries/handoffs;
- authorized findings and decisions;
- relevant task/event state;
- referenced artifacts or files through authorized integrations.

A receiving AI must not automatically receive:
- another provider's private model state;
- unrelated project data;
- credentials/secrets;
- unrestricted repository contents;
- private conversations outside its granted scope.

The UI may show a richer shared transcript than the model receives. The visual transcript is therefore a coordination surface, while the context packet is the execution boundary.

## 8. Team Leader and Summarizer

The Team Leader is a supervisory capability, not the owner of all permissions.

The selected Summarizer is a distinct seat/capability. Either may be provided by any eligible provider/runtime when supported.

The Team Leader may detect stalls, contradictions, repeated failures, missing verification, or budget anomalies and recommend bounded coordination actions. It cannot bypass policy, permissions, or human approval.

## 9. UI surfaces required to make the product understandable

029 should make these first-class visible concepts:
- Workplace;
- Project;
- AI Team;
- AI Seat;
- provider;
- service/runtime;
- exact model/variant;
- skill bundle;
- tool/plugin/MCP bundle;
- workstation/scope;
- task;
- dependency;
- event;
- handoff;
- action request;
- approval;
- result/artifact;
- team status/health;
- execution history/recovery.

The UI should make it possible to answer **why the next AI acted** by showing the relevant task dependency, event, readiness condition, scheduler decision, and authorization boundary.

## 10. Questions 029 must answer before or during implementation

1. How does a user connect AI applications that are operated outside TeamAi?
2. What provider authorization/connection states are visible and recoverable?
3. How is an external connection bound to a specific Workplace, Project, and AI Seat?
4. How does the user equip a seat with skills, plugins/tools/MCP, workstation scope, and permissions?
5. How does TeamAi distinguish provider, service/runtime, exact model/variant, skills, plugins, workstation, scopes, limits, and compliance state?
6. How does one AI's completed work make another AI eligible without direct provider-to-provider control?
7. What durable event represents a meaningful AI result, action request, tool result, approval, failure, or completion?
8. How does the scheduler explain and reproduce why the next AI/tool/human acted?
9. How does the shared chat show the whole team discussion while each AI receives only its authorized minimal context?
10. How can one AI explicitly reference another AI's findings, handoff, artifact, or decision without exposing private provider state?
11. How is exactly one document-authoring path selected during planning while other AIs continue advisory analysis?
12. How does the selected Web AI summarizer hand the discussion back to the user for `APPROVE`, `EDIT`, `MORE`, or `REJECT`?
13. How are planning-stage decisions separated from working-stage execution state?
14. How do approvals, blocked actions, failures, retries, cancellation, and recovery appear in the UI?
15. How does the system handle a provider/runtime/tool becoming unavailable after a team has already been configured?
16. How does the product preserve the same semantic team/workflow when represented through spatial UI, standard web UI, mobile UI, and accessibility paths?
17. Which newly discovered needs belong in 029, which belong in backend/integration gates, and which become future product phases?

## 11. Root-wiring guard

Before any 029 implementation slice, reconcile the proposed UI root against its owning canonical roots. The page, component, spatial, commerce, identity, Workplace, provider, tool, task/event, notification, recovery, privacy, compatibility, and runtime contracts must not be redefined locally.

UI is a presentation and interaction layer over authoritative state and policy intents. A new page-local rule is invalid when an existing canonical root already owns the meaning.

## 12. Completion boundary

029 completion should require evidence that the canonical UI is not merely rendered but correctly wired to:
- authenticated identity and semantic context;
- Workplace/Project/Team/Seat state;
- planning-team turn orchestration;
- summarizer handoff and user approval;
- working-team task/event execution;
- provider/runtime connection state;
- skill/tool/plugin capability state;
- durable action/approval/recovery state;
- responsive/accessibility equivalents;
- browser verification;
- required domain/backend contracts discovered during implementation.

Any new backend capability discovered by 029 must be routed through the owning backend/integration phase rather than embedded as browser authority.
