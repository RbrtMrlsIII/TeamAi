# TEAM-EXPERIENCE-029 — Planning Composition

**Status:** IMPLEMENTATION SLICE / PRESENTATION ONLY

## Purpose

The Planning composition is the full deliberation surface when the Command Deck E3 stage is not enough.

Primary action: instruct; review the designated summarizer handoff.

## Product-law constraints

- Same persistent F0/F1/F2 skeleton and same theme-root token families as the other 029 compositions.
- Planning is an E3 product stage, not a second theme and not a separate visual system.
- Transcript is a panel/inset field: shared conversation, current speaker, and human messages remain distinct.
- Current user instruction remains visibly pinned in the E3 active panel.
- Turn plan exposes seat order, turns-per-AI, designated summarizer, and exactly one document-author path.
- Handoff exposes decisions, rationale, alternatives, unresolved items, and the shared `APPROVE / EDIT / MORE / REJECT` review language.
- Previous AI replies are contributions, not authority.
- Scheduler owns turn sequencing; the UI does not select the next AI.
- User review remains the gate. This visual does not durably mutate domain state.
- The existing shared F7 E4 plate remains the only modal surface; no new dialog system or cluster is introduced.
- Compact mode keeps E3 reachable, compresses/parks E2 rails, uses compact navigation, and has no horizontal document overflow.
- No Firestore writes, provider calls, scheduler decisions, entitlement changes, PayPal activity, or action execution occur in this presentation slice.

## Composition map

| Region | Primitive | Elevation | Must be seen |
|---|---|---:|---|
| Transcript | Panel | E2 | Shared conversation, current speaker, human messages distinct |
| Pinned instruction | Panel | E3 | Current user instruction stays visible while AIs deliberate |
| Turn plan | Panel | E2 | Seat order, turns-per-AI, designated summarizer, one document-author path |
| Handoff review | Active/Modal | E3/E4 | Decisions, rationale, alternatives, unresolved, shared review actions |

## Script boundary

Only presentation state is allowed: navigation, selected turn display, editable instruction preview, and shared F7 mounting. The script must never choose scheduler actors, persist planning truth, or execute a handoff.
