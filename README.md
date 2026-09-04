# TeamAi — Durable Engineering Anchor

TeamAi is a human-controlled multi-AI discussion and execution orchestrator.

## Current execution order
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Current phase
`TEAM-BACKEND-001 — IN IMPLEMENTATION`

**029 boundary:** Masterplan item 17 holds full TEAM-EXPERIENCE-029 product-experience release until `BLOCKS_029` gates are evidenced. **Presentation foundation** (single theme-root, F0–F7 mapping, freeze/reconciliation docs) may proceed as non-domain UI work and must not write Firestore, invoke providers, charge PayPal, or alter entitlements.

Read `PRODUCT_LAW.md` → `MASTERPLAN.md` → `POLICY.md` → `docs/SKILL_WIRING.md` → applicable skills before making implementation decisions.

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

## Implementation completion
An implementation is complete only when Product Law → Masterplan → Policy/ORUCAVEAM → applicable skill(s) → actual implementation → verification evidence → completion/endorsement is traceable. Documentation or deployment alone does not establish completion.

## Team boundary
Development AI builds TeamAi. Web/Feature AI operates inside the product. Universal ToolKit is upstream-only for generalized validated lessons and never overrides TeamAi authority.
