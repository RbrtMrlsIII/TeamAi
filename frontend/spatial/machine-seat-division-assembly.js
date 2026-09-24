/**
 * TEAM-EXPERIENCE-029 / S4
 * Canonical physical Seat-division assembly descriptor.
 *
 * Owns the physical subassembly grammar for the seven Seat divisions.
 * It consumes the existing semantic payload + geometry contracts and does not
 * create a second semantic hierarchy or backend authority.
 */
import {
  createSpatialConstructionContext,
  validateSpatialConstructionNode,
} from './machine-spatial-root-contract.js';
import { deriveMachineSubject } from './machine-subject.js';
import {
  measureDivisionPayload,
  resolveSeatDivisionSemanticId,
} from './seat-division-geometry.js';
import { resolveSeatDivisionPayload } from './machine-seat-division-payload.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

export const MACHINE_SEAT_DIVISION_ASSEMBLY_ID = 'MACHINE-SEAT-DIVISION-ASSEMBLY';
export const MACHINE_SEAT_DIVISION_ASSEMBLY_VERSION = 'S4-V2';
export const MACHINE_SEAT_DIVISION_COMPONENT_PROFILES = Object.freeze({
  SEAT_CONNECTION: Object.freeze(['coupler-ring', 'connector-housing', 'locking-lugs']),
  SEAT_BEHAVIOR: Object.freeze(['rule-baffles', 'behavior-rail', 'articulation-pivots']),
  SEAT_TOOLKIT: Object.freeze(['equipment-rack', 'tool-cartridges', 'clamp-brace']),
  SEAT_CAPABILITIES: Object.freeze(['capability-lattice', 'action-nodes', 'distribution-ring']),
  SEAT_AUTHORIZATION: Object.freeze(['authorization-shield', 'policy-ring', 'lock-actuator']),
  SEAT_WORKSPACE_SCOPE: Object.freeze(['scope-frame', 'workspace-anchor', 'boundary-lattice']),
  SEAT_TASK_EVIDENCE: Object.freeze(['evidence-drum', 'timeline-rail', 'trace-bay']),
});

export const MACHINE_SEAT_DIVISION_ATTACHMENT_PROFILES = Object.freeze({
  SEAT_CONNECTION: Object.freeze({
    type: 'RADIAL_COUPLER',
    axis: 'radial',
    primaryComponent: 'coupler-ring',
    motion: 'translate',
    travel: 0.24,
  }),
  SEAT_BEHAVIOR: Object.freeze({
    type: 'HINGED_BAFFLE',
    axis: 'y',
    primaryComponent: 'rule-baffles',
    motion: 'rotate',
    travel: Math.PI * 0.28,
  }),
  SEAT_TOOLKIT: Object.freeze({
    type: 'TELESCOPING_RACK',
    axis: 'radial',
    primaryComponent: 'equipment-rack',
    motion: 'translate',
    travel: 0.32,
  }),
  SEAT_CAPABILITIES: Object.freeze({
    type: 'ROTARY_LATTICE',
    axis: 'y',
    primaryComponent: 'capability-lattice',
    motion: 'rotate',
    travel: Math.PI * 0.5,
  }),
  SEAT_AUTHORIZATION: Object.freeze({
    type: 'IRIS_SHIELD',
    axis: 'y',
    primaryComponent: 'authorization-shield',
    motion: 'rotate',
    travel: Math.PI * 0.34,
  }),
  SEAT_WORKSPACE_SCOPE: Object.freeze({
    type: 'TELESCOPING_FRAME',
    axis: 'radial',
    primaryComponent: 'scope-frame',
    motion: 'translate',
    travel: 0.28,
  }),
  SEAT_TASK_EVIDENCE: Object.freeze({
    type: 'DRUM_EXTRACTION',
    axis: 'y',
    primaryComponent: 'evidence-drum',
    motion: 'rotate',
    travel: Math.PI * 0.42,
  }),
});

const ROOT_OWNER = 'frontend/spatial/machine-seat-division-assembly.js';

