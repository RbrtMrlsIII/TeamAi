# Frontend / Spatial — Seat Read Model Skill

## WHEN TO USE
Implementing or verifying any TeamAi frontend surface that displays Web AI Seat connection health, binding, entitlement flags, or Activate **presentation** eligibility.

## INPUT
Seat facts from a fixture map or a future backend-owned seat projection; 029 spatial primitives; optional Hero stack API.

## AUTHORITY
Domain connection health, entitlement, and scheduler eligibility are owned by TeamAi durable state and trusted server paths. The frontend projects those facts for display only.

## ACTION
1. Normalize health with `normalizeConnectionHealth` to `unknown | offline | degraded | healthy`.
2. Build projections with `projectSeat` / `projectSeatMap` (`source: fixture | domain`).
3. Render Seats plate from the projection; do not invent health from UI clicks alone when `source: domain` is expected.
4. Use `activationAllowedPresentation` only to enable presentation paths (e.g. open E4 preview); never as silent domain Activate.
5. Optionally call `applyProjectionToHeroSeatStack` so Hero badges match the plate — still presentation-only.

## DO NOT
- Write Firestore seat/health/entitlement documents from the browser.
- Call provider APIs from the browser as authoritative Test connection.
- Treat fixture projections as RUNTIME-PROVEN live seats.
- Create a second health vocabulary or theme root for seats.
- Embed 3D mesh binaries in the seat read model or transactional DB reads.

## PASS
Health enum is shared and tested; projections mark `presentationOnly` + `durable: false`; activation UI gate is explicit; browser cannot self-authorize provider connection.

## EVIDENCE
`frontend/spatial/seat-read-model.js`, `tests/seat-read-model.test.mjs`, `docs/TEAM-EXPERIENCE-029_SEAT_READ_MODEL.md`.

## SEE ALSO
- `docs/TEAM-EXPERIENCE-029_SEAT_PLATE_E4_AND_TYPE_SCALE.md`
- `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`
- `skills/frontend/spatial/commerce-read-model/SKILL.md` (same read-model pattern)
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
