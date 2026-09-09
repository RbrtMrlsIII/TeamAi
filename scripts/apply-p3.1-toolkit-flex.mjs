#!/usr/bin/env node
/**
 * Idempotent P3.1 SEAT_TOOLKIT visual flex patch for public/hero-flex.js
 * Presentation only · optional equip · no entitlement · no 029-released claim
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'public/hero-flex.js');
if (!fs.existsSync(target)) {
  console.error('missing public/hero-flex.js');
  process.exit(1);
}
let t = fs.readFileSync(target, 'utf8');
if (t.includes('tickToolkitBranch') && t.includes('getToolkitBranchAmount') && t.includes("key==='t'")) {
  console.log('P3.1 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 1000) {
  console.error('hero-flex is placeholder or truncated; restore from main first');
  process.exit(1);
}

// 1) Imports after behavior block
if (!t.includes('tickToolkitBranch')) {
  const importNeedle = `  tickBehaviorBranch,
  getBehaviorBranchAmount,
  behaviorFaceAccessibleName,
  requestBehaviorConfigureHandoff,
  BEHAVIOR_BRANCH_MS,`;
  const importInsert = `  tickBehaviorBranch,
  getBehaviorBranchAmount,
  behaviorFaceAccessibleName,
  requestBehaviorConfigureHandoff,
  BEHAVIOR_BRANCH_MS,
  tickToolkitBranch,
  getToolkitBranchAmount,
  toolkitFaceAccessibleName,
  requestToolkitConfigureHandoff,
  TOOLKIT_BRANCH_MS,`;
  if (!t.includes(importNeedle)) {
    console.error('import block not found');
    process.exit(1);
  }
  t = t.replace(importNeedle, importInsert);
}

// 2) Frame tick after behavior
if (!t.includes('tickToolkitBranch(hierarchyRuntime')) {
  t = t.replace(
    'tickBehaviorBranch(hierarchyRuntime,now,reducedMotion);',
    'tickBehaviorBranch(hierarchyRuntime,now,reducedMotion);tickToolkitBranch(hierarchyRuntime,now,reducedMotion);',
  );
}

// 3) Draw: extend branch to toolkit (isToolkit already exists for materials)
if (!t.includes('getToolkitBranchAmount(hierarchyRuntime)')) {
  t = t.replace(
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : 0);',
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : (isToolkit ? getToolkitBranchAmount(hierarchyRuntime) : 0));',
  );
  t = t.replace(
    '    const emit = focused || isConnection || isBehavior ? 0.14 * amt * (1 + 0.55 * branch) : (isToolkit && focused ? 0.1 * amt : 0.03 * amt);',
    '    const emit = focused || isConnection || isBehavior || isToolkit ? 0.14 * amt * (1 + 0.55 * branch) : 0.03 * amt;',
  );
  t = t.replace(
    '    const sx = 0.55 * s * (isConnection || isBehavior ? branchBoost : 1);',
    '    const sx = 0.55 * s * (isConnection || isBehavior || isToolkit ? branchBoost : 1);',
  );
  t = t.replace(
    '    const sy = 0.08 * s * (isConnection || isBehavior ? (1 + 0.35 * branch) : 1);',
    '    const sy = 0.08 * s * (isConnection || isBehavior || isToolkit ? (1 + 0.35 * branch) : 1);',
  );
  t = t.replace(
    '    const sz = 0.38 * s * (isConnection || isBehavior ? branchBoost : 1);',
    '    const sz = 0.38 * s * (isConnection || isBehavior || isToolkit ? branchBoost : 1);',
  );
}

// 4) Labels: toolkit face name (branch-aware)
if (!t.includes('toolkitFaceAccessibleName(getToolkitBranchAmount')) {
  t = t.replace(
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){seatText=toolkitChildAccessibleName()}",
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){seatText=toolkitFaceAccessibleName(getToolkitBranchAmount(hierarchyRuntime))}",
  );
}

// 5) Keyboard T
if (!t.includes("key==='t'") && !t.includes("key==='T'")) {
  t = t.replace(
    "if((event.key==='b'||event.key==='B')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_BEHAVIOR){requestBehaviorConfigureHandoff({targetSection:'behavior'});event.preventDefault()}updateLabels()});",
    "if((event.key==='b'||event.key==='B')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_BEHAVIOR){requestBehaviorConfigureHandoff({targetSection:'behavior'});event.preventDefault()}if((event.key==='t'||event.key==='T')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){requestToolkitConfigureHandoff({targetSection:'toolkit'});event.preventDefault()}updateLabels()});",
  );
}

// 6) TeamAiHero helpers
if (!t.includes('getToolkitBranchAmount:()=>')) {
  t = t.replace(
    "getBehaviorBranchAmount:()=>getBehaviorBranchAmount(hierarchyRuntime),requestBehaviorConfigure:()=>requestBehaviorConfigureHandoff({targetSection:'behavior'}),BEHAVIOR_BRANCH_MS,behaviorFaceAccessibleName};",
    "getBehaviorBranchAmount:()=>getBehaviorBranchAmount(hierarchyRuntime),requestBehaviorConfigure:()=>requestBehaviorConfigureHandoff({targetSection:'behavior'}),BEHAVIOR_BRANCH_MS,behaviorFaceAccessibleName,getToolkitBranchAmount:()=>getToolkitBranchAmount(hierarchyRuntime),requestToolkitConfigure:()=>requestToolkitConfigureHandoff({targetSection:'toolkit'}),TOOLKIT_BRANCH_MS,toolkitFaceAccessibleName};",
  );
}

fs.writeFileSync(target, t);
console.log('P3.1 applied to public/hero-flex.js');
