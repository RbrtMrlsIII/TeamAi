# TEAM-EXPERIENCE-029 — Seat connection Test (phase 3–7 + seat key)

**Status:** OPERATING CONTRACT / NOT PRODUCT LAW  
**Date:** 2026-09-08

## Credential order (HTTP probe)

When `probeMode` is `auto` or `http`:

1. **`forceHealth`** or **`probeMode: stub`** → no provider key (free smoke)
2. **Per-seat encrypted key** at  
   `accounts/{uid}/workplaces/{w}/projects/{p}/seats/{seatId}/secrets/providerApiKey`  
   (decrypt with `TEAMAI_SEAT_SECRET_KEY`)
3. **Platform env** `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`
4. Else **stub fallback**

JSON includes `credentialSource`: `seat` | `platform` | `none`.

## Free smoke (no provider $$)

```bash
curl -sS -X POST "$URL/teamai-seat-connection-test" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"seatId":"alpha","probeMode":"stub"}'
```

## Deploy

```bash
npx supabase functions deploy teamai-seat-connection-test --project-ref <REF> --no-verify-jwt
# required to decrypt seat keys:
npx supabase secrets set TEAMAI_SEAT_SECRET_KEY="$(openssl rand -base64 32)" --project-ref <REF>
```

See also: `docs/TEAMAI_SEAT_SECRET_KEY_AND_FREE_SMOKE.md`, `docs/TEAM-EXPERIENCE-029_SEAT_PROVIDER_KEY_BIND.md`.
