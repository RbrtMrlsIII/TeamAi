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
  MACHINE_WORLD_FACILITY_SHELL_DESCRIPTOR_COUNT,
  MACHINE_WORLD_FACILITY_NESTED_MASSING_PROFILE,
  MACHINE_WORLD_FACILITY_NESTED_MASSING_BRANCH,
  MACHINE_WORLD_FACILITY_BODY_OUTLINES,
  MACHINE_WORLD_FACILITY_SERVICE_BAY_PROFILE,
  MACHINE_WORLD_FACILITY_SERVICE_BAY_WIDTH,
  MACHINE_WORLD_FACILITY_SERVICE_BAY_START_RADIUS,
  MACHINE_WORLD_FACILITY_CORE_REVEAL_PROFILE,
  MACHINE_WORLD_FACILITY_CORE_REVEAL_WIDTH_RATIO,
  MACHINE_WORLD_FACILITY_CORE_REVEAL_START_RADIUS_RATIO,
  MACHINE_WORLD_FACILITY_SHOULDER_REVEAL_PROFILE,
  MACHINE_WORLD_FACILITY_SHOULDER_REVEAL_WIDTH_RATIO,
  MACHINE_WORLD_FACILITY_SHOULDER_REVEAL_BACK_WIDTH_RATIO,
  MACHINE_WORLD_FACILITY_SHOULDER_REVEAL_FLARE_START_RADIUS_RATIO,
  MACHINE_WORLD_FACILITY_CONTROL_AXIAL_CORE_PROFILE,
  MACHINE_WORLD_FACILITY_CONTROL_AXIAL_RING_PROFILE,
  MACHINE_WORLD_FACILITY_CONTROL_CORE_DIAMETER_RATIO,
  MACHINE_WORLD_FACILITY_CONTROL_CORE_LENGTH_RATIO,
  MACHINE_WORLD_FACILITY_CONTROL_ROTOR_RING_SPAN_RATIO,
  MACHINE_WORLD_FACILITY_CONTROL_ROTOR_RING_HEIGHT_RATIO,
  MACHINE_WORLD_FACILITY_CONTROL_ROTOR_RING_AXIS_OFFSET_RATIO,
  MACHINE_WORLD_FACILITY_CONTROL_STANCHION_HEIGHT_RATIO,
  MACHINE_WORLD_FACILITY_CONTROL_STANCHION_WIDTH_RATIO,
  MACHINE_WORLD_FACILITY_CONTROL_STANCHION_RING_OVERLAP,
  MACHINE_WORLD_FACILITY_CONTROL_STANCHION_BASE_OVERLAP,
  deriveMachineWorldFacilityRadialRevealOutline,
  deriveMachineWorldFacilityServiceBayOutline,
  triangulateMachineWorldFacilityBodyOutline,
} from '../frontend/spatial/machine-world-facility-shell.js';

function signedPolygonArea(points) {
  let twice = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    twice += current.x * next.z - next.x * current.z;
  }
  return twice * 0.5;
}

function cross2D(a, b) { return a.x * b.z - a.z * b.x; }

function intersectConvexFootprints(subject, clip) {
  let output = subject.map((point) => ({ ...point }));
  const orientation = signedPolygonArea(clip) >= 0 ? 1 : -1;
  const inside = (point, a, b) => orientation * cross2D(
    { x: b.x - a.x, z: b.z - a.z },
    { x: point.x - a.x, z: point.z - a.z },
  ) >= -1e-9;
  const intersection = (start, end, a, b) => {
    const direction = { x: end.x - start.x, z: end.z - start.z };
    const edge = { x: b.x - a.x, z: b.z - a.z };
    const denominator = cross2D(direction, edge);
    if (Math.abs(denominator) < 1e-12) return { ...end };
    const toClip = { x: a.x - start.x, z: a.z - start.z };
    const t = cross2D(toClip, edge) / denominator;
    return { x: start.x + t * direction.x, z: start.z + t * direction.z };
  };

  for (let index = 0; index < clip.length && output.length; index += 1) {
    const a = clip[index];
    const b = clip[(index + 1) % clip.length];
    const input = output;
    output = [];
    let previous = input[input.length - 1];
    let wasInside = inside(previous, a, b);
    for (const current of input) {
      const isInside = inside(current, a, b);
      if (isInside) {
        if (!wasInside) output.push(intersection(previous, current, a, b));
        output.push(current);
      } else if (wasInside) {
        output.push(intersection(previous, current, a, b));
      }
      previous = current;
      wasInside = isInside;
    }
  }
  return output.length >= 3 ? Math.abs(signedPolygonArea(output)) : 0;
}

