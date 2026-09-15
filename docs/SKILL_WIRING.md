# SKILL_WIRING — active routing map

**Role:** routing only. It does not define Product Law, chronology, acceptance, or permission.

## Authority path

`Product_Law/PRODUCT_LAW.md → Masterplan/MASTERPLAN.md → Masterplan/NEXT_SLICES.md → POLICY.md / ORUCAVEAM → this map → applicable Skill(s) → implementation → verification/evidence → AI_ASSISTANT_READ_ME.md`

## Development fields

| Field | Primary Skill family | Main verification |
|---|---|---|
| Product & Governance | `skills/governance/**` + ORUCAVEAM | governance validators |
| Backend & Runtime | `skills/backend/**` | backend/runtime verification |
| Frontend & Experience | `skills/frontend/**` | tests + browser verification |
| Integration & Contracts | applicable backend/frontend contract Skills | contract/integration tests |
| Verification & CI/Browser | `skills/verification/**` | CI/browser/evidence |
| Documentation, Knowledge & Session | `skills/governance/learning-handover/**` + synchronization | synchronization/audit |
| Recovery, History & Reconciliation | applicable recovery/workspace Skills | recovery verification |
| Delivery & Operations | applicable delivery/tool Skills | delivery verification |

## Governance routing

- Repository synchronization: `skills/governance/repository-synchronization/SKILL.md`
- User-directed validation changes: `skills/governance/user-directed-validation/SKILL.md`
- Product Law change: `skills/governance/product-law-change/SKILL.md`
- Masterplan/Skill routing: `skills/governance/masterplan-skill-wiring/SKILL.md`
- Machine builder: `skills/governance/machine-builder/SKILL.md`
- Learning/session continuity: `skills/governance/learning-handover/SKILL.md`

Governance Skills are procedures only. They cannot authorize an action outside Product Law, Policy, repository permissions, or the owning Issue/PR contract.

## Machine Hero routing

PR #344 is the machine replacement candidate. Its routing is:

`Product_Law/PRODUCT_LAW.md → Masterplan/MASTERPLAN.md → Masterplan/NEXT_SLICES.md → POLICY.md → repository-synchronization → machine-builder → applicable frontend/spatial Skills → verification/browser evidence`

The machine builder owns the construction procedure. It does not own product semantics, backend authority, authorization, scheduler selection, entitlement, or promotion.

Relevant spatial companions are selected only when required:

- `skills/frontend/spatial/hierarchy-runtime/SKILL.md`
- `skills/frontend/spatial/motion/SKILL.md`
- `skills/frontend/spatial/transition/SKILL.md`
- `skills/frontend/spatial/responsive/SKILL.md`
- `skills/frontend/spatial/accessibility/SKILL.md`
- `skills/frontend/spatial/camera-ladder-recovery/SKILL.md`
- `skills/frontend/spatial/workspace-ring/SKILL.md`
- `skills/frontend/spatial/workspace-zipskills/SKILL.md`

## Routing rule

Every executable `Masterplan/MASTERPLAN.md` item must resolve to concrete Skill path(s), or explicitly state `No skill required` with rationale. A folder name alone is not routing.

A missing reusable Skill is an execution gap. Do not create a governance document as a substitute for a Skill.

## History rule

Retired procedures live under `docs/archive/` only. Historical handover evidence may remain under `handover/`. Neither is active routing.

## Forbidden active routing surfaces

- root `PRODUCT_LAW.md`
- root `MASTERPLAN.md`
- root `NEXT_SLICES.md`
- active `docs/skills/`
- active `docs/project-guide/HandOver.md`
- active `docs/project-guide/Endorsement.md`
- `OBSOLETE_FILES.md`
