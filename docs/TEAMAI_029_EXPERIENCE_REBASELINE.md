# TEAM-EXPERIENCE-029 — Product Experience Rebaseline

**Status:** PLANNING / OWNER-DIRECTED  
**Baseline:** current `main` after #270  
**No implementation is authorized by this document alone.**  
**No 029 release claim.**

## Purpose

This document replaces fragmented Vision cleanup with one coherent product-shape baseline. It exists because the recent Vision/camera/chrome slices produced valid technical changes while the owner-visible experience remained cluttered and structurally unclear, especially on mobile.

The product must now be judged by the experience a person sees and uses, not only by the existence of individual merged slices.

## 1. Current truth after the recent Vision era

### Implemented historical baseline

The following are real implementation strata and must not be erased:

- Vision V0–V3/V3.5 entrance, atmosphere, camera, hierarchy, navigation, and far-environment work.
- #259 residual Layer A/B legibility and chrome work.
- CAM-R1/R2/R3 selected-seat subject-lock.
- ENT-R4 entrance ↔ machine Playwright proof.
- CHR-R3 settings beside machine navigation.
- #260 user-directed validation + superseded archive governance.
- #267/#268 residual closeout and hierarchy-animation continuity repair.
- #270 owner-directed experience rebase checklist and agent data tips.

### User acceptance reality

Despite the implementation progress, the owner-visible experience remains **not acceptable as the final 029 experience shape**.

Observed concerns:

1. The entrance still behaves like a combined classic website + 3D workspace rather than a clear entry experience.
2. Mobile can show overlapping/scattered brand, configuration, chips, 3D, and controls.
3. Camera controls remain dense and confusing even after the `HERO_LOW_ORBIT` identifier was retired.
4. Tree/subject context cannot comfortably zoom back to the normal world baseline height.
5. Cam-4 orbit is inverse rather than the requested proportional/natural direction.
6. Settings exists in implementation paths but is not yet a clean, discoverable navigation destination.
7. UI controls are distributed across floating/blurred surfaces instead of one coherent navigation model.
8. The previous slice model over-optimized for technical completion and under-weighted phone/desktop visual acceptance.

These observations are product acceptance inputs, not evidence that every earlier implementation was invalid.

## 2. Product-shape decision under consideration

### DEC-ENT-CLASSIC

**Proposed:** Layer A becomes a classic website entrance.

It should provide the public story, navigation, links, and sign-in entry. The 3D world becomes an explicit destination reached through a deliberate action/link.

The first paint must not depend on the user understanding the 3D machine before understanding the website.

### DEC-AUTH-GATE-3D

**Proposed:** Full machine/workspace features require a signed-in, server-verified and server-authorized user state.

Presentation state, canvas state, local flags, or UI visibility must never create entitlement or durable authorization.

Anonymous look-only behavior is a separate future product decision and must not be implied by this baseline.

### DEC-CHROME-NAV

**Proposed:** navigation, settings, account access, and major workspace controls live in one coherent menu/navigation surface appropriate to the active experience.

The machine should not require a permanent wall of floating controls.

### DEC-CAMERA-LANGUAGE

**Proposed:** the active camera vocabulary is deliberately small and understandable.

- `HERO_WIDE` remains the normal world baseline.
- selected-seat subject-lock remains the contextual close/focus mechanism.
- `HERO_LOW_ORBIT` is retired.
- `TURN_FOLLOW` is retired.
- no hidden aliases, compatibility shims, or stale labels may recreate retired concepts.
- tree/subject zoom may return to the normal world baseline.
- orbit input is proportional/natural, not inverse.

## 3. Rebaseline principle

The product is no longer allowed to advance by accumulating isolated “green slices” while the user-visible composition remains unresolved.

A slice may be technically complete while the product remains experience-incomplete.

Therefore:

```text
IMPLEMENTED
    ↓
TECHNICALLY VERIFIED
    ↓
BROWSER / RUNTIME VERIFIED
    ↓
DESKTOP + MOBILE EXPERIENCE OBSERVED
    ↓
USER / SOURCE-OF-TRUTH ACCEPTED
```

Only the final two stages establish product acceptance for this rebaseline.

Green CI, Playwright, a passing static test, or a merged PR alone is insufficient to claim experience completion.

## 4. Canonical chronological execution order

Work one coherent outcome at a time. Do not create parallel camera/chrome tweaks that undermine an earlier product-shape decision.

### C0 — Endorse product shape

Record explicit owner endorsement for:

- classic website entrance;
- explicit entry into 3D;
- authenticated/server-authorized full 3D features;
- coherent navigation/menu + settings;
- reduced camera vocabulary;
- proportional orbit;
- world-baseline zoom-out;
- mobile as a first-class acceptance surface.

**Gate:** no implementation of shape-changing work before C0 is recorded.

