# TeamAi — Connected Platform Authority Companion

**Status:** CANONICAL PRODUCT-LAW FIELD COMPANION
**Parent authority:** `Product_Law/PRODUCT_LAW.md`

This document gives the operational definitions behind the connected-platform authorities named by Product Law. It is subordinate field material, does not create a new authority layer, and MUST NOT override `Product_Law/PRODUCT_LAW.md`.

## Platform map

| Platform / surface | TeamAi usage | Authority / evidence boundary |
|---|---|---|
| Firebase Authentication | User sign-in and authenticated Firebase UID establishment. | Identity authority only. |
| Cloud Firestore `(default)` | Durable TeamAi application/domain state, including accounts, workplaces, projects, teams/Seats, tasks, and events. | Durable TeamAi state authority. |
| Firebase Hosting | Delivery of the current TeamAi web application. | Current web delivery/hosting authority. |
| Supabase Edge Functions | Trusted server execution, including protected TeamAi operations and the PayPal webhook receiver. | Trusted execution authority; not domain-state authority. |
| Supabase Postgres | Supabase platform infrastructure where required. | Infrastructure only; never TeamAi domain/application state. |
| PayPal | External payment events used by TeamAi's server-owned commerce correlation and entitlement projection. | External payment-event authority; TeamAi retains its correlation/projection rules. |
| GitHub | Source repository, commits, pull requests, issues, reviews, and engineering history. | Engineering/source/change authority. |
| GitHub Actions | Run CI validation, authority audits, tests, recovery checks, and other repository automation. | Verification/execution surface for engineering workflows; it does not replace GitHub source authority or TeamAi runtime authority. |
| Founder Pulse | Read-only observation of Issue flow and delivery patterns for product-operations visibility. | Observation/management layer only; no mutation or authorization authority. |
| External AI applications/providers | Models/runtimes that participate in the Web AI Team through authorized connections and Seats. | Provider ownership remains external; TeamAi owns its connection, policy, Seat, orchestration, and durable-state boundary. |
| MCP/tools/plugins/integrations | Bounded capabilities exposed to authorized Web AI Seats. | Capability/integration surface only. |
| Universal ToolKit | Upstream knowledge/process repository receiving validated generalized lessons. | Upstream knowledge surface only; never TeamAi state or authority. |

## GitHub Actions distinction

GitHub source/review state and GitHub Actions execution state are related but distinct:

`GitHub repository / commit / PR → GitHub Actions workflow → CI execution/result → engineering evidence`

A green GitHub Actions run proves only the checks actually executed by that workflow. It does not prove Firebase runtime behavior, PayPal live behavior, or deployment success unless those exact checks were explicitly exercised and their evidence is recorded.

GitHub Actions MUST NOT be treated as a general orchestration authority for the Web AI Team. Product/runtime orchestration remains owned by TeamAi's scheduler and trusted execution boundaries.

## Firestore usage and resilience consequence

Cloud Firestore `(default)` remains the canonical durable TeamAi domain/application store. TeamAi should reduce unnecessary Firestore usage rather than replace Firestore authority: targeted reads, bounded queries, cursor pagination, safe client caching/offline persistence, selective realtime listeners, aggregation/summary patterns, idempotent writes, and external artifact storage with Firestore metadata/reference are preferred optimization mechanisms. Any alternate durable domain store requires explicit Product Law/architecture reconciliation.

## TeamAi policy consequence

Browser verification is invoked through the supported browser tooling or local/static serving path when web development or verification requires it. Deployment behavior remains explicit and provider-specific rather than being assumed from a repository event.

A browser integrity run is verification evidence. It does not become Product Law, backend proof, commerce proof, or TeamAi delivery authority.

## Founder Pulse consequence

Founder Pulse can observe the GitHub Issue flow that surrounds this work. It does not initiate deployments or runtime activity. A Pulse report can identify delivery friction or repeated verification churn as an operational observation; the TeamAi Development Team must reconcile that observation against Product Law and the canonical verification policy before making any change.

GitLab support in Founder Pulse is capability of the observation skill, not adoption of GitLab as a TeamAi architecture/control-plane dependency.

## Authority rule

Every connected platform MUST have an explicit role, explicit evidence boundary, and explicit non-authority boundary. Adding a new platform or expanding a platform's responsibility requires Product Law/architecture reconciliation before implementation.
