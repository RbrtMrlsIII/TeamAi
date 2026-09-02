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

## TEAM-BACKEND-001 — Required next implementation phase

TEAM-BACKEND-001 is the canonical backend foundation between the frontend blueprint and production frontend implementation. It remains the next active execution phase after Phase 0 and is not equivalent to TEAM-EXPERIENCE-029.

### Gate order
1. Architecture/authority reconciliation
2. Firebase Auth identity boundary
3. Firestore `default` durable domain/application state
4. Account → Workplace → project → Team/Solo → Web AI seat/workstation/connection persistence
5. Web AI field/domain skill inheritance and effective-skill resolution
6. Durable task/event/job contracts
7. Trusted Supabase Edge Function runtime boundary
8. Server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation
9. Verified PayPal webhook, idempotency, replay protection, durable commerce events
10. Security / contract / integration / failure / recovery verification
11. Traceability reconciliation and completion evidence
12. Only then release the hold on TEAM-EXPERIENCE-029

## Hard completion rule
An implementation claim is complete only when its governing Product Law and Masterplan item trace through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone do not establish implementation completion.

## Canonical references
- `PRODUCT_LAW.md`
- `docs/PHASE_0_CLEAN_BASELINE_2026-09-03.md`
- `docs/BACKEND_FIRST_REBASELINE_GUARD.md`
- `docs/BACKEND_SYNC_BASELINE.md`
- `docs/IMPLEMENTATION_COMPLETION_EVIDENCE_PROTOCOL.md`
- `docs/TEAM-EXPERIENCE-029-STATUS.md`

The synchronized project package remains the authoritative source for the full historical/chronological Masterplan text during this reconciliation window. This pointer intentionally avoids representing a partial repository surface as the entire Masterplan.
