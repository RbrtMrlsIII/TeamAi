# TeamAi 3D Hero — Web AI Seat Configuration Map

## Purpose

The spatial Hero acknowledges that every Web AI Seat is configurable, while keeping configuration authority in the normal TeamAi application UI.

The 3D layer presents configuration categories as a semantic inspection map; it does not grant, infer, or self-attest permissions.

## Seat configuration surface

A Seat inspection may reveal these Product Law categories:

1. **Responsibility Profile**
   - primary Field(s)
   - secondary Field(s)
   - coordination role
2. **Skills**
   - required skills
   - optional skills
   - skill versions / compatibility
3. **Capabilities**
   - available tools / MCP / integrations
   - capability recommendations
4. **Authorization**
   - permitted operations
   - prohibited operations
   - approval requirements
5. **Scope**
   - workspace
   - repository / branch / ref scope
   - project/task scope
6. **Connection & entitlement state**
   - connection health
   - external provider compatibility / entitlement state
7. **Execution context**
   - current task requirements
   - scheduler eligibility
   - escalation target
8. **Evidence & continuity**
   - verification state
   - durable results/events/artifacts
   - handover context

The effective responsibility relationship is:

`Seat + Field + Skills + Capabilities + Authorization + Connection/entitlement + Workspace/ref scope + Task requirements + Scheduler eligibility`

## Spatial inspection mapping

The Hero may use a bounded inspection sequence such as:

`Seat → profile collar → responsibility layer → skills/capability layer → authorization/scope layer → task/status layer → evidence layer → normal UI`

The visual machinery is explanatory only. A glowing lock, dial, gear, or ring never means that the user has been granted permission.

## Ordinary UI handoff

When the user needs to configure the Seat, the Hero should hand off to ordinary application UI containing semantic controls for the same categories:

- profile selectors;
- skill lists and version controls;
- capability/tool configuration;
- authorization and operation controls;
- workspace/repository/ref selectors;
- connection status and entitlement facts;
- task/evidence panels;
- approvals and review actions.

This UI must remain the authoritative interaction surface and follow normal accessibility, responsive, keyboard, and focus-management requirements.

## Resting and inspection behavior

At rest, the Seat remains in its authored spatial pose with tiny phase-shifted micro-motion. Inspection suppresses ambient drift, moves the camera through semantic anchors, reveals only concept-relevant layers, and settles before the normal-UI handoff.

The stage never becomes an endless free orbit.

## Product Law boundary

This map follows the Product Law separation between Field, Responsibility Profile, Skill, Capability, Authorization, Workspace, Task State, Scheduler Eligibility, Evidence, and Integration. Frontend/Experience owns presentation and interaction but must not invent backend truth, select scheduler actors, or become authorization/execution authority.
