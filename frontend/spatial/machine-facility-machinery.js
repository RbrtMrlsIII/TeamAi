/**
 * TEAM-EXPERIENCE-029 / S7
 * Specialized outer-facility machinery.
 *
 * Consumes S6 facility destinations and gives each outer machine a distinct
 * mechanical grammar. Product feature modules remain semantic authorities.
 */
import {
  createSpatialConstructionContext,
  requiredStructuralRootsForSlice,
  validateSpatialConstructionNode,
} from './machine-spatial-root-contract.js';
import { deriveMachineSubject } from './machine-subject.js';
import { deriveMachineFacilityAssemblies } from './machine-facility-assembly.js';

export const MACHINE_FACILITY_MACHINERY_ID = 'MACHINE-FACILITY-MACHINERY';
export const MACHINE_FACILITY_MACHINERY_VERSION = 'S7-V18';

const ROOT_OWNER = 'frontend/spatial/machine-facility-machinery.js';

const ANALYSIS_BARREL_OUTLINES = Object.freeze({
  'barrel-stage-1': Object.freeze([
    [0.965926, 0.258819], [0.707107, 0.707107], [0.258819, 0.965926],
    [-0.258819, 0.965926], [-0.707107, 0.707107], [-0.965926, 0.258819],
    [-0.965926, -0.258819], [-0.707107, -0.707107], [-0.258819, -0.965926],
    [0.258819, -0.965926], [0.707107, -0.707107], [0.965926, -0.258819],
  ]),
  'barrel-stage-2': Object.freeze([
    [0.951057, 0.309017], [0.587785, 0.809017], [0, 1],
    [-0.587785, 0.809017], [-0.951057, 0.309017], [-0.951057, -0.309017],
    [-0.587785, -0.809017], [0, -1], [0.587785, -0.809017], [0.951057, -0.309017],
  ]),
  'barrel-stage-3': Object.freeze([
    [0.92388, 0.382683], [0.382683, 0.92388], [-0.382683, 0.92388],
    [-0.92388, 0.382683], [-0.92388, -0.382683], [-0.382683, -0.92388],
    [0.382683, -0.92388], [0.92388, -0.382683],
  ]),
});

const OPERATIONS_FIN_OUTLINES = Object.freeze({
  primary: Object.freeze([
    [-1.00, -0.95], [-0.25, -1.00], [0.55, -0.92],
    [0.95, -0.55], [1.00, 0.15], [0.65, 0.72],
    [0.05, 1.00], [-0.70, 0.58], [-1.00, 0.05],
  ]),
  secondary: Object.freeze([
    [-1.00, -0.90], [-0.40, -1.00], [0.42, -0.96],
    [0.95, -0.48], [1.00, 0.28], [0.55, 0.78],
    [-0.10, 1.00], [-0.78, 0.55], [-1.00, 0.00],
  ]),
});

const MACHINE_CHASSIS_CORE_ROLE = Object.freeze({
  analysis: 'barrel-stage-1',
  operations: 'hinge-core',
  control: 'rotor-hub',
  'access-commerce': 'sensor-mast',
});

const MACHINE_PROFILES = Object.freeze({
  analysis: Object.freeze({
    label: 'Telescoping analysis',
    componentRoles: Object.freeze(['barrel-stage-1', 'barrel-stage-2', 'barrel-stage-3', 'focus-ring', 'analysis-lens']),
    payloadSurfaceRole: 'analysis-lens',
  }),
  operations: Object.freeze({
    label: 'Fin / structural deployment',
    componentRoles: Object.freeze(['hinge-core', 'deployment-fin', 'deployment-fin-secondary', 'clamp-ring', 'structural-spine']),
    payloadSurfaceRole: 'deployment-fin',
  }),
  control: Object.freeze({
    label: 'Rotational core / analysis',
    componentRoles: Object.freeze(['rotor-hub', 'rotor-ring', 'rotor-ring-secondary', 'analysis-chamber', 'control-collar']),
    payloadSurfaceRole: 'analysis-chamber',
  }),
  'access-commerce': Object.freeze({
    label: 'Sensor / communication',
    componentRoles: Object.freeze(['sensor-mast', 'sensor-dish', 'sensor-array', 'communication-antenna', 'signal-ring']),
    payloadSurfaceRole: 'sensor-dish',
  }),
});

