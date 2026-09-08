# TeamAi 3D Hero — Machine Interaction Contract

**Status:** Continuity / design contract (presentation)  
**Date:** 2026-09-08  
**Authority order:** PRODUCT_LAW.md (Family J) → MASTERPLAN.md → this contract → Spatial Depth Model → implementation  
**Related:** `docs/TEAMAI_3D_HERO_SPATIAL_DEPTH_MODEL.md`, `docs/TEAMAI_3D_HERO_SEAT_CONFIGURATION_MAP.md`, `docs/TEAMAI_3D_HERO_SEAT_STACK.md`, `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md`, `docs/TEAMAI_3D_HERO_SEAT_SHELL_HIERARCHY_V1.md`

## 1. Purpose

This document locks the **intended** Hero interaction model that was under-documented across sessions: the Hero is a **mechanical machine** whose outer structure, seats, workspace, and configuration surfaces are expressed as **nested gears and parts**, not as a flat 3D logo with a side-panel UI.

It exists so future sessions do not regress to “pretty canvas + DOM chrome outside the machine.”

## 2. Product Law boundary (non-negotiable)

- Spatial UI is the **human-facing map** of the workforce (Family J). It is **not** a second authority layer.
- Visible gears, open shells, glowing locks, or animated collars **never** grant entitlement, authorization, scheduler eligibility, or durable completion.
- Durable truth remains backend-owned (Families C, E, G, H, and K as applicable).
- Theme law still applies: Light Spatial Skeuomorphism / Dark Spatial Glassmorphism — mechanism materials follow that single theme root.
- Reduced-motion, keyboard, and accessible names remain mandatory; cinematic depth cannot be the only path to meaning.

## 3. Stage layout

```text
                    ENVIRONMENT (far)
         terms · privacy · about · contact · legal tabs
         (camera angles into the room around the machine)
                              │
                              ▼
                 ┌─────────────────────────────┐
                 │     HERO MACHINE (near)     │
                 │  outer seat ring  ·  center │
                 │  nested gears / parts tree  │
                 └─────────────────────────────┘
```

### 3.1 Outside the machine (environment only)

The **only** things that live outside the mechanical Hero are **environmental tabs**: content that is not “inside the product machine.”

Examples:

- Terms of service  
- Privacy policy  
- Contact us  
- About us  
- Other legal / institutional pages  

These are reached by **camera angles into the environment** around the machine (far framing), not by panels glued over the Hero.

### 3.2 Inside the machine (everything product)

**No product UI lives outside the machine.** Configuration, settings, subscription, discussion, coding entry, turn management, seat guts — all are **gears and parts** in a parent → child hierarchy.

When a parent holder is clicked (or focused):

1. Camera docks / zooms toward that holder.  
2. The holder **opens mechanically** (shell, collar, gear train, layers).  
3. Child parts are revealed.  
4. A child may itself be a parent (deeper open).  
5. Depth continues until **leaf parts**: buttons, fields, small forms, toggles, lists — still **spatially inside** the opened mechanism, not floating as an external browser chrome panel.

```text
Parent gear (parent)
  → opens
    → child gear / module (may be parent)
      → opens
        → smaller parts
          → leaf: button · field · toggle · short form · status face
```

## 4. Machine anatomy

### 4.1 Outer ring — Seats

- The **outside ring** represents **Web AI Seats** (participants).  
- From a normal / wide view, selecting a Seat:
  - zooms/docks the camera to that Seat;
  - triggers **mechanical open** of that Seat’s shell;
  - reveals that Seat’s configuration tree (connection, behavior, toolkit, ZipSkills, capabilities, authorization, workspace scope, task/evidence — as nested parts).  
- Seat count / “unlock more slots” is **presented** by subscription machinery (see §5); durable unlock remains domain/entitlement authority.

### 4.2 Center — Workspace

- The **middle** of the machine is the **user’s chosen and configured workspace** surface.  
- Shared contribution, absorb / reflect / handoff, and persistent traces live here as spatial parts.  
- Center is not “empty decorative geometry”; it is the shared work surface the Seats address.

### 4.3 Whole-machine gears (product domains)

These live **inside** the Hero machine as first-class mechanisms (exact mesh placement is an implementation choice; the interaction law is fixed):

