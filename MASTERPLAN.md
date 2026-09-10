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
