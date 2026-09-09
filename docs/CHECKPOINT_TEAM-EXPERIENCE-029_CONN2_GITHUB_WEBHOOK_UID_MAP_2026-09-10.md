# Checkpoint — Conn-2 GitHub webhook + UID map (2026-09-10)

**Slice:** Conn-2 (follows Conn-1 / #200)  
**Issue:** #201  
**Boundaries:** not a Hero live bind · no production-release claim for 029 · webhook inactive until real HTTPS URL

## Landed in this PR

| Deliverable | Path |
|-------------|------|
| Path + HMAC helpers | `src/backend/github-installation.ts` |
| Edge webhook | `supabase/functions/teamai-github-webhook/index.ts` |
| Contract | `docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md` |
| Skill | `skills/workspace/ws.github.webhook-uid-map/SKILL.md` |
| Tests | `tests/github-webhook-uid-map.test.mjs` |
| Rules | `firestore.rules` (client write false on installation paths) |
| Path helpers | `src/backend/firestore-paths.ts` |
| Law / Knowledge / Masterplan | amended for Connection map + anti-patterns |

## Explicit deferred

- Conn-3: OAuth mint of first index row
- Live Edge deploy + App form webhook Active
- Seat equip / tool invoke against GitHub Connection
- Hero live bind

## Next

Conn-3 OAuth bind path, or continue Masterplan empty checks under existing deploy status file only.
