# ORUCAVEAM — Minimalistic Efficiency / Resource Use Skill

## WHEN TO USE
Use whenever a task involves selecting, repeating, or sequencing tool/resource operations such as Firebase/Firestore reads or writes, GitHub operations, Vercel/browser work, file retrieval, tests, builds, deployments, external API calls, or context transfers.

## INPUT
Task scope, canonical authority, required verification, available evidence, applicable field/tool skills, and the resources already exercised.

## AUTHORITY
`POLICY.md` defines M. The owning canonical service remains authoritative; M never permits replacing it with a cheaper or easier non-authoritative system.

## ACTION
Use the minimum sufficient authoritative operations needed to complete and prove the task:

1. Prefer targeted reads over broad duplicate reads.
2. Read only the fields/documents needed for the decision or verification.
3. Reuse valid evidence when it still covers the same pinned scope.
4. Group coherent implementation into the smallest sufficient change set.
5. Perform deterministic checks before expensive hosted/browser checks when appropriate.
6. Use deliberate Vercel/browser runs only when web verification is required.
7. Prefer idempotent writes and safe retries over duplicate durable state.
8. Confirm important authoritative writes with targeted read-back when required.
9. Avoid unnecessary context transfers and repeated external requests.
10. Stop when the required implementation and evidence boundary has been satisfied.

## DO NOT
Do not skip a necessary read, write, test, deployment, browser check, approval, recovery action, or evidence record merely to reduce usage. Do not interpret M as quota gaming.

## PASS
The task completed with the smallest sufficient authoritative resource/tool set while preserving correctness, authorization, and required verification.

## EVIDENCE
Record material resource decisions, operations used, avoided repeated work, and the verification that established completion for the claimed scope.

## SEE ALSO
- `POLICY.md`
- `skills/execution/orucaveam/efficiency/SKILL.md`
- `skills/execution/orucaveam/canonical-authority/SKILL.md`
- `skills/tools/`
- `skills/web/vercel-preview/SKILL.md`
