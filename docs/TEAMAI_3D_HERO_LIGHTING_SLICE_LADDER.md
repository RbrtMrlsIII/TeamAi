# TeamAi 3D Hero — Light-Skeuomorphic Slice Ladder

**Status:** PREPARATION / IMPLEMENTATION HELD BY MASTERPLAN

## Authority and continuity

This document is a continuity record for the Living Web AI Shared Workspace Hero. It does not create product authority and does not release TEAM-EXPERIENCE-029.

Execution remains:

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → applicable spatial skills → GitHub Issue → implementation → verification → evidence → HandOver / Endorsement → PRODUCT-KNOWLEDGE.md`

The current chronological gate remains:

`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Spatial premise

The Hero represents a **Living Web AI Shared Workspace**. The shared workspace is central; distinct Web AI Seats surround it. TeamAi is the enabling product system, not a giant central AI brain. Lighting is visual language only.

The spatial scene remains presentation-only. The canonical orchestration meaning is still:

`AI result/action → durable structured event → task/state transition → scheduler eligibility → next AI/tool/human → new event`

No light effect may imply direct provider-to-provider control.

## Slice order

### Slice 1 — Issue #84: semantic 3D theme-lighting adapter

Translate the canonical unified theme root into a deterministic presentation-safe spatial parameter set.

Inputs:

- theme mode/source
- atmosphere
- surface/elevation
- focus
- signal
- status
- motion/reduced motion

Outputs:

- environmental fill
- workspace key relationship
- Seat practical/rim family
- grazing strength
- contribution-light base
- roughness/reflectance family
- shadow separation
- emissive bounds
- reduced-motion choreography flag

Rules:

- `frontend/spatial/theme-root.css` remains the only theme authority.
- No second Hero theme root or duplicated theme state.
- Mapping is deterministic and side-effect free.
- Light-skeuomorphism is the active implementation direction.
- Dark-glassmorphism is a future paired mode, not part of this active visual pass.

### Slice 2 — Issue #85: manufactured environment and workspace light rig

Consume Slice 1 to establish the spatial instrument's base illumination.

Light families:

1. Environmental fill for room/atmosphere.
2. Workspace key relationship for the central shared surface.
3. Restrained Seat practical/rim lighting.
4. Grazing/rim response for authored shells and machined surfaces.
5. Shadow separation for physical depth.

The goal is to reveal authored form, not simulate a flat interface with CSS-like glow.

### Slice 3 — Issue #86: contribution corridor and workspace absorption

Consume Slices 1–2 and map the existing lifecycle into restrained semantic light choreography:

`FOCUS → ACTIVE → CONTRIBUTE → ABSORB → REFLECT → HANDOFF`

`CONTRIBUTE` must visually travel from the active Web AI Seat toward the shared Workspace.

`ABSORB` must make the workspace visibly receive and settle the contribution.

`REFLECT` is a brief acknowledgement/ripple, not a second orchestration channel.

`HANDOFF` decays the outgoing Seat and focuses the next eligible Seat.

Reduced motion replaces traveling/pulsing choreography with static semantic state changes.

## Existing spatial systems that must remain intact

- authored `workspaceRing` and `seatShell`
- 1–8 Seat scaling
- semantic camera registry
- inspection spine
- contribution corridor
- turn lifecycle
- authentication handoff boundary
- responsive framing
- reduced-motion behavior
- `APP_UI_HANDOFF` to normal application UI

## Verification ladder

Each slice must remain independently testable.

1. Static contract assertions.
2. WebGL initialization without fatal runtime errors.
3. Browser smoke at representative Seat counts.
4. Reduced-motion smoke.
5. Theme mode comparison.
6. Camera/inspection regression check.
7. Contribution-corridor visibility check.
8. Authority-boundary scan.
9. Evidence captured before considering the slice complete.

## Blocking gate

No active 029 implementation should be merged until `MASTERPLAN.md` releases TEAM-EXPERIENCE-029 after TEAM-BACKEND-001 completion/endorsement and required evidence.

This ladder therefore acts as preparation and continuity knowledge rather than an implementation bypass.
