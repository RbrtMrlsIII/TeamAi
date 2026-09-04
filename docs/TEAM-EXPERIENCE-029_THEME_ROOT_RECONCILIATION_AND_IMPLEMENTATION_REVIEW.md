# TEAM-EXPERIENCE-029 — Theme-Root Reconciliation + Implementation Review

**Status:** IMPLEMENTATION REVIEW SLICE / NOT PRODUCT LAW  
**Date:** 2026-09-04  
**Base:** PR #19 head `fad930c8bf41456e246baf58a65878f7a92e9c95`  
**Purpose:** reconcile the previously separated storyboard/scale contracts with the theme-root implementation slice without silently erasing the change in vocabulary.

## 1. Explicit Status / Modal reconciliation

PR #19 froze five reusable **legal boxes**:

`Shell · Panel · Card · Control · Navigation`

The follow-on implementation needs named bounded surfaces for atmosphere, status, and the shared approval layer, so the implementation vocabulary is **F0–F7**. This is an explicit extension of field identity, not a silent rewrite of the legal-box law.

| Field | Identity | Legal-box status | Elevation | Contract |
|---|---|---|---|---|
| F0 | atmosphere | environment; not a legal box | E0 | depth only; no data |
| F1 | shell | existing legal box | E1 | persistent shell |
| F2 | navigation | existing legal box | E1 | persistent navigation |
| F3 | panel | existing legal box | E2/E3 | working/detail surface |
| F4 | card | existing legal box | E2 | repeated bounded item |
| F5 | control | existing legal box | — | interactive control |
| F6 | status | controlled system surface; **not a new general-purpose legal box** | E2 | connection + TeamAi/provider entitlement split + recovery; text + icon |
| F7 | modal | controlled system surface; **not a second dialog system** | E4 | one shared approval plate with Action or Planning Handoff cluster |

### Status wording

F6 is the **Status strip/system surface**, not a navigation destination. It is always available from Shell/Status and communicates connection health, the two entitlement facts, and recovery location. It never becomes a debugger and never tells the user that a provider switch is product authority.

### Modal wording

F7 is the **single shared E4 modal system surface**. It is not a new fifth/sixth general-purpose legal box and not a second dialog framework. The same plate is used across Deck, Working, Approvals, Settings, Artifacts, and Seats, with the defined button clusters:

- Action: `DENY` · `APPROVE`
- Planning Handoff: `REJECT` · `EDIT` · `MORE` · `APPROVE`

The E4 contract remains: focus trap, no whole-deck blur, primary never the only visible verb, color never the only status signal, reduced-motion instant mount/unmount, and `approval.mount` never executes the action or writes domain state.

## 2. Reconciliation of stale planning statements

The earlier Command Deck and Seat/Scale documents intentionally ended with “still not assigned” lists. Those statements are **historical at the PR #19 boundary**. This review slice now assigns, for implementation review:

- F0–F7 field identities with the explicit legal-box reconciliation above.
- First Command Space and Instrument Space surface palettes.
- Blur caps and elevation/shadow recipes.
- Motion durations: `0 / 120 / 200 / 320ms` plus shared cubic-bezier roles.
- Size / Space / Type values from the companion contract.
- Unified theme root attributes and `color-scheme` behavior.

Still intentionally unassigned:

- Bundled font files; platform stacks remain canonical.
- Product Law endorsement of the recommended names **Command Space** / **Instrument Space**.

No backend, scheduler, Firestore, PayPal, entitlement, or authorization semantics are introduced by this slice.

## 3. Theme root

One root only:

- `data-theme-mode="dark|light"`
- `data-theme-source="user|os"`
- `data-density="default|compact"`
- `data-motion="full|reduced"`
- `style.color-scheme` matches mode

A direct manual mode selection becomes `source=user`; OS following is explicit. Invalid persisted values are normalized to safe defaults. When source is `os`, OS theme changes can be observed without creating a second theme root.

## 4. Material law

**Command Space / Dark Spatial Glassmorphism:** deep field, opaque shell, glass only on elevated panels, localized active light, near-opaque approval; blur is an edge cue and caps at 12px.

**Instrument Space / Light Spatial Skeuomorphism:** warm foundation, bezel shell, inset fields, raised controls, pressed = inset; no glass fill; blur is 0px.

The two modes share Size / Space / Type, elevation order, semantic meaning, motion durations, and interaction contracts. Theme switching retunes material only and never reshuffles layout.

First palette anchors remain:

- Command Space: `#07111C`
- Instrument Space: `#E7DCC8`

## 5. Motion law

Shared roles:

| Role | Value |
|---|---:|
| instant | `0ms` |
| short | `120ms` |
| medium | `200ms` |
| long | `320ms` |
| stagger | `40ms` |
| travel none / small / medium | `0 / 4 / 8px` |

Easing roles are shared by both modes: enter `cubic-bezier(0.16,1,0.3,1)`, exit `cubic-bezier(0.4,0,1,1)`, move `cubic-bezier(0.25,0.1,0.25,1)`, emphasize `cubic-bezier(0.2,0,0,1)`.

Consumption remains: hover/press/focus = short + move; panel/theme material retune = medium + enter; E4 mount = long + enter; E4 unmount = short + exit; reduced motion = no travel/pulse, E4 instant, medium becomes `80ms` opacity-only crossfade.

No bounce, elastic, or spring on operational controls.

## 6. Scale and compact law

The companion values remain canonical: 32/40/44px controls, 44px touch/primary floor, 16/20/24px icons, 4/8/12px radii, 2px focus ring + 2px offset, 224px seat card width, 72px default seat card height, 44px compact seat card height, 4px-grid spacing, and platform font stacks.

Compact density steps spacing down one rung, never below `xs`, and never below the 44px touch floor. It does not retune typography and is not a theme. E4 stays reachable if open; E3 stays; E2 rails compress/park; navigation becomes a bar/menu; no horizontal overflow; hover is never the only path.

## 7. Composition preservation

The Command Deck remains the first inhabited skeleton, not a marketing hero. Workplace, Seats, Planning, Working, Artifacts, Approvals, and Settings remain rearrangements of the same primitives and E0–E4 law. Planning vs Working is an E3 stage, not a second theme. The Seat plate is full capability, not chat. The Deck seat rail is a compact projection and selecting a card does not change scheduler eligibility.

## 8. Safety / authority boundary

Presentation scripts may switch theme, retune Planning/Working stage, select a seat for display, open/close E2 rails, mount/unmount E4, and apply reduced-motion behavior. They may not choose the next scheduler actor, write Firestore, charge PayPal, execute approved actions, alter entitlements, or create a second store/root.

## 9. Review checklist

- [ ] Field vocabulary is read as **F0–F7 field identity**, with the five PR #19 legal boxes preserved.
- [ ] Status and Modal are explicitly controlled system surfaces, not silently promoted to general-purpose legal boxes.
- [ ] Dark/Light palette values and material laws are reviewed.
- [ ] Blur, elevation, motion, and reduced-motion rules are reviewed.
- [ ] Size / Space / Type and compact law are preserved.
- [ ] Theme bootstrap failure is fail-safe and complete.
- [ ] User mode selection cannot accidentally remain OS-following.
- [ ] No page-local palette, second theme root, or backend/domain mutation.
- [ ] No implementation merge occurs until this review is complete and explicit approval is given.
