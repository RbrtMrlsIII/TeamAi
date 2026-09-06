# TeamAi — 3D Hero Skeuomorphic Light System

**Status:** DESIGN BASELINE
**Scope:** 3D Hero visual system, POV cameras, camera traversal, animation behavior
**Product surface:** Main TeamAi web experience / Web AI Hero

## 1. Intent

The Hero is a spatial, interactive demonstration of the Web AI experience inside TeamAi. It is not a 3D copy of the entire frontend and it is not an administrative Command Deck.

TeamAi is the underlying product/system that provides identity, coordination, durable state, permissions, verification, and orchestration. The visible world in this Hero represents the **Web AI shared workspace** and the **Web AI Seats** that participate in it.

The visual metaphor is **knowledge/contribution circulation**. Energy is only the visual language for that circulation; it must never imply that one provider directly commands another.

Canonical conceptual path:

`eligible Web AI Seat → shared workspace/state → next eligible Web AI Seat`

not:

`Web AI A → Web AI B`

## 2. Light-theme skeuomorphic direction

### 2.1 Design thesis

Use believable physical materials and spatial relationships so the interface feels like a real, carefully engineered tabletop instrument rather than a collection of floating UI panels.

The scene should read as **soft industrial / premium laboratory instrument**:

- warm-neutral light environment
- matte and satin surfaces
- restrained glass/translucency only where it explains layering
- shallow bevels and real edge highlights
- realistic contact shadows and soft bounce
- small amounts of brushed metal, ceramic, frosted polymer, and glass
- subtle emissive energy accents used for state, never for decoration alone

Avoid sci-fi neon, cyberpunk black glass, holographic clutter, giant floating text, or a giant central TeamAi logo/brain.

### 2.2 Material hierarchy

| Material | Primary use | Behavior |
|---|---|---|
| Ceramic / matte polymer | Web AI Seat housings | soft highlight, tactile silhouette |
| Brushed metal | structural rings, rails, connectors | narrow anisotropic highlight |
| Frosted glass | workspace surface / state layer | translucent depth, controlled reflections |
| Clear glass | small status windows | only for legibility and state grouping |
| Emissive filament | contribution carrier | animated pulse, short-lived |
| Paper / card stock | optional durable artifact markers | communicates accumulated knowledge without becoming UI |

### 2.3 Form language

Primary forms are rounded rectangles, discs, rings, short cylinders, trays, rails, and beveled blocks. Every repeated form should have a small family of dimensions so the world feels manufactured, not procedurally random.

Use visible thickness. Important objects should have a believable underside, mounting point, or shadow footprint.

## 3. Scene topology

```text
                         [ WEB AI SEAT ]
                                │
                          contribution
                                ▼
       [ WEB AI SEAT ] ───► [ SHARED WORKSPACE ] ◄─── [ WEB AI SEAT ]
                                ▲
                                │
                          contribution
                                │
                         [ WEB AI SEAT ]
```

### 3.1 Hero object: shared workspace

The central object is the Web AI shared workspace, not TeamAi itself.

It should be physically substantial enough to dominate the hero frame. Recommended form: a shallow circular or rounded-hexagonal work surface with a layered center, artifact slots, and a recessed state channel.

The workspace has three visible layers:

1. **Surface** — stable shared working plane.
2. **State layer** — subtle inner ring or glass layer showing accumulated activity.
3. **Artifact field** — small persistent physical markers representing validated knowledge/results/events.

The workspace should look more alive after a successful contribution than before it, but never look damaged by the contribution.

### 3.2 Web AI Seat objects

Each Seat is a distinct, reusable manufactured object around the workspace. Seats may differ through a restrained capability/role accent, not through arbitrary body redesign.

Each Seat exposes only presentation-safe facts:

- seat identity / label
- availability state
- active/inactive state
- current visual participation state
- contribution anchor
- optional role/capability accent

Provider-private reasoning, secrets, prompts, or internal model state are never rendered.

### 3.3 Contribution corridor

Each Seat has a clear spatial corridor to the workspace. Corridors should remain visible from the Hero cameras so the core metaphor is readable without labels.

The corridor uses a short-lived carrier: pulse, ribbon, filament, or bead-like packet. The carrier represents a contribution/event entering shared state, not a direct provider-to-provider message.

