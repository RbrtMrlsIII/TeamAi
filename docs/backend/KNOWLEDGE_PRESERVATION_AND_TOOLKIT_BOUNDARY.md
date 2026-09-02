# Knowledge Preservation & ToolKit Boundary

## Purpose

Prevent loss of backend decisions at chat/session boundaries while keeping TeamAi-specific product knowledge separate from the universal ToolKit.

## TeamAi → ToolKit only

`TeamAi finding → evidence → validation → generalization → ToolKit`

Only lessons that remain useful across unrelated project types/fields may be promoted upstream. Product Law, schemas, credentials, product pricing, PayPal identifiers, provider choices, and TeamAi-specific UX remain in TeamAi.

## No automatic downstream flow

ToolKit knowledge does not automatically change TeamAi. A consuming project must explicitly review and adopt any universal skill/pattern through its own Product Law, Policy, and endorsement discipline.

## Current lesson candidate

A technology can be correctly labeled as retired or legacy and still be dangerous when repository structure keeps its implementation path easy to rediscover. The generalized mitigation is to make retired paths absent from active code, dependency/configuration surfaces, and agent-facing implementation guidance, with automated detection where practical.

## Required evidence

A lesson remains a TeamAi finding until it is validated and generalized. Never put an unvalidated assumption into ToolKit permanent knowledge.
