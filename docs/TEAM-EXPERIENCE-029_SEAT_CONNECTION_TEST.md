# TEAM-EXPERIENCE-029 — Seat connection Test (phase 3–7)

**Status:** OPERATING CONTRACT / NOT PRODUCT LAW  
**Date:** 2026-09-07

## Purpose

Trusted server projection of seat connection health, optional durable write, and **HTTP provider health probe** — browser never writes Firestore.

## Authority

| Layer | Owns |
|-------|------|
| Firebase Auth | Identity / ID token |
| Edge `teamai-seat-connection-test` | Probe + optional durable health write |
| Provider HTTP (Edge only) | Models-list / GET health — **not** chat or tools |
| Browser | Display only |

## Phase 7 — Real provider HTTP probe

`runConnectionProbe()` is async and supports:

| `probeMode` | Behavior |
|-------------|----------|
| `auto` (default) | HTTP when API key / probe URL available; else stub |
| `http` | Require HTTP config; `degraded` if unconfigured |
| `stub` | Baseline / catalog only |

### Provider kinds

| Kind | How selected | HTTP |
|------|--------------|------|
| `openai` | name contains openai/gpt, or `providerKind` | `GET https://api.openai.com/v1/models` |
| `anthropic` | anthropic/claude, or `providerKind` | `GET https://api.anthropic.com/v1/models` |
| `generic` | `probeUrl` / `TEAMAI_PROVIDER_PROBE_URL` | GET that URL |
| `stub` | fixture names without kind | no external call |

Secrets (Supabase Edge secrets): `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, optional `TEAMAI_PROVIDER_PROBE_URL`.

Status → health: 2xx **healthy**; 401/403/404/429 **degraded**; 5xx / timeout **offline**.

**Not performed:** chat completions, embeddings spend loops, tool calls.

### Request extras

```json
{
  "seatId": "alpha",
  "workplaceId": "wp-1",
  "projectId": "proj-1",
  "providerKind": "openai",
  "probeMode": "auto",
  "probeUrl": null,
  "forceHealth": null
}
```

## Phase 6 durable write

When workplace + project present: create-only `connection-tests/{probeId}` + patch/create seat health.

## Deploy

```bash
npx supabase functions deploy teamai-seat-connection-test --project-ref <ref> --no-verify-jwt
# optional secrets:
npx supabase secrets set OPENAI_API_KEY=sk-... --project-ref <ref>
```

See `docs/DEPLOY_SEAT_CONNECTION_TEST.md`.

## Phase ladder

1–6 done · **7 HTTP probe — this PR**
