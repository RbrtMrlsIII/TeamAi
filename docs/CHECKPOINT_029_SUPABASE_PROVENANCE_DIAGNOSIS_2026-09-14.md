# CHECKPOINT — 029 SUPABASE SOURCE-TO-LIVE PROVENANCE DIAGNOSIS

**Date:** 2026-09-14  
**Ledger:** Issue #284 / Issue #278  
**Diagnostic record:** Issue #314  
**Status:** DIAGNOSED / BACKEND PROVENANCE INVESTIGATION  
**No 029-release claim.**

## Purpose

Determine whether TeamAi can prove the exact repository `main` source/commit corresponding to the currently deployed Supabase Edge Functions.

This checkpoint is **not a secondary `MASTERPLAN.md`**, not a replacement for Product Law, Masterplan, Policy/ORUCAVEAM, Issue #278, Issue #284, or the backend contracts. It records deployment provenance evidence only and does not authorize deployment.

## Live Supabase evidence

Connected project: `TeamAi` (`srpgzzretfyqdsfclnuo`).

Current live inventory contains the eight expected ACTIVE TeamAi Edge Functions and the same function versions recorded in the backend census. Live metadata also exposes deployment `updated_at`, entrypoint paths, and an `ezbr_sha256` value for each deployed function.

A live read of `teamai-task-execute` exposes its deployed `index.ts` and `_shared/firestore.ts` source. The deployed source matches the repository-owned implementation shape for the current task-execution slice, including the authenticated Firebase-ID-token boundary, transactional lease, durable execution result, and `stub-edge-runtime` provider boundary.

## Material provenance gap

The live Supabase metadata does **not** expose an originating Git commit SHA or another repository-commit identifier that directly binds the deployed function version/bundle to a specific `main` commit.

The live `ezbr_sha256` values establish a deployment artifact hash, but the currently accessible evidence does not define a canonical mapping from that hash to a Git tree/commit in this repository.

Entrypoint path shapes are also inconsistent across functions, including `/home/team_ai_official_ph/TeamAi/...` and `/home/team_ai_official_ph/TeamAi/TeamAi/...`. These are provenance clues, not runtime-failure evidence.

## Bounded classification

**CONTROL GAP / PARTIALLY PROVEN**

What is proven:

- live project identity;
- expected eight-function inventory;
- current live function versions;
- deployed source is readable for individual functions;
- current deployed `teamai-task-execute` source is materially aligned with the repository implementation boundary.

What is not proven:

- exact `Git main commit → deployed function bundle → live function version` chain for every function;
- that the live deployment was produced from one specific governed repository commit;
- that every live bundle has a reproducible repository-tree hash mapping.

This is a control-plane evidence gap, **not** a finding that Supabase runtime is broken.

## Non-assumptions

- Do not deploy or redeploy a function to manufacture provenance evidence.
- Do not treat matching function versions as proof of Git commit provenance.
- Do not treat `ezbr_sha256` as a Git commit hash.
- Do not infer Firebase/PayPal/provider completion from deployment metadata.
- Do not rewrite Product Law or Masterplan from this diagnostic record.
- No Firebase/PayPal/Composio work.

## Recommended governed follow-up

The next remediation decision should establish one canonical deployment-provenance mechanism, for example a machine-readable deployment manifest that records:

`repository + commit SHA + tree/bundle digest + function slug + deployment version + deployed-at timestamp`

The exact mechanism must be selected by the owning backend/governance authority before implementation. This checkpoint does not authorize that mechanism yet.

## Related authorities

- `PRODUCT_LAW.md`
- `MASTERPLAN.md`
- `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md`
- `docs/TEAMAI_029_CURRENT_STATE_MAP.md`
- `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md`
- `backend/BACKEND_LIVE_SERVICE_STATUS.md`
- Issue #278
- Issue #284
- Issue #314
