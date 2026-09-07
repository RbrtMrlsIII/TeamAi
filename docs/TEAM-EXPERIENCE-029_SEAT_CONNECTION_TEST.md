# TEAM-EXPERIENCE-029 — Seat connection Test (phase 3–5)

**Status:** OPERATING CONTRACT / NOT PRODUCT LAW  
**Date:** 2026-09-07

## Purpose

Move connection health from **fixture-only** presentation toward a **trusted server projection**, without making the browser the write authority.

## Authority

| Layer | Owns |
|-------|------|
| Firebase Auth | Identity / ID token |
| Edge Function `teamai-seat-connection-test` | Authenticated probe + projection JSON |
| Firestore | Optional durable seat read; durable health **write** still later |
| Browser | Display only |

## Phase 5 — Plate wire

`frontend/spatial/seat-connection-wire.js` + `scripts/apply-seat-connection-wire.mjs`

When the Seats plate **Test Connection** is pressed:

1. Build fixture projection (`source: fixture`).
2. If `window.TEAMAI_SEAT_CONNECTION_BASE_URL` is **unset** → fixture message (unchanged UX).
3. If set → `fetchSeatConnectionProjection` with optional `TEAMAI_FIREBASE_ID_TOKEN`.
4. Prefer domain projection; update result line + optional Hero health mirror.
5. On HTTP error → show failure text; keep fixture health for display recovery.

### Browser config (optional)

```js
window.TEAMAI_SEAT_CONNECTION_BASE_URL = "https://<ref>.supabase.co/functions/v1";
window.TEAMAI_FIREBASE_ID_TOKEN = "<id-token>"; // required for live Edge
window.TEAMAI_WORKPLACE_ID = "…"; // optional durable path
window.TEAMAI_PROJECT_ID = "…";
```

CI / Pages run `npm run seat:connection:wire` (includes phase2) before tests/deploy. Local `git pull` not required for this slice.

## Edge Function (phase 4)

`POST /functions/v1/teamai-seat-connection-test` with Firebase Bearer token. See `docs/DEPLOY_SEAT_CONNECTION_TEST.md`.

## Not yet

- Durable connection-health **write** path
- Real provider runtime probes
- Browser Activate authority

## Phase ladder

1. Read model — done
2. Seats plate bind + Pages apply — done
3. Client + contract — done
4. Edge Function stub — done
5. **Plate Test Connection wire — this PR**
6. Durable health write + real provider probe (later)
