# TeamAi 3D Hero — Seat Shell Hierarchy v1

**Status:** Living presentation sheet  
**Authority:** PRODUCT_LAW → Machine Interaction Contract → Hierarchy Runtime Baseline → this sheet → skills  
**Companion:** `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md`

## Intent

One open seat parent at a time. Children stack as mechanical faces. Leaves stay under Connection. Presentation only.

## Children (v1)

| # | Part ID | Role | Status | In shell |
|---|---------|------|--------|----------|
| 1 | `SEAT_CONNECTION` | Connection + health leaf | Implemented | Yes |
| 2 | `SEAT_BEHAVIOR` | Behavior Do / Don’t | **Stub** | Yes |
| 3 | `SEAT_TOOLKIT` | Optional toolkit fixture (skill bundles; external assign OK) | **Stub (optional)** | Yes |
| 4 | `SEAT_CAPABILITIES` | Capabilities face | Stub | Yes |
| 5 | `SEAT_AUTHORIZATION` | Authorization face | Stub | Yes |
| 6 | `SEAT_WORKSPACE_SCOPE` | Workspace scope | Stub | Yes |
| 7 | `SEAT_TASK_EVIDENCE` | Task / evidence | Stub | Yes |

### Tree

```
SEAT_SHELL#index
  ├─ SEAT_CONNECTION     ← health leaf
  ├─ SEAT_BEHAVIOR       ← stub face
  ├─ SEAT_TOOLKIT        ← optional fixture (SEAT_TOOLKIT_V1)
  ├─ SEAT_CAPABILITIES
  ├─ SEAT_AUTHORIZATION
  ├─ SEAT_WORKSPACE_SCOPE
  └─ SEAT_TASK_EVIDENCE
```

`SEAT_TOOLKIT` is **optional seat-scoped** presentation (`SEAT_TOOLKIT_V1` fixture). **Not required** — users may assign toolkits outside the platform; no entitlement.

### WORKSPACE_ZIPSKILLS — workspace tree (not a Seat child)

Former `SEAT_ZIPSKILLS` is **removed from the Seat child table** and renamed **`WORKSPACE_ZIPSKILLS`**.
It equips on the **workspace tree** (R0 / governance continuity), not on seats.
Also **not required** — external governance assignment allowed.
Slice E presents `WORKSPACE_ZIPSKILLS_V1` as an optional inner-crown fixture (`RING_R0_ZIP_SCALE`). Keyboard `z`/`x`. Not authority (LAW 109).

## Health leaf

`SEAT_CONNECTION_HEALTH_FACE` under Connection. Fixture statuses: unknown / loading / unavailable. Presentation only — not authorization.

## Numbers

From Hierarchy Runtime Baseline §9 (`SEAT_REST_Y`, `SEAT_OPEN_LIFT`, `CHILD_STEP_*`, durations).

## Boundaries

Presentation only · durable: false · **no 029-released claim**
