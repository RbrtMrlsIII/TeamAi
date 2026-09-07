# TEAM-EXPERIENCE-029 — Seat connection Test (phase 3)

**Status:** OPERATING CONTRACT / NOT PRODUCT LAW  
**Date:** 2026-09-07

## Purpose

Move connection health from **fixture-only** presentation toward a **trusted server projection**, without making the browser the write authority.

## CLI note (phase 2 follow-up)

You do **not** need to run this on your machine for GitHub/`main` to work:

```bash
npm run seat:plate:phase2
git add frontend/spatial/shell-nav.js
git commit -m "chore(029): commit applied Seats plate phase2 bind"
```

That commit is **optional**. CI and GitHub Pages already run the apply script. Use it only for a local static preview that must match production without re-applying.

## Authority

| Layer | Owns |
|-------|------|
| Firebase Auth | Identity / ID token |
| Trusted Edge/API | Test connection probe + durable health write (future) |
| Firestore | Durable seat/connection facts (future write path) |
| Browser | Display projection only |

## Client module

`frontend/spatial/seat-connection-client.js`

- `fetchSeatConnectionProjection({ baseUrl, idToken, seatId, … })`
- Returns `null` when `baseUrl` is unset (plate stays fixture)
- On HTTP success, maps body through `mapServerSeatPayload` → `projectSeat(…, { source: 'domain' })`
- Shared health enum: `unknown | offline | degraded | healthy`

## Expected server response (JSON)

```json
{
  "seatId": "alpha",
  "name": "Alpha",
  "connectionHealth": "healthy",
  "teamEntitlement": "allowed",
  "providerEntitlement": "allowed",
  "provider": "…",
  "model": "…"
}
```

Default path: `POST {baseUrl}/teamai-seat-connection-test` with `Authorization: Bearer <Firebase ID token>`.

## Not in phase 3

- Deployed Edge Function implementation (next slice)
- Durable Firestore health writes
- Real provider runtime probes
- Browser self-authorizing Activate

## Phase ladder

1. Read model — done
2. Seats plate bind + Pages apply — done
3. **Client + contract for domain projection — this PR**
4. Edge Function `teamai-seat-connection-test` (auth + stub/real probe)
5. Wire plate Test Connection button to client when `baseUrl` configured
