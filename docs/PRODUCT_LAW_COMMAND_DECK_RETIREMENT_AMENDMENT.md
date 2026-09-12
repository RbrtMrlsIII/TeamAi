# Product Law Amendment — Command Deck Retirement

**Status:** NORMATIVE PRODUCT-LAW AMENDMENT / OWNER-DIRECTED RETIREMENT
**Parent authority:** `PRODUCT_LAW.md`
**Execution ledger:** Issue #278
**Related frontend baseline:** `docs/PRODUCT_LAW_FRONTEND_HIGHEST_STAKE.md`
**No 029-release claim.**

## Decision

The historical **Command Deck** is retired as a current TeamAi product surface and deployment route.

It is not the authenticated destination of the 3D world, not a second workspace authority, and not a navigation surface that future agents should preserve merely because it already exists in repository history.

The current product direction is:

```text
PUBLIC ENTRANCE
   ↓
3D WORLD / SPATIAL MACHINE
   ↓
AUTHENTICATION
   ↓
RESTORED AUTHORIZED USER STATE
   ↓
3D CONFIGURATION / SETTINGS WORLD MAP
   ↓
CENTER WORKSPACE
   ↓
TURN / ORCHESTRATION / EVIDENCE
```

## Deployment consequence

`/spatial/` is retired from the published product. The GitHub Pages workflow must not copy `frontend/spatial/` into the deployment artifact.

The source directory and historical Command Deck documents may remain in Git for reconstruction and evidence. Repository presence is not current product status.

## Re-ownership

Useful responsibilities formerly presented by the Command Deck are not discarded. They are re-owned by the current spatial machine and authenticated workspace-center model:

- Seat configuration → semantic Seat divisions;
- Planning/Working context → authenticated workspace state;
- approvals → authorized workflow surfaces;
- artifacts → evidence/workspace surfaces;
- status/recovery → reason-bearing machine/workspace state;
- Settings → authenticated world-map category surface.

No replacement surface may be introduced merely as a renamed Command Deck.

## Historical-source boundary

The following may remain as historical evidence:

- Command Deck implementation files;
- Command Deck contracts/storyboards;
- prior Command Deck tests;
- prior Command Deck commits and PRs;
- prior route/deployment descriptions.

Those materials must not be treated as current product guidance unless a later Product Law decision explicitly reactivates a concept.

## Relationship to current frontend machine

Retiring the Command Deck does not reduce the scope of the 3D Hero machine. The machine remains responsible for the final product experience of trees, branches, divisions, expansion, semantic connections, camera travel, configuration, and turn-loop contribution visualization.

The retirement is therefore a surface-authority correction, not permission to remove unfinished spatial capabilities.

## Evolution rule

Any future proposal to restore, reuse, rename, or republish the Command Deck concept requires an explicit Product Law decision and reconciliation across the current experience baseline, deployment map, Tree Census, Masterplan, Issue #278, implementation, and verification evidence.