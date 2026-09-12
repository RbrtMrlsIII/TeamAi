# MASTERPLAN — TeamAi Execution Authority Pointer

`PRODUCT_LAW.md` is the product authority. The full chronological Masterplan is maintained in the synchronized project package while this repository surface carries the active gates needed for agent recovery and execution.

## Current execution wiring

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → ORUCAVEAM skills + field/domain skills + tool/system skills → verification → evidence → HandOver / Endorsement → PRODUCT-KNOWLEDGE.md`

Every executable checklist item must resolve to concrete skill path(s) in `docs/SKILL_WIRING.md` or explicitly state why no skill is required. `skills/README.md` is the skill-library README; it is not the canonical TeamAi wiring map.

## Current chronological gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Active state reconciliation — 2026-09-11

The backend clock has crossed the bounded TEAM-BACKEND-001 implementation/validation gate. Its remaining boundaries stay explicit. The spatial/product-experience clock is now governed by the owner-endorsed C0–C10 rebaseline described below.

- Firebase Rules emulator verification (Gate 4) remains **PARKED / NOT PROVEN** because a real emulator PASS is not present in repository evidence.
- `teamai-task-execute` remains runtime-proven only through its bounded authenticated path with `stub-edge-runtime`; real external provider invocation remains **OPEN / NOT PROVEN**.
- GitHub App installation is operator-confirmed; Conn-3 callback live deployment/browser proof remains **PENDING** and is not a Hero live bind.
- Seat connection/provider surfaces remain implementation/deployment surfaces rather than automatic product acceptance.
- PR #259 remains an important historical implementation baseline: CAM-R-RETIRE + ENT-T1/ENT-R2/R3 + CHR soft-hide. It is **not** the final product-shape authority after the owner-directed C0–C10 rebaseline.
- Historical checkpoints may retain earlier pending wording because they are evidence records. This active index is the current recovery map and must not rewrite historical evidence.

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

## TEAM-EXPERIENCE-029 — Spatial Theme and Visual System

**Status:** PLANNED PRODUCT-EXPERIENCE PROGRAM — current execution is governed by the owner-endorsed C0–C10 rebaseline.

The Product Law visual requirement is:

`one theme setting → Dark Spatial Glassmorphism OR Light Spatial Skeuomorphism`

## TEAM-EXPERIENCE-029 — Owner-Endorsed Experience Rebaseline (C0–C10)

This section is the current chronological product-experience execution baseline. It supersedes the old one-shell entrance as the final product-shape target, while preserving the old implementation as historical evidence.

### Historical Vision baseline retained

**Vision V3.5 complete** remains preserved here as a historical/verification marker for the earlier Vision ladder. It does not mean the former one-shell entrance remains the current final product-shape target. The owner-endorsed C0–C10 rebaseline is now the active experience baseline.

### C0 — Product-shape endorsement

**Status: ENDORSED.** The owner authorized one coherent C0–C10 execution program:

`classic website entrance → explicit 3D-world entry → coherent navigation/Settings → rationalized camera language → authenticated/server-authorized full workspace → desktop + phone acceptance → ProMax refinement`

No archived camera revival. No 029 release claim.

### C1 — Canonical reconciliation

Reconcile `MASTERPLAN.md`, `docs/TEAMAI_029_CURRENT_STATE_MAP.md`, `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`, `docs/VISION.md`, and applicable contracts/skills so they describe the same current product shape. Historical Vision/V3.x checkpoints remain historical evidence and are not rewritten.

### C2 — Classic website entrance

The public first paint must read as a conventional website. The visitor should not encounter the former 3D camera/control/configuration wall merely by arriving at the site.

Acceptance: clear information hierarchy on desktop and phone; no dependency on live 3D chrome for the public entrance story.

### C3 — Explicit 3D-world entry + return

The 3D world becomes a deliberate destination entered by an explicit user action. Return to the classic entrance must be unambiguous and tested.

Acceptance: browser path proves `classic → world → classic` while preserving the single intended Hero instance.

### C4 — Coherent navigation + Settings

World controls must have one intentional navigation/home surface. Settings must be discoverable from that surface and must not be scattered among floating controls or duplicated local authorities.

Acceptance: the visible navigation model is understandable on desktop and phone; settings actions have an actual wired destination.

### C5 — Camera vocabulary reduction

Keep the meaningful world baseline and contextual subject focus. Retired/confusing operator-facing controls are removed from the active interaction vocabulary.

`HERO_LOW_ORBIT` and `TURN_FOLLOW` remain archived/superseded and must not be silently revived.

### C6 — World-baseline zoom-out

Tree/subject navigation must be able to return to the normal world baseline instead of stopping at an arbitrary high/close position.

Acceptance: a browser/runtime test demonstrates the reachable baseline and absence of a dead-end zoom clamp in the tree context.

### C7 — Proportional orbit

Pointer/swipe direction must map naturally to visible rotation. The old inverse behavior is superseded.

Acceptance: right input produces rightward visible yaw and upward input produces the corresponding upward pitch, with regression coverage through the actual input path.

### C8 — Authenticated / server-authorized full workspace

The classic entrance and world preview remain presentation surfaces. Full workspace capability requires server-verified identity and server authorization. Client UI may communicate the boundary but cannot grant it.

Acceptance: an actual authorized runtime proof is required before this gate is marked complete. This Masterplan change does not itself implement backend authorization.

### C9 — Product acceptance

C9 is a human/product gate, not just an automation gate.

Required evidence:
- fresh desktop browser evidence;
- fresh phone browser evidence;
- inspection of entrance clarity, world entry, navigation, Settings discoverability, camera behavior, zoom baseline, and interaction density;
- explicit owner/source-of-truth acceptance.

Green CI or Playwright alone is insufficient.

### C10 — ProMax refinement

Only after C9 passes. ProMax should deepen the already-correct product shape rather than compensate for structural problems.

Targets:
- stronger entrance → world transition choreography;
- intentional motion language;
- ambient/environmental depth;
- lighting/material response;
- depth and spatial cues;
- meaningful micro-interactions;
- restrained effects;
- reduced-motion parity;
- phone/mobile refinement;
- transition continuity;
- visual hierarchy and focus;
- no return of scattered chrome.

C10 must be judged by product-level visual evidence, not code volume or effect count.

### C0–C10 execution rule

`USER DECISION → ORUCAVEAM → conflict detection → validation-change warning → cost/risk/output accounting → canonical contract → implementation → validation → evidence → merge → NEW CURRENT TRUTH → later supersession → ARCHIVE + REDIRECT`

The implementation must never be “made green” by weakening a validator. If the requirement changed, the validator changes to enforce the new truth with equal or stronger specificity.

### Historical implementation lineage

The following remain valuable and must not be mistaken for the current product-shape authority:

- Vision V0–V3.5 and related spatial slices;
- #258 / #259 residual work;
- CAM-R1–R3 subject-lock work;
- ENT-R4 entrance/machine proof;
- CHR-R3 settings/nav work;
- hierarchy animation ladder and prior camera experiments.

Their evidence remains recoverable through Git history and `docs/archive/superseded/` where applicable. Future changes must use the C0–C10 baseline unless the owner explicitly supersedes it.

## Security / future-development boundary

`docs/security_inquiry.md` is a future/pre-production inquiry register. Questions about abusive request volume, malicious uploads, crafted search input, forged privilege fields, authentication-code abuse, session compromise, or related deployment risks are not implementation drivers for the current experience program unless a later authorized product/security phase explicitly promotes them.

## Target-project handover rule
Every completed gate must surrender a target-project handover packet/ZIP in the same execution. The handover belongs to TeamAi; Universal ToolKit only provides reusable upstream process knowledge and does not own TeamAi project state.

## Current 029 product-design execution order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → applicable domain/spatial skills → implementation → verification → evidence → HandOver → Endorsement → PRODUCT-KNOWLEDGE.md → repeat`

