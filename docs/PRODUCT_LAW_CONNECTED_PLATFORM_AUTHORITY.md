# TeamAi — Connected Platform Authority Companion

**Status:** CANONICAL PRODUCT-LAW COMPANION
**Parent authority:** `PRODUCT_LAW.md`

This document gives the operational definitions behind the connected-platform authorities named by Product Law. It does not create a new authority layer and MUST NOT override `PRODUCT_LAW.md`.

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
| Vercel | Controlled browser rendering and interaction verification for active UI development. | Non-authoritative UI/browser verification surface only. |
| Founder Pulse | Read-only observation of Issue flow and delivery patterns for product-operations visibility. | Observation/management layer only; no mutation or authorization authority. |
| External AI applications/providers | Models/runtimes that participate in the Web AI Team through authorized connections and Seats. | Provider ownership remains external; TeamAi owns its connection, policy, Seat, orchestration, and durable-state boundary. |
| MCP/tools/plugins/integrations | Bounded capabilities exposed to authorized Web AI Seats. | Capability/integration surface only. |
| Universal ToolKit | Upstream knowledge/process repository receiving validated generalized lessons. | Upstream knowledge surface only; never TeamAi state or authority. |

## Deployment-to-Vercel relationship

A Git commit or pull request is first a GitHub engineering/review event. It causes Vercel deployment activity only when an applicable Vercel deployment mechanism is configured and enabled, such as a connected Vercel Project with Git integration, a deployment hook, or an explicit Vercel deployment command/API call.

With Vercel Git integration, repository events can automatically create preview or production-related deployments according to the Vercel Project's branch/environment configuration. Vercel records the Git metadata associated with the resulting deployment, including the triggering commit SHA/ref and, where applicable, the pull-request identifier.

Therefore the causal model is:

`commit/push → Git repository event → configured Vercel trigger → Vercel build/deployment → controlled preview/deployment surface → browser verification`

and not:

`commit → Vercel automatically`

or

`pull request → Vercel automatically`.

The repository event alone has no TeamAi authority over Vercel. A Vercel Project and its configuration are the external control points that determine whether the event consumes Vercel deployment activity.

## GitHub Actions distinction

GitHub source/review state and GitHub Actions execution state are related but distinct:

`GitHub repository / commit / PR → GitHub Actions workflow → CI execution/result → engineering evidence`

A green GitHub Actions run proves only the checks actually executed by that workflow. It does not prove Vercel browser behavior, Firebase runtime behavior, PayPal live behavior, or deployment success unless those exact checks were explicitly exercised and their evidence is recorded.

GitHub Actions MUST NOT be treated as a general orchestration authority for the Web AI Team. Product/runtime orchestration remains owned by TeamAi's scheduler and trusted execution boundaries.

## Firestore usage and resilience consequence

Cloud Firestore `(default)` remains the canonical durable TeamAi domain/application store. Firebase's current no-cost Standard-edition allowance is 50,000 document reads/day, 20,000 document writes/day, 20,000 document deletes/day, 1 GiB stored data, and 10 GiB/month outbound transfer. Spark provides the no-cost quota but not pay-as-you-go overage; current Firebase documentation says exceeding Spark quota for a product can shut that product off for the remainder of the applicable billing period. Quota is project-level.

TeamAi should reduce unnecessary Firestore usage rather than replace Firestore authority: targeted reads, bounded queries, cursor pagination, safe client caching/offline persistence, selective realtime listeners, aggregation/summary patterns, idempotent writes, and external artifact storage with Firestore metadata/reference are preferred optimization mechanisms. Any alternate durable domain store requires explicit Product Law/architecture reconciliation. See `docs/FIRESTORE_USAGE_AND_RESILIENCE_POLICY.md`.

## TeamAi policy consequence

For TeamAi, automatic Vercel deployment behavior is intentionally outside the default engineering path. Browser verification is invoked only when UI development/verification requires it. A non-UI commit or pull request must not be treated as a justification for preview creation.

A Vercel deployment is an environment artifact. A browser integrity run is verification evidence. Neither becomes Product Law, backend proof, commerce proof, or TeamAi delivery authority.

## Founder Pulse consequence

Founder Pulse can observe the GitHub Issue flow that surrounds this work, but it does not initiate Vercel activity. A Pulse report can identify delivery friction or repeated preview-related churn as an operational observation; the TeamAi Development Team must reconcile that observation against Product Law and the canonical Vercel policy before making any change.

GitLab support in Founder Pulse is capability of the observation skill, not adoption of GitLab as a TeamAi architecture/control-plane dependency.

## Authority rule

Every connected platform MUST have an explicit role, explicit evidence boundary, and explicit non-authority boundary. Adding a new platform or expanding a platform's responsibility requires Product Law/architecture reconciliation before implementation.
