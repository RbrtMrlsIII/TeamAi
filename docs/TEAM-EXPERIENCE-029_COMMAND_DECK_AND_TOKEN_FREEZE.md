# TEAM-EXPERIENCE-029 — Command Deck Storyboard and Token-Family Freeze

Status: planning baseline only. No frontend implementation is authorized by this document.

## Product-order verdict

`Give life → Skeleton → Hero proof → Remaining compositions → Assign roots/values → Simple scripts → Code`

The skeleton is the foundation. The Command Deck is the first body that wears it.

“Give life” defines what each composition must communicate and allow the user to do. It does not mean a landing-page hero, twenty routes, or private visual recipes. Fields remain the meaning units; pages are compositions of fields.

## Command Deck — first inhabited skeleton

```text
E0  ATMOSPHERE
    ┌────────────────────────────────────────────────────────────┐
E1  │ SHELL   Workplace / Project   health   theme   account     │
E1  │ NAV     Deck · Workplace · Seats · Planning · Working     │
    │         Artifacts · Approvals · Settings                  │
    ├────────────┬────────────────────────────┬────────────────┤
E2  │ SEATS      │ E3 ACTIVE                  │ E2 WHY-NEXT    │
    │ cards      │ Planning conversation OR   │ dependency     │
    │ role       │ Working task               │ event          │
    │ provider   │ user instruction pinned    │ scheduler      │
    │ health     │                            │ capability     │
    ├────────────┴────────────────────────────┴────────────────┤
E2  │ STATUS   connections · entitlement · recovery             │
    └────────────────────────────────────────────────────────────┘
E4  approval overlay — only when an action request exists
```

| Region | Primitive | Elevation | Must be seen |
|---|---|---|---|
| Atmosphere | Environment | E0 | Depth only; no durable data |
| Shell | Shell | E1 | Workplace, Project, health, theme, account |
| Nav | Navigation | E1 | Same labels in Dark, Light, compact |
| Seat rail | Cards in Panel | E2 | Name, role, provider, model, connection, eligibility/speaking |
| Active | Panel | E3 | Planning or Working; user instruction remains visible |
| Why-next | Panel | E2 | Dependency + event + readiness + scheduler + authorization |
| Status | Shell | E2 | Connection, TeamAi/provider entitlement, recovery; text + icon |
| Approval | Modal Panel | E4 | Action + impact + APPROVE/DENY; strongest plate |

Planning vs Working is a product stage inside E3, not a second theme and not a fork of the skeleton.

Primary action: operate the current team/task — instruct, observe, approve/refuse an action, and switch Planning/Working without losing context.

## Material personalities

### Command Space — Dark Spatial Glassmorphism
Recommended name; not endorsed yet.

Deep spatial field, stable opaque shell, restrained glass on elevated panels, localized light on active seat/task, near-opaque approval surface. Blur is an edge cue, not a default fill. Elevation carries hierarchy rather than decorative glow.

### Instrument Space — Light Spatial Skeuomorphism
Recommended name; not endorsed yet.

Warm/light foundation, bezel-like shell, inset fields, raised controls, pressed controls become inset. Physical depth is controlled and purposeful. It is not inverted Dark and not white glass.

Both modes preserve meaning, structure, controls, and elevation roles; only material treatment and shadow/light language may retune.

## Interaction baseline

Keyboard order:

`Shell → Navigation → Seats → Active → Why-next → Status → Approval (when open)`

Reduced motion means no travel and no pulse. Theme switching does not reshuffle layout.

## Token-family freeze — names only

One semantic namespace. Values come later.

| Family | Frozen roles | Dark/Light may retune |
|---|---|---|
| Theme | mode, color-scheme, source (user beats OS) | material only |
| Surface | atmosphere, shell, panel, active, modal, inset, raised | fill/material |
| Depth | atmosphere, scrim (E4 only), blur-cap, optional-light-grain | intensity |
| Elevation | e0…e4 + focus; no e5 | shadow/light |
| Type | family, mono, display, title, body, label, meta, status | color relative to surface |
| Size | control-sm/md/lg, icon, radius-scale, seat-card, focus-ring | no semantic drift |
| Space | inset, stack, gutter, shell, density-default/compact | no page-local padding |
| State | focus, hover, pressed, selected, disabled, speaking; ok/degraded/blocked/unauthorized | accent only |
| Motion | instant/short/medium/long; enter/exit/move; travel-none/small | no page-local timing |

Legal shared boxes:

`Shell · Panel · Card · Control · Navigation`

The Deck composes these primitives; it does not restyle them per page.

## Motion ownership

Motion owns duration/easing/travel tokens. Transition consumes them for bounded state changes. Animation consumes them for bounded choreographed sequences. Pages do not invent durations, curves, or local motion systems.

## Initial composition set

These are compositions, not numbered roots.

| Composition | Must be seen | Primary action | Elevation peak |
|---|---|---|---|
| Command Deck | Shell, nav, team, seats, active task, status | Operate current team/task | Active task |
| Workplace / Project | Workplace, Project, context, health | Enter/switch context | Panel |
| Seat / Provider | Seat, provider, runtime, model, connection, skills, tools | Bind/test/activate | Panel |
| Planning Team | Shared conversation, turns, summarizer, review | Approve / Edit / More / Reject | Conversation panel |
| Working Team | Task, dependency, event, why-next | Review execution | Active task |
| Approval / Action | Action request, impact, confirm/deny | Approve/refuse | E4 modal |
| Artifacts | Files, handoffs, results | Open/attach | Card |
| Commerce | TeamAi entitlement vs provider entitlement | Buy/manage | Panel |
| Settings | Connections, limits, theme | Save setting | Panel |
| Recovery | Failures, retries, diagnostics | Recover | Panel |

Add another composition only when a real view requires a new assembly.

## Non-goals before endorsement

- No HTML, CSS, or UI JavaScript/TypeScript.
- No field-number assignment.
- No page-local theme roots, palettes, fonts, spacing scales, or motion durations.
- No second browser-verification skill; existing Playwright/browser-smoke remains the verification surface.
- No backend, scheduler, Firestore, entitlement, or authorization behavior is introduced by this baseline.

## After endorsement and explicit 029 UI authorization

1. Establish the unified theme root, semantic tokens, and `color-scheme` behavior.
2. Establish Shell, Panels, Cards, Controls, and Navigation primitives.
3. Assemble the application shell and navigation.
4. Build one Command Deck proof in both Command Space and Instrument Space using the same skeleton.
5. Add remaining compositions by consuming the same skeleton.
6. Assign concrete roots for size, type, space, boxes, and motion only after that contact with implementation.
7. Add simple presentation scripts only: theme switch, focus, panel presence, stage switch, approval mount, reduced-motion mapping.
8. Proceed to UI code only after the baseline is stable and verified.

Root numbering is the final reconciliation step: number only roots that survive contact with the implementation tree.