function rootContext(semanticId = null) {
  return createSpatialConstructionContext({
    slice: 'S4',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function normalizeScale(scale = {}) {
  return Object.freeze({
    x: Math.max(0.02, finite(scale.x, 0.1)),
    y: Math.max(0.02, finite(scale.y, 0.1)),
    z: Math.max(0.02, finite(scale.z, 0.1)),
  });
}

function component({
  id,
  role,
  profile,
  shape,
  offset = { x: 0, y: 0, z: 0 },
  scale,
  rotationY = 0,
  materialRole = 'metal',
  semanticId,
} = {}) {
  const normalizedScale = normalizeScale(scale);
  return Object.freeze({
    id,
    role,
    profile,
    shape,
    offset: Object.freeze({
      x: finite(offset.x),
      y: finite(offset.y),
      z: finite(offset.z),
    }),
    scale: normalizedScale,
    dimensions: Object.freeze({
      x: Math.abs(normalizedScale.x) * 2,
      y: Math.abs(normalizedScale.y),
      z: Math.abs(normalizedScale.z) * 2,
    }),
    rotationY: finite(rotationY),
    materialRole,
    ...rootContext(semanticId),
  });
}

function localDimensions(componentEntry) {
  return componentEntry?.dimensions || Object.freeze({
    x: Math.abs(Number(componentEntry?.scale?.x) || 0) * 2,
    y: Math.abs(Number(componentEntry?.scale?.y) || 0),
    z: Math.abs(Number(componentEntry?.scale?.z) || 0) * 2,
  });
}

function makePhysicalSubjectParts(center, componentEntries) {
  return componentEntries.map((entry) => ({
    id: entry.id,
    center: {
      x: center.x + entry.offset.x,
      y: center.y + entry.offset.y,
      z: center.z + entry.offset.z,
    },
    dimensions: localDimensions(entry),
  }));
}

function makeInterfaceSubjectParts(ports) {
  return ports.map((port) => ({
    id: port.id + ':INTERFACE_SUBJECT',
    center: port.point,
    dimensions: {
      x: port.radius * 2,
      y: port.radius * 2,
      z: port.radius * 2,
    },
  }));
}

function buildFamilyComponents({
  semanticId,
  branchId,
  center,
  dimensions,
  amount,
  payloadDensity,
} = {}) {
  const width = Math.max(0.3, finite(dimensions.width, 0.55));
  const depth = Math.max(0.22, finite(dimensions.depth, 0.38));
  const height = Math.max(0.08, finite(dimensions.height, 0.08));
  const radial = Math.max(width, depth) * 0.5;
  const deploy = 0.75 + 0.25 * clamp01(amount);
  const density = Math.max(0.5, Math.min(1.6, finite(payloadDensity, 1)));
  const rootId = `TREE-HERO-SEAT:${branchId}:${semanticId}`;
  const profile = (key) => MACHINE_SEAT_DIVISION_COMPONENT_PROFILES[semanticId]?.includes(key) ? key : null;

  switch (semanticId) {
    case 'SEAT_CONNECTION':
      return Object.freeze([
        component({
          id: rootId + ':COUPLER-RING',
          role: 'coupler-ring',
          profile: profile('coupler-ring'),
          shape: 'TORUS',
          offset: { y: height * 0.05 },
          scale: { x: radial * 0.95, y: 1, z: radial * 0.95 },
          materialRole: 'energy',
          semanticId,
        }),
        component({
          id: rootId + ':CONNECTOR-HOUSING',
          role: 'connector-housing',
          profile: profile('connector-housing'),
          shape: 'CYL',
          offset: { y: height * 0.32 },
          scale: { x: width * 0.30, y: height * 1.9, z: depth * 0.30 },
          materialRole: 'metal',
          semanticId,
        }),
        component({
          id: rootId + ':LOCKING-LUGS',
          role: 'locking-lugs',
          profile: profile('locking-lugs'),
          shape: 'CUBE',
          offset: { y: height * 0.52, z: depth * 0.31 },
          scale: { x: width * 0.20, y: height * 1.8, z: depth * 0.14 },
          rotationY: Math.PI * 0.5,
          materialRole: 'glass',
          semanticId,
        }),
      ]);
    case 'SEAT_BEHAVIOR':
      return Object.freeze([
        component({
          id: rootId + ':RULE-BAFFLES',
          role: 'rule-baffles',
          profile: profile('rule-baffles'),
          shape: 'CUBE',
          offset: { x: -width * 0.26, y: height * 0.45 },
          scale: { x: width * 0.18, y: height * 2.2, z: depth * 0.58 * deploy },
          rotationY: -0.18 * deploy,
          materialRole: 'metal2',
          semanticId,
        }),
        component({
          id: rootId + ':BEHAVIOR-RAIL',
          role: 'behavior-rail',
          profile: profile('behavior-rail'),
          shape: 'TORUS',
          offset: { y: height * 0.56 },
          scale: { x: radial * 0.76, y: 1, z: radial * 0.48 },
          materialRole: 'glass',
          semanticId,
        }),
        component({
          id: rootId + ':ARTICULATION-PIVOTS',
          role: 'articulation-pivots',
          profile: profile('articulation-pivots'),
          shape: 'CYL',
          offset: { x: width * 0.25, y: height * 0.52 },
          scale: { x: width * 0.12, y: height * 1.6, z: depth * 0.12 },
          materialRole: 'trace',
          semanticId,
        }),
      ]);
    case 'SEAT_TOOLKIT':
      return Object.freeze([
        component({
          id: rootId + ':EQUIPMENT-RACK',
          role: 'equipment-rack',
          profile: profile('equipment-rack'),
          shape: 'CUBE',
          offset: { x: -width * 0.18, y: height * 0.42 },
          scale: { x: width * 0.42, y: height * 2.4, z: depth * 0.18 },
          materialRole: 'metal',
          semanticId,
        }),
        component({
          id: rootId + ':TOOL-CARTRIDGES',
          role: 'tool-cartridges',
          profile: profile('tool-cartridges'),
          shape: 'CYL',
          offset: { x: width * 0.18, y: height * 0.42 },
          scale: { x: width * 0.14 * density, y: height * 2.5 * deploy, z: depth * 0.14 },
          materialRole: 'glass',
          semanticId,
        }),
        component({
          id: rootId + ':CLAMP-BRACE',
          role: 'clamp-brace',
          profile: profile('clamp-brace'),
          shape: 'TORUS',
          offset: { y: height * 0.60 },
          scale: { x: radial * 0.68, y: 1, z: radial * 0.54 },
          materialRole: 'trace',
          semanticId,
        }),
      ]);
    case 'SEAT_CAPABILITIES':
      return Object.freeze([
        component({
          id: rootId + ':CAPABILITY-LATTICE',
          role: 'capability-lattice',
          profile: profile('capability-lattice'),
          shape: 'TORUS',
          offset: { y: height * 0.44 },
          scale: { x: radial * 0.80, y: 1, z: radial * 0.80 },
          materialRole: 'glass',
          semanticId,
        }),
        component({
          id: rootId + ':ACTION-NODES',
          role: 'action-nodes',
          profile: profile('action-nodes'),
          shape: 'CUBE',
          offset: { x: width * 0.22, y: height * 0.46 },
          scale: { x: width * 0.20, y: height * 1.1, z: depth * 0.20 },
          materialRole: 'energy',
          semanticId,
        }),
        component({
          id: rootId + ':DISTRIBUTION-RING',
          role: 'distribution-ring',
          profile: profile('distribution-ring'),
          shape: 'CYL',
          offset: { y: height * 0.18 },
          scale: { x: width * 0.18, y: height * 0.52, z: depth * 0.18 },
          materialRole: 'metal2',
          semanticId,
        }),
      ]);
    case 'SEAT_AUTHORIZATION':
      return Object.freeze([
        component({
          id: rootId + ':AUTHORIZATION-SHIELD',
          role: 'authorization-shield',
          profile: profile('authorization-shield'),
          shape: 'CUBE',
          offset: { y: height * 0.42 },
          scale: { x: width * 0.32, y: height * 2.4, z: depth * 0.10 },
          rotationY: Math.PI * 0.25,
          materialRole: 'glass',
          semanticId,
        }),
        component({
          id: rootId + ':POLICY-RING',
          role: 'policy-ring',
          profile: profile('policy-ring'),
          shape: 'TORUS',
          offset: { y: height * 0.54 },
          scale: { x: radial * 0.74, y: 1, z: radial * 0.74 },
          materialRole: 'energy',
          semanticId,
        }),
        component({
          id: rootId + ':LOCK-ACTUATOR',
          role: 'lock-actuator',
          profile: profile('lock-actuator'),
          shape: 'CYL',
          offset: { z: depth * 0.25, y: height * 0.34 },
          scale: { x: width * 0.11, y: height * 2.1, z: depth * 0.11 },
          materialRole: 'trace',
          semanticId,
        }),
      ]);
    case 'SEAT_WORKSPACE_SCOPE':
      return Object.freeze([
        component({
          id: rootId + ':SCOPE-FRAME',
          role: 'scope-frame',
          profile: profile('scope-frame'),
          shape: 'TORUS',
          offset: { y: height * 0.46 },
          scale: { x: radial * 0.86, y: 1, z: radial * 0.58 },
          materialRole: 'metal',
          semanticId,
        }),
        component({
          id: rootId + ':WORKSPACE-ANCHOR',
          role: 'workspace-anchor',
          profile: profile('workspace-anchor'),
          shape: 'CYL',
          offset: { y: height * 0.30 },
          scale: { x: width * 0.16, y: height * 1.7, z: depth * 0.16 },
          materialRole: 'energy',
          semanticId,
        }),
        component({
          id: rootId + ':BOUNDARY-LATTICE',
          role: 'boundary-lattice',
          profile: profile('boundary-lattice'),
          shape: 'CUBE',
          offset: { x: width * 0.24, y: height * 0.62 },
          scale: { x: width * 0.14, y: height * 1.5, z: depth * 0.48 },
          rotationY: -0.3,
          materialRole: 'glass',
          semanticId,
        }),
      ]);
    case 'SEAT_TASK_EVIDENCE':
      return Object.freeze([
        component({
          id: rootId + ':EVIDENCE-DRUM',
          role: 'evidence-drum',
          profile: profile('evidence-drum'),
          shape: 'CYL',
          offset: { y: height * 0.34 },
          scale: { x: width * 0.28, y: height * 1.7, z: depth * 0.28 },
          materialRole: 'metal2',
          semanticId,
        }),
        component({
          id: rootId + ':TIMELINE-RAIL',
          role: 'timeline-rail',
          profile: profile('timeline-rail'),
          shape: 'TORUS',
          offset: { y: height * 0.62 },
          scale: { x: radial * 0.72, y: 1, z: radial * 0.42 },
          materialRole: 'glass',
          semanticId,
        }),
        component({
          id: rootId + ':TRACE-BAY',
          role: 'trace-bay',
          profile: profile('trace-bay'),
          shape: 'CUBE',
          offset: { x: width * 0.24, y: height * 0.48 },
          scale: { x: width * 0.20, y: height * 1.25, z: depth * 0.28 },
          materialRole: 'energy',
          semanticId,
        }),
      ]);
    default:
      return Object.freeze([]);
  }
}

export function deriveMachineSeatDivisionAssembly({
  parent,
  childId,
  childIndex = 0,
  amount = 0,
  geometry = null,
} = {}) {
  const semanticId = resolveSeatDivisionSemanticId(
    'TREE-HERO-SEAT#0:' + String(childId ?? '') + ':GEOMETRY',
  );
  const payload = resolveSeatDivisionPayload(semanticId);
  if (!semanticId || !payload || !geometry || !parent?.center) return null;

  const branchId = String(parent.branchId || `BRANCH-SEAT-${Number(parent.seatIndex) + 1}`);
  const center = Object.freeze({
    x: finite(geometry.center?.x, parent.center.x),
    y: finite(geometry.center?.y, parent.center.y),
    z: finite(geometry.center?.z, parent.center.z),
  });
  const base = {
    width: Math.max(0.28, finite(geometry.dimensions?.width, 0.55)),
    height: Math.max(0.08, finite(geometry.dimensions?.height, 0.08)),
    depth: Math.max(0.20, finite(geometry.dimensions?.depth, 0.38)),
  };
  const payloadMeasure = measureDivisionPayload(payload);
  const expansion = clamp01(amount);
  const components = buildFamilyComponents({
    semanticId,
    branchId,
    center,
    dimensions: base,
    amount: expansion,
    payloadDensity: payloadMeasure.surfaceUnits,
  });

  const divisionPort = Object.freeze({
    id: `TREE-HERO-SEAT#${parent.seatIndex}:${semanticId}:ASSEMBLY_PORT`,
    role: 'division-port',
    point: Object.freeze({
      x: finite(geometry.port?.x, center.x),
      y: finite(geometry.port?.y, center.y),
      z: finite(geometry.port?.z, center.z),
    }),
    radius: Math.max(0.025, finite(geometry.clearance, 0.16) * 0.5),
    ...rootContext(semanticId + ':ASSEMBLY_PORT'),
  });
  const workspacePort = Object.freeze({
    id: `TREE-HERO-SEAT#${parent.seatIndex}:${semanticId}:WORKSPACE_PORT`,
    role: 'workspace-port',
    point: Object.freeze({
      x: finite(geometry.corridor?.end?.x, 0),
      y: finite(geometry.corridor?.end?.y, 0.5),
      z: finite(geometry.corridor?.end?.z, 0),
    }),
    radius: Math.max(0.025, finite(geometry.corridor?.radius, 0.07)),
    ...rootContext(semanticId + ':WORKSPACE_PORT'),
  });

  const ports = Object.freeze([divisionPort, workspacePort]);
  const subjectPadding = Math.max(0.06, finite(geometry.clearance, 0.16) * 0.5);
  const subject = deriveMachineSubject(
    makePhysicalSubjectParts(center, components),
    subjectPadding,
  );
  const interfaceSubject = deriveMachineSubject(
    makeInterfaceSubjectParts(ports),
    subjectPadding,
  );
  const envelope = Object.freeze({
    radius: Math.max(
      base.width * 0.5,
      base.depth * 0.5,
      ...components.map((item) => {
        const dims = localDimensions(item, base);
        return Math.hypot(
          Math.abs(item.offset.x) + dims.x * 0.5,
          Math.abs(item.offset.z) + dims.z * 0.5,
        );
      }),
    ),
    height: Math.max(
      base.height,
      ...components.map((item) => {
        const dims = localDimensions(item, base);
        return Math.abs(item.offset.y) + dims.y * 0.5;
      }),
    ) * 2,
    clearance: Math.max(0.08, finite(geometry.clearance, 0.16)),
    radialDistance: Math.max(0, finite(geometry.radialDistance, 0)),
    expandedAmount: expansion,
    payloadSurfaceUnits: payloadMeasure.surfaceUnits,
  });

  return Object.freeze({
    id: MACHINE_SEAT_DIVISION_ASSEMBLY_ID,
    version: MACHINE_SEAT_DIVISION_ASSEMBLY_VERSION,
    ...rootContext('TREE-HERO-SEAT#' + parent.seatIndex + ':' + semanticId + ':ASSEMBLY'),
    branchId,
    seatIndex: Number.isInteger(Number(parent.seatIndex)) ? Number(parent.seatIndex) : null,
    childIndex: Math.max(0, Number(childIndex) || 0),
    semanticId,
    payload,
    center,
    geometry,
    components,
    ports,
    mechanism: Object.freeze({
      type: payload.role,
      state: expansion <= 0 ? 'CLOSED' : expansion >= 1 ? 'OPEN' : 'OPENING',
      amount: expansion,
      attachment: MACHINE_SEAT_DIVISION_ATTACHMENT_PROFILES[semanticId],
      interruptionSafe: true,
      presentationOnly: true,
    }),
    envelope,
    subject,
    interfaceSubject,
    presentationOnly: true,
  });
}

export function validateMachineSeatDivisionAssembly(assembly, { expectedSemanticId = null } = {}) {
  const reasons = [];
  const root = validateSpatialConstructionNode(assembly || {});
  if (!root.valid) reasons.push(...root.reasons);
  if (!assembly || assembly.id !== MACHINE_SEAT_DIVISION_ASSEMBLY_ID) reasons.push('INVALID_DIVISION_ASSEMBLY_ID');
  if (assembly?.constructionSlice !== 'S4') reasons.push('DIVISION_ASSEMBLY_NOT_ROOTED_AT_S4');
  if (assembly?.constructionOwner !== ROOT_OWNER) reasons.push('DIVISION_ASSEMBLY_OWNER_MISMATCH');
  if (expectedSemanticId && assembly?.semanticId !== expectedSemanticId) reasons.push('DIVISION_SEMANTIC_ID_MISMATCH');
  if (!resolveSeatDivisionPayload(assembly?.semanticId)) reasons.push('DIVISION_PAYLOAD_MISSING');
  if (!Array.isArray(assembly?.components) || assembly.components.length < 3) reasons.push('DIVISION_COMPONENTS_INCOMPLETE');
  if (!Array.isArray(assembly?.ports) || assembly.ports.length !== 2) reasons.push('DIVISION_PORT_COUNT_MISMATCH');

  const allowedProfiles = MACHINE_SEAT_DIVISION_COMPONENT_PROFILES[assembly?.semanticId] || [];
  const attachment = MACHINE_SEAT_DIVISION_ATTACHMENT_PROFILES[assembly?.semanticId] || null;
  if (!attachment?.type) reasons.push('DIVISION_ATTACHMENT_PROFILE_MISSING');
  if (!attachment?.primaryComponent || !allowedProfiles.includes(attachment.primaryComponent)) reasons.push('DIVISION_ATTACHMENT_PRIMARY_COMPONENT_INVALID');
  const profiles = new Set();
  for (const entry of assembly?.components || []) {
    profiles.add(entry?.profile);
    if (!entry?.profile || !allowedProfiles.includes(entry.profile)) reasons.push(`UNKNOWN_DIVISION_PROFILE:${entry?.profile || 'missing'}`);
    if (!['CYL', 'TORUS', 'CUBE'].includes(entry?.shape)) reasons.push(`INVALID_DIVISION_SHAPE:${entry?.shape || 'missing'}`);
    const node = validateSpatialConstructionNode(entry);
    if (!node.valid) reasons.push(...node.reasons.map((reason) => `${entry?.id || 'component'}:${reason}`));
    if (entry?.constructionSlice !== 'S4') reasons.push(`${entry?.id || 'component'}:COMPONENT_NOT_S4`);
    if (entry?.constructionOwner !== ROOT_OWNER) reasons.push(`${entry?.id || 'component'}:COMPONENT_OWNER_MISMATCH`);
  }
  if (profiles.size < 3) reasons.push('DIVISION_GEOMETRY_FAMILY_NOT_DISTINCT');
  const attachmentTypes = new Set(
    Object.values(MACHINE_SEAT_DIVISION_ATTACHMENT_PROFILES).map(({ type }) => type),
  );
  if (attachmentTypes.size !== Object.keys(MACHINE_SEAT_DIVISION_ATTACHMENT_PROFILES).length) {
    reasons.push('DIVISION_ATTACHMENT_TYPES_NOT_DISTINCT');
  }

  for (const port of assembly?.ports || []) {
    const node = validateSpatialConstructionNode(port);
    if (!node.valid) reasons.push(...node.reasons.map((reason) => `${port?.id || 'port'}:${reason}`));
    if (!port?.point || ![port.point.x, port.point.y, port.point.z].every(Number.isFinite)) reasons.push('INVALID_DIVISION_PORT_POINT');
    if (port?.constructionSlice !== 'S4') reasons.push(`${port?.id || 'port'}:PORT_NOT_S4`);
  }

  const subject = assembly?.subject;
  if (!subject || ![
    subject.min?.x, subject.min?.y, subject.min?.z,
    subject.max?.x, subject.max?.y, subject.max?.z,
  ].every(Number.isFinite)) reasons.push('DIVISION_SUBJECT_NOT_PROVEN');

  if (!(Number(assembly?.envelope?.radius) > 0)) reasons.push('DIVISION_ENVELOPE_INVALID');
  if (!(Number(assembly?.envelope?.height) > 0)) reasons.push('DIVISION_ENVELOPE_HEIGHT_INVALID');

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    semanticId: assembly?.semanticId || null,
    branchId: assembly?.branchId || null,
    componentCount: assembly?.components?.length || 0,
  });
}
