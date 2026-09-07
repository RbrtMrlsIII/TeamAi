# TEAMAI_SEAT_SECRET_KEY and free smoke testing

## Your understanding (correct)

- Provider **API keys** are how the **web/backend** talks to OpenAI/Anthropic.
- **Whoever owns that key** pays the provider (user-bound seat key → that user’s API bill; platform env key → platform bill).
- You **do not** need paid provider accounts to develop TeamAi UI, CI, or stub probes.

## Free smoke (no $$ on providers)

| Action | Costs provider $? |
|--------|-------------------|
| `probeMode: "stub"` | **No** |
| `forceHealth: "healthy"` harness | **No** |
| Fixture Seats plate / Playwright | **No** |
| HTTP `probeMode: "http"` / `auto` with real keys | **Yes** (light models-list GET, still billed/limited by provider) |
| Full multi-seat chat (AI-1 reads AI-2, etc.) | **Yes** — not required for connection/bind smoke |

Example free smoke:

```bash
curl -sS -X POST "$URL/teamai-seat-connection-test" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"seatId":"alpha","probeMode":"stub"}'
```

## TEAMAI_SEAT_SECRET_KEY

**Not** an OpenAI/Anthropic key.

It is a **TeamAi server secret** used only to **encrypt/decrypt** per-seat API keys at rest.

| Question | Answer |
|----------|--------|
| Can it be “anything”? | Any long **random** string you choose |
| How long? | Prefer **≥ 32 characters** (64+ random is better) |
| Example generation | `openssl rand -base64 32` |
| Related to user billing? | **No** |
| Required for stub probes? | **No** |
| Required for `teamai-seat-provider-bind`? | **Yes** (503 without it) |

```bash
npx supabase secrets set TEAMAI_SEAT_SECRET_KEY="$(openssl rand -base64 32)" \
  --project-ref <REF>
```

Keep it private; rotating it makes previously encrypted seat keys unreadable until users re-bind.
