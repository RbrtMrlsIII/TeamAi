# TeamAi 3D Hero — Theme-to-Spatial Mapping

Status: planning/implementation-entry knowledge. Active TEAM-EXPERIENCE-029 implementation remains gated by `MASTERPLAN.md`.

## Canonical source

`frontend/spatial/theme-root.css` remains the sole theme authority. The adapter reads existing semantic values and produces renderer-safe parameters; it does not write theme state.

## Mapping contract

| Canonical semantic | Spatial interpretation |
|---|---|
| `--theme-mode` / `data-theme-mode` | selects Light-Skeuomorphic first mode or future Dark-Glassmorphic interpretation |
| `--surface-atmosphere` | environment/fill base |
| `--surface-shell` | manufactured shell/base material family |
| `--surface-panel` / `--surface-raised` | panel/raised material family where spatially represented |
| `--surface-active` / `--state-focus` | active/focus light elevation and local emphasis |
| `--accent` | restrained primary material/light semantic accent |
| `--signal` | contribution/semantic signal family |
| `--status-*` | reason-bearing status presentation; never color-only authority |
| `--motion-duration-*` | renderer transition duration inputs through the shared Motion vocabulary |
| `--motion-ease-*` | renderer transition easing inputs through Transition/Animation ownership |
| `--motion-delay-*` | staged choreography delay vocabulary |
| `--motion-travel` | restrained spatial travel; zero under reduced motion |
| `data-density` / spacing tokens | seat/workspace framing and density adaptation |
| `data-motion="reduced"` | suppress continuous drift/nonessential choreography while preserving semantic state |

## Bounded outputs

The adapter exposes deterministic values for environmental fill, workspace key intensity family, grazing/rim strength, contribution-light base, material roughness/reflectance family, shadow/contact separation, emissive bounds, and reduced-motion behavior.

No output may authorize an action, select the scheduler's next participant, write Firestore, mutate auth/entitlement, invoke a provider, or expose provider-private state.

## Light-skeomorphic first implementation

The first spatial interpretation emphasizes soft environmental illumination, readable manufactured surfaces, contact/depth separation, restrained local Seat lighting, and directional contribution light. Avoid generic glass material, decorative bloom as a primary form cue, or page-local timing constants.

## Dark mode boundary

Dark mode must use the same semantic inputs and adapter contract but may later map to a controlled glass/reflective material family. The existence of a dark mapping does not authorize implementing dark-glassmorphism before its dedicated slice.

## Verification contract

For the first implementation slice, prove the adapter is pure and deterministic; all required semantics are consumed; outputs are bounded; Light and Dark modes are distinct; reduced motion disables nonessential travel/choreography; and no second root is introduced. Browser/visual proof belongs to the later environment-light implementation slice.
