# TeamAi User Manual — Seats, Web AI assignment, and what to deploy before hosting

**Audience:** operators, founders, and new sessions setting up TeamAi  
**Authority:** Product Law (identity ≠ provider ≠ seat ≠ entitlement)  
**Date:** 2026-09-07

This guide answers:

1. How a user **attach / assign a Web AI** to a **specific seat** (including **their own API key**)
2. What to **check and deploy in the CLI** before hosting

---

## 1. How a Web AI is attached to a seat

### 1.1 Mental model

| Term | Meaning |
|------|---------|
| **User account** | Firebase Auth (TeamAi login) |
| **Web AI Seat** | Participation slot on a Workplace/Project |
| **Provider / model** | External LLM product |
| **API key** | Server-side credential for that provider — **not** TeamAi login |
| **Consumer app account** | ChatGPT/Claude mobile app — **not** usable as TeamAi API auth |

```text
Human logs in (Firebase)
  → Workplace / Project
  → Seat configuration (role, limits)
  → Bind provider + model
  → Optional: paste USER API key into local draft → Save
       → Edge encrypts + stores server-only
  → Test Connection (server)
  → Activate (backend-gated)
```

### 1.2 Per-seat API key (user-owned)

Users **can** bring their own OpenAI/Anthropic API key for a seat:

1. Get the key from [OpenAI API keys](https://platform.openai.com/api-keys) or [Anthropic Console](https://console.anthropic.com) (API billing/credits required for live calls).
2. In TeamAi, open seat provider settings (when UI is wired) or call the bind client/Edge Save path.
3. Key stays in a **local draft** until **Save**.
4. Save sends the key **once** to `teamai-seat-provider-bind` with the Firebase ID token.
5. Server stores **encrypted** ciphertext; UI only ever sees `providerKeyLastFour`.

They **cannot** use “logged into the ChatGPT app” as the seat credential.

Details: `docs/TEAM-EXPERIENCE-029_SEAT_PROVIDER_KEY_BIND.md`.

### 1.3 Platform key vs seat key

| Source | Use |
|--------|-----|
| Supabase `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` | Optional **platform** fallback for probes |
| Per-seat bound key | **User/team** credential for that seat |
| Stub probe | No provider billing |

---

## 2. Pre-hosting checklist

### Firebase
- Correct project + Auth providers + Firestore `(default)`
- Service account JSON for Edge (secret, not in git)

### Supabase
- Know **project ref** (dashboard; not required in git)
- `npx supabase login` once per machine
- Secrets:
  - `FIREBASE_SERVICE_ACCOUNT_JSON` (required)
  - `TEAMAI_SEAT_SECRET_KEY` (required for per-seat key bind)
  - Optional: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` (platform probe fallback)

### Product gates
- Browser is not Firestore write authority for secrets, leases, or health
- CI green on `main`

---

## 3. CLI deploy

### One-time

```bash
npx supabase login
npx supabase secrets set FIREBASE_SERVICE_ACCOUNT_JSON='{...}' --project-ref <REF>
npx supabase secrets set TEAMAI_SEAT_SECRET_KEY='long-random-string' --project-ref <REF>
# optional platform probe keys
npx supabase secrets set OPENAI_API_KEY=sk-... --project-ref <REF>
```

### Per function (when that function’s code changes)

```bash
npx supabase functions deploy teamai-task-execute --project-ref <REF> --no-verify-jwt
npx supabase functions deploy teamai-seat-connection-test --project-ref <REF> --no-verify-jwt
npx supabase functions deploy teamai-seat-provider-bind --project-ref <REF> --no-verify-jwt
```

`--no-verify-jwt`: functions verify **Firebase** ID tokens themselves.

---

## 4. Function inventory

| Function | Role |
|----------|------|
| `teamai-task-execute` | Task lease + stub execution |
| `teamai-seat-connection-test` | Connection probe + durable health |
| `teamai-seat-provider-bind` | Per-seat encrypted API key bind |

---

## 5. Related docs

- `docs/TEAM-EXPERIENCE-029_SEAT_PROVIDER_KEY_BIND.md`
- `docs/DEPLOY_SEAT_CONNECTION_TEST.md`
- `docs/TEAM-BACKEND-002_READ_WRITE_ECONOMY.md`
- `PRODUCT_LAW.md`
