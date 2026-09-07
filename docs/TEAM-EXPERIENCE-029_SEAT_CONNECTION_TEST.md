# TEAM-EXPERIENCE-029 — Seat connection Test (phase 3–4)

**Status:** OPERATING CONTRACT / NOT PRODUCT LAW  
**Date:** 2026-09-07

## Purpose

Move connection health from **fixture-only** presentation toward a **trusted server projection**, without making the browser the write authority.

## CLI note (phase 2)

Local `npm run seat:plate:phase2` + commit is **optional**. CI and GitHub Pages already apply the bind. No early `git pull` required for this backend slice.

## Authority

| Layer | Owns |
|-------|------|
| Firebase Auth | Identity / ID token |
| Edge Function `teamai-seat-connection-test` | Authenticated probe + projection JSON |
| Firestore | Optional durable seat read; durable health **write** still later |
| Browser | Display only |

## Phase 4 Edge Function

**Path:** `POST /functions/v1/teamai-seat-connection-test`  
**Auth:** `Authorization: Bearer <Firebase ID token>`  
**Deploy (when you are ready):**

```bash
npx supabase functions deploy teamai-seat-connection-test --project-ref <ref> --no-verify-jwt
```

(`--no-verify-jwt` matches `teamai-task-execute`: function verifies Firebase ID token itself.)

### Behavior

1. Verify Firebase UID (same JWKS path as task-execute).
2. If `workplaceId` + `projectId` provided, try read  
   `accounts/{uid}/workplaces/.../projects/.../seats/{seatId}`.
3. Else (or on miss): **stub catalog** (alpha healthy, gamma degraded, …).
4. Return JSON projection — **no external provider call**, **no durable health write**.

### Response shape (client-compatible)

```json
{
  "ok": true,
  "phase": "seat_connection_test",
  "uid": "…",
  "seatId": "alpha",
  "connectionHealth": "healthy",
  "teamEntitlement": "allowed",
  "providerEntitlement": "allowed",
  "source": "domain-stub",
  "probe": "stub-edge-runtime",
  "probedAt": "…"
}
```

Client maps via `mapServerSeatPayload` → `projectSeat(..., { source: 'domain' })`.

## Client module

`frontend/spatial/seat-connection-client.js`

- `fetchSeatConnectionProjection({ baseUrl, idToken, seatId, … })`
- Returns `null` when `baseUrl` is unset (plate stays fixture)

## Not yet

- Durable connection-health write path
- Real provider runtime probes
- Plate button auto-wired to live baseUrl (next thin slice)
- Browser Activate authority

## Phase ladder

1. Read model — done
2. Seats plate bind + Pages apply — done
3. Client + contract — done (#115)
4. **Edge Function stub probe — this PR**
5. Wire plate Test Connection when `baseUrl` configured
6. Durable health write + real provider probe (later)
