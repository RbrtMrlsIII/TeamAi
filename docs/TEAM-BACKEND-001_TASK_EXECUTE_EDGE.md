# TEAM-BACKEND-001 — Authenticated task execute (Edge)

**Status:** RUNTIME-PROVEN (source + deployed + live authenticated call)  
**Function:** `supabase/functions/teamai-task-execute`  
**Commerce / PayPal:** **out of scope** (separate gate only)

## Path

```text
Authorization: Bearer <Firebase ID token>
        │
        ▼
verify JWT (team-ai-official)
        │
        ▼
uid + workplaceId + projectId
        │
        ├─ optional taskId (must exist)
        └─ or create READY task (create-only)
        │
        ▼
transactional lease (resource-name commits)
        │
        ├─ winner → continue
        └─ loser  → 409 { reason: NOT_FOUND | NOT_READY | CONFLICT }
        │
        ▼
stub ProviderRuntime (no external provider)
        │
        ▼
durable execution-result (create-only)
        │
        ▼
task status → completed
```

## Request

`POST` body JSON:

| Field | Required | Notes |
|-------|----------|-------|
| `workplaceId` | yes | TeamAi workplace document id |
| `projectId` | yes | TeamAi domain project id (not Firebase project id) |
| `taskId` | no | If omitted, a new READY task is created |
| `seatId` | no | default `seat-default` |
| `actorId` | no | default `edge-task-execute` |
| `prompt` | no | echoed into stub result text |

## Response (success 201)

Includes `uid`, `taskId`, `leaseId`, `eventId`, `resultPath`, stub `text`. Explicit note that PayPal is out of scope.

## Deployment evidence

Deployed to Supabase project `srpgzzretfyqdsfclnuo` with the Supabase gateway JWT check disabled for this bounded custom-Firebase-auth path. The function itself verifies the Firebase ID token against `team-ai-official` before accessing Firestore.

## Live runtime evidence — 2026-09-06

Cloud Shell live call using a fresh Firebase ID token and the real TeamAi IDs:

- `workplaceId`: `e2e-probe-003`
- `projectId`: `e2e-project-003`
- HTTP status: `201`
- `ok`: `true`
- `phase`: `complete`
- `taskId`: `exec-f3d8f07f-354354`
- `leaseId`: `lease-f3d8f07f-354354`
- `eventId`: `complete-f3d8f07f-354354`
- provider: `stub-edge-runtime`
- result path emitted under the verified UID/workplace/project/task hierarchy

This establishes the authenticated UID → task → lease → stub runtime → durable result → completed task path for this bounded Edge slice.

Evidence record: `docs/evidence/TEAM-BACKEND-001_EDGE_RUNTIME_PROOF_2026-09-06.md`

## Secrets

Same as domain bootstrap: `FIREBASE_SERVICE_ACCOUNT_JSON` in Supabase Edge secrets (not GitHub Actions secrets).

## Deploy (operator)

```bash
supabase functions deploy teamai-task-execute --project-ref srpgzzretfyqdsfclnuo
```

Do not deploy or modify PayPal webhook functions as part of this slice.

## Evidence labels

| Layer | Label |
|---|---|
| Source on branch / PR | IMPLEMENTED |
| Deployed to Supabase project | DEPLOYED |
| Live call with real Firebase ID token + durable completion | RUNTIME-PROVEN |
| Full TEAM-BACKEND-001 | **IN IMPLEMENTATION** |

The live proof above is a bounded runtime gate; it does not by itself close final TEAM-BACKEND-001 HandOver/Endorsement, live PayPal evidence, or frontend read-model integration.
