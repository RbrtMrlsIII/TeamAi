# Hierarchy Runtime Skill

**Status:** SPATIAL COMPANION / LIVING NUMBERS + SHARED OPEN-MACHINE GRAMMAR  
**Coordinator:** `skills/frontend/spatial/UI_UX-Promax-Skill.md`  
**Number home:** `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9 (docs hold numbers; this skill consumes them)

## WHEN TO USE
Use on **every** slice that opens/closes a hierarchical parent, adds in-machine child/leaf faces, docks camera for inspection, or changes hierarchy motion / pose math / input ownership.

Triggers: hierarchy, open shell, gears, parts, altitudes, pose math, camera dock, reduced-motion open, Seat shell, Subscription/Discussion/Coding/Settings gears, R1–R10, living numbers.

This is **not** a 3D Hero lighting/theme skill and **not** a second theme root. Lighting still routes through `frontend/spatial/hero-theme-lighting-adapter.js` + `heroMaterialContext()`.

## INPUT
- User-authorized hierarchy slice (parent / child / leaf part IDs).
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` (R1–R10 + **§9 living numbers table**).
- Parent sheet (Seat Shell v1, later Subscription / Discussion / Coding / Settings).
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`.
- Current `public/hero-flex.js` anchors (`profile`, `seatPos`, `cameras`, `durations`, `responsiveFovBoost`, `heroMaterialContext`).
- Companion skills: motion, transition, animation, responsive, accessibility, UI_UX-Promax.
- Theme attributes on `document.documentElement` only.

## AUTHORITY
- `PRODUCT_LAW.md` Family J — presentation only. Open/camera/gear never grants entitlement, auth, or scheduler eligibility.
- `MASTERPLAN.md` TEAM-EXPERIENCE-029 — presentation continuity; does not claim 029 released.
- Baseline doc **owns named numbers**. This skill owns the **execution procedure** that consumes and amends those numbers.
- Unified theme root owns visual mode. This skill must not invent `--hero-*` Product Law tokens.
- Skills cannot grant permission.

## ACTION

### 1. Load numbers from documentation (do not invent a private table)
Read `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9. Use the **named** constants (or identical literals with the name in a comment). Do not scatter unexplained magic numbers for altitudes, durations, FOV boosts, or ring radii.

### 2. Account for R1–R10 (or explicit defer)
Every hierarchy PR body includes a short table: root → how satisfied / deferred with reason. Omitting a root without a reason **fails validation**. Tuning a number after a visual check does **not** fail if the doc table is updated in the same PR.

### 3. State model first (R1)
Use one language:

```text
HierarchyRuntimeState
  openParentId: null | PartId
  focusedChildId: null | PartId
  focusedLeafId: null | PartId
  phase: rest | opening | open | closing
  selectedSeatIndex: number
  motionMode: full | reduced     // from data-motion
  cameraId: string
  inputMode: NAVIGATE | INSPECT | DEMO
```

v1: **one fully open parent at a time**.

### 4. Pose math (R2) — named formulas
```text
density            = (clamp(seatCount,1,8)-1)/7
workspaceRadius    = lerp(WORKSPACE_R_MIN, WORKSPACE_R_MAX, density)
seatRadius         = lerp(SEAT_R_MIN, SEAT_R_MAX, density)
seatScale          = lerp(SEAT_SCALE_MAX, SEAT_SCALE_MIN, density)
cameraDist         = lerp(CAM_DIST_MIN, CAM_DIST_MAX, density)
seatRestY          = SEAT_REST_Y
seatOpenY          = SEAT_REST_Y + SEAT_OPEN_LIFT
childStackY(i)     = seatOpenY + i * CHILD_STEP_Y
childStackRadial(i)= radialIn + i * CHILD_STEP_R
openAmount(t)      ∈ [0,1]
```

Starting numeric values live **only** in baseline §9. When a visual session teaches a better number, change §9 and the implementation together. Record `old → new` in the PR.

### 5. Camera (R3)
Selecting a parent **docks** (`SEAT_CLOSE` or successor). Close/back returns to `HERO_WIDE` / `TEAM_ORBIT`. Camera IDs are presentation identifiers. Camera lerp uses `CAMERA_LERP_MS` with `ease` (smoothstep) unless reduced motion **snaps**.

### 6. Input (R4)
Distinct intents: select parent · select child/leaf · close. Keyboard path required when hierarchy is active (minimal is enough for v1). Do not let demo orbit steal INSPECT clicks.

### 7. Motion (R5)
Phases: `rest → opening → open → closing → rest`.  
Reduced motion: snap or very short opacity/scale. Hierarchy must remain understandable with `data-motion="reduced"`. Durations scale by `REDUCED_MOTION_K` for non-hierarchy travel; hierarchy open **prefers snap**.

Consume Motion skill tokens conceptually; Hero public/ isolation may keep local named constants that **match** §9.

### 8. Display / viewport / prefs / wiring / theme (R6, R7, R8, R9, R10)
- Open silhouette readable at wide-adjacent and docked PoV.
- Stubs vs interactive layers distinct **without** implying permission.
- Narrow viewport: `responsiveFovBoost` values from §9; open assembly must not clip into illegibility.
- Read `data-motion` / `data-theme-mode` / `data-density` from `document.documentElement` only.
- Trajectories are presentation. Connection faces do not assert live provider success without a read-model.
- Materials use `heroMaterialContext()` / MODE_PROFILE bases from §9. No page-local palette.

### 9. Isolation
Prefer extending `public/hero-flex.js` helpers over a parallel animation framework. No cross-root import unless Option 3 is separately authorized.

### 10. Amend numbers (living, not frozen)
1. Prefer small constant updates with PR note.  
2. Same PR updates baseline §9.  
3. If a **root** is added/removed, update the baseline document before the next parent slice.  
4. Do **not** freeze art-direction numbers in this skill.

## DO NOT
- Do not invent a second theme root, `--hero-*` Product Law tokens, or a Hero lighting skill.
- Do not treat open/camera/gear motion as entitlement, authorization, or scheduler eligibility.
- Do not expand DOM seat-stack as the permanent hierarchy home.
- Do not require continuous choreography to understand hierarchy under reduced motion.
- Do not leave product leaves only as external chrome without a path to in-machine placement (new debt needs a debt note).
- Do not change §9 numbers in code without updating the doc (amendment silence fails validation).
- Do not claim TEAM-EXPERIENCE-029 released.
- Do not copy numbers into a third unofficial table (chat, random markdown) as authority.

## PASS
- Slice names part IDs and accounts for R1–R10 (or explicit defer).
- Implementation constants match baseline §9 names/values (or documented `old → new` in the same PR).
- Theme still reads `document.documentElement` only.
- Reduced-motion hierarchy remains readable.
- Static tests for part IDs / phase / one-open / named numbers are green when those land.
- Presentation-only boundary held.

## EVIDENCE
PR table (R1–R10), §9 number diff if any, static tests, optional browser frames of open silhouette, limitations, next parent sheet.

## SEE ALSO
- `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md`
- `docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md`
- `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md`
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/frontend/spatial/motion/SKILL.md`
- `skills/frontend/spatial/responsive/SKILL.md`
- `skills/frontend/spatial/accessibility/SKILL.md`
- `docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md`
- `docs/SKILL_WIRING.md`
- `skills/execution/orucaveam/SKILL.md`
