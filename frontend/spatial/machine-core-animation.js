const clamp = (value) => Math.min(1, Math.max(0, Number(value) || 0));
const ease = (t) => t * t * (3 - 2 * t);

export function createMachineAnimation({ duration = 900, initial = 'collapsed' } = {}) {
  const ms = Math.max(1, Number(duration) || 900);
  let state = initial === 'expanded' ? 'expanded' : 'collapsed';
  let start = state === 'expanded' ? 1 : 0;
  let target = start;
  let startedAt = 0;
  return Object.freeze({
    getState() { return state; },
    setTarget(next) {
      target = next === 'expanded' ? 1 : 0;
      state = target > start ? 'opening' : target < start ? 'closing' : state;
    },
    sample(now) {
      if (!startedAt) startedAt = Number(now) || 0;
      const elapsed = Math.max(0, (Number(now) || 0) - startedAt);
      const progress = clamp(start + (target - start) * Math.min(1, elapsed / ms));
      const amount = ease(progress);
      if (amount === 0) state = 'collapsed';
      if (amount === 1) state = 'expanded';
      if (progress === target) start = target;
      return Object.freeze({ amount, state, done: progress === target });
    },
    restart(now = 0) {
      startedAt = Number(now) || 0;
      start = start === target ? target : start;
    },
  });
}

export function interpolateBranchRadius(collapsed, expanded, amount) {
  const a = clamp(amount);
  return Number(collapsed) + (Number(expanded) - Number(collapsed)) * a;
}

export function deriveAnimationFrame(core, amount) {
  if (!core) return null;
  const radiusScale = interpolateBranchRadius(1, 1.12, amount);
  return Object.freeze({
    amount: clamp(amount),
    radiusScale,
    parts: Object.freeze(core.parts.map((part) => {
      if (part.kind === 'hub') return part;
      return Object.freeze({ ...part, animationAmount: clamp(amount), animatedRadius: Math.hypot(part.center.x, part.center.z) * radiusScale });
    })),
  });
}
