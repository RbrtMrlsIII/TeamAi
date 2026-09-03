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
- Firebase Hosting is the current TeamAi web hosting/delivery authority.
- Vercel is a browser-verification surface only; it is not TeamAi hosting authority, backend authority, or production deployment authority.
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

## LAW 105 — FIREBASE PROJECT IDENTITY IS AN ARCHITECTURE INVARIANT
The authoritative TeamAi Firebase project is `team-ai-official`. Firebase project identity MUST be explicit and MUST NOT be inferred from repository/product names, screenshots, historical artifacts, remembered context, or similarly named projects. `homefinder-official` and other Firebase projects are distinct and non-authoritative unless a future architecture change explicitly replaces the current project and updates the canonical identity contract first.

All Firebase-dependent surfaces MUST reconcile to the same authoritative project: Firebase Auth, Firestore `(default)`, Hosting, Web SDK `projectId`, CLI target, and trusted Edge-runtime service-account `project_id`. If these identities conflict, the affected deployment or verification MUST STOP until reconciliation is complete. A public Web SDK configuration may identify a project but MUST NOT be treated as a privileged credential. Admin/service-account credentials MUST remain secret.

Project identity reconciliation MUST precede Firebase runtime diagnosis. Historical project evidence may establish provenance but MUST NOT override current authoritative configuration.

## CANONICAL BACKEND EXTENSION INVARIANT
The canonical backend is a multi-authority system, not a single endpoint or wire. Canonical Auth, canonical durable domain state, canonical trusted execution, canonical commerce, and canonical execution evidence are distinct responsibilities with explicit authorities and contracts.

Adding payment buttons, subscription products/plans, promotional variants, or additional PayPal-facing commercial flows MUST extend the existing canonical commerce contracts and preserve the same server-owned correlation to the authenticated Firebase UID. Adding another sign-in/authentication method MUST extend the canonical Firebase Auth identity boundary and preserve the same authoritative Firebase UID/domain ownership model.

Such extensions MUST NOT require moving TeamAi domain state to another database, replacing the Firebase UID ownership root, allowing the browser to self-attest payment or entitlement state, or creating a parallel authority path. A new provider, authentication method, payment product, delivery/verification surface, or UI control is an extension of an existing authority boundary unless an explicit Product Law / architecture change replaces that boundary first.

## Phase 0 disposition
Phase 0 is the clean development-entry gate. It verifies the active repository baseline, retired-backend removal from supported paths, service authority boundaries, team/toolkit boundaries, and synchronization of the current execution gate before TEAM-BACKEND-001 implementation.

## TEAM-BACKEND-001 implementation disposition
The first executable foundation contracts are implemented and recorded: service authority assertions, UID-rooted Firestore path construction, deterministic effective-skill resolution, durable task transitions, and durable event identity requirements.

### Live Firebase milestone — 2026-09-03
The authoritative Firebase project `team-ai-official` is live and its `(default)` Firestore database is reachable. The `teamai-domain-bootstrap` trusted persistence slice has now passed its executable Firebase persistence gate:

`Firebase ID token → verified Firebase UID → Firestore hierarchy → independent Firestore confirmation → repeat-call idempotency`

Evidence includes:
- invalid Firebase ID token rejected with HTTP 401;
- missing Firebase Authorization rejected with HTTP 401;
- valid authenticated bootstrap persisted the gate-3 test hierarchy with HTTP 200;
- the exact nested Firestore seat document was independently read and returned actual stored values;
- an identical authenticated repeat request returned HTTP 200 with existing-value results.

Detailed evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE3_2026-09-03.md` and `docs/backend/FIREBASE_EDGE_PERSISTENCE_IMPLEMENTATION_2026-09-03.md`.

This milestone is **evidence-backed progress, not TEAM-BACKEND-001 completion**. Local emulator/rules execution, skill-wiring verification, PayPal correlation/webhook/entitlements, durable task/event/runtime behavior, provider invocation, complete security/failure/recovery verification, final traceability reconciliation, and completion endorsement remain open.

TEAM-EXPERIENCE-029 may now advance from the Firebase persistence foundation, but its production frontend implementation gate remains closed until the remaining explicit backend prerequisites are evidenced.

A `Posts` test composite index was observed as a live-project test artifact and is not automatically adopted as a TeamAi canonical index requirement.

See `docs/backend/FIREBASE_PROJECT_IDENTITY.md`, `docs/backend/FIREBASE_LIVE_BASELINE_2026-09-03.md`, `docs/backend/FIREBASE_EDGE_PERSISTENCE_IMPLEMENTATION_2026-09-03.md`, and `MASTERPLAN.md` for the current execution matrix.

## Canonical note
The complete Product Law remains in the synchronized project package and is not intentionally duplicated here during this reconciliation window. This front door MUST remain synchronized with any active authority changes.
