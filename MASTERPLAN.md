# MASTERPLAN — TeamAi Execution Authority Pointer

`PRODUCT_LAW.md` is the product authority. The full chronological Masterplan is maintained in the synchronized project package while this repository surface carries the active gates needed for agent recovery and execution.

## Current execution wiring

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → ORUCAVEAM skills + field/domain skills + tool/system skills → verification → evidence → HandOver / Endorsement → PRODUCT-KNOWLEDGE.md`

Every executable checklist item must resolve to concrete skill path(s) in `docs/SKILL_WIRING.md` or explicitly state why no skill is required. `skills/README.md` is the skill-library README; it is not the canonical TeamAi wiring map.

## Current chronological gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Active state reconciliation — 2026-09-10

The backend clock has crossed the bounded TEAM-BACKEND-001 implementation/validation gate: task execution, lease contention/recovery, PayPal Sandbox commerce correlation, durable Firestore aggregate/event/entitlement re-read, traceability, and bounded Endorsement are recorded in the current evidence chain. This does **not** close every broader backend boundary.

- Firebase Rules emulator verification (Gate 4) remains **PARKED / NOT PROVEN** because a real emulator PASS is not present in the repository evidence.
- `teamai-task-execute` is runtime-proven only through its bounded authenticated path and still uses `stub-edge-runtime`; real external provider invocation remains **OPEN / NOT PROVEN**.
- GitHub App installation is operator-confirmed, while Conn-3 callback live deployment/browser proof remains **PENDING** and is not a Hero live bind.
- Seat connection/provider surfaces are deployed but remain implementation/deployment surfaces rather than automatic product acceptance.
- The spatial clock is independent: **Vision V3.5 complete** (entrance ladder V3.1–V3.5 merged). **#258 residual** in flight: Layer A/B legibility + machine chrome soft-hide (ENT-R2/R3, CHR-R1/R2 — PR #259); Cam-6 seat look-at residual still open. Next parallel work remains **Conn-3 live deployment/browser proof** (not a Hero live bind), with no backend authority transferred into the Hero.

Historical checkpoints may retain earlier pending wording because they are evidence records. This active index is the current recovery map and must not rewrite those historical records.

## TEAM-BACKEND-001 — Backend Foundation

**Status:** ENDORSED for bounded recorded scope; residual evidence boundaries remain explicit.

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
12. [x] Gate 5C: webhook authenticity, idempotency/replay protection, durable commerce event handling and entitlement projection implementation plus available-environment verification are complete, and bounded live PayPal Sandbox transaction/webhook + Firestore aggregate evidence is recorded.
13. [ ] Provider/runtime invocation connected only after authorization/task contracts.
14. [ ] Security, contract, integration, failure, timeout, cancellation and recovery verification complete.
15. [x] Traceability audit reconciled for the bounded recorded scope from Product Law → plan → contract/skill → implementation → evidence → endorsement.
16. [x] TEAM-BACKEND-001 bounded completion endorsement recorded.
17. [ ] Only after all `BLOCKS_029` gates are evidenced: release hold on TEAM-EXPERIENCE-029.

### Checklist skill-routing baseline

| Checklist | Required routing |
|---|---|
| 1 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/authority-contract/SKILL.md` + applicable verification/audit skills |
| 2 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/firebase-project-identity/SKILL.md` + `skills/backend/firestore-canonical-state/SKILL.md` |
| 3 | `skills/execution/orucaveam/SKILL.md` + `skills/governance/masterplan-skill-wiring/SKILL.md`; implementation-specific skill routing remains subordinate to the existing deterministic resolver contract |
| 4 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/task-event-idempotency/SKILL.md` |
| 5 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/firebase-project-identity/SKILL.md` + `skills/backend/firestore-canonical-state/SKILL.md` |
| 6 | `skills/execution/orucaveam/SKILL.md` + `skills/governance/product-law-change/SKILL.md` + `skills/governance/masterplan-skill-wiring/SKILL.md` |
| 7 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/firebase-project-identity/SKILL.md` + `skills/backend/verification-recovery/SKILL.md` |
| 8 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/firebase-project-identity/SKILL.md` + `skills/backend/firestore-canonical-state/SKILL.md` + `skills/backend/verification-recovery/SKILL.md` |
| 9 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/firestore-canonical-state/SKILL.md` + `skills/backend/task-event-idempotency/SKILL.md` |
| 10 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/supabase-edge-runtime/SKILL.md` + `skills/backend/firestore-canonical-state/SKILL.md` + `skills/backend/verification-recovery/SKILL.md` |
| 11 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/commerce-paypal/SKILL.md` + `skills/backend/verification-recovery/SKILL.md` |
| 12 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/commerce-paypal/SKILL.md` + `skills/backend/verification-recovery/SKILL.md` |
| 13 | `skills/execution/orucaveam/SKILL.md`; no provider-runtime field skill is required until the provider/runtime contract is authorized and its recurring procedure is defined |
| 14 | `skills/execution/orucaveam/SKILL.md` + `skills/backend/authority-contract/SKILL.md` + `skills/backend/task-event-idempotency/SKILL.md` + `skills/backend/verification-recovery/SKILL.md` |
| 15 | `skills/execution/orucaveam/SKILL.md` + `skills/governance/masterplan-skill-wiring/SKILL.md` + `skills/execution/orucaveam/audit/SKILL.md` |
| 16 | `skills/execution/orucaveam/SKILL.md` + `skills/governance/learning-handover/SKILL.md` |
| 17 | `skills/execution/orucaveam/SKILL.md` + `skills/governance/learning-handover/SKILL.md` + explicit permission/release gate review |

A field-specific skill must exist before a recurring bounded procedure becomes dependent on repeated ad-hoc instructions. A checklist item that is not yet executable because its protected contract or authorization is not established must say so explicitly rather than using a future folder placeholder.

### Gate 5B boundary — PASS
The server-owned commerce contract establishes a pending intent from the trusted Firebase UID and correlation ID. A later verified PayPal event binds its provider event ID to that existing intent and derives the stable idempotency key. The browser is never the source of payment ownership truth.

Direct validation passed with strict TypeScript compilation and behavioral assertions in a temporary local workspace:

`GATE5B_DIRECT_TEST=PASS`

Evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE5B_2026-09-03.md` and `docs/evidence/GATE5B_DIRECT_VALIDATION_2026-09-03.md`.