| Mechanism | Role (presentation) |
|-----------|---------------------|
| **Subscription gears** | Unlock / present more team Seat slots; plan tier faces; never self-attest paid entitlement |
| **Discussion gear** | Entry into planning / discussion-first flow |
| **Coding gear** | Entry into start-coding flow |
| **General settings gear** | Turn management and other general controls as nested parts |
| **Seat shells** (ring) | Per-Seat configuration trees (see Seat Configuration Map) |
| **Workspace core** (center) | Chosen workspace surface + artifacts / traces |

Same **open-parent → reveal-children** grammar for all of the above; **different internal part sets**.

## 5. Nested depth law

| Depth | What the user sees | Answers |
|-------|--------------------|---------|
| Machine wide | Full Hero, seat ring, center workspace, environment beyond | Where am I? |
| Parent open | Selected shell/gear opens; children visible | Which product domain? |
| Child open | Sub-module layers | Which responsibility / setting family? |
| Leaf | Buttons, fields, toggles, short forms, status faces **still inside** the open assembly | What exact control? |

There is **no parallel “UI outside the Hero”** for product configuration. Legacy side stacks / floating panels are **interim presentation debt** to be absorbed into the machine tree over time.

### Relationship to Spatial Depth Model

This contract **extends** `TEAMAI_3D_HERO_SPATIAL_DEPTH_MODEL.md`:

- Depth 0–2 (orientation → parts → mechanism) remain.  
- Depth 3+ continues **inside the mechanism** as nested gears down to leaf controls.  
- Older wording that pushed all forms to an **external** normal UI is **superseded for product configuration**: leaf controls are still “ordinary UI” **semantically** (accessible, keyboardable) but **spatially** remain inside the opened parent.  
- Environment/legal content (§3.1) remains the only intentional “outside.”

Hierarchy open/close, camera dock, layout math, and motion phases for any parent are governed by the living **Hierarchy Runtime Baseline** (`docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md`) — required to account for, not frozen numerics.

## 6. Click / focus contract

```text
select parent part
  → semantic camera dock
  → mechanical open (clear start/end pose)
  → reveal children
  → (optional) select child → recurse
  → leaf interaction (presentation intent)
  → durable commit still follows backend/read-model / normal authority paths
```

Rules:

- Camera state is **never** authorization.  
- Mechanical open is **never** entitlement.  
- Leaf submit/save actions that affect durable state must still go through owning backend contracts; the gear only **presents** the control.  
- Reduced motion: snap or short opacity/scale; preserve hierarchy semantics without long gear travel.

## 7. What is intentionally not claimed implemented

As of 2026-09-08 on `main`, the live Hero provides:

- Seat ring + center workspace grammar (simplified meshes)  
- Semantic cameras and turn-loop presentation  
- Material/depth/lighting slices (#88 / #89)  
- DOM seat-stack and control chrome **outside** the machine (debt relative to this contract)

**Not yet implemented** under this contract:

- Full nested gear-tree open for Seats and domain gears  
- Subscription / discussion / coding / settings as in-machine parents  
- Leaf forms/buttons as spatial children of those parents  
- Environment camera tabs for legal/about/contact  
- Absorption of external DOM chrome into the machine tree  

## 8. Implementation ladder (suggested)

1. **Document** (this file) — continuity lock.  
2. **Hierarchy Runtime Baseline** — shared roots R1–R10 (living).  
3. **Part hierarchy model** (data): parent/child IDs → Product Law concepts (Seat Shell v1 sheet).  
4. **One parent open prototype** (e.g. single Seat shell → children → one leaf control).  
5. **Domain gears** (settings, discussion/coding, subscription) with same open grammar.  
6. **Environment cameras** for outside tabs.  
7. **Retire external product chrome** as in-machine coverage grows.  
8. Bind presentation faces to backend **read-models** without granting browser authority.

Each slice remains presentation-only until its own verification evidence is recorded.

## 9. Anti-patterns

- Product settings as fixed overlays outside the Hero while the machine is idle decoration.  
- Treating the seat-stack DOM as the permanent configuration home.  
- Implying unlock/authorize/connect solely because a gear spun.  
- Endless free orbit or continuous gear spinning that obscures hierarchy.  
- Second theme root or page-local visual authority for the machine.

## 10. Design principle

**Everything product is a part of the machine. Only the room around the machine is outside.**

Parents open. Children may be parents. Leaves are still inside. Environment holds institutional tabs. Product Law holds authority.
