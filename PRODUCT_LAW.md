# PRODUCT LAW — TeamAi Canonical Front Door

`PRODUCT_LAW.md` is the product authority and MUST NOT be overridden by implementation, UI, deployment, provider, or tool conventions. The synchronized project package contains the complete Product Law text during this reconciliation window; this repository file is the engineering-visible authority front door for agent recovery.

## Current execution authority
The current sequence is:

`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

**Current phase:** `TEAM-BACKEND-001 — IN IMPLEMENTATION`.

## Core authority invariants
- Human user authority remains above AI authority.
- Firebase Auth owns identity and Firebase UID ownership.
- Firestore `default` owns TeamAi durable domain/application state.
- Supabase Edge Functions own trusted server execution and PayPal webhook receipt.
- PayPal is the external payment-event authority.
- GitHub is the engineering/source authority.
- Vercel is optional future browser/deployment infrastructure, not current TeamAi backend authority.
- Supabase Postgres is platform infrastructure only and is not the TeamAi domain/application database.
- Retired PostgreSQL implementation is historical-only and must not remain an active/recoverable TeamAi backend path.
- Web AI and Development AI are separate operational domains.
- Universal ToolKit is upstream-only: validated/generalized TeamAi lessons may flow upstream; ToolKit does not become TeamAi authority.

## LAW 101 — IMPLEMENTATION TRACEABILITY IS A HARD COMPLETION GATE
Every implementation claim MUST be traceable from its governing Product Law and Masterplan execution item through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone MUST NOT be treated as implementation completion. A missing traceability link blocks the affected completion claim until an explicit, evidence-backed exception is recorded by the authorized human.

## LAW 102 — SERVICE AUTHORITY MUST BE EXECUTABLE
The canonical service-authority map is not merely documentation. Backend code MUST reject authority mismatches so that identity, application state, execution, payment, engineering, and delivery responsibilities cannot silently migrate between services.

## LAW 103 — DURABLE STATE PRECEDES TRUSTED EXECUTION
A task or external event MUST have a durable identity, ownership context, lifecycle/idempotency identity, and evidence model before trusted execution or commerce mutation is considered complete. In-memory success is not durable completion.

## LAW 104 — FIREBASE UID IS THE DOMAIN OWNERSHIP ROOT
TeamAi application/domain paths MUST be rooted in the authenticated Firebase UID. Client-provided identifiers MUST NOT be treated as proof of ownership. Server-side correlation is required wherever an external provider, including PayPal, establishes an event or entitlement.

## Phase 0 disposition
Phase 0 is the clean development-entry gate. It verifies the active repository baseline, retired-backend removal from supported paths, service authority boundaries, team/toolkit boundaries, and synchronization of the current execution gate before TEAM-BACKEND-001 implementation.

## TEAM-BACKEND-001 implementation disposition
The first executable foundation contracts are implemented and recorded: service authority assertions, UID-rooted Firestore path construction, deterministic effective-skill resolution, durable task transitions, and durable event identity requirements.

### Live Firebase milestone — 2026-09-03
The recreated Firebase project `team-ai-official` is reachable through the authenticated CLI, its `(default)` Firestore database exists, Email/Password and Google authentication providers are enabled, and the TeamAi Firestore Security Rules have been deployed and visually verified in the Firebase console.

This milestone is **deployment evidence, not backend completion**. Emulator/rules execution, application-level Auth integration, domain persistence, trusted runtime, PayPal correlation/webhook/entitlements, provider invocation, E2E security/recovery verification, and final traceability/endorsement remain open.

A `Posts` test composite index was observed as a live-project test artifact and was still building at capture time. It is not automatically adopted as a TeamAi canonical index requirement.

See `docs/backend/FIREBASE_LIVE_BASELINE_2026-09-03.md` and `MASTERPLAN.md` for the current execution matrix.

## Canonical note
The complete Product Law remains in the synchronized project package and is not intentionally duplicated here during this reconciliation window. This front door MUST remain synchronized with any active authority changes.
