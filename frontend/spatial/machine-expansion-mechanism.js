/**
 * TEAM-EXPERIENCE-029 / S5
 * Stateful mechanical expansion + geometry-aware clearance.
 *
 * This module is presentation-only. It consumes S4 authored division
 * assemblies and world geometry, then constrains mechanical travel without
 * inventing semantic identity or backend authority.
 */
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';
import { createMachineAnimation } from './machine-core-animation.js';
import { deriveMachineSubject } from './machine-subject.js';
import { deriveFocusedSeatDivisionGeometry } from './machine-seat-division-presentation.js';
import { deriveMachineSeatDivisionAssembly } from './machine-seat-division-assembly.js';

export const MACHINE_EXPANSION_PHASE = Object.freeze({
  CLOSED: 'CLOSED',
  PREPARING: 'PREPARING',
  OPENING: 'OPENING',
  ACTIVE: 'ACTIVE',
  CLOSING: 'CLOSING',
  CLEARANCE_LIMITED: 'CLEARANCE_LIMITED',
});

const ROOT_OWNER = 'frontend/spatial/machine-expansion-mechanism.js';

export function toMachineDisplayState(phase, amount = 0) {
  const value = String(phase || '').toUpperCase();
  const progress = clamp01(amount);
  if (value === MACHINE_EXPANSION_PHASE.CLOSED) return 'collapsed';
  if (value === MACHINE_EXPANSION_PHASE.CLOSING) return 'closing';
  if (value === MACHINE_EXPANSION_PHASE.ACTIVE) return 'expanded';
  if (value === MACHINE_EXPANSION_PHASE.CLEARANCE_LIMITED) {
    return progress >= 0.999 ? 'expanded' : 'opening';
  }
  if (value === MACHINE_EXPANSION_PHASE.PREPARING || value === MACHINE_EXPANSION_PHASE.OPENING) {
    return 'opening';
  }
  return progress <= 0.001 ? 'collapsed' : progress >= 0.999 ? 'expanded' : 'opening';
}

