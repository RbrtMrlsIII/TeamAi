# MASTERPLAN — TeamAi Execution Authority Pointer

`PRODUCT_LAW.md` is the product authority. The full chronological Masterplan is maintained in the synchronized project package while this repository surface carries the active gates needed for agent recovery and execution.

## Current execution wiring

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/**/SKILL.md → tools/systems → verification → evidence → HandOver / Endorsement → PRODUCT-KNOWLEDGE.md`

Every executable checklist item must resolve to a skill path in `docs/SKILL_WIRING.md` or explicitly state why no skill is required. `skills/SKILLS_INDEX.md` is a skill-library README/index when present; it is not the canonical wiring map.

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
7. [ ] Firebase emulator/rules verification remains environment-constrained/parked. Available source/configuration checks must not be converted into an inferred emulator pass, hosted pass, or production pass.
8. [x] Authorized Firebase project identity, live `(default)` Firestore database, Email/Password and Google Auth providers, and Firestore Rules deployment verified.
9. [x] Workplace → Project → Team/Solo → Seat persistence source slice implemented and live authenticated creation, independent Firestore verification, and repeat-call idempotency are evidenced.
10. [x] Trusted Supabase Edge runtime persistence slice implemented and configured with the Firebase service-account credential as the required Supabase Edge secret; authenticated execution, independent Firestore verification, and idempotency were exercised in the available environment.
11. [x] Gate 5B: server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation contract implemented and direct source-contract validation passed.
12. [x] Gate 5C: webhook authenticity, idempotency/replay protection, durable commerce event handling and entitlement projection implementation plus available-environment verification are complete. **Remaining:** final live PayPal transaction/webhook runtime evidence.
13. [ ] Provider/runtime invocation connected only after authorization/task contracts.
14. [ ] Security, contract, integration, failure, timeout, cancellation and recovery verification complete.
15. [ ] Traceability audit reconciled from Product Law → plan → contract/skill → implementation → evidence → endorsement.
16. [ ] TEAM-BACKEND-001 completion endorsement recorded.
17. [ ] Only after all `BLOCKS_029` gates are evidenced: release hold on TEAM-EXPERIENCE-029.

### Checklist skill-routing baseline

| Checklist | Required routing |
|---|---|
| 1–6 | `skills/execution/orucaveam/SKILL.md` + relevant governance/document skills |
| 7 | `skills/execution/orucaveam/SKILL.md`; Firebase-specific skill is a future bounded extension |
| 8–10 | `skills/execution/orucaveam/SKILL.md`; backend/Firebase/Supabase skill family is a future bounded extension |
| 11–12 | `skills/execution/orucaveam/SKILL.md`; commerce skill family is a future bounded extension |
| 13–14 | `skills/execution/orucaveam/SKILL.md`; provider/backend skills to be wired before implementation expands |
| 15–17 | `skills/governance/learning-handover/SKILL.md` + `skills/governance/masterplan-skill-wiring/SKILL.md` |

A field-specific skill must be created before a recurring bounded procedure becomes dependent on repeated ad-hoc instructions.

### Gate 5B boundary — PASS
The server-owned commerce contract establishes a pending intent from the trusted Firebase UID and correlation ID. A later verified PayPal event binds its provider event ID to that existing intent and derives the stable idempotency key. The browser is never the source of payment ownership truth.

Direct validation passed with strict TypeScript compilation and behavioral assertions in a temporary local workspace:

`GATE5B_DIRECT_TEST=PASS`

Evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE5B_2026-09-03.md` and `docs/evidence/GATE5B_DIRECT_VALIDATION_2026-09-03.md`.

**Important:** Gate 5B is source-contract completion only. No live PayPal transaction, webhook business processing, entitlement activation, or replay-protection completion claim is inferred from it.

### Gate 5C — PASS / CLOSED (live PayPal evidence remaining)
Gate 5C implementation and available-environment verification are complete. The canonical commerce runtime boundary verifies PayPal webhook authenticity, applies replay/idempotency controls, durably records authenticated commerce events in Firestore under the Firebase UID, and projects entitlement state only from authenticated provider events correlated to a server-owned commerce intent.

The remaining evidence item is **live PayPal transaction/webhook runtime validation**. This is an external/live runtime evidence requirement, not an unfinished Gate 5C implementation. The current environment constrains that live PayPal test; it MUST NOT be represented as a failed Gate 5C architecture or implementation.

Until that live PayPal evidence is captured, TEAM-BACKEND-001 final completion endorsement remains pending. No broader 5C implementation work should be reopened merely because the live external test remains outstanding.

