# TEAM-BACKEND-001 — Backend Foundation Implementation Slice

**Status:** IN IMPLEMENTATION
**Date:** 2026-09-03
**Scope:** executable foundation contracts plus Firebase source-security baseline; not full backend completion.

## Implemented
- `src/backend/authority.ts` encodes the canonical service authority map and rejects authority mismatches.
- `src/backend/firestore-paths.ts` encodes Firebase UID-owned paths for Account, Workplace, Project, Team, Seat, Task, and Event state.
- `src/backend/skill-resolution.ts` resolves effective skills deterministically from project type, field, task, provider/runtime, tools, base skills, and project skills. Skill output is instructional and never grants authorization.
- `src/backend/task-state.ts` encodes durable task lifecycle transitions and validates required durable-event fields including stable event and idempotency identifiers.
- `src/backend/commerce.ts` encodes a server-owned commerce intent and verified PayPal event correlation boundary. The correlation derives a stable event idempotency key from the PayPal provider event ID and keeps Firebase UID ownership server-established.
- `firebase.json`, `firestore.rules`, and `firestore.indexes.json` are source-wired. Client writes to durable task/event evidence are denied; owned observation remains available.
- Canonical Product Law, AI Assistant Read Me, Masterplan, backend execution, Firebase guide, backend documentation front door, and live-service status are synchronized to this implementation boundary.

## Traceability
`PRODUCT_LAW.md` Laws 101–104 → `MASTERPLAN.md` TEAM-BACKEND-001 checklist → backend domain/security/commerce contracts → implementation → executable foundation tests → evidence records.

## Gate 5B validation
Gate 5B is **PASS for the source-contract boundary**. The committed `src/backend/commerce.ts` was compiled with TypeScript 5.8.3 under strict NodeNext settings in a temporary local workspace, then behaviorally asserted under Node.js 22.16.0.

Observed result:

`GATE5B_DIRECT_TEST=PASS`

Validation evidence: `docs/evidence/GATE5B_DIRECT_VALIDATION_2026-09-03.md`.

## Current bounded commerce frontier
Gate 5B closes only the server-owned correlation contract. It does **not** claim verified PayPal webhook processing, durable commerce event persistence, entitlement projection, or live payment completion.

Gate 5C is now the active frontier: verify PayPal webhook authenticity, apply replay/idempotency controls, correlate authenticated provider events to a server-owned commerce intent, and persist durable commerce/entitlement state in Firestore.

## Remaining foundation frontiers
Local Firebase emulator/rules execution remains parked by the current environment. Verified PayPal webhook processing, durable commerce mutation/entitlement projection, trusted Supabase Edge execution for the complete commerce path, provider invocation, and end-to-end security/failure/recovery evidence remain open as separate evidence gates.

## Validation honesty
Gate 5B has direct source-contract evidence. Project-wide compilation/tests for the complete repository and live PayPal transaction/webhook business processing are not claimed.

## Unlock rule
TEAM-EXPERIENCE-029 remains HOLD until all foundation frontiers marked `BLOCKS_029` in the completion matrix have executable evidence.
