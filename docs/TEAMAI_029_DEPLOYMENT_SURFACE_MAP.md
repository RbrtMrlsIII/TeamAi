# TeamAi 029 — Deployment Surface Map

**Status:** ACTIVE planning contract for Issue #278.  
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

## Route ownership

| Route | Source | Purpose | Status |
|---|---|---|---|
| `/TeamAi/` | `public/` | canonical public website entrance | ACTIVE TARGET |
| `/TeamAi/hero/` | `public/` | compatibility route for the same classic entrance + 3D world | COMPATIBILITY |
| `/TeamAi/spatial/` | `frontend/spatial/` | Command Deck workspace/transition surface | RETAINED, NOT PUBLIC FRONT DOOR |

## Rules

1. The public root must not silently resolve to the Command Deck.
2. The Command Deck may remain available under `/spatial/` while its future authenticated-workspace role is reconciled.
3. `/hero/` must not become a second competing product definition. It is a compatibility publication of the same `public/` source unless later superseded by an explicit route decision.
4. Browser acceptance for the 029 public experience must begin at `/TeamAi/`, not `/TeamAi/hero/` alone.
5. Deployment presence is not authorization. Full workspace capabilities require the separate C8 server-verified authentication/authorization boundary.
6. Any later route consolidation must be recorded as a user-authorized change and reconciled through the validation-change protocol before implementation.

## Current topology before #278 implementation

```text
frontend/spatial/ → GitHub Pages root
frontend/spatial/ → /spatial/
public/           → /hero/
```

## Target topology for this slice

```text
public/           → GitHub Pages root
public/           → /hero/ (compatibility)
frontend/spatial/ → /spatial/ (workspace/transition)
```

## Acceptance evidence required

- Root page renders the classic entrance.
- “Enter 3D world” is present at the root and reaches the 3D world.
- `/hero/` remains functional as the compatibility route.
- `/spatial/` still renders the Command Deck without claiming it is the public homepage.
- Deployment smoke checks validate the three surfaces deterministically.
- Desktop and phone acceptance start from the canonical root in C9.
