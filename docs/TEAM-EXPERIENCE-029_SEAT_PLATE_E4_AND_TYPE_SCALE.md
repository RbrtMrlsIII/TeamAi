# TEAM-EXPERIENCE-029 — Seat Plate, E4 Approval Contract, Size/Space/Type Values

**Status:** PLANNING CONTRACT / NOT IMPLEMENTATION / NOT PRODUCT LAW  
**Date:** 2026-09-04  
**Consumes:** Command Deck freeze (E0–E4, no e5; token *families*)  
**Assigns now:** Seat E3 interior, shared E4 plate, Size / Space / Type **values**  
**Supersession (2026-09-04 hygiene):** Field numbers (F0–F7), first palette anchors, blur cap, and motion ms are assigned in `TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md`. Do not treat the historical “still not assigned” wording as authority over that reconciliation. Typeface *files* remain open (stacks only).

Canonical unit: **4px grid**. Values are `rem` first, `px` at 16px root in parentheses. Dark and Light do **not** retune these values — only Surface / Depth / State accents.

---

## 1. Shared E4 approval contract

One plate primitive. Two button clusters. No second dialog system. Field identity **F7**.

```text
E0–E3  deck/composition  (inert while open)
E4     depth.scrim
       ┌───────────────────────────────────────────┐
       │ surface.modal  elev.e4                   │
       │ title                                    │
       │ actor  (seat · role · provider · model)  │
       │ impact                                   │
       │ WILL RUN          WILL NOT               │
       │ body + type.mono ids                     │
       │ health  ok|degraded|blocked|unauthorized │
       │                                          │
       │ [ secondary ]              [ primary ]   │
       └───────────────────────────────────────────┘
```

| Slot | Primitive | Type | Must be seen |
|---|---|---|---|
| Scrim | environment | — | Blocks pointer to E0–E3. No extra blur on the whole deck. |
| Plate | Panel (`surface.modal`) | — | Strongest elevation. Almost opaque in Dark. Raised instrument plate in Light. |
| Title | — | `type.title` | What is being decided, in product language |
| Actor | — | `type.meta` + `type.mono` | Seat, role, provider, model. Not a secret, not a credential. |
| Impact | — | `type.body` | What happens if approved, in human sentences |
| Will run | — | `type.body` + `type.mono` | Tool/task/event ids that will execute |
| Will not | — | `type.body` | What this approval does **not** grant (no extra entitlement, no scheduler rewrite) |
| Health | — | `type.status` + icon | If connection is degraded/blocked/unauthorized, primary is disabled |
| Controls | Control lg | `type.label` | Cluster A or B below |

### Cluster A — action request
`DENY` (secondary) · `APPROVE` (primary)

Used by: Deck overlay, Working blocked action, Approvals queue, Settings disconnect-if-gated, Artifacts attach-if-gated, Seat activate-if-gated.

### Cluster B — planning handoff
`REJECT` · `EDIT` · `MORE` · `APPROVE`

Used by: Planning handoff, Deck E3 when a summarizer packet is waiting.  
Same plate, different cluster. `EDIT` returns to the well with the packet open. `MORE` keeps Planning running. `APPROVE` is review, not task execution.

### E4 law
- Focus traps on the plate. Keyboard: shell path is suspended; Tab cycles plate controls only.
- Initial focus: plate container, then first **enabled** primary is reachable without hover.
- Escape: Cluster A → `DENY` if allowed, else stay. Cluster B → does not approve; behaves as `MORE` (dismiss plate, leave packet). Action requests that require an explicit DENY do not treat Escape as success.
- Primary is never the only visible verb.
- Color is not the only status signal.
- Theme switch while open: plate stays mounted; material retunes; decision is unchanged.
- Reduced motion: instant mount/unmount. No travel, no pulse.
- Script `approval.mount` may open/close the plate and move focus. It must **not** execute the action, write Firestore, charge PayPal, or pick the next seat.

