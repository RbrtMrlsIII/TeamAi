# TeamAi — Documentation & Execution Discipline

**Status:** CANONICAL OPERATING GUIDE
**Purpose:** Define where architectural ideas, planning decisions, implementation records, evidence, skills, and handover records belong so future AI work does not recreate authority conflicts or lose important planning discussions.

## 1. Authority and routing

Use this order when deciding where information belongs:

1. `PRODUCT_LAW.md` — immutable product/architecture authority.
2. `MASTERPLAN.md` — current phase, roadmap, architecture frontier, gates, and execution sequence.
3. `AI_ASSISTANT_READ_ME.md` — operational entry point and recovery behavior for AI agents.
4. `docs/` domain contracts — detailed planning and domain rules for a bounded capability or phase.
5. Implementation records — what was actually built.
6. Verification/evidence records — what was actually proven, where, and with what limitations.
7. `docs/project-guide/` — reusable project-entry, endorsement, and handover procedures.
8. Skills — how an agent performs a class of work safely; skills do not override architecture authority.
9. Findings/continuity/archive — historical observations, reusable candidates, recovery records, or superseded material.

When two documents conflict, do not choose by recency alone. Reconcile against the higher authority and preserve the conflict as an explicit finding until corrected.

## 2. Document purpose matrix

| Surface | Primary responsibility | Must not become |
|---|---|---|
| `PRODUCT_LAW.md` | Canonical product laws and invariants | Idea notebook or implementation log |
| `MASTERPLAN.md` | Current plan, phase sequence, architectural frontier, gates | Source of implementation proof |
| `AI_ASSISTANT_READ_ME.md` | Agent entry/recovery instructions | A second Product Law |
| `docs/TEAM-EXPERIENCE-029_*` | Detailed 029 planning contracts | Current implementation claims unless explicitly evidenced |
| `docs/backend/` | Backend implementation/runtime/evidence records | UI-owned backend authority |
| `docs/project-guide/` | Handover, endorsement, and continuation procedure | Product semantics |
| `docs/findings/` | Candidate reusable/generalized findings | Project-specific authority |
| `skills/` / applicable skills | Execution method, guardrails, warnings | Architecture definition |
| `docs/archive/` / dated records | Historical context and recovery | Active authority unless explicitly restored |

## 3. Conversation-to-canon pipeline

Important planning conversations must not remain only in chat.

`user/team discussion → captured planning record → reconciliation → approved canonical contract → implementation item → verification evidence → endorsement`

A conversation record is not automatically an architectural decision. Capture it first, distinguish decisions from proposals, then route approved content to the correct authority layer.

### What must be preserved

The TeamAi planning memory must retain, as applicable:

- original user objective and later clarifications;
- user constraints and turn settings;
- AI contributions, alternatives, pros/cons, challenges, and corrections;
- accepted decisions and their rationale;
- unresolved questions and dependencies;
- relevant artifacts/findings/events;
- the intended next command or approval boundary;
- whether the discussion is planning, implementation, verification, or recovery.

## 4. User-intent preservation rule

**Latest AI output is never latest authority.**

Every Planning Team turn must reconcile:

`current user instruction + accumulated relevant team discussion + approved project context + current turn instruction`

The receiving AI must not silently narrow the user's objective merely because the previous AI produced a persuasive or highly detailed answer.

The product may use summaries, references, retrieval, or other context-compression techniques, but they must preserve the meaning needed to understand the user's request. The final summarizer must be able to synthesize the complete relevant discussion before returning control to the user.

## 5. Planning Team versus Working Team

### Planning Team

`user idea/instruction → configured turn-based discussion → selected summarizer → structured handoff → user review → next command`

Discussion is deliberative. A document-authoring participant may be selected for the canonical planning change while other AIs remain advisory. The discussion itself does not authorize durable mutation.

### Working Team

`approved handoff → tasks/dependencies → scheduler → AI/tool/human action → durable result/event → next eligible work → review/recovery`

Working execution applies the approved plan. It does not silently change the plan or allow one provider to become the next-provider authority.

