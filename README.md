# TeamAi — Durable Engineering Anchor

TeamAi is a human-controlled multi-AI discussion and execution orchestrator.

## Current execution order
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Current phase
`TEAM-BACKEND-001 — IN IMPLEMENTATION`

Read `PRODUCT_LAW.md` → `MASTERPLAN.md` → `AI_ASSISTANT_READ_ME.md` before making implementation decisions.

## Backend authority
- Firebase Auth: identity / Firebase UID ownership.
- Firestore `default`: TeamAi durable application/domain state.
- Supabase Edge Functions: trusted server runtime and PayPal webhook boundary.
- PayPal: external payment-event authority.
- GitHub: engineering/source authority.
- Firebase Hosting: current web delivery.
- Vercel: optional future browser/deployment surface.
- Supabase Postgres: platform infrastructure only, never TeamAi domain state.

## Implementation completion
An implementation is complete only when Product Law → Masterplan → contract/skill → actual implementation → verification evidence → completion/endorsement is traceable. Documentation or deployment alone does not establish completion.

## Team boundary
Development AI builds TeamAi. Web/Feature AI operates inside the product. Universal ToolKit is upstream-only for generalized validated lessons and never overrides TeamAi authority.