### C1 — Canonical reconciliation

Synchronize `MASTERPLAN.md`, current-state map, next-slices map, skill wiring, execution state, and this rebaseline so all current surfaces describe the same product shape.

Historical checkpoints remain immutable.

**Gate:** active docs agree; obsolete queues are redirected or archived rather than silently deleted.

### C2 — ENT-CLASSIC-1: classic entrance

Build the first product-visible entrance around:

- clear primary story;
- normal website information architecture;
- sign-in/account entry;
- explicit destination control for the 3D world;
- no requirement for live 3D chrome to explain the landing page.

**Acceptance:** first desktop and phone views read as a website before any 3D interaction begins.

### C3 — ENT-CLASSIC-2: deliberate 3D entry

Create the explicit handoff from the classic entrance into the 3D world.

The transition should be intentional and understandable, not an accidental state flip inside the landing page.

**Acceptance:** browser proof shows a clean entrance → 3D-world transition and a reliable return path.

### C4 — CHROME-NAV-1: one navigation system

Consolidate settings, account, parts/trees, and primary workspace controls into one coherent navigation model.

Remove the need for scattered floating/blurred controls where the same action belongs in navigation.

**Acceptance:** desktop and phone both show where Settings and primary navigation live without hunting.

### C5 — CAM-DOCK-1: camera vocabulary reduction

Audit every visible camera/action control and classify it as:

- retained baseline;
- contextual action;
- duplicate/confusing control;
- retired concept.

The goal is not merely to remove a string. The operator-facing vocabulary itself must become understandable.

**Acceptance:** a first-time user can identify the normal world view and the contextual seat focus without deciphering a camera menu wall.

### C6 — CAM-ZOOM-1: restore world-scale navigation

Fix the tree/subject zoom ceiling/clamp so the user can move from close context back to the normal world baseline height.

Target family: `HERO_WIDE` / approximately the existing 45° world baseline, subject to the current measured spatial contract.

**Acceptance:** browser interaction can zoom out from tree/subject context until the normal world is comfortably restored, without a dead-end clamp.

### C7 — CAM-ORBIT-1: proportional rotation

Replace inverse swipe mapping with natural proportional mapping across the active orbit path.

Update implementation, unit tests, and browser acceptance together.

**Acceptance:** dragging/swiping right rotates the world right from the user's perspective, and vice versa, using a predictable proportional response.

### C8 — AUTH-GATE-1: authenticated full workspace

Gate full machine/workspace actions behind server-verified identity and authorization.

The browser may request actions, but the authoritative server boundary decides whether the user may perform them.

**Acceptance:** unauthenticated presentation does not become entitlement; authenticated authorized state is required for the full feature set.

### C9 — EXPERIENCE-ACCEPT-1: visual acceptance

Run a deliberate desktop + phone acceptance pass covering:

- classic entrance;
- explicit 3D entry;
- navigation/settings;
- camera vocabulary;
- subject lock;
- zoom-out;
- proportional orbit;
- return path;
- auth boundary.

Capture owner-visible evidence for the final state.

**Gate:** user/source-of-truth acceptance required. This is the product gate, not just a CI gate.

### C10 — PROMAX-1: visual refinement after shape lock

Only after C9 is accepted, begin deeper 3D refinement:

- transition choreography;
- ambient/environment layers;
- lighting/material response;
- depth cues;
- subtle motion hierarchy;
- micro-interactions;
- spatial effects;
- polished entry/exit movement;
- reduced-motion parity;
- mobile performance and visual balance.

This phase improves the endorsed product shape rather than attempting to discover the product shape through random polish.

## 5. ProMax visual direction

“ProMax” means stronger visual communication, not simply more effects.

The design target is:

```text
clarity → hierarchy → motion language → spatial depth → atmosphere → polish
```

Every effect must answer a product question:

- What is entering or leaving?
- What currently has attention?
- What can the user interact with?
- What changed state?
- Where should the eye move next?
- Does the effect improve comprehension or merely add noise?

Avoid perpetual particles, constant camera movement, simultaneous competing animations, excessive blur, or effects that hide UI boundaries.

Ambient motion should remain subordinate to interaction and content hierarchy.

## 6. Validation contract for this rebaseline

Every implementation slice under C2–C10 must report:

1. user-visible outcome;
2. current contract/authority owner;
3. files and systems in scope;
4. old assumptions being superseded;
5. validation surfaces affected;
6. validation-change warning when applicable under Issue #260;
7. structural test evidence;
8. browser/runtime evidence;
9. desktop + phone evidence where visual behavior changes;
10. explicit user acceptance state;
11. residual uncertainty.

When a validation changes because the owner changed the desired behavior, follow Issue #260 rather than deleting the old check silently.

## 7. Archive / supersession rules for this rebaseline

The following remain historical and must not be silently revived:

