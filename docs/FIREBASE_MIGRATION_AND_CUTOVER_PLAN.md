# Firebase Migration and Cutover Plan

## Status

`PREPARED — NOT CONNECTED / NOT DEPLOYED`

Date: 2026-09-02

TeamAi is preparing to use Firebase as the next application-backend implementation profile. This is an implementation choice for persistence/runtime infrastructure; it does not change Product Law, domain contracts, authorization rules, provider compliance rules, or the provider-independent Web AI seat model.

## Why this path

The current WoWSQL PostgreSQL environment is authenticated and reachable, but its live schema materially diverges from the canonical TeamAi migration set. Applying the current migration set in place would create an unsafe hybrid schema. The safest course is to preserve the existing WoWSQL database as a frozen legacy/evidence environment while preparing a clean Firebase runtime surface.

Firebase is a practical fit because Firestore provides atomic transactions and batched writes, Firebase Authentication provides managed identity services, and Cloud Functions supports HTTP/event-triggered and scheduled server-side work. The Firebase Emulator Suite is also suitable for local validation before any production project connection.

## Target service map

| TeamAi capability | Firebase target | Boundary |
|---|---|---|
| Identity / sign-in | Firebase Authentication | Firebase UID is mapped to TeamAi identity; domain profile remains application data |
| Conversation state | Cloud Firestore | Domain repository boundary; no direct Product Law dependency on Firestore APIs |
| Participants / turn plan | Cloud Firestore | Durable documents + event collections |
| Tasks / dependencies / task events | Cloud Firestore | Replaces SQL implementation of the same domain behavior |
| Server orchestration | Cloud Functions | Protected backend execution only |
| Scheduled jobs | Cloud Functions + Cloud Scheduler | Idempotent job handlers; no authority encoded in schedule position |
| Large project artifacts | Cloud Storage | Store by project/run/artifact references, not large chat payloads |
| Client access | Firebase SDK + Security Rules | Least-privilege, tenancy-aware access |
| App attestation | Firebase App Check | Client abuse/replay resistance where applicable |
| Existing WoWSQL | No cutover yet | Preserve for evidence/legacy compatibility; do not mutate via TeamAi migration |

## Domain-to-Firestore mapping

The following is the initial logical mapping. Collection names are implementation candidates and are not yet Product Law.

```text
users/{uid}
projects/{projectId}
projects/{projectId}/members/{uid}
projects/{projectId}/conversations/{conversationId}
projects/{projectId}/conversations/{conversationId}/participants/{participantId}
projects/{projectId}/conversations/{conversationId}/messages/{messageId}
projects/{projectId}/conversations/{conversationId}/turnEvents/{eventId}
projects/{projectId}/executionPlans/{planId}
projects/{projectId}/executionRuns/{runId}
projects/{projectId}/executionRuns/{runId}/tasks/{taskId}
projects/{projectId}/executionRuns/{runId}/taskEvents/{eventId}
projects/{projectId}/knowledge/{entryId}
projects/{projectId}/integrations/{integrationId}
projects/{projectId}/auditEvents/{eventId}
```

The final schema must be derived from the canonical domain contracts and tenancy/security model rather than from a mechanical table-for-collection translation.

## Cutover phases

### Phase F0 — preparation

Completed in this tranche:

- document Firebase as the target implementation profile;
- preserve WoWSQL as legacy/evidence environment;
- create Firebase configuration templates with no secrets;
- define a deny-by-default Firestore rules baseline;
- define emulator configuration;
- record the service mapping and cutover gates.

### Phase F1 — project setup

Human-controlled steps:

1. Create or select the Firebase/Google Cloud project for TeamAi.
2. Enable Authentication, Cloud Firestore, Cloud Storage, and Cloud Functions as required by the implementation tranche.
3. Record the non-secret Firebase project ID in `.firebaserc` locally only; never commit credentials or service-account private keys.
4. Run the Local Emulator Suite before first application write.

### Phase F2 — backend adapter

Implement repository interfaces against Firestore for projects/memberships, conversations/messages/participants, durable Turn Plan and turn events, execution runs/tasks/dependencies/events, knowledge/source-sync metadata, audit events, and provider/integration profiles.

### Phase F3 — identity/security

Add Firebase Authentication integration and map Firebase UID to TeamAi identity. Security Rules must enforce project/workplace tenancy and role/permission checks. Server-side privileged operations must execute through trusted backend functions rather than exposing administrative credentials to clients.

### Phase F4 — scheduler/runtime

Move the domain scheduler behavior to backend functions with idempotency, bounded retry, lease/claim semantics, and durable event journaling. Firestore transactions/batched writes must be used where atomic domain invariants require them.

### Phase F5 — verification and cutover

Cutover requires emulator, application, repository-contract, Security Rules, compliance, artifact/retention, import, rollback, and checkpoint evidence. No existing WoWSQL data is copied automatically.

## Secret handling

Do not place Firebase service-account private keys, API secrets, database passwords, provider credentials, OAuth client secrets, or access tokens in chat, Git commits, handovers, ZIP archives, or documentation. Use local ignored files or provider secret-management facilities.

## Non-goals of this tranche

This tranche does **not** claim Firebase production deployment, application cutover, complete Firestore schema implementation, Authentication integration, Cloud Functions deployment, frontend completion, or migration of existing WoWSQL data.
