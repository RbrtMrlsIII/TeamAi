# TEAM-EXPERIENCE-029 — Reduced-motion lighting contract (Issue #89)

**Status:** living presentation contract  
**Authority:** Product Law Family J · Hierarchy Runtime R5 / R8 · theme-root → mapHeroThemeLighting  
**Scope:** Hero spatial lighting under `data-motion=reduced` (or system prefers-reduced-motion)

## Rule

Spatial lighting must remain **semantically readable** when continuous choreography is disabled. Hierarchy, rings, seats, and contribution states must not require oscillating or traveling light to be understood.

## Hard requirements

| ID | Requirement | Fail if |
|----|-------------|---------| 
| RM-L1 | Source of truth for reduced is `document.documentElement` `data-motion` (and system media as input to that attribute) | body-level or canvas-local motion authority |
| RM-L2 | `mapHeroThemeLighting({ reducedMotion: true }).reducedMotionChoreography === false` | choreography still true under reduced |
| RM-L3 | Time-based pulse / sin-driven emit / scale on traces, absorb rings, ZipSkills torus, backend threads **snaps or freezes** when reduced | continuous oscillation required for meaning |
| RM-L4 | Camera and hierarchy open/close already snap under `HIERARCHY_REDUCED_SNAP` | continuous camera lerp required under reduced |
| RM-L5 | Materials stay pure functions of theme + density + signal; reduced only gates choreography, not material roles | second theme root or reduced inventing materials |
| RM-L6 | Presentation only — no entitlement, scheduler, or durable bind from light state | light implies authorization |

## Implementation notes (main)

- Adapter: `frontend/spatial/hero-theme-lighting-adapter.js` — pure; returns `reducedMotionChoreography: !reducedMotion`.
- Canvas: `public/hero-flex.js` — pulse paths already gated with `if (!reducedMotion)`.
- Aura CSS vars: `public/hero-aura.js` — sets `--hero-light-motion` from choreography flag.
- Hierarchy: open/close durations snap via `HIERARCHY_REDUCED_SNAP`.

## Verification

- Static tests: adapter reduced fixture → choreography false; hero-flex pulse sites gated; Isolation preserved.
- Optional browser: toggle `data-motion=reduced` → no continuous light dance; hierarchy still openable via snap.

## Non-goals

- Does not implement #95 cross-root motion integration (blocked until this contract is clean).
- Does not change Masterplan 029 release status.
- Does not freeze §9 living numbers.

## Boundaries

Presentation only · **no 029-released claim** · Merge gate #133
