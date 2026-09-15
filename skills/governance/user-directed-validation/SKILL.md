# Skill: user-directed-validation

**Status:** Active governance procedure

## WHEN TO USE
When an authorized user/product decision changes behavior encoded by a test, validator, active index, acceptance rule, or retired concept.

## AUTHORITY
`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md`

## ACTION
1. Observe the failure or requested truth change.
2. Classify implementation drift versus intentional authorized truth change.
3. If the contract changed, update the owning canonical document first.
4. Reconcile affected active documents in the same PR.
5. Update validation to assert the new invariant strictly.
6. Preserve superseded evidence under `docs/archive/` when appropriate.
7. Record the exact result and limitation in `AI_ASSISTANT_READ_ME.md`.

## DO NOT
- Weaken a validator just to obtain green CI.
- Rewrite immutable historical evidence.
- Resurrect retired behavior for old-test compatibility.
- Create another governance contract when `POLICY.md` or this Skill is sufficient.
- Treat a passing validator as authority over Product Law.

## PASS
The canonical contract, implementation, validation, and evidence agree on the new authorized truth, and governance remains fail-closed.

## EVIDENCE
Record the changed contract, exact verification, scope, and limitation in the owning PR/evidence record and the current session file.

## SEE ALSO
- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `POLICY.md`
- `skills/governance/repository-synchronization/SKILL.md`
- `docs/archive/`