## Product experience vision (intent pointer)

Canonical human-facing experience intent remains in `docs/VISION.md` for historical and detailed semantic context. The owner-endorsed C0–C10 rebaseline above is the current product-shape execution baseline. `VISION.md` does not create a new authority layer, does not claim 029 release, and does not authorize browser-side durable domain writes.

## Runtime delivery hardening — #275

`public/hero-flex.js` and the normal `scripts/apply-cam2-tree-follow-flex.mjs` path now use repository-owned Hero source as the ordinary runtime/build input. The browser must not depend on `raw.githubusercontent.com` for live product logic. The preserved internal patch engine remains historical implementation machinery with an emergency fallback slated for explicit cleanup after this hardening is independently verified.

This is a source-delivery/authority correction only. It does not alter Firebase identity, Firestore authority, scheduler authority, provider execution, entitlement, or Product Law.

<!-- teamai residual: #275 repository-owned Hero runtime delivery hardening; preserve full Masterplan body; no 029-released claim. -->

## Runtime delivery hardening synchronization — #275

Final implementation baseline: `f4547116c1df840ff56f40907e39b154765c535c`.

`public/hero-flex.js` is now the committed, repository-owned, fully assembled Hero runtime artifact. Local verification recorded a 47,925-byte artifact with no browser-side remote source loader, SP-04 integrity 11/11, valid JavaScript syntax, and `hero-flex-local-runtime.test.mjs` passing 1/1.