### Current evidence boundary
The canonical `paypal-webhook` Edge Function contains the validated Gate-5C commerce implementation boundary. Authenticated PayPal transaction/webhook end-to-end evidence and final live runtime completion evidence remain outstanding. Hosting/runtime limitations must be recorded separately from source implementation status. Any historical Gate-5C replay-race evidence gap must be described precisely rather than used to reopen the completed implementation boundary.

### Hard completion rule
An implementation claim is complete only when its governing Product Law and Masterplan item trace through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone do not establish implementation completion.

## Pre-029 Planning Architecture — Canonical Product Capability

TEAM-EXPERIENCE-029 must be planned as the construction of the **canonical AI-team experience**, not merely a set of pages. The central product capability is a human-controlled web environment where multiple externally operated AI applications/providers can participate as configured team seats, exchange authorized work through durable structured state, make downstream work eligible through the TeamAi orchestrator, and use explicitly granted tools/plugins/integrations.

### Planning-stage vs working-stage distinction

The product has two different operating stages and they must not be collapsed:

**Planning Team stage**

`User idea/instruction → configured AI turns → one response at a time → accumulated discussion → selected summarizer → structured summary/handoff → user review → next command`

The Planning Team is deliberative. The user controls participation, turn settings, summarizer choice, and the decision to advance. A selected AI may be the sole document-authoring participant for an agreed canonical planning change while other AIs continue advisory analysis, challenge assumptions, inspect other fields, or provide pros/cons through chat. Durable mutation remains user-approved.

**Working Team stage**

`Approved plan/handoff → task decomposition → scheduler → assigned AI seat/tool → action → durable result/event → next eligible task/seat → review`

The Working Team applies the approved plan. Execution is bounded by project scope, seat permissions, connection capability, budget, runtime limits, provider policy, and approval gates. Working execution does not silently rewrite the approved plan.

### User-intent preservation

Every Planning Team turn is grounded in:

`current user instruction + accumulated relevant team discussion + approved project context + current turn instruction`

The immediately previous AI response is only one contribution. **Latest AI ≠ latest authority.** Context compression, retrieval, summaries, and artifact references may reduce payload size, but must preserve materially relevant meaning: original objective, later clarifications, contributions, disagreements, decisions, constraints, warnings, unresolved questions, and important findings/artifacts/events.

The selected final summarizer must have sufficient accumulated semantic context to synthesize the complete relevant discussion before returning control to the user.

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

MCP is treated as a standards-based integration/tool/context surface, not as TeamAi's scheduler, identity authority, permission system, or durable system of record. MCP compatibility must remain profile/version aware.

### Shared-team chat vs model context boundary

The UI may present a rich shared team conversation, but each AI receives an explicit meaning-preserving authorized context packet.

`Visible team conversation → message/event records → relevance/context selector → authorized context packet → receiving AI`

A receiving AI can read prior team contributions included for its turn, human interventions, structured summaries/handoffs, relevant task/event state, and referenced artifacts through authorized integrations. It must not automatically receive another provider's private model state, unrelated project data, secrets, or unrestricted repository contents.

### Team Quality vs Tool Quality

The commercial planning model keeps these independent:

`Team Quality ≠ Tool Quality ≠ Provider Entitlement`

Team Quality concerns the future TeamAi product axis for Solo/Team operating mode, persistent AI-seat capacity, basic/advanced model allocation, orchestration capacity, and related resource limits.

Tool Quality concerns the future capability axis for Base TeamAi capabilities plus optional tools/plugins/MCP servers and specialist integrations.

A basic model may use additional entitled MCP/tools when provider/runtime compatibility and TeamAi policy/authorization permit it. An advanced model does not automatically unlock external tools. A Tool Quality purchase does not automatically grant a provider subscription or model entitlement.

Exact prices, model catalogs, seat counts, tool packs, and limits remain planning-only until approved.

### Base TeamAi capability set

The candidate Base TeamAi capability set includes:

1. Team/Project context.
2. Team discussion and structured handoff.
3. Task/state reporting.
4. Authorized artifacts/files.
5. Authorized knowledge/search.
6. Approved research/web capability where supported.
7. Human approval/intervention.
8. Coordination/readiness visibility.

These are capability categories, not a commitment that every item will be an MCP server. Core TeamAi authority should remain native where appropriate; optional external integrations belong to the Tool Quality capability layer.

### Skills and startup project packages

TeamAi may distribute curated skill bundles, startup projects, templates, configuration packages, or initialization artifacts through project-owned ZIP/handover packages. These packages help users equip external AI applications and connect them into TeamAi.

