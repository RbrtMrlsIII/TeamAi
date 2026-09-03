# TEAM-EXPERIENCE-029 — Commercial & Capability Model

**Status:** `PLANNING ARCHITECTURE — NOT CURRENT ENTITLEMENT OR PRICING AUTHORITY`
**Date:** 2026-09-03

## Purpose

This document records the commercial and capability discussion that must shape TEAM-EXPERIENCE-029 without prematurely turning future packaging, pricing, provider bundles, or model catalogs into current implementation claims.

## 1. Two independent product-quality axes

TeamAi should treat **Team Quality** and **Tool Quality** as separate capability dimensions.

### Team Quality

Team Quality describes the quality, scale, and capacity of AI teamwork provided by a TeamAi offering. It may include:

- Solo versus Team operating mode;
- number of persistent AI seats allowed;
- basic versus advanced TeamAi model capability allocation;
- turn/orchestration capacity;
- team coordination/resource limits;
- other future AI-team quality limits approved for the product.

The current working hypothesis is:

- **Solo**: one primary AI seat using a basic-model baseline;
- **Team**: a multi-seat AI team with basic and/or advanced model access according to the final TeamAi subscription design.

These are product-planning concepts only. Exact plan names, prices, model catalogs, seat counts, and limits remain intentionally open until explicitly approved.

### Tool Quality

Tool Quality describes the tools, MCP servers, integrations, plugins, and specialist capabilities available to the user's TeamAi environment.

The intended separation is:

`Team Quality ≠ Tool Quality`

A higher Team Quality offering does not automatically grant every third-party tool/provider capability, and purchasing additional Tool Quality does not automatically upgrade the AI model tier.

A basic model may use additional entitled tools/MCP capabilities when the provider/runtime, TeamAi policy, connection, scope, and authorization all permit it.

## 2. TeamAi subscription is not provider subscription

A TeamAi entitlement controls TeamAi product capabilities. It must never be represented as though it grants an external provider subscription, API entitlement, agent entitlement, or runtime entitlement that the user does not actually possess.

Conceptually:

`TeamAi subscription → Team Quality + Tool Quality capabilities`

while:

`Provider account / provider entitlement → external provider capability`

A provider, runtime, model, or external application may impose separate requirements that TeamAi cannot waive.

## 3. Base TeamAi capability set versus additional MCP/tool quality

TeamAi needs a minimum capability set that makes a TeamAi team able to function as a coordinated product. These capability categories are **not automatically required to be implemented as MCP servers**. Core TeamAi authority should remain native to TeamAi where appropriate.

Candidate Base TeamAi Capability Set:

1. **Team/Project Context** — inspect the authorized current user, Workplace, Project, Team/Solo state, active task, and permitted project context.
2. **Team Discussion & Handoff** — contribute discussion messages, create structured findings/handoffs, reference decisions, and participate in controlled turn-based planning.
3. **Task & State** — inspect assigned work and report lifecycle transitions such as completion, yield, failure, retry request, or recovery state where permitted.
4. **Artifacts & Files** — reference authorized project artifacts and produce bounded artifact outputs without leaking credentials or unrelated data.
5. **Knowledge/Search** — retrieve authorized project knowledge or indexed project material within the seat's scope.
6. **Research/Web Capability** — use an approved research/search capability when the applicable provider/runtime permits it and TeamAi policy authorizes it.
7. **Human Approval/Intervention** — request, wait for, and consume explicit user approval or intervention for actions that require it.
8. **Coordination/Readiness Visibility** — inspect relevant team participation, dependency/readiness, connection health, and coordination state needed to understand why work may proceed or stop.

The baseline should be intentionally minimal. Additional integrations become Tool Quality extensions rather than silently becoming core TeamAi requirements.

## 4. Additional MCP / Tool Quality

Examples of optional additional capability packs may include:

- GitHub or other engineering systems;
- external file/document systems;
- specialized research/data services;
- domain-specific APIs;
- deployment/infrastructure tools;
- specialist business systems;
- additional MCP servers;
- future plugin families.

An additional capability is usable only when all applicable conditions hold:

`available → installed/configured → TeamAi-entitled → provider/service-compatible → authorized → project-scoped → seat-allowed → usable`

Therefore:

**available ≠ installed ≠ entitled ≠ authorized ≠ usable**

Tool results never silently grant new permissions.

## 5. AI Seat capability identity

An AI Seat remains distinct from all of the following:

`AI application ≠ provider ≠ service/runtime ≠ model/variant ≠ connection ≠ workstation ≠ skill ≠ plugin/tool/MCP`

A TeamAi Seat is the configured participation identity inside a Workplace/Project. Its capability profile may include:

