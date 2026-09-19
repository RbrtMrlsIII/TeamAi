# TEAM-EXPERIENCE-029 — Web AI Hero Spatial Environment Baseline

**Baseline date:** 2026-09-07  
**Source:** `main` at `9d8bd6a8abd2f48a4b89b72a0347d6194ba92897`  
**Field:** Frontend / Spatial  
**Issue:** #79  
**Status:** BASELINE CAPTURED / M2.1 IMPLEMENTATION HELD BY MASTERPLAN GATE

## Authority and execution boundary

This checkpoint is continuity evidence for the actual spatial environment. It is not a new product authority.

Canonical execution remains:

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → frontend/spatial skills → implementation → verification → evidence → HandOver / Endorsement`

`MASTERPLAN.md` currently places `TEAM-BACKEND-001` before `TEAM-EXPERIENCE-029` in the chronological gate. Therefore this document records the current 029 spatial baseline without treating M2.1 implementation as unblocked.

## Current spatial product identity

The Hero represents the **Living Web AI Shared Workspace** as a presentation/interaction surface for a Web AI experience.

- Center: shared Web AI workspace.
- Periphery: distinct Web AI Seats that represent configurable participants.
- The spatial scene is not TeamAi itself and is not a backend authority system.
- Seats contribute through the shared workspace/event/state model; the Hero does not depict direct provider-to-provider orchestration.
- Visual “energy” is presentation language only; it is not a backend state primitive.

## Current scene topology

Current rendered hierarchy is conceptually:

`Hero orientation → shared workspace surface → active/focused Web AI Seat → semantic mechanism layers → task/evidence → normal UI`

The WebGL renderer currently combines authored meshes with lightweight procedural primitives.

### Shared workspace

Current workspace construction includes:

- authored `workspaceRing` mesh as the visible signature ring;
- procedural cylindrical structural layers beneath/around the surface;
- glass-like and dark recessed surface layers;
- trace/artifact-oriented spatial details used by the existing Hero renderer.

### Web AI Seats

Seat construction includes:

- authored `seatShell` mesh for the primary visible Seat shell;
- procedural supporting/internal elements for the remaining Seat mechanism;
- dynamic positioning around the workspace;
- deterministic palette variation for Seat distinction.

## Mesh baseline

The authored mesh pass now supplies two production-oriented static mesh definitions:

- `HERO_AUTHORED_MESHES.workspaceRing`
- `HERO_AUTHORED_MESHES.seatShell`

These are consumed by `public/hero-flex.js`. The scene is therefore in a mixed authored/procedural state rather than a fully authored asset scene.

The renderer also contains procedural `cube`, `cyl`, `torus`, and `sphere` helpers that remain part of the current environment for non-signature structure.

## Seat scaling baseline

The renderer exposes dynamic Seat-count behavior with a bounded range of **1–8 Seats**.

Seat count affects workspace radius, Seat radius/scale, camera distance, ambient profile, and artifact density through a deterministic profile function.

The environment therefore preserves one scene topology while adapting spatial density rather than creating separate scene variants.

## Camera baseline

The current physical camera catalog includes:

`HERO_WIDE`  
`HERO_LOW_ORBIT`  
`TEAM_ORBIT`  
`SEAT_CLOSE`  
`WORKSPACE_CLOSE`  
`TURN_FOLLOW`  
`OVERHEAD_MAP`  
`DETAIL_ANCHOR`

Semantic camera intents are resolved through `public/hero-semantic-camera.js`. Current semantic mechanisms include:

`MECHANISM_CONNECTION`  
`MECHANISM_BEHAVIOR`  
`MECHANISM_SKILLS`  
`MECHANISM_ZIPSKILLS`  
`MECHANISM_CAPABILITY`  
`MECHANISM_AUTHORIZATION`  
`MECHANISM_AUTHENTICATION`  
`MECHANISM_WORKSPACE`  
`MECHANISM_TASK`  
`APP_UI_HANDOFF`

Physical camera mappings remain implementation details of semantic intent.

## Inspection-spine baseline

The current deterministic semantic inspection sequence is:

`HERO_ORIENTATION → SURFACE → FOCUS → CONNECTION → BEHAVIOR → SKILLS → ZIPSKILLS → CAPABILITY → AUTHORIZATION → WORKSPACE → TASK → EVIDENCE → NORMAL_UI`

The inspection spine publishes presentation-only state and may resolve a semantic camera intent. It does not authorize or mutate backend state.

## Turn / contribution baseline

The existing Hero renderer retains the Web AI turn lifecycle and contribution-oriented presentation model. The intended state progression remains:

`IDLE → FOCUS → ACTIVE → CONTRIBUTE → ABSORB → REFLECT → HANDOFF → FOCUS(next eligible seat)`

Only presentation state is controlled by this layer. A visual contribution must not be treated as an actual provider-runtime invocation.

## Authentication baseline

The Hero authentication handoff exists as a presentation bridge into ordinary authentication controls.

The current Hero code deliberately does not claim that Firebase Authentication is connected in this frontend slice. Authentication authority remains external to the spatial presentation layer.

## Reduced motion baseline

The inspection spine tracks `prefers-reduced-motion`. Reduced motion suppresses camera/ambient motion while retaining the same semantic inspection sequence.

The Hero renderer also supports an explicit reduced-motion presentation mode for camera transitions/continuous effects.

## Responsive baseline

The current scene uses the same scalable world model while deriving viewport dimensions from the rendered canvas and seat profile. Camera selection is profile-aware so increased Seat counts produce wider spatial framing.

Mobile/responsive behavior remains a presentation concern; it must preserve the shared-workspace / Seat hierarchy rather than creating a different product model.

## Normal-UI handoff baseline

The semantic inspection model ends at `APP_UI_HANDOFF`. Form-heavy, text-heavy, configuration-intensive, permission-review, evidence-review, and precision interactions belong to ordinary application UI rather than increasingly elaborate spatial machinery.

## Authority boundary

This spatial environment must not become a second application authority system.

The Hero must not:

- authorize an action;
- mutate canonical backend state;
- own scheduler authority;
- perform direct provider-to-provider orchestration;
- expose provider-private model state;
- treat camera state as permission state;
- invent provider connection or entitlement state;
- handle credentials or tokens as spatial state.

The frontend field owns visual composition, presentation state, interaction choreography, and browser-facing verification. Backend, governance, and verification fields retain their own authority boundaries.

## Root / field baseline

Frontend spatial work follows the repository's branch/field discipline and existing canonical UI roots. This checkpoint intentionally does not introduce a new theme root, application root, or competing source-of-truth tree.

The frozen field vocabulary and unified theme/root requirements remain governed by the existing Spatial UI/UX skill and associated 029 contracts.

## Current known limitations

1. The mesh environment is still mixed authored/procedural; a complete authored asset replacement has not been claimed.
2. The Hero is not the authoritative runtime for Web AI provider execution.
3. Firebase Auth frontend integration is not claimed by this spatial baseline.
4. Live backend/Web AI presentation-state binding remains a later, contract-dependent phase.
5. Production runtime/performance qualification remains a later gate; successful render/browser behavior alone does not establish production approval.

## Evidence references

- `MASTERPLAN.md` — chronological gate and hard completion rule.
- `docs/SKILL_WIRING.md` — ORUCAVEAM + field/domain/tool routing.
- `docs/TEAMAI_3D_HERO_NEXT.md` — authored-mesh-to-validated-state progression.
- `public/hero-flex.js` — current spatial renderer and 1–8 Seat scaling.
- `public/hero-semantic-camera.js` — semantic camera registry and presentation-only intents.
- `public/hero-inspection-spine.js` — deterministic inspection stages.
- Issue #79 — baseline and M2.1 bounded implementation contract.

## M2.1 disposition

**Seat Identity Inspection is specified but not implemented in this checkpoint.** The implementation remains held behind the active Masterplan chronological gate. When the gate is released, the next bounded change should add presentation-safe Seat identity/responsibility/current-state/connection-status inspection using the existing semantic inspection and normal-UI handoff boundaries.
