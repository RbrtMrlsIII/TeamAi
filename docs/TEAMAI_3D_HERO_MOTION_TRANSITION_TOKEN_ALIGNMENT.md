# TEAM-EXPERIENCE-029 — Motion / transition token alignment (Issue #95 · Slice I.2)

**Status:** living presentation alignment  
**Authority:** Product Law Family J · motion skill · transition skill · baseline §9 · cross-root matrix (I.1)  
**Scope:** How Hero hierarchy / camera timings **conceptually consume** the motion token vocabulary without a page-local timing namespace.

## Rule

- **Documentation holds numbers** (`docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9).
- **Motion skill** owns the shared duration / easing / delay / reduced-motion **roles**.
- **Transition skill** owns named **state pairs** (`from → to`).
- Hero `public/` may keep **named constants that match §9**; it must not invent a third unofficial timing table.
- Amend §9 + code together when a value is learned.

## §9 → motion role map (conceptual)

| §9 name | Value | Motion role (skill vocabulary) | Hero use |
|---------|-------|--------------------------------|----------|
| `OPEN_DURATION_MS` | `520` | **medium** enter | Hierarchy shell `opening` → `open` |
| `CLOSE_DURATION_MS` | `420` | **short–medium** exit | Hierarchy `closing` → `rest` |
| `CAMERA_LERP_MS` | `700` | **long** move | Semantic camera dock lerp |
| `HIERARCHY_REDUCED_SNAP` | `true` | reduced: travel → **none** / instant | Open/close and dock **snap** under `data-motion=reduced` |
| `REDUCED_MOTION_K` | `0.35` | reduced scale for non-hierarchy travel | Turn-loop / corridor durations scale; hierarchy prefers snap |
| `NAV_ZOOM_*` | bounds | travel none under reduced clamps | NAVIGATE zoom only |

Easing: prefer shared **enter / exit / move** roles from the motion skill when theme-root tokens exist. Until tokens are exported into `public/`, named §9 ms values remain the Hero implementation source — **not** a second language.

## Transition state pairs (Hero hierarchy)

| Pair | Owning field | Motion consumption | Reduced path |
|------|--------------|--------------------|--------------|
| `rest → opening → open` | Seat / hierarchy parent | `OPEN_DURATION_MS` (medium enter) | Snap open (`HIERARCHY_REDUCED_SNAP`) |
| `open → closing → rest` | Seat / hierarchy parent | `CLOSE_DURATION_MS` (short–medium exit) | Snap close |
| `HERO_WIDE / TEAM_ORBIT ↔ SEAT_CLOSE` | Camera R3 | `CAMERA_LERP_MS` (long move) | Snap dock |
| Ring focus change (R0/R1/R2) | Workspace rings | Prefer short / none | Static emphasis only |
| Theme mode light ↔ dark | Theme root | Material retune only (transition skill) | No layout reshuffle |

## Explicit non-goals (I.2)

- Does **not** ship a CSS `--hero-duration-*` parallel namespace.
- Does **not** change §9 numeric values.
- Does **not** implement full theme-root token export into WebGL (later if product requires).
- Does **not** claim 029 released.

## Alignment checklist

- [x] Every hierarchy duration used in runtime is **named in §9**
- [x] Motion skill forbids component-local duration stores
- [x] Transition skill requires Motion tokens / shared roles; reduced path required
- [x] G reduced-motion lighting contract remains the light choreography gate
- [x] Static tests bind §9 names ↔ runtime exports ↔ skill DO NOT language

## Boundaries

Presentation only · **no 029-released claim** · Merge gate #133 · Skills do not grant permission
