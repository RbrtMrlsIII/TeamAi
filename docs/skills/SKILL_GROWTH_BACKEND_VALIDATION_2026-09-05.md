# TeamAi Skill Growth Note — Backend Validation

**Date:** 2026-09-05  
**Scope:** TeamAi-specific learning promoted from repeated backend-validator and runtime-gate execution.

## Learned procedure

Separate backend-owned execution facts into three explicit layers:

`backend-owned fact contract → frontend read-only validation/presentation → backend runtime gate`

The frontend layer may validate structural consistency and present the result, but it must not become an execution authority. The backend layer remains responsible for approval, connection, project/provider scope, capability, durable task events, idempotency, and provider invocation.

## Evidence path

- PR #46 established the typed frontend backend-fact validator and deterministic unit coverage.
- PR #47 bound that validator to a spatial-compatible UI contract with deterministic browser coverage.
- PR #49 establishes the backend runtime validation gate against the existing TaskExecutionService + ProviderRuntime boundary.

## Skill routing

Primary procedure: `skills/execution/orucaveam/SKILL.md`  
Frontend spatial procedure: `skills/frontend/spatial/UI_UX-Promax-Skill.md`  
Learning/handover procedure: `skills/governance/learning-handover/SKILL.md`  
Backend runtime verification: TEAM-BACKEND-001 execution/verification procedures.

## Boundary learned

A validator is not an authorization gate. A UI contract can consume backend-owned facts without owning them. Passing deterministic runtime tests does not prove live external-service completion.

## Status

**LEARNED / TEAMAI-SPECIFIC** — retained for current execution; not a ToolKit-generalized rule.