- one-shell entrance as the assumed final product shape;
- `HERO_LOW_ORBIT`;
- `TURN_FOLLOW`;
- scattered permanent camera/control walls;
- inverse orbit behavior;
- any implementation path whose only purpose is to preserve a retired UX contract.

A future revival requires a new explicit user/source-of-truth decision and the Issue #260 validation-change protocol.

Current active docs should use compact redirects to the archive rather than flooding the active tree with repeated warnings.

## 8. Parallel work boundaries

These tracks may continue independently but must not redefine the experience shape accidentally:

- Conn-3 browser/live proof;
- backend residual evidence boundaries;
- future production security questions;
- ToolKit/Echo learning/generalization.

No security inquiry is promoted into current implementation merely because it exists in `docs/security_inquiry.md`.

No backend/provider redesign is part of C2–C10 unless a later product decision explicitly opens that authority boundary.

## 9. Agent recovery tips

- Start from this rebaseline plus the current active-state documents, not from an old Vision checkpoint.
- Never treat a merged technical slice as proof that the overall experience is accepted.
- Use owner phone/desktop evidence for visual claims.
- Do not “solve” clutter by adding another floating control.
- Do not resurrect retired cameras to make old tests green.
- If a test conflicts with a new user-directed requirement, issue the validation-change warning before changing it.
- If content is superseded, archive the knowledge and redirect it rather than deleting institutional memory.
- Keep historical evidence immutable.
- Do not bundle C5–C7 camera work into C2/C3 if doing so would obscure whether the new entrance shape actually works.
- Do not begin ProMax effects before the product shape passes C9.

## 10. Definition of done for the rebaseline

The experience rebaseline is complete only when:

- the classic entrance is clearly a website;
- entry into 3D is explicit;
- the 3D world has a coherent navigation system and Settings location;
- camera vocabulary is reduced and understandable;
- retired camera concepts remain absent;
- tree/subject zoom can return to world baseline;
- orbit is proportional;
- full workspace features respect server authorization;
- desktop and phone acceptance evidence exists;
- the owner accepts the visible result;
- historical/superseded knowledge is preserved and redirected;
- only then is ProMax visual refinement considered the next frontier.

**Current decision status:** owner-directed proposal captured; endorsement remains a separate C0 gate.  
**Release status:** TEAM-EXPERIENCE-029 remains unreleased until all independent release gates are satisfied.

---

## 11. Tree-machine context extension

The existing rebaseline above remains intact as the historical/contextual record. This extension records the newer owner-directed structural truth without creating a second checklist or replacing the C0–C10 execution authority.

The current Seat hierarchy is a **partial working mechanism**, not evidence that the complete Hero tree system is complete. The intended Hero contains multiple semantic tree families and can contain broad, asymmetric, and recursively nested branches.

Every semantic tree and branch must have stable `treeID` / `branchId` identity derived from meaning and parentage. Coordinates, mesh indexes, or camera positions never define semantic identity.

A branch is a real product integration, not a decorative display object. Its meaning includes purpose/responsibility, product/UI payload, configuration/accessibility payload where applicable, expansion volume, adjacency clearance, connection/path ownership, camera relationship, responsive/reduced-motion behavior, and an evidence-backed state.

Geometry follows semantic payload:

```text
root truth
→ tree / branch identity
→ purpose + responsibility
→ UI / feature / configuration / accessibility payload
→ expansion requirements
→ connection topology
→ adaptive geometry
→ camera / travel
→ interaction
→ contribution visualization
```

A tree may contain broad branches and nested branches of greater depth. Different trees may legitimately require different branch counts, heights, widths, radii, spacing, density, and expansion footprints. Existing runtime numbers remain living starting/measured values, not universal geometry.

Expansion space is part of the machine contract. It must account for the division's payload, neighboring divisions, wiring corridors, camera movement, workspace visibility, and responsive readability. The Hero's maximum expanded footprint is derived from the combined active division footprints and their required clearance.

The machine-opening interaction is intentionally stateful and smooth. A division should move through understandable opening/active/closing states rather than appear/disappear instantly or teleport to a new coordinate. Final motion timing remains open until sufficient browser/runtime evidence establishes the visual language.

During the final active turn-loop, participating tree/branch divisions are expected to be active/open so their semantic connection points and wiring corridors are actually available. The electrical contribution signal is intended to travel inward through real connected paths from the active tree/branch toward the central workspace. Decorative disconnected paths must not substitute for the connection topology.

This structural model is preparatory to ProMax. ProMax expresses an already-correct machine; it must not invent tree semantics, compensate for missing branches, or hide absent connectivity.

**Structured truth inventory:** `docs/TEAMAI_3D_HERO_TREE_CENSUS.*`.
**Conceptual vision:** `docs/VISION.md`.
**Execution authority:** `MASTERPLAN.md` + Issue #278.