- external application/provider connection;
- service/runtime;
- exact model/variant;
- TeamAi role;
- Team Quality allocation;
- skills;
- Base TeamAi capability set;
- additional Tool Quality capabilities;
- workstation/repository/path scope;
- permissions and approval requirements;
- resource/budget/rate/storage limits;
- provider/service compliance state;
- connection health and capability-test state.

The same external model may therefore support multiple differently configured TeamAi Seats when the provider/runtime allows it.

## 6. External setup versus TeamAi activation

Some setup must or may happen outside the TeamAi web application:

`provider account → external authentication → external application/runtime setup → external MCP/tool configuration → external permissions/terms`

TeamAi then provides the coordination boundary:

`authorized connection → capability test → Workplace/Project binding → AI Seat → Team Quality + Tool Quality policy → scopes/limits → activation`

TeamAi must not pretend it owns external configuration that remains under the provider/application's authority.

## 7. How the AI uses its individual tools

The AI should never receive raw provider credentials merely because a tool is available.

Canonical execution boundary:

`AI Seat → tool intent → TeamAi policy/authorization → scoped connection/plugin/MCP → invocation → result/artifact → durable event`

The tool execution must be attributable to the requesting Seat and Project.

MCP is an integration/capability transport surface. TeamAi remains responsible for identity, authorization policy, orchestration, durable state, human approval, and entitlement interpretation.

## 8. User-intent preservation across the team

No AI may allow the immediately previous AI response to become a substitute for the user's authoritative intent.

Every Planning Team turn must remain grounded in:

`current user instruction + accumulated relevant team discussion + approved project context + current turn instruction`

The most recent AI contribution is evidence/input, not authority.

The final summarizer must have enough accumulated understanding to preserve:

- the original user objective;
- later user clarifications;
- all relevant AI contributions;
- pros/cons and disagreements;
- corrections and discovered constraints;
- decisions already accepted within the discussion;
- unresolved questions;
- important artifacts/findings/events;
- the latest user instruction.

Semantic completeness does not require blindly sending the entire raw transcript. TeamAi may use summaries, references, and relevance selection, but it must not silently omit information that changes the meaning of the user's request.

## 9. Planning Team versus Working Team

Commercial capability does not collapse the two operating stages.

**Planning Team:** deliberation, controlled turns, user-selected participants, selected summarizer, structured handoff, user review.

**Working Team:** approved plan, task/dependency graph, scheduler, AI/tool/human execution, durable results/events, downstream eligibility, review and recovery.

A subscription may constrain each stage differently in the future, but the authority distinction remains constant.

## 10. Skills and startup project packages

TeamAi may distribute curated skills, startup project packages, configuration templates, or initialization artifacts through project ZIPs and related project-owned delivery surfaces.

These packages are capability/distribution artifacts, not authority replacements.

A startup package must not silently override:

- TeamAi Product Law;
- the user's current project authority;
- provider terms or entitlements;
- Firebase UID ownership;
- project permissions;
- TeamAi Tool Quality authorization.

The packaged skill/startup experience should help a user equip an external AI application and then connect that capability into a TeamAi Seat.

## 11. Provider/tool/model warnings and planning guard

Before suggesting or implementing a provider/model/runtime/MCP/plugin combination, the project must distinguish:

- what the user asked for;
- what the provider actually supports;
- what the selected service/runtime exposes;
- what the TeamAi subscription entitles;
- what the tool/MCP requires;
- what the seat is authorized to use;
- what remains an unresolved or externally controlled dependency.

Known ToolKit process skills already cover complementary stages:

- `roots-definer`: existing-root check first; conflicting roots require reconciliation instead of silent redefinition;
- `backend-first-clarifier`: clarify backend authority before implementation when identity, state, runtime, commerce, ownership, or delivery can be affected;
- `phase-planner`: proposal → clarification → explicit approval → phase planting before implementation;
- `anti-pattern-checker`: check known dead ends before Classify;
- `safety-reporter`: warn and require explicit confirmation for destructive/high-impact/SYSTEMIC changes.

The safety reporter is not a general brainstorm blocker. Ordinary ideas remain discussable; the stronger guard applies when the action itself becomes high-impact, destructive, or canonical.

## 12. Still intentionally open

This model does not yet decide:

- exact subscription names;
- prices;
- exact basic/advanced model catalog;
- exact seat counts per paid tier;
- whether each Base TeamAi capability is implemented natively or through a specific MCP surface;
- exact additional MCP/tool packs and their prices;
- external provider authorization mechanism for each provider/application;
- final usage/resource limits.

Those decisions belong to later planning/approval and must not be inferred as current implementation.

## 13. Relationship to existing canonical documents

This is a planning contract under `docs/` and does not override `PRODUCT_LAW.md`.

`MASTERPLAN.md` and `TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md` remain the phase-planning authorities. `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md` refines the connection/Seat state model. This document adds the commercial/capability vocabulary and preserves the new discussion so later implementation can be traced without reconstructing it from chat history.