## 4. Spatial hierarchy

The visual priority must remain:

`shared workspace > active Web AI Seat > remaining Seats > environment`

No decorative asset may compete with the workspace during an active turn.

The active Seat should become visually legible primarily through light, subtle lift/rotation, and contribution readiness. Avoid enormous scale jumps.

## 5. State-driven animation model

Animation is a rendering of application state. It is never the source of scheduler, authorization, task, or execution truth.

```text
IDLE
  ↓
FOCUS
  ↓
ACTIVE
  ↓
CONTRIBUTE
  ↓
ABSORB
  ↓
REFLECT
  ↓
HANDOFF
  ↓
FOCUS(next eligible Seat)
```

### IDLE

All Seats are visible with low-amplitude ambient motion. The workspace has a nearly imperceptible breathing/ring motion.

### FOCUS

The next eligible Seat receives an authored emphasis cue. Non-active Seats reduce their visual movement slightly.

### ACTIVE

The selected Seat becomes the visual source of activity. Its contribution anchor becomes readable and the workspace remains visible in the same frame when practical.

### CONTRIBUTE

A single directional carrier travels from the active Seat toward the shared workspace. The camera may follow this movement only when the application is already in this state.

### ABSORB

The carrier terminates inside the workspace state layer. The workspace receives the event visually through a ripple, ring expansion, or layered insertion.

### REFLECT

The workspace emits a short acknowledgment: state layer settles, new artifact marker appears/updates, ambient motion returns.

### HANDOFF

The active Seat returns to baseline. The next eligible Seat becomes focus. There is no implied direct command or data transfer between Seats.

## 6. Animation rules

**A1 — One dominant contributor:** only one Seat is visually dominant unless the authoritative product state explicitly represents parallel activity.

**A2 — Contribution has a beginning and an end:** every contribution carrier must have a deterministic start anchor and workspace destination.

**A3 — Workspace accumulates:** successful contributions leave persistent traces/markers while transient energy disappears.

**A4 — State precedes spectacle:** visuals activate only from known presentation state; no animation may invent a task transition.

**A5 — Failure is readable but quiet:** blocked/failed/inactive Seats use deterministic restrained states and do not enter the contribution loop until eligible.

**A6 — Ambient motion yields:** decorative motion reduces while a contribution is active.

**A7 — Reduced motion is authored:** each major motion has an equivalent low-motion state using opacity/position/state changes rather than disabling meaning.

## 7. POV camera system

These cameras are semantic Hero views, not page-by-page recreations.

| ID | Name | Purpose |
|---|---|---|
| C0 | HERO_WIDE | Default landing composition; workspace dominant, all Seats legible |
| C1 | HERO_LOW_ORBIT | Cinematic alternate; low eye line and controlled depth |
| C2 | TEAM_ORBIT | Understand the Web AI Team constellation and Seat roles |
| C3 | SEAT_CLOSE | Inspect one selected Seat and its contribution anchor |
| C4 | WORKSPACE_CLOSE | Inspect shared workspace state and accumulated artifacts |
| C5 | TURN_FOLLOW | Follow active Seat contribution into workspace |
| C6 | OVERHEAD_MAP | Deterministic topology/debug/human-understanding view |
| C7 | DETAIL_ANCHOR | Spatial close-up for one meaningful object or contextual overlay |

## 8. Camera traversal rules

**T1 — Semantic triggers only:** camera motion responds to meaningful product presentation state, not arbitrary DOM movement.

**T2 — Preserve continuity:** prefer authored paths between nearby semantic cameras. Avoid teleporting unless a deliberate cut is part of the composition.

**T3 — One dominant motion vector:** each transition is primarily one of orbit, push-in, pull-out, lateral sweep, rise/fall, or turn-follow.

**T4 — Protect the metaphor:** the workspace and active contribution corridor must not become occluded during important transitions.

**T5 — Finite traversal:** no infinite automatic orbit. Every path has an entry, a stable hold, and an exit condition.

**T6 — Turn-follow is state-reactive:** C5 may begin only after the UI/runtime enters `CONTRIBUTE`; the camera does not cause orchestration.

