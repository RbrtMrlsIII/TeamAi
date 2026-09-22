export const WORKSPACE_CENTER_ID = 'WORKSPACE_CENTER';
export const WORKSPACE_CORE_GEOMETRY_ID = 'WORKSPACE_CORE:GEOMETRY';

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

export function deriveWorkspaceCoreGeometry({
  workspaceRadius = 1,
  expansionAmount = 0,
  target = { x: 0, y: 0.5, z: 0 },
} = {}) {
  const radius = Math.max(0.6, finite(workspaceRadius, 1));
  const expansion = Math.max(0, Math.min(1, finite(expansionAmount, 0)));
  const center = Object.freeze({
    x: finite(target?.x, 0),
    y: finite(target?.y, 0.5),
    z: finite(target?.z, 0),
  });
  return Object.freeze({
    id: WORKSPACE_CORE_GEOMETRY_ID,
    center,
    radius: radius * (0.68 + 0.08 * expansion),
    innerRadius: radius * (0.44 + 0.05 * expansion),
    target: WORKSPACE_CENTER_ID,
    expansionAmount: expansion,
    presentationOnly: true,
  });
}
