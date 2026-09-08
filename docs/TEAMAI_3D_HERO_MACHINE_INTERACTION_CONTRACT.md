# TeamAi 3D Hero — Machine Interaction Contract

**Status:** Design lock for hierarchy / in-machine configuration  
**Authority:** PRODUCT_LAW.md → this contract → spatial depth model → implementation  
**Related:** `docs/TEAMAI_3D_HERO_SPATIAL_DEPTH_MODEL.md`, `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`, Seat Shell Hierarchy v1 sheet

## 1. Intent

This document locks the **intended** Hero interaction model that was under-documented across sessions: the Hero is a **mechanical machine** whose outer structure, seats, workspace, and configuration surfaces are expressed as **nested gears and parts**, not as a flat 3D logo with a side-panel UI.

## 4. Machine anatomy

### 4.1 Outer ring — Seats

- The **outside ring** represents **Web AI Seats** (participants).  
- From a normal / wide view, selecting a Seat:
  - zooms/docks the camera to that Seat;
  - triggers **mechanical open** of that Seat’s shell;
  - reveals that Seat’s configuration tree (connection, behavior, toolkit, capabilities, authorization, workspace scope, task/evidence — as nested parts). ZipSkills is **workspace-tree** (`WORKSPACE_ZIPSKILLS`), not a Seat child — see Concentric Ring Map.  
- Seat count / “unlock more slots” is **presented** by subscription machinery (see §5); durable unlock remains domain/entitlement authority.

### 4.1b Intermediate rings (see Concentric Ring Map)

Between **center workspace (R0)** and **outer seats (R3)**:

- **R1 Backend display ring** — platform rules/docs faces; connections as animated threads.  
- **R2 Setup / configuration ring** — major config branches and setup engines, including login/register **mechanical** presentation.

Full table: `docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md`.

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

See also Concentric Ring Map for R0–R3 spatial placement of workspace, backend displays, setup engines, and seats.
