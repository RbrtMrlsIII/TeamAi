# TeamAi User Manual — Seats, Web AI assignment, secrets, and deploy

**Audience:** operators, founders, and new sessions setting up TeamAi  
**Authority:** Product Law (identity ≠ provider ≠ seat ≠ entitlement)  
**Date:** 2026-09-09  
**Status:** OPERATING GUIDE · **no 029-released claim**

This guide answers, in order:

1. What is a seat vs a provider vs a model vs a key  
2. How a user attaches **their** Web AI to a **specific seat**  
3. How the user chooses a **model** after the key is bound  
4. What secrets go on Supabase (and what must **not** share the operator’s personal agent)  
5. Major providers and how to register keys  
6. Pre-hosting checklist and CLI deploy  
7. Free smoke vs live probes  

Related contracts:

- `docs/TEAM-EXPERIENCE-029_SEAT_PROVIDER_KEY_BIND.md`
- `docs/TEAM-EXPERIENCE-029_SEAT_CONNECTION_TEST.md`
- `docs/TEAMAI_SEAT_SECRET_KEY_AND_FREE_SMOKE.md`
- `docs/DICTIONARY.md` (Seats & provider connection)

---

## 1. Mental model (read this first)

| Term | Meaning | Is not |
|------|---------|--------|
| **User account** | Firebase Auth (TeamAi login) | Provider billing account |
| **Web AI Seat** | One participation slot on a Workplace/Project | Your ChatGPT mobile session |
| **Provider** | External LLM company/runtime (OpenAI, Anthropic, OpenRouter, …) | TeamAi itself |
| **Model** | Specific model **id** under a provider (e.g. `gpt-4o`, `claude-sonnet-4-…`, `openai/gpt-4o` on OpenRouter) | The API key |
| **API key** | Server credential used only by **Edge** to call that provider | TeamAi password |
| **TEAMAI_SEAT_SECRET_KEY** | Random string used only to **encrypt** per-seat keys at rest | Any provider key |
| **Platform key** | Optional operator-owned key in Supabase secrets (fallback probes) | Automatic credential for every seat |
| **Seat key** | User-bound key encrypted under that seat | Shared across all seats by default |
| **Consumer app login** | ChatGPT / Claude / Gemini **apps** | Valid TeamAi seat credential |

```text
Human logs in (Firebase)
  → Workplace / Project
  → Seat (role, limits, providerKind, model id)
  → Optional: paste USER API key → local draft → Save
       → Edge encrypts with TEAMAI_SEAT_SECRET_KEY
       → durable: lastFour + bound flag only (never full key in UI)
  → Test Connection (server probe)
  → Activate (backend-gated — browser never self-grants)
```

**Product Law reminder:** identity ≠ provider ≠ seat ≠ entitlement.  
Presentation never invents activation or durable health authority.

---

## 2. Critical: seats must not silently use the operator’s personal agent

Operators often keep personal keys for Cursor, Claude Code, OpenRouter “my agent,” etc. Those keys must **not** become the default brain for every TeamAi seat.

| Source | Who pays | When used |
|--------|----------|-----------|
| **Per-seat bound key** | The user/team who bound that key | Preferred for that seat’s live HTTP probes |
| **Platform env key** (`OPENAI_API_KEY`, …) | The **operator / platform** | Only if no seat key is bound and probe mode is live |
| **Stub** | Nobody | Free smoke; no provider call |

**Credential order** (connection-test, live modes):

1. `probeMode: "stub"` or `forceHealth` → **no** provider key  
2. Per-seat encrypted key at  
   `accounts/{uid}/workplaces/{w}/projects/{p}/seats/{seatId}/secrets/providerApiKey`  
3. Platform env (`OPENAI_API_KEY` / `ANTHROPIC_API_KEY`, …)  
4. Else stub fallback  

Response field `credentialSource`: `seat` | `platform` | `none`.

### Operator rules of thumb

1. Prefer **users bind their own keys per seat** for production-like teams.  
2. Treat platform keys as **optional fallback for smoke**, not as “every seat is my OpenRouter agent.”  
3. Do **not** paste your personal agent key into every seat “for convenience.”  
4. If you must keep platform keys, assume **you** pay for any probe that reports `credentialSource: "platform"`.  
5. Stub probes never touch provider billing.

---

## 3. Key vs model (two different steps)

### 3.1 Bind the key (credential)

1. User gets a real API key from the provider console (see §5).  
2. Opens seat provider settings (UI when wired) or uses the bind client.  
3. Key lives in **local draft** only while typing.  
4. **Save** → `POST teamai-seat-provider-bind` with Firebase ID token.  
5. Server encrypts with `TEAMAI_SEAT_SECRET_KEY`; UI keeps only last four characters.

Discard clears the draft and writes nothing durable.

### 3.2 Choose the model (configuration)

Binding a key does **not** pick the model.

| Step | Field | Example |
|------|--------|---------|
| Provider family | `providerKind` | `openai`, `anthropic`, `generic` (OpenRouter-compatible often `generic` or openai-compatible) |
| Model id | seat `model` (config) | `gpt-4o`, `claude-sonnet-4-20250514`, `google/gemini-2.5-pro` (OpenRouter form) |

