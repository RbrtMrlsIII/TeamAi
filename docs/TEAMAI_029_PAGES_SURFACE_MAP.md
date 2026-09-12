<!-- teamai-claim: PAGES-SURFACE-MAP state=DECIDED -->
# TeamAi — Canonical Pages Surface Map (#278)

**Status:** Decision record for AI-agent recovery (2026-09-12)
**Authority:** `PRODUCT_LAW.md` → `MASTERPLAN.md` → this map → `.github/workflows/github-pages.yml`
**Resolves:** #278 checklist item A (surface authority) as a precondition for item B (deployment map)

## Decision

Three product surfaces exist in this repository. They are not competing versions of one page — they are three different products at three different stages of the C0 funnel:

| Surface | Source | Role | Public root? |
|---|---|---|---|
| Classic entrance + 3D Hero | `public/` | Public front door (C0) -> explicit 3D-world entry (C2-C4) | **Yes**, as of this decision |
| Command Deck | `frontend/spatial/` | Future **authenticated workspace** (Seats/Planning/Working/Artifacts/Approvals) -- not a public homepage | No |

**`frontend/spatial/` is not superseded and is not deleted.** It is repositioned: it stops answering the door for unauthenticated visitors and becomes the destination *after* sign-in, per #276 and #278/#271. Until server-verified auth (C8) is implemented, it stays reachable only at `/spatial/`, unauthenticated, fixture-backed -- same content, different address, no entitlement implied.

## Canonical route ownership

```text
/          classic public entrance + 3D Hero   (public/)              -- C0 front door
/hero/     same build, kept resolvable          (public/)              -- compatibility path, existing links/tests
/spatial/  Command Deck                         (frontend/spatial/)    -- pre-auth staging area, NOT the front door
```

No route may silently become "current" without an entry in this table. Any future change to this map must be recorded here before the workflow changes, not after.

## Non-goals of this decision

- Does not implement C8 (server auth boundary).
- Does not remove Command Deck or its `/spatial/` route.
- Does not resolve C5 (dual camera nav walls) or C6 (`NAV_ZOOM_MAX` clamp) -- those remain #278 items E, tracked separately.
- Does not constitute a 029-released claim.

## Related

- #278 (this reconciliation), #276 (retire Command Deck Pages publication), #271
- `docs/TEAMAI_029_CURRENT_STATE_MAP.md`, `docs/TEAMAI_029_EXPERIENCE_REBASELINE.md`
- `.github/workflows/github-pages.yml` (implements this map)