Packages do not override Product Law, user authority, provider terms, project permissions, TeamAi entitlement, or Seat authorization.

ToolKit may learn only generalized lessons from TeamAi after the consuming-project evidence establishes that the lesson generalizes; TeamAi-specific assumptions do not become upstream authority automatically.

### Provider/model/tool warning boundary

Before modifying provider adapters, model catalogs, advanced agent runtimes, context-transfer code, tool/plugin connectors, MCP, provider-native storage, retention/disclosure behavior, or subscription/entitlement logic, the agent must first inspect the applicable provider/tool guard, existing roots, and current documented contract. Unknown, stale, contradictory, or potentially prohibited rules must become an explicit review/blocked condition rather than an assumption.

### 029 questions that must be answered before or during implementation

1. How does a user connect AI applications that are operated outside TeamAi?
2. What provider authorization/connection states are visible, testable, and recoverable?
3. How is an external connection bound to one Workplace, Project, and AI Seat?
4. How does the user equip each AI with skills, Base TeamAi capabilities, Tool Quality, plugins/tools/MCP, workstation scope, permissions, and approval rules?
5. How does TeamAi distinguish provider, service/runtime, exact model/variant, connection, Seat, Team Quality, skills, Base TeamAi capabilities, Tool Quality, workstation, scopes, limits, entitlement and compliance?
6. How does an AI completion or action make another task eligible without direct provider-to-provider control?
7. Which durable events represent AI results, action requests, tool results, approvals, failures, retries, cancellations, recovery, and completions?
8. How can the Scheduler explain and reproduce why the next AI/tool/human acted?
9. How does the shared chat expose the complete relevant discussion while each AI receives a meaning-preserving authorized context packet?
10. How can one AI explicitly consume another AI's finding, handoff, artifact, or decision without exposing private provider state?
11. How is exactly one document-authoring path selected during planning while other AIs remain advisory?
12. How does the selected Web AI summarizer return the discussion to the user for `APPROVE`, `EDIT`, `MORE`, or `REJECT`?
13. How are planning decisions separated from working execution state?
14. How are approvals, blocked actions, failures, retries, cancellation, and recovery represented visibly?
15. What happens when a configured provider/runtime/plugin/connection becomes unavailable after configuration?
16. How is the same semantic team/workflow preserved across spatial, standard web, mobile, and accessibility representations?
17. Which newly discovered requirements belong in 029, which return to backend/integration gates, and which become future phases?
18. What exact conditions move a connection/Seat from configured to Active, and what evidence is required to reactivate it after degradation or authorization loss?
19. How does the product communicate the difference between TeamAi entitlement and external provider entitlement without implying one grants the other?
20. Which capabilities belong to the Base TeamAi capability set, and which remain optional Tool Quality extensions or provider-owned capabilities?
21. How are supplied skill bundles, startup projects, templates, or ZIP packages consumed without creating a competing authority or silently overwriting current project rules?
22. How does the system preserve every user clarification and materially relevant team contribution when the shared conversation grows beyond one model's context limit?

### Root-wiring guard before 029 coding

Before any production UI implementation slice, reconcile the proposed UI root against its owning canonical roots. Identity, Workplace ownership, project context, provider/runtime identity, connection state, Team Quality, skills, Base TeamAi capabilities, Tool Quality, tools, task/event state, commerce, approvals, notifications, recovery, privacy, compatibility, and spatial semantics must not be redefined locally when an existing canonical root already owns the meaning.

The UI is presentation and interaction over authoritative state and policy intents, not a new authority layer.

### 029 completion frontier

029 should be considered complete only when evidence demonstrates that the canonical UI is correctly wired to the authoritative identity/context chain, Workplace/Project/Team/Seat state, connection/capability lifecycle, Planning Team turn orchestration, user-intent preservation, summarizer handoff/user review, Working Team task/event execution, provider/runtime connection state, Team Quality and Tool Quality entitlement boundaries, skill/tool/plugin capability state, durable action/approval/recovery state, and responsive/accessibility equivalents.

Browser verification is validation evidence only; it does not become TeamAi hosting or system-of-record authority.

Any backend capability discovered during 029 must be routed through the owning backend/integration contract rather than embedded as browser authority.

Detailed planning contracts:
- `docs/TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md`
- `docs/TEAM-EXPERIENCE-029_CONTEXT_AND_ORCHESTRATION_MODEL.md`
- `docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md`
- `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`

## Target-project handover rule
Every completed gate must surrender a target-project handover packet/ZIP in the same execution. The handover belongs to TeamAi; Universal ToolKit only provides reusable upstream process knowledge and does not own TeamAi project state.
