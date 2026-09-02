# TeamAi — AI Assistant Read Me

This is the operational recovery entry point for AI participants working on TeamAi.

## Authority order
1. `PRODUCT_LAW.md` — product authority.
2. `MASTERPLAN.md` — chronological execution authority.
3. `POLICY.md` — operating constraints.
4. `AI_ASSISTANT_READ_ME.md` — operational recovery and entry point.
5. Domain contracts under `docs/` and `docs/backend/`.
6. Skills, implementation, verification, evidence, endorsement, Product Knowledge, and continuity records.

## Current gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

**Current phase:** `TEAM-BACKEND-001 — IN IMPLEMENTATION`.

`TEAM-EXPERIENCE-029` remains HOLD until the backend foundation completion gate is fully evidenced.

## Canonical backend authority
- Firebase Auth = identity / Firebase UID ownership.
- Firestore `default` = TeamAi durable application/domain state.
- Supabase Edge Functions = trusted server execution and PayPal webhook receiver.
- PayPal = payment-provider event authority.
- GitHub = engineering/source authority.
- Firebase Hosting = current web delivery surface.
- Vercel = optional future browser/deployment surface, not backend authority.
- Supabase Postgres = platform infrastructure only, never TeamAi domain/application state.

## TEAM-BACKEND-001 implementation slice
The first executable backend foundation contracts are in `src/backend/`:
- `authority.ts` — canonical service ownership and authority assertions.
- `firestore-paths.ts` — Firebase UID → Workplace → Project → Team → Seat/Task/Event ownership paths.
- `skill-resolution.ts` — deterministic effective-skill composition. Skills never grant authorization.
- `task-state.ts` — durable task lifecycle transitions and durable-event field requirements.
- `tests/backend-foundation.test.mjs` — contract tests for the slice.

## Remaining backend gates
Live Firebase Auth/Firestore execution, Firestore rules/index deployment and validation, Workplace/seat persistence, server-owned PayPal correlation, verified webhook handling, durable commerce events/entitlements, trusted Edge runtime integration, provider invocation, security/failure/recovery verification, and final traceability/endorsement remain open.

## Hard implementation rule
Implementation claims must trace:
`Product Law → Masterplan item → contract/skill → actual implementation → verification evidence → completion/endorsement`.
Documentation, deployment, green unit tests, or endorsement alone never proves implementation completion.

## Recovery rule
Never reconstruct current authority from chat history when the repository provides a canonical document. Read the authority chain first, then the active checkpoint and execution contract. Preserve historical gaps as gaps; do not manufacture evidence.
