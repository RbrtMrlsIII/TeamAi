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
- The spatial clock is independent: **Vision V3.5 complete** (entrance ladder V3.1–V3.5 merged). Next parallel work is **Conn-3 live deployment/browser proof** (not a Hero live bind), with no backend authority transferred into the Hero.

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

**Note:** The remainder of MASTERPLAN chronological detail, Gate 5B/5C evidence, Pre-029 Planning Architecture, and skill-routing tables remain authoritative on `main` history. This active-index update only advances the spatial frontier pointer for governance recovery. Agents must not treat omission of long static tables in a recovery pointer as deletion of prior endorsed backend scope.

See also:
- `docs/TEAMAI_029_CURRENT_STATE_MAP.md`
- `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`
- `docs/TEAMAI_CAMERA_CAM_V_LADDER_RECONCILIATION.md`
- `docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md` (Conn-3)
