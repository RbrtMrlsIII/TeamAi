# TeamAi 3D Hero — Hierarchy Runtime Baseline

**Status:** Living number home (presentation only · **no 029-released claim**)
**Authority:** Product Law · Machine Interaction · Camera Follow · Vision V0.5

Numbers in this §9 table are the product home for hierarchy layout and nav clamps. Amend **table + code together**.

## Related

- `public/hero-hierarchy-runtime.js` — exports matching these names
- `docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md`
- `docs/VISION.md` (V0.5 zoom ceiling)

## §9 — Named constants

| Name | Value | Status | Notes |
|------|-------|--------|-------|
| `SEAT_REST_Y` | `0.62` | measured | R2 |
| `SEAT_OPEN_LIFT` | `0.28` | measured | R2 |
| `CHILD_STEP_Y` | `0.22` | measured | R2 |
| `CHILD_STEP_R` | `-0.14` | measured | R2 |
| `OPEN_DURATION_MS` | `520` | starting | R3 |
| `CLOSE_DURATION_MS` | `420` | starting | R3 |
| `CONNECTION_BRANCH_MS` | `380` | starting | P1 |
| `BEHAVIOR_BRANCH_MS` | `360` | starting | P2 |
| `TOOLKIT_BRANCH_MS` | `340` | starting | P3 |
| `CAPABILITIES_BRANCH_MS` | `320` | starting | P4 |
| `AUTHORIZATION_BRANCH_MS` | `300` | starting | P5 |
| `WORKSPACE_SCOPE_BRANCH_MS` | `280` | starting | P6 |
| `TASK_EVIDENCE_BRANCH_MS` | `260` | starting | P7 |
| `SETUP_RING_FILL_MS` | `480` | starting | P-R2 |
| `SETUP_RING_FOV_FILL` | `3` | starting | P-R2 |
| `HIERARCHY_REDUCED_SNAP` | `true` | product | R5 |
| `CAMERA_LERP_MS` | `700` | starting | R3 |
| `FOV_BOOST_NARROW` | `4` | starting | R7 |
| `RING_R0_ZIP_SCALE` | `0.22` | starting | R0 ZipSkills crown |
| `RING_R1_SCALE` | `1.18` | starting | R1 |
| `RING_R2_SCALE` | `1.42` | starting | R2 |
| `NAV_ZOOM_MIN` | `0.72` | starting | R4 nav |
| `NAV_ZOOM_MAX` | `2.0` | V0.5 Vision ~200% | R4 nav |
| `NAV_ZOOM_REDUCED_MIN` | `0.9` | starting | R4/R5 |
| `NAV_ZOOM_REDUCED_MAX` | `1.2` | starting | R4/R5 |
| `SEAT_R_MAX` | `6.45` | measured | R2 |

R0 ZipSkills inner crown and R1/R2 radius multipliers are **named** (`RING_R0_ZIP_SCALE`, `RING_R1_SCALE`, `RING_R2_SCALE`) in this table and in `hero-hierarchy-runtime.js`. Status **starting** until measured in-browser; amend §9 + code together. Do not invent private radius tables outside this doc.

## V0.5

`NAV_ZOOM_MAX` raised from `1.55` to `2.0` so free zoom can approach ~200% of default while subject lock (Cam-6) still holds look-at.
