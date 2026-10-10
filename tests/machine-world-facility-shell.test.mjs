import assert from 'node:assert/strict';
import test from 'node:test';
import * as THREE from 'three';
import { buildThreeGeometry } from '../frontend/spatial/machine-three-scene-adapter.js';
import { readFileSync } from 'node:fs';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineFacilityAssemblies } from '../frontend/spatial/machine-facility-assembly.js';
import { deriveMachineFacilityMachinery } from '../frontend/spatial/machine-facility-machinery.js';
import {
  deriveMachineWorldFacilityShellDescriptors,
  validateMachineWorldFacilityShellDescriptors,
  MACHINE_WORLD_FACILITY_SHELL_VERSION,
  MACHINE_WORLD_FACILITY_BODY_OUTLINES,
  MACHINE_WORLD_FACILITY_SERVICE_BAY_PROFILE,
  MACHINE_WORLD_FACILITY_SERVICE_BAY_WIDTH,
  MACHINE_WORLD_FACILITY_SERVICE_BAY_START_RADIUS,
  deriveMachineWorldFacilityServiceBayOutline,
  triangulateMachineWorldFacilityBodyOutline,
} from '../frontend/spatial/machine-world-facility-shell.js';

test('S7 layered outer facility shells derive a coherent body stack for each authored module', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  const descriptors = deriveMachineWorldFacilityShellDescriptors(facilities);
  assert.equal(descriptors.length, 20);
  assert.equal(new Set(descriptors.map((entry) => entry.branchId)).size, 4);
  assert.equal(descriptors.filter((entry) => entry.layer === 'main-shell').length, 4);
  assert.deepEqual(
    descriptors.filter((entry) => entry.layer === 'main-shell').map((entry) => entry.silhouette).sort(),
    ['arc', 'blade', 'diamond', 'fin'],
  );
  assert.ok(descriptors.every((entry) => entry.presentationOnly === true));
  assert.ok(validateMachineWorldFacilityShellDescriptors(descriptors).valid);
  assert.equal(MACHINE_WORLD_FACILITY_SHELL_VERSION,'S7-OUTER-BODY-V4');
  const bays=descriptors.filter(entry=>entry.serviceBayProfile===MACHINE_WORLD_FACILITY_SERVICE_BAY_PROFILE);
  assert.equal(bays.length,2);
  assert.deepEqual(bays.map(entry=>entry.layer).sort(),['main-shell','shoulder-plate']);
  assert.ok(bays.every(entry=>entry.branchId==='BRANCH-OUTER-ALPHA'&&entry.serviceBayWidth===MACHINE_WORLD_FACILITY_SERVICE_BAY_WIDTH));
  assert.ok(bays.every(entry=>entry.serviceBayStartRadius===MACHINE_WORLD_FACILITY_SERVICE_BAY_START_RADIUS));
  const area=outline=>outline.reduce((sum,p,i)=>{const q=outline[(i+1)%outline.length];return sum+p[0]*q[1]-q[0]*p[1];},0);
  for(const bay of bays){
    assert.ok(Array.isArray(bay.envelopeOutline)&&bay.envelopeOutline.length===8);
    assert.ok(area(bay.outline)>0&&area(bay.outline)<area(bay.envelopeOutline));
    assert.equal(triangulateMachineWorldFacilityBodyOutline(bay.outline).length,bay.outline.length-2);
    assert.ok(bay.outline.some((p,i)=>{
      const a=bay.outline[(i-1+bay.outline.length)%bay.outline.length],b=bay.outline[(i+1)%bay.outline.length];
      return (p[0]-a[0])*(b[1]-p[1])-(p[1]-a[1])*(b[0]-p[0]) < -1e-8;
    }),'service bay outline must be concave');
  }
});

