# TeamAi Spatial Skill Family

Coordinator plus bounded companions for the TeamAi Spatial Environment.

```text
UI_UX-Promax-Skill.md          coordinator
        |
        |-- Theme/root architecture
        |-- Legal boxes vs F0–F7 field identity
        |-- Semantic tokens / primitives
        |-- Spatial composition / discrepancy review
        |
        |-- transition/SKILL.md         state transitions
        |-- animation/SKILL.md          choreography
        |-- motion/SKILL.md             movement / timing tokens
        |-- responsive/SKILL.md         viewport adaptation
        |-- accessibility/SKILL.md      contrast / focus / keyboard / reduced motion
        `-- (Playwright) skills/verification/browser-smoke/SKILL.md
```

Do **not** add a 3D Hero skill. Hero is a composition. It consumes the single theme root through `frontend/spatial/hero-theme-lighting-adapter.js` and the existing motion/transition/animation/responsive/accessibility companions.

Seat Identity Inspection and live-domain joins stay blocked until TEAM-BACKEND-001 is endorsed.

## Legal boxes vs field identity

**Legal boxes** (only five reusable general-purpose boxes):
`Shell · Panel · Card · Control · Navigation`

**Field identity (F0–F7)** is implementation numbering, not a rewrite of legal-box law:

| Field | Identity | Status |
|-------|----------|--------|
| F0 | Atmosphere | environment only; not a legal box |
| F1 | Shell | existing legal box |
| F2 | Navigation | existing legal box |
| F3 | Panel | existing legal box |
| F4 | Card | existing legal box |
| F5 | Control | existing legal box |
| F6 | Status | controlled system surface; not a legal box |
| F7 | Modal | controlled system surface; not a second dialog system |

Do not promote Status or Modal into the legal-box list. Do not invent a sixth legal box.

Playwright is already the verification skill. Do not create a second Spatial Playwright skill.

## Frontend runtime mirrors (until a bundler exists)

Presentation sources under `frontend/spatial/`:

| File | Role |
|------|------|
| `theme-root.ts` | Typed source of theme bootstrap/persistence API |
| `theme-root.js` | **Browser ESM entry** — keep in sync with `.ts` |
| `theme-root.css` | Token + primitive surfaces |
| `hero-theme-lighting-adapter.js` | Deterministic theme/root → Hero lighting map. Not a second root. |
| `shell-nav.js` | **Browser ESM entry** for shell/nav/deck/F7 scripts |
| `shell-nav.ts` | Typed mirror of `shell-nav.js` (documentation / future tsc); not loaded by static HTML |

Static `index.html` must import **`.js`** modules only. Do not point `<script type="module">` at `.ts` files.

When changing theme or presentation behavior, update the pair (`.ts` + `.js`) in the same change, or document intentional lag.
