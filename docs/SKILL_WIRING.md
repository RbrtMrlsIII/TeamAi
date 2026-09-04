# TeamAi — Skill Wiring Map

**Status:** BASELINE WIRING MAP / PENDING ENDORSEMENT  
**Purpose:** Navigate from canonical product meaning to ORUCAVEAM execution skills, field/domain skills, tool/system skills, verification, and evidence. This file is a wiring map, not a source of product authority and not a replacement for the skill-library README/index.

## 1. Resolution model

`Product Law concept + Masterplan item + field/domain + current phase + provider/service/runtime + permissions/policy → effective skill set`

Load the smallest sufficient skill bundle. A skill never grants authorization.

## 2. Single ORUCAVEAM skill family

ORUCAVEAM is the single execution-discipline framework. It contains one integrated sequence with **M — Minimalistic Efficiency / Resource Use** as its final dimension. There is no separate O-R-U-C-A-V-E-A lifecycle or secondary execution framework.

| Letter | Execution concern | Direct skill |
|---|---|---|
| O | Objective | `skills/execution/orucaveam/objective/SKILL.md` |
| R | Restrictions | `skills/execution/orucaveam/restrictions/SKILL.md` |
| U | User Authority / permission basis | `skills/execution/orucaveam/user-authority/SKILL.md` |
| C | Canonical Authority | `skills/execution/orucaveam/canonical-authority/SKILL.md` |
| A | Action | `skills/execution/orucaveam/action/SKILL.md` |
| V | Verification | `skills/execution/orucaveam/verification/SKILL.md` |
| E | Efficiency | `skills/execution/orucaveam/efficiency/SKILL.md` |
| A | Audit | `skills/execution/orucaveam/audit/SKILL.md` |
| M | Minimalistic Efficiency / Resource Use | `skills/tools/minimal-tool-usage/SKILL.md` |

The root dispatcher is `skills/execution/orucaveam/SKILL.md`. It composes only the letters needed by the task and then adds the smallest sufficient field/domain and tool/system skills.

## 3. Canonical end-to-end paths

| Canonical area | Masterplan / phase source | ORUCAVEAM + field/tool skill routing | Primary tool/system | Verification | Evidence / continuation |
|---|---|---|---|---|---|
| Product Law change | Product Law / active phase | `skills/governance/product-law-change/SKILL.md` + applicable ORUCAVEAM skills | Repository documents | Authority/discrepancy review | HandOver + endorsement; Product Knowledge when learned |
| Masterplan checklist wiring | Masterplan | `skills/governance/masterplan-skill-wiring/SKILL.md` + applicable ORUCAVEAM skills | Repository documents | Every executable item has concrete skill routing or no-skill rationale | Wiring map + HandOver |
| Execution discipline | Policy | `skills/execution/orucaveam/SKILL.md` + applicable letter skills | Applicable tools | ORUCAVEAM gate record | Evidence + HandOver |
| Learning / teach-back | Completed execution | `skills/governance/learning-handover/SKILL.md` + applicable ORUCAVEAM/Audit skills | HandOver/Endorsement docs | Learning acceptance and scope | `PRODUCT-KNOWLEDGE.md` + optional ToolKit candidate |
| Backend / Firebase | TEAM-BACKEND-001 / 029 backend dependency | ORUCAVEAM + concrete backend skill family | Firebase / Firestore / Supabase | Authoritative backend evidence | Backend checkpoint/HandOver |
| Commerce | TEAM-BACKEND-001 / 029 commerce dependency | ORUCAVEAM + concrete commerce/PayPal skill family | PayPal / Supabase / Firestore | Contract + runtime evidence | Commerce evidence + endorsement |
| Browser smoke | TEAM-EXPERIENCE-029 when UI exists | `skills/verification/browser-smoke/SKILL.md` + applicable ORUCAVEAM skills | Playwright | Real browser assertions | CI report / trace |
| Vercel web development / preview | 029 web verification | `skills/web/vercel-preview/SKILL.md` + applicable ORUCAVEAM/M skills | Vercel | Controlled deployed-browser verification | CI/browser evidence |
| Spatial UI/UX | TEAM-EXPERIENCE-029 visual experience | `skills/frontend/spatial/UI_UX-Promax-Skill.md` + applicable ORUCAVEAM skills | TeamAi frontend/theme system | Theme-mode, accessibility, responsive, and browser verification | GitHub evidence + HandOver |
| Packaging | Every completed gate requiring full project package | `skills/packaging/project-package/SKILL.md` + applicable ORUCAVEAM/V/A/M skills | Project package script | Extracted-path + byte/hash equality | Full Project ZIP + manifest |

## 4. Field/domain expansion rule

A field skill family is a set of small direct procedures for a real recurring work domain. Examples include `backend/`, `commerce/`, `web/`, `engineering/`, `verification/`, `frontend/spatial/`, or `packaging/`.

A field skill must:

1. identify the governing Product Law/Masterplan concept;
2. state its owning authority;
3. provide direct executable steps;
4. state prohibited substitutions or scope violations;
5. define its pass/evidence condition; and
6. link back to the relevant ORUCAVEAM letter skills and canonical sources.

Do not create empty taxonomy folders. Expand the field family when a recurring bounded procedure demonstrates the need.

## 5. Checklist-to-skill rule

Every executable checklist item in `MASTERPLAN.md` must resolve to:

`canonical concept → ORUCAVEAM letter skill(s) → field/domain skill(s) → tool/system skill(s) → verification → evidence`

or explicitly state `No skill required` with a reason.

A field folder name alone is not sufficient routing. A concrete skill path must be available before a checklist is treated as fully executable.

When a new checklist item is introduced:

`checklist item → canonical concept → field/domain → ORUCAVEAM letters → existing skill lookup → skill sufficient? → wire or update/create skill → verify skill → execute → record evidence`

## 6. Skill detail pattern

Every operational skill should tell an agent directly:

`WHEN TO USE → INPUT → AUTHORITY → ACTION → DO NOT → PASS → EVIDENCE → SEE ALSO`

`SEE ALSO` is a navigation aid to the actual governing Product Law, Masterplan, Policy, contract, skill, or deeper technical documentation.

## 7. Authority direction

`PRODUCT_LAW → MASTERPLAN → POLICY / ORUCAVEAM → SKILL(S) → TOOL/SYSTEM → VERIFICATION → EVIDENCE`

Handover and endorsement wrap the execution/learning boundary; they do not become a higher product authority.

## 8. TeamAi / ToolKit boundary

TeamAi-specific skills and decisions remain in TeamAi. ToolKit receives only generalized, validated lessons after TeamAi evidence and endorsement establish that the lesson generalizes beyond the TeamAi-specific context. A ToolKit skill cannot silently overwrite TeamAi Product Law or current project decisions.

## 9. Wiring integrity checks

A wiring change is incomplete when:

- a referenced skill path does not exist;
- a checklist names only a category instead of a concrete skill;
- a skill points to stale/deleted documentation;
- a domain skill contradicts Product Law/Policy;
- the required verification/evidence path is absent; or
- a new procedure is added without deciding whether it belongs in an existing skill or a new reusable skill.
