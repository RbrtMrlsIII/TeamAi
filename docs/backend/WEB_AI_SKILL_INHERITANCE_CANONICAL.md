# Web AI Skill Inheritance & Domain Wiring Canonical

## Purpose

A Web AI seat must receive the skills applicable to the work it is actually performing. A generic agent prompt is not sufficient for domain-specific work.

## Effective skill set

`base Web AI skills + project type + field/domain + task + provider/service/runtime + tools/plugins + project guidance + permissions/policy`

Load the smallest sufficient bundle. Skills describe how to work; they never grant authorization.

## Frontend example

A Web AI seat assigned frontend work inherits relevant route/state/navigation, component, interaction, accessibility, responsive, motion/spatial, QA, and implementation-honesty skills as applicable to the task.

## Backend example

A Web AI seat assigned backend work inherits relevant identity, Firestore, Edge Function, webhook, commerce, task/event, security, observability, recovery, and provider-compliance skills.

## Fast switching

The Universal AGENT ToolKit classifies skills by field and project type. TeamAi adds project-specific skill bundles when a canonical product requirement needs them. The consuming project remains authoritative for its own Product Law and implementation constraints.

## Development AI separation

Development AI build/engineering skills remain separate from Web AI user-facing skills. A Web AI seat must not gain repository-write or deployment authority merely because its assigned task concerns software.

## Implementation status

Planning contract only. Effective-skill resolution, loading, authorization binding, and verification are part of TEAM-BACKEND-001.
