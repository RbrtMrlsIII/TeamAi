# Deploy — teamai-seat-connection-test

## Prerequisites

- Same Supabase project as `teamai-task-execute`
- Secret `FIREBASE_SERVICE_ACCOUNT_JSON`
- Firebase project `team-ai-official`

## Deploy

```bash
npx supabase functions deploy teamai-seat-connection-test --project-ref <YOUR_REF> --no-verify-jwt
```

## Smoke — projection only (no durable write)

```bash
export TOKEN='eyJ…'
curl -sS -X POST \
  "https://<YOUR_REF>.supabase.co/functions/v1/teamai-seat-connection-test" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"seatId":"alpha"}'
```

Expect `durableWritten: false`.

## Smoke — durable write

```bash
curl -sS -X POST \
  "https://<YOUR_REF>.supabase.co/functions/v1/teamai-seat-connection-test" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"seatId":"alpha","workplaceId":"wp-demo","projectId":"proj-demo"}'
```

Expect `durableWritten: true`, `eventPath` under `…/connection-tests/…`, and seat `connectionHealth` set server-side.

## Browser config for plate

```js
window.TEAMAI_SEAT_CONNECTION_BASE_URL = "https://<YOUR_REF>.supabase.co/functions/v1";
window.TEAMAI_FIREBASE_ID_TOKEN = "<id-token>";
window.TEAMAI_WORKPLACE_ID = "wp-demo";
window.TEAMAI_PROJECT_ID = "proj-demo";
```
