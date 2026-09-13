# MASTERPLAN — TeamAi Execution Authority Pointer

`PRODUCT_LAW.md` is the product authority. The full chronological Masterplan is maintained in the synchronized project package while this repository surface carries the active gates needed for agent recovery and execution.

## Current execution wiring

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → ORUCAVEAM skills + field/domain skills + tool/system skills → verification → evidence → HandOver / Endorsement → PRODUCT-KNOWLEDGE.md`

Every executable checklist item must resolve to concrete skill path(s) in `docs/SKILL_WIRING.md` or explicitly state why no skill is required. `skills/README.md` is the skill-library README; it is not the canonical TeamAi wiring map.

## Current chronological gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Active state reconciliation — 2026-09-12

The backend clock has crossed the bounded TEAM-BACKEND-001 implementation/validation gate. Its remaining boundaries stay explicit. The spatial/product-experience clock is now governed by the owner-endorsed C0–C10 rebaseline described below.

- Firebase Rules emulator verification (Gate 4) remains **PARKED / NOT PROVEN** because a real emulator PASS is not present in repository evidence.
- `teamai-task-execute` remains runtime-proven only through its bounded authenticated path with `stub-edge-runtime`; real external provider invocation remains **OPEN / NOT PROVEN**.
- GitHub App installation is operator-confirmed; Conn-3 callback live deployment/browser proof remains **PENDING** and is not a Hero live bind.
- Seat connection/provider surfaces remain implementation/deployment surfaces rather than automatic product acceptance.
- PR #259 remains an important historical implementation baseline: CAM-R-RETIRE + ENT-T1/ENT-R2/R3 + CHR soft-hide. It is **not** the final product-shape authority after the owner-directed C0–C10 rebaseline.
- Historical checkpoints may retain earlier pending wording because they are evidence records. This active index is the current recovery map and must not rewrite historical evidence.

### Current connected Supabase deployment inventory — 2026-09-12

The connected TeamAi Supabase project (`srpgzzretfyqdsfclnuo`) currently reports exactly eight ACTIVE TeamAi Edge Functions. The precise inventory is frozen in `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md` and must remain synchronized with backend current-state records. The obsolete `paypal-webhook` deployment is absent from the connected runtime after operator deletion.

- `teamai-commerce-intent` v19
- `teamai-domain-bootstrap` v22
- `teamai-github-oauth-bind` v8
- `teamai-github-webhook` v7
- `teamai-paypal-webhook-v5c` v21
- `teamai-seat-connection-test` v7
- `teamai-seat-provider-bind` v7
- `teamai-task-execute` v12

This inventory is deployment evidence only. It does not upgrade source implementation into runtime proof, completion, endorsement, or release readiness.

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
The canonical `teamai-paypal-webhook-v5c` Edge Function contains the validated Gate-5C commerce implementation boundary. The bounded live PayPal Sandbox transaction/webhook path and subsequent Firestore aggregate/event/entitlement re-read are runtime-proven and endorsed for the recorded scope. Broader claims remain separately bounded: Gate 4 emulator execution is not evidenced, `teamai-task-execute` remains a stub provider runtime, real external provider invocation is not proven, Conn-3 browser/live deployment proof is pending, and 029 release remains gated by its own spatial/backend release criteria. Historical Gate-5C checkpoint wording remains historical evidence and is not rewritten here.

### Hard completion rule
An implementation claim is complete only when its governing Product Law and Masterplan item trace through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone do not establish implementation completion.

## Pre-029 / TEAM-EXPERIENCE-029

Owner-endorsed C0–C10 rebaseline with pre-C9 structural dependency on complete semantic tree/branch/division machine, adaptive geometry, continuous travel, connection topology, and turn-loop contribution. Issue #278 is the active 029 execution ledger. Command Deck is retired. Historical Vision baseline retained.

**Vision V3.5 complete** remains preserved as historical spatial frontier evidence (SP-07 COMPLETE). No 029-released claim.

Construction direction: `semantic identity → payload → division → expansion → topology → camera → interaction → electricity`.

## Phone-viewport overlay collision fix — #298 (follow-up to #278)

`.spatial-parts`/`.hero-inspection` and `.seat-stack` phone-width collision fixed by left/right docking at `<=520px` and hide at `<=360px`. CSS only. Pending owner browser confirmation; no 029-released claim.

## SEAT_CONNECTION vertical (presentation) — #306 / #278

First vertical deepen of `SEAT_CONNECTION` only: fixture payload (`CONNECTION_PAYLOAD_V1`), one parent-child fixture edge (`CONNECTION_EDGES_V1`: `SEAT_CONNECTION→SEAT_SHELL`), expanded helpers (`isConnectionExpanded`, `enrichHierarchySnapshot`) in `public/hero-connection-vertical.js`, and camera subject preference in `public/hero-cam2-tree-follow.js` (DETAIL when connection amount ≥ 0.85). Census status columns updated for fixture-edge / branch-subject-partial. Presentation only — not live bind, not electricity complete, not C9/C10. Hero-flex dataset/export wire-up may follow in a subsequent slice.

<!-- teamai residual: #306 SEAT_CONNECTION vertical presentation; no 029-released claim. -->
