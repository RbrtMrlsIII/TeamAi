# TeamAi GitHub App — least-privilege matrix (v1)

**Status:** PLANNING / OPERATING CONTRACT · **not Product Law** · **not a live bind** · **no 029-released claim**  
**Date:** 2026-09-09  
**Governs:** how to fill the GitHub *Create GitHub App* form for TeamAi.

GitHub remains **engineering/source/change authority** (`PRODUCT_LAW.md` Family B).  
A GitHub App installation is a **Connection**, not a Seat, not entitlement, not scheduler (`docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`).

Machine-readable twin: `public/github-app-permission-matrix.json`.

## What the screenshots currently grant (too little to work, one permission too wide)

| Permission | Screenshot | v1 should be |
|---|---|---|
| Actions | **Read and write** | **Read** (write later only if we must re-run workflows) |
| Metadata | Read (mandatory) | Read |
| Contents | No access | **Read and write** (feature branches + commits for PRs) |
| Pull requests | No access | **Read and write** |
| Issues | No access | **Read and write** |
| Checks | No access | **Read** |
| Commit statuses | No access | **Read** |
| Everything else (org / account / enterprise) | No access | **Keep No access** |

With only Actions + Metadata the App **cannot** read code, open PRs, or comment on issues. That cannot run WebAi on GitHub.

Actions **write** is not required for v1 and is more privilege than the product needs.

## Fill-in: Create GitHub App form

### Identity

| Field | v1 value |
|---|---|
| GitHub App name | `TeamAi` (or `TeamAi-dev` until public) |
| Homepage URL | Product site is fine (`https://rbrtmrlsiii.github.io/TeamAi/hero` is presentation, not a callback) |
| Description | User-authorized engineering connection for TeamAi. Agents never hold the user’s GitHub password. All writes go through pull requests. |
| Callback / Redirect URI | Leave empty **until** a trusted HTTPS Edge callback exists. Do not invent one. |
| Setup URL | Same — only after a real configure UI exists. |
| Allow wildcard matching | **Off** |
| Expire user authorization tokens | **On** (already checked — keep) |
| Request user authorization (OAuth) during installation | **On** — installation id is the *repo*, OAuth is the *human* we bind to Firebase UID |
| Enable Device Flow | **Off** |
| Webhook Active | **Off until** a real `https://…/api/webhooks/github` Edge function exists. Empty URL + Active will fail or leak. |
| Webhook secret | Generate once; store in trusted secret store; never TeamChat, never Hero, never Firestore from the browser |
| Where can this GitHub App be installed? | **Only this account** until public launch |

### Repository permissions — GRANT (v1)

| GitHub form name | Access | Why |
|---|---|---|
| **Metadata** | Read-only | Mandatory |
| **Contents** | Read and write | Create `feat/*` branches and commits. Not a license to push `main`. |
| **Pull requests** | Read and write | Open / update / comment on PRs. The only mutation path. |
| **Issues** | Read and write | TeamChat ↔ GitHub issues / comments. |
| **Checks** | Read-only | See CI on the health leaf. |
| **Commit statuses** | Read-only | Same. |
| **Actions** | Read-only | Observe workflow runs. Not the Web AI scheduler. |

### Repository permissions — NEVER (v1)

Keep **No access**:

Administration · Secrets · Variables · Environments · Members · Blocking users · Codespaces (all) · Dependabot secrets/alerts · Security events / secret scanning · Copilot · Workflows (YAML mutation) · Pages · Merge queues · Deployments · Packages · Webhooks (repo-level) · Single file · Custom properties · Artifact metadata · Attestations

**Workflows write** would let the App rewrite GitHub Actions files. Out of scope.

### Organization / Account / Enterprise

**All No access.** TeamAi v1 is per-repository installation. Org-wide members, billing, Copilot seats, enterprise SCIM, etc. are not TeamAi authority.

### Subscribe to events (only after webhook HTTPS is ready)

Required: `installation`, `installation_repositories`, `pull_request`, `issues`, `issue_comment`, `push`  
Useful: `check_run` (feeds `SEAT_CONNECTION_HEALTH_FACE` later)

