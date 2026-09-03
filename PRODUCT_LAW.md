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
- Vercel is a browser-verification surface only; it is not TeamAi hosting authority, backend authority, or production deployment authority.
- Supabase Postgres is platform infrastructure only and is not the TeamAi domain/application database.
- Retired PostgreSQL implementation is historical-only and must not remain an active/recoverable TeamAi backend path.
- Web AI and Development AI are separate operational domains.
- Universal ToolKit is upstream-only: validated/generalized TeamAi lessons may flow upstream; ToolKit does not become TeamAi authority.

## Product Team Boundary

TeamAi is a product built by one development domain for use with another AI-team domain:

`TeamAi Development Team → builds TeamAi → connects/equips/coordinates/orchestrates → Web AI Team`

The Web AI Team is not a collection of TeamAi source-code contributors by definition. It is the connected AI participation environment through which users can conduct planning, discussion, handoffs, working execution, tool use, and coordinated AI work.

TeamAi MUST preserve this boundary in terminology, UI, data models, permissions, documentation, and orchestration contracts. Planning or working behavior of the Web AI Team MUST NOT be represented as the internal development process of the TeamAi Development Team.

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

## LAW 101 — IMPLEMENTATION TRACEABILITY IS A HARD COMPLETION GATE
Every implementation claim MUST be traceable from its governing Product Law and Masterplan execution item through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone MUST NOT be treated as implementation completion. A missing traceability link blocks the affected completion claim until an explicit, evidence-backed exception is recorded by the authorized human.

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

## Canonical documentation relationship
`PRODUCT_LAW.md` establishes durable product/architecture invariants. `MASTERPLAN.md` is the primary chronological execution and planning authority that elaborates how those invariants are applied. Detailed 029 contracts, project-guide documents, implementation files, evidence records, handover packets, and endorsements provide the applicable execution detail and proof. Lower-level documents MUST NOT silently redefine Product Law.

This front door MUST remain synchronized with active authority changes.
