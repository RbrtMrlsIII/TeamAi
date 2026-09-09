# TeamAi 3D Hero — DOM chrome absorption plan

**Status:** Living plan (presentation only · **no 029-released claim**)  
**Authority:** Machine Interaction Contract · Camera Follow Contract · Product Law Family J

## 1. Problem

Live Hero still shows **normal-web DOM** beside the machine (seat/config stack, camera preset buttons, Open engine / turn controls). Product law: product controls live **inside** the gear/machine hierarchy; only far-environment tabs (terms, privacy, contact, about) stay outside.

## 2. Inventory (interim debt)

| DOM surface (observed) | Target machine home |
|------------------------|---------------------|
| Seat / Configuration stack (Identity…Task/Evidence) | Seat shell children — retire duplicate DOM list |
| INSPECT Seat / Detail / Back / Next | Tree navigation faces or camera docks (Cam-2+) |
| Wide / Low orbit / Team / Workspace / Map | Named docks bound to center targets only; drop lock-only presets |
| Open engine / Start turn loop | Workspace / turn gear inside R0–R1 |
| Status strip / orient readout | Minimal presentation chrome OK or in-machine readout |

## 3. Execution order (slices)

1. **Hide-or-gate DOM** behind `data-hero-machine-ui=1` when hierarchy open (soft)
2. **Map each DOM action** to existing hierarchy keyboard/API (already largely wired)
3. **Remove duplicate labels** once faces are readable (depth FOV + plate scale)
4. **Retire lock-only camera buttons** that ignore open tree
5. **Far-environment only** outside the canvas shell

## 4. Non-goals

- Not a second permission system
- Not Firebase Auth / commerce authority
- Not freezing FOV numbers (§9 remains learnable)

## 5. Verification

- Playwright: hierarchy open → primary product actions reachable without DOM stack (or DOM stack `aria-hidden`)
- Unit: this doc linked from checkpoints / NEXT_SLICES
