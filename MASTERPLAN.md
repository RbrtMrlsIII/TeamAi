# MASTERPLAN — TeamAi Execution Authority Pointer

`PRODUCT_LAW.md` is the product authority. The full chronological Masterplan is maintained in the synchronized project package while this repository surface carries the active gates needed for agent recovery and execution.

## Current chronological gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Phase 0 — Clean Baseline / Development Entry Gate

Phase 0 is the final pre-development baseline gate. Git history may retain retired implementation residue as historical record; the active project tree MUST NOT expose or support that retired path.

### Chronological checklist
1. [x] Repository write authority confirmed for the canonical TeamAi GitHub repository.
2. [x] `main` confirmed as the active cleaned backend-first rebaseline.
3. [x] Active retired relational backend runtime, dependency, migration, configuration, test, documentation-path, repository, and scheduler traces removed.
4. [x] Retired PostgreSQL implementation is historical-only and is not supported recovery infrastructure.
5. [x] Authority boundaries confirmed: Firebase Auth = identity; Firestore `default` = TeamAi durable application/domain state; Supabase Edge Functions = trusted server execution/webhook boundary; PayPal = payment event authority; GitHub = engineering/source authority; Firebase Hosting = TeamAi web hosting/delivery authority; Vercel = browser-verification surface only.
6. [x] Web AI and Development AI remain separate operational domains; Universal ToolKit is upstream-only.
7. [x] Product Law and Masterplan contain the Phase-0 gate and current phase order.
8. [x] Implementation traceability is a hard completion rule.
9. [ ] Exact local-package ↔ GitHub byte parity remains a separate synchronization certification task; no false parity claim is permitted.
10. [x] Phase-0 completion record is committed.

### Phase 0 evidence
See `docs/PHASE_0_CLEAN_BASELINE_2026-09-03.md`.

## TEAM-BACKEND-001 — Backend Foundation

**Status:** IN IMPLEMENTATION. The phase is the canonical backend foundation between the frontend blueprint and production frontend implementation. It is not equivalent to TEAM-EXPERIENCE-029.

### Chronological execution checklist
1. [x] Architecture/authority reconciliation encoded in executable service assertions.
2. [x] Firebase UID ownership hierarchy encoded in Firestore path contracts.
3. [x] Deterministic Web AI effective-skill resolution encoded; skills do not grant authorization.
4. [x] Durable task lifecycle and event/idempotency contract encoded.
5. [x] Firestore source configuration baseline wired: `firebase.json`, `firestore.rules`, `firestore.indexes.json`.
6. [x] Canonical Product Law, AI assistant recovery guide, Masterplan and backend evidence updated together.
7. [ ] Local Firebase emulator/rules execution verified.
8. [x] Authorized Firebase project identity, live `(default)` Firestore database, Email/Password and Google Auth providers, and Firestore Rules deployment verified.
9. [x] Workplace → Project → Team/Solo → Seat persistence source slice implemented and live authenticated creation, independent Firestore verification, and repeat-call idempotency are evidenced.
10. [x] Trusted Supabase Edge runtime persistence slice implemented and deployed with canonical Firebase project-identity enforcement; live authenticated execution, independent Firestore verification, and idempotency are evidenced.
11. [ ] Server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation implemented.
12. [ ] Verified PayPal webhook, idempotency, replay protection, durable commerce event and entitlement projection implemented.
13. [ ] Provider/runtime invocation connected only after authorization/task contracts.
14. [ ] Security, contract, integration, failure, timeout, cancellation and recovery verification complete.
15. [ ] Traceability audit reconciled from Product Law → plan → contract/skill → implementation → evidence → endorsement.
16. [ ] TEAM-BACKEND-001 completion endorsement recorded.
17. [ ] Only after all `BLOCKS_029` gates are evidenced: release hold on TEAM-EXPERIENCE-029.

### Canonical backend extension rule
The canonical backend is a multi-authority system, not a single endpoint or wire. Product additions MUST extend the existing authority boundaries rather than create parallel authority paths.

- New sign-in/authentication methods extend the Firebase Auth identity boundary and must still resolve to the same authoritative Firebase UID/domain ownership model.
- New payment buttons, subscription products/plans, promotional variants, and PayPal commercial flows extend canonical commerce and retain server-owned PayPal-to-Firebase-UID correlation.
- New tasks, events, providers, and runtime capabilities extend durable TeamAi state and trusted execution contracts.
- Browser UI, Firebase Hosting, and Vercel verification surfaces remain non-authoritative for identity, payment, entitlement, or durable domain state.
- Vercel is used only for browser verification before deployment; it is not a TeamAi hosting authority or production deployment target.

Adding such capabilities MUST NOT require replacing the Firebase UID ownership root, moving domain state to another database, or granting authority to the browser. Any actual authority replacement requires an explicit Product Law / architecture change before implementation.

### Next backend gate sequence
Proceed one evidence gate at a time in this order:

**GATE 4 — Firebase Emulator / Security Rules execution**
Establish executable client/server authorization behavior against `firestore.rules`, including UID-scoped account/workplace/project/team/seat reads and writes, denial of cross-UID access, and client denial for authoritative task/event writes.

