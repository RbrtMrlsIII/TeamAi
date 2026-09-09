# Checkpoint — Conn-1 GitHub App least-privilege (2026-09-09)

**Slice:** Conn-1  
**Claim:** planning matrix + skill · **not a live bind** · **no 029-released claim**

## Delivered

- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md` — fill-in for the Create GitHub App form
- `public/github-app-permission-matrix.json` — machine-readable v1 grant / never lists
- `skills/workspace/ws.github.app-least-privilege/SKILL.md`
- Static tests

## Review of current form (screenshots)

- Actions **write** is more than v1 needs → drop to **read**
- Missing Contents / PRs / Issues / Checks / Statuses — App cannot work without them
- Org / Account / Enterprise **No access** — keep
- OAuth during install was **off** — turn **on** (UID bind)
- Webhook Active with empty URL — turn **off** until Edge HTTPS exists
- Install “Any account” — use **Only this account** until public

## Product Law collisions in the marketplace blueprint (not implemented)

- Do not store `github_installation_id` as Postgres domain state
- Do not give AI a SQL role on TeamAi domain
- Do not treat GitHub Actions as the scheduler
- Hero CONNECTION remains presentation; install is normal-UI handoff

## Next

- Conn-2: trusted Edge webhook + UID ↔ installation map in Firestore (still not Hero live bind)
- Keep Cam / DOM Hero work independent
