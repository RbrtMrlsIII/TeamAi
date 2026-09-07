# Frontend / Spatial — Seat Connection Test Skill

## WHEN TO USE
Implementing or verifying the path from Seats plate **Test Connection** toward a trusted server projection of connection health.

## INPUT
Firebase ID token (when live), seat id, optional workplace/project ids, Edge/API base URL, 029 seat read model.

## AUTHORITY
Server owns Test connection results. Browser displays `projectSeat(..., { source: 'domain' })` only. No Firestore writes from the browser.

## ACTION
1. Prefer `fetchSeatConnectionProjection` when `baseUrl` is configured.
2. Map server JSON with `mapServerSeatPayload` (forces `source: domain`).
3. Fall back to fixture projection via `preferDomainProjection` when endpoint is unset or offline.
4. Keep health enum aligned with Hero / seat-read-model.
5. Never treat a local click as durable healthy.

## DO NOT
- Call provider APIs from the browser as authority
- Write seat health to Firestore from the browser
- Skip ID token on live endpoints
- Claim RUNTIME-PROVEN provider connectivity from fixture data

## PASS
Client returns null without baseUrl; successful responses become domain projections; activation gate still presentation-only until domain Activate exists.

## EVIDENCE
`frontend/spatial/seat-connection-client.js`, `tests/seat-connection-client.test.mjs`, `docs/TEAM-EXPERIENCE-029_SEAT_CONNECTION_TEST.md`.

## SEE ALSO
`skills/frontend/spatial/seat-read-model/SKILL.md`, `docs/TEAM-EXPERIENCE-029_SEAT_READ_MODEL.md`
