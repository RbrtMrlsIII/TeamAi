# TeamAi 3D Hero Verification Ladder

Status: continuity/planning knowledge. Active TEAM-EXPERIENCE-029 implementation remains gated by `MASTERPLAN.md`.

## Governing chain

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → frontend spatial skills → bounded GitHub Issue → implementation → verification → evidence → HandOver / Endorsement → PRODUCT-KNOWLEDGE.md`

## Verification philosophy

A 3D render can demonstrate appearance but cannot prove product authority, backend correctness, authorization, or completion. A passing test can demonstrate a contract but cannot by itself establish visual quality or endorsement. Each spatial slice therefore needs both deterministic contract verification and visual/browser evidence.

## Slice gates

### A — Theme semantic adapter (#84)
- deterministic input/output mapping;
- light/dark semantic distinction;
- bounded material/light values;
- reduced-motion state disables nonessential choreography;
- no second theme root.

### B — Manufactured environment + workspace light (#85)
- environment fill, workspace key, Seat practical/rim, and grazing response remain distinct;
- authored mesh silhouettes remain readable;
- contact/depth separation is visible;
- no decorative bloom becomes the primary form cue.

### C — Contribution + absorption (#86)
- `FOCUS → ACTIVE → CONTRIBUTE → ABSORB → REFLECT → HANDOFF` maps deterministically;
- directional contribution remains Seat → shared workspace;
- absorption settles on the workspace;
- handoff advances visual focus without triggering orchestration;
- reduced motion provides a static semantic equivalent.

### D — Material + spatial depth (#88)
- roughness/reflectance remain within declared bounds;
- shell/inset relationships read at `HERO_WIDE` through `SEAT_CLOSE`;
- grazing and contact response reveal authored geometry;
- no clipping regression.

### E — Responsive + reduced motion (#89)
- narrow and wide layouts preserve the same spatial hierarchy;
- 1–8 Seat density remains deterministic;
- semantic camera intent survives responsive framing;
- reduced motion removes continuous choreography while retaining state.

### F — Seat Identity Inspection (#81)
- semantic inspection reaches identity, responsibility, connection status and current state;
- physical camera coordinates remain hidden behind semantic intents;
- deep inspection hands off to normal UI when precision/text/configuration dominates.

## Browser smoke matrix

Minimum later browser coverage should exercise:

- default/wide Hero;
- narrow/mobile Hero;
- 1, 4 and 8 Seats;
- `HERO_WIDE`, `TEAM_ORBIT`, `SEAT_CLOSE`, `WORKSPACE_CLOSE`, `TURN_FOLLOW`;
- idle plus complete contribution lifecycle;
- reduced motion;
- theme Light and Dark semantic modes;
- authentication handoff remains presentation-only;
- no fatal runtime errors;
- contribution corridor remains visible and unclipped.

## Evidence rule

Capture implementation commit, relevant test output, browser run identifiers, representative screenshots when useful, limitations, and endorsement status. Do not infer approval from render success, green tests, or deployment presence.

## Authority boundary

The Hero remains presentation/interaction only. No scheduler, Firestore, authorization, entitlement, provider-runtime, credential, or direct provider-to-provider authority belongs in the spatial renderer.
