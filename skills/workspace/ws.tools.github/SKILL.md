# WORKSPACE_SKILL — ws.tools.github

**Kind:** `WORKSPACE_SKILLS` · `ws.tools.github`  
**Status:** OPERATING PROCEDURE / NOT PRODUCT LAW

## WHEN TO USE

Use when configuring or invoking **GitHub** as a TeamAi tool/connection for a project.

## INPUT

- User OAuth / connection status inside TeamAi
- Project and seat scope (repos, paths, operations)
- Tool Quality entitlement if applicable
- Approval rules for write operations

## AUTHORITY

GitHub is **engineering/source authority** for the repo; TeamAi owns participation, policy, and tool gateway.  
This skill does not create OAuth tokens or grant merge rights.

## ACTION

1. User prepares repo **outside** TeamAi when needed.
2. User authorizes GitHub **inside** TeamAi (OAuth / connection).
3. Equip seat with connection + scope; run capability/health checks.
4. Invocation path: `Seat → tool intent → policy → scoped GitHub connection → result → event`.
5. Read vs write operations remain distinct permissions.
6. Report tool outcomes back to TeamChat; keep credentials out of model context.

## DO NOT

- Do not paste PATs into TeamChat as the connection mechanism.
- Do not treat provider API key as GitHub access.
- Do not treat “connected” UI as fully usable without scope + health + seat-allowed.
- Do not use GitHub Actions as the Web AI runtime scheduler.

## PASS

Connection and seat scope are explicit; tool calls are attributable; results returned without secret leakage.

## SEE ALSO

- `PRODUCT_LAW.md` Family B (GitHub role)
- `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`
