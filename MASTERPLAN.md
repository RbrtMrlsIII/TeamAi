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
5. [x] Authority boundaries confirmed: Firebase Auth = identity; Firestore `default` = TeamAi durable application/domain state; Supabase Edge Functions = trusted server execution/webhook boundary; PayPal = payment event authority; GitHub = engineering/source authority; Vercel = optional future browser/deployment surface.
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
8. [ ] Authorized Firebase project identity and live Auth/Firestore integration verified.
9. [ ] Workplace → Project → Team/Solo → Seat persistence implemented and verified.
10. [ ] Trusted Supabase Edge runtime adapter integrated and verified.
11. [ ] Server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation implemented.
12. [ ] Verified PayPal webhook, idempotency, replay protection, durable commerce event and entitlement projection implemented.
13. [ ] Provider/runtime invocation connected only after authorization/task contracts.
14. [ ] Security, contract, integration, failure, timeout, cancellation and recovery verification complete.
15. [ ] Traceability audit reconciled from Product Law → plan → contract/skill → implementation → evidence → endorsement.
16. [ ] TEAM-BACKEND-001 completion endorsement recorded.
17. [ ] Only after all `BLOCKS_029` gates are evidenced: release hold on TEAM-EXPERIENCE-029.

### Current evidence boundary
The executable foundation contract slice is implemented. Firebase configuration is source-wired, but no live Firebase deployment or rules test is claimed. Project-wide Node tests remain blocked by the missing local dependency installation and therefore are not represented as passing evidence.

### Hard completion rule
An implementation claim is complete only when its governing Product Law and Masterplan item trace through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone do not establish implementation completion.

## Canonical references
- `PRODUCT_LAW.md`
- `AI_ASSISTANT_READ_ME.md`
- `docs/backend/BACKEND_FOUNDATION_IMPLEMENTATION_SLICE_2026-09-03.md`
- `docs/backend/FIRESTORE_DOMAIN_MODEL.md`
- `docs/backend/FIREBASE_BACKEND_GUIDE.md`
- `docs/backend/SUPABASE_EDGE_FUNCTIONS_GUIDE.md`
- `docs/backend/PAYPAL_WEBHOOK_GUIDE.md`
- `docs/PHASE_0_CLEAN_BASELINE_2026-09-03.md`
- `docs/BACKEND_FIRST_REBASELINE_GUARD.md`
- `docs/BACKEND_SYNC_BASELINE.md`
- `docs/IMPLEMENTATION_COMPLETION_EVIDENCE_PROTOCOL.md`
- `docs/TEAM-EXPERIENCE-029-STATUS.md`

The synchronized project package remains the authoritative source for the full historical/chronological Masterplan text during this reconciliation window. This pointer intentionally avoids representing a partial repository surface as the entire Masterplan.