function rootContext(semanticId) {
  return createSpatialConstructionContext({
    slice: 'S5',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

function subjectBounds(subject, padding = 0) {
  if (!subject?.min || !subject?.max) return null;
  const pad = Math.max(0, finite(padding));
  return Object.freeze({
    min: {
      x: finite(subject.min.x) - pad,
      y: finite(subject.min.y) - pad,
      z: finite(subject.min.z) - pad,
    },
    max: {
      x: finite(subject.max.x) + pad,
      y: finite(subject.max.y) + pad,
      z: finite(subject.max.z) + pad,
    },
  });
}

function partBounds(part, padding = 0) {
  if (!part?.center || !part?.dimensions) return null;
  const half = {
    x: Math.abs(finite(part.dimensions.x)) * 0.5,
    y: Math.abs(finite(part.dimensions.y)) * 0.5,
    z: Math.abs(finite(part.dimensions.z)) * 0.5,
  };
  const center = part.center;
  const pad = Math.max(0, finite(padding));
  return Object.freeze({
    min: {
      x: finite(center.x) - half.x - pad,
      y: finite(center.y) - half.y - pad,
      z: finite(center.z) - half.z - pad,
    },
    max: {
      x: finite(center.x) + half.x + pad,
      y: finite(center.y) + half.y + pad,
      z: finite(center.z) + half.z + pad,
    },
  });
}

function intersectsAabb(a, b, epsilon = 0.000001) {
  if (!a || !b) return false;
  return (
    a.min.x <= b.max.x + epsilon
    && a.max.x >= b.min.x - epsilon
    && a.min.y <= b.max.y + epsilon
    && a.max.y >= b.min.y - epsilon
    && a.min.z <= b.max.z + epsilon
    && a.max.z >= b.min.z - epsilon
  );
}

function interpolateBounds(start, end, amount) {
  const t = clamp01(amount);
  return Object.freeze({
    min: {
      x: start.min.x + (end.min.x - start.min.x) * t,
      y: start.min.y + (end.min.y - start.min.y) * t,
      z: start.min.z + (end.min.z - start.min.z) * t,
    },
    max: {
      x: start.max.x + (end.max.x - start.max.x) * t,
      y: start.max.y + (end.max.y - start.max.y) * t,
      z: start.max.z + (end.max.z - start.max.z) * t,
    },
  });
}

function interpolatePoint(start, end, amount) {
  const t = clamp01(amount);
  return Object.freeze({
    x: finite(start.x) + (finite(end.x) - finite(start.x)) * t,
    y: finite(start.y) + (finite(end.y) - finite(start.y)) * t,
    z: finite(start.z) + (finite(end.z) - finite(start.z)) * t,
  });
}

function makeCorridorReservation(corridor, clearance = 0.16) {
  if (!corridor?.start || !corridor?.end) return null;
  const start = corridor.start;
  const end = corridor.end;
  const pad = Math.max(0.025, finite(corridor.radius, 0.07) + Math.max(0, finite(clearance)));
  const length = Math.hypot(
    finite(end.x) - finite(start.x),
    finite(end.y) - finite(start.y),
    finite(end.z) - finite(start.z),
  );
  return Object.freeze({
    start: Object.freeze({ x: finite(start.x), y: finite(start.y), z: finite(start.z) }),
    end: Object.freeze({ x: finite(end.x), y: finite(end.y), z: finite(end.z) }),
    length,
    radius: Math.max(0.025, finite(corridor.radius, 0.07)),
    bounds: Object.freeze({
      min: {
        x: Math.min(finite(start.x), finite(end.x)) - pad,
        y: Math.min(finite(start.y), finite(end.y)) - pad,
        z: Math.min(finite(start.z), finite(end.z)) - pad,
      },
      max: {
        x: Math.max(finite(start.x), finite(end.x)) + pad,
        y: Math.max(finite(start.y), finite(end.y)) + pad,
        z: Math.max(finite(start.z), finite(end.z)) + pad,
      },
    }),
    reserved: true,
    presentationOnly: true,
  });
}

function resolveMaxSafeAmount(startBounds, endBounds, obstacles, clearance, samples = 64) {
  const normalizedObstacles = Array.isArray(obstacles) ? obstacles.filter(Boolean) : [];
  const pad = Math.max(0, finite(clearance));

  const collidesAt = (amount) => {
    const candidate = interpolateBounds(startBounds, endBounds, amount);
    return normalizedObstacles.some((obstacle) =>
      intersectsAabb(candidate, obstacle, pad),
    );
  };

  if (collidesAt(0)) {
    return Object.freeze({
      maxSafeAmount: 0,
      firstCollisionAmount: 0,
      collision: true,
      clearanceSatisfiedAtClosed: false,
    });
  }

  let previousSafe = 0;
  for (let index = 1; index <= samples; index += 1) {
    const amount = index / samples;
    if (!collidesAt(amount)) {
      previousSafe = amount;
      continue;
    }

    let low = previousSafe;
    let high = amount;
    for (let iteration = 0; iteration < 18; iteration += 1) {
      const mid = (low + high) * 0.5;
      if (collidesAt(mid)) high = mid;
      else low = mid;
    }

    return Object.freeze({
      maxSafeAmount: Math.max(0, Math.min(1, low)),
      firstCollisionAmount: Math.max(0, Math.min(1, high)),
      collision: true,
      clearanceSatisfiedAtClosed: true,
    });
  }

  return Object.freeze({
    maxSafeAmount: 1,
    firstCollisionAmount: null,
    collision: false,
    clearanceSatisfiedAtClosed: true,
  });
}

export function deriveMachineExpansionClearancePlan({
  startSubject,
  endSubject,
  obstacles = [],
  clearance = 0.16,
  corridor = null,
} = {}) {
  const startBounds = subjectBounds(startSubject);
  const endBounds = subjectBounds(endSubject);
  if (!startBounds || !endBounds) {
    return Object.freeze({
      valid: false,
      maxSafeAmount: 0,
      firstCollisionAmount: 0,
      collision: true,
      clearanceSatisfiedAtClosed: false,
      travelDistance: 0,
      corridorReservation: null,
      reason: 'MISSING_SUBJECT_BOUNDS',
    });
  }

  const result = resolveMaxSafeAmount(
    startBounds,
    endBounds,
    Array.isArray(obstacles) ? obstacles : [],
    clearance,
  );

  const startCenter = startSubject.center || {
    x: (startBounds.min.x + startBounds.max.x) * 0.5,
    y: (startBounds.min.y + startBounds.max.y) * 0.5,
    z: (startBounds.min.z + startBounds.max.z) * 0.5,
  };
  const endCenter = endSubject.center || {
    x: (endBounds.min.x + endBounds.max.x) * 0.5,
    y: (endBounds.min.y + endBounds.max.y) * 0.5,
    z: (endBounds.min.z + endBounds.max.z) * 0.5,
  };

  return Object.freeze({
    valid: true,
    maxSafeAmount: result.maxSafeAmount,
    firstCollisionAmount: result.firstCollisionAmount,
    collision: result.collision,
    clearanceSatisfiedAtClosed: result.clearanceSatisfiedAtClosed,
    travelDistance: Math.hypot(
      finite(endCenter.x) - finite(startCenter.x),
      finite(endCenter.y) - finite(startCenter.y),
      finite(endCenter.z) - finite(startCenter.z),
    ),
    travelAtMaxSafeAmount: Math.hypot(
      finite(endCenter.x) - finite(startCenter.x),
      finite(endCenter.y) - finite(startCenter.y),
      finite(endCenter.z) - finite(startCenter.z),
    ) * result.maxSafeAmount,
    startBounds,
    endBounds,
    corridorReservation: makeCorridorReservation(corridor, clearance),
    obstacleCount: Array.isArray(obstacles) ? obstacles.length : 0,
    ...rootContext('S5:EXPANSION_CLEARANCE'),
    presentationOnly: true,
  });
}

export function deriveMachineSeatDivisionExpansionPlan({
  parent,
  childId,
  childIndex = 0,
  obstacles = [],
  clearance = 0.16,
  workspaceTarget = { x: 0, y: 0.5, z: 0 },
} = {}) {
  if (!parent || !childId) return null;

  const startGeometry = deriveFocusedSeatDivisionGeometry({
    parent,
    childId,
    childIndex,
    amount: 0,
    workspaceTarget,
  });
  const endGeometry = deriveFocusedSeatDivisionGeometry({
    parent,
    childId,
    childIndex,
    amount: 1,
    workspaceTarget,
  });
  if (!startGeometry || !endGeometry) return null;

  const startAssembly = deriveMachineSeatDivisionAssembly({
    parent,
    childId,
    childIndex,
    amount: 0,
    geometry: startGeometry,
  });
  const endAssembly = deriveMachineSeatDivisionAssembly({
    parent,
    childId,
    childIndex,
    amount: 1,
    geometry: endGeometry,
  });
  if (!startAssembly?.subject || !endAssembly?.subject) return null;

  const plan = deriveMachineExpansionClearancePlan({
    startSubject: startAssembly.subject,
    endSubject: endAssembly.subject,
    obstacles: Array.isArray(obstacles)
      ? obstacles.map((obstacle) =>
        obstacle?.min && obstacle?.max
          ? obstacle
          : partBounds(obstacle, clearance),
      ).filter(Boolean)
      : [],
    clearance,
    corridor: endGeometry.corridor,
  });

  const cameraEnvelope = Object.freeze({
    min: {
      x: Math.min(startAssembly.subject.min.x, endAssembly.subject.min.x),
      y: Math.min(startAssembly.subject.min.y, endAssembly.subject.min.y),
      z: Math.min(startAssembly.subject.min.z, endAssembly.subject.min.z),
    },
    max: {
      x: Math.max(startAssembly.subject.max.x, endAssembly.subject.max.x),
      y: Math.max(startAssembly.subject.max.y, endAssembly.subject.max.y),
      z: Math.max(startAssembly.subject.max.z, endAssembly.subject.max.z),
    },
  });

  return Object.freeze({
    id: `EXPANSION:DIVISION:${parent.branchId}:${childId}`,
    parentBranchId: parent.branchId,
    childId: String(childId),
    childIndex: Math.max(0, Number(childIndex) || 0),
    startAmount: 0,
    targetAmount: 1,
    startGeometry,
    endGeometry,
    startAssembly,
    endAssembly,
    clearancePlan: plan,
    cameraSubject: endAssembly.subject,
    cameraEnvelope,
    semanticContinuity: true,
    payloadDrivenTravel: plan.travelDistance > 0,
    collisionAvoidance: true,
    corridorReserved: Boolean(plan.corridorReservation),
    ...rootContext('EXPANSION:DIVISION:' + parent.branchId + ':' + childId),
    presentationOnly: true,
  });
}

export function resolveMachineExpansionAmount(rawAmount, plan) {
  const requested = clamp01(rawAmount);
  const maxSafe = clamp01(plan?.clearancePlan?.maxSafeAmount ?? 0);
  return Math.min(requested, maxSafe);
}

export function createMachineExpansionMechanism({
  duration = 950,
  initialOpen = false,
} = {}) {
  const animation = createMachineAnimation({
    duration,
    initial: initialOpen ? 'expanded' : 'collapsed',
  });
  let targetOpen = Boolean(initialOpen);
  let interruptionPending = false;
  let previousTargetOpen = targetOpen;
  let preparing = !initialOpen;

  const setTarget = (nextOpen, now = 0) => {
    const next = Boolean(nextOpen);
    if (next !== targetOpen) {
      const current = animation.sample(now);
      interruptionPending = current.done === false;
      previousTargetOpen = targetOpen;
      targetOpen = next;
      preparing = next;
      animation.setTarget(next ? 'expanded' : 'collapsed', now);
    }
    return Object.freeze({
      targetOpen,
      interrupted: interruptionPending,
      previousTargetOpen,
    });
  };

  const sample = (now = 0, {
    maxSafeAmount = 1,
    reducedMotion = false,
  } = {}) => {
    const safe = clamp01(maxSafeAmount);
    const base = reducedMotion
      ? Object.freeze({
        amount: targetOpen ? safe : 0,
        done: true,
      })
      : animation.sample(now);
    const amount = targetOpen
      ? Math.min(clamp01(base.amount), safe)
      : clamp01(base.amount);
    let phase;
    if (!targetOpen && amount <= 0) phase = MACHINE_EXPANSION_PHASE.CLOSED;
    else if (targetOpen && safe < 0.999 && amount >= safe) phase = MACHINE_EXPANSION_PHASE.CLEARANCE_LIMITED;
    else if (base.done && targetOpen && amount >= 0.999) phase = MACHINE_EXPANSION_PHASE.ACTIVE;
    else if (targetOpen) phase = MACHINE_EXPANSION_PHASE.OPENING;
    else phase = MACHINE_EXPANSION_PHASE.CLOSING;

    const interrupted = interruptionPending;
    interruptionPending = false;
    const phaseValue = targetOpen && preparing && base.amount <= 0.001 && !reducedMotion
      ? MACHINE_EXPANSION_PHASE.PREPARING
      : phase;
    if (phaseValue !== MACHINE_EXPANSION_PHASE.CLOSED && phaseValue !== MACHINE_EXPANSION_PHASE.PREPARING) {
      preparing = false;
    }

    return Object.freeze({
      amount,
      phase: phaseValue,
      targetOpen,
      interrupted,
      done: Boolean(base.done),
      clearanceLimited: targetOpen && safe < 0.999,
      maxSafeAmount: safe,
      presentationOnly: true,
    });
  };

  return Object.freeze({
    constructionContext: rootContext('S5:EXPANSION_MECHANISM'),
    setTarget,
    sample,
    getTarget() { return targetOpen; },
  });
}

export function resolveMachineFocusedExpansionPhase({
  rawAmount = 0,
  resolvedAmount = 0,
  hierarchyPhase = '',
  reducedMotion = false,
} = {}) {
  const raw = clamp01(rawAmount);
  const resolved = clamp01(resolvedAmount);
  if (raw <= 0.001 && resolved <= 0.001) return MACHINE_EXPANSION_PHASE.CLOSED;
  if (resolved + 0.001 < raw) return MACHINE_EXPANSION_PHASE.CLEARANCE_LIMITED;
  if (String(hierarchyPhase) === 'division_closing') return MACHINE_EXPANSION_PHASE.CLOSING;
  if (reducedMotion && resolved >= 0.999) return MACHINE_EXPANSION_PHASE.ACTIVE;
  if (resolved >= 0.999) return MACHINE_EXPANSION_PHASE.ACTIVE;
  if (resolved > 0.001) return MACHINE_EXPANSION_PHASE.OPENING;
  return MACHINE_EXPANSION_PHASE.CLOSED;
}

export function subjectAtExpansionAmount(plan, amount = 0) {
  if (!plan?.startAssembly?.subject || !plan?.endAssembly?.subject) return null;
  const start = plan.startAssembly.subject;
  const end = plan.endAssembly.subject;
  const t = clamp01(amount);
  return Object.freeze({
    ...rootContext('S5:SEMANTIC_EXPANSION_SUBJECT'),
    kind: 'semantic-expansion-subject',
    sourcePartIds: [...new Set([...(start.sourcePartIds || []), ...(end.sourcePartIds || [])])],
    min: interpolatePoint(start.min, end.min, t),
    max: interpolatePoint(start.max, end.max, t),
    center: interpolatePoint(start.center, end.center, t),
  });
}
