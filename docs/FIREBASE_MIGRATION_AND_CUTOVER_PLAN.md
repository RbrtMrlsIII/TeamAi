# Firebase Migration and Cutover Plan

## Status

`PREPARED — TARGET IDENTIFIED / NOT CONNECTED`

Date: 2026-09-02

TeamAi is preparing to use Firebase as the next application-backend implementation profile. This is an implementation choice for persistence/runtime infrastructure; it does not change Product Law, domain contracts, authorization rules, provider compliance rules, or the provider-independent Web AI seat model.

## Why this path

The current WoWSQL PostgreSQL environment is authenticated and reachable, but its live schema materially diverges from the canonical TeamAi migration set. Applying the current migration set in place would create an unsafe hybrid schema. The safest course is to preserve the existing WoWSQL database as a frozen legacy/evidence environment while preparing a clean Firebase runtime surface.

Firebase is a practical fit because Firestore provides atomic transactions and batched writes and Firebase Authentication provides managed identity services. TeamAi will remain on a Spark-compatible architecture for the current phase: Firebase Cloud Storage and Cloud Functions are explicitly out of scope. The Firebase Emulator Suite will be used for local validation before any production project connection.

## Target Firebase identity

| Setting | Canonical value | Status |
|---|---|---|
| Firebase project | `teamai-7d20f` | Identified from user-supplied project configuration |
| Firestore database | `default` | Canonical target |
| Billing posture | Spark-compatible | Hard implementation constraint for current phase |
| Firebase Hosting | In scope | Primary web deployment surface |
| Firebase Authentication | In scope | Identity foundation |
| Cloud Firestore | In scope | Application/domain persistence |
| Firebase Cloud Storage | **Out of scope** | No product feature; no runtime dependency |
| Cloud Functions | **Out of scope** | No runtime dependency |

## Target service map

| TeamAi capability | Firebase target | Boundary |
|---|---|---|
| Identity / sign-in | Firebase Authentication | Firebase UID maps to TeamAi identity; domain profile remains application data |
| Conversation state | Cloud Firestore | Domain repository boundary; no Product Law dependency on Firestore APIs |
| Participants / turn plan | Cloud Firestore | Durable documents + event collections |
| Tasks / dependencies / task events | Cloud Firestore | Replaces SQL implementation of the same domain behavior |
| Web deployment | Firebase Hosting | Static web application hosting only |
| Client access | Firebase SDK + Security Rules | Least-privilege, tenancy-aware access |
| App attestation | Firebase App Check | Client abuse/replay resistance where applicable |
| Privileged orchestration | **External TeamAi runtime** | Runs outside Firebase Cloud Functions; authenticates to approved TeamAi data/API surfaces |
| Scheduled jobs | **External TeamAi runtime / scheduler** | No Cloud Scheduler/Functions dependency in Spark phase |
| Project ZIP / large artifact exchange | **External Workplace / GitHub / AI-app retrieval** | Not uploaded to TeamAi web app; Firebase Storage is not used |
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

## Product/project artifact workflow

TeamAi does not provide a web-app file-upload feature for project ZIPs. This is a deliberate product boundary, not a missing implementation.

Canonical user flows are:

1. **Manual GitHub setup:** canonical guides instruct a user to create/select their repository and manually upload/push their project.
2. **AI-assisted external upload:** the user may explicitly authorize an AI to upload project artifacts outside the TeamAi web app; the preferred execution surface is Workplace. Destination, repository, branch/path, authorization and result must be recorded.
3. **Per-AI-app retrieval:** when the user names or commands a specific AI app in chat, that app may expose the project's generated ZIP for the user to retrieve through that AI application's own supported artifact path. TeamAi should link/route to that app rather than implement a TeamAi-hosted project-file service.
4. **No Firebase Storage:** project ZIPs are not stored in Firebase Storage and TeamAi should not expose a Firebase Storage-backed upload/download feature.

Artifact exchange must preserve provenance, ownership, authorization, checksum/version identity, and retention evidence without making Firebase Storage a dependency.

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

1. Use Firebase project `teamai-7d20f`.
2. Use Firestore database `default`.
3. Enable the Authentication providers required by TeamAi and configure Firebase Hosting.
4. Do **not** enable or depend on Firebase Cloud Storage or Cloud Functions for the Spark baseline.
5. Record non-secret project configuration locally; never commit service-account private keys or other credentials.
6. Run the Auth/Firestore Local Emulator Suite before first application write.

### Phase F2 — backend adapter

Implement repository interfaces against Firestore for projects/memberships, conversations/messages/participants, durable Turn Plan and turn events, execution runs/tasks/dependencies/events, knowledge/source-sync metadata, audit events, and provider/integration profiles.

### Phase F3 — identity/security

Add Firebase Authentication integration and map Firebase UID to TeamAi identity. Security Rules must enforce project/workplace tenancy and role/permission checks. Privileged operations must execute through a trusted external TeamAi runtime boundary rather than exposing administrative credentials to clients.

### Phase F4 — scheduler/runtime

Implement scheduler/runtime behavior in an external TeamAi-controlled runtime rather than Firebase Cloud Functions. Use authenticated Firestore access only through an explicit server boundary. Preserve idempotency, bounded retry, lease/claim semantics, durable event journaling, and transaction-safe state transitions. Firestore transactions/batched writes must be used where atomic domain invariants require them.

The external runtime must not become an undocumented bypass around Firebase authorization. Its service identity, allowed project scope, operations, and audit behavior must be explicitly bounded.

### Phase F5 — verification and cutover

Cutover requires emulator tests, application typecheck/build, domain repository contract tests, Security Rules tests, provider-compliance checks, external artifact exchange/retention verification, approved migration/import scope, rollback evidence, and checkpoint evidence. No existing WoWSQL data is copied automatically.

## Data-transfer rule

No existing WoWSQL data will be copied automatically merely because a Firebase project exists. Existing records are preserved in place until a separately evidenced migration/import plan defines scope, ownership, privacy basis, transforms, validation, and rollback.

## Secret handling

Do not place Firebase service-account private keys, API secrets, database passwords, provider credentials, OAuth client secrets, or access tokens in chat, Git commits, handovers, ZIP archives, or documentation. Use local ignored files or the provider's secret-management facilities.

## Non-goals of this tranche

This tranche does **not** claim Firebase production deployment, application cutover, complete Firestore schema implementation, Authentication integration, external runtime implementation, frontend completion, or migration of existing WoWSQL data.
