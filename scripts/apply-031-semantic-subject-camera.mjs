#!/usr/bin/env node
/**
 * 031 semantic subject camera integration.
 * Patches the generated Hero only: camera position/dock vocabulary stays owned
 * by the existing camera system, while target coordinates come from the
 * geometry-derived semantic subject when the Seat-1 reference transition is active.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const heroPath = join(root, 'public/hero-flex.js');
const subjectSource = join(root, 'frontend/spatial/seat-adjacent-subject.js');
const subjectBrowser = join(root, 'public/seat-adjacent-subject.js');
const cameraAdapterSource = join(root, 'frontend/spatial/hero-cam7-semantic-subject.js');
const cameraAdapterBrowser = join(root, 'public/hero-cam7-semantic-subject.js');
const authoritySource = join(root, 'frontend/spatial/hero-camera-authority.js');
const authorityBrowser = join(root, 'public/hero-camera-authority.js');

let text = readFileSync(heroPath, 'utf8');
copyFileSync(subjectSource, subjectBrowser);
copyFileSync(cameraAdapterSource, cameraAdapterBrowser);
copyFileSync(authoritySource, authorityBrowser);

const cameraImport = "import { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG, WORLD_BASELINE_DOCK_ID } from './hero-cam2-tree-follow.js';";
if (!text.includes("from './hero-cam7-semantic-subject.js';")) {
  if (!text.includes(cameraImport)) throw new Error('Cam-2 import anchor missing');
  text = text.replace(
    cameraImport,
    `${cameraImport}\nimport { applySemanticSubjectCameraTarget } from './hero-cam7-semantic-subject.js';\nimport { resolveHeroCameraState } from './hero-camera-authority.js';`,
  );
}

if (!text.includes('function setCamera(id){')) throw new Error('setCamera function missing');
if (!text.includes('semanticSubjectCameraTargetApplied')) {
  const setCameraPattern = /function setCamera\(id\)\{[\s\S]*?\}\nlet viewW/;
  const match = text.match(setCameraPattern);
  if (!match) throw new Error('setCamera replacement boundary missing');
  const replacement = `let explicitCameraOverride = false;\nfunction setCamera(id, options = {}){\n  const table=cameras();\n  const semanticSubject=typeof hierarchyRuntime!=='undefined'?hierarchyRuntime.seat1AdjacentSubject:null;\n  const resolved=resolveHeroCameraState({requestedCameraId:id,hierarchyCameraId:typeof hierarchyRuntime!=='undefined'?hierarchyRuntime.cameraId:null,subject:semanticSubject,fallbackTarget:table[id]?.t||table.HERO_WIDE?.t});\n  let next=table[resolved.cameraId]||table.HERO_WIDE;\n  if(typeof hierarchyRuntime!=='undefined'&&hierarchyRuntime.openParentId&&typeof resolveSelectedSeatDock==='function'){\n    const seatDock=resolveSelectedSeatDock(resolved.cameraId,typeof selectedSeat==='number'?selectedSeat:0,seatCount,profile(seatCount),{force:true});\n    if(seatDock)next=seatDock;\n  }\n  const semanticCameraTargeted=Boolean(semanticSubject);\n  if(semanticCameraTargeted)next=applySemanticSubjectCameraTarget(next,semanticSubject);\n  cameraId=resolved.cameraId;camFrom=camera;camTo=next;camAt=reducedMotion?1:0;camStart=performance.now();\n  explicitCameraOverride = !options.internal;\n  if(typeof hierarchyRuntime!=='undefined'){hierarchyRuntime.cameraId=resolved.cameraId;hierarchyRuntime.semanticSubjectCameraTargetApplied=semanticCameraTargeted;hierarchyRuntime.explicitCameraOverride=explicitCameraOverride;}\n}\nlet viewW`;
  text = text.replace(setCameraPattern, replacement);
}

if (text.includes('function followHierarchyTreeCamera') && !text.includes('explicitCameraOverride) return null;')) {
  text = text.replace(
    'function followHierarchyTreeCamera(){',
    'function followHierarchyTreeCamera(){\n  if (explicitCameraOverride) return null;',
  );
}

text = text.replace(
  'setCamera(treeCam.cameraId);',
  'setCamera(treeCam.cameraId,{ internal: true });',
);

if (!text.includes('hierarchyRuntime.seat1AdjacentSubject=transition.subject')) {
  const anchor = '  hierarchyRuntime.seat1AdjacentWiring = {';
  if (text.includes(anchor)) {
    text = text.replace(anchor, '  hierarchyRuntime.seat1AdjacentTransition=transition;\n  hierarchyRuntime.seat1AdjacentSubject=transition.subject;\n' + anchor);
  } else {
    throw new Error('adjacent wiring state anchor missing');
  }
}
if (!text.includes('hierarchyRuntime.seat1AdjacentSubject=null')) {
  const clear = '    hierarchyRuntime.seat1AdjacentWiring = null;';
  if (!text.includes(clear)) throw new Error('adjacent wiring clear anchor missing');
  text = text.replace(clear, `${clear}\n    hierarchyRuntime.seat1AdjacentTransition=null;\n    hierarchyRuntime.seat1AdjacentSubject=null;\n    hierarchyRuntime.semanticSubjectCameraTargetApplied=false;\n    explicitCameraOverride=false;\n    hierarchyRuntime.explicitCameraOverride=false;`);
}

const apiAnchor = 'getSeat1AdjacentWiring:()=>hierarchyRuntime.seat1AdjacentWiring || null,';
if (text.includes(apiAnchor) && !text.includes('getSeat1AdjacentSubject:()=>hierarchyRuntime.seat1AdjacentSubject || null,')) {
  text = text.replace(apiAnchor, `${apiAnchor}\ngetSeat1AdjacentSubject:()=>hierarchyRuntime.seat1AdjacentSubject || null,\ngetSemanticSubjectCameraTargetApplied:()=>Boolean(hierarchyRuntime.semanticSubjectCameraTargetApplied),\ngetExplicitCameraOverride:()=>Boolean(explicitCameraOverride),`);
}

writeFileSync(heroPath, text);
console.log('Semantic subject camera integration applied');