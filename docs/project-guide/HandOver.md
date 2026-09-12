# TeamAi Project Guide — HandOver

**Status:** CANONICAL PROCEDURE / BASELINE

The handover is the durable continuation boundary between one execution and the next. It belongs to the TeamAi target project and carries both state and accepted learning.

## 0. Current recovery anchor — 2026-09-12

The current backend live infrastructure inventory is the eight-function Supabase census in `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md`. The connected project currently reports exactly eight ACTIVE TeamAi Edge Functions after operator removal of the obsolete `paypal-webhook` deployment. `backend/BACKEND_LIVE_SERVICE_STATUS.md` remains the canonical claim-level backend status/evidence ledger, while `docs/TEAMAI_BACKEND_LIVE_REALITY_LEDGER.md` preserves connected/operator context.

Historical handover sections below retain their original context and evidence. They do not override the current authority chain or current live inventory. When an older handover says a gate is still pending, read that statement as a historical snapshot unless a newer current-state record confirms it remains open.

## 1. Handover must answer five things

### What is authoritative now?

Identify the current Product Law, Masterplan state, active phase, Policy/ORUCAVEAM discipline, applicable ORUCAVEAM letter skills, field/domain skills, domain contracts, and authoritative service roots.

### What was actually changed?

List the source/document paths changed in the canonical tree. Distinguish changed code from documentation, skill, and governance changes. Identify the governing Masterplan checklist and skill paths where applicable.

### What was actually proven?

Name the verification evidence, environment, test scope, and limitations. Never infer live/hosted proof from source presence or deployment presence alone.

### What was learned or taught?

Record any evidence-backed improvement, correction, safer procedure, efficiency improvement, or newly clarified rule discovered by the AI Development Team. Identify the affected ORUCAVEAM letter skill, field/domain skill, operational memory, or Product Knowledge entry and whether the lesson is merely observed, accepted for TeamAi, or proposed for ToolKit generalization.

### What remains open and what is next?

Record unresolved questions, parked gates, environment limitations, provider requirements, approval needs, known contradictions, missing skill wiring, and the next authorized command.

## 2. Required handover chain

`current state → authority map → Masterplan item → ORUCAVEAM/skill routing → changes → evidence → learning → limitations → unresolved questions → next authorized command`

## 3. Planning Team handover

A Planning Team handover should include:

- original user objective;
- current user instruction;
- accumulated meaningful discussion;
- accepted decisions;
- alternatives/pros/cons and disagreements;
- unresolved questions;
- important artifacts/findings/events;
- selected summarizer result;
- user review status;
- proposed implementation/document targets;
- applicable Product Law concepts and prospective Masterplan/skill routing.

The handover must preserve user intent. The latest AI contribution is not allowed to replace the accumulated discussion or the user's authority.

## 4. Working Team handover

A Working Team handover should include:

- approved plan/handoff ID or reference;
- task/dependency state;
- Scheduler decision context;
- AI Seat/connection/capability used;
- applicable ORUCAVEAM letter skills and field/domain skills;
- tool/plugin/MCP action records;
- approvals and authorization state;
- durable results/events/artifacts;
- failures, retries, cancellation, or recovery state;
- verification evidence;
- next eligible work.

## 5. Learning / teach-back handover

When an agent teaches or discovers a better procedure:

`discovery → evidence → scope → affected ORUCAVEAM/field skill or document → endorsement state → next-use instruction`

Do not convert a single successful trick into a generalized rule without validation. TeamAi-specific lessons remain TeamAi knowledge unless later generalized and accepted upstream.

When the learning changes a reusable procedure, update the affected skill rather than burying the procedure in a broad canonical document. When it is practical recovery/agent memory, update `AI_ASSISTANT_READ_ME.md`. When it is an evidence-backed durable lesson, update `PRODUCT-KNOWLEDGE.md` after validation.

## 6. External AI and tool handover

Where AI applications or MCP/tool systems are configured outside TeamAi, record the external dependency and the TeamAi activation boundary separately.

Never hand over an assumption such as “connected” when only a stored connection record exists. Preserve capability-test results, provider compatibility, scope, entitlement, authorization, and health state.

Where tools were used, preserve the relevant M/minimalistic-resource-use decision when it materially explains why operations were limited, reused, or intentionally repeated.

## 7. Full Project ZIP handover gate

A declared **project handover** is incomplete without its required Full Project ZIP when the handover scope calls for the full project state.

The required full-project handover package MUST be produced from a pinned GitHub canonical commit/tree and verified before delivery:

`GitHub pinned tree → deterministic flattened Full Project ZIP → extraction → path equality → byte-for-byte file verification → supported user delivery`

The ZIP must contain the canonical tracked project tree at its pinned revision, with extracted paths exactly matching the tracked paths and extracted file bytes matching the pinned repository bytes. Archive-container metadata/compression bytes may differ; the project files may not.

The delivery record must identify the pinned commit SHA, package filename, package verification result, and the supported delivery target/reference. A handover claiming a full project package without a corresponding verified deliverable MUST fail the handover gate.

