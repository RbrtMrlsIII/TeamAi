const clamp = (value) => Math.min(1, Math.max(0, Number(value) || 0));
const ease = (t) => t * t * (3 - 2 * t);

export function createMachineAnimation({ duration = 900, initial = 'collapsed' } = {}) {
  const ms = Math.max(1, Number(duration) || 900);
  let currentAmount = initial === 'expanded' ? 1 : 0;
  let startAmount = currentAmount;
  let targetAmount = currentAmount;
  let startedAt = null;
  let state = currentAmount === 1 ? 'expanded' : 'collapsed';
  const settled = (amount) => amount === 0 ? 'collapsed' : amount === 1 ? 'expanded' : targetAmount > amount ? 'opening' : 'closing';
  return Object.freeze({
    getState() { return state; },
    setTarget(next, now = null) {
      if (now !== null && startedAt !== null) this.sample(now);
      const nextAmount = next === 'expanded' ? 1 : 0;
      startAmount = currentAmount;
      targetAmount = nextAmount;
      startedAt = now === null ? startedAt : Number(now);
      if (targetAmount > currentAmount) state = 'opening';
      else if (targetAmount < currentAmount) state = 'closing';
      else state = settled(currentAmount);
    },
    sample(now) {
      const timestamp = Number(now) || 0;
      if (startedAt === null) startedAt = timestamp;
      const travel = Math.min(1, Math.max(0, timestamp - startedAt) / ms);
      const linear = startAmount + (targetAmount - startAmount) * travel;
      currentAmount = ease(linear);
      const done = travel >= 1;
      state = done ? settled(currentAmount) : (targetAmount > startAmount ? 'opening' : 'closing');
      if (done) startAmount = currentAmount = targetAmount;
      return Object.freeze({ amount: currentAmount, state, done });
    },
    restart(now = 0) {
      startedAt = Number(now) || 0;
      startAmount = currentAmount;
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
