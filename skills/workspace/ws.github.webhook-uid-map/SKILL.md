# WORKSPACE_SKILL — ws.github.webhook-uid-map

**Kind:** `WORKSPACE_SKILLS` · `ws.github.webhook-uid-map`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW

## WHEN TO USE

Use when implementing or reviewing the GitHub App **webhook receipt** path and the Firestore map `firebaseUid ↔ installation_id` (Conn-2). Not for Hero `SEAT_CONNECTION` presentation, and not for minting the first bind (that is Conn-3 OAuth).

## INPUT

- `docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md`
- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md` (Conn-1 matrix)
- `src/backend/github-installation.ts`
- Edge function `supabase/functions/teamai-github-webhook`
- `firestore.rules`

## AUTHORITY

GitHub remains engineering/source authority. Firestore remains durable domain authority under Firebase UID. Edge is trusted execution only. Skills ≠ authorization. This path is **not a Hero live bind**.

## ACTION

1. Verify `X-Hub-Signature-256` with the webhook secret from Edge env (`GITHUB_WEBHOOK_SECRET` / `TEAMAI_GITHUB_WEBHOOK_SECRET`).
2. If secret is missing → HTTP **503** (server misconfig). If signature missing/mismatch → **401**.
3. Extract `installation.id` / `installation_id` from the payload. Never invent a URL for the App form.
4. Lookup server-only `githubInstallationIndex/{installationId}`. If absent → **200 unbound** (do not mint UID from `sender.login` or any GitHub identity).
5. If bound → update UID-rooted `accounts/{uid}/githubInstallations/{installationId}` last-delivery fields (idempotent on `X-GitHub-Delivery`).
6. Leave the GitHub App webhook **inactive** until a real HTTPS Edge URL exists and is deployed.
7. Bind minting (first write of the index) is **Conn-3** after trusted OAuth — not this skill.

## DO NOT

- Do not treat Hero keyboard **C** / `SEAT_CONNECTION` as live OAuth or webhook bind.
- Do not store PEM, webhook secret, or PATs in TeamChat, Hero, or browser Firestore writes.
- Do not put `github_installation_id` on Supabase Postgres as TeamAi domain state.
- Do not use GitHub Actions as the Web AI scheduler.
- Do not claim TEAM-EXPERIENCE-029 production release from this contract alone.
- Do not invent a callback/webhook URL before Edge is live.

## PASS

HMAC verified; missing secret → 503; unknown installation → unbound 200; paths UID-rooted + server-only index; client write false; tests green; no live-bind claim on Hero.

## EVIDENCE

Unit tests on signature/paths/ack + Edge source review. Live webhook delivery is external evidence after deploy — separate from this contract slice.

## SEE ALSO

- `docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md`
- `skills/workspace/ws.github.app-least-privilege/SKILL.md`
- `skills/workspace/ws.tools.github/SKILL.md`
- `skills/workspace/ws.secrets.boundary/SKILL.md`
- `PRODUCT_LAW.md` Families B, C, G, H
