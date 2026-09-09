#!/usr/bin/env node
/**
 * Idempotent P4.1 SEAT_CAPABILITIES visual flex patch for public/hero-flex.js
 * Presentation only · CAPABILITY ≠ AUTHORIZATION · no entitlement · no 029-released claim
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'public/hero-flex.js');
if (!fs.existsSync(target)) {
  console.error('missing public/hero-flex.js');
  process.exit(1);
}
let t = fs.readFileSync(target, 'utf8');
if (t.includes('tickCapabilitiesBranch') && t.includes('getCapabilitiesBranchAmount') && t.includes("key==='k'")) {
  console.log('P4.1 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 1000) {
  console.error('hero-flex is placeholder or truncated; restore from main first');
  process.exit(1);
}

if (!t.includes('tickCapabilitiesBranch')) {
  const importNeedle = `  tickToolkitBranch,
  getToolkitBranchAmount,
  toolkitFaceAccessibleName,
  requestToolkitConfigureHandoff,
  TOOLKIT_BRANCH_MS,`;
  const importInsert = `  tickToolkitBranch,
  getToolkitBranchAmount,
  toolkitFaceAccessibleName,
  requestToolkitConfigureHandoff,
  TOOLKIT_BRANCH_MS,
  tickCapabilitiesBranch,
  getCapabilitiesBranchAmount,
  capabilitiesFaceAccessibleName,
  requestCapabilitiesConfigureHandoff,
  CAPABILITIES_BRANCH_MS,`;
  if (!t.includes(importNeedle)) {
    console.error('import block not found');
    process.exit(1);
  }
  t = t.replace(importNeedle, importInsert);
}

if (!t.includes('tickCapabilitiesBranch(hierarchyRuntime')) {
  t = t.replace(
    'tickToolkitBranch(hierarchyRuntime,now,reducedMotion);',
    'tickToolkitBranch(hierarchyRuntime,now,reducedMotion);tickCapabilitiesBranch(hierarchyRuntime,now,reducedMotion);',
  );
}

if (!t.includes('isCapabilities')) {
  t = t.replace(
    '    const isToolkit = childId === HIERARCHY_PART.SEAT_TOOLKIT;',
    '    const isToolkit = childId === HIERARCHY_PART.SEAT_TOOLKIT;\n    const isCapabilities = childId === HIERARCHY_PART.SEAT_CAPABILITIES;',
  );
  t = t.replace(
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : (isToolkit ? getToolkitBranchAmount(hierarchyRuntime) : 0));',
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : (isToolkit ? getToolkitBranchAmount(hierarchyRuntime) : (isCapabilities ? getCapabilitiesBranchAmount(hierarchyRuntime) : 0)));',
  );
  t = t.replace(
    '    const emit = focused || isConnection || isBehavior || isToolkit ? 0.14 * amt * (1 + 0.55 * branch) : 0.03 * amt;',
    '    const emit = focused || isConnection || isBehavior || isToolkit || isCapabilities ? 0.14 * amt * (1 + 0.55 * branch) : 0.03 * amt;',
  );
  t = t.replace(
    '    const sx = 0.55 * s * (isConnection || isBehavior || isToolkit ? branchBoost : 1);',
    '    const sx = 0.55 * s * (isConnection || isBehavior || isToolkit || isCapabilities ? branchBoost : 1);',
  );
  t = t.replace(
    '    const sy = 0.08 * s * (isConnection || isBehavior || isToolkit ? (1 + 0.35 * branch) : 1);',
    '    const sy = 0.08 * s * (isConnection || isBehavior || isToolkit || isCapabilities ? (1 + 0.35 * branch) : 1);',
  );
  t = t.replace(
    '    const sz = 0.38 * s * (isConnection || isBehavior || isToolkit ? branchBoost : 1);',
    '    const sz = 0.38 * s * (isConnection || isBehavior || isToolkit || isCapabilities ? branchBoost : 1);',
  );
}

if (!t.includes('capabilitiesFaceAccessibleName(getCapabilitiesBranchAmount')) {
  t = t.replace(
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){seatText=toolkitFaceAccessibleName(getToolkitBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId)",
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){seatText=toolkitFaceAccessibleName(getToolkitBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CAPABILITIES){seatText=capabilitiesFaceAccessibleName(getCapabilitiesBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId)",
  );
}

if (!t.includes("key==='k'") && !t.includes("key==='K'")) {
  t = t.replace(
    "if((event.key==='t'||event.key==='T')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){requestToolkitConfigureHandoff({targetSection:'toolkit'});event.preventDefault()}updateLabels()});",
    "if((event.key==='t'||event.key==='T')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){requestToolkitConfigureHandoff({targetSection:'toolkit'});event.preventDefault()}if((event.key==='k'||event.key==='K')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CAPABILITIES){requestCapabilitiesConfigureHandoff({targetSection:'capabilities'});event.preventDefault()}updateLabels()});",
  );
}

if (!t.includes('getCapabilitiesBranchAmount:()=>')) {
  t = t.replace(
    "getToolkitBranchAmount:()=>getToolkitBranchAmount(hierarchyRuntime),requestToolkitConfigure:()=>requestToolkitConfigureHandoff({targetSection:'toolkit'}),TOOLKIT_BRANCH_MS,toolkitFaceAccessibleName};",
    "getToolkitBranchAmount:()=>getToolkitBranchAmount(hierarchyRuntime),requestToolkitConfigure:()=>requestToolkitConfigureHandoff({targetSection:'toolkit'}),TOOLKIT_BRANCH_MS,toolkitFaceAccessibleName,getCapabilitiesBranchAmount:()=>getCapabilitiesBranchAmount(hierarchyRuntime),requestCapabilitiesConfigure:()=>requestCapabilitiesConfigureHandoff({targetSection:'capabilities'}),CAPABILITIES_BRANCH_MS,capabilitiesFaceAccessibleName};",
  );
}

fs.writeFileSync(target, t);
console.log('P4.1 applied to public/hero-flex.js');