One OpenRouter **key** can unlock many models; the **seat** still stores which model id that seat should use.

Today’s Edge probe kinds (connection-test):

- `openai` → `https://api.openai.com/v1/models`  
- `anthropic` → Anthropic models endpoint  
- `generic` / `stub`  

First-class OpenRouter / Grok / NVIDIA / Google probe URLs are a follow-up wiring slice; **keys and mental model** already follow the same bind path.

---

## 4. Supabase secrets — what to set

All of these are **Supabase secrets** (Edge environment). Never commit them to git. Never hard-code them in function source.

### 4.1 Required for platform operation

| Secret | Value type | Purpose |
|--------|------------|---------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Real Firebase service-account JSON | Edge verifies Firebase users / Firestore admin paths |
| `TEAMAI_SEAT_SECRET_KEY` | **Random** ≥32 chars | Encrypt/decrypt per-seat API keys only |

Generate encrypt secret:

```bash
openssl rand -base64 32
# example shape only — generate your own for production:
# beUcoeAZx56sWKD0CEmZozABvRyInZiDk3bjiHj5iuM=
```

```bash
npx supabase secrets set TEAMAI_SEAT_SECRET_KEY="$(openssl rand -base64 32)" \
  --project-ref <REF>
```

Rotating `TEAMAI_SEAT_SECRET_KEY` makes previously encrypted seat keys unreadable until users re-bind.

### 4.2 Optional platform provider fallbacks (real keys)

| Secret | Value type | Purpose |
|--------|------------|---------|
| `OPENAI_API_KEY` | **Real** OpenAI key (`sk-…`) | Platform fallback probes for OpenAI-kind seats |
| `ANTHROPIC_API_KEY` | **Real** Anthropic key | Platform fallback probes for Anthropic-kind seats |

Aliases also recognized in code where present: `TEAMAI_OPENAI_API_KEY`, `TEAMAI_ANTHROPIC_API_KEY`.

```bash
npx supabase secrets set OPENAI_API_KEY='sk-...' --project-ref <REF>
npx supabase secrets set ANTHROPIC_API_KEY='...' --project-ref <REF>
```

**These are not random strings.** Fake values fail live HTTP probes.

### 4.3 Planned / optional platform names (same pattern)

Not all are first-class in the current connection-test resolver. Use the same Supabase secret pattern when you add provider kinds:

| Secret (convention) | Provider | Notes |
|---------------------|----------|--------|
| `OPENROUTER_API_KEY` | OpenRouter | OpenAI-compatible; many models behind one key |
| `GROK_API_KEY` / `XAI_API_KEY` | xAI Grok | OpenAI-compatible style APIs |
| `GOOGLE_API_KEY` / `GEMINI_API_KEY` | Google Gemini | Google AI Studio / Vertex differ |
| `NVIDIA_API_KEY` | NVIDIA NIM / NGC | Model endpoints vary by product |
| `MISTRAL_API_KEY` | Mistral | OpenAI-compatible options exist |
| `COHERE_API_KEY` | Cohere | Distinct API shape |
| `TOGETHER_API_KEY` | Together | OpenAI-compatible common |
| `FIREWORKS_API_KEY` | Fireworks | OpenAI-compatible common |
| `PERPLEXITY_API_KEY` | Perplexity | Often OpenAI-compatible chat |
| `DEEPSEEK_API_KEY` | DeepSeek | OpenAI-compatible common |
| `AZURE_OPENAI_API_KEY` (+ endpoint/deployment secrets) | Azure OpenAI | Needs endpoint + deployment name, not key alone |

Until Edge maps a `providerKind` to that secret and URL, prefer **per-seat bind** of the user’s key and `probeMode: "stub"` for free verification.

---

## 5. Major providers — where keys come from

Users (or operators for platform fallbacks) create keys in the provider’s **API** console, not inside ChatGPT/Claude consumer apps.

