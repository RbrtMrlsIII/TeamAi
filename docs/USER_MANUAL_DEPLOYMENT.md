# TeamAi User Manual — Deployment

**Canonical single file:** `docs/USER_MANUAL_DEPLOYMENT.md`  
**Supersedes (deleted):** `USER_MANUAL_DEPLOY_AND_SEATS.md`, `USER_MANUAL_GITHUB_APP_SETUP.md`, `OPERATOR_DEPLOY_CHECKLIST.md`  
**Status:** OPERATING GUIDE · **no 029 production-release claim**  
**Authority:** Product Law (identity ≠ provider ≠ seat ≠ entitlement)

| Identity | Value |
|----------|--------|
| Supabase project ref | `srpgzzretfyqdsfclnuo` |
| Firebase project | `team-ai-official` |
| GitHub App | [teamai-devtools](https://github.com/apps/teamai-devtools) |
| Edge base | `https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1` |
| Webhook URL | `https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1/teamai-github-webhook` |
| OAuth callback | `https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1/teamai-github-oauth-bind` |
| Repo | https://github.com/RbrtMrlsIII/TeamAi |

Hero keyboard **C** / `SEAT_CONNECTION` = normal-UI handoff only — **not** OAuth / live bind.

---

## 1. Mental model (seats & keys)

| Term | Meaning | Is not |
|------|---------|--------|
| User account | Firebase Auth | Provider billing |
| Web AI Seat | Participation slot | Your ChatGPT app session |
| Provider | OpenAI, Anthropic, … | TeamAi itself |
| API key | Edge credential for provider | TeamAi password |
| `TEAMAI_SEAT_SECRET_KEY` | Encrypts per-seat keys at rest | Any provider key |
| Platform key | Optional operator fallback | Default for every seat |

```text
Human logs in (Firebase) → Workplace/Project → Seat
  → optional: bind USER API key → Edge encrypts → lastFour only in UI
  → Test Connection → Activate (backend-gated)
```

**Credential order (probes):** stub → seat key → platform env → stub fallback.

Operators must **not** paste personal agent keys into every seat.

---

## 2. Supabase secrets

```bash
npx supabase login

npx supabase secrets set FIREBASE_SERVICE_ACCOUNT_JSON='{...}' \
  --project-ref srpgzzretfyqdsfclnuo

npx supabase secrets set TEAMAI_SEAT_SECRET_KEY="$(openssl rand -base64 32)" \
  --project-ref srpgzzretfyqdsfclnuo

# GitHub webhook (same value as App Webhook Secret field)
openssl rand -hex 32
npx supabase secrets set GITHUB_WEBHOOK_SECRET='<secret>' \
  --project-ref srpgzzretfyqdsfclnuo

# Optional platform LLM fallbacks
# npx supabase secrets set OPENAI_API_KEY='sk-...' --project-ref srpgzzretfyqdsfclnuo
# npx supabase secrets set ANTHROPIC_API_KEY='...' --project-ref srpgzzretfyqdsfclnuo

# Optional Conn-3+ (code exchange / install tokens)
# GITHUB_APP_CLIENT_ID, GITHUB_APP_CLIENT_SECRET
# GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY
```

List: `npx supabase secrets list --project-ref srpgzzretfyqdsfclnuo`

---

## 3. Deploy Edge functions

```bash
cd ~/TeamAi
git fetch origin && git checkout -B main origin/main

npx supabase functions deploy teamai-task-execute \
  --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt
npx supabase functions deploy teamai-seat-connection-test \
  --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt
npx supabase functions deploy teamai-seat-provider-bind \
  --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt
npx supabase functions deploy teamai-github-webhook \
  --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt
npx supabase functions deploy teamai-github-oauth-bind \
  --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt
```

`--no-verify-jwt`: product auth is **Firebase** ID tokens inside the function.

| Function | Role |
|----------|------|
| `teamai-task-execute` | Task lease + stub |
| `teamai-seat-connection-test` | Probe + durable health |
| `teamai-seat-provider-bind` | Per-seat encrypted API key |
| `teamai-github-webhook` | Conn-2 HMAC + UID **lookup** |
| `teamai-github-oauth-bind` | Conn-3 mint UID ↔ installation_id |
| `teamai-domain-bootstrap` | Domain bootstrap |
| `teamai-commerce-intent` / PayPal webhooks | Commerce |

List: `npx supabase functions list --project-ref srpgzzretfyqdsfclnuo`

---

## 4. GitHub App (teamai-devtools)

1. Permissions (Conn-1 matrix): Metadata Read; Contents/PR/Issues R+W; Checks/Statuses/Actions **Read**; **no** Admin/Secrets/org.
2. OAuth during installation **On**; expire user tokens **On**.
3. Callback URL = OAuth callback above.
4. Webhook URL = webhook URL above; content-type `application/json`.
5. Webhook secret = `GITHUB_WEBHOOK_SECRET`.
6. Webhook **Active = Off** until function deployed; then **On**.
7. Events (individual, not everything): Pushes, Pull requests, PR reviews, PR review comments, Issues, Issue comments, Check runs, Statuses.
8. Install scope: only this account until public.
9. PEM private key → trusted store only (never chat/Hero/git).

Detail matrix: `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md`.

---

## 5. Master checklist (order)

### A. Repo
- [ ] `cd ~/TeamAi && git pull origin main`
- [ ] Not stuck on old `fix/paypal-…` branch

### B. Firebase
- [ ] Project `team-ai-official`; Auth + Firestore `(default)`
- [ ] Service account JSON on Edge only

### C. Secrets
- [x] `FIREBASE_SERVICE_ACCOUNT_JSON` (operator verified 2026-09-10)
- [x] `TEAMAI_SEAT_SECRET_KEY`
- [x] `GITHUB_WEBHOOK_SECRET`
- [ ] Optional GitHub client id/secret / PEM when needed

### D. Functions
- [x] Core seat + task
- [x] `teamai-github-webhook`
- [x] `teamai-github-oauth-bind`
- [x] Commerce / PayPal (pre-existing)

### E. Activate webhook
- [ ] URL + secret match; Active **On**
- [ ] Individual events selected
- [ ] Recent Deliveries = 200 (not 401/503)

### F. Smoke
- [ ] Seat `probeMode: "stub"` if using seats
- [ ] No 029 production-release claim from Connection alone

### G. Deferred
- [ ] App logo / user-preview
- [ ] Normal-UI “Connect GitHub”
- [ ] Seat equip + GitHub tool invoke
- [ ] Installation-token mint for live API

---

## 6. CLI cheat sheet

```bash
# Repo
git fetch origin && git checkout -B main origin/main && git pull origin main
git log -1 --oneline && git status

# Supabase
npx supabase login
npx supabase secrets list --project-ref srpgzzretfyqdsfclnuo
npx supabase functions list --project-ref srpgzzretfyqdsfclnuo

# Redeploy one
npx supabase functions deploy NAME --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt

# Reachability (expect 401 without proper auth — proves function is up)
curl -sS -o /dev/null -w "%{http_code}\n" -X POST \
  "https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1/teamai-github-webhook" \
  -H "content-type: application/json" -d '{}'
```

---

## 7. Firestore paths (operators)

```text
accounts/{uid}/workplaces/{w}/projects/{p}/seats/{seatId}
accounts/{uid}/…/seats/{seatId}/secrets/providerApiKey   # never full key to browser

githubInstallationIndex/{installationId}                 # server-only
accounts/{uid}/githubInstallations/{installationId}      # client write false
```

---

## 8. Live status log (2026-09-10)

Operator dashboard confirmed secrets + all GitHub/seat/task Edge functions **deployed**.  
Remaining human step: **turn App webhook Active** and confirm deliveries.

---

## 9. Related (not this file)

- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md` — permission matrix
- `docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md` — Conn-2
- `docs/TEAM-EXPERIENCE-029_GITHUB_OAUTH_UID_BIND.md` — Conn-3
- `docs/TEAM-EXPERIENCE-029_SEAT_PROVIDER_KEY_BIND.md` — seat keys
- `PRODUCT_LAW.md` — identity ≠ provider ≠ seat ≠ entitlement

**no 029-released claim**

---

## 10. Human-only MASTERPLAN remainders

Agents must **not** auto-check these. They stay empty until an operator records evidence. Flagged here so later sessions do not invent a second deploy file.

| MASTERPLAN / Conn item | Why it stays empty | Operator command |
|------------------------|--------------------|------------------|
| TEAM-BACKEND-001 **item 7** | Gate 4 Firebase emulator/rules is PARKED; source checks ≠ emulator PASS | Run emulator-capable verification; record a real PASS |
| TEAM-BACKEND-001 **item 13** | Real provider/runtime invocation is not authorized as a deploy-only step | Wait for a named provider-runtime contract |
| TEAM-BACKEND-001 **item 14** | Broader security/failure/recovery matrix still open beyond bounded recorded paths | Independent evidence packet |
| TEAM-BACKEND-001 **item 17** | 029 release hold | All `BLOCKS_029` gates evidenced first |
| Conn-3 checklist **item 9** | Live Edge still served HTML as of 2026-09-10; `main` source is HTTP 303 | `npx supabase functions deploy teamai-github-oauth-bind --project-ref srpgzzretfyqdsfclnuo --no-verify-jwt` |
| Conn-3 checklist **item 10–12** | Browser return + POST bind + acceptance | After the 303 deploy: install → land on `/hero/?github=installed` → signed-in POST → Firestore re-read |
| Webhook Active | Human App-form toggle | Turn webhook **On** after URL + secret match; confirm Recent Deliveries = 200 |

Canonical destination after GET 303: `https://rbrtmrlsiii.github.io/TeamAi/hero/` (trailing slash). Receipt is presentation-only; it does not mint UID.

TEAM-EXPERIENCE-029 visual-system checklist items 1–10 remain empty because 029 is still held by item 17. Spatial V3.5 is presentation continuity, not that visual-law completion.

**Do not create another deployment file.**

