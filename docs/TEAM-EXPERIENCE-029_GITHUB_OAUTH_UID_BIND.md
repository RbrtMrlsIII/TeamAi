# TEAM-EXPERIENCE-029 — GitHub OAuth mint of UID ↔ installation_id (Conn-3)

**Status:** CONTRACT · Edge path implemented on branch; operator deploy logged in USER_MANUAL_DEPLOYMENT.md  
**Not a Hero live bind.** **No 029 production-release claim.**

## Purpose

After the user installs the TeamAi GitHub App and completes install/OAuth, a **trusted Edge** path mints the first durable map:

```text
User clicks Connect GitHub (normal UI — not 3D)
  → GitHub App install + OAuth (user consent)
  → Edge teamai-github-oauth-bind (Firebase ID token required)
  → writes githubInstallationIndex/{installationId}
  → writes accounts/{uid}/githubInstallations/{installationId}
  → Connection becomes bindable for seat equip (still not automatic usable)
```

Conn-2 webhooks **only look up** this map. Conn-3 is the **only** allowed first-write of the index from product flows.

## Ownership

| Concern | Owner |
|---------|--------|
| Identity | Firebase UID (Bearer ID token on Edge) |
| Install + OAuth consent | GitHub (user) |
| First bind write | Supabase Edge trusted execution |
| Secrets (client_id / client_secret / PEM) | Edge env / trusted store — never browser |
| Seat may use Connection | Equip + scope + health + tool policy (later) |

## Non-goals

- Hero keyboard **C** is not OAuth
- Webhook payload must not mint UID
- No Postgres domain column
- No invented callback URL in docs before Edge is deployed (log real URL only in `docs/USER_MANUAL_DEPLOYMENT.md` after deploy)

## Implementation checklist

1. [x] Edge `teamai-github-oauth-bind` (operator-deployed)
2. [x] Server-only write of index + UID-rooted record
3. [x] Contract tests on branch
4. [x] Skill `ws.github.oauth-uid-bind`
5. [x] Operator manual consolidated into `docs/USER_MANUAL_DEPLOYMENT.md`

## See also

- `docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md` (Conn-2)
- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md` (Conn-1)
- `docs/USER_MANUAL_DEPLOYMENT.md`
- `src/backend/github-installation.ts`
