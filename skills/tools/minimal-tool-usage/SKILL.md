# ORUCAVEAM M — Minimalistic Tool / Resource Usage Skill

## WHEN TO USE
Use for the final **M — Minimalistic Efficiency / Resource Use** dimension of ORUCAVEAM whenever deciding how many reads, writes, external calls, builds, deployments, browser runs, or context transfers are necessary.

## INPUT
Objective, canonical authority, required evidence, available tool/service, current resource constraints, failure/retry characteristics, and already-verified state.

## AUTHORITY
`POLICY.md` defines ORUCAVEAM M. The owning canonical service or source remains authoritative; M never grants permission and never permits replacing an authoritative system with a cheaper or easier non-authoritative system.

## ACTION
1. Identify the authoritative operation that actually answers the question or changes state.
2. Prefer a targeted read/write over a broad scan when equivalent trustworthy evidence can be obtained.
3. Read only the fields/documents needed for the current decision or verification.
4. Reuse already verified state/evidence when it still covers the same pinned scope.
5. Batch coherent changes when doing so preserves reviewability and does not hide independent risk.
6. Perform deterministic checks before expensive hosted/browser/deployment verification when appropriate.
7. Use deliberate Vercel/browser operations only when web verification adds required evidence.
8. Avoid destructive retries and duplicate writes; use idempotency where supported.
9. Confirm important authoritative writes with targeted read-back when required.
10. Avoid unnecessary context transfers and repeated external requests.
11. Record why an expensive or externally dependent operation was necessary when it materially affects resources, quota, or deployment churn.

## FIELD EXAMPLES
M applies across domain skills. Examples include:

- **Firebase/Firestore:** targeted canonical reads, minimal fields, bounded queries, required write plus read-back rather than repeated broad reads.
- **GitHub:** fetch only the files/commits/PR state needed for the decision, reuse pinned evidence, and avoid redundant repository scans.
- **Vercel/browser:** make one coherent web change and one deliberate verification deployment/run when browser evidence is actually required; do not generate deployment churn merely for confidence that cheaper evidence can establish.
- **Supabase/PayPal:** perform only the trusted operations required by the applicable contract and preserve idempotency/replay controls.
- **Tests/builds:** run the smallest relevant deterministic checks first, then expand only when the evidence boundary requires it.
- **Context/file retrieval:** retrieve the smallest sufficient authoritative context and avoid duplicate transcript or artifact transfer.

## DO NOT
- Replace authoritative verification with a cheaper non-authoritative shortcut.
- Skip a required check solely to minimize tool usage.
- Treat fewer tool calls as inherently better than trustworthy evidence.
- Use deployment suppression to conceal a failing or unexpected condition.
- Repeatedly invoke external systems when existing evidence already proves the same pinned scope.

## PASS
The chosen operations are the minimum sufficient authoritative set that still provides trustworthy completion evidence.

## EVIDENCE
Record authoritative source, selected operations, important limitations, reuse of existing evidence, and verification result when material to the task.

## SEE ALSO
- `POLICY.md`
- `skills/execution/orucaveam/SKILL.md`
- `skills/execution/orucaveam/minimalistic-resource-use/` (concept routing; use this skill as the M implementation)
- `docs/SKILL_WIRING.md`
