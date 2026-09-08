# TeamAi 3D Hero — Seat Shell Hierarchy Sheet (v1)

**Status:** Hybrid baseline — design lock before first open prototype  
**Date:** 2026-09-08  
**Authority:** PRODUCT_LAW.md (Families E, H, J) → Machine Interaction Contract → Project-Wide Census → this sheet  
**Scope:** **One parent only** — Seat shell on the outer ring. Not subscription / discussion / coding / settings gears.

## 1. Goal of the hybrid slice

Establish a **repeatable baseline**:

```text
Wide / Team view
  → select Seat
  → camera docks (SEAT_CLOSE / seat-local)
  → Seat shell opens mechanically
  → v1 children visible
  → one leaf control operable *inside* the open shell
```

Later parents (Subscription, Discussion, Coding, Settings) copy this grammar.

## 2. Parent definition

| Field | Value |
|-------|--------|
| **Part ID** | `SEAT_SHELL` |
| **Role** | Parent holder for one Web AI Seat presentation |
| **Location** | Outer ring slot (index 0…N−1) |
| **Rest pose** | Closed shell; authored seat pose + optional micro-drift |
| **Open pose** | Shell parted / collar lifted / inner stack visible (exact mesh TBD in implementation) |
| **Select** | Click / focus Seat from wide or ring-adjacent view |
| **Camera** | Dock to that Seat (`SEAT_CLOSE` or successor seat-local id) |
| **Never means** | Entitlement, provider connected-as-truth, scheduler eligibility |

## 3. Child hierarchy (Product Law order)

Children are **presentation faces**. v1 marks which are **shown as layers** vs **stub** (visible but non-interactive) vs **deferred**.

| Order | Child ID | Product concept | v1 treatment | May be parent later? |
|------:|----------|-----------------|--------------|----------------------|
| 1 | `SEAT_CONNECTION` | Connection & entitlement face | **Layer** (status face) | Yes |
| 2 | `SEAT_BEHAVIOR` | Behavior Do / Don’t | **Stub** | Yes |
| 3 | `SEAT_TOOLKIT` | Built-in toolkit | **Deferred** | Yes |
| 4 | `SEAT_ZIPSKILLS` | Optional ZipSkills | **Deferred** | Yes |
| 5 | `SEAT_CAPABILITIES` | Tools / MCP availability | **Stub** | Yes |
| 6 | `SEAT_AUTHORIZATION` | Scope / approvals face | **Stub** | Yes |
| 7 | `SEAT_WORKSPACE_SCOPE` | Workspace / ref scope face | **Stub** | Yes |
| 8 | `SEAT_TASK_EVIDENCE` | Task / evidence face | **Stub** | Yes |

**v1 visible stack (minimal):**

```text
SEAT_SHELL (open)
  ├─ SEAT_CONNECTION     ← primary interactive target
  ├─ SEAT_BEHAVIOR       ← stub face
  ├─ SEAT_CAPABILITIES   ← stub face
  ├─ SEAT_AUTHORIZATION  ← stub face
  ├─ SEAT_WORKSPACE_SCOPE← stub face
  └─ SEAT_TASK_EVIDENCE  ← stub face
```

Toolkit + ZipSkills deferred so the first open stays readable.

## 4. v1 leaf (inside the open shell)

| Field | Value |
|-------|--------|
| **Leaf ID** | `SEAT_CONNECTION_HEALTH_FACE` |
| **Parent** | `SEAT_CONNECTION` |
| **Type** | Status face + optional presentation toggle (e.g. “show detail”) |
| **Spatial rule** | Rendered **inside** the open shell assembly — not a side-panel DOM chrome |
| **Semantics** | Accessible name, keyboard focusable when that is the focus target |
| **Authority** | Presentation only. May reflect a **read-model** health enum later; must not invent connected/authorized truth |
| **Reduced motion** | Snap open; no long gear travel required to read status |