Do not subscribe to every event “just in case.”

## Proxy principle (keep) vs Product Law (fix)

The blueprint’s proxy idea is **correct**:

```text
User authorizes GitHub App
        ↓
TeamAi backend holds installation token + maps Firebase UID ↔ installation_id
        ↓
Seat asks backend for a scoped GitHub action
        ↓
Backend (Supabase Edge) calls GitHub API
        ↓
Result → durable event (Firestore) → TeamChat
```

Individual agents **must not** have their own GitHub user accounts.

### Do not copy these parts of the blueprint

| Blueprint line | Product Law |
|---|---|
| `ALTER TABLE users ADD github_installation_id` on Postgres | Durable domain is **Firestore**, rooted in Firebase UID. Supabase Postgres is infrastructure only. |
| Keyword interceptor for `DROP` / `DELETE` as the safety model | Do not give AI a SQL role against TeamAi domain. Guardrails belong in API policy, not string filters. |
| Firebase Extension as the “Connect Firebase” path | Firebase Auth + Firestore `(default)` are already TeamAi identity/domain. An Extension is a different product. |
| One marketplace that treats GitHub App, Firebase Extension, Supabase OAuth, and raw Postgres passwords as the same UX | Four different authority families. GitHub App first. |
| GitHub Actions as orchestration | Family B: Actions is verification, **not** the Web AI scheduler. |
| Hero “connected” badge = usable | Connection lifecycle: `authorized ≠ project-scoped ≠ seat-allowed ≠ healthy ≠ usable`. |

## Safeguards (mandatory)

1. **No push to `main` / default branch.** Enforce with GitHub rulesets on the *repo*, not by trusting the App. Contents write + no Administration means the App cannot bypass rulesets.
2. **All AI code via ephemeral branch + PR.** `can commit ≠ can create PR ≠ can approve ≠ can merge`.
3. **No PAT paste** into TeamChat (`skills/workspace/ws.secrets.boundary`).
4. **PEM private key** only in trusted secret store / Edge env. Never the browser, never Hero, never Firestore client writes.
5. **Installation token** is short-lived and minted by the backend, not stored as a user password.
6. Hero `SEAT_CONNECTION` remains **presentation**. Keyboard **C** hands off to normal UI. The App install is that UI — not a 3D live bind.

## Other platforms (same least-privilege idea)

| Platform | User clicks | Developer grants | Never |
|---|---|---|---|
| **GitHub** | Connect GitHub → App install + OAuth | v1 matrix above | Admin, secrets, org, enterprise |
| **Firebase** | Sign in (existing Auth) | Auth identity + Firestore rules scoped to UID | Super admin SDK in the browser; client writes of entitlement |
| **Supabase** | Not a domain login | Edge Functions as trusted execution | Postgres as TeamAi domain; `ai_agent_role` with INSERT/UPDATE on `public` |
| **Postgres** | Do not collect user DB passwords for TeamAi domain | N/A for v1 | Superuser, DROP, TRUNCATE, schema-owner roles for AI |

GitHub is the first Connection to finish. Do not stand up a four-platform marketplace until GitHub install → UID map → scoped PR path is real.

## Hero / CONNECTION mapping

| Hero face | Real object |
|---|---|
| `SEAT_CONNECTION` | GitHub App install + OAuth (this document) |
| `SEAT_CONNECTION_HEALTH_FACE` | Installation health / last webhook / checks (fixture until named domain read-model is live) |
| Keyboard **C** / configure handoff | Normal UI: GitHub App install page (not WebGL OAuth) |
| `SEAT_AUTHORIZATION` | TeamAi policy: which Seat may use the Connection |
| `SEAT_CAPABILITIES` | What the Seat *can* attempt (not what GitHub granted) |

Presentation never invents a healthy = entitled badge.

## Related

- `PRODUCT_LAW.md` Family B / C / E
- `skills/workspace/ws.tools.github/SKILL.md`
- `skills/workspace/ws.github.app-least-privilege/SKILL.md`
- `skills/workspace/ws.secrets.boundary/SKILL.md`
- `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`
- `public/github-app-permission-matrix.json`
