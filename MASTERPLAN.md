# MASTERPLAN — TeamAi Execution Authority Pointer

`PRODUCT_LAW.md` is the product authority. The full chronological Masterplan is maintained in the synchronized project package while this repository surface carries the active gates needed for agent recovery and execution.

## Current chronological gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE ✅ → TEAM-BACKEND-001 IN IMPLEMENTATION → TEAM-EXPERIENCE-029 HOLD`

## Phase 0 — Clean Baseline / Development Entry Gate
Phase 0 is complete for development entry. Git history may retain retired implementation residue as historical record; the active project tree must not expose or support that retired path.

## TEAM-BACKEND-001 — Active implementation
The backend foundation has entered executable implementation. The first completed implementation slice is:

1. **Authority ownership contract** — executable mapping for Firebase Auth, Firestore `default`, Supabase Edge Functions, PayPal, GitHub, hosting, and optional infrastructure roles.
2. **Firestore ownership paths** — UID → Workplace → Project → Team → Seat/Task/Event path construction.
3. **Effective-skill resolution** — deterministic composition of project type, field, task, provider/runtime, tools, base skills, and project skills; skill loading never grants authorization.
4. **Durable task state contract** — lifecycle transition rules plus required durable event and idempotency fields.

Evidence surface: `docs/backend/BACKEND_FOUNDATION_IMPLEMENTATION_SLICE_2026-09-03.md`.

### Remaining chronological gates
1. [ ] Live Firebase Auth identity integration and executable UID evidence.
2. [ ] Firestore `default` persistence, rules, indexes, server-managed transitions, and ownership verification.
3. [ ] Account → Workplace → project → Team/Solo → Web AI seat/workstation/connection persistence.
4. [x] Effective-skill resolution contract.
5. [x] Durable task/event state-transition contract.
6. [ ] Trusted Supabase Edge Function execution against durable Firestore intent/state.
7. [ ] Server-owned Firebase UID ↔ TeamAi ↔ PayPal correlation.
8. [ ] Verified PayPal webhook authenticity, expected webhook identity, replay protection, idempotency, and durable commerce events.
9. [ ] Configurable introductory commercial rule: month 1 paid; months 2–3 free; one grant per Firebase UID; then normal monthly billing.
10. [ ] Security, authorization, contract, integration, timeout, failure, retry, cancellation, and recovery verification.
11. [ ] Complete traceability reconciliation, completion evidence, endorsement, Product Knowledge, changelog, checkpoint, and handover synchronization.
12. [ ] Release TEAM-EXPERIENCE-029 only after every BLOCKS_029 foundation frontier is evidenced.

## Hard completion rule
An implementation claim is complete only when its governing Product Law and Masterplan item trace through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone do not establish implementation completion.

## Validation note
The project test command has been attempted during TEAM-BACKEND-001. The current local environment lacks the installed Node dependency tree required by the existing project, so compilation cannot yet run here. This is an environment limitation, not a passing-test claim.

## Canonical references
- `PRODUCT_LAW.md`
- `AI_ASSISTANT_READ_ME.md`
- `docs/backend/BACKEND_FOUNDATION_EXECUTION.md`
- `docs/backend/BACKEND_FOUNDATION_IMPLEMENTATION_SLICE_2026-09-03.md`
- `docs/backend/BACKEND_DOCUMENT_WIRING.md`
- `docs/FOUNDATION_IMPLEMENTATION_COMPLETION_MATRIX.md`
- `docs/IMPLEMENTATION_COMPLETION_EVIDENCE_PROTOCOL.md`
- `docs/TEAM-EXPERIENCE-029-STATUS.md`

The synchronized project package remains the authoritative source for the complete historical/chronological Masterplan text during this reconciliation window.
