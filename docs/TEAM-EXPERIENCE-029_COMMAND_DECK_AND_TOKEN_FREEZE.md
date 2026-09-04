# TEAM-EXPERIENCE-029 — Command Deck Storyboard and Token-Family Freeze

Status: planning baseline only. No frontend implementation is authorized by this document.

## 1. Product-order verdict

TEAM-EXPERIENCE-029 is not a choice between building a hero first or building twenty pages first.

The correct order is:

`Give life → Skeleton → Hero proof → Remaining compositions → Assign roots/values → Simple scripts → Code`

The **skeleton is the foundation**. The **Command Deck is the first body that wears it**.

A hero spatial environment without a shared skeleton becomes a mood board. Designing every page before shared type, size, space, surface, elevation, state, and motion roots exist creates page-local visual authorities and forces later rework.

## 2. Meaning of “give life”

“Give life” means defining what each planned composition must communicate and allow the user to do. It does not mean implementing a landing-page hero, creating twenty routes, or assigning private visual recipes.

Fields remain the product meaning units. Pages are compositions of fields presented together for a human task.

Every planned composition records purpose, visible information, primary action, elevation peak, consumed primitives, and 029 concepts that must remain visible on compact viewports.

No composition receives a private palette, font stack, glass recipe, spacing scale, or motion system.

## 3. First proof composition — Command Deck

The Command Deck is the first inhabited skeleton because it exercises the 029 concepts that the visual system must carry:

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

### Region contract

| Region | Primitive | Elevation | Must be seen |
|---|---|---|---|
| Atmosphere | Environment | E0 | Depth only; no durable data |
| Shell | Shell | E1 | Workplace, Project, health, theme, account |
| Nav | Navigation | E1 | Same labels in Dark, Light, and compact views |
| Seat rail | Cards in Panel | E2 | Name, role, provider, model, connection, eligibility/speaking |
| Active | Panel | E3 | Planning or Working; user instruction remains visible |
| Why-next | Panel | E2 | Dependency + event + readiness + scheduler + authorization |
| Status | Shell | E2 | Connection, TeamAi vs provider entitlement, recovery; text + icon |
| Approval | Modal Panel | E4 | Action + impact + APPROVE/DENY; strongest visual plate |

Planning vs Working is a product stage inside E3, not a second theme and not a fork of the skeleton.

Primary action: operate the current team/task — instruct, observe the current turn/task, approve or refuse an action, and switch Planning/Working without losing context.

## 4. Material retuning

### Command Space — Dark Spatial Glassmorphism (recommended name; not yet endorsed)

- Deep spatial field.
- Stable, readable shell.
- Restrained glass treatment on elevated panels.
- Localized light on active seat/task.
- Approval surface is close to opaque.
- Blur is an edge cue, not the default fill.
- Elevation communicates hierarchy rather than decorative glow.

### Instrument Space — Light Spatial Skeuomorphism (recommended name; not yet endorsed)

- Warm/light workspace foundation.
- Bezel-like shell treatment.
- Inset fields.
- Raised controls.
- Pressed state becomes inset.
- Physical depth is controlled and purposeful.
- Not an inverted Dark theme and not a white-glass imitation.

The two modes preserve the same meaning, structure, controls, and elevation roles. They may retune material treatment and shadow/light behavior only.

## 5. Interaction baseline

Keyboard order for the Command Deck:

`Shell → Navigation → Seats → Active → Why-next → Status → Approval (when open)`

Reduced motion means no travel and no pulse. Theme switching does not reshuffle layout.

## 6. Token-family freeze — names only

One semantic namespace. Values are intentionally deferred.

| Family | Frozen semantic roles | Dark/Light may retune |
|---|---|---|
| Theme | mode, color-scheme, source (user preference beats OS preference) | No change to meaning |
| Surface | atmosphere, shell, panel, active, modal, inset, raised | fill/material treatment |
| Depth | atmosphere, scrim (E4 only), blur-cap, optional-light-grain | intensity |
| Elevation | e0…e4 + focus; no e5 | shadow/light language |
| Type | family, mono, display, title, body, label, meta, status | color relative to surface |
| Size | control-sm/md/lg, icon, radius-scale, seat-card, focus-ring | No semantic drift |
| Space | inset, stack, gutter, shell, density-default/compact | No page-local padding rules |
| State | focus, hover, pressed, selected, disabled, speaking; status ok/degraded/blocked/unauthorized | accent only; not meaning |
| Motion | instant/short/medium/long; enter/exit/move; travel-none/small | No page-local timing |

Legal shared boxes are limited to:

`Shell · Panel · Card · Control · Navigation`

The Command Deck composes these primitives. It does not redefine their visual authority.

## 7. Motion ownership

Motion owns duration/easing/travel tokens.

Transition consumes Motion tokens for bounded state changes.

Animation consumes Motion tokens for bounded choreographed sequences.

Pages and compositions do not invent durations, curves, or local motion systems.

## 8. Composition set for initial 029 proof

These are compositions, not numbered roots:

| Composition | Must be seen | Primary action | Elevation peak |
|---|---|---|---|
| Command Deck | Shell, nav, team, seats, active task, status | Operate current team/task | Active task |
| Workplace / Project | Workplace, Project, context, health | Enter/switch context | Panel |
| Seat / Provider | Seat, provider, runtime, model, connection, skills, tools | Bind/test/activate | Panel |
| Planning Team | Shared conversation, turns, summarizer, user review | Approve / Edit / More / Reject | Conversation panel |
| Working Team | Task, dependency, event, why-next | Review execution | Active task |
| Approval / Action | Action request, impact, confirm/deny | Approve/refuse | E4 modal |
| Artifacts | Files, handoffs, results | Open/attach | Card |
| Commerce | TeamAi entitlement vs provider entitlement | Buy/manage | Panel |
| Settings | Connections, limits, theme | Save setting | Panel |
| Recovery | Failures, retries, diagnostics | Recover | Panel |

More compositions are added only when a real view requires a new assembly.

## 9. Explicit non-goals before baseline endorsement

- No HTML.
- No CSS.
- No JavaScript/TypeScript UI implementation.
- No field-number assignment.
- No page-local theme roots.
- No page-local palettes, fonts, spacing scales, or motion durations.
- No second browser-verification skill; the existing Playwright/browser-smoke capability remains the verification surface.
- No backend, scheduler, Firestore, entitlement, or authorization behavior is introduced by this visual baseline.

## 10. Next authorized design slice

Before UI implementation, this planning baseline must be endorsed.

After endorsement and explicit 029 UI authorization:

1. Establish the unified theme root, semantic tokens, and `color-scheme` behavior.
2. Establish Shell, Panels, Cards, Controls, and Navigation primitives.
3. Assemble the application shell and navigation.
4. Build one Command Deck proof using the skeleton in both Command Space and Instrument Space.
5. Add remaining compositions only by consuming the same skeleton.
6. Only then assign concrete root values for size, type, space, boxes, and motion.
7. Add simple presentation scripts only: theme switch, focus, panel presence, stage switch, approval mount, reduced-motion mapping.
8. Proceed to UI code only after the preceding baseline is stable and verified.

Root numbering is the final reconciliation step: number only the roots that survive contact with the real implementation tree.
