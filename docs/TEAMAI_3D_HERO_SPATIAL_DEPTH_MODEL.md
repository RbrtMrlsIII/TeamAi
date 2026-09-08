# TeamAi 3D Hero — Spatial Depth Model

**Status:** design/implementation contract for the Web AI Living Workspace Hero

**Continuity (2026-09-08):** Nested in-machine configuration (gears → parts → leaf controls) and environment-only outside tabs are locked in `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`. That contract supersedes older “all forms leave to external UI” wording for product configuration while preserving Product Law boundaries.

## 1. Purpose

The spatial Hero is a presentation layer for the Web AI experience. It is not a second authority system and it must never self-attest backend truth, authorization, scheduler eligibility, execution completion, provider entitlement, or protected approval state.

The Hero should become more informative as a human moves from a wide composition into closer inspection, but the semantics remain grounded in the Product Law hierarchy.

CanonicalProduct Law references are:

`Web AI Seat → responsibility → skills → capabilities → authorization → workspace → task → status → evidence → integration`

and, separately, trusted execution remains governed by durable state, authorization, scheduler eligibility, and server-owned evidence.

## 2. Spatial depth ladder

### Depth 0 — Hero / orientation

The default resting composition shows:

- Web AI Seats around the shared Web AI workspace.
- One active participant at a time.
- Persistent workspace artifacts.
- Editorial copy and high-level status.
- Semantic camera controls.

This layer answers **what is happening?**

### Depth 1 — Workspace parts

The circular workspace exposes a small number of physical spatial parts rather than a grid of cards.

Examples:

- `Surface` — shared workspace state.
- `Focus` — active Seat presentation state.
- `Trace` — persistent artifact/history representation.

These parts are presentation anchors. Clicking one can focus/highlight it and emit a presentation-only event. It does not authorize work or mutate durable state by itself.

This layer answers **which part of the experience is relevant?**

### Depth 2 — Functional mechanism

A closer camera can reveal the mechanism beneath the selected part. This is where future visual elements such as rings, rails, collars, pivots, locks, small gears, or actuator-like surfaces may appear.

The visual mechanism must correspond to an actual TeamAi concept, such as:

- responsibility/profile selection;
- skill resolution;
- capability availability;
- authorization presentation;
- workspace/ref context;
- task state;
- verification/evidence state.

A mechanism is never allowed to imply permission merely because it is visible or animated.

This layer answers **what product responsibility is represented here?**

### Depth 3 — State inspection

A semantic close camera can expose the selected object's current presentation state, such as:

- active/inactive;
- eligible/not eligible;
- connected/unavailable;
- pending/verified;
- selected context;
- accumulated artifacts.

The Hero may present backend-owned facts after the authoritative application state is available. It must not invent them.

This layer answers **what is the current state?**

### Depth 4 — In-machine leaf controls (updated by Machine Interaction Contract)

Leaf interaction (buttons, fields, toggles, short forms) remains **spatially inside** the opened parent mechanism. See `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`.

Semantic accessibility still applies (keyboard, labels, reduced motion). Durable commits still follow backend authority. Only **environment/legal tabs** intentionally live outside the machine.

This layer answers **what exact control am I operating?**

## 3. What belongs under the panels

The Hero should not invent a single universal “gearbox.” The internal parts should follow the selected concept.

### Surface / shared workspace

Possible internal visual stack:

`outer ring → state collar → recessed surface → artifact mounts → trace rail`

Product meaning: shared Web AI workspace state and durable-looking presentation traces.

### Focus / active Seat

Possible internal visual stack:

`seat mount → focus collar → responsibility dial → capability aperture → current-state indicator`

Product meaning: active Web AI Seat presentation and its configured responsibility context.

### Trace / history artifact

Possible internal visual stack:

`artifact tray → provenance rail → verification mark → handoff latch`

Product meaning: persistent contribution/history/evidence presentation without claiming that visual evidence itself is authoritative.

Future panels/settings/configuration should reuse these kinds of concept-specific assemblies rather than adding generic decorative machinery.

## 4. Resting angle behavior

The resting angle is an authored spatial pose, not a free-running orbit.

Each spatial part has a stable base pose:

`rest = authored pitch + authored yaw + authored depth`

Continuous movement is intentionally tiny:

`rest + low-frequency micro-drift`

Recommended behavior:

- Pitch drift: approximately ±0.8–1.2°.
- Yaw drift: approximately ±0.5–1.0°.
- Depth/breathing: approximately 1–3 px or equivalent local `translateZ` change.
- Drift periods should be several seconds, using different phase offsets per part.
- Hover/focus eases toward a clearer neutral pose.
- Active state temporarily suppresses most drift so the part reads as purposeful.
- Deactivation eases back to the authored resting angle.
- Reduced motion sets drift to zero and keeps only semantic state transitions.

The stage itself should not endlessly rotate. Camera motion is authored and semantic; resting objects breathe.

## 5. Continuous animation budget

Continuous effects are divided into four layers.

### Ambient

Slow, low-contrast movement that establishes a living physical environment:

- subtle part micro-drift;
- workspace surface breathing;
- very slow aura movement;
- restrained specular shimmer;
- occasional trace light fluctuation.

Ambient motion must remain subordinate to the active turn.

### Mechanical

Small, bounded motions that imply physical construction:

- collars settle into alignment;
- marker rings rotate a fraction of a turn;
- active mounts lift or seat by a small amount;
- tiny rails or latches move only during an actual interaction state.

Mechanical motion should have deliberate easing and a clear start/end state.

### Semantic state effects

These are short-lived and event-driven rather than perpetual:

- `FOCUS` — selection emphasis;
- `ACTIVE` — sustained active-state glow/breath;
- `CONTRIBUTE` — directional Seat → workspace energy;
- `ABSORB` — workspace receives the contribution;
- `REFLECT` — short acknowledgement ripple;
- `HANDOFF` — active emphasis decays before next Seat focus.

### Inspection motion

`wide → selected part → closer camera → mechanism reveal → nested children → leaf control`

Each step should use one dominant motion vector, preserve the workspace/contribution corridor, and return to a stable camera state on completion.

## 6. Click/zoom contract

A click on a spatial part is a presentation intent.

Conceptual transition:

`click part → focus part → move semantic camera → reveal deeper spatial layer → recurse if child is parent → leaf control inside machine`

The Hero must never use camera state as authorization.

Suggested presentation identifiers remain separate from backend authority identifiers (see Machine Interaction Contract).

## 7. Environment vs in-machine

Product configuration does **not** leave the machine for an external panel. Environment camera tabs (terms, privacy, about, contact) are the intentional outside. See Machine Interaction Contract §3.

## 8. Accessibility and reduced motion

All spatial states need equivalent semantic UI meaning. Visual effects cannot be required to understand or complete an action.

For reduced motion:

- remove micro-drift;
- remove camera travel where practical;
- replace travel with state changes and short opacity/scale transitions;
- preserve selection, focus, and status semantics;
- preserve keyboard navigation and accessible names.

## 9. Product Law boundary

This model follows the spatial-experience law: spatial UI is a human-facing map and presentation layer, not a second authority layer. The frontend owns presentation/interaction and must not invent backend truth, bypass authorization, choose the scheduler's actor, or become provider execution authority.

## 10. Design principle

**The deeper the camera goes, the more concrete the product concept should become.**

A shallow layer can be atmospheric. A deep layer must be semantic. Leaves remain inside the machine; only the room around the machine is outside.
