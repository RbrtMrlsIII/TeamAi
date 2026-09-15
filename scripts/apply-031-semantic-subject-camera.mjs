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

let text = readFileSync(heroPath, 'utf8');
copyFileSync(subjectSource, subjectBrowser);
copyFileSync(cameraAdapterSource, cameraAdapterBrowser);

const cameraImport = "import { resolveTreeCamera, TREE_CAMERA, DEFAULT_WORLD_ELEVATION_DEG, WORLD_BASELINE_DOCK_ID } from './hero-cam2-tree-follow.js';";
if (!text.includes("from './hero-cam7-semantic-subject.js';")) {
  if (!text.includes(cameraImport)) throw new Error('Cam-2 import anchor missing');
  text = text.replace(
    cameraImport,
    `${cameraImport}\nimport { applySemanticSubjectCameraTarget } from './hero-cam7-semantic-subject.js';`,
  );
}

if (!text.includes('function setCamera(id){')) throw new Error('setCamera function missing');
if (!text.includes('semanticSubjectCameraTargetApplied')) {
  const setCameraPattern = /function setCamera\(id\)\{[\s\S]*?\}\nlet viewW/;
  const match = text.match(setCameraPattern);
  if (!match) throw new Error('setCamera replacement boundary missing');
  const replacement = `function setCamera(id){\n  const table=cameras();\n  let next=table[id]||table.HERO_WIDE;\n  if(typeof hierarchyRuntime!=='undefined'&&hierarchyRuntime.openParentId&&typeof resolveSelectedSeatDock==='function'){\n    const seatDock=resolveSelectedSeatDock(id,typeof selectedSeat==='number'?selectedSeat:0,seatCount,profile(seatCount),{force:true});\n    if(seatDock)next=seatDock;\n  }\n  const semanticSubject=typeof hierarchyRuntime!=='undefined'?hierarchyRuntime.seat1AdjacentSubject:null;\n  const semanticCameraTargeted=Boolean(semanticSubject&& (id==='DETAIL_ANCHOR'||id==='SEAT_CLOSE'));\n  if(semanticCameraTargeted)next=applySemanticSubjectCameraTarget(next,semanticSubject);\n  cameraId=id;camFrom=camera;camTo=next;camAt=reducedMotion?1:0;camStart=performance.now();\n  if(typeof hierarchyRuntime!=='undefined'){hierarchyRuntime.cameraId=id;hierarchyRuntime.semanticSubjectCameraTargetApplied=semanticCameraTargeted;}\n}\nlet viewW`;
  text = text.replace(setCameraPattern, replacement);
}

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
  text = text.replace(clear, `${clear}\n    hierarchyRuntime.seat1AdjacentTransition=null;\n    hierarchyRuntime.seat1AdjacentSubject=null;\n    hierarchyRuntime.semanticSubjectCameraTargetApplied=false;`);
}

const apiAnchor = 'getSeat1AdjacentWiring:()=>hierarchyRuntime.seat1AdjacentWiring || null,';
if (text.includes(apiAnchor) && !text.includes('getSeat1AdjacentSubject:()=>hierarchyRuntime.seat1AdjacentSubject || null,')) {
  text = text.replace(apiAnchor, `${apiAnchor}\ngetSeat1AdjacentSubject:()=>hierarchyRuntime.seat1AdjacentSubject || null,\ngetSemanticSubjectCameraTargetApplied:()=>Boolean(hierarchyRuntime.semanticSubjectCameraTargetApplied),`);
}

writeFileSync(heroPath, text);
console.log('Semantic subject camera integration applied');