function descriptorWorldFootprint(descriptor) {
  const outline = descriptor.shape === 'FACILITY_FACETED_BODY'
    ? descriptor.outline
    : [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const cosine = Math.cos(descriptor.rotationY || 0);
  const sine = Math.sin(descriptor.rotationY || 0);
  return outline.map(([u, v]) => {
    const x = u * descriptor.dimensions.x * 0.5;
    const z = v * descriptor.dimensions.z * 0.5;
    return {
      x: descriptor.center.x + cosine * x + sine * z,
      z: descriptor.center.z - sine * x + cosine * z,
    };
  });
}

test('S7 layered outer facility shells derive a coherent body stack for each authored module', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
  const facilities = deriveMachineFacilityMachinery({ facilityAssemblies: assemblies });
  const descriptors = deriveMachineWorldFacilityShellDescriptors(facilities);
  assert.equal(descriptors.length, MACHINE_WORLD_FACILITY_SHELL_DESCRIPTOR_COUNT);
  assert.equal(new Set(descriptors.map((entry) => entry.branchId)).size, 4);
  assert.equal(descriptors.filter((entry) => entry.layer === 'main-shell').length, 4);
  assert.deepEqual(
    descriptors.filter((entry) => entry.layer === 'main-shell').map((entry) => entry.silhouette).sort(),
    ['arc', 'blade', 'diamond', 'fin'],
  );
  assert.ok(descriptors.every((entry) => entry.presentationOnly === true));
  assert.ok(validateMachineWorldFacilityShellDescriptors(descriptors).valid);
  assert.equal(MACHINE_WORLD_FACILITY_SHELL_VERSION,'S7-OUTER-BODY-V10');
  const bays=descriptors.filter(entry=>entry.serviceBayProfile===MACHINE_WORLD_FACILITY_SERVICE_BAY_PROFILE);
  assert.equal(bays.length,2);
  assert.deepEqual(bays.map(entry=>entry.layer).sort(),['main-shell','shoulder-plate']);
  assert.ok(bays.every(entry=>entry.branchId==='BRANCH-OUTER-ALPHA'&&entry.serviceBayWidth===MACHINE_WORLD_FACILITY_SERVICE_BAY_WIDTH));
  assert.ok(bays.every(entry=>entry.serviceBayStartRadius===MACHINE_WORLD_FACILITY_SERVICE_BAY_START_RADIUS));
  const area=outline=>outline.reduce((sum,p,i)=>{const q=outline[(i+1)%outline.length];return sum+p[0]*q[1]-q[0]*p[1];},0);
  const reveals=descriptors.filter(entry=>entry.coreRevealProfile===MACHINE_WORLD_FACILITY_CORE_REVEAL_PROFILE);
  assert.equal(reveals.length,1);
  assert.equal(reveals[0].branchId,MACHINE_WORLD_FACILITY_NESTED_MASSING_BRANCH);
  assert.equal(reveals[0].layer,'main-shell');
  assert.ok(Array.isArray(reveals[0].envelopeOutline)&&reveals[0].envelopeOutline.length===8);
  assert.ok(area(reveals[0].outline)>0&&area(reveals[0].outline)<area(reveals[0].envelopeOutline));
  assert.equal(triangulateMachineWorldFacilityBodyOutline(reveals[0].outline).length,reveals[0].outline.length-2);
  assert.ok(reveals[0].outline.some((p,i)=>{
    const a=reveals[0].outline[(i-1+reveals[0].outline.length)%reveals[0].outline.length],b=reveals[0].outline[(i+1)%reveals[0].outline.length];
    return (p[0]-a[0])*(b[1]-p[1])-(p[1]-a[1])*(b[0]-p[0]) < -1e-8;
  }),'Control core reveal outline must be concave');
  const revealBodyMin=Math.min(reveals[0].dimensions.x,reveals[0].dimensions.z);
  assert.ok(Math.abs(reveals[0].coreRevealWidth/revealBodyMin-MACHINE_WORLD_FACILITY_CORE_REVEAL_WIDTH_RATIO)<1e-9);
  assert.ok(Math.abs(reveals[0].coreRevealStartRadius/revealBodyMin-MACHINE_WORLD_FACILITY_CORE_REVEAL_START_RADIUS_RATIO)<1e-9);
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

test('S7 generic radial reveal preserves the established Analysis service-bay API',()=>{
  const common={
    outline:MACHINE_WORLD_FACILITY_BODY_OUTLINES.fin,
    dimensions:{x:2.43756,y:1.12,z:1.696776},
    housingAngle:Math.PI/10,
    rotationY:Math.PI/10,
    layerOffset:0,
  };
  const generic=deriveMachineWorldFacilityRadialRevealOutline({
    ...common,
    width:MACHINE_WORLD_FACILITY_SERVICE_BAY_WIDTH,
    startRadius:MACHINE_WORLD_FACILITY_SERVICE_BAY_START_RADIUS,
  });
  const legacy=deriveMachineWorldFacilityServiceBayOutline({
    ...common,
    bayWidth:MACHINE_WORLD_FACILITY_SERVICE_BAY_WIDTH,
    bayStartRadius:MACHINE_WORLD_FACILITY_SERVICE_BAY_START_RADIUS,
  });
  assert.deepEqual(legacy,generic);
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

test('S7 Control core reveal triangulates real Three.js geometry within its authored envelope',()=>{
  const scene=createBranchConnectionCore({seatCount:10,expansionAmount:0});
  const assemblies=deriveMachineFacilityAssemblies({outerHousings:scene.parts.filter(p=>p.kind==='outer-housing')});
  const machinery=deriveMachineFacilityMachinery({
    facilityAssemblies:assemblies,
    clearanceObstacles:scene.parts.filter(p=>p.kind==='inner-pod'),
    requestedClearance:0.16,
  });
  const shells=deriveMachineWorldFacilityShellDescriptors(machinery);
  const reveal=shells.find(p=>p.coreRevealProfile===MACHINE_WORLD_FACILITY_CORE_REVEAL_PROFILE);
  assert.ok(reveal);
  assert.equal(reveal.branchId,MACHINE_WORLD_FACILITY_NESTED_MASSING_BRANCH);
  const geometry=buildThreeGeometry(THREE,reveal);
  try{
    const positions=geometry.getAttribute('position');
    const capVertexCount=(reveal.outline.length-2)*6;
    assert.equal(positions.count,capVertexCount+reveal.outline.length*6);
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox;
    const halfX = reveal.dimensions.x / 2;
    const halfZ = reveal.dimensions.z / 2;
    assert.deepEqual(reveal.envelopeOutline, MACHINE_WORLD_FACILITY_BODY_OUTLINES.diamond);
    assert.ok(bounds.min.x >= -halfX - 1e-6 && bounds.max.x <= halfX + 1e-6, 'revealed geometry remains within authored X bounds');
    assert.ok(bounds.min.z >= -halfZ - 1e-6 && bounds.max.z <= halfZ + 1e-6, 'revealed geometry remains within authored Z bounds');
    assert.ok(bounds.max.z < halfZ - 1e-3, 'open radial reveal must remove occupied geometry from the mouth, not expand or refill it');
  }finally{
    geometry.dispose();
  }
});


test('S7 Control shoulder-plate reveal stays narrower, bounded, triangulatable, and aligned across Seat/expansion matrix', () => {
  const signedArea = (outline) => outline.reduce((sum, point, index) => {
    const next = outline[(index + 1) % outline.length];
    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0);
  const pointInsideOrOn = (point, outline) => {
    let inside = false;
    for (let i = 0, j = outline.length - 1; i < outline.length; j = i, i += 1) {
      const a = outline[j], b = outline[i];
      const cross = (b[0] - a[0]) * (point[1] - a[1]) - (b[1] - a[1]) * (point[0] - a[0]);
      if (Math.abs(cross) <= 1e-7
        && point[0] >= Math.min(a[0], b[0]) - 1e-7 && point[0] <= Math.max(a[0], b[0]) + 1e-7
        && point[1] >= Math.min(a[1], b[1]) - 1e-7 && point[1] <= Math.max(a[1], b[1]) + 1e-7) return true;
      if ((a[1] > point[1]) !== (b[1] > point[1])) {
        const x = ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0];
        if (point[0] < x) inside = !inside;
      }
    }
    return inside;
  };
  const worldInnerMidpoint = (descriptor) => {
    // Constant-width reveal: inner endpoints are [1, 2]. The flared shoulder
    // inserts two transition points, moving its rear endpoints to [2, 3].
    const start = descriptor.layer === 'shoulder-plate' ? 2 : 1;
    const a = descriptor.outline[start], b = descriptor.outline[start + 1];
    const localX = ((a[0] + b[0]) / 2) * descriptor.dimensions.x / 2;
    const localZ = ((a[1] + b[1]) / 2) * descriptor.dimensions.z / 2;
    const cosine = Math.cos(descriptor.rotationY), sine = Math.sin(descriptor.rotationY);
    return {
      x: descriptor.center.x + cosine * localX + sine * localZ,
      z: descriptor.center.z - sine * localX + cosine * localZ,
    };
  };

  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 0.5, 1]) {
      const scene = createBranchConnectionCore({ seatCount, expansionAmount });
      const assemblies = deriveMachineFacilityAssemblies({
        outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
      });
      const machinery = deriveMachineFacilityMachinery({
        facilityAssemblies: assemblies,
        clearanceObstacles: scene.parts.filter((part) => part.kind === 'inner-pod'),
        requestedClearance: 0.16,
      });
      const descriptors = deriveMachineWorldFacilityShellDescriptors(machinery);
      const main = descriptors.find((part) =>
        part.branchId === MACHINE_WORLD_FACILITY_NESTED_MASSING_BRANCH && part.layer === 'main-shell'
      );
      const shoulder = descriptors.find((part) => part.shoulderRevealProfile === MACHINE_WORLD_FACILITY_SHOULDER_REVEAL_PROFILE);
      assert.ok(main && shoulder, seatCount + '/' + expansionAmount + ': Control main and shoulder shells exist');
      assert.equal(shoulder.branchId, MACHINE_WORLD_FACILITY_NESTED_MASSING_BRANCH);
      assert.equal(shoulder.layer, 'shoulder-plate');
      assert.deepEqual(shoulder.envelopeOutline, MACHINE_WORLD_FACILITY_BODY_OUTLINES.diamond);

      const mainMin = Math.min(main.dimensions.x, main.dimensions.z);
      assert.ok(Math.abs(shoulder.shoulderRevealWidth / mainMin - MACHINE_WORLD_FACILITY_SHOULDER_REVEAL_WIDTH_RATIO) < 1e-9);
      assert.ok(Math.abs(shoulder.shoulderRevealBackWidth / mainMin - MACHINE_WORLD_FACILITY_SHOULDER_REVEAL_BACK_WIDTH_RATIO) < 1e-9);
      assert.ok(Math.abs(shoulder.shoulderRevealStartRadius - main.coreRevealStartRadius) < 1e-9);
      assert.ok(Math.abs(shoulder.shoulderRevealStartRadius / mainMin - MACHINE_WORLD_FACILITY_CORE_REVEAL_START_RADIUS_RATIO) < 1e-9);
      assert.ok(Math.abs(shoulder.shoulderRevealFlareStartRadius / mainMin - MACHINE_WORLD_FACILITY_SHOULDER_REVEAL_FLARE_START_RADIUS_RATIO) < 1e-9);
      assert.ok(shoulder.shoulderRevealWidth < main.coreRevealWidth * 0.90, 'shoulder aperture remains narrower than the main opening');
      assert.ok(shoulder.shoulderRevealBackWidth < shoulder.shoulderRevealWidth, 'the back throat tapers into the wider rotor chamber');
      const core = descriptors.find((part) => part.branchId === shoulder.branchId && part.layer === 'mechanism-housing');
      const rotorRings = descriptors.filter((part) =>
        part.branchId === shoulder.branchId
        && part.nestedMassingProfile === MACHINE_WORLD_FACILITY_NESTED_MASSING_PROFILE
        && part.nestedMassingRole === 'rotor-ring'
      );
      assert.ok(core && rotorRings.length === 2);
      const radialAngle = Math.atan2(core.center.z, core.center.x);
      const ringOffsets = rotorRings.map((ring) =>
        (ring.center.x - core.center.x) * Math.cos(radialAngle)
        + (ring.center.z - core.center.z) * Math.sin(radialAngle)
      ).sort((a, b) => a - b);
      const ringRear = ringOffsets[0] - Math.max(...rotorRings.map((ring) => ring.dimensions.z * 0.5));
      const flareProgress = (ringRear - shoulder.shoulderRevealStartRadius)
        / (shoulder.shoulderRevealFlareStartRadius - shoulder.shoulderRevealStartRadius);
      assert.ok(flareProgress >= 0 && flareProgress <= 1,
        seatCount + '/' + expansionAmount + ': rear rotor collar falls within tapered reveal section');
      const openingAtRearRing = shoulder.shoulderRevealBackWidth
        + (shoulder.shoulderRevealWidth - shoulder.shoulderRevealBackWidth) * flareProgress;
      const ringOuterDiameter = Math.max(...rotorRings.map((ring) => ring.dimensions.x));
      assert.ok(openingAtRearRing > ringOuterDiameter * 1.05,
        seatCount + '/' + expansionAmount + ': tapered reveal clears the rear collar diameter with margin');
      assert.ok(signedArea(shoulder.outline) > 0);
      assert.ok(signedArea(shoulder.outline) < signedArea(shoulder.envelopeOutline));
      assert.equal(triangulateMachineWorldFacilityBodyOutline(shoulder.outline).length, shoulder.outline.length - 2);
      assert.ok(shoulder.outline.every((point) => pointInsideOrOn(point, shoulder.envelopeOutline)),
        seatCount + '/' + expansionAmount + ': shoulder outline stays inside its authored outline');
      const toWorldOutline = (descriptor, outline) => outline.map(([u, v]) => {
        const localX = u * descriptor.dimensions.x / 2;
        const localZ = v * descriptor.dimensions.z / 2;
        const cosine = Math.cos(descriptor.rotationY), sine = Math.sin(descriptor.rotationY);
        return [
          descriptor.center.x + cosine * localX + sine * localZ,
          descriptor.center.z - sine * localX + cosine * localZ,
        ];
      });
      const mainWorldEnvelope = toWorldOutline(main, main.envelopeOutline);
      const shoulderWorldOutline = toWorldOutline(shoulder, shoulder.outline);
      assert.ok(shoulderWorldOutline.every((point) => pointInsideOrOn(point, mainWorldEnvelope)),
        seatCount + '/' + expansionAmount + ': shoulder reveal stays inside world-space main-shell envelope');
      const innerMidMain = worldInnerMidpoint(main);
      const innerMidShoulder = worldInnerMidpoint(shoulder);
      assert.ok(Math.hypot(innerMidMain.x - innerMidShoulder.x, innerMidMain.z - innerMidShoulder.z) < 1e-6,
        seatCount + '/' + expansionAmount + ': main/shoulder reveal rear edge remains aligned in world space');
      assert.equal(validateMachineWorldFacilityShellDescriptors([main, shoulder]).valid, true,
        seatCount + '/' + expansionAmount + ': shoulder reveal is valid with its required main-shell reference');
      const shoulderWithoutProfile = { ...shoulder };
      delete shoulderWithoutProfile.shoulderRevealProfile;
      const missingProfileValidation = validateMachineWorldFacilityShellDescriptors(
        descriptors.map((entry) => entry.id === shoulder.id ? shoulderWithoutProfile : entry),
      );
      assert.equal(missingProfileValidation.valid, false,
        seatCount + '/' + expansionAmount + ': missing shoulder profile must fail closed');
      assert.ok(missingProfileValidation.reasons.includes(shoulder.id + ':SHOULDER_REVEAL_PROFILE_MISMATCH'),
        seatCount + '/' + expansionAmount + ': missing shoulder profile returns a precise validation reason');
      assert.equal(validateMachineWorldFacilityShellDescriptors([shoulder]).valid, false,
        seatCount + '/' + expansionAmount + ': shoulder reveal must not validate without the main-shell alignment reference');
    }
  }

  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({
    outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const descriptors = deriveMachineWorldFacilityShellDescriptors(deriveMachineFacilityMachinery({ facilityAssemblies: assemblies }));
  const shoulder = descriptors.find((part) => part.shoulderRevealProfile === MACHINE_WORLD_FACILITY_SHOULDER_REVEAL_PROFILE);
  const geometry = buildThreeGeometry(THREE, shoulder);
  try {
    const positions = geometry.getAttribute('position');
    assert.equal(positions.count, (shoulder.outline.length - 2) * 6 + shoulder.outline.length * 6);
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox;
    assert.ok(bounds.min.x >= -shoulder.dimensions.x / 2 - 1e-6 && bounds.max.x <= shoulder.dimensions.x / 2 + 1e-6);
    assert.ok(bounds.min.z >= -shoulder.dimensions.z / 2 - 1e-6 && bounds.max.z <= shoulder.dimensions.z / 2 + 1e-6);
    assert.ok(bounds.min.y >= -shoulder.dimensions.y / 2 - 1e-6 && bounds.max.y <= shoulder.dimensions.y / 2 + 1e-6);
  } finally {
    geometry.dispose();
  }
});

test('S7 Control axial core and annular rotor rings triangulate real Three.js geometry within descriptors', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
  const machinery = deriveMachineFacilityMachinery({
    facilityAssemblies: assemblies,
    clearanceObstacles: scene.parts.filter((part) => part.kind === 'inner-pod'),
    requestedClearance: 0.16,
  });
  const shells = deriveMachineWorldFacilityShellDescriptors(machinery);
  const core = shells.find((part) => part.geometryProfile === MACHINE_WORLD_FACILITY_CONTROL_AXIAL_CORE_PROFILE);
  const rings = shells.filter((part) => part.geometryProfile === MACHINE_WORLD_FACILITY_CONTROL_AXIAL_RING_PROFILE);
  assert.ok(core);
  assert.equal(rings.length, 2);
  const coreGeometry = buildThreeGeometry(THREE, core);
  try {
    coreGeometry.computeBoundingBox();
    const box = coreGeometry.boundingBox;
    assert.ok(Math.abs(box.min.x + core.dimensions.x / 2) < 1e-6);
    assert.ok(Math.abs(box.max.x - core.dimensions.x / 2) < 1e-6);
    assert.ok(Math.abs(box.min.y + core.dimensions.z / 2) < 1e-6);
    assert.ok(Math.abs(box.max.y - core.dimensions.z / 2) < 1e-6);
    assert.ok(Math.abs(box.min.z + core.dimensions.y / 2) < 1e-6);
    assert.ok(Math.abs(box.max.z - core.dimensions.y / 2) < 1e-6);
    assert.equal(coreGeometry.parameters.radialSegments, 16);
  } finally {
    coreGeometry.dispose();
  }
  for (const ring of rings) {
    const geometry = buildThreeGeometry(THREE, ring);
    try {
      const positions = geometry.getAttribute('position');
      assert.equal(positions.count, 24 * 24);
      geometry.computeBoundingBox();
      assert.ok(Math.abs(geometry.boundingBox.min.x + ring.dimensions.x / 2) < 1e-6);
      assert.ok(Math.abs(geometry.boundingBox.max.x - ring.dimensions.x / 2) < 1e-6);
      assert.ok(Math.abs(geometry.boundingBox.min.y + ring.dimensions.y / 2) < 1e-6);
      assert.ok(Math.abs(geometry.boundingBox.max.y - ring.dimensions.y / 2) < 1e-6);
      assert.ok(Math.abs(geometry.boundingBox.min.z + ring.dimensions.z / 2) < 1e-6);
      assert.ok(Math.abs(geometry.boundingBox.max.z - ring.dimensions.z / 2) < 1e-6);
      const radii = Array.from({ length: positions.count }, (_, i) => Math.hypot(
        positions.getX(i) / (ring.dimensions.x / 2),
        positions.getY(i) / (ring.dimensions.y / 2),
      ));
      assert.ok(Math.min(...radii) >= 0.72 - 1e-6);
      assert.ok(Math.max(...radii) <= 1 + 1e-6);
    } finally {
      geometry.dispose();
    }
  }
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
    if(entry.serviceBayProfile===MACHINE_WORLD_FACILITY_SERVICE_BAY_PROFILE||entry.coreRevealProfile===MACHINE_WORLD_FACILITY_CORE_REVEAL_PROFILE){
      assert.ok(turns.some(turn=>turn < -1e-8),entry.branchId+': radial reveal is concave');
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

  assert.equal(MACHINE_WORLD_FACILITY_SHELL_VERSION, 'S7-OUTER-BODY-V10');
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

test('S7 Control radial rotor core and annular rings stay coherent across Seat/expansion matrix', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 0.5, 1]) {
      const scene = createBranchConnectionCore({ seatCount, expansionAmount });
      const assemblies = deriveMachineFacilityAssemblies({ outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing') });
      const machinery = deriveMachineFacilityMachinery({
        facilityAssemblies: assemblies,
        clearanceObstacles: scene.parts.filter((part) => part.kind === 'inner-pod'),
        requestedClearance: 0.16,
      });
      const shells = deriveMachineWorldFacilityShellDescriptors(machinery);
      const reveals = shells.filter((entry) => entry.coreRevealProfile === MACHINE_WORLD_FACILITY_CORE_REVEAL_PROFILE);
      assert.equal(reveals.length, 1, seatCount + '/' + expansionAmount + ': one Control reveal');
      const reveal = reveals[0];
      assert.equal(reveal.branchId, MACHINE_WORLD_FACILITY_NESTED_MASSING_BRANCH);
      assert.equal(reveal.layer, 'main-shell');
      const cradles = shells.filter((entry) => entry.nestedMassingProfile === MACHINE_WORLD_FACILITY_NESTED_MASSING_PROFILE);
      assert.equal(cradles.length, 4);
      assert.deepEqual(cradles.map((entry) => entry.nestedMassingRole).sort(),
        ['rotor-ring', 'rotor-ring', 'rotor-stanchion', 'rotor-stanchion']);
      assert.ok(cradles.every((entry) => entry.branchId === MACHINE_WORLD_FACILITY_NESTED_MASSING_BRANCH));

      const main = shells.find((entry) => entry.branchId === MACHINE_WORLD_FACILITY_NESTED_MASSING_BRANCH && entry.layer === 'main-shell');
      const core = shells.find((entry) => entry.branchId === MACHINE_WORLD_FACILITY_NESTED_MASSING_BRANCH && entry.layer === 'mechanism-housing');
      assert.ok(main && core);
      const bodyMin = Math.min(main.dimensions.x, main.dimensions.z);
      assert.equal(core.geometryProfile, MACHINE_WORLD_FACILITY_CONTROL_AXIAL_CORE_PROFILE);
      assert.equal(core.shape, 'CYLINDER');
      assert.ok(Math.abs(core.dimensions.x / bodyMin - MACHINE_WORLD_FACILITY_CONTROL_CORE_DIAMETER_RATIO) < 1e-9);
      assert.ok(Math.abs(core.dimensions.y / bodyMin - MACHINE_WORLD_FACILITY_CONTROL_CORE_DIAMETER_RATIO) < 1e-9);
      assert.ok(Math.abs(core.dimensions.z / bodyMin - MACHINE_WORLD_FACILITY_CONTROL_CORE_LENGTH_RATIO) < 1e-9);
      assert.ok(core.dimensions.z > core.dimensions.x);
      const radialAngle = Math.atan2(core.center.z, core.center.x);
      assert.ok(Math.abs(core.rotationY - (Math.PI * 0.5 - radialAngle)) < 1e-7);

      const rings = cradles.filter((entry) => entry.nestedMassingRole === 'rotor-ring');
      assert.equal(rings.length, 2);
      const posts = cradles.filter((entry) => entry.nestedMassingRole === 'rotor-stanchion');
      assert.ok(rings.every((ring) => ring.geometryProfile === MACHINE_WORLD_FACILITY_CONTROL_AXIAL_RING_PROFILE));
      assert.ok(rings.every((ring) => ring.shape === 'TORUS'));
      const expectedRingSpan = Math.min(bodyMin * MACHINE_WORLD_FACILITY_CONTROL_ROTOR_RING_SPAN_RATIO, main.dimensions.y * MACHINE_WORLD_FACILITY_CONTROL_ROTOR_RING_HEIGHT_RATIO);
      assert.ok(rings.every((ring) => Math.abs(ring.dimensions.x - expectedRingSpan) < 1e-7));
      assert.ok(rings.every((ring) => Math.abs(ring.dimensions.y - ring.dimensions.x) < 1e-9));
      assert.ok(rings.every((ring) => Math.abs(ring.rotationY - core.rotationY) < 1e-9));
      const radial = { x: Math.cos(radialAngle), z: Math.sin(radialAngle) };
      const ringOffsets = rings.map((ring) =>
        (ring.center.x - core.center.x) * radial.x + (ring.center.z - core.center.z) * radial.z
      ).sort((a, b) => a - b);
      const offsetRatio = MACHINE_WORLD_FACILITY_CONTROL_CORE_LENGTH_RATIO * MACHINE_WORLD_FACILITY_CONTROL_ROTOR_RING_AXIS_OFFSET_RATIO;
      assert.ok(Math.abs(ringOffsets[0] / bodyMin + offsetRatio) < 1e-7);
      assert.ok(Math.abs(ringOffsets[1] / bodyMin - offsetRatio) < 1e-7);
      assert.ok(Math.abs(reveal.coreRevealWidth / bodyMin - MACHINE_WORLD_FACILITY_CORE_REVEAL_WIDTH_RATIO) < 1e-9);
      assert.ok(Math.abs(reveal.coreRevealStartRadius / bodyMin - MACHINE_WORLD_FACILITY_CORE_REVEAL_START_RADIUS_RATIO) < 1e-9);
      assert.equal(triangulateMachineWorldFacilityBodyOutline(reveal.outline).length, reveal.outline.length - 2);

      const hull = reveal.envelopeOutline;
      assert.ok(Array.isArray(hull) && hull.length >= 4);
      const c = Math.cos(main.rotationY), s = Math.sin(main.rotationY);
      const hullWorld = hull.map(([u, v]) => ({
        x: main.center.x + c * u * main.dimensions.x * 0.5 + s * v * main.dimensions.z * 0.5,
        z: main.center.z - s * u * main.dimensions.x * 0.5 + c * v * main.dimensions.z * 0.5,
      }));
      const bounds = {
        minX: Math.min(...hullWorld.map((p) => p.x)), maxX: Math.max(...hullWorld.map((p) => p.x)),
        minZ: Math.min(...hullWorld.map((p) => p.z)), maxZ: Math.max(...hullWorld.map((p) => p.z)),
      };
      for (const part of [core, ...rings, ...posts]) {
        const pc = Math.cos(part.rotationY), ps = Math.sin(part.rotationY);
        const halfX = Math.abs(pc) * part.dimensions.x * 0.5 + Math.abs(ps) * part.dimensions.z * 0.5;
        const halfZ = Math.abs(ps) * part.dimensions.x * 0.5 + Math.abs(pc) * part.dimensions.z * 0.5;
        assert.ok(part.center.x - halfX >= bounds.minX - 1e-7, part.id + ': X min outside hull');
        assert.ok(part.center.x + halfX <= bounds.maxX + 1e-7, part.id + ': X max outside hull');
        assert.ok(part.center.z - halfZ >= bounds.minZ - 1e-7, part.id + ': Z min outside hull');
        assert.ok(part.center.z + halfZ <= bounds.maxZ + 1e-7, part.id + ': Z max outside hull');
      }
      const farRingRear = ringOffsets[0] - Math.max(...rings.map((ring) => ring.dimensions.z * 0.5));
      assert.ok(farRingRear - reveal.coreRevealStartRadius > bodyMin * 0.03, 'rear ring must clear shell return');
      const coreRearMargin = -reveal.coreRevealStartRadius - core.dimensions.z * 0.5;
      assert.ok(coreRearMargin / bodyMin > 0.015, 'rotor rear cap must clear shell return');

      assert.equal(posts.length, 2);
      assert.ok(posts.every((post) => Math.abs(post.dimensions.y / expectedRingSpan - MACHINE_WORLD_FACILITY_CONTROL_STANCHION_HEIGHT_RATIO) < 1e-7));
      const coreRadius = Math.max(core.dimensions.x, core.dimensions.y) * 0.5;
      const base = shells.find((entry) => entry.branchId === MACHINE_WORLD_FACILITY_NESTED_MASSING_BRANCH && entry.layer === 'base-collar');
      assert.ok(base, 'Control rotor cradle must retain its existing base collar');
      const stanchionRingOffset = core.dimensions.z * MACHINE_WORLD_FACILITY_CONTROL_ROTOR_RING_AXIS_OFFSET_RATIO;
      const stanchionRingThickness = Math.max(0.06, main.dimensions.y * 0.055);
      const requiredAxialSpan = 2 * stanchionRingOffset + stanchionRingThickness
        + 2 * MACHINE_WORLD_FACILITY_CONTROL_STANCHION_RING_OVERLAP;
      const baseTopY = base.center.y + base.dimensions.y * 0.5;
      let postFootAreaMinimum = Infinity;
      let postBaseVerticalOverlapMinimum = Infinity;
      for (const post of posts) {
        // The long local-Z dimension now follows the shaft axis. Only local-X
        // half-width contributes to tangential core clearance; hypot(X,Z)/2
        // would incorrectly treat a bridge beam as a radially symmetric post.
        const tangentialReach = Math.hypot(post.center.x - core.center.x, post.center.z - core.center.z);
        const postTangentialHalfWidth = post.dimensions.x * 0.5;
        assert.ok(tangentialReach - postTangentialHalfWidth > coreRadius + 0.02,
          'stanchion tangential side must preserve rotor-core clearance');
        assert.ok(Math.abs(post.dimensions.x / bodyMin - MACHINE_WORLD_FACILITY_CONTROL_STANCHION_WIDTH_RATIO) < 1e-7,
          'stanchion tangential width must match its named ratio');
        assert.ok(Math.abs(post.rotationY - core.rotationY) < 1e-7,
          'stanchion shaft-axis depth must align with the axial ring normal');
        assert.ok(Math.abs(post.dimensions.z - requiredAxialSpan) < 1e-7,
          'stanchion depth must span both axial ring planes with a bounded overlap');
        const halfAxial = post.dimensions.z * 0.5;
        const postAxisOffset = (post.center.x - core.center.x) * Math.sin(core.rotationY)
          + (post.center.z - core.center.z) * Math.cos(core.rotationY);
        assert.ok(Math.abs(postAxisOffset) < 1e-7,
          'stanchion center must remain on the existing rotor shaft-axis origin');
        const postMin = postAxisOffset - halfAxial;
        const postMax = postAxisOffset + halfAxial;
        for (const ring of rings) {
          const signedOffset = (ring.center.x - core.center.x) * Math.sin(core.rotationY)
            + (ring.center.z - core.center.z) * Math.cos(core.rotationY);
          const ringMin = signedOffset - ring.dimensions.z * 0.5;
          const ringMax = signedOffset + ring.dimensions.z * 0.5;
          assert.ok(postMax - ringMax >= MACHINE_WORLD_FACILITY_CONTROL_STANCHION_RING_OVERLAP - 1e-7,
            'stanchion must extend past each axial ring outer edge by the named margin');
          assert.ok(ringMin - postMin >= MACHINE_WORLD_FACILITY_CONTROL_STANCHION_RING_OVERLAP - 1e-7,
            'stanchion must extend past each axial ring inner edge by the named margin');
          const ringInnerRadius = ring.dimensions.x * 0.5 * 0.72;
          const ringOuterRadius = ring.dimensions.x * 0.5;
          const tangentialOffset = Math.hypot(post.center.x - core.center.x, post.center.z - core.center.z);
          const tangentialHalfWidth = post.dimensions.x * 0.5;
          const annularTangentialOverlap = Math.min(tangentialOffset + tangentialHalfWidth, ringOuterRadius)
            - Math.max(tangentialOffset - tangentialHalfWidth, ringInnerRadius);
          assert.ok(annularTangentialOverlap > 0.02,
            'stanchion tangential footprint must intersect the annular ring material, got ' + annularTangentialOverlap);
          const postBottom = post.center.y - post.dimensions.y * 0.5;
          const postTop = post.center.y + post.dimensions.y * 0.5;
          assert.ok(ring.center.y - postBottom >= 0.02 && postTop - ring.center.y >= 0.02,
            'stanchion must span the ring center height at its annular contact point');
        }
        const postFootY = post.center.y - post.dimensions.y * 0.5;
        const baseOverlap = baseTopY - postFootY;
        assert.ok(baseOverlap >= MACHINE_WORLD_FACILITY_CONTROL_STANCHION_BASE_OVERLAP - 1e-7,
          'stanchion foot must overlap the base collar vertically');
        postBaseVerticalOverlapMinimum = Math.min(postBaseVerticalOverlapMinimum, baseOverlap);
        const footprintArea = intersectConvexFootprints(
          descriptorWorldFootprint(post),
          descriptorWorldFootprint(base),
        );
        assert.ok(footprintArea > 0.02,
          'stanchion must overlap the actual faceted base-collar footprint, got ' + footprintArea);
        postFootAreaMinimum = Math.min(postFootAreaMinimum, footprintArea);
      }
      assert.ok(postFootAreaMinimum > 0.02);
      assert.ok(postBaseVerticalOverlapMinimum >= MACHINE_WORLD_FACILITY_CONTROL_STANCHION_BASE_OVERLAP - 1e-7);
      const pods = scene.parts.filter((part) => part.kind === 'inner-pod');
      let minimumClearance = Infinity;
      for (const cradle of cradles) {
        const cradleRadius = Math.hypot(cradle.dimensions.x * 0.5, cradle.dimensions.z * 0.5);
        for (const pod of pods) {
          const distance = Math.hypot(cradle.center.x - pod.center.x, cradle.center.z - pod.center.z);
          const podRadius = Math.hypot(pod.dimensions.x * 0.5, pod.dimensions.z * 0.5);
          minimumClearance = Math.min(minimumClearance, distance - cradleRadius - podRadius);
        }
      }
      assert.ok(minimumClearance > 0.16, seatCount + '/' + expansionAmount + ': Pod clearance ' + minimumClearance);
      assert.equal(validateMachineWorldFacilityShellDescriptors(shells).valid, true, seatCount + '/' + expansionAmount + ': full descriptors valid');
      assert.equal(validateMachineWorldFacilityShellDescriptors([main, ...cradles]).valid, true, seatCount + '/' + expansionAmount + ': cradle descriptors valid with their required main-shell envelope');
    }
  }
});