**T7 — Responsive equivalence:** mobile/tablet uses alternate framing, distance, lens/FOV, and effect density while preserving the same semantic camera identities.

**T8 — Reduced-motion equivalence:** replace long camera travel with shorter authored easing or a direct semantic framing change without removing the state narrative.

## 9. Camera state contract

The runtime-facing contract should be presentation-only:

```ts
type HeroCameraState = {
  cameraId:
    | 'HERO_WIDE'
    | 'HERO_LOW_ORBIT'
    | 'TEAM_ORBIT'
    | 'SEAT_CLOSE'
    | 'WORKSPACE_CLOSE'
    | 'TURN_FOLLOW'
    | 'OVERHEAD_MAP'
    | 'DETAIL_ANCHOR';
  purpose: string;
  targetAnchor: string;
  pathId?: string;
  reducedMotion: boolean;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
};
```

The camera state must not contain authorization decisions, scheduler commands, provider secrets, or execution authority.

## 10. Browser/frontend boundary

The existing frontend contract establishes that backend execution facts cross into the frontend through explicit typed presentation contracts and validation. The Hero should follow the same seam.

The current contract includes task status, approval, connection state, provider, Seat identity, and last event type as presentation-facing execution facts. A Hero adapter may consume validated facts to select visual state, while backend/runtime truth remains authoritative.

The Hero should therefore map **semantic application state → visual state**, not **DOM element → arbitrary animation**.

## 11. What is deliberately not mapped

Do not create separate 3D POVs for:

- every button
- every form field
- every card/div
- decorative frontend elements
- admin-only Command Deck surfaces
- provider-private internals
- arbitrary navigation controls

Map only meaningful semantic surfaces such as the Web AI Team, a selected Seat, the shared workspace, a live contribution, and major presentation-safe state transitions.

## 12. Light-theme lighting recipe

Use a soft studio-light setup:

- broad key light from upper/front side
- weak fill from opposite side
- soft top/rim light for Seat silhouettes
- subtle contact shadow under every major object
- restrained bloom only on contribution carriers and state accents
- neutral background with enough tonal separation for white/ceramic objects

The environment must support the light-theme frontend rather than fighting it. White objects should remain readable through edge contrast and shadow, not dark outlines.

## 13. Initial asset budget

Keep the first implementation small and reusable:

1. Seat base object
2. Shared workspace object
3. Contribution carrier
4. Workspace response motif
5. Role/capability accent module
6. Minimal structural environment

Do not build a large asset catalog before the Hero interaction loop is verified.

## 14. Production validation target

A production smoke test should prove that the Hero can:

1. initialize the scene
2. render the configured Web AI Seats
3. render the shared workspace
4. enter an active Seat state
5. complete a contribution animation
6. absorb the contribution into workspace state
7. hand off to the next eligible Seat
8. resolve all required POV cameras
9. preserve the workspace/contribution corridor without clipping
10. honor reduced-motion presentation
11. preserve hierarchy across responsive framing
12. avoid fatal runtime errors

This validation is a frontend/runtime confidence surface. It does not replace backend, authorization, scheduler, or integration tests.

## 15. Implementation sequence

### Phase A — Visual foundation

Author geometry, materials, lighting, spatial anchors, camera rigs, and animation clips for the light theme.

### Phase B — Runtime adapter

Implement a small presentation adapter that consumes validated Web AI/Seat/workspace state and selects authored scene state.

### Phase C — Semantic camera integration

Bind only meaningful frontend interactions/state transitions to the semantic cameras.

### Phase D — Human smoke test

Exercise the Hero as a human would: load → observe → select Seat → active turn → contribution → workspace response → handoff → camera traversal → reduced motion → responsive framing.

## 16. Non-goals

- recreating the entire frontend in 3D
- turning TeamAi into a literal giant object
- replacing application orchestration with animation logic
- implying direct provider-to-provider communication
- exposing private model state
- creating a second admin/Command Deck representation

## 17. Canonical alignment

This design is subordinate to the repository's Product Law and Product Knowledge. In particular, it preserves the separation between TeamAi authority and the Web AI Team experience, treats Seat cooperation as durable-state/scheduler-driven rather than direct provider control, and keeps frontend spatial presentation downstream of validated backend-owned execution facts.
