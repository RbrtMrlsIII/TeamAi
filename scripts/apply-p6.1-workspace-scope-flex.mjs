#!/usr/bin/env node
/**
 * Idempotent P6.1 SEAT_WORKSPACE_SCOPE visual flex patch for public/hero-flex.js
 * Presentation only · WORKSPACE ≠ durable store · no entitlement · no 029-released claim
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'public/hero-flex.js');
if (!fs.existsSync(target)) {
  console.error('missing public/hero-flex.js');
  process.exit(1);
}
let t = fs.readFileSync(target, 'utf8');
if (t.includes('tickWorkspaceScopeBranch') && t.includes('getWorkspaceScopeBranchAmount') && t.includes("key==='w'")) {
  console.log('P6.1 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 1000) {
  console.error('hero-flex is placeholder or truncated; restore from main first');
  process.exit(1);
}

if (!t.includes('tickWorkspaceScopeBranch')) {
  const importNeedle = `  tickAuthorizationBranch,
  getAuthorizationBranchAmount,
  authorizationFaceAccessibleName,
  requestAuthorizationConfigureHandoff,
  AUTHORIZATION_BRANCH_MS,`;
  const importInsert = `  tickAuthorizationBranch,
  getAuthorizationBranchAmount,
  authorizationFaceAccessibleName,
  requestAuthorizationConfigureHandoff,
  AUTHORIZATION_BRANCH_MS,
  tickWorkspaceScopeBranch,
  getWorkspaceScopeBranchAmount,
  workspaceScopeFaceAccessibleName,
  requestWorkspaceScopeConfigureHandoff,
  WORKSPACE_SCOPE_BRANCH_MS,`;
  if (!t.includes(importNeedle)) {
    console.error('import block not found');
    process.exit(1);
  }
  t = t.replace(importNeedle, importInsert);
}

if (!t.includes('tickWorkspaceScopeBranch(hierarchyRuntime')) {
  t = t.replace(
    'tickAuthorizationBranch(hierarchyRuntime,now,reducedMotion);',
    'tickAuthorizationBranch(hierarchyRuntime,now,reducedMotion);tickWorkspaceScopeBranch(hierarchyRuntime,now,reducedMotion);',
  );
}

if (!t.includes('isWorkspaceScope')) {
  t = t.replace(
    '    const isAuthorization = childId === HIERARCHY_PART.SEAT_AUTHORIZATION;',
    '    const isAuthorization = childId === HIERARCHY_PART.SEAT_AUTHORIZATION;\n    const isWorkspaceScope = childId === HIERARCHY_PART.SEAT_WORKSPACE_SCOPE;',
  );
  t = t.replace(
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : (isToolkit ? getToolkitBranchAmount(hierarchyRuntime) : (isCapabilities ? getCapabilitiesBranchAmount(hierarchyRuntime) : (isAuthorization ? getAuthorizationBranchAmount(hierarchyRuntime) : 0))));',
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : (isToolkit ? getToolkitBranchAmount(hierarchyRuntime) : (isCapabilities ? getCapabilitiesBranchAmount(hierarchyRuntime) : (isAuthorization ? getAuthorizationBranchAmount(hierarchyRuntime) : (isWorkspaceScope ? getWorkspaceScopeBranchAmount(hierarchyRuntime) : 0)))));',
  );
  t = t.replace(
    '    const emit = focused || isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization ? 0.14 * amt * (1 + 0.55 * branch) : 0.03 * amt;',
    '    const emit = focused || isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope ? 0.14 * amt * (1 + 0.55 * branch) : 0.03 * amt;',
  );
  t = t.replace(
    '    const sx = 0.55 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization ? branchBoost : 1);',
    '    const sx = 0.55 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope ? branchBoost : 1);',
  );
  t = t.replace(
    '    const sy = 0.08 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization ? (1 + 0.35 * branch) : 1);',
    '    const sy = 0.08 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope ? (1 + 0.35 * branch) : 1);',
  );
  t = t.replace(
    '    const sz = 0.38 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization ? branchBoost : 1);',
    '    const sz = 0.38 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope ? branchBoost : 1);',
  );
}

if (!t.includes('workspaceScopeFaceAccessibleName(getWorkspaceScopeBranchAmount')) {
  t = t.replace(
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_AUTHORIZATION){seatText=authorizationFaceAccessibleName(getAuthorizationBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId)",
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_AUTHORIZATION){seatText=authorizationFaceAccessibleName(getAuthorizationBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_WORKSPACE_SCOPE){seatText=workspaceScopeFaceAccessibleName(getWorkspaceScopeBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId)",
  );
}

if (!t.includes("key==='w'") && !t.includes("key==='W'")) {
  t = t.replace(
    "if((event.key==='a'||event.key==='A')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_AUTHORIZATION){requestAuthorizationConfigureHandoff({targetSection:'authorization'});event.preventDefault()}updateLabels()});",
    "if((event.key==='a'||event.key==='A')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_AUTHORIZATION){requestAuthorizationConfigureHandoff({targetSection:'authorization'});event.preventDefault()}if((event.key==='w'||event.key==='W')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_WORKSPACE_SCOPE){requestWorkspaceScopeConfigureHandoff({targetSection:'workspace-scope'});event.preventDefault()}updateLabels()});",
  );
}

if (!t.includes('getWorkspaceScopeBranchAmount:()=>')) {
  t = t.replace(
    "getAuthorizationBranchAmount:()=>getAuthorizationBranchAmount(hierarchyRuntime),requestAuthorizationConfigure:()=>requestAuthorizationConfigureHandoff({targetSection:'authorization'}),AUTHORIZATION_BRANCH_MS,authorizationFaceAccessibleName};",
    "getAuthorizationBranchAmount:()=>getAuthorizationBranchAmount(hierarchyRuntime),requestAuthorizationConfigure:()=>requestAuthorizationConfigureHandoff({targetSection:'authorization'}),AUTHORIZATION_BRANCH_MS,authorizationFaceAccessibleName,getWorkspaceScopeBranchAmount:()=>getWorkspaceScopeBranchAmount(hierarchyRuntime),requestWorkspaceScopeConfigure:()=>requestWorkspaceScopeConfigureHandoff({targetSection:'workspace-scope'}),WORKSPACE_SCOPE_BRANCH_MS,workspaceScopeFaceAccessibleName};",
  );
}

fs.writeFileSync(target, t);
console.log('P6.1 applied to public/hero-flex.js');
