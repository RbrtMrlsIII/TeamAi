# TeamAi — 2026-09-13 Project Execution Summary

**Status:** validated project-level learning snapshot
**Parent knowledge authority:** `PRODUCT-KNOWLEDGE.md`
**Primary product authority:** `PRODUCT_LAW.md`
**Execution ledgers:** `#278`, `#284`

## High-level project picture

TeamAi is a user-controlled orchestration environment in which externally operated AI applications/providers participate as configured **Web AI Seats** inside one TeamAi product model. The project separates human authority, TeamAi authority, workspace-specific operating rules, skills, capabilities, authorization, scheduler eligibility, execution, durable evidence, and knowledge continuity.

The current engineering reality is intentionally more modest than the long-term vision: the repository has substantial governance, identity, Firestore-backed domain, Supabase Edge execution, bounded commerce, Seat/3D foundations, and browser-verification infrastructure, while several higher-order capabilities remain explicitly partial or not proven.

## Authority and system topology

```text
Human user
   ↓
Product Law
   ↓
Masterplan / Policy / ORUCAVEAM
   ↓
Skills / workspace adapters
   ↓
Implementation
   ↓
Verification + evidence
   ↓
Handover / endorsement
   ↓
Product Knowledge
```

Runtime topology:

```text
Public Entrance
   ↓
3D Hero / spatial machine
   ↕
Integration / Contracts
   ↕
Supabase Edge Functions
   ↕
Firebase Auth / Firestore
   ↕
External providers and workspaces
```

GitHub is the engineering/source authority. Supabase is trusted Edge execution and webhook infrastructure. Firebase Auth/Firestore provide identity and durable application/domain state. These boundaries must not be collapsed.

## What has already been surpassed or settled

- The historical Command Deck is retired as a current product/deployment surface. `/spatial/` is no longer a current product route; its historical source remains for reconstruction and evidence.
- `/` is the canonical public Entrance and `/hero/` is a compatibility publication of the Hero source.
- The public Entrance owns public product information, About, the Complex Dictionary/User Guide, Terms, Privacy Policy, Contact, Credits, and Footer.
- Guest 3D behavior and authenticated world behavior are distinct states. Login/Sign up belongs to the guest authentication transition, not the authenticated Settings taxonomy.
- The intended guest-to-auth transition stops the guest orbital motion, opens the currently-defined tree/branch/division presentation, centers the workspace, reaches the intended authentication framing, and presents the small authentication UI beside the workspace.
- Authenticated Settings is a categorical world map: Seats; Tree 1–8; Branches; Privacy Policy; Terms; Logout; Return BTN. It is not a second semantic tree hierarchy.
- The backend active deployment surface is frozen at exactly eight active TeamAi Supabase Edge Functions after removal of the obsolete legacy `paypal-webhook` deployment. `teamai-paypal-webhook-v5c` is canonical.
- `teamai-task-execute` remains a bounded execution stub at `stub-edge-runtime`; real external provider invocation is not being inferred from the existing endpoint.
- The task-lease field-preservation defect was identified and corrected as a general durable-state pattern: operations overlay only fields they own and preserve unrelated typed fields.
- Green CI is not treated as product completion, backend authority, external-runtime proof, or owner acceptance.
- Playwright is deterministic browser proof; deployed-browser inspection is a complementary human-observation layer.
- `HERO_LOW_ORBIT` and `TURN_FOLLOW` remain retired concepts.
- Existing prototype coordinates, camera paths, animation timings, ambient effects, and transitions are disposable implementation baselines. They must not constrain the final adaptive tree/branch/division or semantic electrical system.
- The current Tree Census is explicitly **not** a complete implementation census. Only structures that have actually been defined or partially implemented receive factual identity records.
- Undefined trees, branches, divisions, geometry, backend mappings, or completion status are not invented to satisfy the vision.

## Current frontend/product target

The intended chronological experience is:

```text
Entrance
  → explicit 3D World entry
  → guest default rotating world with eight-seat spatial baseline
  → Login / Sign up transition
  → restore authenticated durable user state
  → restore authorized Seats / workplace / project context
  → open 3D configurations and world-map Settings
  → evaluate readiness and permissions
  → user starts a turn
  → scheduler-backed contribution
  → semantic connection traversal
  → evidence / workspace result
```

The current frontend does **not** yet prove the entire target flow. Firebase authentication in the current frontend remains a presentation/integration boundary rather than a completed live user lifecycle. Durable restoration, live Seat configuration, full scheduler-backed turn participation, and final C9 acceptance remain separate work.

## Spatial machine construction law learned in practice

A future tree is not built by copying another tree's coordinates. The construction order is:

`root truth → treeID / branchId → purpose → payload → expansion requirements → adjacency / connection topology → adaptive geometry → camera / travel → interaction states → contribution route → verification`

