# TEAM-EXPERIENCE-029 — Seat plate read model (phase 1–2)

**Status:** OPERATING CONTRACT / NOT PRODUCT LAW  
**Date:** 2026-09-07

## Purpose

Give Seats plate (and optional Hero) a **typed, read-only projection** of seat connection health and binding facts without turning the browser into domain authority.

## Health enum (shared)

```text
unknown | offline | degraded | healthy
```

Same labels as Hero `TeamAiHeroSeatStack.setConnectionHealth`. Fixture synonyms such as `ok` / `ready` normalize to `healthy`.

## Source field

| `source` | Meaning |
|----------|---------|
| `fixture` | Local presentation data (current Command Deck) |
| `domain` | Future trusted server/Firestore projection |

`presentationOnly: true` and `durable: false` are always set on the projection object.

## Activation presentation gate

`activationAllowedPresentation` is **UI-only**:

```text
connectionHealth === healthy
AND teamEntitlement === allowed
AND providerEntitlement === allowed
```

It does **not** Activate a seat in Firestore, open provider runtime, or bypass E4/F7.

## Implementation

- Module: `frontend/spatial/seat-read-model.js`
- Seats plate bind: `frontend/spatial/shell-nav.js` (phase 2)
- Skill: `skills/frontend/spatial/seat-read-model/SKILL.md`
- Tests: `tests/seat-read-model.test.mjs`

## Phase 2 status (2026-09-07)

`shell-nav.js` uses `projectSeat` for:

- detail health display (`connectionHealth`)
- Test Connection messaging (`source` + health)
- Activate presentation gate (`activationAllowedPresentation`)
- `applyProjectionToHeroSeatStack` on detail render and after Test Connection (no-op when Hero is not on the page)

Still `source: fixture`. Domain Test connection remains phase 3.

## Out of scope (later phases)

1. Authenticated server **Test connection**
2. Durable health write path
3. Real Activate / entitlement mutation
4. Claiming fixture seats are live domain seats

## WebGL note (traffic)

TeamAi Hero meshes are **static JS mesh tables** under `public/` (not binary blobs in Firestore, not large `.gltf` in the repo). Mass concurrent users stress **CDN/static hosting and client GPU**, not mesh-in-database bandwidth. Seat **health metadata** must stay small text projections — never embed mesh assets in transactional reads.

GitHub Pages bandwidth soft limits matter only if heavy binary assets are added later; current Hero geometry is compact authored arrays + procedural shapes.

## Phase ladder

1. Read model module + shared health enum — **done** (#112)
2. Seats plate bind to projection in `shell-nav.js` — **this PR**
3. Server Test connection → domain health
4. Activate gate against domain projection
5. Optional stronger Hero mirror when Deck and Hero share a session
