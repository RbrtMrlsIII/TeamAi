# TeamAi User Manual — Seats, Web AI assignment, and what to deploy before hosting

**Audience:** operators, founders, and new sessions setting up TeamAi  
**Authority:** Product Law (identity ≠ provider ≠ seat ≠ entitlement)  
**Date:** 2026-09-07

This guide answers two questions:

1. How does a user **attach / assign a Web AI** to a **specific seat**?
2. What must you **check and deploy in the CLI** before the product is usable in hosting?

---

## 1. How a Web AI is attached to a seat

### 1.1 Mental model (Product Law)

These are **not** the same thing:

| Term | Meaning |
|------|---------|
| **User account** | Firebase Auth identity (UID). How a human signs in. |
| **Web AI Seat** | TeamAi participation slot on a Workplace/Project (role, skills, limits, connection). |
| **Provider / application** | External AI product (OpenAI, Anthropic, etc.). TeamAi does **not** own that account. |
| **Model** | Specific model id under a provider. |
| **Connection** | Live link + health between the seat and the provider runtime. |
| **Entitlement** | Permission: TeamAi entitlement **and** provider entitlement are separate. |

```text
Human logs in (Firebase)
        ↓
Chooses Workplace / Project
        ↓
Configures a Seat (identity + role + responsibility)
        ↓
Binds provider + model (+ credentials path on server)
        ↓
Test Connection (server probe → optional durable health)
        ↓
Activate / scheduler eligibility (backend-owned; not a browser write)
```

**Users do not “log in with an API key.”**  
They log in as themselves. API keys (or OAuth tokens) are used by the **server** to talk to providers for that seat’s binding.

### 1.2 What “assign a Web AI to a seat” means

Assigning means configuring the **Responsibility Profile** on that seat:

```text
Seat
  → name / role (planning, worker, reviewer, …)
  → provider + model
  → team quality (skill bundle) vs tool quality (MCP/tools) — distinct
  → limits (budget, rate, storage, approval gates)
  → team entitlement + provider entitlement
  → connection health (from server Test Connection, not from UI guesswork)
```

The **scheduler** later picks which seat may act; the user does not make the browser the scheduler.

### 1.3 What the product UI does today vs later

| Step | Today (presentation + backend slices) | Target product behavior |
|------|----------------------------------------|-------------------------|
| Open **Seats** plate | Fixture seats (Alpha / Beta / Gamma) for layout and gates | List durable seats under the signed-in UID’s Workplace/Project |
| Edit binding | UI shows provider/model fields as display facts | Settings draft → **Save** writes durable seat config (read/write economy) |
| **Test Connection** | Wired to Edge when `TEAMAI_SEAT_CONNECTION_BASE_URL` + Firebase ID token set; else fixture | Always server probe; durable health when workplace + project ids present |
| **Activate Seat** | Presentation gate only (`activationAllowedPresentation`) | Backend Activate / entitlement path — not browser self-grant |
| Provider credentials | Platform Edge secrets for HTTP probe; per-seat secrets still evolving | Server-stored seat credentials or OAuth; never required as “login” |

**Operator tip:** For live Test Connection + durable health you need:

1. User signed in (Firebase ID token)  
2. Edge function deployed  
3. Optional: `window.TEAMAI_SEAT_CONNECTION_BASE_URL`, `TEAMAI_FIREBASE_ID_TOKEN`, `TEAMAI_WORKPLACE_ID`, `TEAMAI_PROJECT_ID`  
4. Optional secrets: `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` for real HTTP probes  

See `docs/DEPLOY_SEAT_CONNECTION_TEST.md` and `docs/TEAM-EXPERIENCE-029_SEAT_CONNECTION_TEST.md`.

### 1.4 Simple user-facing story

1. **Sign in** to TeamAi (Firebase).  
2. Open a **Workplace** and **Project**.  
3. Open **Seats** and select a seat (or create one when seat CRUD is live).  
4. Choose **provider** and **model** for that seat; save configuration (durable, not every keystroke).  
5. Press **Test Connection** — server checks health; browser only displays the result.  
6. When connection + entitlements allow, **Activate** is a backend-gated action (approvals may apply).  
7. Scheduler assigns **tasks** to eligible seats — that is not the same as “binding the Web AI.”

---

## 2. Pre-hosting checklist (look for these before go-live)

Work top to bottom. Skip only what you intentionally defer.

### 2.1 Identity & Firebase

| Check | Why |
|-------|-----|
| Firebase project is the intended one (`team-ai-official` in Product Law / current Edge code) | Wrong project = wrong Auth + Firestore |
| Authentication providers enabled (email, Google, … as product requires) | Users cannot sign in without this |
| Firestore `(default)` available | Canonical durable state |
| Web app Firebase config (`projectId`, apiKey public config) matches that project | Hosting must talk to the same project |
| Service account JSON available for Edge (secret, never in git) | Edge reads/writes Firestore and verifies tokens |

### 2.2 Supabase (trusted execution)

| Check | Why |
|-------|-----|
| You know the **project ref** (dashboard → Project Settings; **not** required in the git repo) | Deploy commands need `--project-ref` |
| CLI logged in (`npx supabase login`) | One-time per machine |
| Secret `FIREBASE_SERVICE_ACCOUNT_JSON` set on the project | Required by task-execute and seat-connection-test |
| Optional `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` | Only if you want real HTTP provider probes |
| Functions deployed that you actually need (see §3) | Merging to GitHub does **not** deploy Edge |

### 2.3 Web delivery

