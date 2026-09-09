# TEAM-EXPERIENCE-029 — GitHub OAuth mint of UID ↔ installation_id (Conn-3)

**Status:** CONTRACT / PLANNING SKELETON (not implemented runtime)  
**Not a Hero live bind.** **No 029 production-release claim.**

## Purpose

After the user installs the TeamAi GitHub App and completes **user-to-server OAuth**, a **trusted Edge** path mints the first durable map:

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
- No invented callback URL in docs before Edge is deployed (log real URL only in `USER_MANUAL_DEPLOY_AND_SEATS.md` after deploy)

## Implementation checklist (when coding)

1. [ ] Edge `teamai-github-oauth-bind`: verify Firebase ID token → extract `installation_id` + OAuth code exchange
2. [ ] Server-only write of index + UID-rooted record via `bindGitHubInstallation`
3. [ ] Tests: no client write path; no mint from webhook skill
4. [ ] Skill `ws.github.oauth-uid-bind`
5. [ ] User manual §12 updated with real callback URL after deploy only

## See also

- `docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md` (Conn-2)
- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md` (Conn-1)
- `docs/USER_MANUAL_DEPLOY_AND_SEATS.md` §12
- `src/backend/github-installation.ts`
