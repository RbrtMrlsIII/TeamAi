# TeamAi — Web AI Seat Stack

## Purpose

The 3D Hero represents each Web AI Seat as an equipped physical stack. The stack is a presentation model for independently configured Seats; it is not a second authority or execution system.

## Canonical stack vocabulary

```text
Seat
├─ Connection
│  └─ external AI application/provider account or supported integration
├─ Behavior
│  ├─ Do
│  └─ Don't
├─ Built-in Toolkit
├─ Optional ZipSkills
├─ Capabilities
│  └─ tools / MCP availability
├─ Authorization
│  └─ scope / approvals
├─ Workspace
│  └─ shared ref / state
└─ Task / Evidence
   ├─ task state
   └─ verification / evidence
```

Connection deliberately stays provider/integration-dependent. The Hero must not assert whether the real connection is a login, API key, OAuth grant, MCP connection, or another mechanism until the product integration defines it.

Uploading files is not the primary Seat onboarding/configuration model. ZipSkills is a product concept for an optional skill package; the Hero represents it as an equipped layer rather than teaching users that an upload is required.

## Concept boundaries

`skill != capability != authorization`.

A skill describes behavior or reusable know-how. A capability describes what the Seat may technically access or invoke. Authorization describes what the product permits within the current scope. The Hero may visualize these as adjacent mechanisms, but it must not collapse them into one permission switch.

`connection != seat`.

The external application/provider account is not the Seat itself. A Seat is a product-level role/configuration boundary that references an external runtime through supported integration.

`seat != workspace`.

The Seat contributes to the shared Web AI workspace, but the workspace is not the Seat and is not TeamAi itself.

## Inspection ladder

The intended camera path is:

```text
wide orientation
  → Seat
  → Connection / Behavior / Skills
  → Capabilities
  → Authorization / Scope
  → Workspace / Task / Evidence
  → normal application UI
```

Deeper inspection must become more concrete and product-semantic. Once the user needs dense reading, editing, multi-field configuration, permission comparison, evidence review, approvals, or keyboard-first precision, the experience hands off to normal UI instead of extending the machinery metaphor.

## Presentation contract

Seat stack interaction may:

- change visual focus,
- select a semantic inspection layer,
- move to an existing presentation camera,
- emit a presentation-only event requesting a normal-UI configuration section.

Seat stack interaction may not:

- grant authorization,
- change backend truth,
- invoke an external provider,
- alter the scheduler,
- imply provider-to-provider communication,
- treat the latest AI output as authority.

## Suggested names for future mechanisms

Use physical terms only when the metaphor maps to a real product concept:

- **Mount** — where a module is seated.
- **Collar** — boundary/state ring around a mechanism.
- **Dial** — bounded configuration choice with a meaningful set of states.
- **Aperture** — constrained visibility into a capability or scope.
- **Latch** — explicit handoff/approval boundary.
- **Rail** — persistent trace/provenance path.
- **Tray** — artifact/evidence collection surface.
- **Register** — compact state summary.
- **Profile** — responsibility and operating behavior bundle.
- **Resolver** — mechanism that determines an applicable skill/capability set from durable product state.
- **Eligibility gate** — scheduler/coordination concept; keep its authority outside the Hero.

The physical vocabulary should remain subordinate to Product Law terminology. When naming a new part, prefer the real product concept first and the mechanical metaphor second.
