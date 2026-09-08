# TEAM-EXPERIENCE-029 — Cross-root skill wiring matrix (Issue #95 · Slice I.1)

**Status:** living presentation wiring map  
**Authority:** Product Law Family J · `docs/SKILL_WIRING.md` · Issue #95  
**Scope:** How the 3D Hero / spatial experience **consumes** existing frontend spatial companion skills without creating parallel roots.

## Rule

Hero presentation **consumes** shared semantic skills. It does **not** invent a second theme, motion, transition, animation, responsive, or accessibility root.

Integration model (from #95):

`canonical theme root → bounded skill vocabulary → spatial semantic adapter → renderer`

## Companion skill matrix

| Companion | Path | Owns | Hero consumption (I.1) | Must not become |
|-----------|------|------|------------------------|-----------------|
| UI_UX-Promax | `skills/frontend/spatial/UI_UX-Promax-Skill.md` | Spatial coordinator / F0–F7 map | Coordinator for all companions | Second product law |
| Motion | `skills/frontend/spatial/motion/SKILL.md` | Duration / easing / delay / reduced-motion map | Hierarchy open/close, camera lerp, ring focus; §9 named durations align conceptually | Page-local timing namespace |
| Transition | `skills/frontend/spatial/transition/SKILL.md` | State-pair enter/exit | Theme mode, seat select, shell open/close pairs | Domain state animation |
| Animation | `skills/frontend/spatial/animation/SKILL.md` | Multi-step choreography | Contribution corridor, optional pulses; **collapse under reduced** (G contract) | Idle decorative loops |
| Responsive | `skills/frontend/spatial/responsive/SKILL.md` | Viewport / density adaptation | `responsiveFovBoost`, seat density 1–8, compact framing | Mobile-only business rules |
| Accessibility | `skills/frontend/spatial/accessibility/SKILL.md` | Focus, keyboard, non-color status, reduced motion | Keyboard hierarchy + R0–R2 focus; aria-live presentation-only; data-motion | Second “a11y mode” product |
| Hierarchy runtime | `skills/frontend/spatial/hierarchy-runtime/SKILL.md` | R1–R10 open-machine grammar + §9 numbers | Seat shell, docks, one-open | Entitlement from open |
| Seat shell | `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md` | First parent fill (Seat v1) | SEAT_SHELL children + health leaf | Durable seat authority |
| Workspace ring | `skills/frontend/spatial/workspace-ring/SKILL.md` | R0–R2 rings + ZipSkills home | Backend/setup faces, WORKSPACE_ZIPSKILLS | OAuth / live bind from canvas |

## Shape contract (every companion)

Operational skills must expose the standard pattern (SKILL_WIRING §6):

`WHEN TO USE → AUTHORITY → ACTION → DO NOT → PASS`

(`INPUT` / `EVIDENCE` / `SEE ALSO` preferred when present.)

## Explicit non-skills (do not invent)

| Topic | Correct home |
|-------|----------------|
| Hero lighting / theme | `frontend/spatial/hero-theme-lighting-adapter.js` + theme root — **no** Hero lighting skill |
| Living numbers | `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9 |
| Reduced-motion lighting | `docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md` (G / #89) |

## I.1 exit criteria

- [x] Matrix document exists and lists all companions above
- [x] Static tests assert each `SKILL.md` path exists
- [x] Static tests assert WHEN / AUTHORITY / ACTION / DO NOT / PASS sections
- [x] Hierarchy + workspace + UI_UX-Promax included
- [x] No runtime / hero-flex change in this slice
- [x] **No 029-released claim**

## Later I steps (not this PR)

- **I.2** Motion + transition token alignment notes vs §9
- **I.3** Responsive + accessibility wiring assertions + reduced-motion regression

## Boundaries

Presentation only · Merge gate #133 · Skills do not grant permission