## 6. AI-to-AI orchestration rule

AIs do not directly control other providers.

`AI result/action → durable event → task/state transition → scheduler eligibility → next eligible actor → new event`

The Scheduler owns next-agent selection. A recommendation for another AI is not an authorization to invoke it.

## 7. External AI connection and Seat rule

External provider/application setup may remain outside TeamAi. TeamAi owns its participation boundary:

`external setup → authorized connection → capability test → Workplace/Project binding → AI Seat → Equip → Activate`

Do not collapse:

`application ≠ provider ≠ service/runtime ≠ model ≠ connection ≠ Seat ≠ skill ≠ tool/MCP ≠ workstation ≠ entitlement ≠ authorization`

A Seat is a configured TeamAi participant/policy instance, not simply a model name.

## 8. Tool, plugin, and MCP rule

`AI Seat → authorized tool intent → TeamAi policy/authorization → scoped connection/plugin/MCP → invocation → result/artifact → durable event`

MCP is a capability/integration surface. TeamAi retains orchestration, identity, entitlement interpretation, approval, durable state, and policy authority.

Base TeamAi capabilities may be native and do not automatically need to be implemented as MCP servers. Additional MCP/tool capabilities can be separately entitled and used by basic or advanced models when all provider/runtime, entitlement, scope, and authorization conditions permit.

## 9. Commercial/capability separation

Keep these independent:

`Team Quality ≠ Tool Quality ≠ Provider Entitlement`

Team Quality is the future TeamAi capability/scale axis (such as Solo/Team operation, persistent seats, model-quality allocation, and orchestration capacity).

Tool Quality is the future capability axis for Base TeamAi capabilities plus additional tools/plugins/MCP/integrations.

Provider Entitlement remains owned by the provider/application and must never be implied by a TeamAi plan.

Exact prices, plan names, model catalogs, seat counts, and tool packs remain planning-only until explicitly approved.

## 10. Skills and execution discipline

Before implementation, the agent must identify the applicable skill/guard for the work. In particular, provider/model/runtime/MCP/context-transfer/backend/commerce work must be checked for existing-root conflicts and external compatibility requirements.

Execution discipline:

`inspect authority → inspect applicable skills/guards → inspect existing roots/implementation → classify idea vs decision vs required change → reconcile conflicts → obtain required approval → implement smallest canonical change → verify → record evidence → update handover/endorsement`

A high-impact, destructive, or canonical change must not be smuggled in as ordinary cleanup.

## 11. Planning-to-implementation boundary

A planning document can describe a desired capability without proving that it exists.

Implementation can exist without being fully proven.

Verification can prove only the scope actually exercised.

Therefore:

`planned ≠ implemented ≠ deployed ≠ runtime-proven ≠ completed`

The same distinction applies to connections, provider entitlements, MCP capabilities, and commerce.

## 12. Backend/UI boundary

The UI presents and requests policy intents over authoritative state. It must not invent page-local meanings for identity, ownership, entitlement, permission, task state, event state, commerce, recovery, or provider authority when an existing canonical root owns them.

When UI discovery reveals a missing backend capability, route the requirement back through the owning backend/integration contract.

## 13. Target-project handover

A completed gate must produce the target-project handover packet in the same execution. The packet belongs to TeamAi.

ToolKit may receive generalized upstream lessons only after the consuming-project implementation validates that the lesson actually generalizes.

## 14. Current 029 documentation set

- `docs/TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md` — phase planning contract.
- `docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md` — commercial/capability planning boundary.
- `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md` — connection/Seat lifecycle.
- `docs/DOCUMENTATION_AND_EXECUTION_DISCIPLINE.md` — document routing and execution discipline.
- `docs/project-guide/AI_ASSISTANT_READ_ME.md` — project-guide entry point.
- `docs/project-guide/Endorsement.md` — completion/endorsement procedure.
- `docs/project-guide/HandOver.md` — handover/continuity procedure.

These documents refine one another. None may override `PRODUCT_LAW.md`.