This index entry is a chronological synchronization record for the implementation commit. It does not claim 029 release, endorsement, backend authority, or production readiness. `governance-drift` remains fail-closed.

## C5/D + C6/E nav-wall dedup and zoom-out baseline — #281 (follow-up to #278)

`public/index.html`'s duplicate six-button camera wall (Wide/Team/Workspace/Map/Seat/Detail) has been removed from the DOM outright; `.world-navigation` is now the single coherent world nav (C5/D). `applyNavCamera()` in the Hero flex runtime now falls back to the `HERO_WIDE` world baseline once `navZoom` reaches `NAV_ZOOM_MAX`, instead of remaining pinned to whichever tree/seat close-up dock was open (C6/E). `window.TeamAiHero.getBaseCameraId()` exposes the resolved base camera for testing.

This closes the C5/D and C6/E implementation portions of #278's checklist pending CI and owner browser acceptance (the C9 gate). C7, F, and C9 remain open. No 029-released claim.

C6 browser proof must open a seat tree (`selectSeatShell` + `resetNav`) before asserting `getBaseCameraId()`: `setCamera('SEAT_CLOSE')` does not set `openParentId`, so the nav base stays `HERO_WIDE` until `applyNavCamera()` runs on an open tree. The fallback is thresholded on `navZoom >= NAV_ZOOM_MAX`, not unconditional. Positive wheel `deltaY` increases `navZoom` (zoom-out).

## #282 — C2 / Phase C first-paint governance synchronization

PR **#282** carries the owner-authorized first-paint reconciliation slice under #278 Phase C. The implementation hides the legacy `.hero-copy` brand in classic mode and hides the sibling `.far-environment` footer so the canonical classic entrance does not present duplicate logo/headline/footer chrome. The DOM/runtime surfaces remain available for world-mode behavior; this is presentation-only and is not a C5-style DOM removal.

The corresponding browser/unit coverage is scoped to the classic public entrance and verifies the hide contract, desktop/phone classic first paint, one visible classic brand image, and absence of the duplicate h1. This slice does not decide `/hero/` auto-world behavior, remove remaining world chrome, alter `TEAM_ORBIT`, implement continuous zoom/tree-to-tree travel, complete C8, or advance C9/C10.

This entry is the required Masterplan synchronization for the `public/` implementation change in PR #282. It records the current Phase C slice without converting CI status or documentation presence into a completion claim. The fail-closed `governance-drift` gate remains authoritative for merge readiness.

No 029-released claim.

---

## Current 029 tree-machine conceptual context

This section is **context, not a second Masterplan checklist**. It defines the product meaning and design constraints that the C0–C10 execution authority must preserve.

The current Seat hierarchy is a **partial working mechanism**. It is evidence that one semantic machine tree can operate, not evidence that the complete Hero tree system is complete.

