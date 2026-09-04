# Firestore Domain Model — Historical Planning Contract

> **Superseded status — 2026-09-03:** This document records the earlier Firestore planning/authority-class model. It remains preserved as historical planning evidence, but it is **not the current collection/path/runtime contract**. For current Firestore hierarchy and backend interpretation, use `FIRESTORE_DOMAIN_MODEL_V2.md` together with the implemented source contracts, `firestore.rules`, and current verification evidence.

Firestore database `default` is the TeamAi application/domain system of record. This document defines authority classes and ownership before the later concrete collection/path contract was established.

## Authority classes

- Identity: Firebase Auth UID and account identity.
- Workplace: user-owned Workplace/project/team/solo/seat relationships.
- Feature Team: Web AI seats, provider/runtime/model bindings, skills, tools, scopes, limits, and health.
- Conversation: conversation state, turns, messages, summaries, and user-visible continuity data.
- Execution: task, dependency, job, lease, retry, approval, recovery, and durable event state.
- Commerce: subscription intent, PayPal correlation, payment events, entitlement state, promotion eligibility, and reconciliation.
- Audit/operations: policy decisions, security-relevant transitions, and integration evidence required by the product.

## Historical ownership model

Client-owned data is limited to explicitly permitted user-facing fields under Firestore Security Rules. Sensitive transitions are server-managed.

## Historical server-managed transitions

Entitlement, payment state, PayPal correlation, task leases, retry/recovery transitions, provider credential references, approval results, and reconciliation must be written only through trusted backend paths.

## Historical event discipline

Durable events are append-oriented evidence of state transitions. Event IDs and idempotency keys must prevent duplicate business effects.

## Current authority pointer

Rules and indexes are canonical project artifacts. The current concrete Firestore model is defined by `FIRESTORE_DOMAIN_MODEL_V2.md` and the implemented UID-rooted source contracts. Do not introduce another database to avoid Firestore modeling work.

## Preservation rule

This file must not be used to infer current collection names, current security rules, current runtime deployment status, or current task/event placement. Historical statements here remain useful only for provenance and reconciliation.
