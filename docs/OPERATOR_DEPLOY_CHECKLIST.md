# TeamAi — Master operator deployment checklist

**Audience:** founder / operator on Cloud Shell or laptop  
**Authority:** Product Law · not a 029 production-release claim  
**Parent:** `docs/USER_MANUAL_DEPLOY_AND_SEATS.md` · GitHub detail: `docs/USER_MANUAL_GITHUB_APP_SETUP.md`

| Identity | Value |
|----------|--------|
| Supabase project ref | `srpgzzretfyqdsfclnuo` |
| Firebase project | `team-ai-official` |
| GitHub App | [teamai-devtools](https://github.com/apps/teamai-devtools) |
| Webhook URL | `https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1/teamai-github-webhook` |
| OAuth callback | `https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1/teamai-github-oauth-bind` |
| Repo | https://github.com/RbrtMrlsIII/TeamAi |

Do steps **in order**. Check boxes as you finish.

---

## A. Repo on the machine

```bash
cd ~/TeamAi
git remote -v    # origin → RbrtMrlsIII/TeamAi
git fetch origin
git checkout -B main origin/main
git log -1 --oneline
```

- [ ] On `main` (not old `fix/paypal-…` branch)
- [ ] Nested `TeamAi/TeamAi` clone removed if present
- [ ] For Conn-3 Edge source: either PR **#206** merged, or  
  `git checkout -B feat/029-conn3-github-oauth-uid-bind origin/feat/029-conn3-github-oauth-uid-bind`

---

## B. Firebase

- [ ] Project **team-ai-official**
- [ ] Auth providers enabled as intended
- [ ] Firestore `(default)` exists
- [ ] Service account JSON ready for Edge only (never git / TeamChat / Hero)

---

## C. Supabase login + required secrets

```bash
npx supabase login

npx supabase secrets set FIREBASE_SERVICE_ACCOUNT_JSON='{...paste JSON...}' \
  --project-ref srpgzzretfyqdsfclnuo

npx supabase secrets set TEAMAI_SEAT_SECRET_KEY="$(openssl rand -base64 32)" \
  --project-ref srpgzzretfyqdsfclnuo
```

- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` set
- [ ] `TEAMAI_SEAT_SECRET_KEY` set  
  (rotating this invalidates previously encrypted seat keys)
- [ ] Optional: `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` (platform fallback probes only)

---

## D. GitHub App + webhook secret

```bash
openssl rand -hex 32
# Paste same value on App → Webhook → Secret AND:

npx supabase secrets set GITHUB_WEBHOOK_SECRET='<same-secret>' \
  --project-ref srpgzzretfyqdsfclnuo
```

- [ ] App **teamai-devtools** permissions = Conn-1 matrix (Contents/PR/Issues R+W; Checks/Statuses/Actions Read; no Admin/Secrets)
- [ ] Callback URL = OAuth callback above
- [ ] Webhook URL = webhook URL above
- [ ] Webhook **Active = Off** until section F
- [ ] `GITHUB_WEBHOOK_SECRET` on Edge matches App
- [ ] Optional later: `GITHUB_APP_CLIENT_ID`, `GITHUB_APP_CLIENT_SECRET`, `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` (PEM)

---

## E. Deploy Edge functions

```bash
cd ~/TeamAi

npx supabase functions deploy teamai-task-execute \
  --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt

npx supabase functions deploy teamai-seat-connection-test \
  --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt

npx supabase functions deploy teamai-seat-provider-bind \
  --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt

npx supabase functions deploy teamai-github-webhook \
  --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt

# Conn-3 (only if folder exists on current branch):
npx supabase functions deploy teamai-github-oauth-bind \
  --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt
```

- [ ] Core three (task / seat-test / seat-bind) deployed
- [ ] `teamai-github-webhook` deployed
- [ ] `teamai-github-oauth-bind` deployed (after #206 available)

`--no-verify-jwt` is correct: product auth is **Firebase** ID tokens, not Supabase JWT.

---

## F. Activate GitHub webhook

On [teamai-devtools](https://github.com/apps/teamai-devtools) settings:

- [ ] Webhook URL set to real HTTPS above
- [ ] Content type `application/json`
- [ ] Secret matches Edge
- [ ] Events (individual, not everything): Pushes, Pull requests, PR reviews, PR review comments, Issues, Issue comments, Check runs, Statuses
- [ ] **Active = On**
- [ ] Recent Deliveries shows success (200; may be `unbound` until a Conn-3 bind exists)

---

## G. Smoke (still not 029-released)

- [ ] Seat connection-test with `probeMode: "stub"` works
- [ ] Webhook deliveries not failing HMAC (401) or missing secret (503)
- [ ] Hero **C** is normal-UI handoff only — not OAuth
- [ ] Do not claim 029 product release from Connection alone

---

## H. Deferred (not this deploy pass)

- [ ] App logo / user-preview polish
- [ ] Normal-UI “Connect GitHub” screen
- [ ] Seat equip of GitHub Connection + tool invoke
- [ ] Live installation-token mint for seat GitHub API calls

---

## Function inventory

| Function | Role |
|----------|------|
| `teamai-task-execute` | Task lease + stub execution |
| `teamai-seat-connection-test` | Probe + durable health |
| `teamai-seat-provider-bind` | Encrypt per-seat provider keys |
| `teamai-github-webhook` | Conn-2 HMAC + UID lookup |
| `teamai-github-oauth-bind` | Conn-3 mint UID ↔ installation_id |

## See also

- `docs/USER_MANUAL_DEPLOY_AND_SEATS.md`
- `docs/USER_MANUAL_GITHUB_APP_SETUP.md`
- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md`
