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

## SETTINGS SMOKE / IN-PAGE DIAGNOSTIC HARNESS
Operator Smoke is a first-class **in-page diagnostic surface** mounted in the current page's Settings control/panel. It must not become a product-stage navigator and it must not become an authority for the feature it exercises.

### Contract
Every applicable Smoke probe:
- is enabled from the current page's Settings surface;
- stays on the current page and does not navigate as part of the smoke operation;
- targets one deterministic feature, entity, component, or presentation state;
- exposes the exact target identifier and observable resulting state/output;
- uses the feature's existing canonical implementation path;
- remains presentation/diagnostic only unless a separately authorized contract says otherwise;
- has a deterministic cleanup/restoration expectation where the probe changes transient presentation state.

### Probe classes

| Smoke | For what? | Desired output |
|---|---|---|
| Camera Test | Exact camera/dock target | Show the exact camera ID and apply the existing Cam-5/6 camera path without route navigation |
| Animation Test | Exact animation/trigger | Toggle the exact animation on/off and expose its ID/state |
| Mesh/Asset Test | Exact mesh/model/asset | Show or highlight the exact asset ID and load/render state |
| Interaction Test | Exact control/pointer/interaction | Trigger the exact interaction and show the resulting state/event |
| State Test | Exact UI/machine state | Force the exact state, expose its ID/state, then restore or report the resulting state |
| Connection/Topology Test | Exact semantic connection | Exercise the applicable presentation path and show source → target/state without inventing topology |
| Data/Binding Test | Exact binding/entity | Resolve and display the exact identifier/value presented by the current binding path |
| Responsive Test | Exact viewport/layout state | Exercise the bounded viewport and expose the resulting presentation state without leaving the page |
| Reduced Motion Test | Exact motion-equivalent state | Verify the semantic result remains available while nonessential motion is suppressed |
| Performance Test | Exact bounded render/update path | Show the bounded metric/result needed for the claim without navigation |

### Camera
Camera Smoke is one probe class, not the Smoke architecture. Camera tests must use the current canonical Cam-5/6 path. Do not introduce or revive a 1–15 inspection camera registry, stage walker, traversal spine, or parallel camera authority.

### Agent requirement
When an agent adds or materially changes a UI/spatial feature, the agent must ask:

> What is the smallest deterministic in-page Smoke probe that proves this feature works?

When such a probe is applicable, the agent must add or extend the corresponding Settings Smoke control and the smallest matching Playwright assertion. The agent must choose the probe class from the feature semantics rather than defaulting automatically to Camera Test.

If no useful deterministic in-page probe exists, record why the feature is not smokeable rather than fabricating a meaningless control.

### Retirement boundary
The former `hero-inspection` / 1–15 stage spine is retired. Settings Smoke replaces its operator diagnostic convenience without recreating stage navigation. Historical inspection code/docs may remain as explicitly historical evidence, but active product/runtime/test paths must not depend on the retired spine.
