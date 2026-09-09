# TEAM-EXPERIENCE-029 — GitHub installation ↔ Firebase UID map (Conn-2)

**Status:** CONTRACT / PLANNING + CODE SKELETON  
**Not a Hero live bind.** Creating or receiving a webhook does not equip a Seat or claim 029 product release.

## Purpose

Receive GitHub App webhooks on a **trusted Edge** function, verify authenticity, and resolve an existing Firestore map from `installation_id` to the owning Firebase UID.

```text
GitHub App webhook (HMAC)
  → Edge teamai-github-webhook
  → githubInstallationIndex/{installationId}   (server-only)
  → accounts/{firebaseUid}/githubInstallations/{installationId}
  → optional durable event later (not required in Conn-2)
```

## Ownership

| Concern | Owner |
|---------|--------|
| Identity root | Firebase UID (LAW 104) |
| Durable map | Cloud Firestore |
| Webhook verify + receipt | Supabase Edge (trusted execution) |
| First bind mint | Conn-3 (OAuth after user consent) — **not** webhook payload |
| Seat may use Connection | Equip + scope + health + tool policy (later) |
| Presentation | Hero `SEAT_CONNECTION` remains handoff only |

## Paths

| Path | Client | Server |
|------|--------|--------|
| `githubInstallationIndex/{installationId}` | deny all | read/write |
| `accounts/{uid}/githubInstallations/{installationId}` | read own | write |

## HTTP contract

| Condition | Status |
|-----------|--------|
| Secret missing | 503 `webhook_secret_not_configured` |
| Signature missing / mismatch | 401 |
| Installation unknown / no index | 200 `mapping: unbound` |
| Bound + delivery | 200 `mapping: bound` (idempotent on delivery id) |

## Explicit non-goals (Conn-2)

- No invented HTTPS webhook URL on the GitHub App form (leave webhook **inactive** until deployed).
- No Postgres `github_installation_id` column as TeamAi domain state.
- No AI SQL roles / keyword DROP filters as safety.
- No Hero 3D OAuth / live bind.
- No minting `firebaseUid` from GitHub `sender.login`.
- No claim that TEAM-EXPERIENCE-029 is production-complete.

## Next

**Conn-3:** trusted OAuth callback mints the first `githubInstallationIndex` + UID-rooted record after the user installs the App and grants OAuth.

## See also

- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md` (Conn-1)
- `src/backend/github-installation.ts`
- `supabase/functions/teamai-github-webhook/index.ts`
- `skills/workspace/ws.github.webhook-uid-map/SKILL.md`