This rule applies to the **handover event**, not to every ordinary implementation run. CI may produce a verified ZIP as a derived artifact for engineering evidence; that artifact does not itself mean a user handover occurred.

Generated/runtime artifacts are never restored into the handover package. Screenshots, browser captures, visual-evidence images, temporary diagrams, preview output, build output, dependency trees, coverage/test output, logs, caches, emulator state, editor state, deployment caches, and local secrets are excluded or, when tracked in violation of policy, block packaging until reconciled.

## 8. ZIP/package verification rule

A full-project handover package is current only when it matches the pinned canonical repository tree by paths and file bytes/hashes.

Use the project-package skill and policy:

- `skills/packaging/project-package/SKILL.md`
- `docs/PROJECT_ZIP_AND_ARTIFACT_POLICY.md`

The ZIP remains a derived handover artifact and never becomes a second source authority.

## 9. ToolKit boundary

TeamAi owns TeamAi handover. ToolKit may receive a generalized lesson only after the consuming-project evidence establishes that the lesson generalizes. Team-specific provider choices, pricing, exact model catalogs, or implementation assumptions must not be promoted upstream merely because they appear in a handover.

## 10. Historical 2026-09-06 Commerce / Backend Continuation Record

**Historical snapshot — not current state.**

**Scope:** TEAM-BACKEND-001 bounded commerce/PayPal correction and preparation for the next frontend implementation gate.

**Authority chain at the time:** `PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/execution/orucaveam/* + skills/backend/commerce-paypal/SKILL.md + skills/backend/verification-recovery/SKILL.md → implementation → verification/evidence`.

**Canonical commerce model:**

`accounts/{uid}/commerce/{correlationId}`

with:

`events/{providerEventId}`

`entitlements/{entitlementId}`

and server-only lookup:

`commerceCorrelationIndex/{correlationId}`.

**Proven runtime evidence:** a real PayPal Sandbox `PAYMENT.CAPTURE.COMPLETED` event was correlated to the TeamAi commerce `correlationId`, captured successfully, delivered to the isolated `teamai-paypal-webhook-v5c`, and redelivered to **ACTIVE v13** with PayPal-originated `POST` and HTTP `200`.

**Learned defect:** the original v12 path persisted the event and activated the entitlement while leaving the parent commerce aggregate at `pending`. The v13 correction synchronizes the aggregate to `completed` for mapped successful payment events and performs that patch before the duplicate-event return so redelivery can repair stale aggregate state without creating a second event.

**Historical open proof gate:** directly re-read Firestore after the v13 redelivery and prove `aggregate.status=completed`, the provider event remains singular, and the entitlement is `active` with `sourceCommerceEventId` equal to the provider event ID. This statement belongs to the historical snapshot and is superseded by the later 2026-09-07 bounded endorsement evidence.

**Historical frontend continuation:** after the backend proof gate, proceed with the canonical commerce UI contract. The frontend consumes aggregate status as primary commerce state, event records as history/evidence, and entitlement as access projection. It must not call PayPal directly for authority, self-attest payment success, or write commerce state directly to Firestore.

**Learning status:** TeamAi-scoped, evidence-backed. Not a Product Law amendment. Generalization to ToolKit remains undecided.

## 11. Historical 2026-09-09 Slice K / Grok alignment continuation

**Historical snapshot — not current state.**

**Scope:** TEAM-EXPERIENCE-029 presentation continuity (Slice K) plus Grok Skills alignment. Not a commerce completion claim.

**Authoritative at the time:** `PRODUCT_LAW.md` → `MASTERPLAN.md` (the backend and 029 statuses below were the historical state at that time) → `POLICY.md` / ORUCAVEAM → `docs/SKILL_WIRING.md` §8b/§13 → `docs/GROK_SKILLS_ALIGNMENT.md` → `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`.

**Changed:** living NEXT_SLICES (N.1–N.3 merged; K this slice); Grok alignment map; SKILL_WIRING pointer; user-manual remainder flagged on existing `backend/BACKEND_LIVE_SERVICE_STATUS.md`; stale PR #162 closed as superseded.

**Proven:** docs-only. CI green on this PR was necessary, not Endorsement.

**Learned:** A Grok App Builder host will try to apply Better Auth / Neon / TanStack / game skills unless explicitly forbidden. Alignment belongs in a bounded map, not a second Product Law. Stale NEXT_SLICES PRs that lag merged N-slices must be closed, not merged.

**Historical open items:** live PayPal Firestore re-read (commerce COMPLETED); Firebase emulator (item 7); owner endorsement for #88/#89; Slice L issue comments; remaining skill bodies N.4/N.5.

**Historical next command:** Slice **L** — satisfied-by comments on Issues #96, #97, #98. Then N.4 `ws.authority.map` + `ws.evidence.handover`.

## SEE ALSO

- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `docs/project-guide/Endorsement.md`
- `skills/governance/learning-handover/SKILL.md`
- `skills/packaging/project-package/SKILL.md`
- `skills/execution/orucaveam/SKILL.md`
- `skills/backend/commerce-paypal/SKILL.md`
