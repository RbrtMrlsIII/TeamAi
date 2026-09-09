#!/usr/bin/env node
/**
 * Idempotent P5.1 SEAT_AUTHORIZATION visual flex patch for public/hero-flex.js
 * Presentation only · AUTHORIZATION ≠ CAPABILITY · no entitlement · no 029-released claim
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'public/hero-flex.js');
if (!fs.existsSync(target)) {
  console.error('missing public/hero-flex.js');
  process.exit(1);
}
let t = fs.readFileSync(target, 'utf8');
if (t.includes('tickAuthorizationBranch') && t.includes('getAuthorizationBranchAmount') && t.includes("key==='a'")) {
  console.log('P5.1 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 1000) {
  console.error('hero-flex is placeholder or truncated; restore from main first');
  process.exit(1);
}

if (!t.includes('tickAuthorizationBranch')) {
  const importNeedle = `  tickCapabilitiesBranch,
  getCapabilitiesBranchAmount,
  capabilitiesFaceAccessibleName,
  requestCapabilitiesConfigureHandoff,
  CAPABILITIES_BRANCH_MS,`;
  const importInsert = `  tickCapabilitiesBranch,
  getCapabilitiesBranchAmount,
  capabilitiesFaceAccessibleName,
  requestCapabilitiesConfigureHandoff,
  CAPABILITIES_BRANCH_MS,
  tickAuthorizationBranch,
  getAuthorizationBranchAmount,
  authorizationFaceAccessibleName,
  requestAuthorizationConfigureHandoff,
  AUTHORIZATION_BRANCH_MS,`;
  if (!t.includes(importNeedle)) {
    console.error('import block not found');
    process.exit(1);
  }
  t = t.replace(importNeedle, importInsert);
}

if (!t.includes('tickAuthorizationBranch(hierarchyRuntime')) {
  t = t.replace(
    'tickCapabilitiesBranch(hierarchyRuntime,now,reducedMotion);',
    'tickCapabilitiesBranch(hierarchyRuntime,now,reducedMotion);tickAuthorizationBranch(hierarchyRuntime,now,reducedMotion);',
  );
}

if (!t.includes('isAuthorization')) {
  t = t.replace(
    '    const isCapabilities = childId === HIERARCHY_PART.SEAT_CAPABILITIES;',
    '    const isCapabilities = childId === HIERARCHY_PART.SEAT_CAPABILITIES;\n    const isAuthorization = childId === HIERARCHY_PART.SEAT_AUTHORIZATION;',
  );
  t = t.replace(
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : (isToolkit ? getToolkitBranchAmount(hierarchyRuntime) : (isCapabilities ? getCapabilitiesBranchAmount(hierarchyRuntime) : 0)));',
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : (isToolkit ? getToolkitBranchAmount(hierarchyRuntime) : (isCapabilities ? getCapabilitiesBranchAmount(hierarchyRuntime) : (isAuthorization ? getAuthorizationBranchAmount(hierarchyRuntime) : 0))));',
  );
  t = t.replace(
    '    const emit = focused || isConnection || isBehavior || isToolkit || isCapabilities ? 0.14 * amt * (1 + 0.55 * branch) : 0.03 * amt;',
    '    const emit = focused || isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization ? 0.14 * amt * (1 + 0.55 * branch) : 0.03 * amt;',
  );
  t = t.replace(
    '    const sx = 0.55 * s * (isConnection || isBehavior || isToolkit || isCapabilities ? branchBoost : 1);',
    '    const sx = 0.55 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization ? branchBoost : 1);',
  );
  t = t.replace(
    '    const sy = 0.08 * s * (isConnection || isBehavior || isToolkit || isCapabilities ? (1 + 0.35 * branch) : 1);',
    '    const sy = 0.08 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization ? (1 + 0.35 * branch) : 1);',
  );
  t = t.replace(
    '    const sz = 0.38 * s * (isConnection || isBehavior || isToolkit || isCapabilities ? branchBoost : 1);',
    '    const sz = 0.38 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization ? branchBoost : 1);',
  );
}

if (!t.includes('authorizationFaceAccessibleName(getAuthorizationBranchAmount')) {
  t = t.replace(
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CAPABILITIES){seatText=capabilitiesFaceAccessibleName(getCapabilitiesBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId)",
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CAPABILITIES){seatText=capabilitiesFaceAccessibleName(getCapabilitiesBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_AUTHORIZATION){seatText=authorizationFaceAccessibleName(getAuthorizationBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId)",
  );
}

if (!t.includes("key==='a'") && !t.includes("key==='A'")) {
  t = t.replace(
    "if((event.key==='k'||event.key==='K')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CAPABILITIES){requestCapabilitiesConfigureHandoff({targetSection:'capabilities'});event.preventDefault()}updateLabels()});",
    "if((event.key==='k'||event.key==='K')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CAPABILITIES){requestCapabilitiesConfigureHandoff({targetSection:'capabilities'});event.preventDefault()}if((event.key==='a'||event.key==='A')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_AUTHORIZATION){requestAuthorizationConfigureHandoff({targetSection:'authorization'});event.preventDefault()}updateLabels()});",
  );
}

if (!t.includes('getAuthorizationBranchAmount:()=>')) {
  t = t.replace(
    "getCapabilitiesBranchAmount:()=>getCapabilitiesBranchAmount(hierarchyRuntime),requestCapabilitiesConfigure:()=>requestCapabilitiesConfigureHandoff({targetSection:'capabilities'}),CAPABILITIES_BRANCH_MS,capabilitiesFaceAccessibleName};",
    "getCapabilitiesBranchAmount:()=>getCapabilitiesBranchAmount(hierarchyRuntime),requestCapabilitiesConfigure:()=>requestCapabilitiesConfigureHandoff({targetSection:'capabilities'}),CAPABILITIES_BRANCH_MS,capabilitiesFaceAccessibleName,getAuthorizationBranchAmount:()=>getAuthorizationBranchAmount(hierarchyRuntime),requestAuthorizationConfigure:()=>requestAuthorizationConfigureHandoff({targetSection:'authorization'}),AUTHORIZATION_BRANCH_MS,authorizationFaceAccessibleName};",
  );
}

fs.writeFileSync(target, t);
console.log('P5.1 applied to public/hero-flex.js');
