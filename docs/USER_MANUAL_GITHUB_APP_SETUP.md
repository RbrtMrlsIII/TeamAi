# TeamAi User Manual — GitHub App Connection (human-only steps)

**Audience:** operators / founders creating the GitHub App and Edge secrets  
**Authority:** Conn-1 matrix · Conn-2 webhook map · Conn-3 OAuth mint (planning)  
**Canonical parent:** `docs/USER_MANUAL_DEPLOY_AND_SEATS.md`  
**Status:** OPERATING GUIDE · **no 029 production-release claim**

Hero `SEAT_CONNECTION` / keyboard **C** is **normal-UI handoff only** — not a live OAuth bind.

## 1. Create the GitHub App (outside TeamAi)

1. GitHub → **Settings → Developer settings → GitHub Apps → New GitHub App**.
2. Permissions from `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md` / `public/github-app-permission-matrix.json`:
   - **Metadata** Read
   - **Contents** Read & write
   - **Pull requests** Read & write
   - **Issues** Read & write
   - **Checks** Read
   - **Commit statuses** Read
   - **Actions** Read (**not** write)
   - Administration, Secrets, org/enterprise, … → **No access**
3. **Request user authorization (OAuth) during installation** → **On**
4. **Expire user authorization tokens** → **On**
5. **Webhook Active** → **Off** until a real HTTPS Edge URL exists (**do not invent a URL**)
6. Install scope: **Only this account** until public launch
7. Generate **PEM** once; store only in a trusted secret store (never TeamChat, Hero, browser Firestore, or git)

## 2. Secrets on Supabase Edge (human)

```bash
npx supabase secrets set GITHUB_WEBHOOK_SECRET='<from-GitHub-App-webhook-secret>' \
  --project-ref <REF>
# Alias also accepted: TEAMAI_GITHUB_WEBHOOK_SECRET

# Existing required secrets (already in parent manual):
# FIREBASE_SERVICE_ACCOUNT_JSON
# TEAMAI_SEAT_SECRET_KEY
# Optional platform fallbacks: OPENAI_API_KEY / ANTHROPIC_API_KEY

# Conn-3+ installation tokens (when tool calls need them):
# GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY  — trusted store only
```

## 3. Deploy webhook function (after Conn-2 on main)

```bash
npx supabase functions deploy teamai-github-webhook \
  --project-ref <REF> --no-verify-jwt
```

**Only then** set Webhook **Active** on the App form to:

`https://<project-ref>.supabase.co/functions/v1/teamai-github-webhook`

## 4. What users do inside TeamAi

| Step | Who | Where |
|------|-----|--------|
| Prepare repo | User | GitHub (outside) |
| Install App + OAuth | User | TeamAi normal UI “Connect GitHub” (**Conn-3** mints bind) |
| Equip seat + scope | User | Seat settings |
| Webhook events | Platform | Edge → Firestore lookup (**Conn-2**) |
| GitHub tools | Seat under policy | After equip + health + scopes |

**Conn-2** looks up the map. **Conn-3** mints the first row after OAuth.

## 5. Firestore paths

```text
githubInstallationIndex/{installationId}              # server-only
accounts/{uid}/githubInstallations/{installationId}   # client write false
```

## 6. Operator checklist

- [ ] Permissions match v1 matrix
- [ ] OAuth-on-install **on**
- [ ] Webhook **inactive** until deploy + real HTTPS URL
- [ ] `GITHUB_WEBHOOK_SECRET` on Edge
- [ ] `teamai-github-webhook` deployed
- [ ] PEM never in chat / Hero / client
- [ ] No 029 production-release claim from Connection alone

## Related

- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md`
- `docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md`
- `docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md`
- `skills/workspace/ws.github.app-least-privilege/SKILL.md`
- `skills/workspace/ws.github.webhook-uid-map/SKILL.md`
- `skills/workspace/ws.github.oauth-uid-bind/SKILL.md`