The intended Hero contains multiple semantic tree families and may contain broad, asymmetric, and recursively nested branches. A `treeID` identifies the semantic tree. A `branchId` identifies a semantic branch by parentage and meaning. Coordinates, mesh positions, ring slots, or camera docks never define semantic identity.

A branch is a real product integration, not a decorative child mesh. Its intended meaning includes its purpose/responsibility, product/UI payload, feature/configuration/accessibility payload where applicable, expansion volume, adjacency clearance, connection/path ownership, camera relationship, responsive behavior, reduced-motion behavior, and evidence-backed state.

The machine is therefore designed from semantics outward:

```text
root truth
→ treeID / branchId
→ purpose / responsibility
→ UI / feature / configuration / accessibility payload
→ expansion requirements
→ connection topology
→ adaptive geometry
→ camera subject / travel
→ interaction
→ contribution visualization
```

The reverse direction is not a valid design method. Prototype coordinates must not be used to invent product meaning.

Different trees may require different branch counts, recursive depth, heights, widths, radii, spacing, density, angular spread, and expansion footprints. An expanding division must reserve space for its own payload, neighboring divisions, connection/wiring corridors, camera movement, workspace visibility, and responsive readability.

The maximum expanded Hero state is therefore derived from the combined footprint of the active participating divisions and their payloads, not from a universal global scale multiplier.

Expansion/closure is a stateful mechanical interaction. Conceptually:

`closed → preparing → opening → active/expanded → closing → closed`

Instant visibility toggles, teleports, or abrupt coordinate swaps are not the intended final language. Existing timing values remain living implementation measurements/starting points until browser evidence establishes better final motion behavior.

The final turn-loop is also a semantic machine behavior rather than an ornamental effect. During an active WebAi turn, participating tree/branch divisions are expected to become active/open so their connection points and wiring corridors are spatially available. Electricity then travels through the actual connection topology from the active tree/branch, through connected adjacent trees/branches, and inward to the center workspace.

This requirement is intentionally downstream of structural completion. The turn-loop must not simulate connectivity that the tree/branch graph does not actually contain.

Accordingly, the C0–C10 execution relationship is now understood as:

`C0–C5 product/surface foundations → C6–C7 camera/travel foundation → complete required tree/branch/division semantics + adaptive geometry + expansion/adjacency model → connection topology → turn-loop contribution layer → C8 authenticated workspace → C9 integrated product acceptance → C10 ProMax expression.`

The C0–C10 vocabulary remains unchanged for traceability. The additional structural requirements are a dependency clarification inside that existing execution authority, not a new phase system.

ProMax is deliberately downstream. It expresses an already-correct machine through refined machine-opening choreography, material/lighting depth, transition language, electrical visual language, atmospheric depth, responsive refinement, and micro-interactions. ProMax must never be used to hide incomplete trees, branches, geometry, topology, camera travel, or acceptance evidence.

The structured source for this evolving tree truth is the four-part tree census:

- `docs/TEAMAI_3D_HERO_TREE_CENSUS.csv`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.json`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.md`
- `docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml`

When tree/branch/division semantics or implementation change, the census is synchronized under the governance rules in `POLICY.md` and does not replace Masterplan, Product Law, or Vision. A code change without census reconciliation is not a trustworthy current state; a census update without implementation is explicitly a design/provisional state.


## Backend lease-preservation fix — #284/#287

`supabase/functions/teamai-task-execute/index.ts` previously rebuilt the leased task document from only the string-typed fields of the in-memory `current` object, discarding any non-string Firestore field types (numbers, booleans, maps, arrays) on every lease commit. The fix now spreads the complete raw `task.fields` Firestore typed-value map and overlays only the four lease-owned fields (`status`, `leaseId`, `leasedBy`, `updatedAt`). A regression test (`tests/backend-task-lease-preservation.test.mjs`) asserts the full-field-map pattern is present and the old filtered-rebuild pattern is gone. Scope: repository-level correctness fix only; does not change TEAM-BACKEND-001's endorsed/bounded classification.

<!-- teamai residual: #284/#287 backend lease-preservation fix; preserve full Masterplan body; no 029-released claim. -->
