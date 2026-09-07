# Deploy — teamai-seat-connection-test

## Prerequisites

- Same Supabase project as `teamai-task-execute`
- Secret `FIREBASE_SERVICE_ACCOUNT_JSON` already configured
- Firebase project `team-ai-official`

## Deploy

```bash
npx supabase functions deploy teamai-seat-connection-test --project-ref <YOUR_REF> --no-verify-jwt
```

## Smoke (after you have a Firebase ID token)

```bash
export TOKEN='eyJ…'   # Firebase ID token from test account
curl -sS -X POST \
  "https://<YOUR_REF>.supabase.co/functions/v1/teamai-seat-connection-test" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"seatId":"alpha"}'
```

Expect `connectionHealth` and `ok: true`. No provider call is made.

## Browser config (later wire)

When wiring the plate:

```js
window.TEAMAI_SEAT_CONNECTION_BASE_URL = "https://<YOUR_REF>.supabase.co/functions/v1";
```

Client path default: `/teamai-seat-connection-test`.
