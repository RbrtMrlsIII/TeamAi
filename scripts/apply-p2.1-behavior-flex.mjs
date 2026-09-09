#!/usr/bin/env node
/**
 * Idempotent P2.1 SEAT_BEHAVIOR visual flex patch for public/hero-flex.js
 * Presentation only · no 029-released claim
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'public/hero-flex.js');
if (!fs.existsSync(target)) {
  console.error('missing public/hero-flex.js');
  process.exit(1);
}
let t = fs.readFileSync(target, 'utf8');
if (t.includes('tickBehaviorBranch') && t.includes('getBehaviorBranchAmount') && t.includes("key==='b'")) {
  console.log('P2.1 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 1000) {
  console.error('hero-flex is placeholder or truncated; restore from main first');
  process.exit(1);
}

// 1) Imports
if (!t.includes('tickBehaviorBranch')) {
  const importNeedle = `  tickConnectionBranch,
  getConnectionBranchAmount,
  connectionFaceAccessibleName,
  requestConnectionConfigureHandoff,`;
  const importInsert = `  tickConnectionBranch,
  getConnectionBranchAmount,
  connectionFaceAccessibleName,
  requestConnectionConfigureHandoff,
  tickBehaviorBranch,
  getBehaviorBranchAmount,
  behaviorFaceAccessibleName,
  requestBehaviorConfigureHandoff,
  BEHAVIOR_BRANCH_MS,`;
  if (!t.includes(importNeedle)) {
    console.error('import block not found');
    process.exit(1);
  }
  t = t.replace(importNeedle, importInsert);
}

// 2) Frame tick after connection
if (!t.includes('tickBehaviorBranch(hierarchyRuntime')) {
  t = t.replace(
    'tickConnectionBranch(hierarchyRuntime,now,reducedMotion);',
    'tickConnectionBranch(hierarchyRuntime,now,reducedMotion);tickBehaviorBranch(hierarchyRuntime,now,reducedMotion);',
  );
}

// 3) Draw: branchBoost for BEHAVIOR as well as CONNECTION
if (!t.includes('isBehavior')) {
  t = t.replace(
    '    const isConnection = childId === HIERARCHY_PART.SEAT_CONNECTION;',
    '    const isConnection = childId === HIERARCHY_PART.SEAT_CONNECTION;\n    const isBehavior = childId === HIERARCHY_PART.SEAT_BEHAVIOR;',
  );
  t = t.replace(
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : 0;',
    '    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : 0);',
  );
  t = t.replace(
    '    const emit = focused || isConnection ? 0.14 * amt * (1 + 0.55 * branch) : (isToolkit && focused ? 0.1 * amt : 0.03 * amt);',
    '    const emit = focused || isConnection || isBehavior ? 0.14 * amt * (1 + 0.55 * branch) : (isToolkit && focused ? 0.1 * amt : 0.03 * amt);',
  );
  t = t.replace(
    '    const sx = 0.55 * s * (isConnection ? branchBoost : 1);',
    '    const sx = 0.55 * s * (isConnection || isBehavior ? branchBoost : 1);',
  );
  t = t.replace(
    '    const sy = 0.08 * s * (isConnection ? (1 + 0.35 * branch) : 1);',
    '    const sy = 0.08 * s * (isConnection || isBehavior ? (1 + 0.35 * branch) : 1);',
  );
  t = t.replace(
    '    const sz = 0.38 * s * (isConnection ? branchBoost : 1);',
    '    const sz = 0.38 * s * (isConnection || isBehavior ? branchBoost : 1);',
  );
}

// 4) Labels: behavior face name
if (!t.includes('behaviorFaceAccessibleName(getBehaviorBranchAmount')) {
  t = t.replace(
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CONNECTION){seatText=connectionFaceAccessibleName(getConnectionBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT)",
    "else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CONNECTION){seatText=connectionFaceAccessibleName(getConnectionBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_BEHAVIOR){seatText=behaviorFaceAccessibleName(getBehaviorBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT)",
  );
}

// 5) Keyboard B
if (!t.includes("key==='b'") && !t.includes("key==='B'")) {
  t = t.replace(
    "if((event.key==='c'||event.key==='C')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CONNECTION){requestConnectionConfigureHandoff({targetSection:'connection'});event.preventDefault()}updateLabels()});",
    "if((event.key==='c'||event.key==='C')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CONNECTION){requestConnectionConfigureHandoff({targetSection:'connection'});event.preventDefault()}if((event.key==='b'||event.key==='B')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_BEHAVIOR){requestBehaviorConfigureHandoff({targetSection:'behavior'});event.preventDefault()}updateLabels()});",
  );
}

// 6) TeamAiHero helpers
if (!t.includes('getBehaviorBranchAmount:()=>')) {
  t = t.replace(
    "getConnectionBranchAmount:()=>getConnectionBranchAmount(hierarchyRuntime),requestConnectionConfigure:()=>requestConnectionConfigureHandoff({targetSection:'connection'}),CONNECTION_BRANCH_MS,connectionFaceAccessibleName};",
    "getConnectionBranchAmount:()=>getConnectionBranchAmount(hierarchyRuntime),requestConnectionConfigure:()=>requestConnectionConfigureHandoff({targetSection:'connection'}),CONNECTION_BRANCH_MS,connectionFaceAccessibleName,getBehaviorBranchAmount:()=>getBehaviorBranchAmount(hierarchyRuntime),requestBehaviorConfigure:()=>requestBehaviorConfigureHandoff({targetSection:'behavior'}),BEHAVIOR_BRANCH_MS,behaviorFaceAccessibleName};",
  );
}

fs.writeFileSync(target, t);
console.log('P2.1 applied to public/hero-flex.js');
