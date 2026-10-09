/**
 * TEAM-EXPERIENCE-029 / S3
 * Canonical physical Pod assembly descriptor.
 *
 * Owns Pod mechanical composition and local physical interfaces.
 * Population placement remains owned by machine-core-layout.js.
 * Semantic domain state and backend authority remain outside this module.
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
const ROOT_OWNER = 'frontend/spatial/machine-pod-assembly.js';

export const MACHINE_POD_ASSEMBLY_ID = 'MACHINE-POD-ASSEMBLY';
export const MACHINE_POD_ASSEMBLY_VERSION = 'S3-V7';

export const POD_COMPONENT_ROLES = Object.freeze([
  'outer-shell',
  'structural-collar',
  'inner-chamber',
  'articulation-mechanism',
  'payload-surface',
  'connection-interface',
  'status-indicator',
]);

export const POD_PORT_ROLES = Object.freeze([
  'connection',
  'signal',
]);

export const POD_DIVISION_COUNT = 7;
export const POD_DIVISION_FAN_SPAN = (5 * Math.PI) / 6;

const POD_SHELL_RIB_OUTLINE = Object.freeze([
  [-1.00, -0.52],
  [-0.32, -0.92],
  [0.42, -0.78],
  [1.00, -0.18],
  [0.82, 0.58],
  [0.10, 1.00],
  [-0.72, 0.64],
]);


function rootContext(semanticId = null) {
  return createSpatialConstructionContext({
    slice: 'S3',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function component({ id, role, profile, center, radius, height, dimensions, materialRole }) {
  return Object.freeze({
    id,
    role,
    profile,
    center: Object.freeze({ ...center }),
    radius: Number(radius),
    height: Number(height),
    dimensions: Object.freeze({
      x: Number(dimensions?.x ?? (Number(radius) || 0) * 2),
      y: Number(dimensions?.y ?? height),
      z: Number(dimensions?.z ?? (Number(radius) || 0) * 2),
    }),
    materialRole,
    ...rootContext(),
  });
}

function port({ branchId, role, point, radius }) {
  const semanticId = `MACHINE-POD:${branchId}:PORT:${role.toUpperCase()}`;
  return Object.freeze({
    id: semanticId,
    role,
    point: Object.freeze({ ...point }),
    radius: Number(radius),
    ...rootContext(semanticId),
  });
}

export function deriveMachinePodAssembly({
  part,
  expansionAmount = 0,
  payloadDensity = 0,
  adjacentCenterSpacing = null,
  requestedClearance = 0.16,
} = {}) {
  if (part?.kind !== 'inner-pod' || !part?.center || !part?.dimensions) return null;

  const expansion = clamp01(expansionAmount);
  const density = Math.max(0, Math.min(1.5, finite(payloadDensity, 0)));
  const clearance = Math.max(0, finite(requestedClearance, 0.16));
  const center = Object.freeze({
    x: finite(part.center.x),
    y: finite(part.center.y, part.level),
    z: finite(part.center.z),
  });
  const width = Math.max(0.8, finite(part.dimensions.x, 1.34));
  const depth = Math.max(0.8, finite(part.dimensions.z, 1.08));
  const height = Math.max(0.24, finite(part.dimensions.y, 0.62));
  const branchId = String(part.branchId || 'BRANCH-SEAT-UNKNOWN');
  const outwardAngle = Math.atan2(center.z, center.x);
  const shellRadius = Math.max(width, depth) * 0.5;
  const collarRadius = Math.min(width, depth) * (0.48 + 0.03 * expansion);
  const chamberRadius = Math.min(width, depth) * (0.30 + 0.025 * expansion);
  const articulationRadius = Math.min(width, depth) * (0.39 + 0.02 * expansion);
  const connectionOffset = Math.max(0.20, shellRadius * 0.94);
  const connectionPoint = Object.freeze({
    x: center.x - Math.cos(outwardAngle) * connectionOffset,
    y: center.y + height * 0.46,
    z: center.z - Math.sin(outwardAngle) * connectionOffset,
  });
  const signalPoint = Object.freeze({
    x: center.x + Math.cos(outwardAngle) * chamberRadius * 0.58,
    y: center.y + height * (0.54 + 0.04 * expansion),
    z: center.z + Math.sin(outwardAngle) * chamberRadius * 0.58,
  });
  const payloadScale = 0.86 + 0.18 * density;
  const shellHeight = height * (0.72 + 0.08 * expansion);
  const articulationPhase = expansion * Math.PI * 0.12;
  const radial = Object.freeze({
    x: Math.cos(outwardAngle),
    z: Math.sin(outwardAngle),
  });
  const tangent = Object.freeze({
    x: -radial.z,
    z: radial.x,
  });
  const minimumSpan = Math.min(width, depth);
  const mechanicalPresentation = Object.freeze({
    axis: 'radial-outward',
    amount: expansion,
    outwardAngle,
    outward: radial,
    tangent,
    shellPanelSeparation: minimumSpan * (0.26 + 0.16 * expansion) * expansion,
    shellPanelTravel: minimumSpan * 0.16 * expansion,
    shellPanelLift: height * 0.12 * expansion,
    shellPanelRotation: 0.24 * expansion,
    collarTravel: minimumSpan * 0.16 * expansion,
    collarLift: height * 0.06 * expansion,
    chamberTravel: minimumSpan * 0.30 * expansion,
    chamberLift: height * 0.18 * expansion,
    articulationTravel: minimumSpan * 0.28 * expansion,
    articulationRotation: 0.38 * expansion,
    payloadTravel: minimumSpan * 0.38 * expansion,
    payloadLift: height * 0.42 * expansion,
    revealGap: minimumSpan * 0.12 * expansion,
    presentationOnly: true,
  });

  const mechanicalDetails = Object.freeze([
    ...[-1, 1].map((side) => Object.freeze({
      id: `MACHINE-POD:${branchId}:DOCKING-STRUT:${side > 0 ? 'RIGHT' : 'LEFT'}`,
      role: 'docking-strut',
      shape: 'CUBE',
      center: Object.freeze({
        x: center.x - radial.x * connectionOffset * 0.50
          + tangent.x * minimumSpan * 0.12 * side,
        y: center.y + height * 0.20,
        z: center.z - radial.z * connectionOffset * 0.50
          + tangent.z * minimumSpan * 0.12 * side,
      }),
      dimensions: Object.freeze({
        x: minimumSpan * 0.075,
        y: height * 0.12,
        z: Math.max(minimumSpan * 0.28, connectionOffset * 0.62),
      }),
      rotationY: outwardAngle,
      materialRole: 'metal',
      ...rootContext(),
    })),
    ...[-1, 1].map((side) => Object.freeze({
      id: `MACHINE-POD:${branchId}:PANEL-RAIL:${side > 0 ? 'RIGHT' : 'LEFT'}`,
      role: 'panel-rail',
      shape: 'CUBE',
      center: Object.freeze({
        x: center.x
          + tangent.x * (minimumSpan * 0.34 + mechanicalPresentation.shellPanelSeparation) * side
          + radial.x * mechanicalPresentation.shellPanelTravel,
        y: center.y + height * 0.17 + mechanicalPresentation.shellPanelLift,
        z: center.z
          + tangent.z * (minimumSpan * 0.34 + mechanicalPresentation.shellPanelSeparation) * side
          + radial.z * mechanicalPresentation.shellPanelTravel,
      }),
      dimensions: Object.freeze({
        x: minimumSpan * 0.10,
        y: height * 0.075,
        z: minimumSpan * 0.44,
      }),
      rotationY: outwardAngle + Math.PI / 2,
      materialRole: 'metal',
      ...rootContext(),
    })),
    ...[-1, 1].map((side) => Object.freeze({
      id: `MACHINE-POD:${branchId}:HINGE:${side > 0 ? 'RIGHT' : 'LEFT'}`,
      role: 'hinge-joint',
      shape: 'CYL',
      center: Object.freeze({
        x: center.x
          + tangent.x * (minimumSpan * 0.34 + mechanicalPresentation.shellPanelSeparation) * side
          + radial.x * mechanicalPresentation.shellPanelTravel,
        y: center.y + height * 0.10 + mechanicalPresentation.shellPanelLift,
        z: center.z
          + tangent.z * (minimumSpan * 0.34 + mechanicalPresentation.shellPanelSeparation) * side
          + radial.z * mechanicalPresentation.shellPanelTravel,
      }),
      dimensions: Object.freeze({
        x: height * 0.12,
        y: height * 0.12,
        z: height * 0.12,
      }),
      rotationY: outwardAngle,
      materialRole: 'metal2',
      ...rootContext(),
    })),
    ...Array.from({ length: 4 }, (_, index) => {
      const angle = outwardAngle + index * (TAU / 4);
      const ribRadius = chamberRadius * 0.98;
      return Object.freeze({
        id: `MACHINE-POD:${branchId}:CHAMBER-RIB:${index + 1}`,
        role: 'chamber-rib',
        shape: 'CUBE',
        center: Object.freeze({
          x: center.x + radial.x * mechanicalPresentation.chamberTravel
            + Math.cos(angle) * ribRadius,
          y: center.y + height * 0.34 + mechanicalPresentation.chamberLift,
          z: center.z + radial.z * mechanicalPresentation.chamberTravel
            + Math.sin(angle) * ribRadius,
        }),
        dimensions: Object.freeze({
          x: minimumSpan * 0.055,
          y: height * 0.19,
          z: minimumSpan * 0.14,
        }),
        rotationY: angle,
        materialRole: 'metal2',
        ...rootContext(),
      });
    }),
    Object.freeze({
      id: `MACHINE-POD:${branchId}:LOWER-PLINTH`,
      role: 'lower-plinth',
      shape: 'POD_SHELL_PANEL',
      center: Object.freeze({
        x: center.x + radial.x * mechanicalPresentation.shellPanelTravel,
        y: center.y + height * 0.03 + mechanicalPresentation.shellPanelLift * 0.55,
        z: center.z + radial.z * mechanicalPresentation.shellPanelTravel,
      }),
      dimensions: Object.freeze({
        x: width * 0.92,
        y: height * 0.14,
        z: depth * 0.72,
      }),
      rotationY: outwardAngle,
      materialRole: 'metal2',
      ...rootContext(),
    }),
    Object.freeze({
      id: `MACHINE-POD:${branchId}:UPPER-PAYLOAD-FRAME`,
      role: 'upper-payload-frame',
      shape: 'TORUS',
      center: Object.freeze({
        x: center.x + radial.x * mechanicalPresentation.payloadTravel,
        y: center.y + height * 0.55 + mechanicalPresentation.payloadLift * 0.75,
        z: center.z + radial.z * mechanicalPresentation.payloadTravel,
      }),
      dimensions: Object.freeze({
        x: minimumSpan * 0.68,
        y: height * 0.07,
        z: minimumSpan * 0.68,
      }),
      rotationY: 0,
      materialRole: 'metal',
      ...rootContext(),
    }),
    ...[-1, 1].map((side) => Object.freeze({
      id: `MACHINE-POD:${branchId}:SIDE-ACTUATOR:${side > 0 ? 'RIGHT' : 'LEFT'}`,
      role: 'side-actuator',
      shape: 'CYL',
      center: Object.freeze({
        x: center.x
          + tangent.x * (minimumSpan * 0.34 + mechanicalPresentation.shellPanelSeparation) * side
          + radial.x * mechanicalPresentation.shellPanelTravel,
        y: center.y + height * 0.30 + mechanicalPresentation.shellPanelLift,
        z: center.z
          + tangent.z * (minimumSpan * 0.34 + mechanicalPresentation.shellPanelSeparation) * side
          + radial.z * mechanicalPresentation.shellPanelTravel,
      }),
      dimensions: Object.freeze({
        x: height * 0.095,
        y: height * 0.26,
        z: height * 0.095,
      }),
      rotationY: outwardAngle,
      materialRole: 'metal2',
      ...rootContext(),
    })),
    ...[-1, 1].map((side) => Object.freeze({
      id: `MACHINE-POD:${branchId}:CHAMBER-LOCK:${side > 0 ? 'RIGHT' : 'LEFT'}`,
      role: 'chamber-lock',
      shape: 'CUBE',
      center: Object.freeze({
        x: center.x
          + radial.x * (mechanicalPresentation.chamberTravel + chamberRadius * 0.72)
          + tangent.x * minimumSpan * 0.18 * side,
        y: center.y + height * 0.36 + mechanicalPresentation.chamberLift,
        z: center.z
          + radial.z * (mechanicalPresentation.chamberTravel + chamberRadius * 0.72)
          + tangent.z * minimumSpan * 0.18 * side,
      }),
      dimensions: Object.freeze({
        x: minimumSpan * 0.10,
        y: height * 0.22,
        z: minimumSpan * 0.08,
      }),
      rotationY: outwardAngle,
      materialRole: 'metal2',
      ...rootContext(),
    })),
    Object.freeze({
      id: `MACHINE-POD:${branchId}:PAYLOAD-COLLAR`,
      role: 'payload-collar',
      shape: 'TORUS',
      center: Object.freeze({
        x: center.x + radial.x * mechanicalPresentation.payloadTravel,
        y: center.y + height * 0.72 + mechanicalPresentation.payloadLift,
        z: center.z + radial.z * mechanicalPresentation.payloadTravel,
      }),
      dimensions: Object.freeze({
        x: minimumSpan * 0.56,
        y: height * 0.055,
        z: minimumSpan * 0.56,
      }),
      rotationY: 0,
      materialRole: 'glass',
      ...rootContext(),
    }),
    ...Array.from({ length: 6 }, (_, index) => {
      const angle = index * (TAU / 6);
      const ribRadius = shellRadius * 0.80;
      return Object.freeze({
        id: `MACHINE-POD:${branchId}:SHELL-RIB:${index + 1}`,
        role: 'shell-rib',
        shape: 'POD_RIB',
        profile: 'pod-shell-rib',
        center: Object.freeze({
          x: center.x + Math.cos(angle) * ribRadius,
          y: center.y + height * 0.18,
          z: center.z + Math.sin(angle) * ribRadius,
        }),
        dimensions: Object.freeze({
          x: minimumSpan * 0.085,
          y: height * 0.46,
          z: minimumSpan * 0.14,
        }),
        rotationY: angle,
        materialRole: index % 2 === 0 ? 'metal2' : 'metal',
        outline: POD_SHELL_RIB_OUTLINE,
        ...rootContext(),
      });
    }),
    ...Array.from({ length: 4 }, (_, index) => {
      const angle = Math.PI / 4 + index * (TAU / 4);
      const bulkheadRadius = shellRadius * 0.62;
      return Object.freeze({
        id: `MACHINE-POD:${branchId}:SHELL-BULKHEAD:${index + 1}`,
        role: 'shell-bulkhead',
        shape: 'CUBE',
        profile: 'nested-shell-bulkhead',
        center: Object.freeze({
          x: center.x + Math.cos(angle) * bulkheadRadius,
          y: center.y + height * 0.18,
          z: center.z + Math.sin(angle) * bulkheadRadius,
        }),
        dimensions: Object.freeze({
          x: minimumSpan * 0.16,
          y: height * 0.38,
          z: minimumSpan * 0.10,
        }),
        rotationY: angle,
        materialRole: index % 2 === 0 ? 'metal2' : 'metal',
        ...rootContext(),
      });
    }),
    ...Array.from({ length: 4 }, (_, index) => {
      // Two braces mount to each split shell half, away from the panel seam.
      const angle = outwardAngle + Math.PI / 4 + index * (TAU / 4);
      const localAngle = angle - outwardAngle;
      const side = Math.sin(localAngle) >= 0 ? 1 : -1;
      const faceRadius = shellRadius * 0.42;
      const panelRotation = mechanicalPresentation.shellPanelRotation * side;
      const radialOnPanel = faceRadius * Math.cos(localAngle);
      const tangentOnPanel = faceRadius * Math.sin(localAngle);
      const attachedRadial = mechanicalPresentation.shellPanelTravel
        + radialOnPanel * Math.cos(panelRotation)
        - tangentOnPanel * Math.sin(panelRotation);
      const attachedTangent = side * mechanicalPresentation.shellPanelSeparation
        + radialOnPanel * Math.sin(panelRotation)
        + tangentOnPanel * Math.cos(panelRotation);
      return Object.freeze({
        id: `MACHINE-POD:${branchId}:SHELL-FACE-BRACE:${index + 1}`,
        role: 'shell-face-brace',
        shape: 'POD_SHELL_PANEL',
        profile: 'outer-shell-face-frame',
        center: Object.freeze({
          x: center.x
            + radial.x * attachedRadial
            + tangent.x * attachedTangent,
          y: center.y + height * 0.18 + mechanicalPresentation.shellPanelLift,
          z: center.z
            + radial.z * attachedRadial
            + tangent.z * attachedTangent,
        }),
        dimensions: Object.freeze({
          x: minimumSpan * 0.18,
          y: height * 0.24,
          z: minimumSpan * 0.08,
        }),
        rotationY: angle + panelRotation,
        materialRole: index % 2 === 0 ? 'metal2' : 'metal',
        outline: POD_SHELL_RIB_OUTLINE,
        ...rootContext(),
      });
    }),
  ]);

  const components = Object.freeze([
    component({
      id: `MACHINE-POD:${branchId}:OUTER-SHELL`,
      role: 'outer-shell',
      profile: 'authored-seat-pod-shell',
      center: { ...center, y: center.y + height * 0.06 },
      radius: shellRadius,
      height: shellHeight,
      dimensions: { x: width, y: shellHeight, z: depth },
      materialRole: 'seat-shell',
    }),
    component({
      id: `MACHINE-POD:${branchId}:STRUCTURAL-COLLAR`,
      role: 'structural-collar',
      profile: 'radial-collar',
      center: { ...center, y: center.y + height * 0.16 },
      radius: collarRadius,
      height: height * 0.10,
      dimensions: { x: collarRadius * 2, y: height * 0.10, z: collarRadius * 2 },
      materialRole: 'metal',
    }),
    component({
      id: `MACHINE-POD:${branchId}:INNER-CHAMBER`,
      role: 'inner-chamber',
      profile: 'oct-chamber',
      center: { ...center, y: center.y + height * 0.34 },
      radius: chamberRadius,
      height: height * (0.28 + 0.04 * expansion),
      dimensions: {
        x: chamberRadius * 2,
        y: height * (0.28 + 0.04 * expansion),
        z: chamberRadius * 2,
      },
      materialRole: 'metal2',
    }),
    component({
      id: `MACHINE-POD:${branchId}:ARTICULATION`,
      role: 'articulation-mechanism',
      profile: 'concentric-articulation',
      center: { ...center, y: center.y + height * (0.50 + 0.02 * expansion) },
      radius: articulationRadius,
      height: height * 0.055,
      dimensions: {
        x: articulationRadius * 2,
        y: height * 0.055,
        z: articulationRadius * 2,
      },
      materialRole: 'glass',
    }),
    component({
      id: `MACHINE-POD:${branchId}:PAYLOAD-SURFACE`,
      role: 'payload-surface',
      profile: 'semantic-payload-deck',
      center: { ...center, y: center.y + height * 0.70 },
      radius: Math.min(width, depth) * 0.26 * payloadScale,
      height: Math.max(0.025, height * 0.055),
      dimensions: {
        x: width * 0.48 * payloadScale,
        y: Math.max(0.025, height * 0.055),
        z: depth * 0.34 * payloadScale,
      },
      materialRole: 'seat-inset',
    }),
    component({
      id: `MACHINE-POD:${branchId}:CONNECTION-INTERFACE`,
      role: 'connection-interface',
      profile: 'connection-port',
      center: connectionPoint,
      radius: 0.10 + 0.025 * expansion,
      height: 0.08,
      dimensions: {
        x: (0.10 + 0.025 * expansion) * 2,
        y: 0.08,
        z: (0.10 + 0.025 * expansion) * 2,
      },
      materialRole: 'energy',
    }),
    component({
      id: `MACHINE-POD:${branchId}:STATUS-INDICATOR`,
      role: 'status-indicator',
      profile: 'status-band',
      center: { ...center, y: center.y + height * 0.79 },
      radius: Math.min(width, depth) * 0.18,
      height: Math.max(0.025, height * 0.035),
      dimensions: {
        x: Math.min(width, depth) * 0.36,
        y: Math.max(0.025, height * 0.035),
        z: Math.min(width, depth) * 0.36,
      },
      materialRole: 'trace',
    }),
  ]);

  const ports = Object.freeze([
    port({
      branchId,
      role: 'connection',
      point: connectionPoint,
      radius: 0.10 + 0.025 * expansion,
    }),
    port({
      branchId,
      role: 'signal',
      point: signalPoint,
      radius: 0.075 + 0.02 * expansion,
    }),
  ]);

  const divisionAttachmentZone = Object.freeze({
    id: `MACHINE-POD:${branchId}:DIVISION-ATTACHMENT-ZONE`,
    center: Object.freeze({
      x: center.x + Math.cos(outwardAngle) * chamberRadius * 0.55,
      y: center.y + height * 0.58,
      z: center.z + Math.sin(outwardAngle) * chamberRadius * 0.55,
    }),
    radius: Math.max(0.22, Math.min(width, depth) * 0.36 * (1 + 0.05 * expansion)),
    divisionCount: POD_DIVISION_COUNT,
    fanSpan: POD_DIVISION_FAN_SPAN,
    ...rootContext(`MACHINE-POD:${branchId}:DIVISION-ATTACHMENT-ZONE`),
  });

  const payloadComponent = components.find(({ role }) => role === 'payload-surface');
  const payloadSurface = Object.freeze({
    componentId: payloadComponent.id,
    semanticRole: 'payload-surface',
    density,
    dimensions: payloadComponent.dimensions,
    center: payloadComponent.center,
    ...rootContext(),
  });

  const localInterfaces = Object.freeze({
    connection: ports[0],
    signal: ports[1],
  });

  const articulation = Object.freeze({
    mechanismId: `MACHINE-POD:${branchId}:ARTICULATION`,
    phase: articulationPhase,
    amount: expansion,
    axis: 'Y',
    presentationOnly: true,
  });

  const statusPresentation = Object.freeze({
    indicatorId: `MACHINE-POD:${branchId}:STATUS-INDICATOR`,
    stateChannel: 'machine-pod-status',
    presentationOnly: true,
  });

  const connectionComponent = components.find(({ role }) => role === 'connection-interface');
  const connectionRadialExtent = Math.hypot(
    connectionPoint.x - center.x,
    connectionPoint.z - center.z,
  ) + Number(connectionComponent?.radius || 0);
  const mechanicalDetailRadialExtent = mechanicalDetails.reduce((maxExtent, item) => {
    const centerReach = Math.hypot(
      Number(item.center.x) - center.x,
      Number(item.center.z) - center.z,
    );
    const halfDiagonal = Math.hypot(
      Number(item.dimensions?.x || 0) * 0.5,
      Number(item.dimensions?.z || 0) * 0.5,
    );
    return Math.max(maxExtent, centerReach + halfDiagonal);
  }, 0);
  const maxHorizontalExtent = Math.max(
    width,
    depth,
    collarRadius * 2,
    articulationRadius * 2,
    connectionRadialExtent * 2,
    mechanicalDetailRadialExtent * 2,
  );
  const neighborClearance = adjacentCenterSpacing == null
    ? null
    : Number(adjacentCenterSpacing) - maxHorizontalExtent;

  const mechanicalSubjectParts = [];
  for (const item of components) {
    const horizontalHalfExtent = Math.hypot(
      Number(item.dimensions?.x || item.radius * 2) * 0.5,
      Number(item.dimensions?.z || item.radius * 2) * 0.5,
    );
    const base = {
      id: item.id,
      center: item.center,
      dimensions: {
        x: horizontalHalfExtent * 2,
        y: Number(item.dimensions?.y || item.height),
        z: horizontalHalfExtent * 2,
      },
    };
    if (item.role === 'outer-shell' && expansion > 0.02) {
      for (const side of [-1, 1]) {
        mechanicalSubjectParts.push({
          ...base,
          id: item.id + ':PANEL:' + side,
          center: {
            x: item.center.x
              + tangent.x * mechanicalPresentation.shellPanelSeparation * side
              + radial.x * mechanicalPresentation.shellPanelTravel,
            y: item.center.y + mechanicalPresentation.shellPanelLift,
            z: item.center.z
              + tangent.z * mechanicalPresentation.shellPanelSeparation * side
              + radial.z * mechanicalPresentation.shellPanelTravel,
          },
          dimensions: {
            x: horizontalHalfExtent * 1.08,
            y: Number(item.dimensions?.y || item.height),
            z: horizontalHalfExtent * 1.08,
          },
        });
      }
      continue;
    }
    const roleTravel = item.role === 'structural-collar'
      ? mechanicalPresentation.collarTravel
      : item.role === 'inner-chamber'
        ? mechanicalPresentation.chamberTravel
        : item.role === 'articulation-mechanism'
          ? mechanicalPresentation.articulationTravel
          : item.role === 'payload-surface'
            ? mechanicalPresentation.payloadTravel
            : 0;
    const roleLift = item.role === 'structural-collar'
      ? mechanicalPresentation.collarLift
      : item.role === 'inner-chamber'
        ? mechanicalPresentation.chamberLift
        : item.role === 'payload-surface'
          ? mechanicalPresentation.payloadLift
          : 0;
    mechanicalSubjectParts.push({
      ...base,
      center: {
        x: item.center.x + radial.x * roleTravel,
        y: item.center.y + roleLift,
        z: item.center.z + radial.z * roleTravel,
      },
    });
  }
  const subjectParts = [
    ...mechanicalSubjectParts,
    ...mechanicalDetails.map((item) => ({
      id: item.id,
      center: item.center,
      dimensions: item.dimensions,
    })),
    ...ports.map((item) => ({
      id: `${item.id}:SUBJECT`,
      center: item.point,
      dimensions: { x: item.radius * 2, y: item.radius * 2, z: item.radius * 2 },
    })),
  ];

  const subject = deriveMachineSubject(subjectParts, 0.06);
  const horizontalRadius = Math.max(
    Math.abs(subject.max.x - center.x),
    Math.abs(center.x - subject.min.x),
    Math.abs(subject.max.z - center.z),
    Math.abs(center.z - subject.min.z),
  );

  return Object.freeze({
    id: MACHINE_POD_ASSEMBLY_ID,
    version: MACHINE_POD_ASSEMBLY_VERSION,
    ...rootContext(`MACHINE-POD:${branchId}:ASSEMBLY`),
    branchId,
    seatIndex: Number.isInteger(Number(part.seatIndex)) ? Number(part.seatIndex) : null,
    center,
    components,
    mechanicalDetails,
    ports,
    divisionAttachmentZone,
    payloadSurface,
    localInterfaces,
    articulation,
    statusPresentation,
    mechanicalPresentation,
    envelope: Object.freeze({
      radius: Math.max(maxHorizontalExtent * 0.5, horizontalRadius),
      height: shellHeight,
      adjacentCenterSpacing: adjacentCenterSpacing == null ? null : Number(adjacentCenterSpacing),
      neighborClearance,
      requestedClearance: clearance,
    }),
    subject,
    presentationOnly: true,
  });
}

export function validateMachinePodAssembly(assembly) {
  const reasons = [];
  const root = validateSpatialConstructionNode(assembly || {});
  if (!root.valid) reasons.push(...root.reasons);

  if (!assembly || assembly.id !== MACHINE_POD_ASSEMBLY_ID) reasons.push('INVALID_POD_ASSEMBLY_ID');
  if (assembly?.constructionSlice !== 'S3') reasons.push('POD_ASSEMBLY_NOT_ROOTED_AT_S3');
  if (assembly?.constructionOwner !== ROOT_OWNER) reasons.push('POD_ASSEMBLY_OWNER_MISMATCH');
  if (!String(assembly?.branchId || '').startsWith('BRANCH-SEAT-')) reasons.push('INVALID_POD_BRANCH_ID');
  if (assembly?.components?.length !== POD_COMPONENT_ROLES.length) reasons.push('POD_COMPONENT_COUNT_MISMATCH');
  if (assembly?.ports?.length !== POD_PORT_ROLES.length) reasons.push('POD_PORT_COUNT_MISMATCH');

  const roles = new Set((assembly?.components || []).map((item) => item?.role));
  for (const role of POD_COMPONENT_ROLES) {
    if (!roles.has(role)) reasons.push(`MISSING_POD_COMPONENT:${role}`);
  }
  const portRoles = new Set((assembly?.ports || []).map((item) => item?.role));
  for (const role of POD_PORT_ROLES) {
    if (!portRoles.has(role)) reasons.push(`MISSING_POD_PORT:${role}`);
  }

  for (const item of assembly?.components || []) {
    const validation = validateSpatialConstructionNode(item);
    if (!validation.valid) reasons.push(...validation.reasons.map((reason) => `${item?.id || 'unknown'}:${reason}`));
    if (item?.constructionSlice !== 'S3') reasons.push(`${item?.id || 'unknown'}:COMPONENT_NOT_S3`);
    if (item?.constructionOwner !== ROOT_OWNER) reasons.push(`${item?.id || 'unknown'}:COMPONENT_OWNER_MISMATCH`);
  }

  for (const item of assembly?.ports || []) {
    const validation = validateSpatialConstructionNode(item);
    if (!validation.valid) reasons.push(...validation.reasons.map((reason) => `${item?.id || 'unknown'}:${reason}`));
    if (item?.constructionSlice !== 'S3') reasons.push(`${item?.id || 'unknown'}:PORT_NOT_S3`);
    if (item?.constructionOwner !== ROOT_OWNER) reasons.push(`${item?.id || 'unknown'}:PORT_OWNER_MISMATCH`);
  }

  if (assembly?.divisionAttachmentZone?.divisionCount !== POD_DIVISION_COUNT) {
    reasons.push('POD_DIVISION_ATTACHMENT_COUNT_MISMATCH');
  }
  if (assembly?.envelope?.neighborClearance != null
      && assembly.envelope.neighborClearance < assembly.envelope.requestedClearance) {
    reasons.push('POD_NEIGHBOR_CLEARANCE_UNPROVEN');
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    constructionSlice: 'S3',
    branchId: assembly?.branchId || null,
    neighborClearance: assembly?.envelope?.neighborClearance ?? null,
  });
}
