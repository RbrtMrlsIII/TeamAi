# Machine Hero camera authority matrix

> TEMPO / EVIDENCE SUPPORT. This document does not promote the current Hero implementation into governed architecture. The governing law is Issue #340 and the proof matrix is Issue #341.

## Observed authority layers

| Situation | Camera identity owner | Camera target owner | Required invariant |
| --- | --- | --- | --- |
| Closed hierarchy | named baseline camera resolver | world baseline target | no semantic branch subject is active |
| Hierarchy-open Seat | hierarchy camera resolver | semantic subject when available | subject follows active geometry |
| Explicit named-camera command, no semantic subject | explicit command | named camera configuration | command must remain observable |
| Explicit named-camera command, semantic subject active | explicit command for camera identity; semantic subject for target when contract says so | semantic subject | identity and target are independently testable |
| Hierarchy close | close/baseline transition | world baseline target | stale branch subject cannot persist |

## Known tempo collision

The current apply layer historically replaces a direct `setCamera('SEAT_CLOSE')` call with `resolveTreeCamera(...)`, and the browser evidence shows the same pattern can force `HERO_WIDE` where a direct named-camera assertion expects `SEAT_CLOSE`. A second browser case shows `setCamera('OVERHEAD_MAP')` is also subsequently observed as `HERO_WIDE`.

This demonstrates a camera-authority collision. It does not prove that semantic-subject targeting is wrong.

## Decision boundary

A future machine implementation should separate:

1. camera identity/configuration;
2. semantic subject identity and footprint;
3. camera target derived from that subject.

A camera preset may own configuration such as position/FOV. It must not become the hidden source of semantic subject identity.

## Evidence requirement

Before promotion, prove independently:

- named camera identity persists when no semantic subject is active;
- hierarchy resolution selects the intended camera configuration when hierarchy state requires it;
- a semantic subject changes camera target without silently changing camera configuration;
- geometry mutation moves the subject and therefore the target;
- closing the hierarchy clears the branch subject and returns to the governed baseline;
- invalid semantic input fails closed.

## Classification

All implementation and CI observations supporting this matrix remain TEMPO unless Issue #341 is satisfied and a governed project decision explicitly promotes the resulting contract.