### Compact
If E4 is open, it is the only required interior. Underlying composition may hide. Horizontal overflow is a defect. Both clusters wrap; they do not drop `APPROVE`.

---

## 2. Seat plate (E3 interior)

Seats composition, Active region. Not a new elevation. Not a chat.

**Purpose:** show one seat as a configured capability, not as a model name.  
**Primary action:** `Test connection`. `Activate` only when test is ok **and** policy allows; otherwise E4 Cluster A.

```text
E3  SEAT PLATE  (surface.active)
    ┌─────────────────────────────────────────────────────────┐
    │ IDENTITY   name   role   health                         │
    │            provider · runtime · model   (type.mono)     │
    │            connection  ok|degraded|blocked|unauthorized │
    ├──────────────────────────┬─────────────────────────────┤
    │ TEAM                      │ TOOLS                       │
    │ Team Quality              │ Tool Quality                │
    │ skill bundle              │ tools / plugins / MCP       │
    │ Base TeamAi capabilities  │ workstation / scope         │
    ├──────────────────────────┴─────────────────────────────┤
    │ LIMITS     budget · rate · storage · approval gates     │
    │ SPLIT      TeamAi entitlement  |  provider entitlement  │
    │ CONTROLS   [ Test connection ]     [ Activate ]         │
    └─────────────────────────────────────────────────────────┘
```

| Zone | Primitive | Type | Must be seen |
|---|---|---|---|
| Identity | Active panel header | title + meta + status | Seat name, role (planning / summarizer / worker / reviewer / leader), health |
| Binding | meta + mono | meta, mono | Provider, service/runtime, exact model/variant |
| Connection | status + icon | status | ok / degraded / blocked / unauthorized. Last test result if any |
| Team column | Cards or stacked labels | label + body | Team Quality, skill bundle, Base TeamAi capability set |
| Tools column | Cards or stacked labels | label + body | Tool Quality, tool/plugin/MCP bundle, workstation/scope |
| Limits | Panel strip | meta + mono | Budget, rate, storage, which actions require E4 |
| Split | Two facts, equal weight | label + status | TeamAi entitlement **versus** provider entitlement. One never implies the other |
| Controls | Control md/lg | label | Test (always). Activate (enabled only if connection ok and both entitlements allow this seat) |

### Seat rail vs seat plate
The Deck **rail** (E2 cards) is the compact projection of this plate: name, role, provider, model, connection, eligible/speaking.  
Opening Seats + selecting a card **reveals the plate**; it does not change scheduler eligibility by itself. `state.selected` is UI. `speaking` / eligible is product state *displayed*, not assigned by the script.

### Empty / blocked
- No connection: plate still lists role and desired provider; Test is the primary; Activate disabled.
- Unauthorized: status unauthorized; Activate disabled; why-next on Deck will show the capability gate.
- Missing tool scope: Tools column shows the gap; does not invent MCP servers.

### Compact
Two columns stack (Team above Tools). Split stays two facts, stacked, not merged. Activate remains visible.

---

## 3. Size values

| Token | rem | px | Use |
|---|---|---|---|
| `size.control.sm` | 2.00 | 32 | Desktop compact density, fine pointer only |
| `size.control.md` | 2.50 | 40 | Default controls |
| `size.control.lg` | 2.75 | 44 | Primary actions, E4 verbs |
| `size.touch.min` | 2.75 | 44 | Floor on touch. sm not allowed |
| `size.icon.sm` | 1.00 | 16 | Meta, status pip |
| `size.icon.md` | 1.25 | 20 | Nav, seat health |
| `size.icon.lg` | 1.50 | 24 | E4 / empty states |
| `size.radius.sm` | 0.25 | 4 | Controls |
| `size.radius.md` | 0.50 | 8 | Cards |
| `size.radius.lg` | 0.75 | 12 | Panels, E4 plate |
| `size.focus.ring` | 0.125 | 2 | All interactive primitives |
| `size.focus.offset` | 0.125 | 2 | Gap between edge and ring |
| `size.seat-card.width` | 14 | 224 | Deck rail card |
| `size.seat-card.min-height` | 4.50 | 72 | Deck rail default |
| `size.seat-card.compact-height` | 2.75 | 44 | Deck rail compact |

