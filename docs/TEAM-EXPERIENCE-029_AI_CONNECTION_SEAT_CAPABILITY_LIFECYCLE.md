# TEAM-EXPERIENCE-029 — AI Connection, Seat & Capability Lifecycle

**Status:** `PLANNING ARCHITECTURE — NOT IMPLEMENTATION AUTHORITY`
**Date:** 2026-09-03

## Purpose

This contract defines the vocabulary and lifecycle TeamAi should use when an externally operated AI application becomes a participant in a Workplace/Project Team.

It exists to prevent several different concepts from being collapsed into one field or UI control:

`application ≠ provider ≠ service/runtime ≠ model ≠ connection ≠ seat ≠ skill ≠ tool/MCP ≠ workstation ≠ entitlement ≠ authorization`

It does not decide provider-specific OAuth mechanics, exact model catalogs, pricing, or final subscription packaging.

## 1. Canonical lifecycle

The intended lifecycle is:

`Discover → External Setup → Import/Authorize → Capability Test → Bind → Equip → Activate → Run → Observe → Degrade/Suspend → Recover/Revalidate → Rebind/Retire`

A connection is not usable merely because it exists.

A seat is not active merely because it is configured.

A tool is not usable merely because it is installed.

## 2. Connection versus Seat

### Connection

A **Connection** represents an externally authorized relationship between TeamAi and a provider/application/runtime.

It answers:

> "Can TeamAi legitimately communicate with this external capability under the current authorization and provider rules?"

A Connection may carry:

- provider/application identity;
- service/runtime identity;
- external account or tenant reference where appropriate;
- authorization state;
- scopes granted externally;
- token/credential reference held outside ordinary AI context;
- provider compatibility profile;
- last capability-test result;
- connection health;
- suspension/revalidation state.

### AI Seat

An **AI Seat** is the configured participation identity inside a TeamAi Workplace/Project.

It answers:

> "Which configured AI participant is allowed to act here, in what role, with which capabilities and boundaries?"

A Seat references a Connection where external execution is involved, but the Seat is not the Connection itself.

Multiple Seats may reference the same external model or even the same eligible Connection when the provider/runtime and TeamAi policy permit it. Seat identity remains distinct because role, skills, scopes, workstation, budget, context visibility, and tool permissions may differ.

## 3. Capability profile

Each Seat should have an explicit capability profile with separate dimensions:

| Dimension | Meaning |
|---|---|
| Provider | Who operates the external AI capability |
| Application | The external AI application/product where relevant |
| Service/Runtime | Execution surface/API/runtime used by the connection |
| Model/Variant | Exact model/version selected where applicable |
| Team Role | Discussion, summarizer, worker, reviewer, leader, etc. |
| Team Quality | TeamAi product-level AI quality/capacity allocation |
| Skills | Reusable behavioral/domain skill bundle |
| Base Capabilities | Core TeamAi functions available to the seat |
| Tool Quality | Optional integrations, plugins, MCP servers, specialist capabilities |
| Workstation | Bound machine/workspace/repository/path where required |
| Scope | Project/repository/data/resource boundary |
| Permission | Actions the seat may perform |
| Approval | Human approval requirements |
| Limits | Budget, rate, storage, context, runtime or concurrency constraints |
| Compliance | Provider/service compatibility and policy state |
| Health | Connection/capability-test/availability condition |

No single "model" or "plugin" field should be used as a substitute for this profile.

## 4. Capability states

TeamAi should distinguish capability states explicitly:

`available → configured → TeamAi-entitled → provider-compatible → authorized → project-scoped → seat-allowed → healthy → usable`

A failed state should preserve the reason and the recovery action where known.

Examples:

- **Available but not configured:** the service can be used in principle but no valid connection exists.
- **Configured but not entitled:** the user's current TeamAi commercial state does not include that Tool Quality capability.
- **Entitled but not authorized:** TeamAi has commercial entitlement but the external provider has not granted required access.
- **Authorized but not project-scoped:** the capability exists but has not been attached to this Workplace/Project.
- **Seat-allowed but unhealthy:** configuration is valid but the connection/test is currently failing.

The UI must not imply "usable" from an earlier state.

## 5. External setup versus TeamAi activation

Some steps belong outside TeamAi and remain provider-owned:

`provider account → provider authentication → provider application/runtime setup → provider-side terms/scopes`

TeamAi then owns the coordination and policy boundary:

`authorized connection → capability test → Workplace/Project binding → Seat configuration → entitlement/policy evaluation → activation`

TeamAi must never claim to have completed provider-side setup when the provider still owns that step.

## 6. Equip phase

**Equip** is the point where a valid Seat receives its TeamAi capabilities.

Equip may attach:

