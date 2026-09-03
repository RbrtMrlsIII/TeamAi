# TeamAi — UI Browser Integrity Verification Policy

**Status:** CANONICAL OPERATING POLICY
**Scope:** UI development and browser-level verification only
**Authority:** This policy refines execution procedure; it does not override `PRODUCT_LAW.md`, `MASTERPLAN.md`, or backend/domain authority.

## 1. Purpose

TeamAi uses a browser-integrity verification surface to validate UI behavior without allowing that surface to become a second hosting, backend, deployment, commerce, or architecture authority.

The current external surface used for this purpose is Vercel. Vercel is therefore a **non-authoritative browser-integrity verification surface** for TeamAi.

## 2. Activation boundary

Vercel browser verification is **opt-in and phase-bound**.

It may be invoked when UI development or UI verification is actively being performed, including:

- browser rendering and responsive-layout checks;
- UI interaction and navigation smoke tests;
- browser-level integration checks for a UI flow;
- temporary/preview-environment verification of UI behavior;
- automated browser checks against a controlled UI test surface.

It is inactive by default for non-UI work. A GitHub commit, pull request, backend change, documentation change, or repository event must not by itself trigger a Vercel preview or browser verification run.

## 3. Explicit non-authority

Vercel browser verification must not be used as authority for:

- TeamAi production hosting or delivery;
- backend runtime authority;
- Firestore state, rules, or persistence proof;
- Supabase Edge Function execution proof;
- PayPal transaction or webhook proof;
- entitlement, permission, identity, or authorization proof;
- scheduler/task/event correctness outside the UI behavior actually exercised;
- deployment-state authority;
- completion of a backend gate;
- final architectural acceptance.

Firebase Hosting remains the current TeamAi web delivery surface. GitHub remains engineering/source authority.

## 4. Verification routing

Classify work before invoking browser verification:

| Change type | Vercel browser verification |
|---|---|
| UI-only | Allowed when useful and deliberately invoked |
| UI + backend | Allowed for the UI surface; backend evidence remains separate |
| Backend-only | Do not invoke |
| Firestore/rules/history | Do not invoke |
| Commerce/PayPal backend | Do not invoke as backend proof |
| Documentation/governance-only | Do not invoke |
| Recovery/evidence-only | Do not invoke |

A mixed change may have both GitHub/backend evidence and browser evidence, but the evidence classes must remain separate.

## 5. Evidence classification

Authoritative engineering evidence:

`GitHub CI / source tests / backend validation → engineering evidence`

Non-authoritative UI evidence:

`Vercel browser integrity → browser rendering / interaction / UI smoke evidence`

Passing a browser test means only that the tested UI surface behaved as observed in that browser environment at that time. It does not promote Vercel to a TeamAi authority and does not prove unexercised backend behavior.

## 6. Anti-churn rule

Do not create or refresh Vercel previews merely because GitHub receives a commit.

Do not repeatedly trigger browser verification while iterating on backend, documentation, recovery, or governance changes.

UI work may deliberately request browser verification at the point where browser evidence is useful. Outside that scope, avoid preview/deployment churn and do not treat Vercel throttling or unavailable preview infrastructure as a TeamAi architecture failure.

## 7. Project-control rule

A Vercel project, team, deployment target, domain, or environment must not be inferred from historical bot comments, stale URLs, screenshots, product naming, or remembered configuration.

Only a currently authorized and identifiable Vercel control surface may be used. If the correct project is not identifiable, browser verification is not authorized through that external surface.

## 8. Browser verification versus completion

Use the following distinction:

`planned ≠ implemented ≠ browser-verified ≠ deployed ≠ runtime-proven ≠ completed`

Browser integrity is one verification input, not a completion authority.

For 029 UI work, browser evidence should be aligned to the actual action workflow so that UI behavior reflects authoritative identity, Seat, capability, permission, task, event, approval, and recovery state rather than inventing page-local authority.

## 9. Required recording

When browser verification is used, record:

- the UI change or flow being exercised;
- the browser/verification environment actually used;
- the observed result;
- any environment limitation;
- the exact evidence boundary;
- whether authoritative backend evidence was separately obtained.

Never report a browser-only observation as proof of a backend gate.

## 10. Relationship to Founder Pulse

Founder Pulse is a **read-only product-operations observation layer** over GitHub/GitLab Issue flow. It does not control Vercel, CI, deployment, architecture, task execution, or repository mutation.

Its value is operational feedback: it can summarize what work moved from open to closed and what remains open, including backlog age, labels, and visible delivery links. That observation can help the TeamAi Development Team identify delivery bottlenecks, stale work, and areas where process needs attention without becoming another authority.

Founder Pulse must remain downstream of canonical engineering state. Its reports are evidence/management observations, not Product Law, architecture decisions, implementation proof, or automatic instructions to modify the repository.