function rootContext(semanticId) {
  return createSpatialConstructionContext({
    slice: 'S7',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function finite(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

export const MACHINE_FACILITY_MECHANISM_PHASE = Object.freeze({
  STOWED: 'STOWED',
  DEPLOYING: 'DEPLOYING',
  ACTIVE: 'ACTIVE',
});

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

function componentMotion(machineRole, componentRole) {
  const motion = {
    analysis: {
      'barrel-stage-2': Object.freeze({ outward: 0.12, tangent: 0, rotation: 0 }),
      'barrel-stage-3': Object.freeze({ outward: 0.24, tangent: 0, rotation: 0 }),
      'analysis-lens': Object.freeze({ outward: 0.30, tangent: 0, rotation: 0 }),
      'focus-ring': Object.freeze({ outward: 0, tangent: 0, rotation: Math.PI * 0.7 }),
    },
    operations: {
      'deployment-fin': Object.freeze({ outward: 0, tangent: 0.20, rotation: Math.PI * 0.26 }),
      'deployment-fin-secondary': Object.freeze({ outward: 0, tangent: 0.20, rotation: -Math.PI * 0.22 }),
      'structural-spine': Object.freeze({ outward: 0.08, tangent: 0, rotation: Math.PI * 0.12 }),
    },
    control: {
      'rotor-ring': Object.freeze({ outward: 0, tangent: 0, rotation: Math.PI * 1.4 }),
      'rotor-ring-secondary': Object.freeze({ outward: 0, tangent: 0, rotation: -Math.PI * 1.0 }),
      'analysis-chamber': Object.freeze({ outward: 0.05, tangent: 0, rotation: Math.PI * 0.18 }),
    },
    'access-commerce': {
      'sensor-dish': Object.freeze({ outward: 0.12, tangent: 0, rotation: Math.PI * 0.30 }),
      'communication-antenna': Object.freeze({ outward: 0, tangent: 0.08, rotation: Math.PI * 0.18 }),
      'signal-ring': Object.freeze({ outward: 0, tangent: 0, rotation: Math.PI * 0.65 }),
    },
  };
  return motion[machineRole]?.[componentRole] || null;
}

export function deriveMachineFacilityMechanismPresentation(
  machine,
  { amount = 0, reducedMotion = false } = {},
) {
  const progress = clamp01(amount);
  const center = machine?.outerHousing?.center || { x: 0, y: 0, z: 0 };
  const angle = Math.atan2(finite(center.z), finite(center.x));
  const outward = { x: Math.cos(angle), z: Math.sin(angle) };
  const tangent = { x: -Math.sin(angle), z: Math.cos(angle) };
  const phase = progress <= 0.001
    ? MACHINE_FACILITY_MECHANISM_PHASE.STOWED
    : progress >= 0.999
      ? MACHINE_FACILITY_MECHANISM_PHASE.ACTIVE
      : MACHINE_FACILITY_MECHANISM_PHASE.DEPLOYING;

  return Object.freeze({
    phase,
    amount: progress,
    components: Object.freeze((machine?.components || []).map((component) => {
      const profile = componentMotion(machine?.machineRole, component?.role);
      if (!profile) {
        return Object.freeze({
          id: component.id,
          dx: 0,
          dy: 0,
          dz: 0,
          rotationY: component.rotationY,
        });
      }
      return Object.freeze({
        id: component.id,
        dx: outward.x * profile.outward * progress + tangent.x * profile.tangent * progress,
        dy: 0,
        dz: outward.z * profile.outward * progress + tangent.z * profile.tangent * progress,
        rotationY: reducedMotion
          ? component.rotationY
          : component.rotationY + profile.rotation * progress,
      });
    })),
    presentationOnly: true,
  });
}

function component(id, role, shape, center, dimensions, materialRole, rotationY = 0, metadata = {}) {
  return Object.freeze({
    id,
    role,
    shape,
    center: Object.freeze({
      x: finite(center.x),
      y: finite(center.y),
      z: finite(center.z),
    }),
    dimensions: Object.freeze({
      x: Math.max(0.08, finite(dimensions.x, 0.12)),
      y: Math.max(0.04, finite(dimensions.y, 0.10)),
      z: Math.max(0.08, finite(dimensions.z, 0.12)),
    }),
    materialRole,
    rotationY: finite(rotationY),
    ...metadata,
    ...rootContext(id),
  });
}

function localBasis(center) {
  const angle = Math.atan2(center.z, center.x);
  return Object.freeze({
    angle,
    radial: Math.hypot(center.x, center.z),
    outward: Object.freeze({ x: Math.cos(angle), z: Math.sin(angle) }),
    tangent: Object.freeze({ x: -Math.sin(angle), z: Math.cos(angle) }),
  });
}

function radialBoundaryDistance(dimensions, angle) {
  const halfX = Math.max(0.01, Math.abs(Number(dimensions?.x) || 0) * 0.5);
  const halfZ = Math.max(0.01, Math.abs(Number(dimensions?.z) || 0) * 0.5);
  const cosine = Math.abs(Math.cos(angle));
  const sine = Math.abs(Math.sin(angle));
  return 1 / (cosine / halfX + sine / halfZ);
}

function distance3D(a, b) {
  return Math.hypot(
    finite(a?.x) - finite(b?.x),
    finite(a?.y) - finite(b?.y),
    finite(a?.z) - finite(b?.z),
  );
}

function physicalInterface(id, role, center, dimensions, rotationY, materialRole, metadata = {}) {
  return Object.freeze({
    id,
    role,
    shape: 'CUBE',
    center: Object.freeze({
      x: finite(center.x),
      y: finite(center.y),
      z: finite(center.z),
    }),
    dimensions: Object.freeze({
      x: Math.max(0.06, finite(dimensions.x, 0.12)),
      y: Math.max(0.06, finite(dimensions.y, 0.10)),
      z: Math.max(0.06, finite(dimensions.z, 0.12)),
    }),
    rotationY: finite(rotationY),
    materialRole,
    ...metadata,
    ...rootContext(id),
  });
}

function buildMachineComponents(assembly) {
  const { center, dimensions } = assembly.outerHousing;
  const basis = localBasis(center);
  const width = Math.max(1, finite(dimensions.x, 1.8));
  const depth = Math.max(0.8, finite(dimensions.z, 1.2));
  const height = Math.max(0.7, finite(dimensions.y, 0.9));
  const id = (role) => 'MACHINERY:' + assembly.branchId + ':' + role;

  switch (assembly.machineRole) {
    case 'analysis':
      return Object.freeze([
        component(id('BARREL_STAGE_1'), 'barrel-stage-1', 'CYL',
          { x: center.x + basis.outward.x * 0.18, y: center.y + 0.22, z: center.z + basis.outward.z * 0.18 },
          { x: width * 0.34, y: height * 0.42, z: width * 0.34 }, 'metal', basis.angle,
          { profile: 'analysis-telescope-stage-1', outline: ANALYSIS_BARREL_OUTLINES['barrel-stage-1'] }),
        component(id('BARREL_STAGE_2'), 'barrel-stage-2', 'CYL',
          { x: center.x + basis.outward.x * 0.42, y: center.y + 0.25, z: center.z + basis.outward.z * 0.42 },
          { x: width * 0.27, y: height * 0.35, z: width * 0.27 }, 'glass', basis.angle,
          { profile: 'analysis-telescope-stage-2', outline: ANALYSIS_BARREL_OUTLINES['barrel-stage-2'] }),
        component(id('BARREL_STAGE_3'), 'barrel-stage-3', 'CYL',
          { x: center.x + basis.outward.x * 0.68, y: center.y + 0.28, z: center.z + basis.outward.z * 0.68 },
          { x: width * 0.19, y: height * 0.28, z: width * 0.19 }, 'energy', basis.angle,
          { profile: 'analysis-telescope-stage-3', outline: ANALYSIS_BARREL_OUTLINES['barrel-stage-3'] }),
        component(id('FOCUS_RING'), 'focus-ring', 'TORUS',
          { x: center.x + basis.outward.x * 0.36, y: center.y + 0.25, z: center.z + basis.outward.z * 0.36 },
          { x: width * 0.44, y: height * 0.10, z: width * 0.44 }, 'trace'),
        component(id('ANALYSIS_LENS'), 'analysis-lens', 'SPH',
          { x: center.x + basis.outward.x * 0.86, y: center.y + 0.30, z: center.z + basis.outward.z * 0.86 },
          { x: width * 0.15, y: height * 0.16, z: width * 0.15 }, 'energy'),
      ]);
    case 'operations':
      return Object.freeze([
        component(id('HINGE_CORE'), 'hinge-core', 'CYL',
          { x: center.x - basis.outward.x * 0.08, y: center.y + 0.24, z: center.z - basis.outward.z * 0.08 },
          { x: width * 0.22, y: height * 0.32, z: width * 0.22 }, 'metal2'),
        component(id('DEPLOYMENT_FIN'), 'deployment-fin', 'FACILITY_FIN_PRIMARY',
          { x: center.x + basis.tangent.x * 0.34, y: center.y + 0.34, z: center.z + basis.tangent.z * 0.34 },
          { x: width * 0.18, y: height * 0.72, z: depth * 0.78 }, 'glass',
          0.32, { profile: 'operations-fin-primary', outline: OPERATIONS_FIN_OUTLINES.primary }),
        component(id('DEPLOYMENT_FIN_SECONDARY'), 'deployment-fin-secondary', 'FACILITY_FIN_SECONDARY',
          { x: center.x - basis.tangent.x * 0.34, y: center.y + 0.38, z: center.z - basis.tangent.z * 0.34 },
          { x: width * 0.16, y: height * 0.65, z: depth * 0.64 }, 'metal',
          -0.28, { profile: 'operations-fin-secondary', outline: OPERATIONS_FIN_OUTLINES.secondary }),
        component(id('CLAMP_RING'), 'clamp-ring', 'TORUS',
          { x: center.x, y: center.y + 0.27, z: center.z },
          { x: width * 0.48, y: height * 0.12, z: width * 0.48 }, 'energy'),
        component(id('STRUCTURAL_SPINE'), 'structural-spine', 'CUBE',
          { x: center.x + basis.outward.x * 0.28, y: center.y + 0.48, z: center.z + basis.outward.z * 0.28 },
          { x: width * 0.14, y: height * 0.68, z: depth * 0.24 }, 'trace',
          basis.angle),
      ]);
    case 'control':
      return Object.freeze([
        component(id('ROTOR_HUB'), 'rotor-hub', 'CYL',
          { x: center.x, y: center.y + 0.26, z: center.z },
          { x: width * 0.28, y: height * 0.30, z: width * 0.28 }, 'metal'),
        component(id('ROTOR_RING'), 'rotor-ring', 'TORUS',
          { x: center.x, y: center.y + 0.36, z: center.z },
          { x: width * 0.56, y: height * 0.10, z: width * 0.56 }, 'energy'),
        component(id('ROTOR_RING_SECONDARY'), 'rotor-ring-secondary', 'TORUS',
          { x: center.x, y: center.y + 0.52, z: center.z },
          { x: width * 0.43, y: height * 0.08, z: width * 0.43 }, 'glass'),
        component(id('ANALYSIS_CHAMBER'), 'analysis-chamber', 'CUBE',
          { x: center.x + basis.outward.x * 0.22, y: center.y + 0.58, z: center.z + basis.outward.z * 0.22 },
          { x: width * 0.36, y: height * 0.44, z: depth * 0.34 }, 'glass',
          basis.angle),
        component(id('CONTROL_COLLAR'), 'control-collar', 'CYL',
          { x: center.x - basis.outward.x * 0.18, y: center.y + 0.22, z: center.z - basis.outward.z * 0.18 },
          { x: width * 0.18, y: height * 0.50, z: width * 0.18 }, 'trace'),
      ]);
    case 'access-commerce':
      return Object.freeze([
        component(id('SENSOR_MAST'), 'sensor-mast', 'CYL',
          { x: center.x, y: center.y + 0.62, z: center.z },
          { x: width * 0.12, y: height * 1.05, z: width * 0.12 }, 'metal'),
        component(id('SENSOR_DISH'), 'sensor-dish', 'FACILITY_SENSOR_DISH',
          { x: center.x + basis.outward.x * 0.28, y: center.y + 0.76, z: center.z + basis.outward.z * 0.28 },
          { x: width * 0.46, y: height * 0.12, z: depth * 0.42 }, 'glass',
          basis.angle + 0.22, { profile: 'access-sensor-dish' }),
        component(id('SENSOR_ARRAY'), 'sensor-array', 'TORUS',
          { x: center.x + basis.outward.x * 0.34, y: center.y + 0.52, z: center.z + basis.outward.z * 0.34 },
          { x: width * 0.52, y: height * 0.08, z: width * 0.52 }, 'energy'),
        component(id('COMMUNICATION_ANTENNA'), 'communication-antenna', 'CYL',
          { x: center.x - basis.tangent.x * 0.24, y: center.y + 0.66, z: center.z - basis.tangent.z * 0.24 },
          { x: width * 0.08, y: height * 1.14, z: width * 0.08 }, 'trace',
          -basis.angle),
        component(id('SIGNAL_RING'), 'signal-ring', 'TORUS',
          { x: center.x, y: center.y + 0.34, z: center.z },
          { x: width * 0.62, y: height * 0.08, z: width * 0.62 }, 'energy'),
      ]);
    default:
      return Object.freeze([]);
  }
}

function buildGraph(components) {
  const byRole = new Map(components.map((entry) => [entry.role, entry.id]));
  const roleChains = [
    ['barrel-stage-1', 'barrel-stage-2', 'barrel-stage-3', 'focus-ring', 'analysis-lens'],
    ['hinge-core', 'deployment-fin', 'deployment-fin-secondary', 'clamp-ring', 'structural-spine'],
    ['rotor-hub', 'rotor-ring', 'rotor-ring-secondary', 'analysis-chamber', 'control-collar'],
    ['sensor-mast', 'sensor-dish', 'sensor-array', 'communication-antenna', 'signal-ring'],
  ];
  const chain = roleChains.find((roles) => byRole.has(roles[0]));
  if (!chain) return Object.freeze([]);
  return Object.freeze(chain.slice(0, -1).map((role, index) => Object.freeze({
    id: 'MACHINERY-EDGE:' + byRole.get(role) + '=>' + byRole.get(chain[index + 1]),
    from: byRole.get(role),
    to: byRole.get(chain[index + 1]),
    kind: 'facility-mechanism',
  })));
}


function buildMachinePayloadSurface(machineRole, assembly, components) {
  const role = MACHINE_PROFILES[machineRole]?.payloadSurfaceRole;
  const source = components.find((entry) => entry.role === role);
  if (!role || !source) return null;

  const semanticId = assembly.branchId + ':PAYLOAD-SURFACE';
  return Object.freeze({
    id: 'MACHINERY:' + assembly.branchId + ':PAYLOAD-SURFACE',
    role: 'facility-payload-surface',
    profile: 'facility-payload:' + machineRole,
    componentId: source.id,
    center: Object.freeze({ ...source.center }),
    dimensions: Object.freeze({ ...source.dimensions }),
    materialRole: source.materialRole,
    ...rootContext(semanticId),
    presentationOnly: true,
  });
}

function centerDistanceXZ(a, b) {
  return Math.hypot(
    finite(a?.x) - finite(b?.x),
    finite(a?.z) - finite(b?.z),
  );
}

function radialObstacleEnvelope(obstacle) {
  if (!obstacle) return null;
  if (obstacle.outerHousing?.center && obstacle.envelope?.radius) {
    return Object.freeze({
      id: obstacle.branchId || obstacle.id || 'obstacle',
      center: obstacle.outerHousing.center,
      radius: Math.max(0, finite(obstacle.envelope.radius)),
    });
  }
  if (obstacle.center && obstacle.dimensions) {
    return Object.freeze({
      id: obstacle.branchId || obstacle.id || 'obstacle',
      center: obstacle.center,
      radius: Math.hypot(
        Math.abs(finite(obstacle.dimensions.x)) * 0.5,
        Math.abs(finite(obstacle.dimensions.z)) * 0.5,
      ),
    });
  }
  return null;
}

function deriveFacilityClearanceProfile(machine, obstacles = [], clearance = 0.16) {
  const selfCenter = machine?.outerHousing?.center || { x: 0, y: 0, z: 0 };
  const selfRadius = Math.max(0, finite(machine?.envelope?.radius));
  const required = Math.max(0, finite(clearance));
  const candidates = (Array.isArray(obstacles) ? obstacles : [])
    .map(radialObstacleEnvelope)
    .filter((entry) => entry && entry.id !== machine?.branchId);
  const measured = candidates.map((entry) => Object.freeze({
    obstacleId: entry.id,
    centerDistance: centerDistanceXZ(selfCenter, entry.center),
    availableClearance: centerDistanceXZ(selfCenter, entry.center) - selfRadius - entry.radius,
  }));
  const minimum = measured.length
    ? Math.min(...measured.map((entry) => entry.availableClearance))
    : Infinity;
  return Object.freeze({
    requiredClearance: required,
    selfCenter: Object.freeze({ ...selfCenter }),
    minimumAvailableClearance: minimum,
    safe: minimum >= required,
    nearestObstacleId: measured.find((entry) => entry.availableClearance === minimum)?.obstacleId || null,
    measurements: Object.freeze(measured),
    presentationOnly: true,
  });
}

function deriveMachineServiceBoundaryDistance(assembly, components = buildMachineComponents(assembly)) {
  const center = assembly.outerHousing.center;
  const basis = localBasis(center);
  const housingBoundary = radialBoundaryDistance(assembly.outerHousing.dimensions, basis.angle);
  const motion = deriveMachineFacilityMechanismPresentation(
    { machineRole: assembly.machineRole, outerHousing: assembly.outerHousing, components },
    { amount: 1, reducedMotion: true },
  );
  const maxComponentReach = Math.max(
    ...components.map((entry) => {
      const delta = motion.components.find((candidate) => candidate.id === entry.id);
      return Math.hypot(
        entry.center.x + finite(delta?.dx) - center.x,
        entry.center.z + finite(delta?.dz) - center.z,
      ) + Math.hypot(entry.dimensions.x, entry.dimensions.z) * 0.5;
    }),
    housingBoundary,
  );
  return Math.max(housingBoundary, maxComponentReach);
}

function machinePorts(assembly, components = buildMachineComponents(assembly)) {
  const center = assembly.outerHousing.center;
  const basis = localBasis(center);
  const serviceBoundary = deriveMachineServiceBoundaryDistance(assembly, components);
  return Object.freeze([
    ...assembly.ports,
    Object.freeze({
      id: 'MACHINE-PORT:' + assembly.branchId + ':CORE-IN',
      facilityId: null,
      role: 'machine-core-input',
      point: Object.freeze({
        x: center.x + basis.outward.x * (serviceBoundary + 0.04),
        y: center.y + 0.16,
        z: center.z + basis.outward.z * (serviceBoundary + 0.04),
      }),
      radius: 0.10,
      serviceBoundaryDistance: serviceBoundary,
      ...rootContext(assembly.branchId + ':CORE-IN'),
    }),
    Object.freeze({
      id: 'MACHINE-PORT:' + assembly.branchId + ':MACHINE-OUT',
      facilityId: null,
      role: 'machine-output',
      point: Object.freeze({
        x: center.x + basis.outward.x * (serviceBoundary + 0.12),
        y: center.y + 0.40,
        z: center.z + basis.outward.z * (serviceBoundary + 0.12),
      }),
      radius: 0.10,
      serviceBoundaryDistance: serviceBoundary,
      ...rootContext(assembly.branchId + ':MACHINE-OUT'),
    }),
  ]);
}

export function deriveMachineFacilityPhysicalInterfaces(assembly, ports = machinePorts(assembly)) {
  const center = assembly.outerHousing.center;
  const dimensions = assembly.outerHousing.dimensions;
  const basis = localBasis(center);
  const boundaryDistance = radialBoundaryDistance(dimensions, basis.angle);
  const outerFace = boundaryDistance;
  const serviceBoundary = Math.max(outerFace, deriveMachineServiceBoundaryDistance(assembly));
  const interfaces = [];

  const coreIn = ports.find((port) => port.role === 'machine-core-input');
  const machineOut = ports.find((port) => port.role === 'machine-output');

  if (coreIn) {
    interfaces.push(
      physicalInterface(
        'INTERFACE:' + assembly.branchId + ':CORE-IN',
        'machine-core-input',
        {
          x: center.x + basis.outward.x * (serviceBoundary + 0.04),
          y: coreIn.point.y,
          z: center.z + basis.outward.z * (serviceBoundary + 0.04),
        },
        { x: 0.24, y: 0.20, z: 0.20 },
        basis.angle,
        'metal2',
        {
          portId: coreIn.id,
          interfaceSide: 'outer',
          interfaceBoundaryRadius: serviceBoundary,
        },
      ),
    );
  }

  if (machineOut) {
    interfaces.push(
      physicalInterface(
        'INTERFACE:' + assembly.branchId + ':MACHINE-OUT',
        'machine-output',
        {
          x: center.x + basis.outward.x * (serviceBoundary + 0.08),
          y: machineOut.point.y,
          z: center.z + basis.outward.z * (serviceBoundary + 0.08),
        },
        { x: 0.28, y: 0.18, z: 0.18 },
        basis.angle,
        'metal2',
        {
          portId: machineOut.id,
          interfaceSide: 'outer',
          interfaceBoundaryRadius: serviceBoundary,
        },
      ),
    );
  }

  for (const port of assembly.ports || []) {
    const dx = finite(port.point.x) - finite(center.x);
    const dz = finite(port.point.z) - finite(center.z);
    if (Math.hypot(dx, dz) < 0.001) continue;
    const angle = Math.atan2(dz, dx);
    const direction = { x: Math.cos(angle), z: Math.sin(angle) };
    const portBoundary = radialBoundaryDistance(dimensions, angle);
    const target = {
      x: center.x + direction.x * (portBoundary + 0.04),
      y: finite(port.point.y),
      z: center.z + direction.z * (portBoundary + 0.04),
    };
    const length = distance3D(port.point, target);

    interfaces.push(
      physicalInterface(
        'INTERFACE:' + assembly.branchId + ':FACILITY-ADAPTER:' + port.facilityId,
        'facility-port-adapter',
        {
          x: (finite(port.point.x) + target.x) * 0.5,
          y: (finite(port.point.y) + target.y) * 0.5,
          z: (finite(port.point.z) + target.z) * 0.5,
        },
        { x: length + 0.06, y: 0.10, z: 0.10 },
        Math.atan2(target.z - port.point.z, target.x - port.point.x),
        'metal',
        {
          facilityId: port.facilityId,
          portId: port.id,
          adapterStart: Object.freeze({ ...port.point }),
          adapterEnd: Object.freeze({ ...target }),
        },
      ),
    );
  }

  return Object.freeze(interfaces);
}

export function deriveMachineFacilityMachinery({
  facilityAssemblies = null,
  outerHousings = null,
  clearanceObstacles = [],
  requestedClearance = 0.16,
} = {}) {
  const assemblies = facilityAssemblies || deriveMachineFacilityAssemblies({
    outerHousings: outerHousings || [],
  });

  const machines = assemblies.map((assembly) => {
    const profile = MACHINE_PROFILES[assembly.machineRole];
    const components = buildMachineComponents(assembly);
    const housingCenter = assembly.outerHousing.center;
    const housingDimensions = assembly.outerHousing.dimensions;
    const basis = localBasis(housingCenter);
    const frameWidth = Math.max(0.72, finite(housingDimensions.x, 1.8));
    const frameDepth = Math.max(0.72, finite(housingDimensions.z, 1.2));
    const frameHeight = Math.max(0.50, finite(housingDimensions.y, 0.9));
    const authoredMechanicalDetails = Object.freeze([
      Object.freeze({
        id: 'MACHINERY:' + assembly.branchId + ':BASE-COLLAR',
        role: 'base-collar',
        shape: 'TORUS',
        center: Object.freeze({
          x: housingCenter.x,
          y: housingCenter.y + frameHeight * 0.16,
          z: housingCenter.z,
        }),
        dimensions: Object.freeze({
          x: frameWidth * 0.58,
          y: Math.max(0.06, frameHeight * 0.08),
          z: frameWidth * 0.58,
        }),
        rotationY: 0,
        materialRole: 'metal2',
        ...rootContext(assembly.branchId + ':BASE-COLLAR'),
      }),
      ...[-1, 1].map((side) => Object.freeze({
        id: 'MACHINERY:' + assembly.branchId + ':SUPPORT:' + (side > 0 ? 'RIGHT' : 'LEFT'),
        role: 'support-strut',
        shape: 'CUBE',
        center: Object.freeze({
          x: housingCenter.x + basis.outward.x * frameDepth * 0.08
            + basis.tangent.x * frameWidth * 0.14 * side,
          y: housingCenter.y + frameHeight * 0.28,
          z: housingCenter.z + basis.outward.z * frameDepth * 0.08
            + basis.tangent.z * frameWidth * 0.14 * side,
        }),
        dimensions: Object.freeze({
          x: Math.max(0.06, frameWidth * 0.07),
          y: Math.max(0.10, frameHeight * 0.18),
          z: Math.max(0.24, frameDepth * 0.34),
        }),
        rotationY: basis.angle,
        materialRole: 'metal',
        parentRole: MACHINE_CHASSIS_CORE_ROLE[assembly.machineRole],
        ...rootContext(assembly.branchId + ':SUPPORT:' + side),
      })),
      ...[-1, 1].map((side) => Object.freeze({
        id: 'MACHINERY:' + assembly.branchId + ':HINGE-MOUNT:' + (side > 0 ? 'RIGHT' : 'LEFT'),
        role: 'hinge-mount',
        shape: 'CYL',
        center: Object.freeze({
          x: housingCenter.x + basis.outward.x * frameDepth * 0.02
            + basis.tangent.x * frameWidth * 0.26 * side,
          y: housingCenter.y + frameHeight * 0.30,
          z: housingCenter.z + basis.outward.z * frameDepth * 0.02
            + basis.tangent.z * frameWidth * 0.26 * side,
        }),
        dimensions: Object.freeze({
          x: Math.max(0.08, frameWidth * 0.09),
          y: Math.max(0.08, frameHeight * 0.12),
          z: Math.max(0.08, frameWidth * 0.09),
        }),
        rotationY: basis.angle,
        materialRole: 'metal2',
        ...rootContext(assembly.branchId + ':HINGE-MOUNT:' + side),
      })),
      ...(assembly.machineRole === 'analysis'
        ? [
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':BARREL-COLLAR-MID',
              role: 'barrel-collar-mid',
              shape: 'TORUS',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * frameDepth * 0.30,
                y: housingCenter.y + frameHeight * 0.31,
                z: housingCenter.z + basis.outward.z * frameDepth * 0.30,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.40,
                y: Math.max(0.06, frameHeight * 0.09),
                z: frameWidth * 0.40,
              }),
              rotationY: basis.angle,
              materialRole: 'metal2',
              ...rootContext(assembly.branchId + ':BARREL-COLLAR-MID'),
            }),
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':BARREL-COLLAR-FRONT',
              role: 'barrel-collar-front',
              shape: 'TORUS',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * frameDepth * 0.57,
                y: housingCenter.y + frameHeight * 0.33,
                z: housingCenter.z + basis.outward.z * frameDepth * 0.57,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.29,
                y: Math.max(0.06, frameHeight * 0.08),
                z: frameWidth * 0.29,
              }),
              rotationY: basis.angle,
              materialRole: 'trace',
              ...rootContext(assembly.branchId + ':BARREL-COLLAR-FRONT'),
            }),
          ]
        : []),
      ...(assembly.machineRole === 'analysis'
        ? [
            ...[-1, 1].map((side) => Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':BARREL-GUIDE-RAIL:' + (side > 0 ? 'RIGHT' : 'LEFT'),
              role: 'barrel-guide-rail',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x
                  + basis.outward.x * frameDepth * 0.30
                  + basis.tangent.x * frameWidth * 0.16 * side,
                y: housingCenter.y + frameHeight * 0.36,
                z: housingCenter.z
                  + basis.outward.z * frameDepth * 0.30
                  + basis.tangent.z * frameWidth * 0.16 * side,
              }),
              dimensions: Object.freeze({
                x: Math.max(0.08, frameWidth * 0.032),
                y: Math.max(0.08, frameHeight * 0.12),
                z: Math.max(0.20, frameDepth * 0.18),
              }),
              rotationY: basis.angle,
              materialRole: 'metal2',
              parentRole: 'barrel-stage-1',
              ...rootContext(assembly.branchId + ':BARREL-GUIDE-RAIL:' + side),
            })),
          ]
        : []),
      ...(assembly.machineRole === 'operations'
        ? [
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':FIN-PRIMARY-CAP',
              role: 'deployment-fin-primary-cap',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x + basis.tangent.x * 0.34,
                y: housingCenter.y + frameHeight * 0.34 + Math.max(0.05, frameHeight * 0.06),
                z: housingCenter.z + basis.tangent.z * 0.34,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.17,
                y: Math.max(0.06, frameHeight * 0.08),
                z: frameDepth * 0.62,
              }),
              rotationY: 0.32,
              materialRole: 'metal2',
              parentRole: 'deployment-fin',
              ...rootContext(assembly.branchId + ':FIN-PRIMARY-CAP'),
            }),
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':FIN-SECONDARY-CAP',
              role: 'deployment-fin-secondary-cap',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x - basis.tangent.x * 0.34,
                y: housingCenter.y + frameHeight * 0.38 + Math.max(0.05, frameHeight * 0.05),
                z: housingCenter.z - basis.tangent.z * 0.34,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.15,
                y: Math.max(0.06, frameHeight * 0.08),
                z: frameDepth * 0.52,
              }),
              rotationY: -0.28,
              materialRole: 'metal',
              parentRole: 'deployment-fin-secondary',
              ...rootContext(assembly.branchId + ':FIN-SECONDARY-CAP'),
            }),
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':FIN-PRIMARY-RAIL',
              role: 'deployment-fin-primary-rail',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * frameDepth * 0.12
                  + basis.tangent.x * 0.34,
                y: housingCenter.y + frameHeight * 0.43,
                z: housingCenter.z + basis.outward.z * frameDepth * 0.12
                  + basis.tangent.z * 0.34,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.07,
                y: Math.max(0.06, frameHeight * 0.07),
                z: frameDepth * 0.32,
              }),
              rotationY: basis.angle,
              materialRole: 'trace',
              parentRole: 'deployment-fin',
              ...rootContext(assembly.branchId + ':FIN-PRIMARY-RAIL'),
            }),
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':FIN-SECONDARY-RAIL',
              role: 'deployment-fin-secondary-rail',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * frameDepth * 0.12
                  - basis.tangent.x * 0.34,
                y: housingCenter.y + frameHeight * 0.47,
                z: housingCenter.z + basis.outward.z * frameDepth * 0.12
                  - basis.tangent.z * 0.34,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.06,
                y: Math.max(0.06, frameHeight * 0.07),
                z: frameDepth * 0.28,
              }),
              rotationY: basis.angle,
              materialRole: 'trace',
              parentRole: 'deployment-fin-secondary',
              ...rootContext(assembly.branchId + ':FIN-SECONDARY-RAIL'),
            }),
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':FIN-ACTUATOR-PRIMARY',
              role: 'fin-actuator-primary',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * frameDepth * 0.10
                  + basis.tangent.x * 0.28,
                y: housingCenter.y + frameHeight * 0.28,
                z: housingCenter.z + basis.outward.z * frameDepth * 0.10
                  + basis.tangent.z * 0.28,
              }),
              dimensions: Object.freeze({
                x: Math.max(0.06, frameWidth * 0.06),
                y: Math.max(0.06, frameHeight * 0.10),
                z: Math.max(0.20, frameDepth * 0.22),
              }),
              rotationY: basis.angle,
              materialRole: 'metal2',
              parentRole: 'deployment-fin',
              profile: 'operations-fin-actuator-primary',
              ...rootContext(assembly.branchId + ':FIN-ACTUATOR-PRIMARY'),
            }),
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':FIN-ACTUATOR-SECONDARY',
              role: 'fin-actuator-secondary',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * frameDepth * 0.10
                  - basis.tangent.x * 0.28,
                y: housingCenter.y + frameHeight * 0.31,
                z: housingCenter.z + basis.outward.z * frameDepth * 0.10
                  - basis.tangent.z * 0.28,
              }),
              dimensions: Object.freeze({
                x: Math.max(0.06, frameWidth * 0.055),
                y: Math.max(0.06, frameHeight * 0.10),
                z: Math.max(0.24, frameDepth * 0.28),
              }),
              rotationY: basis.angle,
              materialRole: 'metal2',
              parentRole: 'deployment-fin-secondary',
              profile: 'operations-fin-actuator-secondary',
              ...rootContext(assembly.branchId + ':FIN-ACTUATOR-SECONDARY'),
            }),
          ]
        : []),
      ...(assembly.machineRole === 'control'
        ? [
            ...[-1, 1].map((side) => Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':ROTOR-BEARING-BLOCK:' + (side > 0 ? 'RIGHT' : 'LEFT'),
              role: 'rotor-bearing-block',
              shape: 'CUBE',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * frameDepth * 0.08
                  + basis.tangent.x * frameWidth * 0.18 * side,
                y: housingCenter.y + frameHeight * 0.30,
                z: housingCenter.z + basis.outward.z * frameDepth * 0.08
                  + basis.tangent.z * frameWidth * 0.18 * side,
              }),
              dimensions: Object.freeze({
                x: Math.max(0.06, frameWidth * 0.08),
                y: Math.max(0.08, frameHeight * 0.14),
                z: Math.max(0.12, frameDepth * 0.30),
              }),
              rotationY: basis.angle,
              materialRole: 'metal2',
              parentRole: 'rotor-hub',
              ...rootContext(assembly.branchId + ':ROTOR-BEARING-BLOCK:' + side),
            })),
            ...[-1, 1].map((side) => Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':ROTOR-DRIVE-LINK:' + (side > 0 ? 'RIGHT' : 'LEFT'),
              role: 'rotor-drive-link',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x
                  + basis.outward.x * frameDepth * 0.12
                  + basis.tangent.x * frameWidth * 0.12 * side,
                y: housingCenter.y + frameHeight * 0.42,
                z: housingCenter.z
                  + basis.outward.z * frameDepth * 0.12
                  + basis.tangent.z * frameWidth * 0.12 * side,
              }),
              dimensions: Object.freeze({
                x: Math.max(0.06, frameWidth * 0.055),
                y: Math.max(0.10, frameHeight * 0.16),
                z: Math.max(0.24, frameDepth * 0.26),
              }),
              rotationY: basis.angle,
              materialRole: 'metal2',
              parentRole: 'rotor-hub',
              profile: 'control-rotor-drive-link',
              ...rootContext(assembly.branchId + ':ROTOR-DRIVE-LINK:' + side),
            })),
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':CHAMBER-RETAINER',
              role: 'chamber-retainer',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * 0.22,
                y: housingCenter.y + frameHeight * 0.48,
                z: housingCenter.z + basis.outward.z * 0.22,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.24,
                y: Math.max(0.06, frameHeight * 0.08),
                z: frameDepth * 0.14,
              }),
              rotationY: basis.angle,
              materialRole: 'metal',
              parentRole: 'analysis-chamber',
              ...rootContext(assembly.branchId + ':CHAMBER-RETAINER'),
            }),
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':CHAMBER-CLAMP-RING',
              role: 'chamber-clamp-ring',
              shape: 'TORUS',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * 0.22,
                y: housingCenter.y + frameHeight * 0.58,
                z: housingCenter.z + basis.outward.z * 0.22,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.32,
                y: Math.max(0.06, frameHeight * 0.07),
                z: frameWidth * 0.32,
              }),
              rotationY: basis.angle,
              materialRole: 'metal2',
              parentRole: 'analysis-chamber',
              ...rootContext(assembly.branchId + ':CHAMBER-CLAMP-RING'),
            }),
          ]
        : []),
      ...(assembly.machineRole === 'access-commerce'
        ? [
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':MAST-FOOT-COLLAR',
              role: 'mast-foot-collar',
              shape: 'TORUS',
              center: Object.freeze({
                x: housingCenter.x,
                y: housingCenter.y + frameHeight * 0.17,
                z: housingCenter.z,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.32,
                y: Math.max(0.06, frameHeight * 0.08),
                z: frameWidth * 0.32,
              }),
              rotationY: 0,
              materialRole: 'metal2',
              parentRole: 'sensor-mast',
              ...rootContext(assembly.branchId + ':MAST-FOOT-COLLAR'),
            }),
            ...[-1, 1].map((side) => Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':DISH-YOKE:' + (side > 0 ? 'RIGHT' : 'LEFT'),
              role: 'dish-yoke',
              shape: 'CUBE',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * 0.10
                  + basis.tangent.x * frameWidth * 0.18 * side,
                y: housingCenter.y + frameHeight * 0.45,
                z: housingCenter.z + basis.outward.z * 0.10
                  + basis.tangent.z * frameWidth * 0.18 * side,
              }),
              dimensions: Object.freeze({
                x: Math.max(0.06, frameWidth * 0.06),
                y: Math.max(0.08, frameHeight * 0.12),
                z: Math.max(0.10, frameDepth * 0.26),
              }),
              rotationY: basis.angle,
              materialRole: 'metal',
              parentRole: 'sensor-dish',
              ...rootContext(assembly.branchId + ':DISH-YOKE:' + side),
            })),
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':ANTENNA-BASE-PLATE',
              role: 'antenna-base-plate',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x - basis.tangent.x * 0.24,
                y: housingCenter.y + frameHeight * 0.40,
                z: housingCenter.z - basis.tangent.z * 0.24,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.18,
                y: Math.max(0.06, frameHeight * 0.08),
                z: frameDepth * 0.18,
              }),
              rotationY: basis.angle,
              materialRole: 'metal2',
              parentRole: 'communication-antenna',
              ...rootContext(assembly.branchId + ':ANTENNA-BASE-PLATE'),
            }),
            ...[-1, 1].map((side) => Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':SENSOR-BOOM:' + (side > 0 ? 'RIGHT' : 'LEFT'),
              role: 'sensor-boom',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * frameDepth * 0.08
                  + basis.tangent.x * frameWidth * 0.13 * side,
                y: housingCenter.y + frameHeight * 0.40,
                z: housingCenter.z + basis.outward.z * frameDepth * 0.08
                  + basis.tangent.z * frameWidth * 0.13 * side,
              }),
              dimensions: Object.freeze({
                x: Math.max(0.06, frameWidth * 0.06),
                y: Math.max(0.06, frameHeight * 0.08),
                z: Math.max(0.20, frameDepth * 0.24),
              }),
              rotationY: basis.angle,
              materialRole: 'metal2',
              parentRole: 'sensor-array',
              profile: 'access-sensor-boom',
              ...rootContext(assembly.branchId + ':SENSOR-BOOM:' + side),
            })),
            ...[-1, 1].map((side) => Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':SENSOR-PANEL-CLAMP:' + (side > 0 ? 'RIGHT' : 'LEFT'),
              role: 'sensor-panel-clamp',
              shape: 'BOX',
              center: Object.freeze({
                x: housingCenter.x + basis.outward.x * frameDepth * 0.13
                  + basis.tangent.x * frameWidth * 0.13 * side,
                y: housingCenter.y + frameHeight * 0.62,
                z: housingCenter.z + basis.outward.z * frameDepth * 0.13
                  + basis.tangent.z * frameWidth * 0.13 * side,
              }),
              dimensions: Object.freeze({
                x: Math.max(0.06, frameWidth * 0.07),
                y: Math.max(0.06, frameHeight * 0.07),
                z: Math.max(0.10, frameDepth * 0.12),
              }),
              rotationY: basis.angle,
              materialRole: 'metal',
              parentRole: 'sensor-dish',
              profile: 'access-sensor-panel-clamp',
              ...rootContext(assembly.branchId + ':SENSOR-PANEL-CLAMP:' + side),
            })),
            Object.freeze({
              id: 'MACHINERY:' + assembly.branchId + ':ANTENNA-PIVOT-COLLAR',
              role: 'antenna-pivot-collar',
              shape: 'TORUS',
              center: Object.freeze({
                x: housingCenter.x - basis.tangent.x * 0.24,
                y: housingCenter.y + frameHeight * 0.58,
                z: housingCenter.z - basis.tangent.z * 0.24,
              }),
              dimensions: Object.freeze({
                x: frameWidth * 0.16,
                y: Math.max(0.06, frameHeight * 0.07),
                z: frameWidth * 0.16,
              }),
              rotationY: basis.angle,
              materialRole: 'metal2',
              parentRole: 'communication-antenna',
              profile: 'access-antenna-pivot-collar',
              ...rootContext(assembly.branchId + ':ANTENNA-PIVOT-COLLAR'),
            }),
          ]
        : []),
    ]);
    const primaryCoreRole = MACHINE_CHASSIS_CORE_ROLE[assembly.machineRole];
    const primaryCore = components.find((entry) => entry.role === primaryCoreRole);
    if (!primaryCore) {
      throw new Error('missing authored chassis core role for ' + assembly.machineRole);
    }
    // A raised tie bridge rides above the opaque chassis skin. The two risers
    // and central standoff preserve a continuous physical path back to the
    // authored support struts and primary mechanism while remaining visible in
    // the structural Three.js preview as well as the translucent Hero skin.
    const railY = housingCenter.y + frameHeight * 0.78;
    const chassisSupports = authoredMechanicalDetails
      .filter((entry) => entry.role === 'support-strut');
    const chassisTransferLinks = chassisSupports.map((support) => {
      const dx = primaryCore.center.x - support.center.x;
      const dz = primaryCore.center.z - support.center.z;
      const horizontalLength = Math.hypot(dx, dz);
      if (horizontalLength < 0.12) {
        throw new Error('degenerate chassis-core attachment for ' + assembly.branchId);
      }
      const side = String(support.id).endsWith(':RIGHT') ? 'RIGHT' : 'LEFT';
      const id = 'MACHINERY:' + assembly.branchId + ':CHASSIS-CORE-TIE:' + side;
      return Object.freeze({
        id,
        role: 'chassis-core-tie',
        shape: 'BOX',
        center: Object.freeze({
          x: (support.center.x + primaryCore.center.x) * 0.5,
          y: railY,
          z: (support.center.z + primaryCore.center.z) * 0.5,
        }),
        dimensions: Object.freeze({
          x: Math.max(0.07, frameWidth * 0.035),
          y: Math.max(0.12, frameHeight * 0.10),
          z: Math.max(0.20, horizontalLength + 0.14),
        }),
        rotationY: Math.atan2(dx, dz),
        materialRole: 'metal2',
        parentRole: primaryCoreRole,
        profile: 'chassis-core-tie-v2',
        attachmentSourceId: support.id,
        attachmentTargetId: primaryCore.id,
        attachmentSourceRole: support.role,
        attachmentTargetRole: primaryCore.role,
        attachmentSourceRiserId: 'MACHINERY:' + assembly.branchId + ':CHASSIS-TIE-RISER:' + side,
        attachmentTargetStandoffId: 'MACHINERY:' + assembly.branchId + ':CHASSIS-CORE-STANDOFF',
        attachmentRailY: railY,
        attachmentSpan: horizontalLength,
        ...rootContext(assembly.branchId + ':CHASSIS-CORE-TIE:' + side),
      });
    });
    const chassisTieRisers = chassisSupports.map((support) => {
      const side = String(support.id).endsWith(':RIGHT') ? 'RIGHT' : 'LEFT';
      const height = railY - support.center.y;
      return Object.freeze({
        id: 'MACHINERY:' + assembly.branchId + ':CHASSIS-TIE-RISER:' + side,
        role: 'chassis-tie-riser',
        shape: 'CYL',
        center: Object.freeze({
          x: support.center.x,
          y: (railY + support.center.y) * 0.5,
          z: support.center.z,
        }),
        dimensions: Object.freeze({
          x: Math.max(0.08, frameWidth * 0.045),
          y: height + 0.14,
          z: Math.max(0.08, frameWidth * 0.045),
        }),
        rotationY: 0,
        materialRole: 'metal',
        parentRole: support.role,
        profile: 'chassis-tie-riser-v1',
        attachmentSourceId: support.id,
        attachmentTargetId: 'MACHINERY:' + assembly.branchId + ':CHASSIS-CORE-TIE:' + side,
        attachmentRailY: railY,
        ...rootContext(assembly.branchId + ':CHASSIS-TIE-RISER:' + side),
      });
    });
    const chassisCoreStandoff = Object.freeze({
      id: 'MACHINERY:' + assembly.branchId + ':CHASSIS-CORE-STANDOFF',
      role: 'chassis-core-standoff',
      shape: 'CYL',
      center: Object.freeze({
        x: primaryCore.center.x,
        y: (railY + primaryCore.center.y) * 0.5,
        z: primaryCore.center.z,
      }),
      dimensions: Object.freeze({
        x: Math.max(0.10, frameWidth * 0.055),
        y: railY - primaryCore.center.y + 0.14,
        z: Math.max(0.10, frameWidth * 0.055),
      }),
      rotationY: 0,
      materialRole: 'metal2',
      parentRole: primaryCoreRole,
      profile: 'chassis-core-standoff-v1',
      attachmentSourceId: primaryCore.id,
      attachmentTargetIds: Object.freeze(chassisTransferLinks.map((entry) => entry.id)),
      attachmentRailY: railY,
      ...rootContext(assembly.branchId + ':CHASSIS-CORE-STANDOFF'),
    });
    const mechanicalDetails = Object.freeze([
      ...authoredMechanicalDetails,
      ...chassisTransferLinks,
      ...chassisTieRisers,
      chassisCoreStandoff,
    ]);
    const ports = machinePorts(assembly, components);
    const physicalInterfaces = deriveMachineFacilityPhysicalInterfaces(assembly, ports);
    const maxPresentation = deriveMachineFacilityMechanismPresentation(
      { machineRole: assembly.machineRole, outerHousing: assembly.outerHousing, components },
      { amount: 1, reducedMotion: true },
    );
    const maxMotionById = new Map(maxPresentation.components.map((entry) => [entry.id, entry]));
    const payloadSurface = buildMachinePayloadSurface(assembly.machineRole, assembly, components);
    const subject = deriveMachineSubject(
      components.map((entry) => {
        const motion = maxMotionById.get(entry.id);
        return {
          id: entry.id,
          center: {
            x: entry.center.x + finite(motion?.dx),
            y: entry.center.y + finite(motion?.dy),
            z: entry.center.z + finite(motion?.dz),
          },
          dimensions: {
            x: Math.hypot(entry.dimensions.x, entry.dimensions.z),
            y: entry.dimensions.y,
            z: Math.hypot(entry.dimensions.x, entry.dimensions.z),
          },
        };
      }).concat(
        mechanicalDetails.map((detail) => ({
          id: detail.id,
          center: detail.center,
          dimensions: detail.dimensions,
        })),
        ports.map((port) => ({
          id: port.id,
          center: port.point,
          dimensions: { x: port.radius * 2, y: port.radius * 2, z: port.radius * 2 },
        })),
        physicalInterfaces.map((entry) => ({
          id: entry.id,
          center: entry.center,
          dimensions: entry.dimensions,
        })),
      ),
      0.10,
    );

    return Object.freeze({
      id: MACHINE_FACILITY_MACHINERY_ID + ':' + assembly.branchId,
      version: MACHINE_FACILITY_MACHINERY_VERSION,
      ...rootContext(assembly.branchId + ':MACHINERY'),
      branchId: assembly.branchId,
      machineRole: assembly.machineRole,
      profileLabel: profile?.label || assembly.machineRole,
      facilityIds: Object.freeze(assembly.facilities.map((facility) => facility.id)),
      facilityAssemblyId: assembly.id,
      outerHousing: assembly.outerHousing,
      components,
      mechanicalDetails,
      physicalInterfaces,
      payloadSurface,
      mechanismGraph: buildGraph(components),
      ports,
      subject,
      envelope: Object.freeze({
        radius: Math.max(
          ...components.map((entry) => {
            const motion = maxMotionById.get(entry.id);
            return Math.hypot(
              entry.center.x + finite(motion?.dx) - assembly.outerHousing.center.x,
              entry.center.z + finite(motion?.dz) - assembly.outerHousing.center.z,
            ) + Math.hypot(entry.dimensions.x, entry.dimensions.z) * 0.5;
          }),
          ...mechanicalDetails.map((entry) =>
            Math.hypot(
              entry.center.x - assembly.outerHousing.center.x,
              entry.center.z - assembly.outerHousing.center.z,
            ) + Math.hypot(entry.dimensions.x, entry.dimensions.z) * 0.5,
          ),
          ...physicalInterfaces.map((entry) =>
            Math.hypot(
              entry.center.x - assembly.outerHousing.center.x,
              entry.center.z - assembly.outerHousing.center.z,
            ) + Math.hypot(entry.dimensions.x, entry.dimensions.z) * 0.5,
          ),
        ),
        height: Math.max(...components.map((entry) =>
          Math.abs(entry.center.y - assembly.outerHousing.center.y) + entry.dimensions.y * 0.5,
        )) * 2,
        clearance: assembly.envelope.clearance,
      }),
      presentationOnly: true,
    });
  });

  const defaultHousingObstacles = assemblies.map((assembly) => ({
    branchId: assembly.branchId,
    center: assembly.outerHousing?.center,
    dimensions: assembly.outerHousing?.dimensions,
  }));
  return Object.freeze(machines.map((machine) => Object.freeze({
    ...machine,
    clearanceProfile: deriveFacilityClearanceProfile(
      machine,
      [
        ...defaultHousingObstacles,
        ...(Array.isArray(outerHousings) ? outerHousings : []),
        ...(Array.isArray(clearanceObstacles) ? clearanceObstacles : []),
        ...machines.filter((candidate) => candidate !== machine),
      ],
      requestedClearance,
    ),
  })));
}