- skills;
- Base TeamAi capabilities;
- Tool Quality packs;
- MCP/plugin connections;
- workstation/repository/path scope;
- context visibility rules;
- action permissions;
- approval policies;
- resource limits.

Equip must not grant a capability merely because an AI requested it.

The authoritative chain is:

`user/project policy → TeamAi entitlement → provider/service compatibility → explicit authorization → Seat allowance`

## 7. Activation gate

A Seat becomes **Active** only after all mandatory conditions for its configured role are satisfied.

Minimum conceptual activation test:

`identity/context valid + connection valid + capability compatible + entitlement valid + authorization valid + project scope valid + seat permissions valid + required workstation valid + required health check passed`

Activation is a state transition, not merely a UI toggle.

## 8. Planning Team behavior

During Planning Team operation:

- the user determines participating Seats and turn policy;
- the Scheduler determines speaker order;
- each Seat receives an authorized minimal context packet;
- a Seat may provide advisory analysis without receiving document mutation authority;
- exactly one selected document-authoring path should receive canonical planning-write authority for a given approved change;
- the selected Summarizer converts the discussion to a structured handoff;
- user review controls whether the planning result advances.

The most recent AI response is never a replacement for the current authoritative user instruction.

## 9. Working Team behavior

During Working Team operation:

`approved handoff → task/dependency eligibility → Scheduler selection → Seat/tool execution → durable result/event → downstream eligibility → review/recovery`

A Worker Seat may request a tool, but the tool is granted and invoked through policy.

A previous AI may recommend another task or worker; it does not directly invoke another provider outside the orchestrator.

## 10. Tool and MCP boundary

The Base TeamAi Capability Set is a product-level capability definition, not a requirement that each item be exposed through MCP.

MCP/plugin/tool integrations are Tool Quality extensions unless a later architecture decision explicitly makes a capability core and records the change.

Canonical tool execution:

`Seat → tool intent → TeamAi policy/authorization → scoped connection/plugin/MCP → invocation → result/artifact → durable event`

The AI receives a capability surface, not raw credentials.

The 2026-07-28 MCP specification is now the current published specification and includes a stateless core, formal extensions/Tasks, authorization hardening, and a deprecation policy. TeamAi therefore should version/profile its MCP compatibility rather than assuming a timeless protocol shape. citeturn946136search0

## 11. Runtime health and degradation

A configured Seat must survive external capability changes without silently becoming authoritative or silently failing.

Relevant health states may include:

`healthy | degraded | unauthorized | entitlement_missing | provider_unavailable | incompatible | workstation_missing | scope_invalid | suspended | retired`

When health drops:

1. mark the affected capability/Seat state durably;
2. prevent actions that no longer satisfy policy;
3. preserve the reason and last known valid configuration;
4. identify whether user/provider/admin action is required;
5. allow revalidation before returning to Active.

A degraded connection must not be treated as healthy because the UI still remembers its old configuration.

## 12. Recovery / revalidation

Recovery should be explicit and reproducible:

`failure/degradation → durable state → diagnosis → remediation → capability test → authorization re-check → scope/permission re-check → activation`

A Seat should not jump directly from Failed to Active without the required revalidation steps.

Historical execution results remain evidence, not permission.

## 13. Retirement

Retirement removes a Seat or Connection from future execution eligibility while preserving necessary durable history and audit references.

Retirement must not silently delete the historical task/event evidence needed to explain what previously happened.

Retired provider/runtime/model/tool combinations must not remain presented as easy active choices unless explicitly marked as historical/inactive and protected by re-entry policy.

## 14. Startup packages and skill distribution

A TeamAi startup ZIP, guide bundle, or curated skill package may accelerate external setup and Seat configuration.

Such packages are distribution aids, not authority.

They must not silently:

- create provider entitlements;
- bypass provider authentication;
- grant project permissions;
- replace Firebase UID ownership;
- turn an optional Tool Quality capability into an always-authorized tool;
- override Product Law or current project policy.

## 15. UI implication

The configuration experience should make the lifecycle visible enough that a user can tell:

- what they own from TeamAi;
- what belongs to the external provider;
- what has been connected;
- what has been tested;
- what capabilities are available;
- what is TeamAi-entitled;
- what is authorized;
- what is project-scoped;
- what is actually usable;
- why something is blocked;
- what action will recover it.

A single green "connected" badge is insufficient when downstream capability states differ.

## 16. Completion boundary

This contract is complete only when implementation evidence can show that the actual system preserves the distinctions defined above. This document itself is not evidence of runtime implementation.

## 17. Relationship to canonical authority

`PRODUCT_LAW.md` remains authoritative. This contract refines the 029 planning vocabulary and must not override Product Law, backend authority, provider terms, or the user's decisions.

Related contract:
`docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md`