test('S7 Analysis service bay triangulates real Three.js geometry within its authored envelope',()=>{
  const envelope=MACHINE_WORLD_FACILITY_BODY_OUTLINES.fin,dimensions={x:2.43756,y:1.12,z:1.696776};
  const outline=deriveMachineWorldFacilityServiceBayOutline({outline:envelope,dimensions,housingAngle:Math.PI/10,rotationY:Math.PI/10,layerOffset:0});
  const geometry=buildThreeGeometry(THREE,{
    id:'TEST:ALPHA:SERVICE-BAY',semanticId:'BRANCH-OUTER-ALPHA',shape:'FACILITY_FACETED_BODY',
    profile:'facility-body-fin',center:{x:0,y:0,z:0},dimensions,rotationY:Math.PI/10,materialRole:'metal2',
    outline,envelopeOutline:envelope,
  });
  try{
    const pos=geometry.getAttribute('position'),cap=(outline.length-2)*6;
    assert.equal(pos.count,cap+outline.length*6);
    geometry.computeBoundingBox();
    assert.ok(Math.abs(geometry.boundingBox.min.x+dimensions.x/2)<1e-6&&Math.abs(geometry.boundingBox.max.x-dimensions.x/2)<1e-6);
    assert.ok(Math.abs(geometry.boundingBox.min.z+dimensions.z/2)<1e-6&&Math.abs(geometry.boundingBox.max.z-dimensions.z/2)<1e-6);
    const normal=(a,b,c)=>{const u=b.map((v,i)=>v-a[i]),v=c.map((v,i)=>v-a[i]);return [u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];};
    const tri=i=>[[pos.getX(i),pos.getY(i),pos.getZ(i)],[pos.getX(i+1),pos.getY(i+1),pos.getZ(i+1)],[pos.getX(i+2),pos.getY(i+2),pos.getZ(i+2)]];
    for(let i=0;i<cap;i+=3){const p=tri(i),n=normal(...p);assert.equal(p[0][1],p[1][1]);assert.equal(p[1][1],p[2][1]);assert.ok(p[0][1]<0?n[1]<0:n[1]>0);}
    const minX=Math.min(...envelope.map(p=>p[0])),maxX=Math.max(...envelope.map(p=>p[0]));
    const minZ=Math.min(...envelope.map(p=>p[1])),maxZ=Math.max(...envelope.map(p=>p[1]));
    const sx=dimensions.x/(maxX-minX),sz=dimensions.z/(maxZ-minZ);
    for(let i=cap;i<pos.count;i+=3){const edge=Math.floor((i-cap)/6),a=outline[edge],b=outline[(edge+1)%outline.length],n=normal(...tri(i));
      assert.ok(Math.abs(n[1])<1e-6);
      assert.ok(n[0]*(b[1]-a[1])*sz-n[2]*(b[0]-a[0])*sx>0,'every outer/recess wall faces away from solid material');
    }
  }finally{geometry.dispose();}
});

test('S7 outer facility shells are World-only', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  assert.equal(deriveMachineWorldFacilityShellDescriptors(facilities, { mode: 'DIVISION_FOCUS' }).length, 0);
});

test('S7 outer facility shell source and browser copies remain exact', () => {
  const source = readFileSync('frontend/spatial/machine-world-facility-shell.js', 'utf8');
  const browser = readFileSync('public/machine-world-facility-shell.js', 'utf8');
  assert.equal(browser, source);
});

test('S7 authored facility bodies use bounded faceted outlines rather than coarse box-only shells', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  const descriptors = deriveMachineWorldFacilityShellDescriptors(facilities);

  const signedTurn = (a, b, c) => (
    (b[0] - a[0]) * (c[1] - b[1])
    - (b[1] - a[1]) * (c[0] - b[0])
  );

  for (const entry of descriptors) {
    if (entry.layer !== 'main-shell') continue;
    assert.ok(Array.isArray(entry.outline));
    assert.ok(entry.outline.length >= 8);
    assert.ok(entry.outline.every((point) => point.length === 2 && point.every(Number.isFinite)));
    const turns = entry.outline.map((point, index) => {
      const prev = entry.outline[(index - 1 + entry.outline.length) % entry.outline.length];
      const next = entry.outline[(index + 1) % entry.outline.length];
      return signedTurn(prev, point, next);
    });
    if(entry.serviceBayProfile===MACHINE_WORLD_FACILITY_SERVICE_BAY_PROFILE){
      assert.ok(turns.some(turn=>turn < -1e-8),entry.branchId+': service bay is concave');
      assert.ok(triangulateMachineWorldFacilityBodyOutline(entry.outline).length>=entry.outline.length-2);
    }else assert.ok(turns.every(turn=>turn>0),entry.branchId+': untouched profile remains convex');
    const radii=(entry.envelopeOutline||entry.outline).map(([x,z])=>Math.hypot(x,z));
    assert.ok(Math.max(...radii)<=1.30,entry.branchId+': outer envelope radial factor exceeded bound');
  }
});


