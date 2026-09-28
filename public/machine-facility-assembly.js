/**
 * TEAM-EXPERIENCE-029 / S6
 * Product-facility spatial destination assembly.
 *
 * This module is a presentation-only projection of existing product
 * facilities. It does not become a second feature registry and it never
 * moves a facility under the Seat/Pod semantic hierarchy.
 */
import {
  createSpatialConstructionContext,
  requiredStructuralRootsForSlice,
  validateSpatialConstructionNode,
} from './machine-spatial-root-contract.js';
import { deriveMachineSubject } from './machine-subject.js';
import { WORKSPACE_HQ_FEATURE_ID } from './workspace-capability.js';
import { STORAGE_FEATURE_ID } from './storage-inventory.js';
import { TEAM_AGENTS_FEATURE_ID } from './team-agents.js';
import { MARKETPLACE_FEATURE_ID } from './marketplace-commerce.js';

export const MACHINE_FACILITY_ASSEMBLY_ID = 'MACHINE-FACILITY-ASSEMBLY';
export const MACHINE_FACILITY_ASSEMBLY_VERSION = 'S6-V1';

const ROOT_OWNER = 'frontend/spatial/machine-facility-assembly.js';
const OUTER_DESTINATIONS = Object.freeze([
  Object.freeze({
    branchId: 'BRANCH-OUTER-ALPHA',
    machineRole: 'analysis',
    facilities: Object.freeze([
      Object.freeze({ id: WORKSPACE_HQ_FEATURE_ID, label: 'Workspace HQ', sourceModule: 'workspace-capability-facility.js' }),
      Object.freeze({ id: 'projects-library', label: 'Projects Library', sourceModule: 'projects-library' }),
      Object.freeze({ id: 'artifacts-inventory', label: 'Artifacts / Inventory', sourceModule: 'artifacts.js' }),
    ]),
  }),
  Object.freeze({
    branchId: 'BRANCH-OUTER-BETA',
    machineRole: 'operations',
    facilities: Object.freeze([
      Object.freeze({ id: STORAGE_FEATURE_ID, label: 'Storage', sourceModule: 'storage-inventory-facility.js' }),
      Object.freeze({ id: TEAM_AGENTS_FEATURE_ID, label: 'Team / Agents', sourceModule: 'team-agents-facility.js' }),
      Object.freeze({ id: 'skills-responsibility', label: 'Skills / Responsibility', sourceModule: 'skills-responsibility' }),
    ]),
  }),
  Object.freeze({
    branchId: 'BRANCH-OUTER-GAMMA',
    machineRole: 'control',
    facilities: Object.freeze([
      Object.freeze({ id: 'mcp-capability', label: 'MCP / Capability', sourceModule: 'mcp-capability-facility.js' }),
      Object.freeze({ id: 'orchestration-scheduler', label: 'Orchestration / Scheduler', sourceModule: 'orchestration-scheduler' }),
      Object.freeze({ id: 'settings-control', label: 'Settings / Control', sourceModule: 'settings.js' }),
    ]),
  }),
  Object.freeze({
    branchId: 'BRANCH-OUTER-DELTA',
    machineRole: 'access-commerce',
    facilities: Object.freeze([
      Object.freeze({ id: MARKETPLACE_FEATURE_ID, label: 'Marketplace / Commerce / Entitlement', sourceModule: 'marketplace-commerce-facility.js' }),
      Object.freeze({ id: 'authentication-gateway', label: 'Authentication Gateway', sourceModule: 'auth-gateway' }),
    ]),
  }),
]);

export const MACHINE_PRODUCT_FACILITY_IDS = Object.freeze(
  OUTER_DESTINATIONS.flatMap(({ facilities }) => facilities.map(({ id }) => id)),
);

