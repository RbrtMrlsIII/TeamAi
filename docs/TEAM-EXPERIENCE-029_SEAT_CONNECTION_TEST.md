# TEAM-EXPERIENCE-029 — Seat connection Test (phase 3–6)

**Status:** OPERATING CONTRACT / NOT PRODUCT LAW  
**Date:** 2026-09-07

## Purpose

Trusted server projection of seat connection health, with optional **server-side durable write**. The browser never writes Firestore for connection health.

## Authority

| Layer | Owns |
|-------|------|
| Firebase Auth | Identity / ID token |
| Edge `teamai-seat-connection-test` | Probe + optional durable health write |
| Firestore | Seat doc + create-only `connection-tests/{probeId}` |
| Browser | Display only |

## Phase 6 — Durable health write

When **both** `workplaceId` and `projectId` are present (and `persist !== false`):

1. Run `runConnectionProbe()` (currently **stub-edge-runtime**; seam ready for real provider HTTP later).
2. **Create-only** event:  
   `accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/seats/{seatId}/connection-tests/{probeId}`
3. **Patch** existing seat or **create** seat with:
   - `connectionHealth`
   - `lastProbedAt`, `lastProbeId`, `lastProbe`, `lastProbeDetail`
4. Return projection with `durableWritten: true`, `source: "domain-durable"`.

Without workplace/project → projection only (`domain-stub` / `domain-read`), **no write** (read/write economy).

### Probe seam (not full external provider yet)

```text
runConnectionProbe({ provider, model, baselineHealth, forceHealth? })
  → { connectionHealth, probe, probeDetail }
```

Today: stub (baseline or `forceHealth` for harnesses).  
Later: same function body can call a real provider health endpoint without changing the durable write shape.

### Request body

```json
{
  "seatId": "alpha",
  "workplaceId": "wp-1",
  "projectId": "proj-1",
  "persist": true,
  "forceHealth": "healthy"
}
```

### Deploy

```bash
npx supabase functions deploy teamai-seat-connection-test --project-ref <ref> --no-verify-jwt
```

See `docs/DEPLOY_SEAT_CONNECTION_TEST.md`.

## Plate wire (phase 5)

Browser uses `seat-connection-wire.js`. Config:

```js
window.TEAMAI_SEAT_CONNECTION_BASE_URL = "https://<ref>.supabase.co/functions/v1";
window.TEAMAI_FIREBASE_ID_TOKEN = "…";
window.TEAMAI_WORKPLACE_ID = "wp-1";  // required for durable write
window.TEAMAI_PROJECT_ID = "proj-1";
```

## Not yet

- Real external provider HTTP probe inside `runConnectionProbe`
- Browser Activate / entitlement mutation
- PayPal / commerce

## Phase ladder

1–5 done (read model → plate wire)  
6. **Durable health write + probe seam — this PR**  
7. Real provider probe implementation (same Edge path)
