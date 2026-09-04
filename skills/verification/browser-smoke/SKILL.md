# Browser Smoke Verification Skill

## WHEN TO USE
Use when a real browser is required to prove a TeamAi web flow. Do not invent selectors or behavior before the corresponding UI exists.

## INPUT
Target URL/environment, approved smoke scenario, expected visible behavior, required authentication state, and evidence target.

## AUTHORITY
Application/domain behavior remains owned by the canonical TeamAi roots. Playwright is a verification mechanism. Vercel, when used, is only a web development/preview/browser-verification surface.

F0–F7 field identity may guide locators once those surfaces exist. Legal boxes remain Shell · Panel · Card · Control · Navigation.

## ACTION
1. Identify the exact user-visible flow to prove.
2. Start with the smallest deterministic smoke test that can prove the requirement.
3. Use stable semantic locators and explicit assertions.
4. Exercise only the required state and permissions.
5. When F6 Status is in scope, assert text+icon state — never color alone.
6. When F7 Modal is in scope, assert the shared E4 plate and focus trap — not a second dialog system.
7. Record pass/fail and environment.
8. When deployed-web verification is required, target the named deployment URL and keep the deployed surface separate from source/authority claims.
9. Preserve report/trace output as verification evidence when useful.

## DO NOT
- Claim that a screenshot proves backend persistence, authorization, payment, or scheduler state.
- Make a Vercel deployment authoritative because a browser test passes.
- Add tests for UI that does not yet exist.
- Replace deterministic CI tests with an AI browser session.
- Invent F-number selectors before the theme-root implementation exists.

## PASS
The exact browser scenario passes with assertions matching the intended visible behavior, and the environment/target URL are recorded.

## EVIDENCE
Playwright test result, target environment/URL, scenario name, F0–F7 surfaces exercised if any, and report/trace reference where applicable.

## SEE ALSO
- `POLICY.md`
- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `docs/SKILL_WIRING.md`
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
