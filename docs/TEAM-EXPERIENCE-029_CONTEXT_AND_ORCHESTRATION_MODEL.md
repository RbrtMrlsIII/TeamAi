# TEAM-EXPERIENCE-029 — Context & Orchestration Model

**Status:** `PLANNING ARCHITECTURE — NOT IMPLEMENTATION AUTHORITY`
**Purpose:** Preserve the central TeamAi coordination model so UI design does not reduce the product to a chat surface or cause AI turns to lose the user's intent.

## 1. Product center

TeamAi is not merely a multi-model chat interface. Its central capability is a persistent, human-controlled AI team that can:

- let independent AI applications participate as configured Seats;
- preserve the user's objective across multiple AI contributions;
- turn useful results into durable events and task-state changes;
- let the Scheduler select the next eligible AI, tool, or human;
- execute authorized actions through tools/integrations;
- expose why the next actor became eligible;
- return control to the user for the next planning command or approval.

## 2. Planning Team context model

The Planning Team is user-controlled and turn-based.

`User objective → configured participants → one AI turn → accumulated discussion → next AI turn → selected summarizer → structured handoff → user review → next command`

The context source for each turn is not simply the immediately preceding AI message.

### Authoritative context layers

`current user instruction`
`+ accumulated relevant team discussion`
`+ approved project context`
`+ current turn instruction`
`+ relevant task/event/artifact references`

The most recent AI response is one contribution inside that context. It never becomes a new authority merely because it was produced last.

## 3. Semantic completeness over raw transcript copying

TeamAi must preserve the meaning needed for an AI to understand the request even when the complete raw transcript is too large to send to a model.

Allowed techniques include:

- structured summaries;
- decision records;
- finding/objection records;
- artifact references;
- retrieval of relevant earlier messages;
- bounded context packets;
- durable event/task references.

The system must not silently remove a user clarification, constraint, accepted decision, disagreement, warning, or other fact that materially changes the meaning of the objective.

The final summarizer must be able to synthesize the complete relevant discussion before returning control to the user.

## 4. User authority rule

**Latest AI ≠ latest authority.**

The user's current instruction remains authoritative over AI recommendations. Later AI turns must absorb prior relevant contributions without allowing an earlier AI to overwrite the user's intent.

The user controls:

- participation;
- turn order/settings;
- turns-per-AI;
- summarizer selection;
- intervention;
- pause/stop/continue behavior;
- whether the result advances to Working Team execution.

## 5. One document-authoring path during planning

During a planning discussion, multiple AIs may analyze and challenge the idea, but only one selected path should be authorized to mutate the canonical planning document for the agreed result.

Other AIs remain advisory: they can deep-dive fields, challenge assumptions, provide pros/cons, identify risks, or suggest alternatives through the discussion.

The selected summarizer/Team Leader may produce a structured handoff, but user review remains the authorization boundary for durable planning changes.

## 6. Working Team orchestration

After user approval:

`approved handoff → task/dependency graph → Scheduler → eligible AI Seat / tool / human → action → durable result/event → readiness recalculation → next eligible work`

The previous AI does not directly choose or invoke the next provider.

The Scheduler should be able to explain the transition using:

- triggering event/result;
- satisfied dependency;
- task readiness;
- Seat eligibility;
- capability/connection state;
- policy/authorization result;
- approval state;
- resource/budget constraints.

## 7. AI result and action event model

An AI completion may be represented conceptually as a durable event carrying:

- event identity;
- originating Seat/Project;
- task identity;
- result type;
- structured findings/decisions;
- artifact references;
- handoff/reference information;
- proposed next work;
- execution/verification metadata.

A proposed action is distinct from an executed action.

`AI → action proposal → policy/permission/approval → tool gateway → external action → result event`

The existence of a recommendation must never be mistaken for execution.

## 8. Shared chat versus model context

The premium/pro-max team chat may show a rich shared conversation. That visible transcript is not itself the authorization boundary.

`visible discussion → durable messages/events → context selection → authorized context packet → receiving AI`

The receiving AI may receive complete relevant semantic context while still being denied secrets, unrelated data, private provider state, or unrestricted repository access.

## 9. External AI applications

Provisioning can be external:

`provider account → external application/runtime → provider-side permissions → external tools/MCP`

TeamAi then establishes:

`authorized connection → capability test → Workplace/Project binding → AI Seat → Equip → Activate`

TeamAi should not rebuild external AI applications merely to orchestrate them.

## 10. Seat equipment and capabilities

A Seat is configured with a capability profile, including:

`application/provider + runtime + model/variant + role + Team Quality + skills + Base TeamAi capabilities + Tool Quality + workstation/scope + permissions + approvals + limits + compliance + health`

A user is not finished merely by assigning an AI name. The AI must be equipped and activated under the applicable capability state.

## 11. Tool/MCP action path

`AI Seat → authorized tool intent → TeamAi policy/authorization → scoped native tool/plugin/MCP connection → invocation → result/artifact → durable event`

MCP is a capability integration protocol. It does not replace the TeamAi Scheduler, identity root, durable event system, permission policy, or human approval boundary.

The base TeamAi capability set may include native capabilities such as team/context, discussion/handoff, task/state, artifacts, authorized knowledge/search, research, approval/intervention, and coordination visibility. Whether a particular capability is native or MCP-backed is an implementation decision for later approved phases.

Additional MCP/tool capabilities may be independently entitled as Tool Quality and can be usable by basic or advanced models when provider/runtime compatibility and TeamAi authorization allow it.

## 12. Tool availability state

Use reason-bearing states rather than a binary tool switch:

`available → configured → entitled → compatible → authorized → scoped → seat-allowed → healthy → usable`

A tool existing in a catalog does not mean a Seat may invoke it.

## 13. Team Quality and Tool Quality

The commercial planning model uses two independent axes:

`Team Quality ≠ Tool Quality`

Team Quality may govern future Solo/Team operation, persistent AI-seat capacity, basic/advanced model allocation, and team/orchestration capacity.

Tool Quality may govern additional MCP servers, plugins, integrations, and specialist capabilities beyond the Base TeamAi capability set.

Neither axis automatically grants the other's external entitlements.

Provider entitlement remains external and must be represented separately.

## 14. ZIP-distributed skills and startup projects

TeamAi may distribute skills, starter projects, templates, configuration packages, or other initialization artifacts through project-owned ZIP/handover packages. These help a user equip external AI applications and connect them into TeamAi.

A package is not a new authority layer and cannot override Product Law, project ownership, provider terms, authorization, or current user instruction.

## 15. Recovery and continuity

When an AI/provider/tool/connection becomes unavailable:

`degrade/failure → durable state → diagnosis → remediation → capability test → authorization re-check → reactivation`

When a planning conversation is interrupted, the next agent must recover from the repository's canonical documents and durable handoff rather than reconstructing the architecture from memory or only from the last AI message.

## 16. Questions this model intentionally leaves for 029

- exact external connection UX;
- exact provider authorization mechanisms;
- precise context packet schema;
- precise event schema;
- scheduler implementation details;
- exact Base TeamAi tool/MCP inventory;
- exact Tool Quality packs;
- exact Team Quality subscription configuration;
- provider-specific compatibility profiles;
- final privacy/retention rules for shared conversations;
- implementation and verification boundaries.

Those are subsequent planning/approval matters, not silently implied implementation.