**Out of v1 leaf scope:** API key entry, OAuth, durable bind save, entitlement mutation.

## 5. Open / close mechanics (contract)

```text
select SEAT_SHELL
  → set focusedSeatIndex
  → camera → seat dock
  → animate SEAT_SHELL rest → open (or snap if reduced motion)
  → reveal v1 children
  → focus SEAT_CONNECTION (default)
  → leaf SEAT_CONNECTION_HEALTH_FACE available

close / back / select other seat
  → leaf blur
  → children hide
  → SEAT_SHELL open → rest
  → camera returns wide or next seat dock
```

Rules:

- Only **one** Seat shell fully open at a time in v1.  
- Opening another Seat closes the previous.  
- Camera state is never authorization.  
- Mechanical open is never entitlement.

## 6. Mapping to existing code (debt awareness)

| Existing | Relation to this sheet |
|----------|----------------------|
| `hero-flex.js` seat draw | Visual Seat body; **no open hierarchy yet** |
| `hero-authored-meshes.js` `seatShell` | Mesh candidate for parent shell |
| `hero-seat-stack.js` | **Interim DOM debt** — categories overlap; long-term absorb into in-shell children |
| `hero-semantic-camera.js` / `SEAT_CLOSE` | Camera dock baseline |
| `hero-inspection-spine.js` | Stage IDs may align (`MECHANISM_*`) as open deepens |
| Seat read-model skill | Future feed for connection health face |

v1 implementation should **not** expand DOM seat-stack as the permanent home; prefer in-shell presentation even if first leaf is a simple labeled face in 3D/CSS-in-canvas-adjacent controlled by shell state.

## 7. Must-answer questions (census §7 applied)

### Law

1. **Family?** E (Seat) + J (presentation); connection face may *read* H/I facts later without owning them.  
2. **Browser write durable state?** No.  
3. **Visual imply entitlement?** No — health face is presentation / unknown until read-model.

### Hierarchy

4. **Kind?** Parent = `SEAT_SHELL`; children as table; leaf = `SEAT_CONNECTION_HEALTH_FACE`.  
5. **Children on open?** Connection (+ stubs listed).  
6. **Leaf inside parent?** Yes.  
7. **Camera / inspection ID?** Seat dock + optional `MECHANISM_*` when wired.

### Mechanics

8. **Rest vs open?** Closed shell vs parted shell + visible child stack.  
9. **Reduced motion?** Snap; hierarchy still readable.  
10. **Empty / loading / failure face?** Connection face shows `unknown` / `loading` / `unavailable` presentation enums — not silent blank.

### Evidence

11. **Static test?** Part IDs + “one open seat” + leaf-inside-shell contract strings or unit model.  
12. **Browser evidence?** Screenshot: wide → open seat → child stack visible.  
13. **Endorsement?** Not required for presentation prototype; HandOver note when slice lands.

### Continuity

14. **Reduce noise?** Starts path off DOM-only seat-stack.  
15. **Masterplan?** Presentation continuity under 029 hold — does not claim 029 release.

## 8. Explicit non-goals (v1)

- Full 8-child interactive forms  
- Subscription / discussion / coding / settings gears  
- Environment legal cameras  
- Provider key bind / PayPal / Firestore writes  
- Multi-seat simultaneous open  
- Dark-glass material pass as primary goal  

## 9. Implementation ladder (after you confirm this sheet)

1. Confirm / amend this sheet (you).  
2. Data model: `SeatShellState` { index, open, focusedChildId }.  
3. Camera dock on select.  
4. Open/close pose (mesh or staged proxy).  
5. Place v1 child faces.  
6. One leaf health face + a11y name.  
7. Static + browser evidence.  
8. Stop — do not expand to other domain gears in the same PR.

## 10. Design principle for this baseline

**One Seat. One open shell. Nested faces in Product Law order. One leaf inside. Truth stays with engines.**
