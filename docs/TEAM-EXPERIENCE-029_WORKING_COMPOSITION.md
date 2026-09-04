# TEAM-EXPERIENCE-029 — Working Composition

## Purpose
Working is the execution-side composition after a reviewed Planning handoff. It presents execution state and scheduler evidence without becoming an execution authority.

## Visible regions
- Approved handoff context: decisions, rationale, unresolved review items.
- Task/dependency chain: ordered tasks, dependency, readiness, eligibility.
- Current task: task identity, assigned seat, capability gate, connection and entitlement facts as display-only state.
- Scheduler evidence: why this task is eligible and that next-actor/task selection remains Scheduler-owned.
- Action proposal: intended tool/action, impact, approval state, and shared F7 action preview.
- Durable event/result/recovery: last event, result state, recovery state.

## Product-law boundary
This visual must not select the next actor, invoke providers or tools, mutate entitlements, execute an action, write Firestore, charge PayPal, or create durable events. It presents authoritative execution state owned elsewhere. The shared F7 plate remains the only E4 surface.

## Compact behavior
E4 remains reachable when open; E3 remains reachable; E2 rails compress/park; navigation becomes the compact menu; no horizontal document overflow; hover is never the only interaction path.
