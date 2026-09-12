# Product Law Frontend Extension — Guest, Authentication, Entrance, and World-Map Contract

**Status:** NORMATIVE PRODUCT-LAW EXTENSION / FRONTEND EXPERIENCE BASELINE  
**Parent authority:** `PRODUCT_LAW.md`  
**Related normative extension:** `docs/PRODUCT_LAW_FRONTEND_HIGHEST_STAKE.md`  
**Current experience ledger:** Issue #278  
**No 029-release claim.**

This document freezes the owner-directed distinction between the public entrance, guest spatial experience, authentication transition, authenticated world state, and the top settings/world-map surface. It is intentionally conceptual. It does not prescribe a final visual layout, exact animation duration, or implementation technology.

## 1. Public entrance is the public information home

The public Entrance is the correct home for information a visitor should be able to reach without an authenticated 3D workspace session.

Its conceptual information architecture is:

```text
PUBLIC ENTRANCE
├── Hero / TeamAi identity
├── About TeamAi
├── Complex Dictionary / User Guide
│   ├── Account
│   ├── Commerce
│   ├── Seats
│   ├── Trees / Branches / Divisions
│   ├── 3D world
│   ├── Configuration
│   ├── Settings
│   ├── Skills / Toolkit
│   ├── Capabilities
│   ├── Connections
│   ├── Authorization
│   ├── Turns / Scheduler
│   ├── Tasks / Evidence
│   ├── Results / Handover
│   └── other product features as they become authoritative
├── Privacy Policy
├── Terms & Conditions
├── Contact Us
├── Credits
│   ├── Agents / AI contributors
│   ├── Anthropic / Claude
│   ├── xAI / Grok
│   ├── OpenAI
│   ├── GitHub
│   ├── Supabase
│   ├── Firebase
│   ├── PayPal
│   ├── Vercel
│   ├── Composio
│   └── Termux
└── Footer
```

Privacy Policy and Terms are public legal information. They must remain directly accessible from the Entrance and must not be relocated exclusively into authenticated 3D settings.

The Dictionary is intended to become the user's comprehensive guidance surface. It may describe complex product behavior with searchable, linked explanations so users can understand what a Seat, tree, branch, division, skill, connection, capability, authorization state, commerce state, or turn means before operating it.

## 2. Guest spatial experience

A guest may be presented with the 3D Hero as an inviting spatial demonstration, but the guest does **not** receive the authenticated world-control experience.

The intended guest state is:

```text
Entrance
   ↓
Enter / reveal 3D world
   ↓
default 3D Hero
   ↓
8-seat world presentation
   ↓
gentle automatic orbital/world motion
   ↓
user is not yet granted full free-orbit / configuration control
```

The automatic world motion is presentation-only. It does not imply authenticated Seat data, authorization, provider connection, scheduler eligibility, or live orchestration.

The guest may be offered clear Login and Sign up prompts from the guest experience. These prompts are the gateway into the authentication transition, not entries in the authenticated Settings categorical map.

## 3. Authentication transition state

When a guest chooses **Login** or **Sign up**, the world must not continue behaving as though the user is still passively observing it.

The intended transition is:

```text
Guest rotating world
      ↓
Login / Sign up selected
      ↓
STOP automatic orbital motion
      ↓
activate authentication transition state
      ↓
expand the required tree/branch/division presentation for the
central workspace relationship
      ↓
reframe the camera toward the workspace center
      ↓
move to the maximum intended authentication framing / zoom
      ↓
present the small Login / Sign up UI beside the workspace center
```

The authentication UI is deliberately a **small machine-native center surface**, not a separate full-page product experience.

The expansion that occurs for the authentication transition is presentation choreography. It must not be interpreted as proof that the user has already been authenticated or that all expanded divisions are authorized.

## 4. Authenticated state begins after identity is established

After Firebase establishes the authoritative user identity, the experience changes from guest presentation to user-owned world state.

The intended chronological sequence is:

```text
Authentication succeeds
      ↓
restore authorized durable user state
      ↓
restore Workplace / Project context
      ↓
restore the user's actual Seat population/configuration
      ↓
map durable Seat identities into the eight world slots as applicable
      ↓
expose authorized 3D configuration surfaces
      ↓
calculate reason-bearing Seat readiness
      ↓
allow user-started turn only when required conditions are satisfied
```

A rendered eight-seat world is a presentation baseline. It is not permission to fabricate eight durable Seats for a user who has fewer configured Seats.

A slot may therefore represent an empty, inactive, configured, unavailable, or active Seat state without changing the semantic identity rule.

## 5. Settings dropdown is an authenticated world map, not an auth menu

The authenticated Settings dropdown is intended for a user whose signed-in state already exists.

**Login and Sign up do not belong in the authenticated Settings category map.** They are guest-entry actions that lead into authentication.

The conceptual Settings category map is:

