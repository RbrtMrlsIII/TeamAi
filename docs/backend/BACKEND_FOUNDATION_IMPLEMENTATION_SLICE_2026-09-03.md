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

## Current bounded commerce frontier
Gate 5B introduces the server-owned correlation contract only. It does **not** yet claim verified PayPal webhook processing, durable commerce event persistence, entitlement projection, or live payment completion.

## Remaining foundation frontiers
Live Firebase Auth/Firestore behavior, Firestore Security Rules/index deployment and verification, Workplace/seat persistence, verified PayPal webhook processing, durable commerce mutation/entitlement projection, trusted Supabase Edge execution, provider invocation, and end-to-end security/failure/recovery evidence remain open as separate evidence gates.

## Validation honesty
Project-wide compilation/tests remain an environment-dependent evidence step; no green test result is claimed here until the repository dependency tree is available and the test command completes successfully.

## Unlock rule
TEAM-EXPERIENCE-029 remains HOLD until all foundation frontiers marked `BLOCKS_029` in the completion matrix have executable evidence.
