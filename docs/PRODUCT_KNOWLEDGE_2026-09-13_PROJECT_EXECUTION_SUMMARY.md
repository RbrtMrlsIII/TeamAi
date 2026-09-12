# TeamAi — Project Execution Summary — 2026-09-13

**Classification:** validated project-level learning
**Parent authority:** `PRODUCT-KNOWLEDGE.md`
**Product authority:** `PRODUCT_LAW.md`
**Execution ledgers:** Issue #278 / #284

## Executive picture

TeamAi is a human-controlled orchestration environment in which externally operated AI applications/providers participate as configured **Web AI Seats**. Its design separates human authority, TeamAi authority, workspace-specific operating rules, skills, capabilities, authorization, scheduler eligibility, execution, durable evidence, and cross-application knowledge continuity.

The present repository is a strong foundation rather than a finished product. Governance, identity, Firestore-backed domain state, Supabase Edge execution, bounded PayPal commerce, Seat/3D foundations, and browser verification are materially established. Higher-order provider execution, complete multi-tree spatial structure, full authenticated restoration, final connection topology, scheduler-backed turn execution, and C9/C10 acceptance remain bounded or incomplete.

## Authority model

```text
Product Law
  ↓
Masterplan
  ↓
Policy / ORUCAVEAM
  ↓
Skill Wiring + Skills
  ↓
Implementation
  ↓
Verification
  ↓
Evidence
  ↓
Handover / Endorsement
  ↓
Product Knowledge
```

Product Knowledge records learning from this chain. It does not become a second Product Law.

## Runtime model

```text
Human
  ↓
Public Entrance
  ↓
3D spatial machine
  ↕
Integration / Contracts
  ↕
Supabase Edge Functions
  ↕
Firebase Auth / Firestore
  ↕
External providers / workspaces
```

GitHub is source authority. Supabase is trusted Edge execution/webhook infrastructure. Firebase Auth and Firestore hold authoritative identity and durable application/domain state. Presentation must not impersonate these authorities.

## Major things already surpassed or settled

### Product surface

The historical Command Deck has been fully retired as a current product/deployment surface. `/spatial/` is no longer a current published route. Historical `frontend/spatial/**` source and records remain for reconstruction/evidence and are not current product authority. `/` is the canonical public Entrance and `/hero/` is compatibility.

### Public information boundary

The Entrance owns public-facing Hero entry, About TeamAi, the Complex Dictionary/User Guide, Privacy Policy, Terms and Conditions, Contact, Credits, and Footer. Public legal content is not dependent on entering the authenticated 3D machine.

### Guest/authentication transition

The target sequence is `Entrance → explicit 3D World → guest default rotating world → Login/Sign up transition → restored authorized state → 3D configuration/Settings → readiness → user-started turn → scheduler-backed contribution → evidence/workspace`.

Login and Sign up are guest transition controls, not authenticated Settings categories. Selecting them stops guest orbit, opens the currently-defined tree/branch/division presentation, centers the workspace, reaches the intended authentication framing, and shows the small auth UI beside the workspace. This describes the target product contract; the live frontend auth lifecycle is not yet complete/proven.

### Settings taxonomy

Authenticated Settings is a categorical world map, not a second semantic tree:

| Category | Purpose |
|---|---|
| Seats | User's authorized Seats and durable seat data |
| Tree 1–8 | Major semantic tree slots and their branches |
| Branches | Smaller branches/divisions belonging to the selected tree structure |
| Privacy Policy | Public legal content linked to Entrance |
| Terms | Public legal content linked to Entrance |
| Logout | End authenticated session |
| Return BTN | Return to public Entrance |

### Spatial semantic truth

The current Tree Census is **not a complete implementation census**. Current semantic families include `TREE-DOMAIN` (incomplete), `TREE-HERO-SEAT` (partial), and `TREE-SKILL-RESPONSIBILITY` (incomplete). Undefined trees/branches/divisions must not receive invented identities, geometry, backend ownership, or completion state.

Stable semantic identity precedes geometry:

`root truth → treeID / branchId → role/purpose → payload → expansion requirements → adjacency / connection topology → adaptive geometry → camera/travel → interaction → contribution route → verification`

Coordinates, mesh indices, ring slots, and camera docks are implementation details, not identity.

A branch is a real integration, not a decorative mesh. Its meaning includes purpose, payload, expansion footprint, adjacency clearance, connection ownership, camera relationship, accessibility/responsive behavior, and verification state.

