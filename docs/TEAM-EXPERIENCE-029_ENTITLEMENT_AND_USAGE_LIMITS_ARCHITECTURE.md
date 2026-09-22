# TEAM-EXPERIENCE-029 — Entitlement & usage limits architecture

**Status:** PLANNING / ARCHITECTURE SUPPORT — **not** pricing authority  
**Numbers:** tier counts are defined for Team Quality/Population; **prices and capability limits remain TBD**  
**Authority:** `Product_Law/PRODUCT_LAW.md` · commercial capability model · Firestore usage policy  
**No 029-released claim.**

## 1. Purpose

Define **how** TeamAi will interpret subscriptions and usage limits so implementation can plug numbers later without redesigning axes.

This document does **not** set prices or exact capability caps. It does record the approved Team Quality/Population tier counts and their subscription transition semantics.

## 2. Three independent product levers

| Lever | Controls | Commerce? |
|-------|----------|-----------|
| **Team Quality** | Solo/Team mode quality, orchestration/turn capacity, basic vs advanced *TeamAi* allocation | Yes |
| **Team size** | Max **persistent WebAi seats** that may be **Active** | Yes (usually paired with Team Quality packaging) |
| **Tool Quality** | Which **TeamAi-built** tool/config packs are entitled | Yes (separate axis) |

**Not commerce:**

| Concept | Role |
|---------|------|
| SEAT_SKILLS / WORKSPACE_SKILLS | Procedure/knowledge |
| Zip package | Distribution format only |
| Provider API key / provider subscription | External; never sold as TeamAi GitHub or model entitlement |

```text
Team Quality  ≠  Tool Quality  ≠  Provider entitlement  ≠  Skills packages
```

## 2a. Current approved commercial tier structure

**Team Quality** has five paid tiers above the baseline Team Quality allocation (`Tier 0`). **Team Population** has nine paid tiers. Population Tier 1 unlocks persistent Seat 2 and Population Tier 9 unlocks persistent Seat 10.

Both families are monthly subscriptions. A lower tier remains locked for the duration of an active higher tier. A higher-tier change is permitted, but the resulting user flow must warn inline that the lower tier's effect disappears when the higher tier takes effect.

The exact Team Quality limits, prices, discounts, promotional terms, and entitlement payload remain backend/product packaging data and must not be invented by the browser.

## 3. Entitlement projection (runtime shape)

All TeamAi-facing MCP inventory, installation, connector authentication handoff, permission configuration, health/test, and custom MCP management are presented through the dedicated MCP facility. Entitlement determines whether a capability is available to the account; MCP configuration determines how that capability is installed and managed; equipping then determines which eligible Seat(s) or Workspace may expose its target-owned branch.

```text
PayPal / commerce event (verified)
  → UID-owned commerce aggregate
  → entitlement projection document(s)
  → policy evaluation at seat activation / tool invoke / durable write
```

Conceptual fields (names illustrative; schema TBD):

```text
entitlement.teamQuality.tier          // TBD string
entitlement.teamQuality.seatLimit     // TBD number | null
entitlement.teamQuality.orchestration // TBD
entitlement.toolQuality.packs[]       // TBD pack ids
entitlement.validUntil                // from billing cycle
entitlement.source                    // commerce projection only
```

**Browser must not self-attest entitlement.** Reads of projection are allowed; writes only via trusted server after verified provider events.

## 4. When subscription ends

Architecture support (behavior, not dates):

1. Projection moves affected capabilities to **not entitled**.
2. Seats above free/baseline become **not usable** for paid capacity (config may remain stored).
3. Tool Quality packs detach **only** if packaging ties them; default model keeps axes **independent**.
4. GitHub repos, local skills, provider accounts **remain** (outside TeamAi billing).
5. No silent domain DB wipe to “save quota.”

Grace / read-only windows = **TBD** product decision.

## 5. Durable vs ephemeral conversation (DB-aware limits)

| Class | Definition | Limit policy |
|-------|------------|--------------|
| **Ephemeral** | UI-only or session state that **never** becomes Firestore domain state | **Do not** hard-limit for Firestore cost reasons |
| **Durable TeamChat / events** | Messages, turns, tasks, handoffs written under UID paths | **May** apply length, retention, or reset interval (**TBD numbers**) |
| **Derived summaries** | Compact durable stand-ins for long history | Preferred over unbounded full-transcript retention |

```text
if conversation_cannot_affect_database_usage:
  → no TeamAi Firestore quota limit required
else:
  → apply durable retention / soft caps / reset (numbers TBD)
```

WebAi **can** increase usage only when the product **persists** turns, events, or listeners. Orchestrator should prefer summary packets over re-reading entire histories.

## 6. First-party tools & configurations

At entitled Tool Quality levels, TeamAi may unlock **TeamAi-built** tools/configs through the TeamAi Marketplace/commercial boundary. Third-party provider billing remains distinct from TeamAi Marketplace billing.

Still required for use:

`entitled → configured → authorized → project-scoped → seat-allowed → healthy → usable`

## 7. Policy evaluation points (implementation hooks)

| Hook | Check |
|------|--------|
| Seat activate | team size / Team Quality |
| Tool invoke | Tool Quality pack + connection + scope |
| Durable message append | durable chat policy + Firestore posture |
| Context packet build | prefer summaries; bound reads |
| Commerce webhook | only trusted path updates entitlement |

## 8. Explicit non-goals

- No prices or exact Team Quality capability limits in this doc; population tier-to-seat mapping is defined above.  
- No ZipSkills SKU.  
- No client-written entitlement.  
- No alternate durable DB under quota pressure.

## 9. Relationship

- Commercial vocabulary: `docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md`  
- Firestore posture: `docs/FIRESTORE_USAGE_AND_RESILIENCE_POLICY.md`  
- Skill kinds: `docs/TEAM-EXPERIENCE-029_SEAT_AND_WORKSPACE_SKILL_KINDS.md`  
