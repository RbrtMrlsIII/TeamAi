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

The Firebase persistence gate is now evidence-backed. `TEAM-EXPERIENCE-029` may advance in planning/reconciliation, but production frontend implementation remains gated by the remaining backend prerequisites listed below.

## Canonical backend authority
- Firebase Auth = identity / Firebase UID ownership.
- Firestore `(default)` = TeamAi durable application/domain state.
- Supabase Edge Functions = trusted server execution and PayPal webhook receiver.
- PayPal = external payment-provider event authority.
- GitHub = engineering/source authority.
- Firebase Hosting = current web delivery surface.
- Vercel = browser verification surface only; it is not a TeamAi hosting authority, backend authority, or deployment target.
- Supabase Postgres = platform infrastructure only, never TeamAi domain/application state.

### Canonical backend extension invariant
The canonical backend is a multi-authority system, not a single endpoint or single wire. Canonical Auth, canonical durable domain state, canonical trusted execution, canonical commerce, and canonical execution evidence each have explicit authorities and contracts.

Adding payment buttons, additional subscription products/plans, promotional variants, or new PayPal-facing commercial flows MUST extend the existing canonical commerce contracts rather than introduce a new ownership path. Adding another sign-in/authentication method MUST extend the canonical Firebase Auth identity boundary and continue to resolve to the same authoritative Firebase UID/domain ownership model. Such product/provider additions MUST NOT require replacing the Firestore ownership root, moving TeamAi domain state to another database, or granting authority to the browser.

A new provider, delivery surface, authentication method, payment product, or UI control is an extension of an existing authority boundary unless an explicit Product Law / architecture change replaces that boundary first.

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
- **Gate 2:** missing Authorization → HTTP 401 `missing_firebase_id_token` — PASS.
- **Gate 3B:** valid Firebase ID token → trusted Firestore persistence — PASS.
- **Gate 3C:** exact nested Firestore document independently read with actual stored values — PASS.
- **Gate 3D:** identical authenticated repeat call returned HTTP 200 with existing-value results — PASS.

### Current Firebase persistence evidence boundary
The executable slice is now evidenced as:

`Firebase ID token → verified Firebase UID → Firestore hierarchy → independent Firestore confirmation → repeat-call idempotency`

Detailed evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE3_2026-09-03.md` and `docs/backend/FIREBASE_EDGE_PERSISTENCE_IMPLEMENTATION_2026-09-03.md`.

## Remaining backend gates
The following remain open unless separately evidenced by a later checkpoint:
- local Firebase Emulator/rules execution;
- skill-wiring and project-type/field/task/provider/runtime resolution verification as applicable to the backend contract;
- server-owned PayPal correlation;
- verified PayPal webhook authenticity, idempotency, replay protection, and durable commerce events/entitlements;
- durable task/event/job runtime behavior and provider/runtime invocation;
- security, failure, timeout, cancellation, and recovery verification;
- final Product Law → Masterplan → contract/skill → implementation → evidence → endorsement reconciliation;
- TEAM-BACKEND-001 completion endorsement.

## 029 disposition
TEAM-EXPERIENCE-029 is no longer blocked by the Firebase persistence acquisition/verification blocker. It remains backend-gated by the explicit prerequisites above and must not be treated as production frontend implementation complete.

## Hard implementation rule
Implementation claims must trace:
`Product Law → Masterplan item → contract/skill → actual implementation → verification evidence → completion/endorsement`.
Documentation, deployment, green unit tests, or endorsement alone never proves implementation completion.

## Recovery rule
Never reconstruct current authority from chat history when the repository provides a canonical document. Read the authority chain first, then the active checkpoint and execution contract. Preserve historical gaps as gaps; do not manufacture evidence.
