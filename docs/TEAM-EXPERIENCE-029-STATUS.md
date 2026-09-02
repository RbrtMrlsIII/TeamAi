# TEAM-EXPERIENCE-029 Status

## Current gate

TEAM-EXPERIENCE-029 remains the production frontend implementation phase following the 014–028 experience/design checkpoints. It is **PLANNING / IMPLEMENTATION HOLD**.

## Required predecessor

The canonical sequence is:

`TEAM-EXPERIENCE-028 → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

TEAM-BACKEND-001 is the required backend foundation bridge. Its implementation must be evidenced before 029 production frontend implementation begins.

## Backend authority

- Firebase Auth = identity authority.
- Firestore `default` = TeamAi durable domain/application authority.
- Supabase Edge Functions = trusted server runtime and webhook receiver.
- PayPal = payment-provider authority.
- GitHub = engineering source/review surface.
- Vercel = future optional browser/deployment surface.
- Supabase Postgres = platform infrastructure only, not TeamAi domain state.

## Commerce authority

The browser never decides payment truth. Canonical flow:

`PayPal event → Supabase Edge Function → authenticity + idempotency/replay control → server-owned Firebase UID correlation → Firestore commerce state/entitlement`

The one-time introductory commercial hypothesis is: first qualifying subscription month paid; months 2–3 free; one promotional grant per Firebase UID; succeeding months bill normally. Exact Product/Plan/Button construction remains downstream of frontend/commercial validation.

## Retired backend disposition

The retired backend implementation is removed from the active application path and is not a supported recovery implementation. Final Git-history purge is a separate destructive gate after the clean replacement baseline is independently preserved and verified.

## Two-team boundary

Development AI builds TeamAi through GitHub and the engineering workflow. Web/Feature AI operates inside the product using user-facing skills. Skills instruct; permissions and backend policy authorize. A frontend seat resolves the applicable frontend field/domain skill bundle; a backend seat resolves the applicable backend bundle.

## ToolKit boundary

TeamAi-specific findings remain TeamAi-owned. Only validated, generalized lessons may move upstream into the Universal AGENT ToolKit. ToolKit changes do not automatically flow downstream.

## Completion rule

Documentation, planning, deployed bootstrap infrastructure, and isolated tests are not sufficient to claim end-to-end completion. 029 remains blocked until TEAM-BACKEND-001 closes its executable identity, Firestore, workplace/seat, skill-wiring, commerce, task/event/runtime, security, recovery, and verification gates.
