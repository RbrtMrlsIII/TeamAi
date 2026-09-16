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
  const transitional = () => targetAmount > startAmount ? 'opening' : targetAmount < startAmount ? 'closing' : settled(currentAmount);
  return Object.freeze({
    getState() { return state; },
    setTarget(next, now = null) {
      if (now !== null && startedAt !== null) this.sample(now);
      const nextAmount = next === 'expanded' ? 1 : 0;
      startAmount = currentAmount;
      targetAmount = nextAmount;
      startedAt = now === null ? startedAt : Number(now);
      state = transitional();
    },
    sample(now) {
      const timestamp = Number(now) || 0;
      if (startedAt === null) startedAt = timestamp;
      const travel = Math.min(1, Math.max(0, timestamp - startedAt) / ms);
      const linear = startAmount + (targetAmount - startAmount) * travel;
      currentAmount = ease(linear);
      const done = travel >= 1;
      state = done ? settled(currentAmount) : transitional();
      if (done) startAmount = currentAmount = targetAmount;
      return Object.freeze({ amount: currentAmount, state, done });
    },
    restart(now = 0) {
      startedAt = Number(now) || 0;
      startAmount = currentAmount;
      state = settled(currentAmount);
    },
  });
}

export function interpolateBranchRadius(collapsed, expanded, amount) {
  const a = clamp(amount);
  return Number(collapsed) + (Number(expanded) - Number(collapsed)) * a;
}

export function interpolateCamera(from, to, amount) {
  if (!from || !to) return null;
  const a = ease(clamp(amount));
  const lerp = (left, right) => Number(left) + (Number(right) - Number(left)) * a;
  const point = (left, right) => ({
    x: lerp(left.x, right.x),
    y: lerp(left.y, right.y),
    z: lerp(left.z, right.z),
  });
  return Object.freeze({
    cameraId: to.cameraId,
    branchId: to.branchId,
    seatIndex: to.seatIndex ?? null,
    role: to.role,
    fov: lerp(from.fov ?? 35, to.fov ?? 35),
    position: Object.freeze(point(from.position, to.position)),
    target: Object.freeze(point(from.target, to.target)),
  });
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
