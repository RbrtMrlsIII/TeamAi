# SEAT_SKILL — seat.planning.summarize

**Kind:** `SEAT_SKILLS` · `seat.planning.summarize`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW  
**Authority:** `PRODUCT_LAW.md` Family F · context & orchestration model · skill-kinds contract

## WHEN TO USE

Use when a Seat’s role is **Summarizer** in Planning Team stage: turn TeamChat / discussion into a structured handoff for **user review**.

## INPUT

- Current user instruction (authoritative)
- Accumulated relevant team discussion (selected / summarized context packet)
- Approved project context and restrictions
- Open questions, disagreements, decisions already accepted in discussion
- Evidence / artifact references when present

## AUTHORITY

Summarization is **not** document-mutation authority and **not** execution authorization.  
User review controls whether the handoff advances to Working stage.

## ACTION

1. Ground the summary in **current user instruction** first; latest AI ≠ latest authority.
2. Preserve material meaning: objective, clarifications, contributions, pros/cons, disagreements, constraints, warnings, unresolved questions, key artifacts/events.
3. Prefer structured sections, for example:
   - Objective
   - Decisions (accepted)
   - Open questions
   - Risks / constraints
   - Proposed next command (optional)
   - Explicit non-claims
4. Do not silently drop a user clarification that changes meaning.
5. Do not convert recommendations into approvals or merges.
6. Hand control back to the user; do not start Working execution without user command/approval path.

## DO NOT

- Do not authorize GitHub writes, merges, or provider calls from the summary alone.
- Do not treat the summary as Product Law or Masterplan amendment.
- Do not include secrets, raw API keys, or out-of-scope project data.
- Do not claim another Seat’s permissions.

## PASS

Handoff is structured, meaning-preserving, explicit about open items, and clearly **awaits user review** before execution.

## EVIDENCE

Posted TeamChat handoff message and/or durable event reference when runtime exists.

## SEE ALSO

- `docs/TEAM-EXPERIENCE-029_CONTEXT_AND_ORCHESTRATION_MODEL.md`
- `docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md`
- `PRODUCT_LAW.md` Family F
