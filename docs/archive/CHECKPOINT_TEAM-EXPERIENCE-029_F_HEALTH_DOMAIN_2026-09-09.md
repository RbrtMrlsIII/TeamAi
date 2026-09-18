# Checkpoint — F Health leaf domain read-model (2026-09-09)

**Slice:** F  
**Authority:** PRODUCT_LAW Family J · Hierarchy Runtime Baseline · Seat Shell v1 · #133 gate  
**Claim:** presentation only · **no 029-released claim**

## Desired output

- Health leaf accepts `source:'domain'` **only** with named contract `seat.connection.health.v1`
- Invalid / missing contract → fixture remains
- Invalid status → refuse
- `getHealthLeafView` never claims authorization or durable state
- Default runtime: fixture + UNKNOWN

## Files

| Path | Role |
|------|------|
| `public/hero-f-health-domain.js` | apply / clear / view |
| `public/hero-hierarchy-runtime.js` | `healthSource` + `healthContractId` seeds |
| `tests/hero-f-health-domain-read-model.test.mjs` | contract tests |

## Graphics note

Materials / lighting foundation (#84–#86, #88, #89) already on main. Owner visual endorsement and richer gear meshes remain after environment + outer UI are fair (slices M / Owner).

## Skills

teamai-project → hierarchy-runtime → seat-shell-hierarchy
