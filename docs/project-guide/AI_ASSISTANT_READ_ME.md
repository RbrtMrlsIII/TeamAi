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
- Vercel is non-authoritative and may be used as a controlled web development/preview/browser-verification surface when the current web work benefits from it; it is not a TeamAi source, delivery, backend, commerce, scheduler, authorization, or completion authority.
- The Full Project ZIP is a first-class project-state package, not an optional add-on; it must follow `docs/PROJECT_ZIP_AND_ARTIFACT_POLICY.md`.

## Controlled Vercel web verification

The complete rule is `docs/UI_BROWSER_INTEGRITY_VERIFICATION_POLICY.md`.

Vercel is not restricted to UI-only work. It may be used deliberately for relevant web development and browser verification, including UI, UI-plus-backend integration, authenticated web flows, commerce-facing browser flows, responsive behavior, preview environments, and end-to-end browser smoke tests.

The browser result proves only the web behavior actually exercised. Backend, Firestore, PayPal, identity, entitlement, authorization, scheduler, deployment, and architecture evidence remain owned by their canonical authorities.

Do not assume:

`1 PR = 1 Vercel deployment`

or:

`1 merge = exactly 1 Vercel deployment`.

Configured external Vercel project rules determine deployment activity. Minimize unnecessary pushes and consolidate coherent changes before focused browser verification.

## Full Project ZIP and artifact discipline

The Full Project ZIP is the portable bulk-edit, handover, recovery, and transfer representation of the canonical GitHub project tree. It is derived from the pinned GitHub commit; it does not become a competing source authority.

The package must be flattened at the project root, preserve exact tracked file bytes and relative paths, and verify that the extracted tree matches the canonical tracked tree byte-for-byte.

Generated artifacts are not project source. Screenshots, browser captures, visual evidence images, preview output, build output, test/coverage output, logs, caches, local emulator state, deployment caches, editor state, and local secrets must not enter the package. Tracked content that violates the artifact rules is a packaging blocker, not something to silently exclude.

See `docs/PROJECT_ZIP_AND_ARTIFACT_POLICY.md` for the canonical package rules.

## Founder Pulse

Founder Pulse is a read-only operational observation layer over GitHub/GitLab Issue flow. Use it to understand delivery flow and backlog health—what moved to closed, what remains open, how old the work is, labels, and visible delivery relationships. Its findings are management/continuity evidence, not repository mutation authority or implementation proof.

A Founder Pulse observation must be reconciled against TeamAi's canonical authority chain before action. It can reveal process friction or missing linkage; it cannot authorize code changes, architecture changes, deployment changes, or scheduler decisions.

GitLab support in Founder Pulse does not place GitLab inside the current TeamAi architecture. GitLab remains deliberately deferred.

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

Planning ideas that matter must be captured in repository documents before they become cold conversation history. Use the dedicated 029 contracts, authority documents, package policy, and this project guide as durable memory, while keeping implementation/evidence records distinct from planning.
