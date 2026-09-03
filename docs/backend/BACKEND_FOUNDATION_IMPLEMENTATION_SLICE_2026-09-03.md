# TEAM-BACKEND-001 — Backend Foundation Implementation Slice

**Status:** IN IMPLEMENTATION
**Date:** 2026-09-03
**Scope:** executable foundation contracts plus Firebase source-security baseline; not full backend completion.

## Implemented
- `src/backend/authority.ts` encodes the canonical service authority map and rejects authority mismatches.
- `src/backend/firestore-paths.ts` encodes Firebase UID-owned paths for Account, Workplace, Project, Team, Seat, Task, and Event state.
- `src/backend/skill-resolution.ts` resolves effective skills deterministically from project type, field, task, provider/runtime, tools, base skills, and project skills. Skill output is instructional and never grants authorization.
- `src/backend/task-state.ts` encodes durable task lifecycle transitions and validates required durable-event fields including stable event and idempotency identifiers.
- `src/backend/commerce.ts` encodes a server-owned commerce intent and verified PayPal event correlation boundary, plus UID-rooted intent/event/entitlement paths and a server-only correlation lookup index path.
- `supabase/functions/teamai-commerce-intent/index.ts` provides the trusted server-owned PayPal intent issuance boundary and directly verifies Firebase ID tokens for `team-ai-official`.
- `supabase/functions/paypal-webhook/index.ts` contains the Gate 5C commerce processing implementation. A fresh isolated deployed copy is `teamai-paypal-webhook-v5c`; the existing canonical `paypal-webhook` remains untouched until runtime validation earns a cutover.
- `supabase/functions/_shared/firestore.ts` provides service-account OAuth and Firestore REST helpers for trusted commerce persistence.
- `firebase.json`, `firestore.rules`, and `firestore.indexes.json` are source-wired. Client writes to durable task/event evidence are denied; owned observation remains available.
- Canonical Product Law, AI Assistant Read Me, Masterplan, backend execution, Firebase guide, backend documentation front door, and live-service status are synchronized to this implementation boundary.

## Traceability
`PRODUCT_LAW.md` Laws 101–104 → `MASTERPLAN.md` TEAM-BACKEND-001 checklist → backend domain/security/commerce contracts → implementation → executable source validation → deployment evidence records.

## Gate 5B validation
Gate 5B is **PASS for the source-contract boundary**. The committed `src/backend/commerce.ts` was compiled with TypeScript 5.8.3 under strict NodeNext settings in a temporary local workspace, then behaviorally asserted under Node.js 22.16.0.

Observed result:

`GATE5B_DIRECT_TEST=PASS`

Validation evidence: `docs/evidence/GATE5B_DIRECT_VALIDATION_2026-09-03.md`.

## Gate 5C implementation start
Gate 5C is **ACTIVE — IMPLEMENTATION STARTED**.

Deployment evidence:
- `teamai-commerce-intent` — ACTIVE, version 1.
- `teamai-paypal-webhook-v5c` — ACTIVE, version 1.
- Existing `paypal-webhook` — ACTIVE, version 3, unchanged during validation isolation.

Gate 5C currently implements the following trusted sequence:

`Firebase ID token → server-owned commerce intent → PayPal custom_id correlation → PayPal webhook authenticity verification → server-only correlation index → UID-rooted durable commerce event → UID-rooted entitlement projection`

This sequence is intentionally not yet declared runtime-validated end-to-end.

## Current bounded commerce frontier
Gate 5B closes the server-owned correlation source contract. Gate 5C extends that contract into deployed trusted processing, but runtime/E2E validation remains open.

No live PayPal transaction or authenticated business webhook has yet been independently exercised by this evidence record. Replay-race verification, entitlement ordering/recovery, production listener cutover, and final completion endorsement remain open.

## Remaining foundation frontiers
Local Firebase emulator/rules execution remains parked by the current environment. Gate 5C runtime validation, durable commerce failure/recovery testing, provider invocation verification, and end-to-end security/failure/recovery evidence remain open as separate evidence gates.

## Validation honesty
Deployment success is evidence that the fresh Edge Function was accepted by the Supabase deployment boundary. It is not evidence that the full webhook/business flow has executed correctly.

## Unlock rule
TEAM-EXPERIENCE-029 remains HOLD until all foundation frontiers marked `BLOCKS_029` in the completion matrix have executable evidence.
