# Vercel Preview / Web Verification Skill

## WHEN TO USE
Use only when Vercel is **intentionally re-enabled** and connected to the TeamAi GitHub repository for web development, preview, or deployed-browser verification.

## CURRENT OPERATING STATE (2026-09-04)
**TEMPORARY CUTOFF:** Vercel is disconnected / rate-limited relative to the TeamAi GitHub repository. Do not wait on Vercel status checks. Do not treat a red Vercel status as architecture failure, merge blocker, or missing implementation.

Authoritative verification while cutoff is active:
- GitHub Actions (source CI)
- Playwright browser smoke when UI exists (local or CI)
- Firebase Hosting for delivery claims when applicable

## INPUT
Approved web verification scenario, repository commit, intended Vercel project/target (only if reconnected), and Playwright test target.

## AUTHORITY
GitHub remains source/change authority. GitHub Actions remains engineering CI authority. Firebase Hosting remains TeamAi delivery authority where applicable. Firestore and trusted backend services retain their own authority. Vercel is a controlled non-authoritative web development/preview/browser-verification surface — never source, identity, domain state, payment, entitlement, or scheduler authority.

F0–F7 presentation fields do not select or depend on Vercel.

## ACTION
1. If Vercel remains cut off, skip Vercel steps and record `VERCEL=PARKED/CUTOFF` in evidence.
2. Prefer Playwright + GitHub Actions for UI verification while cutoff is active.
3. When Vercel is reconnected: confirm intentional enablement, one coherent commit, record deployment URL, run Playwright against that URL, and separate Vercel failures from domain failures.
4. Re-enable only through an explicit configuration decision, not to chase a status badge.

## DO NOT
- Treat Vercel as TeamAi source, identity, Firestore, scheduler, payment, entitlement, or architecture authority.
- Block merges solely because Vercel is rate-limited or disconnected.
- Assume one PR or one merge automatically equals one Vercel deployment.
- Use ignored-build rules to hide an unexpected failure when Vercel is intentionally enabled.
- Claim hosted completion from a source-only CI pass **or** from a Vercel badge alone.

## PASS
Either (a) cutoff is recorded and GitHub/Playwright evidence covers the claimed UI scope, or (b) when enabled, the intended Vercel deployment is identifiable, the browser scenario is exercised, and authority is not transferred to Vercel.

## EVIDENCE
Cutoff note or deployment URL/status, commit SHA, Playwright/CI result, environment, and any external limitation.

## SEE ALSO
- `POLICY.md`
- `skills/verification/browser-smoke/SKILL.md`
- `skills/tools/minimal-tool-usage/SKILL.md`
- `docs/SKILL_WIRING.md`
- `backend/BACKEND_LIVE_SERVICE_STATUS.md`
