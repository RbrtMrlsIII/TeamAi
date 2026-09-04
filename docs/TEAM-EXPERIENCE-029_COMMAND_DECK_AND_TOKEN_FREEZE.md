# TEAM-EXPERIENCE-029 — Command Deck Freeze + Remaining Compositions

**Status:** PLANNING STORYBOARD / NOT IMPLEMENTATION / NOT PRODUCT LAW  
**Date:** 2026-09-04  
**Authority of this file:** The Command Deck section below is the endorsed freeze. Earlier long-form E0–E5 drafts are superseded.  
**Supersession (2026-09-04 hygiene):** Field numbers (F0–F7), first palette anchors, blur cap, and motion ms are assigned in `TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md`. The historical “Still not assigned” lists below are **stale for those items** and must not undo the reconciliation. Typeface *files* remain unassigned (stacks only).

Command Deck is the first body on the skeleton — same bones in both modes, material only changes. Token *families* are frozen here. Size / Space / Type values, Seat E3 interior, and the shared E4 plate are in the companion scale document.

---

## Command Deck

**Purpose:** operate the current team. Not a marketing hero.  
**Primary action:** instruct, watch the turn/task, approve or refuse, switch Planning/Working without losing context.

```text
E0  atmosphere
    ┌─────────────────────────────────────────────────────────┐
E1  │ SHELL   Workplace / Project   health   theme   account  │
E1  │ NAV     Deck · Workplace · Seats · Planning · Working   │
    │         Artifacts · Approvals · Settings                │
    ├──────────┬──────────────────────────────┬─────────────────┴
E2  │ SEATS    │ E3 ACTIVE                  │ E2 WHY-NEXT     │
    │ cards    │ Planning conversation  OR  │ dependency      │
    │ role     │ Working task               │ event           │
    │ provider │ user instruction stays     │ scheduler       │
    │ health   │ pinned                     │ capability gate │
    ├──────────┴──────────────────────────────┴─────────────────┤
E2  │ STATUS   connections · entitlement · recovery           │
    └─────────────────────────────────────────────────────────┘
E4  approval overlay — only when an action request exists
```

| Region | Primitive | Elevation | Must be seen |
|---|---|---|---|
| Atmosphere | environment | E0 | Depth only. No data. |
| Shell | Shell | E1 | Workplace, Project, health, theme, account |
| Nav | Navigation | E1 | Same labels in Dark, Light, and compact |
| Seat rail | Cards in a Panel | E2 | Name, role, provider, model, connection, eligible/speaking |
| Active | Panel | E3 | Planning or Working. User instruction stays visible |
| Why-next | Panel | E2 | Dependency + event + readiness + scheduler + capability gate |
| Status | System surface inside Shell (F6; not a legal box) | E2 | Connection, TeamAi vs provider entitlement, recovery — text+icon. Not a nav destination. |
| Approval | Modal panel (F7; shared E4 plate, not a second dialog system) | E4 | Action + impact + APPROVE/DENY. Strongest plate |

Planning vs Working is a product stage inside E3, not a second theme.

**Dark (Command Space):** deep field, stable opaque shell, glass only on elevated panels, localized light on the active seat/task, approval almost opaque. Blur is an edge cue, not a fill.

**Light (Instrument Space):** warm foundation, bezel shell, inset fields, raised buttons, pressed = inset. Not inverted Dark. Not fake leather.

**Keyboard:** shell → nav → seats → active → why-next → status → approval if open.  
**Reduced motion:** no travel, no pulse. Theme switch does not reshuffle layout.

---

## Token-family freeze (names only)

One namespace. No `--hero-*`, no page-local hex.

| Family | Frozen roles | Dark/Light may retune |
|---|---|---|
| Theme | `mode`, `color-scheme`, `source` (user beats OS) | — |
| Surface | atmosphere, shell, panel, active, modal, inset, raised | fill / glass vs plate |
| Depth | atmosphere, scrim (E4 only), blur cap, optional light grain | intensity |
| Elevation | `e0`…`e4` + `focus`. **No e5** | shadow/light, not order |
| Type | family, mono, display, title, body, label, meta, status | color vs surface, not role |
| Size | control sm/md/lg, icon, radius, seat-card, focus ring | — |
| Space | inset, stack, gutter, shell, density default/compact | — |
| State | focus, hover, pressed, selected, disabled, speaking; status ok/degraded/blocked/unauthorized | accent, not meaning |
| Motion | instant/short/medium/long; enter/exit/move; travel none/small | — |

**Legal boxes:** shell · panel · card · control · navigation.  
The Deck composes them. It does not restyle them. Status (F6) and Modal (F7) are controlled system surfaces, not additional legal boxes.

**Simple scripts later, still not code:** theme switch, Planning/Working stage, seat select, panel presence, approval mount, reduced-motion map. None of those may touch scheduler, Firestore, or entitlements.

---

## Remaining nav compositions

Same skeleton. Same tokens. Same E0–E4. Same Dark/Light material law.  
A destination is a **rearrangement of primitives**, not a new theme.

Shell + Nav + Atmosphere persist on every composition. Only the interior changes. Compact collapse still parks E2 rails before E3, and never parks E4 if an approval is open.

### Workplace

**Purpose:** choose and understand the current Workplace / Project.  
**Primary action:** enter a Project (returns to Deck).

| Region | Primitive | Elev | Must be seen |
|---|---|---|---|
| List | Cards in a Panel | E2 | Workplace name, owner, project count, health |
| Detail | Panel | E3 | Selected Workplace, its Projects, workstation/scope, team bound here |
| Danger | Modal | E4 | Only for leave/archive/transfer — not ordinary switch |

Must not: host seat OAuth, commerce checkout, or the live conversation.