| **CATEGORIES** | **SMALLER CONTENTS (BRANCHES) / PURPOSE** |
|---|---|
| **Seats** | Overall Seats belonging to the user's authorized durable data |
| **Tree 1–8** | The eight major world/tree slots and their semantic branches |
| **Branches** | Smaller branches/divisions exposed by the selected tree structures |
| **Privacy Policy** | Public legal/privacy contents; linked from the Entrance and reachable from appropriate signed-in surfaces |
| **Terms** | Public Terms & Conditions contents; linked from the Entrance and reachable from appropriate signed-in surfaces |
| **Logout** | Sign the authenticated user out |
| **Return BTN** | Return to the public Entrance |

This table defines the conceptual categories and responsibilities. It does not freeze the final visual dropdown layout.

The Settings map must resolve to the same semantic tree/branch identities used by the Tree Census. It must never create a second hierarchy solely for navigation.

## 6. Guest / authenticated visual-state separation

The spatial machine must visually distinguish:

```text
GUEST
→ demonstrative / observational world
→ automatic orbital motion
→ authentication invitation
→ no durable-user configuration implied

AUTHENTICATED
→ user-owned restored world
→ automatic guest orbit no longer controls the world
→ user configuration becomes available according to authorization
→ world-map Settings available
→ turn readiness can be evaluated
```

The transition between these states must be perceivable and coherent without relying on backend facts that have not yet been proven.

## 7. Expansion and authentication choreography

The authentication transition may temporarily expand the machine so that the center workspace and relevant divisions become visually legible.

This does **not** establish that every tree or division is permanently expanded during ordinary authenticated use.

Ordinary tree/division expansion remains governed by the main 3D machine contract. The special authentication transition is a distinct presentation state whose purpose is to move the user's attention from the rotating public world into the center authentication relationship.

The expansion must use the same non-instant, stateful machine choreography required elsewhere:

```text
closed
→ preparing
→ opening
→ active
```

followed by the appropriate authentication or return transition.

No instant visibility switch, mesh teleport, or arbitrary camera jump is acceptable as the final experience.

## 8. Camera and ambient behavior

Guest world motion and authenticated camera control are different states of the same spatial machine.

Guest default behavior may provide:

- gentle automatic world/orbit motion;
- readable whole-machine framing;
- restrained ambient activity;
- visible invitation to authenticate.

Selecting Login or Sign up stops automatic guest orbit before the authentication choreography begins.

After authentication, camera behavior becomes governed by the semantic tree/branch/division camera contract, including world overview, tree focus, division focus, expansion follow, return paths, continuous travel, responsive framing, and reduced-motion equivalence.

No camera behavior may imply authorization merely through proximity or focus.

## 9. Effects and animation meaning

Guest ambient effects are atmospheric only.

Authenticated effects may become semantic where the corresponding product state is actually established.

The distinction is mandatory:

```text
ambient glow / motion
    ≠ authenticated state

selection highlight
    ≠ authorization

connection-looking line
    ≠ live provider connection

authentication transition effect
    ≠ successful authentication

turn-loop electricity
    ≠ real execution unless the corresponding semantic event/topology exists
```

The future turn-loop electrical system remains governed by the connection-graph contract and is not established by this document.

## 10. Entrance return behavior

The **Return BTN** in the authenticated Settings map returns the user to the public Entrance.

Returning must not destroy durable user state. It changes presentation context from authenticated spatial world to public Entrance.

If a later product decision requires session continuation while on the Entrance, that session relationship must remain explicit and must not make public presentation appear to contain authenticated world configuration.

## 11. Product boundary

This contract governs presentation sequence and user-facing information architecture. It does not authorize:

- Firebase writes from the renderer;
- provider secret access from the renderer;
- PayPal mutation from the renderer;
- scheduler selection by the renderer;
- direct provider-to-provider orchestration;
- durable authorization from an animation or expanded division;
- fabricated restored state.

The server/domain layer remains authoritative for identity, durable state, authorization, task lifecycle, scheduler eligibility, provider operations, and durable evidence.

## 12. Relationship to the other frontend baselines

`docs/PRODUCT_LAW_FRONTEND_HIGHEST_STAKE.md` remains the broad frontend/product architecture extension.

`docs/TEAMAI_3D_HERO_TREE_CENSUS.*` remains the structural inventory of actual tree/branch/division truth.

`docs/TEAMAI_3D_HERO_MACHINE_INTERACTION_CONTRACT.md` remains the technical machine interaction contract.

Issue #278 remains the active 029 execution ledger.

This document freezes the guest/authenticated/entrance distinction and the conceptual Settings taxonomy without becoming a second roadmap.

## 13. Evolution rule

Changes to this product behavior must first reconcile the concept here, then the relevant tree census entries, vision/context documents, implementation contracts, and finally runtime implementation.

A change to Login/Sign up placement, guest world behavior, authenticated Settings categories, Entrance information architecture, or the authentication transition is a product-experience change. It must not be introduced merely because a renderer already has a convenient button or camera dock.