| Check | Why |
|-------|-----|
| Hosting target decided (Firebase Hosting is current Product Law delivery; GitHub Pages used for spatial UI demos) | Avoid pointing users at a dead or paused surface (e.g. Vercel is non-authoritative / paused) |
| Static spatial UI applies seat plate scripts if using Pages | CI/Pages run `seat:connection:wire` before package |
| CORS / token flow understood for browser → Edge | Browser sends Firebase Bearer token; Edge uses `--no-verify-jwt` and verifies Firebase itself |

### 2.4 Product gates

| Check | Why |
|-------|-----|
| You are not treating the browser as Firestore write authority for seats, leases, or health | Product Law |
| Commerce / PayPal only if that gate is intentionally in scope | Many slices explicitly exclude PayPal |
| CI green on `main` (TeamAi tests + Playwright + recovery) | Engineering verification before claiming runtime readiness |

---

## 3. CLI deploy manual (what to run, and how often)

### 3.1 One-time (per machine / per project)

```bash
# Install CLI if needed (npx can also run without global install)
npm i -g supabase   # optional

# Log in once
npx supabase login

# Optional: link local folder to remote project
npx supabase link --project-ref <YOUR_PROJECT_REF>
```

**Secrets (once, or when rotating):**

```bash
npx supabase secrets set FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}' \
  --project-ref <YOUR_PROJECT_REF>

# Optional — real HTTP probes
npx supabase secrets set OPENAI_API_KEY=sk-... --project-ref <YOUR_PROJECT_REF>
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref <YOUR_PROJECT_REF>
```

### 3.2 Deploy Edge Functions (per function, when code changes)

Merging PRs updates **GitHub only**. Deploy each function you need live:

```bash
# Task path (lease + stub execution) — already used in earlier backend endorsement
npx supabase functions deploy teamai-task-execute \
  --project-ref <YOUR_PROJECT_REF> \
  --no-verify-jwt

# Seat connection test (probe + optional durable health + HTTP provider check)
npx supabase functions deploy teamai-seat-connection-test \
  --project-ref <YOUR_PROJECT_REF> \
  --no-verify-jwt
```

**Why `--no-verify-jwt`?**  
Supabase would otherwise expect a Supabase JWT. TeamAi Edge functions verify the **Firebase ID token** themselves (same pattern as `teamai-task-execute`).

**How often?**  
- Redeploy a function when **that** function’s source on `main` changes.  
- You do **not** need to redeploy every function after every PR.

### 3.3 Smoke tests (after deploy)

```bash
export TOKEN='<Firebase ID token from a test user>'

# Task execute (requires workplaceId + projectId)
curl -sS -X POST \
  "https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/teamai-task-execute" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"workplaceId":"wp-demo","projectId":"proj-demo"}'

# Seat connection — projection only
curl -sS -X POST \
  "https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/teamai-seat-connection-test" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"seatId":"alpha","probeMode":"stub"}'

# Seat connection — durable write + optional HTTP
curl -sS -X POST \
  "https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/teamai-seat-connection-test" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"seatId":"alpha","workplaceId":"wp-demo","projectId":"proj-demo","providerKind":"openai","probeMode":"auto"}'
```

### 3.4 Repo-side checks (no Supabase required)

```bash
git pull origin main
npm test                 # includes seat plate apply + unit tests
npm run test:e2e         # Playwright when you want browser verification
```

---

## 4. Function inventory (what exists vs what must be live)

| Function | Role | Deploy when |
|----------|------|-------------|
| `teamai-task-execute` | Authenticated task create/lease/stub result | Backend task path in production |
| `teamai-seat-connection-test` | Seat probe, optional durable health, optional HTTP provider health | Seats Test Connection in production |
| `teamai-domain-bootstrap` | Domain bootstrap helpers | If your environment still uses it |
| PayPal webhook functions | Commerce only | Only if commerce gate is in scope |

Source of truth for code: `supabase/functions/` on `main`.  
**Project ref is not stored in the repo** (by design). Keep it in your password manager or team ops notes.

---

## 5. Browser config for live Seats plate (operator / demo)

```html
<script>
  window.TEAMAI_SEAT_CONNECTION_BASE_URL = "https://<YOUR_PROJECT_REF>.supabase.co/functions/v1";
  window.TEAMAI_FIREBASE_ID_TOKEN = "<id-token>";
  window.TEAMAI_WORKPLACE_ID = "wp-demo";   // required for durable health write
  window.TEAMAI_PROJECT_ID = "proj-demo";
</script>
```

Without `BASE_URL`, Test Connection stays **fixture-only** (safe for UI demos).

---

## 6. Related docs

| Doc | Topic |
|-----|--------|
| `PRODUCT_LAW.md` | Seats, identity, service authority |
| `docs/DEPLOY_SEAT_CONNECTION_TEST.md` | Seat function deploy + smoke |
| `docs/TEAM-EXPERIENCE-029_SEAT_CONNECTION_TEST.md` | Connection test contract |
| `docs/TEAM-BACKEND-002_READ_WRITE_ECONOMY.md` | Why settings batch on Save |
| `docs/FIREBASE_SETUP_CHECKLIST.md` | Firebase host checklist |
| `docs/FIREBASE_PROJECT_CONFIGURATION.md` | Project identity |

---

## 7. One-page summary

**Assign Web AI to a seat** = configure that seat’s provider/model/role/limits on a Workplace/Project under a signed-in user; test connection on the server; activate under backend rules.

**Before hosting** = correct Firebase project + Auth + Firestore, Supabase secrets, deploy only the Edge functions you need, confirm CI, never put service accounts or API keys in git.

**Deploy cadence** = secrets rarely; each Edge function when **its** code changes; not “redeploy the world” every PR.
