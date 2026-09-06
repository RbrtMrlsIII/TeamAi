# TeamAi Firestore Domain Model — Current Backend Foundation Contract

**Status:** `CURRENT / CANONICAL BACKEND FOUNDATION CONTRACT`  
**Supersedes:** `FIRESTORE_DOMAIN_MODEL.md` for current collection/path/runtime interpretation.

Firestore `default` is the TeamAi durable application/domain system of record. Firebase Auth owns identity; Firebase UID is the ownership root.

## Canonical hierarchy

`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/teams/{teamId}/seats/{seatId}`  
`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/tasks/{taskId}`  
`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/events/{eventId}`

The implemented source contract and current `firestore.rules` remain the authority for what is actually writable, readable, server-managed, or verified. This document defines the current concrete hierarchy; it does not by itself prove live runtime behavior.

## Canonical commerce hierarchy

Commerce state is rooted in the authenticated Firebase UID and uses the existing server-owned `correlationId` as the commerce aggregate document identifier.

`accounts/{uid}/commerce/{correlationId}`  
`accounts/{uid}/commerce/{correlationId}/events/{providerEventId}`  
`accounts/{uid}/commerce/{correlationId}/entitlements/{entitlementId}`

The aggregate document is the server-owned pending commerce intent/correlation established before PayPal processing. Verified provider events and entitlement projections are child collections of that aggregate. The top-level server-only correlation lookup remains:

`commerceCorrelationIndex/{correlationId}`

The correlation index is a server-side lookup aid that resolves a verified PayPal `custom_id` to the Firebase UID and commerce aggregate path; it is not an independent ownership or entitlement authority.

Commerce mutations are server-owned. Client/browser input may initiate a commercial flow but must not self-attest payment success, provider event authenticity, Firebase ownership, or entitlement state. Signed-in owners may read their own UID-rooted commerce aggregate, event, and entitlement state according to `firestore.rules`.

All commerce document paths must obey Firestore's collection/document alternation. The invalid legacy shape `accounts/{uid}/commerce/intents/{correlationId}` is not part of the current contract and must not be introduced or relied upon.

## Security boundary

Client rules remain deny-by-default except for explicitly authorized UID-scoped application paths. Trusted server operations remain responsible for sensitive transitions. Commerce and entitlement mutation remains server-owned.

## State classes

State classes include Account, Workplace, Project, Team/Solo, Web AI Seat, Task, Event, and Commerce.

Seat state may include provider/application, service/runtime, model/variant, effective skills, tools, permissions, settings, commands, shortcuts, scope, entitlement/authorization state, and health.

Task state includes dependencies, lifecycle, leases, retries, timeouts, approvals, cancellation, and recovery evidence.

Events use stable event and idempotency identifiers and represent durable execution evidence rather than transient UI state.

Commerce state includes server-owned intent/correlation, verified provider-event identity, durable commerce events, entitlement projections, and the correlation lookup needed to map provider callbacks back to the authenticated Firebase UID.

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
