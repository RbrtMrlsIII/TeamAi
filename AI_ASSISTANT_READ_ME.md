# TeamAi — AI Assistant Read Me

This is the operational recovery entry point for AI participants working on TeamAi.

## Authority order
1. `PRODUCT_LAW.md` — product authority.
2. `MASTERPLAN.md` — chronological execution authority.
3. `POLICY.md` — operating constraints.
4. `AI_ASSISTANT_READ_ME.md` — operational recovery and entry point.
5. Domain contracts under `docs/` and `docs/backend/`.
6. Skills, implementation, verification, evidence, endorsement, Product Knowledge, and continuity records.

## Backend-first execution rule
Before implementation begins, the target project's backend authority must be clarified and reconciled with Product Law. ToolKit provides process/knowledge upstream only; it does not define or replace TeamAi backend authority.

## Gate handover rule
A completed TeamAi gate is not surrendered until the target project produces its handover packet/ZIP in the same execution. The packet belongs to TeamAi. ToolKit is never the owner or handover surface for TeamAi.

## Current gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

**Current phase:** `TEAM-BACKEND-001 — IN IMPLEMENTATION`.

The Firebase persistence gate is evidence-backed. `TEAM-EXPERIENCE-029` remains backend-gated.

## Canonical backend authority
- Firebase Auth = identity / Firebase UID ownership.
- Firestore `(default)` = TeamAi durable application/domain state.
- Supabase Edge Functions = trusted server execution and PayPal webhook receiver.
- PayPal = external payment-provider event authority.
- GitHub = engineering/source authority.
- Firebase Hosting = current web delivery surface.
- Vercel = browser verification surface only; it is not a TeamAi hosting authority, backend authority, or deployment target.
- Supabase Postgres = platform infrastructure only, never TeamAi domain/application state.

## Frozen Firebase project identity
**The authoritative TeamAi Firebase project is `team-ai-official`.** Never infer or substitute a Firebase project from product naming, screenshots, historical artifacts, remembered context, or a similarly named project. If project identity is ambiguous or conflicting, STOP the affected deployment/verification.

## Current evidence
- Gate 3B/3C/3D: Firebase UID-derived persistence, independent Firestore confirmation, and repeat-call idempotency are evidenced.
- Gate 5B: server-owned PayPal correlation contract is implemented in `src/backend/commerce.ts`; project-wide validation remains pending.
- Gate 5C: verified PayPal webhook authenticity, replay protection, durable commerce events and entitlement projection remain open.

Detailed Gate-5B evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE5B_2026-09-03.md`.

## Hard implementation rule
Implementation claims must trace:
`Product Law → Masterplan item → contract/skill → actual implementation → verification evidence → completion/endorsement`.

Documentation, deployment, green unit tests, or endorsement alone never proves implementation completion.

## Recovery rule
Never reconstruct current authority from chat history when the repository provides a canonical document. Read the authority chain first, then the active checkpoint and execution contract. Preserve historical gaps as gaps; do not manufacture evidence.
