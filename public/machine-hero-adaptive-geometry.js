const clamp01 = (value) => Math.min(1, Math.max(0, Number(value) || 0));
const safeCount = (value) => Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0);
const payloadDensity = (value) => {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return Math.max(0, numeric);
  return value === 'compact' ? 0.82 : 1;
};

export function deriveMachineExpansionProfile(part = {}, { clearance = 0.16 } = {}) {
  const base = part?.dimensions || { x: 1, y: 1, z: 1 };
  const payload = part?.payload || {};
  const labels = Array.isArray(payload.labels) ? payload.labels : [];
  const controls = safeCount(payload.controls);
  const density = payloadDensity(payload.density);
  const labelLoad = Math.min(1.8, labels.length * 0.18);
  const controlLoad = Math.min(1.8, controls * 0.12);
  const densityLoad = Math.min(2.0, density * 0.10);
  const contentLoad = labelLoad + controlLoad + densityLoad;
  const normalizedLoad = clamp01(contentLoad / 4.5);
  const clearanceValue = Math.max(0, Number(clearance) || 0);
  const expanded = {
    x: Math.max(base.x, base.x + 0.24 + contentLoad * 0.34),
    y: Math.max(base.y, base.y + 0.06 + contentLoad * 0.10),
    z: Math.max(base.z, base.z + 0.12 + contentLoad * 0.22),
  };
  return Object.freeze({
    collapsed: Object.freeze({ ...base }),
    expanded: Object.freeze(expanded),
    normalizedLoad,
    contentLoad,
    clearance: clearanceValue,
  });
}

export function interpolateMachineDimensions(profile, amount = 0) {
  const a = clamp01(amount);
  const collapsed = profile?.collapsed || { x: 1, y: 1, z: 1 };
  const expanded = profile?.expanded || collapsed;
  return {
    x: collapsed.x + (expanded.x - collapsed.x) * a,
    y: collapsed.y + (expanded.y - collapsed.y) * a,
    z: collapsed.z + (expanded.z - collapsed.z) * a,
  };
}

export function deriveExpansionShift(profile, { direction = 1, axis = 'x' } = {}) {
  const sign = Number(direction) < 0 ? -1 : 1;
  const clearance = Math.max(0, Number(profile?.clearance) || 0);
  const deltaX = Math.max(0, (profile?.expanded?.x || 0) - (profile?.collapsed?.x || 0)) / 2;
  const deltaZ = Math.max(0, (profile?.expanded?.z || 0) - (profile?.collapsed?.z || 0)) / 2;
  return axis === 'z' ? { x: 0, z: sign * (deltaZ + clearance) } : { x: sign * (deltaX + clearance), z: 0 };
}
