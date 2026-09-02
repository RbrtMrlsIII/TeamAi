# Firestore Domain Model — Canonical Planning Contract

Firestore database `default` is the TeamAi application/domain system of record. This document defines authority classes and ownership before exact collection/index implementation.

## Authority classes

- Identity: Firebase Auth UID and account identity.
- Workplace: user-owned Workplace/project/team/solo/seat relationships.
- Feature Team: Web AI seats, provider/runtime/model bindings, skills, tools, scopes, limits, and health.
- Conversation: conversation state, turns, messages, summaries, and user-visible continuity data.
- Execution: task, dependency, job, lease, retry, approval, recovery, and durable event state.
- Commerce: subscription intent, PayPal correlation, payment events, entitlement state, promotion eligibility, and reconciliation.
- Audit/operations: policy decisions, security-relevant transitions, and integration evidence required by the product.

## Ownership

Client-owned data is limited to explicitly permitted user-facing fields under Firestore Security Rules. Sensitive transitions are server-managed.

## Server-managed transitions

Entitlement, payment state, PayPal correlation, task leases, retry/recovery transitions, provider credential references, approval results, and reconciliation must be written only through trusted backend paths.

## Event discipline

Durable events are append-oriented evidence of state transitions. Event IDs and idempotency keys must prevent duplicate business effects.

## Rules and indexes

Rules and indexes are canonical project artifacts. They must be validated before production changes. Do not introduce another database to avoid Firestore modeling work.

## Implementation status

Planning contract only. Exact collection names, indexes, security rules, and runtime transactions are to be implemented and verified under TEAM-BACKEND-001.