| Provider | Get API key | Typical use in TeamAi |
|----------|-------------|------------------------|
| **OpenAI** | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | `providerKind: openai`; models `gpt-4o`, `o3`, … |
| **Anthropic** | [console.anthropic.com](https://console.anthropic.com) | `providerKind: anthropic`; Claude model ids |
| **OpenRouter** | [openrouter.ai/keys](https://openrouter.ai/keys) | One key → many models; model ids like `openai/gpt-4o`, `anthropic/claude-…` |
| **xAI (Grok)** | [console.x.ai](https://console.x.ai) | Grok model ids; often OpenAI-compatible clients |
| **Google (Gemini)** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Gemini model ids; API differs from OpenAI |
| **NVIDIA** | [build.nvidia.com](https://build.nvidia.com) / NGC | NIM endpoints; model depends on product |
| **Mistral** | [console.mistral.ai](https://console.mistral.ai) | Mistral model ids |
| **Cohere** | [dashboard.cohere.com](https://dashboard.cohere.com) | Command model family |
| **Together** | [api.together.xyz](https://api.together.xyz) | Open-source / hosted models |
| **Fireworks** | [fireworks.ai](https://fireworks.ai) | Fast open models |
| **Perplexity** | [perplexity.ai](https://www.perplexity.ai) | Sonar / online models |
| **DeepSeek** | [platform.deepseek.com](https://platform.deepseek.com) | DeepSeek chat/reasoner |
| **Azure OpenAI** | Azure Portal | Key + **endpoint** + **deployment name** |

### OpenRouter example (common multi-model case)

1. Create key at OpenRouter.  
2. Bind that key to **one seat** (Save → encrypt).  
3. Set that seat’s **model id** to the OpenRouter slug you want (e.g. `google/gemini-2.5-pro`).  
4. Test Connection: prefer seat credential; avoid relying on operator platform OpenAI key for that seat.  
5. Another seat can bind a **different** key or the same key with a **different** model id — seats stay independent configuration objects.

---

## 6. Free smoke vs live probes

| Action | Provider $? | Needs seat/platform key? |
|--------|-------------|---------------------------|
| `probeMode: "stub"` | **No** | No |
| `forceHealth: "healthy"` harness | **No** | No |
| Playwright / fixture Seats plate | **No** | No |
| Live HTTP `auto` / `http` with seat or platform key | **Yes** (light models-list still counts) | Yes |
| Full multi-seat chat | **Yes** | Yes — not required for bind smoke |

```bash
curl -sS -X POST "$URL/teamai-seat-connection-test" \
  -H "Authorization: Bearer $FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"seatId":"alpha","probeMode":"stub"}'
```

---

## 7. Pre-hosting checklist

### Firebase

- [ ] Correct Firebase project  
- [ ] Auth providers enabled as intended  
- [ ] Firestore `(default)` database  
- [ ] Service account JSON available for Edge (**secret**, not in git)

### Supabase

- [ ] Project **ref** known  
- [ ] `npx supabase login` done on the machine  
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` set  
- [ ] `TEAMAI_SEAT_SECRET_KEY` set (random)  
- [ ] Optional: real `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` **only if** you want platform fallbacks  
- [ ] Functions deployed (see §8)

### Product gates

- [ ] Browser is not durable authority for secrets, leases, or health  
- [ ] CI green on `main`  
- [ ] Operators understand seats ≠ personal agent keys  

---

## 8. CLI deploy

### One-time secrets

```bash
npx supabase login

npx supabase secrets set FIREBASE_SERVICE_ACCOUNT_JSON='{...}' \
  --project-ref <REF>

npx supabase secrets set TEAMAI_SEAT_SECRET_KEY="$(openssl rand -base64 32)" \
  --project-ref <REF>

# Optional platform fallbacks — REAL keys only
# npx supabase secrets set OPENAI_API_KEY='sk-...' --project-ref <REF>
# npx supabase secrets set ANTHROPIC_API_KEY='...' --project-ref <REF>
```

### Deploy functions (when code changes)

```bash
npx supabase functions deploy teamai-task-execute \
  --project-ref <REF> --no-verify-jwt

npx supabase functions deploy teamai-seat-connection-test \
  --project-ref <REF> --no-verify-jwt

npx supabase functions deploy teamai-seat-provider-bind \
  --project-ref <REF> --no-verify-jwt
```

`--no-verify-jwt`: functions verify **Firebase** ID tokens themselves (not Supabase JWT as the product auth).

### Function inventory

| Function | Role |
|----------|------|
| `teamai-task-execute` | Task lease + stub execution |
| `teamai-seat-connection-test` | Connection probe + durable health write path |
| `teamai-seat-provider-bind` | Per-seat encrypted API key bind |

---

## 9. Firestore paths (operators)

```text
accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/seats/{seatId}
  providerKind, providerKeyBound, providerKeyLastFour, providerKeyBoundAt
  model (config — which model id this seat uses)
  … connection health fields as written by connection-test …

…/seats/{seatId}/secrets/providerApiKey
  ciphertext, iv, alg, providerKind, boundAt
  (never returned in full to the browser)
```

---

## 10. Client modules

| Module | Role |
|--------|------|
| `frontend/spatial/seat-provider-bind-client.js` | Draft + Save bind |
| `frontend/spatial/seat-read-model.js` | Presentation projection of health/binding |
| Seats plate / shell-nav | UI composition (fixture vs domain source) |

Browser sends the key **only at Save**. Browser never becomes durable secret authority.

---

## 11. Related docs

- `docs/TEAM-EXPERIENCE-029_SEAT_PROVIDER_KEY_BIND.md` — bind contract  
- `docs/TEAM-EXPERIENCE-029_SEAT_CONNECTION_TEST.md` — probe + credential order  
- `docs/TEAMAI_SEAT_SECRET_KEY_AND_FREE_SMOKE.md` — encrypt secret + free smoke  
- `docs/DEPLOY_SEAT_CONNECTION_TEST.md` — deploy notes  
- `docs/TEAM-BACKEND-002_READ_WRITE_ECONOMY.md` — write economy  
- `docs/DICTIONARY.md` — term boundaries  
- `PRODUCT_LAW.md` — identity ≠ provider ≠ seat ≠ entitlement  

**no 029-released claim**
