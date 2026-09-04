# Vercel Preview / Web Verification Skill

## WHEN TO USE
Use only when Vercel is intentionally enabled for TeamAi web development, preview, or deployed-browser verification.

## INPUT
Approved web verification scenario, repository commit, intended Vercel project/target, and Playwright test target.

## AUTHORITY
GitHub remains source/change authority. GitHub Actions remains engineering CI authority. Firebase Hosting remains TeamAi delivery authority where applicable. Firestore and trusted backend services retain their own authority. Vercel is a controlled non-authoritative web development/preview/browser-verification surface.

## ACTION
1. Confirm Vercel is intentionally enabled for the current phase.
2. Confirm the repository/project relationship and do not infer stale project configuration.
3. Use one coherent commit for the intended web change.
4. Allow the intended deployment to materialize rather than adding ignore rules merely to suppress it.
5. Record the exact deployment target/URL used for verification.
6. Run the applicable Playwright browser smoke/E2E suite.
7. Record failures separately from backend/domain authority failures.
8. Disable/park Vercel again only through an explicit configuration decision, not as a substitute for diagnosis.

## DO NOT
- Treat Vercel as TeamAi source, identity, Firestore, scheduler, payment, entitlement, or architecture authority.
- Assume one PR or one merge automatically equals one deployment in every external configuration.
- Use ignored-build rules to hide an unexpected failure.
- Claim hosted completion from a source-only CI pass.

## PASS
The intended Vercel deployment is identifiable, the required browser scenario is exercised, and the result is recorded without transferring authority to Vercel.

## EVIDENCE
Deployment URL/status, commit SHA, Playwright result, environment, and any external limitation.

## SEE ALSO
- `POLICY.md`
- `skills/verification/browser-smoke/SKILL.md`
- `skills/tools/minimal-tool-usage/SKILL.md`
- `docs/SKILL_WIRING.md`