**GATE 5 — Canonical Commerce foundation**
Define and implement the durable TeamAi commerce model and server-owned PayPal correlation boundary before adding multiple commercial UI controls. Prove webhook authenticity, idempotency, replay resistance, durable commerce events, entitlement projection, and Firebase UID ownership correlation.

**GATE 6 — Auth extension boundary**
Define the canonical authentication-method extension contract so Email/Password, Google, and future sign-in methods all converge on the same Firebase Auth / Firebase UID ownership model without introducing alternate domain identities.

**GATE 7 — Durable Task/Event/Runtime execution**
Connect task/event/job lifecycle to trusted server execution and provider/runtime invocation, with durable evidence and failure/recovery semantics.

**GATE 8 — Security / failure / recovery / traceability**
Exercise unauthorized access, malformed inputs, retries, duplicate external events, timeout/cancellation paths, recovery, and final Product Law → Masterplan → contract/skill → implementation → verification → endorsement traceability.

**GATE 9 — TEAM-BACKEND-001 completion endorsement**
Close the backend foundation only when all required executable gates and evidence are present.

**GATE 10 — TEAM-EXPERIENCE-029 implementation release**
Release the frontend implementation hold only after all `BLOCKS_029` backend prerequisites are evidenced and reconciled.

### Firebase identity gate — mandatory before runtime diagnosis
Before any Firebase-dependent deployment, authentication test, Firestore persistence test, or failure diagnosis:

1. Confirm the current authoritative Firebase project is `team-ai-official`.
2. Confirm the Web SDK `projectId`, Firebase CLI target, Auth, Firestore `(default)`, and Hosting target refer to `team-ai-official`.
3. Confirm the trusted Edge Function's service-account `project_id` is intended for `team-ai-official` without exposing its secret.
4. Reject similarly named projects such as `homefinder-official` as distinct/non-authoritative unless Product Law is explicitly changed first.
5. If any identity conflicts, mark the affected gate **BLOCKED** and reconcile identity before diagnosing runtime behavior.

This is an architecture gate, not an optional documentation check.

### Current evidence boundary
The executable foundation contract slice is implemented. The authoritative Firebase project `team-ai-official` is live and reachable through the authenticated CLI; Email/Password and Google authentication are enabled; the TeamAi Firestore Rules are deployed and visually verified. A human-created `Posts` test composite index is treated as a live-project test artifact, not as a canonical TeamAi index requirement.

The Firebase-backed `teamai-domain-bootstrap` Edge Function is deployed as version 6 in Supabase project `srpgzzretfyqdsfclnuo`. The deployed source explicitly enforces `team-ai-official` as the Firebase project identity, verifies Firebase ID tokens against that fixed project, targets that project's Firestore `(default)` database, and maps create-if-absent conflicts to an idempotent `exists` result.

Live evidence now includes: invalid Firebase ID token rejection with HTTP 401; missing Authorization rejection with HTTP 401; authenticated persistence returning HTTP 200; independent Firestore REST verification of the exact nested test document with actual stored values; and an identical authenticated repeat request returning HTTP 200 with existing-value results. Detailed evidence is recorded in `docs/CHECKPOINT_TEAM-BACKEND-001_GATE3_2026-09-03.md`.

The remaining backend gates are local emulator/rules execution, server-owned PayPal correlation and commerce/webhook handling, durable task/event/runtime behavior, provider invocation behind authorization contracts, full security/failure/recovery verification, final traceability reconciliation, and completion endorsement. TEAM-EXPERIENCE-029 therefore remains backend-gated, but it may now proceed from an evidence-backed Firebase persistence foundation rather than the prior Gate 3 blocker.

### Hard completion rule
An implementation claim is complete only when its governing Product Law and Masterplan item trace through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone do not establish implementation completion.

## Canonical references
- `PRODUCT_LAW.md`
- `AI_ASSISTANT_READ_ME.md`
- `docs/backend/FIREBASE_PROJECT_IDENTITY.md`
- `docs/backend/BACKEND_FOUNDATION_IMPLEMENTATION_SLICE_2026-09-03.md`
- `docs/backend/FIREBASE_LIVE_BASELINE_2026-09-03.md`
- `docs/backend/FIREBASE_EDGE_PERSISTENCE_IMPLEMENTATION_2026-09-03.md`
- `docs/backend/FIRESTORE_DOMAIN_MODEL.md`
- `docs/backend/FIREBASE_BACKEND_GUIDE.md`
- `docs/backend/SUPABASE_EDGE_FUNCTIONS_GUIDE.md`
- `docs/backend/PAYPAL_WEBHOOK_GUIDE.md`
- `docs/PHASE_0_CLEAN_BASELINE_2026-09-03.md`
- `docs/CHECKPOINT_TEAM-BACKEND-001_GATE3_2026-09-03.md`
- `docs/BACKEND_FIRST_REBASELINE_GUARD.md`
- `docs/BACKEND_SYNC_BASELINE.md`
- `docs/IMPLEMENTATION_COMPLETION_EVIDENCE_PROTOCOL.md`
- `docs/TEAM-EXPERIENCE-029-STATUS.md`

The synchronized project package remains the authoritative source for the full historical/chronological Masterplan text during this reconciliation window. This pointer intentionally avoids representing a partial repository surface as the entire Masterplan.
