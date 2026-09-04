# Backend — Authority Contract Skill

## WHEN TO USE
Use when a backend change must reconcile which connected service owns identity, durable state, trusted execution, payment, engineering evidence, or delivery.

## INPUT
Product Law authority map, backend Masterplan item, affected service, and implementation contract.

## AUTHORITY
`PRODUCT_LAW.md` is canonical. Service ownership is explicit and executable backend assertions/contracts are preferred over convention.

## ACTION
Resolve the owning authority before implementation and ensure the code path rejects an authority mismatch rather than silently falling back to another service.

## DO NOT
Do not move TeamAi domain state to an easier database, make browser state authoritative, or infer authority from historical configuration.

## PASS
Each affected responsibility has one identified canonical owner and the implementation path preserves that ownership.

## EVIDENCE
Record the authority decision, affected contract, and verification result.

## SEE ALSO
- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `skills/execution/orucaveam/canonical-authority/SKILL.md`
