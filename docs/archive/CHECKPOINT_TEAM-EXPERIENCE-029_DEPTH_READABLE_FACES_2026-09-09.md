# Checkpoint — Depth-readable faces (2026-09-09)

**Slice:** General tree face readability (FOV + scale helpers)  
**Prior:** Static flex path #195  
**Claim:** presentation only · **no 029-released claim**

## Delivered

- `public/hero-depth-readable-faces.js` — `depthReadableFovBoost`, `depthReadableFaceScale`
- Named boosts: `TREE_FACE_FOV_BOOST` (2.5°), `TREE_LEAF_FOV_BOOST` (3.5°)
- Apply wires into `responsiveFovBoost` stack with setup-ring FOV

## Next

- Absorb interim DOM chrome into machine trees
- Plate-scale draw use of `depthReadableFaceScale`
