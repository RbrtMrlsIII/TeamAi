# Deploy — teamai-seat-connection-test

## Prerequisites

- Supabase project + `FIREBASE_SERVICE_ACCOUNT_JSON`
- Optional for HTTP probe: `OPENAI_API_KEY` and/or `ANTHROPIC_API_KEY`
- Optional generic: `TEAMAI_PROVIDER_PROBE_URL`

## Deploy

```bash
npx supabase functions deploy teamai-seat-connection-test --project-ref <YOUR_REF> --no-verify-jwt
```

## Secrets (HTTP probe)

```bash
npx supabase secrets set OPENAI_API_KEY=sk-... --project-ref <YOUR_REF>
# or
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref <YOUR_REF>
```

## Smoke — HTTP OpenAI (server-side only)

```bash
export TOKEN='eyJ…'
curl -sS -X POST \
  "https://<YOUR_REF>.supabase.co/functions/v1/teamai-seat-connection-test" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"seatId":"alpha","providerKind":"openai","probeMode":"http","workplaceId":"wp-demo","projectId":"proj-demo"}'
```

Expect `probe` like `http:openai-models` and `connectionHealth` from HTTP status. No chat completion is billed beyond a models list GET.

## Smoke — stub only

```bash
curl -sS -X POST "https://<YOUR_REF>.supabase.co/functions/v1/teamai-seat-connection-test" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"seatId":"alpha","probeMode":"stub"}'
```