### Seats

**Purpose:** bind a provider connection to a seat and see capability truth.  
**Primary action:** select a seat, test connection, activate when allowed.

| Region | Primitive | Elev | Must be seen |
|---|---|---|---|
| Seat list | Cards | E2 | Name, role (planning/summarizer/worker/reviewer/leader), provider, runtime, model, connection, health |
| Seat plate | Panel | E3 | Skills, Base TeamAi capabilities, Tool Quality, tools/MCP, workstation, scopes, limits, Team Quality |
| Entitlement split | Panel | E2 | TeamAi entitlement vs provider entitlement — never implied as one |
| Test / activate | Modal | E4 | Capability test result before Active; or approval if policy requires |

Must not: become the chat. Activation failure stays on this composition and in Status.

### Planning

**Purpose:** full deliberation surface when E3 on the Deck is not enough.  
**Primary action:** instruct; review summarizer handoff.

| Region | Primitive | Elev | Must be seen |
|---|---|---|---|
| Transcript | Panel (inset in Light) | E2 | Shared conversation; current speaker; human messages distinct |
| Pinned instruction | Active panel | E3 | Current user instruction remains visible while AIs talk |
| Turn plan | Panel | E2 | Seat order, turns-per-AI, designated summarizer, document-author path (one only) |
| Handoff | Active or Modal | E3 / E4 | Decisions, rationale, alternatives, unresolved, `APPROVE / EDIT / MORE / REJECT` |

Durable mutation does not happen from this visual. User review is the gate.  
Previous AI reply is a contribution, not authority.

### Working

**Purpose:** full execution surface.  
**Primary action:** inspect the eligible task and why it is next.

| Region | Primitive | Elev | Must be seen |
|---|---|---|---|
| Task graph | Cards in a Panel | E2 | Task, dependency, state, assigned seat/tool |
| Current task | Active panel | E3 | Eligible task, assigned seat, last event, result/artifact pointer |
| Why-next | Panel | E2 | Same sentence as Deck: dependency + event + scheduler + capability gate |
| Blocked action | Modal | E4 | Approval, missing capability, unauthorized, or failed connection |

Working does not rewrite the approved plan. A new planning path is required to change it.

### Artifacts

**Purpose:** open, attach, and trace files/handoffs/results.  
**Primary action:** open an artifact or attach it to the current task.

| Region | Primitive | Elev | Must be seen |
|---|---|---|---|
| Index | Cards | E2 | Name, type, originating seat, task/event id (`type.mono`), time |
| Preview | Panel | E3 | Bounded preview or summary; large bodies stay referenced |
| Attach / export | Modal | E4 | Confirm attach to task, or export — policy may require approval |

Must not: dump unrestricted repo contents or secrets into the well.

### Approvals

**Purpose:** the queue of action requests. The E4 plate is the same primitive as the Deck overlay.  
**Primary action:** APPROVE or DENY one request.

| Region | Primitive | Elev | Must be seen |
|---|---|---|---|
| Queue | Cards | E2 | Request, seat, impact, waiting-since, status |
| Selected | Active panel | E3 | Full impact, what will run, what will not |
| Decision | Modal | E4 | APPROVE / DENY. Focus trapped. Same plate as Deck E4 |

One approval language everywhere. No “cute” confirm on Deck and a different dialog here.

### Settings

**Purpose:** account, theme, connections, limits — configuration, not operations.  
**Primary action:** save a setting; start a connection flow (completes outside if the provider requires it).

| Region | Primitive | Elev | Must be seen |
|---|---|---|---|
| Account | Panel | E2 | Identity (Firebase UID ownership is backend; UI only displays) |
| Theme | Controls | E2 | One mode switch. `source` user vs OS default |
| Connections | Cards | E2 | Provider connections, health ok/degraded/blocked/unauthorized |
| Limits | Panel | E3 | Budget, rate, storage, approval policy — display of policy, not a rewrite of Product Law |
| Destructive | Modal | E4 | Disconnect, revoke, reset local theme |

Theme control here is the **same** `theme.mode` as the shell control. Not a second root.

---

## Status strip (not a nav destination)

Always available from Shell/Status on every composition. Field identity **F6** — controlled system surface, not a sixth legal box.

| Item | Must communicate | Must not communicate |
|---|---|---|
| Connection | ok / degraded / blocked / unauthorized | “try another provider” as authority |
| Entitlement | TeamAi plan vs provider subscription as two facts | that one grants the other |
| Recovery | something failed and where to go | a debugger as the product |

---

## Compact law (all compositions)

1. E4 stays reachable if open  
2. E3 stays reachable  
3. Seat/list rails compress  
4. Why-next / extra E2 parks behind a label  
5. Nav → bar/menu  
6. Atmosphere chrome goes first  
7. No horizontal overflow  
8. Hover is never the only path

---

## Scripts later (closed list)

| Script | May do | Must not do |
|---|---|---|
| theme switch | write `theme.mode` + `color-scheme` | change layout or domain state |
| Planning/Working stage | retune E3 skin | create a second theme |
| seat select | `state.selected` / `speaking` | pick the next scheduler actor |
| panel presence | open/close E2 rails | persist as Firestore truth |
| approval mount | E4 + focus trap | execute the action |
| reduced-motion map | travel → none | hide status |

---

## Still not assigned (narrowed)

Typeface *files* (stacks only remain assigned). Any item already set in `TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md` (F0–F7, palette anchors, blur cap, motion ms) is **not** open for re-assignment from this file.

Size / Space / Type values, the Seat plate, and E4 remain assigned in `TEAM-EXPERIENCE-029_SEAT_PLATE_E4_AND_TYPE_SCALE.md`.
