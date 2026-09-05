# TeamAi — Agent Current-State and Branch Rules

**Status:** OPERATIONAL CONTROL NOTE

Use `main` as the only current baseline. Historical branches are evidence or work-in-progress candidates, not implied current architecture.

## Before reusing a branch

`compare branch → main → classify (merged/superseded/ahead/diverged/behind) → inspect changed files → reconcile to current authority → only then reuse`

A branch name, commit timestamp, or old PR description does not establish current relevance.

## PR minimum trace

Every non-trivial PR should state:

- governing Product Law concept;
- Masterplan checklist item or explicitly bounded maintenance task;
- concrete skill routing from `docs/SKILL_WIRING.md`;
- implementation scope;
- verification scope and result;
- limitations/open dependencies;
- whether the change is presentation-only or crosses a runtime authority boundary.

## Protected boundaries

Do not create alternate authority for:

- Firebase UID identity;
- Firestore durable domain state;
- Scheduler eligibility/next-actor selection;
- ProviderRuntime authorization;
- PayPal event authority;
- TeamAi/provider entitlement distinction;
- shared F7 modal authority;
- the single spatial theme root.

Do not reopen completed backend implementation simply because a separate live environment evidence item remains outstanding.
