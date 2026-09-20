# PRODUCT-KNOWLEDGE — validated concepts

**Role:** distilled, reusable TeamAi concepts and evidence-backed lessons.  
**Not:** session-specific state, roadmap, Issue log, PR log, deployment inventory, or authority source.

## Stable concepts

### Authority
Human authority is highest. `Product_Law/PRODUCT_LAW.md` owns product meaning and protected architecture. Lower layers cannot elevate themselves through recency, convenience, tooling, or test output.

### Separation
`application ≠ provider ≠ runtime ≠ model ≠ connection ≠ Seat ≠ skill ≠ capability/tool ≠ workspace ≠ entitlement ≠ authorization`.

### Durable truth
UI state, memory, deployment presence, or a passing local check cannot substitute for authoritative durable state or environment-specific proof.

### Skills
A Skill is reusable procedure, not permission. Better procedure does not expand authority.

### Branches
A Git branch is a contribution surface, not product authority. `main` is the assembled repository state.

### Validation
A test proves only the behavior it exercises. When truth intentionally changes, change the canonical contract first and then make validation strict against the new truth. Before changing a validator or test, preserve the old invariant explicitly as retained or obsolete and define the replacement invariant.

### Documentation
Canonical documents each have one job. Repeating the same rule across multiple active files creates drift risk. Historical material belongs in `docs/archive/` and `handover/` and is not a current source.

### Session continuity
Session-specific state must be explicit, compact, and updated at every substantive transition. `AI_ASSISTANT_READ_ME.md` is the live continuity boundary. Historical handover material is not an active operating manual.

### 3D machine
Semantic identity precedes payload, payload precedes geometry, geometry precedes expansion/topology, topology precedes camera and animation. Coordinates and camera presets do not define product identity.

### Machine interaction
Expansion is physical state. Camera targets follow semantic geometry. Wiring follows semantic ports/topology. UI belongs to the branch it configures.

### Release discipline
Green CI is evidence, not automatic promotion. Product acceptance is a separate decision. A safer replacement is preferred over preserving obsolete implementation merely for continuity.

### AI advisory token efficiency

Past reviewer experiments showed that a fixed TeamAi generation ceiling can cause `finish_reason=length` and that increasing a ceiling does not guarantee completion. Because `openrouter/free` dynamically routes across heterogeneous models/providers, generation and reasoning limits are not durable TeamAi-wide invariants. The durable pattern is to keep generation/reasoning provider-native, bound only the structured report contract and packet safety, select context by authority relevance, and preserve per-slot usage, finish, HTTP-status, provenance, provider-error, and publication telemetry. Workflow success, transport success, publication, and substantive review quality must remain separate signals.

## Anti-patterns

- Duplicate active roadmaps.
- Duplicate active session guides.
- Parallel Skill namespaces.
- Validators edited merely to turn red to green.
- Static documents carrying current state forever without an update rule.
- Provider/tool/Skill output treated as authority.
- Browser presentation treated as backend proof.
- Historical records rewritten to match newer truth.
