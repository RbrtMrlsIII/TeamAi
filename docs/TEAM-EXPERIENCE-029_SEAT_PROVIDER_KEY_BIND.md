# TEAM-EXPERIENCE-029 — Per-seat provider API key bind

**Status:** OPERATING CONTRACT / NOT PRODUCT LAW  
**Date:** 2026-09-07

## Purpose

Let a **signed-in user** attach **their own** provider API key to a **specific seat**, without:

- using ChatGPT/Claude **app** login as TeamAi auth
- putting long-lived keys in the browser as authority
- writing Firestore secrets from the browser

## Flow (read/write economy)

```text
OPEN seat provider settings
     │
     ▼
LOCAL DRAFT  (apiKey in memory only)
  │ typing / paste — no Firestore
  │
  ├─ Discard → clear draft, no write
  │
  └─ Save
        │
        ▼
 POST Edge teamai-seat-provider-bind
   Authorization: Bearer <Firebase ID token>
        │
        ▼
 server encrypts with TEAMAI_SEAT_SECRET_KEY
        │
        ▼
 durable seat metadata (last four, kind, boundAt)
 + secrets/providerApiKey (ciphertext only)
        │
        ▼
 response: providerKeyBound + lastFour — never full key
```

## Paths

```text
accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/seats/{seatId}
  providerKind, providerKeyBound, providerKeyLastFour, providerKeyBoundAt

…/seats/{seatId}/secrets/providerApiKey
  ciphertext, iv, alg, providerKind, boundAt
```

## Edge deploy

```bash
npx supabase functions deploy teamai-seat-provider-bind \
  --project-ref <REF> --no-verify-jwt

npx supabase secrets set TEAMAI_SEAT_SECRET_KEY='long-random-string' \
  --project-ref <REF>
```

`TEAMAI_SEAT_SECRET_KEY` is **required** for bind (503 if missing). Platform `OPENAI_API_KEY` remains optional fallback for probes when no seat key is bound.

## Client

`frontend/spatial/seat-provider-bind-client.js`

- `createProviderKeyDraft` / `updateProviderKeyDraft` / `discardProviderKeyDraft`
- `saveProviderKeyBinding({ baseUrl, idToken, workplaceId, projectId, draft })`

## Not in this slice

- Full Settings UI form on the Seats plate (wire later)
- Connection-test automatic decrypt of seat key (follow-up on same secret layout)
- OAuth / app-session providers
- Browser direct Firestore secret writes
