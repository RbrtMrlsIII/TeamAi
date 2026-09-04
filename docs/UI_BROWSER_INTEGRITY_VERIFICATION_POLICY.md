# TeamAi — Controlled Vercel Web Development & Browser Verification Policy

**Status:** CANONICAL OPERATING POLICY
**Scope:** TeamAi web development, preview, browser-level verification, and relevant end-to-end web flows
**Authority:** This policy refines execution procedure; it does not override `PRODUCT_LAW.md`, `MASTERPLAN.md`, or backend/domain authority.

## 1. Purpose

TeamAi may use Vercel as a controlled web-development and browser-verification surface without allowing Vercel to become a second hosting, backend, commerce, identity, durable-state, scheduler, or architecture authority.

Vercel is therefore a **non-authoritative web development / preview / browser-verification surface** for TeamAi.

Vercel is not restricted to UI-only work. It may support any TeamAi web-development flow where a preview or browser environment is useful, including frontend changes, UI-plus-backend integration flows, authenticated browser flows, commerce-facing web flows, responsive behavior, and end-to-end browser smoke tests. Evidence remains bounded to what was actually exercised.

## 2. Activation boundary

Vercel use is **deliberate and phase-bound to relevant web development or browser verification**.

A repository event does not, by itself, authorize a preview or browser run. The TeamAi Development Team should invoke Vercel when the current work actually benefits from a controlled web environment.

For a connected project with Vercel Git integration, a push/PR may still cause external automatic deployment activity according to the Vercel project's configuration. TeamAi must treat that as an external mechanism, not as an instruction to create more deployments or a guarantee that exactly one deployment will occur.

## 3. Allowed uses

Vercel may be used for:

- browser rendering and responsive-layout checks;
- UI interaction and navigation smoke tests;
- UI-plus-backend browser integration checks;
- authenticated web-flow verification where the required environment is available;
- commerce-facing browser-flow verification when the browser path is the thing being exercised;
- temporary/preview environment checks;
- end-to-end browser smoke tests;
- controlled development previews for active web work.

A browser result remains evidence only for the web behavior actually exercised.

## 4. Explicit non-authority

Vercel must not become authority for:

- TeamAi production hosting or delivery;
- Firebase Auth identity ownership;
- Firestore durable application/domain state or rules;
- Supabase Edge Function trusted execution;
- PayPal external payment events;
- TeamAi entitlement or external provider entitlement;
- scheduler/task/event authority;
- provider ownership or provider-side configuration;
- repository/source/change authority;
- engineering CI authority;
- final architecture acceptance;
- completion of a backend or commerce gate.

Firebase Hosting remains the current TeamAi web delivery authority. GitHub remains engineering/source authority.

## 5. Verification routing

| Work type | Vercel use |
|---|---|
| Web/UI-only | Allowed when useful and deliberately invoked |
| Web + backend integration | Allowed for the browser-exercised path; backend evidence remains separate |
| Authenticated web flow | Allowed when the required authorized environment exists; identity proof remains authoritative elsewhere |
| Commerce-facing web flow | Allowed for browser behavior; PayPal/backend proof remains separate |
| Backend-only | Do not invoke merely as backend proof |
| Firestore/rules/history-only | Do not invoke merely as persistence proof |
| Commerce backend-only | Do not invoke merely as payment/webhook proof |
| Documentation/governance-only | Do not invoke |
| Recovery/evidence-only | Do not invoke |

A mixed change may have GitHub/CI/backend evidence and Vercel browser evidence. Keep the evidence classes explicit and separate.

## 6. Anti-churn and deployment-count rule

Do not create or refresh previews merely because GitHub received a commit.

Do not assume:

`1 PR = 1 Vercel deployment`

or:

`1 merge = exactly 1 Vercel deployment`.

Actual deployment count depends on the currently configured external Vercel project, branch/environment rules, Git integration, hooks, and explicit deployment actions. Minimize pushes and consolidate coherent changes before browser verification so the project does not intentionally consume unnecessary deployment quota.

A deliberate 029 pattern is:

`bulk/coherent change → GitHub CI → available Vercel preview → one focused browser-verification session → review → merge`

The merge itself must not be treated as a request to manually create a second deployment unless a separate deployment action is deliberately required and authorized.

Vercel throttling or temporary unavailability is a verification limitation, not a TeamAi architecture failure.

## 7. Project-control rule

A Vercel project, team, deployment target, domain, or environment must not be inferred from historical bot comments, stale URLs, screenshots, product naming, or remembered configuration.

Only a currently authorized and identifiable Vercel control surface may be used for deliberate browser verification or deployment actions.

## 8. Evidence classification

Use the following distinction:

`GitHub source/tests/CI + authoritative backend checks → engineering/runtime evidence`

`Vercel browser run → non-authoritative web/browser evidence`

A passing browser run proves only the exercised web behavior in the observed environment. It does not promote Vercel to an authority and does not prove unexercised backend behavior.

## 9. Verification versus completion

Use:

`planned ≠ implemented ≠ browser-verified ≠ deployed ≠ runtime-proven ≠ completed`

A Vercel deployment is an environment artifact. A browser run is verification evidence. Neither is, by itself, implementation completion or architectural acceptance.

## 10. Required recording

When Vercel is used, record:

- the web flow/change being exercised;
- the browser and environment actually used;
- the observed result;
- relevant deployment/preview identifier when available;
- limitations or throttling;
- exact evidence boundary;
- any separate authoritative backend/runtime evidence.

Never report a browser-only observation as proof of a backend gate or external provider transaction.

## 11. Relationship to Full Project ZIP

The Full Project ZIP is a first-class project-state package, not an optional add-on. For bulk web development, package synchronization should be established before large edits, and the package must follow `docs/PROJECT_ZIP_AND_ARTIFACT_POLICY.md`.

Vercel is never the source for constructing the canonical ZIP. The ZIP is derived from the canonical GitHub tracked tree.

## 12. Relationship to Founder Pulse

Founder Pulse is a **read-only product-operations observation layer** over GitHub/GitLab Issue flow. It does not control Vercel, CI, deployment, architecture, task execution, or repository mutation.

Its observations may identify preview/deployment churn or process friction, but those observations remain management/continuity evidence and must be reconciled against Product Law and this policy before changes are made.
