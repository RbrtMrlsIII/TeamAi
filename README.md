# TeamAi — Durable Engineering Anchor

TeamAi is a human-controlled multi-AI discussion and execution orchestrator.

## Current execution order
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Current phase
`TEAM-BACKEND-001 — IN IMPLEMENTATION`

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
- Vercel: controlled web development, preview, and browser-verification surface; not TeamAi hosting, backend, production-delivery, or architecture authority.
- Supabase Postgres: platform infrastructure only, never TeamAi domain state.

## Implementation completion
An implementation is complete only when Product Law → Masterplan → Policy/ORUCAVEAM → applicable skill(s) → actual implementation → verification evidence → completion/endorsement is traceable. Documentation or deployment alone does not establish completion.

## Team boundary
Development AI builds TeamAi. Web/Feature AI operates inside the product. Universal ToolKit is upstream-only for generalized validated lessons and never overrides TeamAi authority.
