#!/usr/bin/env node
/**
 * Idempotent P7.1 SEAT_TASK_EVIDENCE visual flex patch for public/hero-flex.js
 * Presentation only · evidence face · no entitlement · no 029-released claim
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'public/hero-flex.js');
if (!fs.existsSync(target)) {
  console.error('missing public/hero-flex.js');
  process.exit(1);
}
let t = fs.readFileSync(target, 'utf8');
if (t.includes('tickTaskEvidenceBranch') && t.includes('getTaskEvidenceBranchAmount') && t.includes("key==='e'")) {
  console.log('P7.1 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 1000) {
  console.error('hero-flex is placeholder or truncated; restore from main first');
  process.exit(1);
}

if (!t.includes('tickTaskEvidenceBranch')) {
  const importNeedle = `  tickWorkspaceScopeBranch,
  getWorkspaceScopeBranchAmount,
  workspaceScopeFaceAccessibleName,
  requestWorkspaceScopeConfigureHandoff,
  WORKSPACE_SCOPE_BRANCH_MS,`;
  const importInsert = `  tickWorkspaceScopeBranch,
  getWorkspaceScopeBranchAmount,
  workspaceScopeFaceAccessibleName,
  requestWorkspaceScopeConfigureHandoff,
  WORKSPACE_SCOPE_BRANCH_MS,
  tickTaskEvidenceBranch,
  getTaskEvidenceBranchAmount,
  taskEvidenceFaceAccessibleName,
  requestTaskEvidenceConfigureHandoff,
  TASK_EVIDENCE_BRANCH_MS,`;
  if (!t.includes(importNeedle)) {
    console.error('import block not found');
    process.exit(1);
  }
  t = t.replace(importNeedle, importInsert);
}

if (!t.includes('tickTaskEvidenceBranch(hierarchyRuntime')) {
  t = t.replace(
    'tickWorkspaceScopeBranch(hierarchyRuntime,now,reducedMotion);',
    'tickWorkspaceScopeBranch(hierarchyRuntime,now,reducedMotion);tickTaskEvidenceBranch(hierarchyRuntime,now,reducedMotion);',
  );
}

if (!t.includes('isTaskEvidence')) {
  t = t.replace(
    '    const isWorkspaceScope = childId === HIERARCHY_PART.SEAT_WORKSPACE_SCOPE;',
    '    const isWorkspaceScope = childId === HIERARCHY_PART.SEAT_WORKSPACE_SCOPE;\n    const isTaskEvidence = childId === HIERARCHY_PART.SEAT_TASK_EVIDENCE;',
  );
  t = t.replace(
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : (isToolkit ? getToolkitBranchAmount(hierarchyRuntime) : (isCapabilities ? getCapabilitiesBranchAmount(hierarchyRuntime) : (isAuthorization ? getAuthorizationBranchAmount(hierarchyRuntime) : (isWorkspaceScope ? getWorkspaceScopeBranchAmount(hierarchyRuntime) : 0)))));',
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : (isToolkit ? getToolkitBranchAmount(hierarchyRuntime) : (isCapabilities ? getCapabilitiesBranchAmount(hierarchyRuntime) : (isAuthorization ? getAuthorizationBranchAmount(hierarchyRuntime) : (isWorkspaceScope ? getWorkspaceScopeBranchAmount(hierarchyRuntime) : (isTaskEvidence ? getTaskEvidenceBranchAmount(hierarchyRuntime) : 0))))));',
  );
  t = t.replace(
    '    const emit = focused || isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope ? 0.14 * amt * (1 + 0.55 * branch) : 0.03 * amt;',
    '    const emit = focused || isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope || isTaskEvidence ? 0.14 * amt * (1 + 0.55 * branch) : 0.03 * amt;',
  );
  t = t.replace(
    '    const sx = 0.55 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope ? branchBoost : 1);',
    '    const sx = 0.55 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope || isTaskEvidence ? branchBoost : 1);',
  );
  t = t.replace(
    '    const sy = 0.08 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope ? (1 + 0.35 * branch) : 1);',
    '    const sy = 0.08 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope || isTaskEvidence ? (1 + 0.35 * branch) : 1);',
  );
  t = t.replace(
    '    const sz = 0.38 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope ? branchBoost : 1);',
    '    const sz = 0.38 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope || isTaskEvidence ? branchBoost : 1);',
  );
}

if (!t.includes('taskEvidenceFaceAccessibleName(getTaskEvidenceBranchAmount')) {
  t = t.replace(
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_WORKSPACE_SCOPE){seatText=workspaceScopeFaceAccessibleName(getWorkspaceScopeBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId)",
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_WORKSPACE_SCOPE){seatText=workspaceScopeFaceAccessibleName(getWorkspaceScopeBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TASK_EVIDENCE){seatText=taskEvidenceFaceAccessibleName(getTaskEvidenceBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId)",
  );
}

if (!t.includes("key==='e'") && !t.includes("key==='E'")) {
  t = t.replace(
    "if((event.key==='w'||event.key==='W')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_WORKSPACE_SCOPE){requestWorkspaceScopeConfigureHandoff({targetSection:'workspace-scope'});event.preventDefault()}updateLabels()});",
    "if((event.key==='w'||event.key==='W')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_WORKSPACE_SCOPE){requestWorkspaceScopeConfigureHandoff({targetSection:'workspace-scope'});event.preventDefault()}if((event.key==='e'||event.key==='E')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TASK_EVIDENCE){requestTaskEvidenceConfigureHandoff({targetSection:'task-evidence'});event.preventDefault()}updateLabels()});",
  );
}

if (!t.includes('getTaskEvidenceBranchAmount:()=>')) {
  t = t.replace(
    "getWorkspaceScopeBranchAmount:()=>getWorkspaceScopeBranchAmount(hierarchyRuntime),requestWorkspaceScopeConfigure:()=>requestWorkspaceScopeConfigureHandoff({targetSection:'workspace-scope'}),WORKSPACE_SCOPE_BRANCH_MS,workspaceScopeFaceAccessibleName};",
    "getWorkspaceScopeBranchAmount:()=>getWorkspaceScopeBranchAmount(hierarchyRuntime),requestWorkspaceScopeConfigure:()=>requestWorkspaceScopeConfigureHandoff({targetSection:'workspace-scope'}),WORKSPACE_SCOPE_BRANCH_MS,workspaceScopeFaceAccessibleName,getTaskEvidenceBranchAmount:()=>getTaskEvidenceBranchAmount(hierarchyRuntime),requestTaskEvidenceConfigure:()=>requestTaskEvidenceConfigureHandoff({targetSection:'task-evidence'}),TASK_EVIDENCE_BRANCH_MS,taskEvidenceFaceAccessibleName};",
  );
}

fs.writeFileSync(target, t);
console.log('P7.1 applied to public/hero-flex.js');
