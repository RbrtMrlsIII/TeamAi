# Frontend / Spatial — Commerce Read Model Skill

## WHEN TO USE
Use when implementing or verifying any TeamAi frontend surface that displays commerce, payment, entitlement, or commerce-history state.

## INPUT
Backend-owned commerce read contract, authenticated user context, canonical commerce aggregate/event/entitlement paths, 029 spatial primitives/tokens, and the applicable browser verification target.

## AUTHORITY
Firestore/domain state and trusted backend services own commerce authority. PayPal is the external provider-event authority. The frontend is a presentation and interaction layer over trusted TeamAi state.

The canonical commerce aggregate is the primary commerce state source:

`accounts/{uid}/commerce/{correlationId}`

with child history/projection:

`events/{providerEventId}` and `entitlements/{entitlementId}`.

`commerceCorrelationIndex/{correlationId}` is server-only and must not become a browser read model.

## ACTION
Build typed, read-only frontend projections from the backend-owned commerce contract. Prefer aggregate state for the primary UI state, event records for history/evidence, and entitlement projection for access-state display.

A canonical successful payment presentation may map:

`aggregate.status = completed` → payment/commerce completed state

`entitlement.status = active` → TeamAi access projection active

The UI may display provider identity, event identity, timestamps, amount/currency, and recovery guidance only when exposed by an authorized read model. It must not infer entitlement from a PayPal response, browser redirect, URL parameter, or local flag.

Commerce UI states should remain reason-bearing and distinguish at least pending, completed, cancelled, unavailable/error, and unauthorized/read-blocked conditions as the backend contract exposes them.

For the spatial system, compose existing F0–F7 primitives and the frozen E0–E4 hierarchy. Commerce does not create a new field family, legal box, theme root, or modal system.

## DO NOT
- Do not call PayPal directly from the browser for authoritative commerce state.
- Do not write commerce aggregate, provider event, or entitlement documents from the browser.
- Do not turn payment success into entitlement success unless the trusted entitlement projection says so.
- Do not expose or read `commerceCorrelationIndex` from the browser.
- Do not create a commerce-specific theme root or page-local color vocabulary.
- Do not make status color-only.
- Do not use F6 Status as an authority or debugger.
- Do not let an E4 presentation script approve payment, write Firestore, charge PayPal, or choose a scheduler actor.

## PASS
The frontend renders commerce state from an explicit backend-owned read model; browser behavior cannot self-authorize payment or entitlement; the UI distinguishes commerce state from provider entitlement; the presentation follows the 029 spatial system; and browser verification exercises the actual rendered state and accessibility path.

## EVIDENCE
Record the read-model contract, canonical source paths, mapped UI states, F0–F7/E0–E4 composition, browser/device scope, accessibility assertions, and any unavailable backend/runtime dependencies. Runtime UI evidence must not be upgraded from source evidence alone.

## SEE ALSO
- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `docs/TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md`
- `docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md`
- `docs/backend/FIRESTORE_DOMAIN_MODEL_V2.md`
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/verification/browser-smoke/SKILL.md`
- `skills/backend/commerce-paypal/SKILL.md`
- `skills/backend/verification-recovery/SKILL.md`
