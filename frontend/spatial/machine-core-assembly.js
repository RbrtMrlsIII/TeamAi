/**
 * TEAM-EXPERIENCE-029 / S2
 * Canonical central-core physical assembly descriptor.
 *
 * Owns physical composition metadata only. Semantic domain state, backend
 * authority, topology routing, and theme state remain outside this module.
 */
import {
  createSpatialConstructionContext,
  validateSpatialConstructionNode,
} from './machine-spatial-root-contract.js';
import { deriveMachineSubject } from './machine-subject.js';

const TAU = Math.PI * 2;
const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const polar = (radius, angle, y) => Object.freeze({
  x: Math.cos(angle) * radius,
  y,
  z: Math.sin(angle) * radius,
});

const toDimensions = (radius, height) => Object.freeze({
  x: radius * 2,
  y: Math.max(0.001, height),
  z: radius * 2,
});

const ROOT_OWNER = 'frontend/spatial/machine-core-assembly.js';

function rootContext(semanticId = null) {
  return createSpatialConstructionContext({
    slice: 'S2',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function freezeComponent({
  id,
  role,
  profile,
  center,
  radius,
  height,
  materialRole,
} = {}) {
  const context = rootContext();
  return Object.freeze({
    id,
    role,
    profile,
    center: Object.freeze({ ...center }),
    radius: Number(radius),
    height: Number(height),
    dimensions: toDimensions(radius, height),
    materialRole,
    ...context,
  });
}

export const MACHINE_CORE_ASSEMBLY_ID = 'MACHINE-CORE-ASSEMBLY';
export const MACHINE_CORE_ASSEMBLY_VERSION = 'S2-V5';

export const CORE_COMPONENT_ROLES = Object.freeze([
  'foundation-shell',
  'upper-shell',
  'receiving-deck',
  'reactor-chamber',
  'reactor-cap',
  'conductor-collar',
]);

export const CORE_PORT_ROLES = Object.freeze([
  'north',
  'east',
  'south',
  'west',
]);

const CORE_REACTOR_CAGE_FIN_OUTLINE = Object.freeze([
  [-1.00, -0.70],
  [-0.38, -1.00],
  [0.48, -0.92],
  [1.00, -0.12],
  [0.62, 0.74],
  [-0.22, 1.00],
  [-1.00, 0.26],
]);


export function deriveMachineCorePorts({
  hub,
  expansionAmount = 0,
  requestedClearance = 0.16,
} = {}) {
  if (!hub?.center || !hub?.dimensions) return Object.freeze([]);

  const expansion = clamp01(expansionAmount);
  const clearance = Math.max(0, finite(requestedClearance, 0.16));
  const center = Object.freeze({
    x: finite(hub.center.x),
    y: finite(hub.center.y, 0.42),
    z: finite(hub.center.z),
  });
  const hubRadius = Math.max(
    0.8,
    Math.max(Number(hub.dimensions.x) || 0, Number(hub.dimensions.z) || 0) * 0.5,
  );
  const portReach = Math.max(
    hubRadius * (1.04 + 0.05 * expansion) + clearance,
    hubRadius * (1.12 + 0.04 * expansion) + clearance * 1.25,
  );

  return Object.freeze(
    CORE_PORT_ROLES.map((role, index) => {
      const angle = index * (TAU / CORE_PORT_ROLES.length);
      const semanticId = `MACHINE-CORE:PORT:${role.toUpperCase()}`;
      return Object.freeze({
        id: semanticId,
        role,
        index,
        angle,
        point: polar(portReach, angle, center.y + 0.52),
        radius: 0.13 + 0.035 * expansion,
        ...rootContext(semanticId),
      });
    }),
  );
}

export function deriveMachineCoreAssembly({
  hub,
  workspaceCore = null,
  expansionAmount = 0,
  receptionAmount = 0,
  adjacentSeatRadius = null,
  requestedClearance = 0.16,
} = {}) {
  if (!hub?.center || !hub?.dimensions) return null;

  const expansion = clamp01(expansionAmount);
  const reception = clamp01(receptionAmount);
  const clearance = Math.max(0, finite(requestedClearance, 0.16));
  const center = Object.freeze({
    x: finite(hub.center.x),
    y: finite(hub.center.y, 0.42),
    z: finite(hub.center.z),
  });

  const hubRadius = Math.max(
    0.8,
    Math.max(Number(hub.dimensions.x) || 0, Number(hub.dimensions.z) || 0) * 0.5,
  );
  const foundationRadius = hubRadius * (1.12 + 0.04 * expansion);
  const shellRadius = hubRadius * (1.04 + 0.05 * expansion);
  const reactorRadius = hubRadius * (0.40 + 0.025 * expansion);
  const collarRadius = reactorRadius * (1.34 + 0.04 * expansion);
  const workspaceRadius = workspaceCore?.radius
    ? Math.max(0.8, Number(workspaceCore.radius))
    : hubRadius * 3;
  const receivingRadius = Math.max(
    0.8,
    Math.min(workspaceRadius * 0.26, hubRadius * 0.82),
  );
  const components = Object.freeze([
    freezeComponent({
      id: 'CORE_FOUNDATION_SHELL',
      role: 'foundation-shell',
      profile: 'hex-foundation',
      center: { ...center, y: center.y },
      radius: foundationRadius,
      height: 0.34 + 0.04 * expansion,
      materialRole: 'metal2',
    }),
    freezeComponent({
      id: 'CORE_UPPER_SHELL',
      role: 'upper-shell',
      profile: 'hex-upper-shell',
      center: { ...center, y: center.y + 0.31 },
      radius: shellRadius,
      height: 0.42 + 0.04 * expansion,
      materialRole: 'metal',
    }),
    freezeComponent({
      id: 'CORE_RECEIVING_DECK',
      role: 'receiving-deck',
      profile: 'dodec-receiving-deck',
      center: { ...center, y: center.y + 0.60 },
      radius: receivingRadius,
      height: 0.10,
      materialRole: 'glass',
    }),
    freezeComponent({
      id: 'CORE_REACTOR_CHAMBER',
      role: 'reactor-chamber',
      profile: 'oct-reactor',
      center: { ...center, y: center.y + 1.02 },
      radius: reactorRadius,
      height: 1.18 + 0.10 * expansion,
      materialRole: 'energy',
    }),
    freezeComponent({
      id: 'CORE_REACTOR_CAP',
      role: 'reactor-cap',
      profile: 'dodec-reactor-cap',
      center: { ...center, y: center.y + 1.67 + 0.05 * expansion },
      radius: reactorRadius * 1.10,
      height: 0.12,
      materialRole: 'glass',
    }),
    freezeComponent({
      id: 'CORE_CONDUCTOR_COLLAR',
      role: 'conductor-collar',
      profile: 'hex-conductor',
      center: { ...center, y: center.y + 0.68 },
      radius: collarRadius,
      height: 0.10,
      materialRole: 'metal',
    }),
  ]);

  const concentricMechanisms = Object.freeze(
    [0.76, 0.90, 1].map((scale, index) => {
      const id = `CORE_CONCENTRIC_MECHANISM_${index + 1}`;
      const context = rootContext();
      return Object.freeze({
        id,
        radius: receivingRadius * scale * (1 + 0.025 * expansion),
        y: center.y + 0.46 + index * 0.07,
        phase: expansion * Math.PI * (index % 2 === 0 ? 0.08 : -0.06),
        signal: clamp01(reception * (0.55 + index * 0.18)),
        ...context,
      });
    }),
  );
  const mechanicalDetails = Object.freeze([
    ...Array.from({ length: 6 }, (_, index) => {
      const angle = index * (TAU / 6) + Math.PI / 6;
      const radius = foundationRadius * 0.70;
      const point = polar(radius, angle, center.y + 0.36 + 0.02 * expansion);
      return Object.freeze({
        id: `CORE_FOUNDATION_BRACE_${index + 1}`,
        role: 'foundation-brace',
        profile: 'radial-foundation-brace',
        center: point,
        dimensions: Object.freeze({
          x: foundationRadius * 0.50,
          y: 0.11 + 0.02 * expansion,
          z: 0.15,
        }),
        rotationY: angle,
        materialRole: 'metal',
        ...rootContext(),
      });
    }),
    ...Array.from({ length: 6 }, (_, index) => {
      const angle = index * (TAU / 6);
      const radius = collarRadius * 1.18;
      const point = polar(radius, angle, center.y + 0.86 + 0.03 * expansion);
      return Object.freeze({
        id: `CORE_REACTOR_GUARD_${index + 1}`,
        role: 'reactor-guard',
        profile: 'reactor-guard-post',
        center: point,
        dimensions: Object.freeze({
          x: 0.11,
          y: 0.34 + 0.04 * expansion,
          z: 0.11,
        }),
        rotationY: angle,
        materialRole: 'metal2',
        ...rootContext(),
      });
    }),
    ...Array.from({ length: 6 }, (_, index) => {
      const angle = index * (TAU / 6);
      const radius = foundationRadius * 0.80;
      const point = polar(radius, angle, center.y + 0.25 + 0.01 * expansion);
      return Object.freeze({
        id: `CORE_FOUNDATION_PANEL_${index + 1}`,
        role: 'foundation-panel',
        profile: 'beveled-foundation-panel',
        center: point,
        dimensions: Object.freeze({
          x: foundationRadius * 0.26,
          y: 0.18 + 0.02 * expansion,
          z: foundationRadius * 0.12,
        }),
        rotationY: angle,
        materialRole: 'metal',
        ...rootContext(),
      });
    }),
    ...Array.from({ length: 4 }, (_, index) => {
      const angle = index * (TAU / 4);
      const radius = hubRadius * 0.92;
      const point = polar(radius, angle, center.y + 0.69 + 0.02 * expansion);
      return Object.freeze({
        id: `CORE_PORT_COLLAR_${index + 1}`,
        role: 'port-collar',
        profile: 'radial-port-collar',
        center: point,
        dimensions: Object.freeze({
          x: hubRadius * 0.20,
          y: 0.14 + 0.01 * expansion,
          z: hubRadius * 0.14,
        }),
        rotationY: angle,
        materialRole: 'metal2',
        ...rootContext(),
      });
    }),
    ...Array.from({ length: 6 }, (_, index) => {
      const angle = index * (TAU / 6) + Math.PI / 6;
      const radius = reactorRadius * 0.92;
      const point = polar(radius, angle, center.y + 1.08 + 0.03 * expansion);
      return Object.freeze({
        id: `CORE_REACTOR_RIB_${index + 1}`,
        role: 'reactor-rib',
        profile: 'reactor-rib',
        center: point,
        dimensions: Object.freeze({
          x: 0.075,
          y: 0.28 + 0.03 * expansion,
          z: 0.11,
        }),
        rotationY: angle,
        materialRole: 'metal2',
        ...rootContext(),
      });
    }),
    ...Array.from({ length: 3 }, (_, index) => {
      const bandScale = [0.92, 1.02, 1.12][index];
      return Object.freeze({
        id: `CORE_REACTOR_BAND_${index + 1}`,
        role: 'reactor-band',
        profile: 'concentric-reactor-band',
        center: Object.freeze({
          x: center.x,
          y: center.y + 0.96 + index * 0.19 + 0.03 * expansion,
          z: center.z,
        }),
        dimensions: Object.freeze({
          x: reactorRadius * bandScale,
          y: 0.075 + 0.01 * expansion,
          z: reactorRadius * bandScale,
        }),
        rotationY: Math.PI / 12 * index,
        materialRole: 'glass',
        ...rootContext(),
      });
    }),
        Object.freeze({
      id: 'CORE_REACTOR_INNER_HOUSING',
      role: 'reactor-inner-housing',
      profile: 'nested-reactor-housing',
      center: Object.freeze({
        x: center.x,
        y: center.y + 0.94 + 0.04 * expansion,
        z: center.z,
      }),
      dimensions: Object.freeze({
        x: reactorRadius * 1.46,
        y: 0.22 + 0.03 * expansion,
        z: reactorRadius * 1.46,
      }),
      rotationY: Math.PI / 8,
      materialRole: 'glass',
      ...rootContext(),
    }),,
    ...Array.from({ length: 8 }, (_, index) => {
      const angle = index * (TAU / 8) + Math.PI / 8;
      const radius = reactorRadius * 1.18;
      const point = polar(radius, angle, center.y + 1.12 + 0.03 * expansion);
      return Object.freeze({
        id: `CORE_REACTOR_CAGE_FIN_${index + 1}`,
        role: 'reactor-cage-fin',
        profile: 'radial-reactor-cage-fin',
        center: point,
        dimensions: Object.freeze({
          x: Math.min(0.24, reactorRadius * 0.42),
          y: 0.72 + 0.06 * expansion,
          z: Math.min(0.30, reactorRadius * 0.52),
        }),
        rotationY: angle,
        materialRole: index % 2 === 0 ? 'metal2' : 'metal',
        outline: CORE_REACTOR_CAGE_FIN_OUTLINE,
        ...rootContext(),
      });
    }),
  ]);

  const ports = deriveMachineCorePorts({
    hub,
    expansionAmount: expansion,
    requestedClearance: clearance,
  });

  const subjectParts = [
    ...components.map((component) => ({
      id: component.id,
      center: component.center,
      dimensions: component.dimensions,
    })),
    ...mechanicalDetails.map((detail) => ({
      id: detail.id,
      center: detail.center,
      dimensions: detail.dimensions,
    })),
  ];
  const portSubjectParts = ports.map((port) => ({
    id: `${port.id}:SUBJECT`,
    center: port.point,
    dimensions: {
      x: port.radius * 2,
      y: port.radius * 2,
      z: port.radius * 2,
    },
  }));

  const mechanicalDetailRadialExtent = Math.max(
    ...mechanicalDetails.map((detail) =>
      Math.hypot(
        Number(detail.center.x) - center.x,
        Number(detail.center.z) - center.z,
      ) + Math.hypot(
        Number(detail.dimensions?.x || 0) * 0.5,
        Number(detail.dimensions?.z || 0) * 0.5,
      )
    ),
    foundationRadius,
  );
  const portRadialExtent = Math.max(
    ...ports.map((port) =>
      Math.hypot(
        Number(port.point.x) - center.x,
        Number(port.point.z) - center.z,
      ) + Number(port.radius || 0)
    ),
    0,
  );
  const assemblyRadius = Math.max(
    foundationRadius,
    mechanicalDetailRadialExtent,
    portRadialExtent,
  );
  const root = rootContext();
  const radialCenterlineGap = adjacentSeatRadius == null
    ? null
    : Number(adjacentSeatRadius) - assemblyRadius;

  return Object.freeze({
    id: MACHINE_CORE_ASSEMBLY_ID,
    version: MACHINE_CORE_ASSEMBLY_VERSION,
    ...root,
    center,
    components,
    concentricMechanisms,
    mechanicalDetails,
    ports,
    portByRole: Object.freeze(Object.fromEntries(ports.map((port) => [port.role, port]))),
    expansionAmount: expansion,
    receptionAmount: reception,
    envelope: Object.freeze({
      radius: assemblyRadius,
      height: components.reduce(
        (max, component) => Math.max(max, component.center.y + component.height / 2),
        center.y,
      ) - Math.min(
        ...components.map((component) => component.center.y - component.height / 2),
      ),
      radialCenterlineGap,
      requestedClearance: clearance,
      workspaceCoreRadius: workspaceRadius,
      portReach: Math.max(...ports.map((port) => Math.hypot(port.point.x - center.x, port.point.z - center.z)), 0),
      workspaceReceivingRatio: receivingRadius / workspaceRadius,
    }),
    subject: deriveMachineSubject([...subjectParts, ...portSubjectParts], 0.08),
    presentationOnly: true,
  });
}

export function validateMachineCoreAssembly(assembly) {
  const reasons = [];
  const root = validateSpatialConstructionNode(assembly || {});
  if (!root.valid) reasons.push(...root.reasons);

  if (!assembly || assembly.id !== MACHINE_CORE_ASSEMBLY_ID) {
    reasons.push('INVALID_CORE_ASSEMBLY_ID');
  }
  if (assembly?.constructionSlice !== 'S2') {
    reasons.push('CORE_ASSEMBLY_NOT_ROOTED_AT_S2');
  }
  if (assembly?.constructionOwner !== ROOT_OWNER) {
    reasons.push('CORE_ASSEMBLY_OWNER_MISMATCH');
  }
  if (assembly?.components?.length !== CORE_COMPONENT_ROLES.length) {
    reasons.push('CORE_COMPONENT_COUNT_MISMATCH');
  }
  if (assembly?.ports?.length !== CORE_PORT_ROLES.length) {
    reasons.push('CORE_PORT_COUNT_MISMATCH');
  }

  for (const component of assembly?.components || []) {
    if (!CORE_COMPONENT_ROLES.includes(component.role)) {
      reasons.push(`UNKNOWN_CORE_COMPONENT:${component?.role || 'unknown'}`);
    }
    if (!Number.isFinite(component.radius) || component.radius <= 0) {
      reasons.push(`INVALID_COMPONENT_RADIUS:${component?.id || 'unknown'}`);
    }
    if (!Number.isFinite(component.height) || component.height <= 0) {
      reasons.push(`INVALID_COMPONENT_HEIGHT:${component?.id || 'unknown'}`);
    }
    if (component.constructionSlice !== 'S2') {
      reasons.push(`COMPONENT_NOT_S2:${component?.id || 'unknown'}`);
    }
    if (component.constructionOwner !== ROOT_OWNER) {
      reasons.push(`COMPONENT_OWNER_MISMATCH:${component?.id || 'unknown'}`);
    }
  }

  const portRoles = new Set();
  for (const port of assembly?.ports || []) {
    if (!CORE_PORT_ROLES.includes(port.role)) {
      reasons.push(`UNKNOWN_CORE_PORT:${port?.role || 'unknown'}`);
    }
    if (portRoles.has(port.role)) {
      reasons.push(`DUPLICATE_CORE_PORT:${port.role}`);
    }
    portRoles.add(port.role);
    if (!port.point || ![port.point.x, port.point.y, port.point.z].every(Number.isFinite)) {
      reasons.push(`INVALID_CORE_PORT_POINT:${port?.id || 'unknown'}`);
    }
    if (port.constructionSlice !== 'S2') {
      reasons.push(`PORT_NOT_S2:${port?.id || 'unknown'}`);
    }
  }

  if (assembly?.envelope?.radialCenterlineGap != null
    && assembly.envelope.radialCenterlineGap < assembly.envelope.requestedClearance) {
    reasons.push('CORE_TO_SEAT_CLEARANCE_UNPROVEN');
  }

  const subjectValid = Boolean(
    assembly?.subject
      && [
        assembly.subject.min.x,
        assembly.subject.min.y,
        assembly.subject.min.z,
        assembly.subject.max.x,
        assembly.subject.max.y,
        assembly.subject.max.z,
      ].every(Number.isFinite),
  );
  if (!subjectValid) reasons.push('CORE_SUBJECT_NOT_PROVEN');

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
  });
}
