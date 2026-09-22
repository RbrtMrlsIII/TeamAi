# TEAM-EXPERIENCE-029 — Commerce UI Read-Model Contract

**Status:** `IMPLEMENTATION-READY PLANNING CONTRACT / NOT PRODUCT LAW`
**Date:** 2026-09-15
**Purpose:** Define the frontend/backend seam for commerce UI implementation without moving payment, entitlement, authorization, or durable-state authority into the browser.

## 1. Authority chain

`Product_Law/PRODUCT_LAW.md → Masterplan/MASTERPLAN.md → Policy / ORUCAVEAM → docs/SKILL_WIRING.md → 029 planning contracts + commerce/frontend Skills → implementation → browser verification → evidence → AI_ASSISTANT_READ_ME.md`

This document refines the 029 presentation contract. It does not redefine Product Law, pricing, subscription tiers, provider terms, or backend authority.

## 2. Canonical commerce read model

The backend owns the canonical commerce aggregate:

```text
accounts/{uid}/commerce/{correlationId}
    /events/{providerEventId}
    /entitlements/{entitlementId}
```

Server-only lookup:

```text
commerceCorrelationIndex/{correlationId}
```

The frontend must consume an explicit read model derived from the UID-owned commerce aggregate and its authorized child projections. The correlation index is never a browser-facing authority or read surface.

## 3. Read-model roles

| Source | Frontend role | Authority meaning |
|---|---|---|
| Commerce aggregate | Primary commerce state | Current server-owned commerce lifecycle |
| Commerce event history | Timeline/evidence | Durable provider-event history; not UI authority by itself |
| Entitlement projection | Access state | Current TeamAi entitlement projection; not payment proof by itself |
| Provider metadata exposed by backend | Context/detail | External-provider facts only |

The frontend must not select whichever source is most convenient when these disagree. The backend contract must define the precedence and recovery behavior.

## 4. State presentation contract

The UI may expose at least these semantic states when supplied by the backend:

`pending | completed | cancelled | unavailable/error | unauthorized/read-blocked`

A successful payment presentation is only complete when the backend read model exposes both the commerce aggregate transition and the applicable entitlement projection.

Canonical successful shape:

```text
commerce.status = completed
entitlement.status = active
entitlement.sourceCommerceEventId = provider event ID
```

A provider event such as `PAYMENT.CAPTURE.COMPLETED` is evidence used by the backend to produce trusted state. The browser must not independently transform that provider event into entitlement authority.

## 5. Marketplace module contract

Marketplace reveals two first-class commercial modules when focused:

1. **Team Quality** — five paid tiers above the baseline Team Quality allocation.
2. **Team Population** — nine paid tiers, mapping Population Tier 1 → persistent Seat 2 through Population Tier 9 → persistent Seat 10.

Each tier exposes its own guide/description. Both families renew monthly unless renewed. A lower tier remains locked while a higher tier is active. A higher-tier selection must present an inline warning that the current lower tier effect disappears when the higher tier takes effect; the warning is not represented solely by a toast.

The Marketplace may present a hosted billing link supplied by authorized backend/read-model state. TeamAi does not collect or store card credentials in the Marketplace. The browser must never host a card-entry form as a substitute for the external billing boundary.

## 6. User-facing commerce surfaces

### 5.1 Commerce status / checkout entry

Use existing F1/F2/F3/F5/F6 primitives. Present current TeamAi commerce state, required action, amount/currency when authorized, and the next permitted user action.

### 5.2 Pending state

Explain that payment processing is not yet complete. Do not show an active-entitlement claim merely because a checkout flow or provider redirect occurred.

### 5.3 Completed state

Show completed commerce state from the aggregate and active access only when the entitlement projection is active. Preserve provider/event references as traceable metadata where permitted.

### 5.4 Commerce history

Use E2 cards / E3 detail panels. Show event type, provider event identity, time, resulting state, and relevant recovery explanation from the authorized read model. Large raw provider payloads stay out of the main UI.

### 5.5 Recovery / unavailable

Use the existing F6 status and owning-service recovery guidance. The UI points the user toward the responsible service or action; it does not diagnose or repair backend state itself.

## 7. 029 spatial integration

Commerce is a composition, not a new visual system.

Use the existing:

`F0 atmosphere · F1 shell · F2 navigation · F3 panel · F4 card · F5 control · F6 status · F7 modal`

and existing E0–E4 elevation/token/material rules.

Commerce UI must inherit the existing Command Space / Instrument Space theme root. It must not introduce a second root, page-local hex, `--hero-*` namespace, alternate dialog family, or independent status vocabulary.

## 8. Approval boundary

Commerce-related actions that require human approval use the existing E4 plate. The E4 presentation may explain:

- what action is being requested;
- actor/seat/provider/model context;
- impact;
- what will run;
- what will not be granted;
- connection/health state;
- APPROVE / DENY or the applicable existing planning cluster.

E4 remains presentation/interaction. It does not itself charge PayPal, write Firestore, mutate entitlements, select scheduler actors, or bypass TeamAi authorization.

## 9. Browser security and authority rules

The browser must not:

- self-attest successful payment;
- self-attest entitlement;
- write commerce aggregate/event/entitlement state directly;
- read the server-only correlation index;
- use a provider redirect parameter as durable payment proof;
- expose raw provider credentials;
- become a substitute PayPal webhook verifier;
- interpret TeamAi entitlement as an external provider subscription.

## 10. TeamAi vs provider entitlement

The UI must present these as two separate facts:

```text
TeamAi entitlement
        ≠
Provider entitlement
```

A completed TeamAi commerce aggregate indicates the TeamAi commerce lifecycle reached its trusted state. External provider access remains a separately evaluated capability under the connection/Seat lifecycle.

## 11. Responsive/accessibility rules

The implementation follows the existing 029 rules:

- E4 remains reachable when open.
- E3 remains reachable.
- E2 rails may compress/park.
- No horizontal overflow.
- Hover is never the only interaction path.
- Status is not color-only.
- Reduced motion removes travel and pulse and uses the defined timing map.
- Touch controls retain the existing 44px minimum.
- Existing focus-ring and keyboard behavior remain intact.

## 12. Verification gate

Before a commerce UI slice is considered runtime-proven:

1. the typed/backend read-model contract is present;
2. canonical source paths and state precedence are documented;
3. the browser reads presentation data without gaining mutation authority;
4. pending/completed/cancelled/error/unauthorized branches are covered as applicable;
5. accessibility and responsive behavior are exercised in a real browser;
6. live backend state is not inferred from fixtures;
7. the evidence record distinguishes source, environment, and runtime proof.

## 13. Current implementation dependency

The first frontend commerce implementation should remain blocked only on the minimum authoritative dependency required for truthful runtime integration: the final post-fix Firestore verification of the isolated PayPal v13 aggregate/event/entitlement state.

The visual contract itself is implementation-ready and can be built against a typed fixture/read-model seam without pretending the fixture is live domain authority.

## SEE ALSO

- `Product_Law/PRODUCT_LAW.md`
- `Masterplan/MASTERPLAN.md`
- `docs/SKILL_WIRING.md`
- `docs/TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md`
- `docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md`
- `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`
- `docs/backend/FIRESTORE_DOMAIN_MODEL_V2.md`
- `skills/frontend/spatial/commerce-read-model/SKILL.md`
- `skills/frontend/spatial/UI_UX-Promax-Skill.md`
- `skills/verification/browser-smoke/SKILL.md`
- `skills/backend/commerce-paypal/SKILL.md`
