# Product Law amendment — Conn-2 GitHub Connection map

**Status:** Proposed amendment text for incorporation into `PRODUCT_LAW.md`  
**Slice:** Conn-2 · Issue #201  
**Does not claim 029 production release.**

## Family B — service table (additions)

| Platform / surface | Canonical role | Authority boundary |
|---|---|---|
| Supabase Edge Functions | Trusted server execution, including PayPal webhook receipt **and GitHub App webhook receipt (HMAC)** | Trusted execution authority; not domain-state authority |
| GitHub | Repository/source/change history; **GitHub App installations are Connections under user consent** | Engineering/source authority; **installation map lives in Firestore under Firebase UID, not Postgres domain tables** |

## Family C / LAW 104 — GitHub App Connection map

Durable binding of `installation_id` to the owning Firebase UID is stored in Cloud Firestore as **server-owned** state:

- `githubInstallationIndex/{installationId}` — server-only reverse index (client deny)
- `accounts/{uid}/githubInstallations/{installationId}` — UID-rooted Connection record (client read own; client write false)

Webhook receipt verifies HMAC on Edge and **looks up** an existing map. It must **not** mint a Firebase UID from GitHub identity fields. First bind mint is a trusted OAuth path (**Conn-3**). Hero presentation is **not** a live bind.

## Product Knowledge anti-patterns (AP-GH-001 … AP-GH-007)

| ID | Anti-pattern | Resolution |
|---|---|---|
| AP-GH-001 | Postgres `github_installation_id` as TeamAi domain | Firestore index + UID-rooted installs |
| AP-GH-002 | AI SQL role + DROP/DELETE keyword filter | API/tool policy; no domain DB role for AI |
| AP-GH-003 | Webhook Active with empty URL | Inactive until real HTTPS Edge URL |
| AP-GH-004 | Hero C / SEAT_CONNECTION as live OAuth | Normal-UI handoff only |
| AP-GH-005 | GitHub Actions as Web AI scheduler | Actions = verification only |
| AP-GH-006 | PEM / secrets in TeamChat / Hero / browser writes | Trusted secret store / Edge env |
| AP-GH-007 | Mint UID from webhook `sender.login` | Lookup index only; Conn-3 OAuth mints |

## Masterplan ladder

| Item | Status |
|------|--------|
| Conn-1 least-privilege matrix | On main (#200) |
| Conn-2 webhook + UID map | This PR |
| Conn-3 OAuth first bind | Next |
| Seat equip + tool policy | After Connection usable |

## See also

- `docs/TEAM-EXPERIENCE-029_GITHUB_INSTALLATION_UID_MAP.md`
- `skills/workspace/ws.github.webhook-uid-map/SKILL.md`
- `src/backend/github-installation.ts`
- `supabase/functions/teamai-github-webhook/index.ts`