export function validateMachineFacilityMachinery(machinery = [], { expectedCount = 4 } = {}) {
  const reasons = [];
  const list = Array.isArray(machinery) ? machinery : [];
  if (list.length !== expectedCount) reasons.push('FACILITY_MACHINERY_COUNT_MISMATCH');

  const roles = new Set();
  const signatures = new Set();
  for (const machine of list) {
    const root = validateSpatialConstructionNode(machine || {});
    if (!root.valid) reasons.push(...root.reasons);
    if (machine?.constructionSlice !== 'S7') reasons.push(machine?.id + ':NOT_S7');
    if (machine?.constructionOwner !== ROOT_OWNER) reasons.push(machine?.id + ':OWNER_MISMATCH');
    if (!Array.isArray(machine?.components) || machine.components.length < 5) reasons.push(machine?.id + ':COMPONENTS_INCOMPLETE');
    if (!Array.isArray(machine?.mechanismGraph) || machine.mechanismGraph.length < 4) reasons.push(machine?.id + ':MECHANISM_GRAPH_INCOMPLETE');
    if (!Array.isArray(machine?.ports) || machine.ports.length < 4) reasons.push(machine?.id + ':PORTS_INCOMPLETE');
    if (!Array.isArray(machine?.physicalInterfaces) || machine.physicalInterfaces.length !== machine.facilityIds.length + 2) {
      reasons.push(machine?.id + ':PHYSICAL_INTERFACES_INCOMPLETE');
    }
    if (!machine?.subject) reasons.push(machine?.id + ':SUBJECT_MISSING');
    if (!(Number(machine?.envelope?.radius) > 0)) reasons.push(machine?.id + ':ENVELOPE_INVALID');
    if (!(Number(machine?.envelope?.height) > 0)) reasons.push(machine?.id + ':ENVELOPE_HEIGHT_INVALID');
    if (!machine?.facilityAssemblyId) reasons.push(machine?.id + ':S6_ASSEMBLY_REFERENCE_MISSING');
    if (!machine?.outerHousing?.center || !machine?.outerHousing?.dimensions) reasons.push(machine?.id + ':OUTER_HOUSING_ANCHOR_MISSING');
    if (!machine?.payloadSurface?.componentId || !machine?.payloadSurface?.center || !machine?.payloadSurface?.dimensions) reasons.push(machine?.id + ':PAYLOAD_SURFACE_MISSING');
    if (machine?.payloadSurface?.componentId && !(machine.components || []).some((entry) => entry?.id === machine.payloadSurface.componentId)) reasons.push(machine?.id + ':PAYLOAD_SURFACE_COMPONENT_MISSING');
    if (!machine?.clearanceProfile || !Number.isFinite(Number(machine.clearanceProfile.minimumAvailableClearance))) {
      reasons.push(machine?.id + ':FACILITY_CLEARANCE_UNPROVEN');
    } else if (!machine.clearanceProfile.safe) {
      reasons.push(machine?.id + ':FACILITY_CLEARANCE_UNSAFE');
    }

    if (roles.has(machine?.machineRole)) reasons.push('DUPLICATE_MACHINE_ROLE:' + machine?.machineRole);
    roles.add(machine?.machineRole);

    const signature = (machine?.components || []).map((entry) => entry?.role).join('|');
    if (signatures.has(signature)) reasons.push('DUPLICATE_MECHANISM_SIGNATURE');
    signatures.add(signature);

    for (const entry of machine?.components || []) {
      const node = validateSpatialConstructionNode(entry);
      if (!node.valid) reasons.push(...node.reasons);
      if (entry?.constructionSlice !== 'S7') reasons.push(entry?.id + ':NOT_S7');
    }
    const inputPorts = (machine?.ports || []).filter((port) => port.role === 'machine-core-input');
    const outputPorts = (machine?.ports || []).filter((port) => port.role === 'machine-output');
    if (inputPorts.length !== 1) reasons.push(machine?.id + ':CORE_INPUT_PORT_COUNT');
    if (outputPorts.length !== 1) reasons.push(machine?.id + ':MACHINE_OUTPUT_PORT_COUNT');
    if (Array.isArray(machine?.physicalInterfaces)) {
      const roles = machine.physicalInterfaces.map((entry) => entry.role);
      if (roles.filter((role) => role === 'machine-core-input').length !== 1) reasons.push(machine?.id + ':CORE_INPUT_INTERFACE_COUNT');
      if (roles.filter((role) => role === 'machine-output').length !== 1) reasons.push(machine?.id + ':MACHINE_OUTPUT_INTERFACE_COUNT');
      if (roles.filter((role) => role === 'facility-port-adapter').length !== machine.facilityIds.length) reasons.push(machine?.id + ':FACILITY_ADAPTER_COUNT');
      for (const entry of machine.physicalInterfaces) {
        const node = validateSpatialConstructionNode(entry);
        if (!node.valid) reasons.push(...node.reasons);
        if (entry.constructionSlice !== 'S7') reasons.push(entry.id + ':NOT_S7');
      }
    }
    for (const edge of machine?.mechanismGraph || [])
      if (!edge?.from || !edge?.to || edge.from === edge.to) reasons.push(machine?.id + ':INVALID_MECHANISM_EDGE');
  }

  const expectedRoles = new Set(Object.keys(MACHINE_PROFILES));
  for (const role of expectedRoles) if (!roles.has(role)) reasons.push('MISSING_MACHINE_ROLE:' + role);

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    machineCount: list.length,
    roleCount: roles.size,
    inheritedStructuralRoots: requiredStructuralRootsForSlice('S7'),
  });
}
