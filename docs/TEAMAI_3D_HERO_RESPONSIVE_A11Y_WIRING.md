# TEAM-EXPERIENCE-029 — Responsive + accessibility wiring (Issue #95 · Slice I.3)

**Status:** living presentation wiring  
**Authority:** Product Law Family J · responsive skill · accessibility skill · hierarchy R7/R8 · G reduced-motion lighting contract (#89)  
**Scope:** How Hero consumes responsive + a11y companions without a second product mode.

## Rule

- **One theme root** — no mobile-only theme, no “a11y mode” product fork.
- **Responsive** adapts primitives/density/FOV; it does not invent business rules from viewport width.
- **Accessibility** requires keyboard paths, visible focus language, non-color status, and reduced-motion collapse.
- **G contract** (`docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md`) remains the lighting choreography gate (RM-L1–L6).

## Responsive consumption (Hero)

| Concern | Source | Hero note |
|---------|--------|-----------|
| Narrow FOV | §9 `FOV_BOOST_NARROW` (`+4`) | R7 — `responsiveFovBoost` pattern |
| Seat density 1–8 | profile / §9 workspace–seat radii | Presentation scaling only |
| Pointer / touch | Responsive + accessibility skills | Hover never the only path (nav already has keyboard + touch orbit) |
| Collapse priority | Responsive skill | Keep hierarchy/open readable; do not hide status meaning |

## Accessibility consumption (Hero)

| Concern | Hero note |
|---------|-----------|
| Keyboard | Hierarchy keys; R0 `z`/`x`; R1 `[`/`]`; R2 `;`/`'`; Escape close; inspection spine |
| Reduced motion | `document.documentElement` `data-motion` only (RM-L1); hierarchy snap; pulse gated |
| Non-color status | Connection health / auth / task labels use text tokens, not color alone |
| Focus | Seat-stack / ring focus aria-pressed + aria-live presentation-only names |
| Presentation boundary | Labels deny entitlement / required setup |

## Reduced-motion regression (must stay true)

| ID | Still required |
|----|----------------|
| RM-L1 | documentElement `data-motion` |
| RM-L2 | adapter `reducedMotionChoreography === false` when reduced |
| RM-L3 | pulse / sin emit freezes under reduced |
| RM-L4 | camera + hierarchy snap |
| RM-L5 | materials pure; no second theme root |
| RM-L6 | light ≠ authorization |

## Explicit non-goals (I.3)

- No new runtime FOV math in this slice (docs/tests only unless a bug is proven).
- No full WCAG audit package (browser-smoke remains optional evidence).
- No 029-released claim.

## Boundaries

Presentation only · **no 029-released claim** · Merge gate #133
