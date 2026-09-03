# TeamAi Project Guide — AI Assistant Entry Point

**Status:** OPERATIONAL ENTRY GUIDE

This file is the project-guide companion to the root `AI_ASSISTANT_READ_ME.md`. It does not replace the root authority chain.

## Start here

Read in this order:

1. `README.md`
2. `PRODUCT_LAW.md`
3. `MASTERPLAN.md`
4. `/AI_ASSISTANT_READ_ME.md`
5. `docs/DOCUMENTATION_AND_EXECUTION_DISCIPLINE.md`
6. the applicable phase/domain contract
7. the applicable implementation/evidence records
8. the applicable skill/guard before changing code or canonical documents

## Current phase

`TEAM-BACKEND-001 — IN IMPLEMENTATION`

The repository is preparing for `TEAM-EXPERIENCE-029`, but 029 remains a planning/architecture frontier until the required backend gates and explicit implementation approval allow the next phase to proceed.

## Non-negotiable working rules

- Human user authority is above AI authority.
- A previous AI response is not a replacement for the user's instruction.
- Planning discussion is not authorization.
- Documentation is not proof of implementation.
- Deployment is not proof of runtime correctness.
- One provider must not become the global scheduler.
- UI must not become an alternative authority for backend/domain state.
- TeamAi subscription concepts must not be mistaken for provider subscriptions.
- MCP/tool availability must not be mistaken for authorization.
- ToolKit is upstream-only and does not own TeamAi state.

## Planning Team

The Planning Team is a user-controlled, turn-based deliberation system.

`User objective → configured participants → one response at a time → accumulated discussion → selected summarizer → structured handoff → user review → next command`

The user controls turn settings, participant selection, summarizer selection, and whether the discussion moves forward.

The final summarizer must preserve the meaningful accumulated discussion, not merely the latest AI message. The user remains the final authority.

## Working Team

`Approved handoff → task/dependency graph → Scheduler → AI/tool/human execution → durable event/result → next eligible work → review/recovery`

The Working Team applies the approved plan under Seat, connection, capability, permission, budget, and approval constraints.

## Connection and Seat

Do not combine these meanings:

`AI application ≠ provider ≠ runtime ≠ model ≠ connection ≠ Seat ≠ skill ≠ tool/MCP ≠ workstation ≠ entitlement ≠ authorization`

Provider/application setup may happen outside TeamAi. TeamAi then tests, scopes, equips, binds, authorizes, and activates the participating AI Seat.

## Tools and MCP

An AI may use an individual tool only through the authorized TeamAi boundary:

`Seat → tool intent → policy/authorization → scoped plugin/connection/MCP → invocation → result/artifact → durable event`

MCP is an integration/capability protocol and does not replace TeamAi's scheduler, identity authority, permission model, or durable state.

Base TeamAi capabilities may be native. Additional MCP/tool capability can be separately entitled and may be used by basic or advanced models when all conditions permit.

## Context and user intent

A rich team chat does not mean every model receives the same unrestricted transcript.

The execution context should be meaning-preserving:

`current user instruction + accumulated relevant team discussion + approved project context + current turn instruction`

Compression, summarization, retrieval, and artifact references are allowed only when they do not silently alter the meaning of the user's request.

## Before changing anything

Use the project execution discipline:

`inspect authority → inspect applicable skill/guard → inspect existing roots → classify proposal/change → reconcile conflicts → obtain required approval → implement smallest canonical change → verify → record evidence → update handover/endorsement`

When a rule is unclear or contradictory, STOP the affected implementation path and document the reconciliation need instead of inventing a new authority.

## Continuity

Planning ideas that matter must be captured in repository documents before they become cold conversation history. Use the dedicated 029 contracts and this project guide as durable memory, while keeping implementation/evidence records distinct from planning.
