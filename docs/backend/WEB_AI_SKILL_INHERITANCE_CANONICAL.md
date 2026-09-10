# Web AI Skill Inheritance & Domain Wiring Canonical

## Purpose

A Web AI seat must receive the skills applicable to the work it is actually performing. A generic agent prompt is not sufficient for domain-specific work.

## Effective skill set

`base Web AI skills + project type + field/domain + task + provider/service/runtime + tools/plugins + project guidance + permissions/policy`

Load the smallest sufficient bundle. Skills describe how to work; they never grant authorization.

## Seat and responsibility model

A WebAi seat is a responsibility boundary rather than a permanent pile of skills:

`responsibility boundary + applicable skill bundle + workspace governance + project adaptation + current Agent capacity`

Agent count is a resource-allocation variable. Fewer Agents may carry several responsibility units per Agent; more Agents may partition the same units without duplicating or redefining the underlying universal skills.

## Frontend example

A Web AI seat assigned frontend work inherits relevant route/state/navigation, component, interaction, accessibility, responsive, motion/spatial, QA, and implementation-honesty skills as applicable to the task.

## Backend example

A Web AI seat assigned backend work inherits relevant identity, Firestore, Edge Function, webhook, commerce, task/event, security, observability, recovery, and provider-compliance skills.

## Fast switching

The Universal AGENT ToolKit supplies reusable operating foundations and classifies skills by field and project type. TeamAi adds project-specific skill bundles when a canonical product requirement needs them. The consuming project remains authoritative for its own Product Law, implementation constraints, provider choices, domain rules, credentials, and authorization.

## Two-axis growth

ToolKit and TeamAi treat reusable capability as both technical and operational growth. Technical growth adds reusable skills, adapters, tools, and supported project/field types. Operational growth strengthens governance, continuity, evidence discipline, anti-pattern detection, reconciliation, responsibility allocation, and adaptation to project size and Agent count.

## Upstream / downstream boundary

`TeamAi finding → evidence → validation → generalization → ToolKit candidate`

TeamAi-specific knowledge is not copied upstream verbatim. ToolKit changes do not automatically flow back into TeamAi. Any downstream adoption must pass TeamAi Product Law, Policy, and endorsement discipline.

## Development AI separation

Development AI build/engineering skills remain separate from Web AI user-facing skills. A Web AI seat must not gain repository-write or deployment authority merely because its assigned task concerns software.

## Implementation status

Planning contract only. Effective-skill resolution, loading, authorization binding, and verification are part of TEAM-BACKEND-001.

## See also

- `docs/WEB_AI_SEAT_TOOLKIT_BOUNDARY.md`
- `docs/backend/KNOWLEDGE_PRESERVATION_AND_TOOLKIT_BOUNDARY.md`
- `docs/backend/TOOLKIT_BENCHMARK_AND_FEEDBACK.md`