No pills. No 9999px radii. Same radii in Dark and Light. Nested surfaces follow concentric radius craft where padding is tight (`outer = inner + padding`).

---

## 4. Space values

| Token | rem | px | Use |
|---|---|---|---|
| `space.inset.xs` | 0.25 | 4 | Tight control padding |
| `space.inset.sm` | 0.50 | 8 | Cards, status |
| `space.inset.md` | 0.75 | 12 | Panels, seat plate zones |
| `space.inset.lg` | 1.00 | 16 | E3 active, E4 plate |
| `space.inset.xl` | 1.50 | 24 | Rare; composition intro only |
| `space.stack.xs` | 0.25 | 4 | Label → control |
| `space.stack.sm` | 0.50 | 8 | Inside a card |
| `space.stack.md` | 0.75 | 12 | Inside a panel |
| `space.stack.lg` | 1.00 | 16 | Between zones in E3 |
| `space.stack.xl` | 1.50 | 24 | Between E2 regions |
| `space.gutter` | 1.00 | 16 | Default gap between Deck columns |
| `space.gutter.compact` | 0.75 | 12 | Compact density |
| `space.shell` | 0.75 | 12 | Shell inset default |
| `space.shell.compact` | 0.50 | 8 | Compact shell |

**Density:** `default` uses the table as written. `compact` steps inset/stack/gutter/shell down one rung, **never below `xs`**, and never below `size.touch.min` on touch. Density is not a theme.

---

## 5. Type values

**Stacks, not files.** Swap later by changing these two tokens only.

| Token | Stack |
|---|---|
| `type.family` | `ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `type.mono` | `ui-monospace, "SFMono-Regular", "Cascadia Mono", Consolas, "Liberation Mono", monospace` |

| Role | Family | Size rem (px) | Line rem (px) | Weight | Tracking | Use |
|---|---|---|---|---|---|---|
| `type.display` | family | 1.50 (24) | 2.00 (32) | 600 | -0.01em | Composition name only (e.g. “Seats”). Not marketing |
| `type.title` | family | 1.125 (18) | 1.50 (24) | 600 | 0 | Region/plate titles |
| `type.body` | family | 0.9375 (15) | 1.50 (24) | 400 | 0 | Conversation, impact, why-next |
| `type.label` | family | 0.8125 (13) | 1.25 (20) | 500 | 0.01em | Controls, zone names |
| `type.meta` | family | 0.75 (12) | 1.125 (18) | 400 | 0.01em | Provider, time, role |
| `type.status` | family | 0.75 (12) | 1.00 (16) | 600 | 0.04em | ok / degraded / blocked / unauthorized |
| `type.mono` | mono | 0.8125 (13) | 1.25 (20) | 400 | 0 | Model, task, event, seat ids |

`font-variant-numeric: tabular-nums` on meta, status, and mono.  
Dark/Light retune **color against surface**, not size, weight, or family.

---

## 6. What these values must not do

- Do not scale type independently per composition.
- Do not give E4 a larger type ramp than the Deck.
- Do not shrink `APPROVE` below `size.control.lg`.
- Do not encode status only as a color token.
- Do not introduce a display face, serif, or “logo font” without a Product Law change.

## 7. Still not assigned (narrowed)

Typeface *files* (stacks only). Items already assigned in the theme-root reconciliation (F0–F7, palette anchors, blur cap, motion ms) are closed.

## 8. Next

Implementation of the single theme root using this scale and the reconciliation map — presentation foundation only until Masterplan item 17 releases the full 029 product-experience hold.
