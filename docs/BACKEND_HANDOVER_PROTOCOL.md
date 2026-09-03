# TeamAi Target-Project Handover Protocol

## Hard rule
A completed backend gate is not considered surrendered until TeamAi produces a target-project handover package/ZIP in the same execution.

The handover belongs to **TeamAi**, the consuming/target project. Universal ToolKit does not hand over TeamAi and does not own TeamAi project state.

## Required handover contents
Each gate handover must contain, at minimum:

- current `PRODUCT_LAW.md`, `MASTERPLAN.md`, and `AI_ASSISTANT_READ_ME.md`;
- current backend contracts and relevant source files;
- validation/evidence records;
- checkpoint and human-readable handover record;
- explicit gate status, blockers, and next gate;
- source revision/commit and packet scope manifest.

A full repository snapshot is preferred. If unavailable, the packet must explicitly identify itself as a scoped gate packet and must not imply full-repository parity.

## Boundary
ToolKit supplies reusable process skills only. Project laws, provider choices, commerce rules, domain schemas, credentials, implementation details, and the handover artifact remain TeamAi-owned.

## Advance rule
A gate may be marked `ADVANCED` only when its evidence is complete and the corresponding target-project handover package has been produced.

A blocked/parked gate may have a pause note, but that does not count as a completed-gate handover.
