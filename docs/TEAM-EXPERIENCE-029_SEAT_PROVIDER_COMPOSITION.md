# TEAM-EXPERIENCE-029 — Seats / Provider Composition

## Slice purpose

The Seats / Provider composition binds a provider connection to a configured Web AI Team seat and exposes the capability truth needed to understand whether that seat can be activated.

This slice is a rearrangement of the existing 029 skeleton, not a new page system. F1 Shell and F2 Navigation persist. The composition uses the existing legal field boxes: F3 Panel, F4 Card, F5 Control, and F6 controlled status surface. F7 remains the single shared E4 plate.

## Visible composition

- E2 seat list: Alpha, Beta, Gamma.
- E3 Seat Plate: selected identity, role, provider, model, connection, Team Quality, Tool Quality, limits, and separate TeamAi/provider entitlement facts.
- Test Connection is always available and only changes presentation state in this slice.
- Activate Seat is enabled only when displayed connection is ready and both entitlement facts allow activation.
- Activate Seat opens the existing shared F7 action cluster; it does not execute activation.

## Authority boundary

This slice is presentation-only. It does not:

- write Firestore;
- call a provider;
- mutate provider or TeamAi entitlements;
- change scheduler eligibility;
- execute tools or actions;
- charge PayPal;
- create a second modal/approval authority.

The displayed seat data is fixture content for the inhabited skeleton. Backend ownership remains authoritative.

## Team vs Tools

**Team Quality** communicates model/teamwork quality, skill bundle, and Base TeamAi capabilities.

**Tool Quality** communicates tools, plugins/MCP, and workstation/scope capability. These remain separate facts and are not collapsed into a single quality value.

## Entitlement split

TeamAi entitlement and provider entitlement are displayed as separate facts. Activation requires both to allow it. Gamma intentionally demonstrates a blocked seat through degraded connection and provider entitlement `review`.

## Compact law

At compact widths the seat list and Seat Plate stack into one column; Team/Tools and entitlement facts remain distinct and no horizontal document overflow is allowed. E3 content remains reachable.

## Verification contract

Playwright covers:

1. navigation to the inhabited Seats / Provider composition;
2. visibility of binding, Team Quality, Tool Quality, limits, and entitlement split;
3. presentation-only seat selection;
4. activation gating from displayed connection and entitlement facts;
5. shared F7 opening for an eligible Activate Seat;
6. UI-only Test Connection behavior;
7. compact no-overflow behavior.
