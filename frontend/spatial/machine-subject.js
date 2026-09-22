/**
 * Neutral semantic subject/bounds derivation used by the canonical renderer.
 * Geometry infrastructure only. It does not own a preview scene.
 */
export function deriveMachineSubject(parts, padding = 0.12) {
  const candidates = (Array.isArray(parts) ? parts : []).filter(Boolean);
  if (!candidates.length) return null;
  const bounds = candidates.reduce((acc, part) => {
    const half = {
      x: part.dimensions.x / 2,
      y: part.dimensions.y / 2,
      z: part.dimensions.z / 2,
    };
    acc.minX = Math.min(acc.minX, part.center.x - half.x);
    acc.minY = Math.min(acc.minY, part.center.y - half.y);
    acc.minZ = Math.min(acc.minZ, part.center.z - half.z);
    acc.maxX = Math.max(acc.maxX, part.center.x + half.x);
    acc.maxY = Math.max(acc.maxY, part.center.y + half.y);
    acc.maxZ = Math.max(acc.maxZ, part.center.z + half.z);
    return acc;
  }, { minX: Infinity, minY: Infinity, minZ: Infinity, maxX: -Infinity, maxY: -Infinity, maxZ: -Infinity });
  const pad = Math.max(0, Number(padding) || 0);
  return {
    kind: 'semantic-subject',
    sourcePartIds: candidates.map(({ id }) => id),
    min: { x: bounds.minX - pad, y: bounds.minY - pad, z: bounds.minZ - pad },
    max: { x: bounds.maxX + pad, y: bounds.maxY + pad, z: bounds.maxZ + pad },
    center: {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
      z: (bounds.minZ + bounds.maxZ) / 2,
    },
  };
}
