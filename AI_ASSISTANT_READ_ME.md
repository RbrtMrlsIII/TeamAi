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

## Frozen Firebase project identity
**The authoritative TeamAi Firebase project is `team-ai-official`.** Never infer or substitute a Firebase project from product naming, screenshots, historical artifacts, remembered context, or a similarly named project. `homefinder-official` is a distinct, non-authoritative project for TeamAi.

All Firebase-dependent environments must reconcile to `team-ai-official`: Firebase Auth, Firestore `(default)`, Hosting, Web SDK `projectId`, Firebase CLI target, and the trusted Edge-runtime service-account `project_id`. The Web SDK config is public project-identification metadata; it is never an Admin credential. The Admin service-account JSON/private key must remain secret and must never be requested, pasted, committed, logged, or screenshotted.

If project identity is ambiguous or conflicting, **STOP** the affected deployment/verification. Identity reconciliation precedes runtime diagnosis. See `docs/backend/FIREBASE_PROJECT_IDENTITY.md`.

## TEAM-BACKEND-001 implemented foundation slice
The first executable backend foundation contracts are in `src/backend/`:
- `authority.ts` — canonical service ownership and authority assertions.
- `firestore-paths.ts` — Firebase UID → Workplace → Project → Team → Seat/Task/Event ownership paths.
- `skill-resolution.ts` — deterministic effective-skill composition. Skills never grant authorization.
- `task-state.ts` — durable task lifecycle transitions and durable-event field requirements.

Supporting Firebase configuration is wired through `firebase.json`, `firestore.rules`, and `firestore.indexes.json`. The rules are UID-scoped for the modeled domain paths, with an explicit deny-all fallback.

## Live Firebase / Edge baseline — 2026-09-03
The canonical Firebase project is `team-ai-official`; the `(default)` Firestore database exists; Email/Password and Google authentication providers are enabled; and the TeamAi Firestore Security Rules were deployed and visually verified in the Firebase console.

The trusted persistence function is deployed at the canonical Supabase project host using `teamai-domain-bootstrap`. Its current live authentication boundary verifies Firebase ID tokens for `team-ai-official` and derives the UID from the verified token. The current live deployment is version 6.

The canonical endpoint is:
`https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1/teamai-domain-bootstrap`

## Executable gate checkpoint — 2026-09-03
- **Gate 1:** invalid Firebase ID token → HTTP 401 `invalid_firebase_id_token` — PASS.
- **Gate 2:** missing Authorization header → HTTP 401 `missing_firebase_id_token` — PASS.
- **Gate 3:** valid Firebase ID token → trusted Firestore persistence — **BLOCKED**. The test-user token acquisition attempt returned `invalid login credentials`, so no valid ID token was available for the authenticated persistence probe.

Gate 3 has therefore not been claimed or completed. The backend source/deployment is not being altered merely to compensate for a test credential problem.

See `docs/backend/BACKEND_LIVE_SERVICE_STATUS.md` and `docs/CHECKPOINT_TEAM-BACKEND-001_GATE2_2026-09-03.md`.

## Remaining backend gates
Live authenticated Firestore document verification, repeat-call idempotency verification for the current deployment, emulator/rules verification, server-owned PayPal correlation, verified webhook handling, durable commerce events/entitlements, provider invocation, security/failure/recovery verification, final traceability, and endorsement remain open unless explicitly evidenced by a later checkpoint.

## Hard implementation rule
Implementation claims must trace:
`Product Law → Masterplan item → contract/skill → actual implementation → verification evidence → completion/endorsement`.
Documentation, deployment, green unit tests, or endorsement alone never proves implementation completion.

## Recovery rule
Never reconstruct current authority from chat history when the repository provides a canonical document. Read the authority chain first, then the active checkpoint and execution contract. Preserve historical gaps as gaps; do not manufacture evidence.
