/**
 * CAM-R1 — selected-seat subject-lock patches (post-#259).
 * Run after apply-cam2-tree-follow-flex.mjs.
 * Presentation only · no TURN_FOLLOW / HERO_LOW_ORBIT · no 029-released claim.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'public/hero-flex.js');

if (!existsSync(path)) {
  console.log('CAM-R1: no hero-flex.js — skip');
  process.exit(0);
}

let t = readFileSync(path, 'utf8');
let changed = false;

if (t.includes("selectedSeat=(selectedSeat+1)%seatCount;setState('FOCUS','next-seat-focus');setCamera('TEAM_ORBIT')")) {
  t = t.replace(
    "selectedSeat=(selectedSeat+1)%seatCount;setState('FOCUS','next-seat-focus');setCamera('TEAM_ORBIT')",
    "selectedSeat=(selectedSeat+1)%seatCount;setState('FOCUS','next-seat-focus');setCamera('SEAT_CLOSE')",
  );
  changed = true;
}

if (!t.includes('function retargetSubjectLock')) {
  const anchor = 'function selectSeatShell(index){';
  if (t.includes(anchor)) {
    t = t.replace(
      anchor,
      `function retargetSubjectLock(){\n  const open=typeof hierarchyRuntime!=='undefined'&&hierarchyRuntime.openParentId&&(String(hierarchyRuntime.openParentId).includes('SEAT_SHELL'));\n  const id=cameraId||'HERO_WIDE';\n  if(open||id==='SEAT_CLOSE'||id==='DETAIL_ANCHOR')setCamera(id);\n  return {cameraId:id,selectedSeat,seatCount,shellOpen:Boolean(open)};\n}\nfunction setSelectedSeat(index){\n  const n=Math.max(1,seatCount|0);\n  selectedSeat=((Math.floor(Number(index))%n)+n)%n;\n  syncHierarchyFromGlobals();\n  return retargetSubjectLock();\n}\n` + anchor,
    );
    changed = true;
  }
}

if (t.includes('window.TeamAiHero') && !t.includes('retargetSubjectLock,') && t.includes('setCamera,')) {
  t = t.replace('setCamera,', 'setCamera,retargetSubjectLock,setSelectedSeat,');
  changed = true;
}

writeFileSync(path, t);
console.log(changed ? 'CAM-R1 subject-lock applied' : 'CAM-R1 subject-lock already applied');
