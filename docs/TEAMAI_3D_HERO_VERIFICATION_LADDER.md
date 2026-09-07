# TeamAi 3D Hero Verification Ladder

Status: continuity/planning knowledge. Active TEAM-EXPERIENCE-029 implementation remains gated by `MASTERPLAN.md`.

## Governing chain

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → frontend spatial skills → bounded GitHub Issue → implementation → verification → evidence → HandOver / Endorsement → PRODUCT-KNOWLEDGE.md`

## Verification philosophy

A render demonstrates appearance, not product authority or backend correctness. A passing contract test demonstrates bounded behavior, not spatial quality or endorsement. Each spatial slice therefore requires deterministic contract verification plus browser/visual evidence when implementation is eventually authorized.

## Slice gates

### A — Theme semantic adapter (#84)
- deterministic semantic input/output mapping;
- Light and Dark interpretations remain distinct;
- light/material outputs stay within declared bounds;
- reduced motion disables nonessential choreography;
- canonical `theme-root.css` remains sole theme authority.

### B — Manufactured environment + workspace light (#85)
- environment, workspace key, Seat practical/rim, and grazing families remain distinct;
- authored mesh silhouettes remain readable;
- depth/contact separation supports spatial hierarchy;
- no decorative bloom becomes the primary form cue.

### C — Contribution + absorption (#86)
- `FOCUS → ACTIVE → CONTRIBUTE → ABSORB → REFLECT → HANDOFF` maps deterministically;
- contribution remains Seat → shared workspace;
- absorption settles on the workspace;
- handoff changes visual emphasis without triggering orchestration;
- reduced motion provides a static semantic equivalent.

### D — Material + spatial depth (#88)
- roughness/reflectance remain bounded;
- shell/inset relationships read across semantic cameras;
- grazing/contact response reveals authored geometry;
- clipping and occlusion remain absent.

### E — Responsive + reduced motion (#89)
- wide/narrow framing preserves the same spatial hierarchy;
- 1, 4, and 8 Seat layouts remain deterministic;
- semantic camera intent survives responsive framing;
- reduced motion removes continuous choreography while retaining state.

### F — Seat Identity Inspection (#81)
- inspection reaches identity, responsibility, connection status, and current state;
- physical coordinates stay behind semantic camera intents;
- precision/configuration/text-heavy tasks hand off to normal UI.

### G — Seat mechanisms (#91)
- responsibility, skills, capability, and state mechanisms expose stable semantic identifiers;
- mechanism appearance reflects provided state and never invents authority;
- deeper inspection remains reversible and responsive.

### H — Authorization and scope (#92)
- available/configured/authorized/scoped/healthy and blocked/degraded/unauthorized states remain reason-bearing;
- status is not color-only;
- no renderer action can mutate authorization or entitlement.

### I — Workspace task/evidence anchors (#93)
- task/result/provenance/verification anchors map to supplied semantic state;
- workspace remains the shared Web AI workspace, not the system of record;
- evidence/traces remain readable and do not occlude the contribution corridor.

## Browser smoke matrix

Minimum later browser coverage:

- default/wide Hero;
- narrow/mobile Hero;
- 1, 4, and 8 Seats;
- `HERO_WIDE`, `TEAM_ORBIT`, `SEAT_CLOSE`, `WORKSPACE_CLOSE`, and `TURN_FOLLOW`;
- idle and complete turn lifecycle;
- reduced motion;
- Light and Dark theme semantics;
- authentication handoff remains presentation-only;
- no fatal runtime errors;
- contribution corridor remains visible and unclipped.

## Evidence rule

Record implementation commit, applicable test output, browser run references, representative visual evidence when useful, limitations, and endorsement state. Do not infer approval from green tests, renders, or deployment presence.

## Authority boundary

The Hero remains presentation/interaction only. Scheduler, Firestore, authorization, entitlement, provider runtime, credentials, and provider-to-provider orchestration remain outside the spatial renderer.
