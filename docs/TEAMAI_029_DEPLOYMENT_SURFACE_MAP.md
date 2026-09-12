# TeamAi 029 — Deployment Surface Map

**Status:** ACTIVE planning/reconciliation contract for Issue #278.  
**Authority:** subordinate to `PRODUCT_LAW.md`, `MASTERPLAN.md`, and ORUCAVEAM.  
**Scope:** GitHub Pages route ownership for the public TeamAi experience.  
**No 029-released claim.**

## Canonical surface model

```text
/TeamAi/
    ↓
classic public website entrance (`public/`)
    ↓
explicit “Enter 3D world”
    ↓
3D world / Hero (`public/` runtime)
    ↓
coherent world navigation + Settings
    ↓
authenticated / server-authorized workspace
```

The former Command Deck is **retired as a product/deployment surface**. The spatial machine's future workspace responsibility is owned by the authenticated world and workspace-center model defined by Product Law / Issue #278. Historical Command Deck source and records remain preserved for reconstruction/history and do not constitute a published route or current product authority.

## Route ownership

| Route | Source | Purpose | Status |
|---|---|---|---|
| `/TeamAi/` | `public/` | canonical public website entrance | ACTIVE TARGET |
| `/TeamAi/hero/` | `public/` | compatibility route for the same classic entrance + 3D world | COMPATIBILITY |
| `/TeamAi/spatial/` | retired `frontend/spatial/` publication | former Command Deck workspace/transition surface | **RETIRED / NOT DEPLOYED** |

## Rules

1. The public root must not silently resolve to the retired Command Deck.
2. `/TeamAi/spatial/` is not a current product route and must not be republished as a new workspace authority under another label or compatibility alias.
3. Surviving workspace capabilities must be re-owned by the authenticated spatial machine/workspace-center contract rather than resurrecting the Command Deck shell.
4. `/hero/` must not become a second competing product definition. It is a compatibility publication of the same `public/` source unless later superseded by an explicit route decision.
5. Browser acceptance for the 029 public experience must begin at `/TeamAi/`, not `/TeamAi/hero/` alone.
6. Deployment presence is not authorization. Full workspace capabilities require the separate C8 server-verified authentication/authorization boundary.
7. Historical Command Deck files and commits remain evidence and may be inspected for recovery, but they must not be treated as current UI specifications without a fresh Product Law decision.
8. Any later route consolidation or replacement must be recorded as an explicitly authorized product-experience change and reconciled before implementation.

## Current published topology

```text
public/ → GitHub Pages root
public/ → /hero/ compatibility route
frontend/spatial/ → repository history / reconstruction only
```

The GitHub Pages workflow deliberately does **not** copy `frontend/spatial/` into the deployment artifact.

## Acceptance evidence required

- Root page renders the classic entrance.
- “Enter 3D world” is present at the root and reaches the 3D world.
- `/hero/` remains functional as the compatibility route.
- `/spatial/` is absent from the published artifact because the Command Deck surface is retired.
- Deployment smoke checks validate only the currently published public surfaces.
- Desktop and phone acceptance start from the canonical root in C9.
- Future authenticated workspace acceptance occurs through the spatial machine/workspace-center contract, not through a Command Deck route.