**Important:** Gate 5B is source-contract completion only. No live PayPal transaction, webhook business processing, entitlement activation, or replay-protection completion claim is inferred from it.

### Gate 5C — PASS / CLOSED for bounded recorded scope
Gate 5C implementation and available-environment verification are complete. The canonical commerce runtime boundary verifies PayPal webhook authenticity, applies replay/idempotency controls, durably records authenticated commerce events in Firestore under the Firebase UID, and projects entitlement state only from authenticated provider events correlated to a server-owned commerce intent.

Bounded live PayPal Sandbox transaction/order/approval/capture, webhook delivery, redelivery handling, and direct Firestore aggregate/event/entitlement verification are now recorded in the 2026-09-06 and 2026-09-07 evidence chain. TEAM-BACKEND-001 is therefore endorsed for the bounded recorded scope. The record does not claim Gate 4 emulator PASS, real external provider invocation beyond `stub-edge-runtime`, broader scheduler/approval integration, production PayPal readiness, or full 029 release readiness.

### Current evidence boundary
The canonical `paypal-webhook` Edge Function contains the validated Gate-5C commerce implementation boundary. The bounded live PayPal Sandbox transaction/webhook path and subsequent Firestore aggregate/event/entitlement re-read are runtime-proven and endorsed for the recorded scope. Broader claims remain separately bounded: Gate 4 emulator execution is not evidenced, `teamai-task-execute` remains a stub provider runtime, real external provider invocation is not proven, Conn-3 browser/live deployment proof is pending, and 029 release remains gated by its own spatial/backend release criteria. Historical Gate-5C checkpoint wording remains historical evidence and is not rewritten here.

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
6. Approved research/web capability.
7. Basic code/workspace operations when entitled and authorized.
8. Explicit handoff to normal UI for durable configuration.

## TEAM-EXPERIENCE-029 — Spatial Theme and Visual System

**Status:** presentation planning surface — **no 029-released claim**

The Spatial Theme and Visual System remains the planning checklist for entrance, machine chrome, camera subject, and presentation boundaries. Skill routing, visual-system boundary, open 029 planning questions, and the root-wiring guard continue to live here so agents do not invent parallel product authority from the Hero canvas.

(Full historical Spatial Theme checklist, skill-routing table, 22 open questions, and root-wiring guard remain the recovery contract from main; this residual PR only adds the #258 frontier note in Active state reconciliation above.)

## 029 questions that must be answered before or during implementation

Open planning questions remain listed in the synchronized full Masterplan package and prior main index. Do not delete them when updating frontier status.

## Target-project handover rule

HandOver / Endorsement records are historical evidence and must not be rewritten when advancing a residual presentation slice.

## Current 029 product-design execution order

1. Structure and hierarchy (largely merged).
2. Camera truth and subject lock (modules merged; feel residual #258 CAM open).
3. Entrance Layer A/B legibility (#258 ENT/CHR in PR #259).
4. Conn-3 live deployment/browser proof (parallel; not Hero live bind).
5. Owner visual endorsement when environment is fair.

## Product experience vision (intent pointer)

`docs/VISION.md` is the single experience vision home. Camera and hierarchy contracts remain the technical detail under that intent.
