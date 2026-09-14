# Seat-1 adjacent wiring render slice — #331

This note records the bounded implementation introduced by PR #331.

The existing `TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING` semantic seam is now consumed by the canonical Seat render path during the `SEAT_BEHAVIOR` expansion state. Its endpoints are derived from stable semantic division ports and payload-driven geometry rather than fixed whole-Hero coordinates.

The rendered path is presentation-only. It does not grant authorization, entitlement, provider execution, scheduler authority, or durable-domain write authority.

The slice deliberately does **not** claim final turn-loop electrical choreography, complete inter-division topology, final adaptive geometry, or final animation timing law.
