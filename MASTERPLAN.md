# MASTERPLAN — TeamAi Execution Authority Pointer

`PRODUCT_LAW.md` is the product authority. The full chronological Masterplan is maintained in the synchronized project package while this repository surface carries the active gates needed for agent recovery and execution.

## Current chronological gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## TEAM-BACKEND-001 — Backend Foundation

**Status:** IN IMPLEMENTATION.

### Chronological execution checklist
1. [x] Architecture/authority reconciliation encoded in executable service assertions.
2. [x] Firebase UID ownership hierarchy encoded in Firestore path contracts.
3. [x] Deterministic Web AI effective-skill resolution encoded; skills do not grant authorization.
4. [x] Durable task lifecycle and event/idempotency contract encoded.
5. [x] Firestore source configuration baseline wired: `firebase.json`, `firestore.rules`, `firestore.indexes.json`.
6. [x] Canonical Product Law, AI assistant recovery guide, Masterplan and backend evidence updated together.
7. [ ] Local Firebase emulator/rules execution verified. **PARKED/BLOCKED by local environment.**
8. [x] Authorized Firebase project identity, live `(default)` Firestore database, Email/Password and Google Auth providers, and Firestore Rules deployment verified.
9. [x] Workplace → Project → Team/Solo → Seat persistence source slice implemented and live authenticated creation, independent Firestore verification, and repeat-call idempotency are evidenced.
10. [x] Trusted Supabase Edge runtime persistence slice implemented and deployed with canonical Firebase project-identity enforcement; live authenticated execution, independent Firestore verification, and idempotency are evidenced.
11. [x] Gate 5B: server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation contract implemented and direct source-contract validation passed.
12. [ ] Gate 5C: verified PayPal webhook authenticity, idempotency, replay protection, durable commerce event and entitlement projection implemented and evidenced.
13. [ ] Provider/runtime invocation connected only after authorization/task contracts.
14. [ ] Security, contract, integration, failure, timeout, cancellation and recovery verification complete.
15. [ ] Traceability audit reconciled from Product Law → plan → contract/skill → implementation → evidence → endorsement.
16. [ ] TEAM-BACKEND-001 completion endorsement recorded.
17. [ ] Only after all `BLOCKS_029` gates are evidenced: release hold on TEAM-EXPERIENCE-029.

### Gate 5B boundary — PASS
The server-owned commerce contract establishes a pending intent from the trusted Firebase UID and correlation ID. A later verified PayPal event binds its provider event ID to that existing intent and derives the stable idempotency key. The browser is never the source of payment ownership truth.

Direct validation passed with strict TypeScript compilation and behavioral assertions in a temporary local workspace:

`GATE5B_DIRECT_TEST=PASS`

Evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE5B_2026-09-03.md` and `docs/evidence/GATE5B_DIRECT_VALIDATION_2026-09-03.md`.

**Important:** Gate 5B is source-contract completion only. No webhook authenticity, replay handling, entitlement activation, or live payment-success claim is inferred from it.

### Gate 5C — ACTIVE
Gate 5C is the next implementation boundary: verify PayPal webhook authenticity, reject/reconcile replayed transmissions, durably record the commerce event under the Firebase UID, and project entitlement state only from authenticated provider events correlated to a server-owned commerce intent.

PayPal's current webhook guidance requires verification of received messages and a successful 2xx receipt; non-2xx deliveries can be retried up to 25 times over 3 days. The webhook registration supplies a webhook ID used during verification. citeturn946136search4turn946136search6

PayPal's current subscription model exposes subscription lifecycle/payment events and supports subscription customization, but TeamAi must treat provider identifiers and provider entitlements as external authority inputs only after authenticity and server-owned correlation checks. citeturn946136search1turn946136search8

### Current evidence boundary
Firebase persistence is independently evidenced. The PayPal webhook Edge Function currently serves as a verification bootstrap boundary and intentionally stops before business completion claims. Gate 5C must connect verified provider events to the already-defined server-owned correlation and durable Firebase commerce state without creating a parallel authority path.

### Hard completion rule
An implementation claim is complete only when its governing Product Law and Masterplan item trace through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone do not establish implementation completion.

## Pre-029 Planning Architecture — Canonical Product Capability

TEAM-EXPERIENCE-029 must be planned as the construction of the **canonical AI-team experience**, not merely a set of pages. The central product capability is a human-controlled web environment where multiple externally operated AI applications/providers can participate as configured team seats, exchange authorized work through durable structured state, make downstream work eligible through the TeamAi orchestrator, and use explicitly granted tools/plugins/integrations.

### Planning-stage vs working-stage distinction

The product has two different operating stages and they must not be collapsed:

**Planning Team stage**

`User idea/instruction → configured AI turns → one response at a time → discussion → selected summarizer → structured summary → user review → next command`

The Planning Team is deliberative. The user controls participation, fixed-turn settings, summarizer choice, and the decision to advance. A selected AI may be the sole document-authoring participant for an agreed canonical planning change while other AIs continue advisory analysis, challenge assumptions, inspect other fields, or provide pros/cons through chat. Durable mutation remains user-approved.

**Coding / Working Team stage**

`Approved plan/handoff → task decomposition → scheduler → assigned AI seat/tool → action → durable result/event → next eligible task/seat → review`

The Working Team applies the approved plan. Execution is bounded by project scope, seat permissions, connection capability, budget, runtime limits, provider policy, and approval gates. Working execution does not silently rewrite the approved plan.

### Canonical AI-to-AI orchestration question

**How does the next AI act after the previous AI?**

Not by direct provider-to-provider control.

`AI response/action → durable structured event → task/state transition → scheduler eligibility → next AI/tool/human → new event`

The Scheduler owns next-agent selection. A previous AI may produce a recommendation for a downstream task, but it cannot directly authorize or invoke another provider outside the orchestrator's policy path.

### Team Leader and Summarizer

The Web AI Team Leader is a supervisory seat/capability that may monitor participation, stalled tasks, contradictions, missing handoffs, repeated failures, verification gaps, or budget anomalies. It can recommend bounded coordination actions but cannot bypass backend authorization or human approval.

The selected Summarizer is a distinct seat/capability. It converts the Planning Team discussion into a structured handoff, preserves disagreements and unresolved questions, and presents the result for user review. Summarization is not document mutation authority.

### External AI application connection model

AI applications may require setup outside TeamAi. The product therefore needs a connection/activation model that can import or complete externally authorized connections.

`External AI application/provider account → user-authorized connection → TeamAi capability test → Workplace/Project → AI Seat → runtime/model + skills + tools/plugins + workstation + scopes + limits`

A user must be able to configure more than a model name. The canonical AI Seat identity includes provider, service/runtime, exact model/variant where applicable, skill bundle, tool/plugin/MCP bundle, workstation binding, project/repository/path scope, permissions, approval rules, resource limits, and provider-compliance state.

The same provider/model may support multiple distinct seats. Seat identity is an authorized runtime configuration/instance, not merely a model label.

### AI connection / seat / capability lifecycle

The planning lifecycle is:

`Discover → External Setup → Import/Authorize → Capability Test → Bind → Equip → Activate → Run → Observe → Degrade/Suspend → Recover/Revalidate → Rebind/Retire`

Do not collapse the following concepts:

`application ≠ provider ≠ service/runtime ≠ model ≠ connection ≠ seat ≠ skill ≠ tool/MCP ≠ workstation ≠ entitlement ≠ authorization`

A Connection represents the externally authorized relationship. An AI Seat represents the TeamAi participation identity and policy configuration. A Seat may reference a Connection, but the two remain distinct.

Each Seat capability profile should distinguish provider/application, service/runtime, model/variant, Team role, Team Quality, skills, Base TeamAi capabilities, Tool Quality, workstation/scope, permissions, approvals, limits, compliance and health.

Capability state should be reason-bearing rather than binary:

`available → configured → TeamAi-entitled → provider-compatible → authorized → project-scoped → seat-allowed → healthy → usable`

Loss of authorization, entitlement, compatibility, scope, workstation availability, or health must block only the affected capability/Seat from execution and preserve the diagnostic/recovery state. Revalidation is required before returning to Active.

Detailed planning contract: `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`.

### Plugin / tool / MCP execution model

Plugins are capabilities, not intelligence.

`AI Seat → authorized tool intent → Tool Policy Engine → project-scoped plugin/connection → tool invocation → result/artifact → durable event`

The user/project grants actual plugin scopes. Secrets remain outside ordinary chat content. Tool invocations are attributable to the requesting seat and project. Tool outputs may be bounded in model context while full artifacts remain available through authorized storage. Tool results never silently grant new permissions.

MCP is treated as a standards-based integration/tool/context surface, not as TeamAi's scheduler, identity authority, permission system, or durable system of record. The published 2026-07-28 MCP specification has a stateless core, formal extensions including Tasks, authorization hardening, and a deprecation policy, so TeamAi must keep MCP/provider compatibility profile-aware. citeturn946136search0

### Shared-team chat vs model context boundary

The UI may present a rich shared team conversation, but each AI receives an explicit authorized context packet.

`Visible team conversation → message/event records → relevance/context selector → authorized minimal context packet → receiving AI`

A receiving AI can read prior team contributions that are explicitly included for its turn, human interventions, structured summaries/handoffs, relevant task/event state, and referenced artifacts through authorized integrations. It must not automatically receive another provider's private model state, unrelated project data, secrets, or unrestricted repository contents.

Therefore:

**Chat is the coordination surface. Context packets are the execution boundary.**

### Canonical UI concepts that 029 must expose

029 should make these understandable and inspectable instead of hiding them behind generic UI:

- Workplace
- Project
- AI Team
- AI Seat
- connection
- provider/application
- service/runtime
- exact model/variant
- Team Quality
- skill bundle
- Base TeamAi capabilities
- Tool Quality
- tools/plugins/MCP
- workstation/scope
- entitlement/authorization state
- task
- dependency
- event
- handoff
- action request
- approval
- result/artifact
- capability/connection health
- execution history/recovery

The experience should make it possible to answer **why the next AI acted** by showing the relevant dependency, event, readiness condition, scheduler decision, capability/authorization state, and execution boundary.

### 029 questions that must be answered before or during implementation

1. How does a user connect AI applications that are operated outside TeamAi?
2. What provider authorization/connection states are visible, testable, and recoverable?
3. How is an external connection bound to one Workplace, Project, and AI Seat?
4. How does the user equip each AI with skills, Base TeamAi capabilities, Tool Quality, plugins/tools/MCP, workstation scope, permissions, and approval rules?
5. How does TeamAi distinguish provider, service/runtime, model/variant, connection, Seat, Team Quality, skills, Base TeamAi capabilities, Tool Quality, workstation, scopes, limits, entitlement and compliance state?
6. How does an AI completion or action make another task eligible without direct provider-to-provider control?
7. Which durable events represent AI results, action requests, tool results, approvals, failures, retries, cancellations, degradation, revalidation, and completions?
8. How can the Scheduler explain and reproduce why the next AI/tool/human acted?
9. How does the shared chat expose team discussion while each AI receives only its authorized minimal context?
10. How can one AI explicitly consume another AI's finding, handoff, artifact, or decision without exposing private provider state?
11. How is exactly one document-authoring path selected during planning while the other AIs remain advisory?
12. How does the selected Web AI summarizer return the discussion to the user for `APPROVE`, `EDIT`, `MORE`, or `REJECT`?
13. How are planning decisions separated from working execution state?
14. How are approvals, blocked actions, failures, retries, cancellation, and recovery represented visibly?
15. What happens when a configured provider/runtime/plugin/connection becomes unavailable after configuration?
16. How is the same team/workflow meaning preserved across spatial, standard web, mobile, and accessibility representations?
17. Which newly discovered requirements belong in 029, which return to backend/integration gates, and which become future phases?
18. What exact conditions move a connection/Seat from configured to Active, and what evidence is required to reactivate it after degradation or authorization loss?
19. How does the product communicate the difference between TeamAi entitlement and external provider entitlement without implying one grants the other?
20. Which capabilities belong to the Base TeamAi capability set, and which remain optional Tool Quality extensions or provider-owned capabilities?

### Root-wiring guard before 029 coding

Before any production UI implementation slice, reconcile the proposed UI root against its owning canonical roots. Identity, Workplace ownership, project context, provider/runtime identity, connection state, Team Quality, skills, Base TeamAi capabilities, Tool Quality, tools, task/event state, commerce, approvals, notifications, recovery, privacy, compatibility, and spatial semantics must not be redefined locally when an existing canonical root already owns the meaning.

The UI is presentation and interaction over authoritative state and policy intents. A page-local rule that contradicts an existing canonical root is a reconciliation problem, not a frontend implementation opportunity.

### 029 completion frontier

029 should be considered complete only when evidence demonstrates that the canonical UI is correctly wired to the authoritative identity/context chain, Workplace/Project/Team/Seat state, connection/capability lifecycle, Planning Team turn orchestration, summarizer handoff/user review, Working Team task/event execution, provider/runtime connection state, Team Quality and Tool Quality entitlement boundaries, skill/tool/plugin capability state, durable action/approval/recovery state, and responsive/accessibility equivalents.

Browser verification is validation evidence only; it does not become TeamAi hosting or system-of-record authority.

Any backend capability discovered during 029 must be routed through the owning backend/integration contract rather than embedded as browser authority.

Detailed planning contracts:
- `docs/TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md`
- `docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md`
- `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`

## Target-project handover rule
Every completed gate must surrender a target-project handover packet/ZIP in the same execution. The handover belongs to TeamAi; Universal ToolKit only provides reusable upstream process knowledge and does not own TeamAi project state.