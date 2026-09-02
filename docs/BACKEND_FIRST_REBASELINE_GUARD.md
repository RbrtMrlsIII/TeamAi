# TeamAi Backend-First Rebaseline Guard

**Status:** CANONICAL HANDOFF GUARD — planning/architecture only; backend implementation is not claimed complete.

## Why this exists

This guard exists so a future Development AI or Web/Feature AI cannot lose the current decision context when a long conversation ends.

## Current position

`TEAM-EXPERIENCE-028` remains the frontend implementation-blueprint checkpoint.
`TEAM-BACKEND-001` is the newly inserted backend-foundation bridge.
`TEAM-EXPERIENCE-029` remains locked for production frontend implementation until the backend foundation gate passes.

Do not interpret the presence of backend guides, deployed bootstrap infrastructure, or tests as proof that the backend foundation is implemented end-to-end.

## Authority boundary

- Firebase Auth = identity authority.
- Firestore `default` = TeamAi durable domain/application authority.
- PayPal = payment-provider authority for payment events.
- Supabase Edge Functions = trusted server execution boundary.
- GitHub = engineering source/review surface.
- Vercel = future optional browser/deployment surface; not current TeamAi backend authority.
- Supabase Postgres = not a TeamAi domain store.
- PostgreSQL/WoWSQL = retired technology scheduled for deletion and Git-history purge; it is not a supported recovery implementation path.

## PayPal rule

The browser never decides payment truth. The intended flow is PayPal event → Supabase Edge Function → verification/idempotency → server-owned Firebase UID correlation → Firestore commerce state/entitlement. Never trust a browser-supplied Firebase UID as payment ownership proof.

Current commercial hypothesis: first qualifying subscription month paid; months 2–3 free; one promotional grant per Firebase UID; following months bill normally. Exact PayPal product/plan/button construction remains a later commercial/UI decision.

## Two-team boundary

Development AI builds TeamAi through the engineering workflow. Web/Feature AI operates inside the product and uses the user-facing Web AI skill system. Skills instruct; permissions and backend policy authorize. A frontend assignment must resolve the applicable frontend skill bundle; a backend assignment must resolve the applicable backend bundle.

## Knowledge boundary

TeamAi findings become ToolKit knowledge only after validation and generalization. ToolKit knowledge flows upstream only. ToolKit never pushes project-specific assumptions downstream into TeamAi.

## Required next action

Work from the backend-first rebaseline package and its document wiring before changing 029. Preserve the package and this guard as the durable handoff until the next endorsed checkpoint replaces it.
