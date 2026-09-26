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
export const MACHINE_FACILITY_MACHINERY_VERSION = 'S7-V4';

const ROOT_OWNER = 'frontend/spatial/machine-facility-machinery.js';
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

function component(id, role, shape, center, dimensions, materialRole, rotationY = 0) {
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
          { x: width * 0.34, y: height * 0.42, z: width * 0.34 }, 'metal'),
        component(id('BARREL_STAGE_2'), 'barrel-stage-2', 'CYL',
          { x: center.x + basis.outward.x * 0.42, y: center.y + 0.25, z: center.z + basis.outward.z * 0.42 },
          { x: width * 0.27, y: height * 0.35, z: width * 0.27 }, 'glass'),
        component(id('BARREL_STAGE_3'), 'barrel-stage-3', 'CYL',
          { x: center.x + basis.outward.x * 0.68, y: center.y + 0.28, z: center.z + basis.outward.z * 0.68 },
          { x: width * 0.19, y: height * 0.28, z: width * 0.19 }, 'energy'),
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
        component(id('DEPLOYMENT_FIN'), 'deployment-fin', 'CUBE',
          { x: center.x + basis.tangent.x * 0.34, y: center.y + 0.34, z: center.z + basis.tangent.z * 0.34 },
          { x: width * 0.18, y: height * 0.72, z: depth * 0.78 }, 'glass',
          0.32),
        component(id('DEPLOYMENT_FIN_SECONDARY'), 'deployment-fin-secondary', 'CUBE',
          { x: center.x - basis.tangent.x * 0.34, y: center.y + 0.38, z: center.z - basis.tangent.z * 0.34 },
          { x: width * 0.16, y: height * 0.65, z: depth * 0.64 }, 'metal',
          -0.28),
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
        component(id('SENSOR_DISH'), 'sensor-dish', 'CUBE',
          { x: center.x + basis.outward.x * 0.28, y: center.y + 0.76, z: center.z + basis.outward.z * 0.28 },
          { x: width * 0.46, y: height * 0.12, z: depth * 0.42 }, 'glass',
          basis.angle + 0.22),
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

function machinePorts(assembly) {
  const center = assembly.outerHousing.center;
  const angle = Math.atan2(center.z, center.x);
  const radial = Math.hypot(center.x, center.z);
  const outward = { x: Math.cos(angle), z: Math.sin(angle) };
  return Object.freeze([
    ...assembly.ports,
    Object.freeze({
      id: 'MACHINE-PORT:' + assembly.branchId + ':CORE-IN',
      facilityId: null,
      role: 'machine-core-input',
      point: Object.freeze({
        x: center.x - outward.x * 0.72,
        y: center.y + 0.28,
        z: center.z - outward.z * 0.72,
      }),
      radius: 0.10,
      ...rootContext(assembly.branchId + ':CORE-IN'),
    }),
    Object.freeze({
      id: 'MACHINE-PORT:' + assembly.branchId + ':MACHINE-OUT',
      facilityId: null,
      role: 'machine-output',
      point: Object.freeze({
        x: center.x + outward.x * Math.max(0.82, radial * 0.035),
        y: center.y + 0.32,
        z: center.z + outward.z * Math.max(0.82, radial * 0.035),
      }),
      radius: 0.10,
      ...rootContext(assembly.branchId + ':MACHINE-OUT'),
    }),
  ]);
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
    const ports = machinePorts(assembly);
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
        ports.map((port) => ({
          id: port.id,
          center: port.point,
          dimensions: { x: port.radius * 2, y: port.radius * 2, z: port.radius * 2 },
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
      payloadSurface,
      mechanismGraph: buildGraph(components),
      ports,
      subject,
      envelope: Object.freeze({
        radius: Math.max(...components.map((entry) => {
          const motion = maxMotionById.get(entry.id);
          return Math.hypot(
            entry.center.x + finite(motion?.dx) - assembly.outerHousing.center.x,
            entry.center.z + finite(motion?.dz) - assembly.outerHousing.center.z,
          ) + Math.hypot(entry.dimensions.x, entry.dimensions.z) * 0.5;
        })),
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
    for (const edge of machine?.mechanismGraph || []) {
      if (!edge?.from || !edge?.to || edge.from === edge.to) reasons.push(machine?.id + ':INVALID_MECHANISM_EDGE');
    }
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
