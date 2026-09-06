# TeamAi — 3D Hero Prototype Implementation

**Status:** IMPLEMENTATION BASELINE
**Theme:** Skeuomorphic light
**Runtime:** Dependency-free WebGL prototype

## What exists

The prototype is a static-hostable WebGL scene composed from reusable procedural primitives. It demonstrates the intended visual and interaction grammar before introducing external 3D asset dependencies.

### Spatial objects

- four Web AI Seats arranged around the shared workspace
- layered shared workspace surface
- structural contribution corridors
- transient contribution carriers
- persistent workspace trace markers
- minimal manufactured floor/environment geometry

### Semantic cameras

`HERO_WIDE`, `HERO_LOW_ORBIT`, `TEAM_ORBIT`, `SEAT_CLOSE`, `WORKSPACE_CLOSE`, `TURN_FOLLOW`, `OVERHEAD_MAP`, `DETAIL_ANCHOR`

### Turn lifecycle

`IDLE → FOCUS → ACTIVE → CONTRIBUTE → ABSORB → REFLECT → HANDOFF → FOCUS`

The runtime uses the lifecycle for presentation only. It does not own scheduler, authorization, task, provider, or execution truth.

## Frontend delivery

`firebase.json` uses `dist` as the Firebase Hosting public directory. The build now copies `public/` into `dist/`, allowing the Hero to ship as a static surface without changing backend execution architecture.

## Prototype controls

- POV buttons select semantic cameras.
- Start turn loop demonstrates the authored participation cycle.
- Reduced-motion control suppresses motion presentation while preserving the scene/state.
- Pointer selection cycles the active Web AI Seat and enters its close view.

## Deliberate limitations

This slice uses procedural primitives rather than production-grade authored meshes, textures, physically based materials, shadows, or HDR lighting. Those are later visual-quality passes after the scene grammar and interaction loop are accepted.

No frontend DOM element is mapped one-to-one into the 3D scene.
