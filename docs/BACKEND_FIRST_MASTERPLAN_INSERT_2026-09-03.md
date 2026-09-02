# Backend-First Masterplan Insert — 2026-09-03

This document is the executable planning bridge between TEAM-EXPERIENCE-028 and TEAM-EXPERIENCE-029. It does not claim implementation completion.

## Canonical sequence

`TEAM-EXPERIENCE-028 → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## TEAM-BACKEND-001 — Canonical Backend Foundation

**Status:** PLANNED / NOT IMPLEMENTED

### Focus checklist

1. Reconcile architecture, authority, Product Law references, and service boundaries.
2. Remove all active traces and implementation paths for the retired relational backend; schedule a separate Git-history purge gate.
3. Establish Firebase Auth identity and Firebase UID ownership semantics.
4. Establish Firestore `default` as durable TeamAi domain/application state with rules, indexes, ownership, and server-managed transitions.
5. Persist account → Workplace → project → Team/Solo → Web AI seat/workstation/connection relationships.
6. Resolve effective Web AI skills by project type, field/domain, task, provider/service/runtime, and tools/plugins.
7. Establish server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation.
8. Implement verified PayPal webhook receipt, idempotency, replay protection, and durable commerce events through Supabase Edge Functions.
9. Encode the commercial promotion as configuration: first qualifying month paid; months 2–3 free; one promotional grant per Firebase UID; later months normal billing. Defer exact PayPal Product/Plan/Button UX until commercial/UI validation.
10. Define durable Firestore task/event/job state: dependencies, leases, retries, timeouts, cancellation, approvals, recovery, idempotency, and append-oriented evidence.
11. Implement the Supabase Edge Function runtime adapter without creating TeamAi domain tables in Supabase Postgres.
12. Connect provider/runtime invocation only after policy, task/event, and authorization contracts exist.
13. Execute security, contract, integration, duplication, failure, timeout, recovery, and authorization verification.
14. Synchronize canonical documentation, skills, Product Knowledge, checkpoint, handover, verification, changelog, registry, state, dictionary, and census evidence.
15. Release the hold on TEAM-EXPERIENCE-029 only after every backend foundation gate has executable evidence.

## Authority invariants

- Firebase Auth owns identity.
- Firestore `default` owns TeamAi domain/application state.
- PayPal owns payment-provider truth.
- Supabase Edge Functions own trusted server execution and webhook receipt.
- GitHub owns engineering/source state.
- Vercel remains optional future browser/deployment infrastructure.
- Frontend, cache, and visual state never become authorization or system-of-record truth.

## Evidence rule

A checklist item is not complete because a guide, plan, deployment, or test exists. Completion requires the implementation evidence defined by the project's completion-evidence protocol.

## ToolKit rule

Only validated and generalized lessons leave TeamAi. ToolKit never becomes an automatic downstream authority for TeamAi.
