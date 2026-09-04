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