Trees and branches may differ in width, height, depth, recursion, density, and spatial footprint. No universal radius, fixed branch height, equal-depth template, or copied-coordinate architecture is permitted.

### Expansion / animation truth

The 3D Hero is an expandable technological machine. Expandable divisions follow a stateful lifecycle such as:

`CLOSED → PREPARING → OPENING → ACTIVE → CLOSING → CLOSED`

Instant visibility toggles and teleport-style expansion are not the final machine language. Expansion must reserve room for actual content, adjacent divisions, camera travel, wiring corridors, and readability.

Existing prototype camera paths, coordinates, timing, ambient effects, transitions, and other visual behavior are replaceable baselines. They must never constrain the future adaptive tree/branch/division machine or semantic electrical topology.

Retired camera concepts `HERO_LOW_ORBIT` and `TURN_FOLLOW` must not return under alternate names.

### Electrical / turn-loop model

The final turn-loop is not a decorative effect. Participating divisions must be active/open so real connection corridors exist. Electricity must follow actual semantic graph edges through participating trees/branches/divisions toward the workspace center. Visual electricity cannot be used to fabricate missing topology.

### Backend baseline

The connected Supabase runtime currently has exactly eight ACTIVE TeamAi Edge Functions:

1. `teamai-commerce-intent`
2. `teamai-domain-bootstrap`
3. `teamai-github-oauth-bind`
4. `teamai-github-webhook`
5. `teamai-paypal-webhook-v5c`
6. `teamai-seat-connection-test`
7. `teamai-seat-provider-bind`
8. `teamai-task-execute`

The legacy `paypal-webhook` deployment has been removed. Historical nine-function snapshots are historical evidence only. `teamai-task-execute` remains bounded by `stub-edge-runtime`; real external provider execution is not inferred.

The lease-preservation work established a general rule: a partial operation must overlay only fields it owns while preserving unrelated typed durable Firestore fields.

### Evidence discipline

The validated evidence ladder is:

`source/static → CI → Playwright → deployed-browser observation → external-provider evidence where applicable → owner/product acceptance`

Playwright is deterministic browser proof. Opera can supply deployed-human observation such as accessibility structure, navigation, screenshots, and actual published-surface inspection. Neither tool changes the underlying authority model.

Green CI proves only the checks it executed. It does not automatically prove persistence, authorization, payment, scheduler eligibility, external provider behavior, product completion, or owner acceptance.

### Issue/comment discipline

Issue bodies are the durable issue-specific guide. New comments are evidence records only: diagnosis, real observed data, warnings/discrepancies, and executed slices. Comments are not a second checklist or roadmap. `EXECUTED` does not mean `PROVEN`.

Historical comments can remain as provenance. Their durable requirements must live in the Issue body or canonical documentation rather than being treated as active authority.

### Governance lessons

Fail-closed governance is intentional. Implementation-root changes require applicable active-index reconciliation. A stale branch can be technically correct yet invalid as a current-state change if it is based on an older `main` or stale indexes.

The correct recovery path is:

`current main → active Issue/PR → changed roots → governance coupling → implementation → CI → browser/runtime evidence → merge → knowledge promotion`

Never weaken a validator to manufacture green CI. When a requirement changes, update the canonical contract/authority and its validator through the governed path.

### Knowledge continuity

`latest AI output ≠ latest authority`.

Separated AI applications require an authorized context packet containing relevant authority, current purpose/state, durable state, workspace state, decisions, restrictions, evidence, and handover information. Provider separation must not become project-knowledge fragmentation.

## Current completion vocabulary

Use:

`PLANNED → IMPLEMENTED → VERIFIED → RUNTIME-PROVEN → COMPLETED → ENDORSED`

Do not collapse these states. A capability can be implemented without being proven at runtime, and runtime proof can remain bounded without establishing product completion.

## Recovery summary for a new agent

A new agent should not start from the latest conversational answer. It should first establish the canonical authority chain and current repository truth, then inspect the active Issue/PR and relevant census/contracts before changing code.

For spatial work, begin from semantic tree/branch/division truth and build outward. For backend work, establish identity, durable state, authorization, execution boundary, live deployment state, and evidence boundary. For either track, keep historical material distinct from current authority.

The project's central lesson is that TeamAi is moving away from isolated feature slices and toward a traceable machine in which product meaning, semantic identities, geometry, animation, camera behavior, backend authority, deployment state, evidence, history, and learning remain connected without one layer impersonating another.
