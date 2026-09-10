# TEAM-EXPERIENCE-029 — GitHub OAuth mint of UID ↔ installation_id (Conn-3)

**Status:** IMPLEMENTED · operator-confirmed installation success · **live Edge still HTML callback** · **303 return on `main` source** · browser proof pending  
**Not a Hero live bind.** **No 029 production-release claim.**

## Purpose

After the user installs the TeamAi GitHub App and completes install/OAuth, a **trusted Edge** path mints the first durable map:

```text
User clicks Connect GitHub (normal UI — not 3D)
  → GitHub App install + OAuth (user consent)
  → Edge teamai-github-oauth-bind (Firebase ID token required)
  → writes githubInstallationIndex/{installationId}
  → writes accounts/{uid}/githubInstallations/{installationId}
  → Connection becomes bindable for seat equip (still not automatic usable)
```

Conn-2 webhooks **only look up** this map. Conn-3 is the **only** allowed first-write of the index from product flows.

## Current operator evidence

The GitHub App installation has been **successfully completed through the real GitHub installation flow**, including installation by another user. The operator reports the connected Supabase history as the durable external evidence trail.

A separate CLI `curl` attempt returned **HTTP 401**. This is classified as a **CLI/test-path discrepancy** and does not downgrade the successful GitHub App installation evidence.

### 2026-09-10 browser callback screenshot (partial)

- Live Edge served terminal HTML (“GitHub install received”) with installation id **`160609752`**, setup action `install`.
- Page correctly deferred UID map write to signed-in **POST + Firebase token** and restated non-claims (not Hero live bind; no 029 release).
- **`main` source** already implements GET → **HTTP 303** to `https://rbrtmrlsiii.github.io/TeamAi/hero/` and does **not** mint UID on GET.
- Hero and Command Deck consume `github=installed` as a presentation-only receipt (Conn-3.1). Bind remains signed-in POST + Firebase token.
- Therefore the remaining gap is **deploy the revised Edge**, then re-prove the browser return path — not a missing source destination.

Evidence record: `docs/CHECKPOINT_CONN3_OPERATOR_CALLBACK_EVIDENCE_2026-09-10.md`.

## Current browser integration boundary

```text
GitHub install callback GET (intended)
  → Edge does not write UID state
  → HTTP 303 to canonical TeamAi Hero destination
  → optional install/setup/error context is carried in query parameters
```

Tracked as **Issue #244**. Source-contract 303 is on `main`. Live deploy verification is still open.

## Ownership

| Concern | Owner |
|---------|--------|
| Identity | Firebase UID (Bearer ID token on Edge) |
| Install + OAuth consent | GitHub (user) |
| First bind write | Supabase Edge trusted execution |
| Secrets (client_id / client_secret / PEM) | Edge env / trusted store — never browser |
| Post-install return destination | TeamAi canonical web route |
| Seat may use Connection | Equip + scope + health + tool policy (later) |

## Non-goals

- Hero keyboard **C** is not OAuth
- Webhook payload must not mint UID
- No Postgres domain column
- No automatic completion claim from App installation alone
- No 029 production release claim from the redirect fix alone

## Implementation checklist

1. [x] Edge `teamai-github-oauth-bind` (operator-deployed — prior revision)
2. [x] Server-only write of index + UID-rooted record
3. [x] Contract tests on branch
4. [x] Skill `ws.github.oauth-uid-bind`
5. [x] Operator manual consolidated into `docs/USER_MANUAL_DEPLOYMENT.md`
6. [x] GitHub App installation completed in the real GitHub flow (operator-confirmed)
7. [x] CLI 401 classified separately from product installation evidence
8. [x] GET callback changed from terminal HTML page to HTTP 303 canonical TeamAi return (**source on main**; destination `/hero/`)
9. [ ] Deploy the revised Edge function (303) — **live still HTML as of 2026-09-10 screenshot** — human-only; flagged on `docs/USER_MANUAL_DEPLOYMENT.md` §10
10. [ ] Real browser proof: install → callback → TeamAi return + presentation receipt
11. [ ] Verify durable UID ↔ installation mapping after the revised flow
12. [ ] Conn-3 / 029 acceptance decision after the complete evidence packet

## See also

- `docs/CHECKPOINT_CONN3_RETURN_RECEIPT_2026-09-11.md`
- `docs/CHECKPOINT_CONN3_OPERATOR_CALLBACK_EVIDENCE_2026-09-10.md`
- `docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md` (Conn-2)
- `docs/TEAMAI_GITHUB_APP_LEAST_PRIVILEGE.md` (Conn-1)
- `docs/TEAMAI_BACKEND_LIVE_REALITY_LEDGER.md`
- `docs/CHECKPOINT_BACKEND_OPERATOR_STATE_2026-09-10.md`
- `docs/USER_MANUAL_DEPLOYMENT.md`
- `src/backend/github-installation.ts`
