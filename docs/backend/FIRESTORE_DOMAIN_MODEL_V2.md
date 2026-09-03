# TeamAi Firestore Domain Model — Current Backend Foundation Contract

**Status:** `CURRENT / CANONICAL BACKEND FOUNDATION CONTRACT`  
**Supersedes:** `FIRESTORE_DOMAIN_MODEL.md` for current collection/path/runtime interpretation.

Firestore `default` is the TeamAi durable application/domain system of record. Firebase Auth owns identity; Firebase UID is the ownership root.

## Canonical hierarchy

`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/teams/{teamId}/seats/{seatId}`  
`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/tasks/{taskId}`  
`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/events/{eventId}`

The implemented source contract and current `firestore.rules` remain the authority for what is actually writable, readable, server-managed, or verified. This document defines the current concrete hierarchy; it does not by itself prove live runtime behavior.

## Security boundary

Client rules remain deny-by-default except for explicitly authorized UID-scoped application paths. Trusted server operations remain responsible for sensitive transitions. Commerce and entitlement mutation remains server-owned.

## State classes

State classes include Account, Workplace, Project, Team/Solo, Web AI Seat, Task, and Event.

Seat state may include provider/application, service/runtime, model/variant, effective skills, tools, permissions, settings, commands, shortcuts, scope, entitlement/authorization state, and health.

Task state includes dependencies, lifecycle, leases, retries, timeouts, approvals, cancellation, and recovery evidence.

Events use stable event and idempotency identifiers and represent durable execution evidence rather than transient UI state.

## Authority relationship

`FIRESTORE_DOMAIN_MODEL.md` is retained as historical planning/provenance material. It must not be used as a competing current model.

For current interpretation, use this document together with:

- `firestore.rules`;
- `src/backend/firestore-paths.ts`;
- `src/backend/task-state.ts`;
- `src/backend/commerce.ts`;
- the current backend live-service status;
- applicable checkpoint and verification evidence.

## Migration/history safety

This reconciliation does **not** rewrite Git history or delete historical evidence. Any future destructive removal of legacy Firestore traces must be handled through a separate explicitly authorized history-rewrite gate after baseline preservation and repository-history inventory.
