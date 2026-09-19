# Product Law amendment — Conn-2 GitHub Connection map

**Status:** HISTORICAL AMENDMENT RECORD — INCORPORATED INTO CANONICAL PRODUCT LAW  
**Canonical authority:** `Product_Law/PRODUCT_LAW.md`  
**Canonical field wiring:** `Product_Law/WIRING.md`  
**Slice:** Conn-2 · Issue #201  
**Does not claim 029 production release.**

This document preserves the historical Conn-2 amendment record. It is not an active Product Law source, not a second law, and not a current execution queue. Its normative concepts are carried by the canonical Product Law family.

## Historical amendment content

### Family B — service table (historical additions)

| Platform / surface | Canonical role | Authority boundary |
|---|---|---|
| Supabase Edge Functions | Trusted server execution, including PayPal webhook receipt **and GitHub App webhook receipt (HMAC)** | Trusted execution authority; not domain-state authority |
| GitHub | Repository/source/change history; **GitHub App installations are Connections under user consent** | Engineering/source authority; **installation map lives in Firestore under Firebase UID, not Postgres domain tables** |

### Family C / LAW 104 — GitHub App Connection map

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

## Historical execution ladder

| Item | Historical status |
|------|-------------------|
| Conn-1 least-privilege matrix | On main (#200) |
| Conn-2 webhook + UID map | This historical amendment |
| Conn-3 OAuth first bind | Follow-on work |
| Seat equip + tool policy | Follow-on work |

## Active replacements

- Product meaning and normative service boundaries: `Product_Law/PRODUCT_LAW.md`
- Development-field routing: `Product_Law/WIRING.md`
- Current chronological execution: `Masterplan/MASTERPLAN.md`
- Current frontier: `Masterplan/NEXT_SLICES.md`
- Operational procedure: applicable `skills/**/SKILL.md`
- Historical amendment evidence: this file only
