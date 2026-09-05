# TEAM-BACKEND-001 — Authenticated task execute (Edge)

**Status:** IMPLEMENTED (source) — not yet DEPLOYED / RUNTIME-PROVEN on Edge  
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
|-------|----------|--------|
| `workplaceId` | yes | TeamAi workplace document id |
| `projectId` | yes | TeamAi domain project id (not Firebase project id) |
| `taskId` | no | If omitted, a new READY task is created |
| `seatId` | no | default `seat-default` |
| `actorId` | no | default `edge-task-execute` |
| `prompt` | no | echoed into stub result text |

## Response (success 201)

Includes `uid`, `taskId`, `leaseId`, `eventId`, `resultPath`, stub `text`. Explicit note that PayPal is out of scope.

## Secrets

Same as domain bootstrap: `FIREBASE_SERVICE_ACCOUNT_JSON` in Supabase Edge secrets (not GitHub Actions secrets).

## Deploy (operator)

```bash
supabase functions deploy teamai-task-execute --project-ref srpgzzretfyqdsfclnuo
```

Do not deploy or modify PayPal webhook functions as part of this slice.

## Evidence labels

| Layer | Label |
|-------|--------|
| Source on branch / PR | IMPLEMENTED |
| Deployed to Supabase project | DEPLOYED |
| Live call with real Firebase ID token + Firestore writes | RUNTIME-PROVEN |

Isolated Node live probe (lease contention run #7) remains separate evidence for the lease/result stores under GitHub Actions.
