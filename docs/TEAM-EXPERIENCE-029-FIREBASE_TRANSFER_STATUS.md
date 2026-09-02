# TEAM-EXPERIENCE-029 — Firebase Transfer Status

Status: `FROZEN PREPARATION — NOT CONNECTED / NOT DEPLOYED`

Date: 2026-09-02

## Decision carried into execution

TeamAi is preparing Firebase as the next application-backend implementation profile because the live WoWSQL/PostgreSQL environment materially diverges from the canonical migration set. The live WoWSQL database is preserved as legacy/evidence infrastructure; no in-place migration or destructive reset is authorized by this preparation tranche.

## Firebase target

- Firebase Authentication: identity/session foundation.
- Cloud Firestore: TeamAi domain/application persistence and durable event records.
- Cloud Functions: protected server execution, orchestration, webhooks, and scheduled jobs.
- Cloud Storage: large project artifacts and evidence packages.
- Firebase Security Rules: least-privilege client access after tenancy/role policy is implemented.
- Firebase Emulator Suite: local validation before live project writes/deployment.

## 029 implementation carry-forward

The PostgreSQL scheduler implementation in `src/task-scheduler.ts` and `migrations/007_durable_task_scheduler.sql` remains valid as evidence of required task/dependency/event behavior. The Firebase adapter must implement the same domain behavior without mechanically reproducing the SQL schema.

## Explicit non-claims

This status does not claim Firebase project provisioning, production deployment, Security Rules completion, Authentication integration, Cloud Functions deployment, frontend completion, data migration, or product implementation completion.

## Required next gate

Human-controlled Firebase project setup, then emulator validation, then Firestore repository adapters and Security Rules implementation.
