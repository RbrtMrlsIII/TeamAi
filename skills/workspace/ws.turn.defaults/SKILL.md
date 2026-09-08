# WORKSPACE_SKILL — ws.turn.defaults

**Kind:** `WORKSPACE_SKILLS` · `ws.turn.defaults`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW

## WHEN TO USE

Use when configuring Planning vs Working turn policy for a Workplace/Project (participants, turns per seat, summarizer cadence, pause rules).

## INPUT

- User preferences for the project
- Entitlement seat limit / orchestration capacity (when projection exists)
- Whether the phase is Planning or Working

## AUTHORITY

Turn defaults are **project preferences**, not Product Law. They cannot bypass authorization or human approval gates.

## ACTION

1. Record explicit defaults: participating seats, turns-per-seat, summarizer every N turns, require-approval-before-tools.
2. Planning: deliberation; one response at a time unless user configures otherwise.
3. Working: scheduler eligibility after approved handoff; no silent plan rewrite.
4. Prefer durable **summaries** over unbounded raw transcript for long sessions when persistence is on.
5. Ephemeral UI-only chat that never hits Firestore need not consume durable retention policy.

## DO NOT

- Do not treat turn order as authorization.
- Do not auto-start Working from a planning summary alone.
- Do not invent entitlement seat counts in the skill body (numbers live in packaging/projection).

## PASS

Turn policy is explicit, phase-aware, and respects user stop/pause.

## SEE ALSO

- `docs/TEAM-EXPERIENCE-029_ENTITLEMENT_AND_USAGE_LIMITS_ARCHITECTURE.md`
- `docs/TEAM-EXPERIENCE-029_CONTEXT_AND_ORCHESTRATION_MODEL.md`