test('S7 layered facility bodies remain contained by their authored main-body envelope', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({
    outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  const descriptors = deriveMachineWorldFacilityShellDescriptors(facilities);

  for (const branchId of new Set(descriptors.map((entry) => entry.branchId))) {
    const main = descriptors.find((entry) => entry.branchId === branchId && entry.layer === 'main-shell');
    assert.ok(main);
    for (const entry of descriptors.filter((candidate) => candidate.branchId === branchId)) {
      assert.ok(
        entry.center.x - entry.dimensions.x / 2 >= main.center.x - main.dimensions.x / 2 - 1e-9,
        entry.id + ': lower X bound escaped',
      );
      assert.ok(
        entry.center.x + entry.dimensions.x / 2 <= main.center.x + main.dimensions.x / 2 + 1e-9,
        entry.id + ': upper X bound escaped',
      );
      assert.ok(
        entry.center.z - entry.dimensions.z / 2 >= main.center.z - main.dimensions.z / 2 - 1e-9,
        entry.id + ': lower Z bound escaped',
      );
      assert.ok(
        entry.center.z + entry.dimensions.z / 2 <= main.center.z + main.dimensions.z / 2 + 1e-9,
        entry.id + ': upper Z bound escaped',
      );
      assert.ok(
        entry.center.y - entry.dimensions.y / 2 >= main.center.y - main.dimensions.y / 2 - 1e-9,
        entry.id + ': lower Y bound escaped',
      );
      assert.ok(
        entry.center.y + entry.dimensions.y / 2 <= main.center.y + main.dimensions.y / 2 + 1e-9,
        entry.id + ': upper Y bound escaped',
      );
    }
  }
});


test('S7 mechanism housings retain their authored family primitive inside the faceted chassis', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({
    outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  const descriptors = deriveMachineWorldFacilityShellDescriptors(facilities);
  const cores = descriptors.filter((entry) => entry.layer === 'mechanism-housing');

  assert.equal(MACHINE_WORLD_FACILITY_SHELL_VERSION, 'S7-OUTER-BODY-V4');
  assert.equal(cores.length, 4);
  assert.deepEqual(
    Object.fromEntries(cores.map((entry) => [entry.branchId, entry.shape])),
    {
      'BRANCH-OUTER-ALPHA': 'CYLINDER',
      'BRANCH-OUTER-BETA': 'BOX',
      'BRANCH-OUTER-GAMMA': 'CYLINDER',
      'BRANCH-OUTER-DELTA': 'CYLINDER',
    },
  );
  assert.ok(cores.every((entry) => entry.outline === null));

  const renderer = readFileSync('frontend/spatial/machine-world-renderer.js', 'utf8');
  const publicRenderer = readFileSync('public/machine-world-renderer.js', 'utf8');
  assert.equal(publicRenderer, renderer);
  assert.match(renderer, /BOX: Object\.freeze\(\[\[-1, -1\], \[1, -1\], \[1, 1\], \[-1, 1\]\]\)/);
  assert.match(renderer, /shell\.shape === 'CYLINDER' \? 'CYL' : shell\.shape/);
  assert.match(renderer, /authoredOutline\s*\?\s*ensureFacilityBodyBuffer\(shell\.silhouette,\s*shell\.outline,\s*shell\.envelopeOutline\)\s*:\s*ensurePrimitiveBuffer\(primitiveShape\)/);
  assert.match(renderer, /part\.kind !== 'outer-housing' \|\| !authoredS7BodyBranchIds\.has\(part\.branchId\)/);
  assert.match(renderer, /machineWorldLegacyOuterHousingFallbackCount/);
  assert.match(renderer, /machineWorldAuthoredOuterHousingReplacementCount/);
});


test('S7 Analysis bay clears its first telescope stage across Seat/expansion matrix',()=>{
  for(let seatCount=1;seatCount<=10;seatCount+=1)for(const expansionAmount of [0,0.5,1]){
    const scene=createBranchConnectionCore({seatCount,expansionAmount});
    const assemblies=deriveMachineFacilityAssemblies({outerHousings:scene.parts.filter(p=>p.kind==='outer-housing')});
    const machinery=deriveMachineFacilityMachinery({facilityAssemblies:assemblies,clearanceObstacles:scene.parts.filter(p=>p.kind==='inner-pod'),requestedClearance:0.16});
    const alpha=machinery.find(m=>m.machineRole==='analysis'),stage=alpha?.components.find(p=>p.role==='barrel-stage-1');
    assert.ok(alpha&&stage,seatCount+'/'+expansionAmount+': Analysis stage exists');
    const shells=deriveMachineWorldFacilityShellDescriptors(machinery),bays=shells.filter(p=>p.serviceBayProfile===MACHINE_WORLD_FACILITY_SERVICE_BAY_PROFILE);
    assert.equal(bays.length,2);
    const c=alpha.outerHousing.center,a=Math.atan2(c.z,c.x),rotation=shells.find(p=>p.branchId===alpha.branchId&&p.layer==='main-shell').rotationY;
    const dx=stage.center.x-c.x,dz=stage.center.z-c.z,co=Math.cos(rotation),si=Math.sin(rotation),lx=co*dx-si*dz,lz=si*dx+co*dz,u=a+rotation;
    const along=lx*Math.cos(u)+lz*Math.sin(u),across=-lx*Math.sin(u)+lz*Math.cos(u),diameter=Math.max(stage.dimensions.x,stage.dimensions.z);
    assert.ok(MACHINE_WORLD_FACILITY_SERVICE_BAY_WIDTH/2-Math.abs(across)-diameter/2>=0.02,'stage lateral margin at '+seatCount+'/'+expansionAmount);
    assert.ok(along-diameter/2-MACHINE_WORLD_FACILITY_SERVICE_BAY_START_RADIUS>=0.05,'bay rear margin at '+seatCount+'/'+expansionAmount);
    for(const bay of bays){assert.ok(validateMachineWorldFacilityShellDescriptors([bay]).valid);assert.equal(triangulateMachineWorldFacilityBodyOutline(bay.outline).length,bay.outline.length-2);}
  }
});
