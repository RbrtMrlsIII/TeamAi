# TeamAi Backend-First Rebaseline Guard

**Status:** CANONICAL HANDOFF GUARD — planning/architecture only; backend implementation is not claimed complete.

## Current phase order

`TEAM-EXPERIENCE-028` → `TEAM-BACKEND-001` → `TEAM-EXPERIENCE-029`

TEAM-EXPERIENCE-028 remains the frontend implementation-blueprint checkpoint. TEAM-BACKEND-001 is the required backend foundation bridge. TEAM-EXPERIENCE-029 remains on implementation hold until the backend foundation gate passes.

Do not interpret guides, deployed bootstrap infrastructure, tests, or a green CI run as proof of end-to-end backend implementation.

## Authority boundary

- Firebase Auth = identity authority.
- Firestore `default` = TeamAi durable domain/application authority.
- PayPal = payment-provider authority for payment events.
- Supabase Edge Functions = trusted server execution and webhook boundary.
- GitHub = engineering source/review surface.
- Vercel = future optional browser/deployment surface; not current TeamAi backend authority.
- Supabase Postgres = platform infrastructure only, not TeamAi domain state.
- Retired relational backend implementation = scheduled for active-tree and Git-history purge; it is not a supported recovery implementation path.
- Frontend/cache/visual state never becomes payment, entitlement, permission, compliance, or system-of-record truth.

## PayPal authority rule

`PayPal event → Supabase Edge Function → authenticity verification + idempotency/replay control → server-owned Firebase UID correlation → Firestore commerce state/entitlement`

The browser never self-attests payment success and a browser-supplied Firebase UID is never accepted as payment-ownership proof.

Current commercial hypothesis: first qualifying subscription month paid; months 2–3 free; one promotional grant per Firebase UID; succeeding months bill normally. Exact PayPal Product/Plan/Button construction remains downstream of the frontend experience and commercial validation.

## Two-team boundary

Development AI builds TeamAi through the engineering workflow. Web/Feature AI operates inside the product and uses user-facing Web AI skills. Skills instruct how work is performed; permissions and backend policy authorize what may be done. A frontend assignment resolves the applicable frontend skill bundle; a backend assignment resolves the applicable backend bundle.

## ToolKit boundary

TeamAi is a consuming project. Only validated and generalized TeamAi lessons may move upstream into the Universal AGENT ToolKit. Toolkit knowledge never flows downstream automatically into TeamAi.

## Continuity rule

This guard is intentionally redundant with the detailed contracts because its purpose is session-boundary survival. Future agents must read it before changing 029 or changing backend architecture.