function rootContext(semanticId) {
  return createSpatialConstructionContext({
    slice: 'S6',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function finite(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function facilityComponents(part, destination) {
  const center = part.center;
  const count = destination.facilities.length;
  const angle = Math.atan2(center.z, center.x);
  const radial = Math.max(0.46, Math.hypot(center.x, center.z));
  const tangent = { x: -Math.sin(angle), z: Math.cos(angle) };
  const outward = { x: Math.cos(angle), z: Math.sin(angle) };
  const spread = count === 1 ? 0 : 0.82;

  return destination.facilities.map((facility, index) => {
    const lane = index - (count - 1) * 0.5;
    const offset = lane * spread;
    const x = center.x + tangent.x * offset + outward.x * 0.18;
    const z = center.z + tangent.z * offset + outward.z * 0.18;
    const dimensions = {
      x: count === 2 ? 0.56 : 0.48,
      y: 0.18,
      z: count === 2 ? 0.46 : 0.42,
    };
    return Object.freeze({
      id: 'FACILITY-DOCK:' + destination.branchId + ':' + facility.id,
      role: 'facility-dock',
      facilityId: facility.id,
      label: facility.label,
      sourceModule: facility.sourceModule,
      shape: index % 3 === 0 ? 'TORUS' : index % 3 === 1 ? 'CUBE' : 'CYL',
      center: Object.freeze({ x, y: finite(center.y) + 0.34 + index * 0.06, z }),
      dimensions: Object.freeze(dimensions),
      materialRole: index % 2 === 0 ? 'glass' : 'energy',
      ...rootContext(facility.id),
    });
  });
}

export function deriveMachineFacilityAssemblies({ outerHousings = [] } = {}) {
  const byBranch = new Map((Array.isArray(outerHousings) ? outerHousings : []).map((part) => [part.branchId, part]));
  const assemblies = OUTER_DESTINATIONS.map((destination) => {
    const part = byBranch.get(destination.branchId);
    if (!part) return null;

    const components = facilityComponents(part, destination);
    const ports = destination.facilities.map((facility, index) => Object.freeze({
      id: 'FACILITY-PORT:' + destination.branchId + ':' + facility.id,
      facilityId: facility.id,
      role: 'facility-port',
      point: Object.freeze({
        x: components[index].center.x,
        y: components[index].center.y - 0.18,
        z: components[index].center.z,
      }),
      radius: 0.08,
      ...rootContext(facility.id + ':PORT'),
    }));

    const subjectParts = components.map((component) => ({
      id: component.id,
      center: component.center,
      dimensions: component.dimensions,
    }));
    const subject = deriveMachineSubject(subjectParts, 0.10);

    return Object.freeze({
      id: MACHINE_FACILITY_ASSEMBLY_ID + ':' + destination.branchId,
      version: MACHINE_FACILITY_ASSEMBLY_VERSION,
      ...rootContext(destination.branchId),
      branchId: destination.branchId,
      machineRole: destination.machineRole,
      outerHousing: Object.freeze({
        branchId: destination.branchId,
        center: Object.freeze({ ...part.center }),
        dimensions: Object.freeze({ ...part.dimensions }),
      }),
      facilities: destination.facilities,
      components,
      ports: Object.freeze(ports),
      subject,
      envelope: Object.freeze({
        radius: Math.max(...components.map((component) =>
          Math.hypot(
            component.center.x - part.center.x,
            component.center.z - part.center.z,
          ) + Math.max(component.dimensions.x, component.dimensions.z) * 0.5,
        )),
        height: Math.max(...components.map((component) =>
          Math.abs(component.center.y - part.center.y) + component.dimensions.y * 0.5,
        )) * 2,
        clearance: Math.max(0.12, finite(part.seam, 0.22)),
      }),
      seatHierarchyParent: null,
      presentationOnly: true,
    });
  }).filter(Boolean);

  return Object.freeze(assemblies);
}

export function validateMachineFacilityAssemblies(assemblies = [], { expectedOuterCount = 4 } = {}) {
  const reasons = [];
  const list = Array.isArray(assemblies) ? assemblies : [];
  if (list.length !== expectedOuterCount) reasons.push('FACILITY_OUTER_DESTINATION_COUNT_MISMATCH');

  const branchIds = new Set();
  const facilityIds = new Set();
  for (const assembly of list) {
    const root = validateSpatialConstructionNode(assembly || {});
    if (!root.valid) reasons.push(...root.reasons);
    if (assembly?.constructionSlice !== 'S6') reasons.push(assembly?.id + ':NOT_S6');
    if (assembly?.constructionOwner !== ROOT_OWNER) reasons.push(assembly?.id + ':OWNER_MISMATCH');
    if (!assembly?.outerHousing?.branchId) reasons.push(assembly?.id + ':OUTER_DESTINATION_MISSING');
    if (assembly?.seatHierarchyParent !== null) reasons.push(assembly?.id + ':FACILITY_FORCED_UNDER_SEAT');
    if (!assembly?.subject) reasons.push(assembly?.id + ':SUBJECT_MISSING');
    if (!Array.isArray(assembly?.ports) || assembly.ports.length !== assembly.facilities.length) {
      reasons.push(assembly?.id + ':PORT_COUNT_MISMATCH');
    }

    branchIds.add(assembly?.branchId);
    for (const facility of assembly?.facilities || []) {
      if (facilityIds.has(facility.id)) reasons.push('DUPLICATE_FACILITY_ID:' + facility.id);
      facilityIds.add(facility.id);
    }

    for (const component of assembly?.components || []) {
      const node = validateSpatialConstructionNode(component);
      if (!node.valid) reasons.push(...node.reasons);
      if (component?.facilityId == null) reasons.push('FACILITY_COMPONENT_ID_MISSING');
      if (component?.constructionSlice !== 'S6') reasons.push(component?.id + ':NOT_S6');
    }
  }

  if (branchIds.size !== expectedOuterCount) reasons.push('OUTER_DESTINATION_BRANCH_DUPLICATE');
  const expected = new Set(MACHINE_PRODUCT_FACILITY_IDS);
  if (facilityIds.size !== expected.size) reasons.push('PRODUCT_FACILITY_COUNT_MISMATCH');
  for (const id of expected) if (!facilityIds.has(id)) reasons.push('MISSING_PRODUCT_FACILITY:' + id);
  for (const id of facilityIds) if (!expected.has(id)) reasons.push('UNKNOWN_PRODUCT_FACILITY:' + id);

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    outerCount: list.length,
    productFacilityCount: facilityIds.size,
    inheritedStructuralRoots: requiredStructuralRootsForSlice('S6'),
  });
}