Each branch/division is a real product integration with semantic purpose, UI payload, expansion footprint, adjacency clearance, connection ownership, camera relationship, responsive/reduced-motion behavior, and evidence state.

Trees and branches may be broad, asymmetric, recursive, differently sized, and densely connected. There is no universal branch height, width, radius, depth, or fixed coordinate template.

Expandable divisions use a stateful lifecycle:

`CLOSED → PREPARING → OPENING → ACTIVE → CLOSING → CLOSED`

Expansion must be smooth and spatially meaningful. It must reserve room for actual payloads, adjacent divisions, wiring corridors, camera travel, and readability.

The eventual turn-loop electricity is not a decorative effect. Participating divisions are active/open so actual semantic connection corridors exist, and the visible contribution path follows the real graph toward the workspace center.

## Current census position

The current census is a factual structural baseline, not a finished world model. Current semantic families include:

- `TREE-DOMAIN` — INCOMPLETE
- `TREE-HERO-SEAT` — PARTIAL
- `TREE-SKILL-RESPONSIBILITY` — INCOMPLETE

The Seat hierarchy currently provides the strongest implemented semantic foundation. It does not prove that the remaining tree families, all eight semantic trees, recursive branches, division layouts, or final integration topology exist.

Any future tree or division change must update the synchronized census representations in the same governed work:

`CSV + JSON + Markdown + authority XML`

## Backend current reality

The current connected Supabase environment provides eight active TeamAi Edge Functions:

1. `teamai-commerce-intent`
2. `teamai-domain-bootstrap`
3. `teamai-github-oauth-bind`
4. `teamai-github-webhook`
5. `teamai-paypal-webhook-v5c`
6. `teamai-seat-connection-test`
7. `teamai-seat-provider-bind`
8. `teamai-task-execute`

The legacy `paypal-webhook` deployment has been removed. Historical snapshots that still mention it remain historical evidence.

Firestore `(default)` is the durable application/domain store. The Supabase Postgres schema is not the application system of record. Edge Functions act as the trusted API/runtime boundary in front of Firebase.

The provider/runtime stage is not complete. OAuth lifecycle/security, deploy-source provenance, explicit Firestore secret-path denial, Gate-4 emulator proof, and other backend continuation boundaries remain separately governed rather than being hidden inside a generic "backend complete" claim.

## Governance lessons from the reconciliation run

The project repeatedly demonstrated that freshness is part of correctness.

A branch can be technically correct and still be invalid as a current-state change when it was built against stale `main`, stale active indexes, or stale issue guidance.

The correct sequence is:

`current main → active Issue/PR → changed roots → governance coupling → implementation → CI → browser/runtime evidence → merge`

Fail-closed governance is intentional. Required active indexes are part of the governed implementation contract; they are not optional paperwork.

Comments are evidence, not a second product manual. Durable requirements, warnings, decisions, acceptance conditions, and checklists belong in the Issue body or canonical documentation.

Historical comments, snapshots, and retired implementations remain valuable provenance and should not be silently rewritten to look current.

## Evidence and validation model

The project uses distinct evidence layers:

```text
source/static evidence
      ↓
CI validation
      ↓
Playwright deterministic browser proof
      ↓
deployed-browser / human observation
      ↓
external-provider evidence where applicable
      ↓
owner/product acceptance
```

No lower layer can impersonate a higher one.

A screenshot cannot prove Firebase persistence. A green unit test cannot prove PayPal production readiness. A deployed Edge Function cannot prove real external provider invocation. A passing validator cannot prove product acceptance. Each claim requires evidence from its authoritative boundary.

## Knowledge-continuity lesson

`latest AI output ≠ latest authority`.

When multiple AI applications participate, continuity must be carried by an authorized context packet containing the relevant authority, current purpose/state, durable state, workspace state, decisions, restrictions, evidence, and handover information.

This lets separate providers remain operationally separate without fragmenting the TeamAi project model.

## Current completion language

Use:

`PLANNED → IMPLEMENTED → VERIFIED → RUNTIME-PROVEN → COMPLETED → ENDORSED`

Do not collapse these levels. The project can have a green workflow while still being only IMPLEMENTED or VERIFIED for the specific claim under test.

## Recovery summary for a new agent

A fresh agent should first establish authority and current truth, not start coding:

`Product Law → Masterplan → Policy/ORUCAVEAM → Skill Wiring → current main → active Issue/PR → current census → relevant implementation → verification → evidence`

Then determine exactly which part of the machine is factual, which is partial, which is historical, and which remains undefined.

The project's most important meta-lesson is that TeamAi is no longer being built as a pile of visually convincing slices. It is being converged toward a traceable machine in which product meaning, semantic identities, geometry, animation, camera behavior, backend authority, deployment state, evidence, and learning remain connected without one layer pretending to be another.
