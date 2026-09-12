# TeamAi — Durable Engineering Anchor

TeamAi is a human-controlled multi-AI discussion and execution orchestrator.

## Current execution order
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Current execution frontier
`TEAM-EXPERIENCE-029 — STRUCTURAL / PRESENTATION BASELINE`

**Backend state:** `TEAM-BACKEND-001 — ENDORSED / BOUNDED RECORDED SCOPE`.
Its remaining boundaries are explicitly recorded: Firebase emulator/rules execution is still parked/not proven in the available evidence; `teamai-task-execute` remains bounded to `stub-edge-runtime`; broader external provider invocation and broader scheduler/approval integration remain open. These residuals do not make the backend gate “in implementation.”

**029 boundary:** full TEAM-EXPERIENCE-029 release remains held until the independent release gates are evidenced and accepted. Current Hero work is presentation/experience work and must not write Firestore, invoke providers, charge PayPal, mutate entitlements, or move backend authority into the renderer.

Before implementation decisions, read `PRODUCT_LAW.md` → `MASTERPLAN.md` → `POLICY.md` → `docs/SKILL_WIRING.md` → applicable governance/contracts/skills. For current 029 structural truth also read the active #278 execution ledger and the synchronized 3D Hero tree census when present.

## Execution discipline
`ORUCAVEAM = Objective → Restrictions → User Authority → Canonical Authority → Action → Verification → Efficiency → Audit → Minimalistic Efficiency / Resource Use`

`ORUCAVEAM` is the single execution discipline. Each letter resolves to direct reusable skills, which are composed with field/domain skills according to the Masterplan item.

## Backend authority
- Firebase Auth: identity / Firebase UID ownership.
- Firestore `default`: TeamAi durable application/domain state.
- Supabase Edge Functions: trusted server runtime and PayPal webhook boundary.
- PayPal: external payment-event authority.
- GitHub: engineering/source authority.
- Firebase Hosting: current web delivery.
- Vercel: non-authoritative preview/browser-verification surface when connected. **Temporary cutoff (2026-09-04):** disconnected/rate-limited from the TeamAi GitHub repository — do not treat Vercel status as a merge blocker or delivery authority. Use GitHub Actions + Playwright while parked.
- Supabase Postgres: platform infrastructure only, never TeamAi domain state.

Live service status pointer: `backend/BACKEND_LIVE_SERVICE_STATUS.md` (canonical). Do not treat older copies under `docs/backend/` as current without checking the canonical file.

## 3D Hero truth
The current Seat hierarchy is a **partial working mechanism**, not the complete Hero machine. Future tree/branch/division work must derive semantic identity and purpose first, then payload, expansion space, connection topology, adaptive geometry, camera/travel, interaction, contribution routing, and verification. `treeID` / `branchId` are semantic identities; prototype coordinates are not universal geometry.

The synchronized tree census, when present, is maintained with every governed add/remove/rename/material restructuring/reimplementation of trees, branches, divisions, associated connection behavior, or semantic UI payload:

- `docs/TEAMAI_3D_HERO_TREE_CENSUS.csv`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.json`
- `docs/TEAMAI_3D_HERO_TREE_CENSUS.md`
- `docs/TEAMAI_3D_HERO_TREE_AUTHORITY.xml`

## Implementation completion
An implementation is complete only when Product Law → Masterplan → Policy/ORUCAVEAM → applicable skill(s) → actual implementation → verification evidence → completion/endorsement is traceable. Documentation or deployment alone does not establish completion.

## Team boundary
Development AI builds TeamAi. Web/Feature AI operates inside the product. Universal ToolKit is upstream-only for generalized validated lessons and never overrides TeamAi authority.

## Issue/comment boundary
The active Issue body is the durable issue-specific guide. New Issue comments are evidence records: diagnosis, real observed/retrieved data, warnings/discrepancies, and factual `EXECUTED` slice records only. Future-agent guidance, plans, checklists, and proof claims belong in the Issue body/canonical evidence system, not new comments. Historical comments remain immutable evidence.
