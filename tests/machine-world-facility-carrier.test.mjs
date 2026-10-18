import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { buildMachineWorldTopology } from '../frontend/spatial/machine-world-topology.js';
import {
  deriveMachineWorldFacilityCarrierDescriptors,
  validateMachineWorldFacilityCarrierDescriptors,
  MACHINE_WORLD_FACILITY_CARRIER_VERSION,
  MACHINE_WORLD_FACILITY_CARRIER_HINGE_BORE_SEGMENTS,
  MACHINE_WORLD_FACILITY_CARRIER_HINGE_INNER_RADIUS_RATIO,
} from '../frontend/spatial/machine-world-facility-carrier.js';

function topologyFor(seatCount = 10, expansionAmount = 0) {
  const scene = createBranchConnectionCore({ seatCount, expansionAmount });
  return buildMachineWorldTopology({ scene, clearance: 0.16 });
}

const CARRIER_STAGE_FRACTIONS=[0.08,0.38,0.72,1];
function carrierPointOnRoute(route,f){const p=Array.isArray(route)?route.filter(Boolean):[];if(p.length<2)return null;const ds=[];let total=0;for(let i=1;i<p.length;i++){const d=Math.hypot(p[i].x-p[i-1].x,p[i].y-p[i-1].y,p[i].z-p[i-1].z);ds.push(d);total+=d;}if(!(total>0))return null;const t=Math.max(0,Math.min(1,f))*total;let w=0;for(let i=1;i<p.length;i++){const d=ds[i-1];if(t<=w+d||i===p.length-1){const u=d?(t-w)/d:0;return{x:p[i-1].x+(p[i].x-p[i-1].x)*u,y:p[i-1].y+(p[i].y-p[i-1].y)*u,z:p[i-1].z+(p[i].z-p[i-1].z)*u};}w+=d;}return{...p.at(-1)};}
function routeVertexFractions(route){const p=Array.isArray(route)?route.filter(Boolean):[];if(p.length<3)return[];let total=0,walk=0;const ds=[];for(let i=1;i<p.length;i++){const d=Math.hypot(p[i].x-p[i-1].x,p[i].y-p[i-1].y,p[i].z-p[i-1].z);ds.push(d);total+=d;}if(!(total>0))return[];const out=[];for(let i=1;i<p.length-1;i++){walk+=ds[i-1];out.push({index:i,fraction:walk/total});}return out;}
function routeTangentAtFraction(route,f){const p=Array.isArray(route)?route.filter(Boolean):[];if(p.length<2)return null;let total=0,walk=0;const ds=[];for(let i=1;i<p.length;i++){const d=Math.hypot(p[i].x-p[i-1].x,p[i].y-p[i-1].y,p[i].z-p[i-1].z);ds.push(d);total+=d;}if(!(total>0))return null;const t=Math.max(0,Math.min(1,f))*total,eps=Math.max(1e-9,total*1e-9),unit=(a,b)=>{const v={x:b.x-a.x,y:b.y-a.y,z:b.z-a.z},l=Math.hypot(v.x,v.y,v.z);return l>1e-9?{x:v.x/l,y:v.y/l,z:v.z/l}:null;};for(let i=1;i<p.length;i++){const end=walk+ds[i-1];if(i<p.length-1&&Math.abs(t-end)<=eps){const a=unit(p[i-1],p[i]),b=unit(p[i],p[i+1]);if(!a||!b)return a||b;const v={x:a.x+b.x,y:a.y+b.y,z:a.z+b.z},l=Math.hypot(v.x,v.y,v.z);return l>1e-8?{x:v.x/l,y:v.y/l,z:v.z/l}:b;}if(t<end-eps||i===p.length-1)return unit(p[i-1],p[i]);walk=end;}return unit(p.at(-2),p.at(-1));}
function carrierBandAtFraction(f){for(let i=0;i<CARRIER_STAGE_FRACTIONS.length-1;i++)if(f<CARRIER_STAGE_FRACTIONS[i+1]-1e-8)return i;return CARRIER_STAGE_FRACTIONS.length-2;}
function angularDistance(a,b){return Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));}

test('S8 facility carrier derives staged mechanical presentation from outer-spine routes', () => {
  const topology = topologyFor(10);
  const descriptors = deriveMachineWorldFacilityCarrierDescriptors(topology);
  assert.equal(descriptors.filter((entry) => entry.shape === 'BOX').length, 16);
  assert.equal(descriptors.filter((entry) => entry.shape === 'TORUS').length, 12);
  assert.equal(MACHINE_WORLD_FACILITY_CARRIER_VERSION, 'S8-FACILITY-CARRIER-V3');
  assert.equal(MACHINE_WORLD_FACILITY_CARRIER_HINGE_BORE_SEGMENTS, 24);
  assert.equal(MACHINE_WORLD_FACILITY_CARRIER_HINGE_INNER_RADIUS_RATIO, 0.72);
  assert.equal(new Set(descriptors.map((entry) => entry.semanticEdgeId)).size, 4);
  assert.ok(descriptors.every((entry) => entry.edgeKind === 'outer-spine'));
  assert.ok(descriptors.every((entry) => entry.routeContinuous === true));
  const validation = validateMachineWorldFacilityCarrierDescriptors(descriptors, { topology });
  assert.equal(validation.valid, true, validation.reasons.join(', '));
});

test('S8 carrier follows 3D route legs and preserves all endpoints across 30 states',()=>{
 let states=0,stageCount=0,hingeCount=0,cornerCount=0,diagonal=0,mixed=0,maxError=0;
 for(let seats=1;seats<=10;seats++)for(const expansion of [0,0.5,1]){
  const topology=topologyFor(seats,expansion),ds=deriveMachineWorldFacilityCarrierDescriptors(topology),stages=ds.filter(d=>d.shape==='BOX'),hinges=ds.filter(d=>d.shape==='TORUS'),edges=new Map(topology.edges.filter(e=>e.kind==='outer-spine'&&e.routeContinuous===true).map(e=>[e.semanticEdgeId,e]));
  assert.equal(stages.length,16);assert.equal(hinges.length,12);
  for(const s of stages){const e=edges.get(s.semanticEdgeId),a=carrierPointOnRoute(e.route,s.routeStartFraction),b=carrierPointOnRoute(e.route,s.routeEndFraction);assert.ok(e&&a&&b);const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,h=Math.hypot(dx,dz),len=Math.hypot(dx,dy,dz),mid=(s.routeStartFraction+s.routeEndFraction)/2;assert.ok(len>0.06);assert.ok(s.routeEndFraction>s.routeStartFraction);assert.equal(s.carrierStage,carrierBandAtFraction(mid));assert.ok(Math.abs(s.dimensions.x-len)<1e-8);assert.equal(routeVertexFractions(e.route).filter(v=>v.fraction>s.routeStartFraction+1e-8&&v.fraction<s.routeEndFraction-1e-8).length,0,'cross-bend stage '+s.id);assert.ok(Math.hypot(s.center.x-(a.x+b.x)/2,s.center.y-(a.y+b.y)/2,s.center.z-(a.z+b.z)/2)<1e-8);const yaw=Math.atan2(-dz,dx),pitch=Math.atan2(dy,h);assert.ok(angularDistance(s.rotationY,yaw)<1e-8);assert.ok(Math.abs(s.rotationZ-pitch)<1e-8);const u={x:Math.cos(yaw)*Math.cos(pitch),y:Math.sin(pitch),z:-Math.sin(yaw)*Math.cos(pitch)},v={x:dx/len,y:dy/len,z:dz/len},error=Math.hypot(u.x-v.x,u.y-v.y,u.z-v.z);maxError=Math.max(maxError,error);assert.ok(error<1e-8);for(const [sg,p] of [[-1,a],[1,b]]){const q={x:s.center.x+sg*u.x*s.dimensions.x/2,y:s.center.y+sg*u.y*s.dimensions.x/2,z:s.center.z+sg*u.z*s.dimensions.x/2};assert.ok(Math.hypot(q.x-p.x,q.y-p.y,q.z-p.z)<1e-7);}if(Math.abs(dx)>1e-8&&Math.abs(dz)>1e-8)diagonal++;if(Math.abs(dy)>1e-8&&h>1e-8)mixed++;stageCount++;}
  for(const e of edges.values()){const chain=stages.filter(s=>s.semanticEdgeId===e.semanticEdgeId).sort((a,b)=>a.routeStartFraction-b.routeStartFraction);assert.equal(chain.length,4);assert.ok(Math.abs(chain[0].routeStartFraction-0.08)<1e-8);assert.ok(Math.abs(chain.at(-1).routeEndFraction-1)<1e-8);for(let i=1;i<chain.length;i++){assert.ok(Math.abs(chain[i-1].routeEndFraction-chain[i].routeStartFraction)<1e-8);const a=carrierPointOnRoute(e.route,chain[i-1].routeEndFraction),b=carrierPointOnRoute(e.route,chain[i].routeStartFraction);assert.ok(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<1e-8);}}
  for(const j of hinges){const e=edges.get(j.semanticEdgeId),a=routeTangentAtFraction(e.route,j.routeFraction),b=j.axisDirection;assert.ok(a&&b);assert.ok(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<1e-8);assert.equal(j.hingeKind,j.routeVertexIndex===null?'stage-boundary':'route-corner');if(j.hingeKind==='route-corner')cornerCount++;hingeCount++;}states++;
 }
 assert.equal(states,30);assert.equal(stageCount,480);assert.equal(hingeCount,360);assert.equal(cornerCount,120);assert.ok(diagonal>300);assert.ok(mixed>150);assert.ok(maxError<1e-8);
});
test('S8 facility carrier is world-only and cannot leak into focus scopes', () => {
  const topology = topologyFor(10);
  assert.equal(
    deriveMachineWorldFacilityCarrierDescriptors(topology, { mode: 'DIVISION_FOCUS' }).length,
    0,
  );
  assert.equal(
    deriveMachineWorldFacilityCarrierDescriptors(topology, { mode: 'FACILITY_FOCUS' }).length,
    0,
  );
});

test('S8 carrier hinges clear the polygon bore and fail closed on enlarged beams',()=>{
 const topology=topologyFor(10,1),ds=deriveMachineWorldFacilityCarrierDescriptors(topology),hinges=ds.filter(d=>d.shape==='TORUS'),stages=ds.filter(d=>d.shape==='BOX'),apothem=j=>Math.min(j.dimensions.x,j.dimensions.z)*0.5*MACHINE_WORLD_FACILITY_CARRIER_HINGE_INNER_RADIUS_RATIO*Math.cos(Math.PI/MACHINE_WORLD_FACILITY_CARRIER_HINGE_BORE_SEGMENTS);
 assert.ok(hinges.length>0);for(const j of hinges){const near=stages.filter(s=>s.semanticEdgeId===j.semanticEdgeId&&(Math.abs(s.routeStartFraction-j.routeFraction)<1e-8||Math.abs(s.routeEndFraction-j.routeFraction)<1e-8));assert.equal(near.length,2);for(const s of near)assert.ok(Math.hypot(s.dimensions.y/2,s.dimensions.z/2)<apothem(j));}
 const enlarged=ds.map(d=>d.shape!=='BOX'?d:Object.freeze({...d,dimensions:Object.freeze({...d.dimensions,y:d.dimensions.y*1.1,z:d.dimensions.z*1.1})})),result=validateMachineWorldFacilityCarrierDescriptors(enlarged,{topology,clearance:0.16});assert.equal(result.valid,false);assert.ok(result.reasons.some(r=>r.includes(':HINGE_BORE_CLEARANCE_INSUFFICIENT:')));
});

test('S8 facility carrier source and browser copies remain exact', () => {
  const source = readFileSync('frontend/spatial/machine-world-facility-carrier.js', 'utf8');
  const browser = readFileSync('public/machine-world-facility-carrier.js', 'utf8');
  assert.equal(browser, source);
  const renderer = readFileSync('frontend/spatial/machine-world-renderer.js', 'utf8');
  const publicRenderer = readFileSync('public/machine-world-renderer.js', 'utf8');
  const manifest = readFileSync('scripts/machine-spatial-runtime-manifest.mjs', 'utf8');
  assert.equal(publicRenderer, renderer);
  assert.match(renderer, /renderMachineWorldFacilityCarrier/);
  assert.match(renderer, /segmentTubeRotationMatrix\(/);
  assert.match(renderer, /entry\.axisDirection/);
  assert.match(renderer, /MACHINE_WORLD_FACILITY_CARRIER_HINGE_BORE_SEGMENTS/);
  assert.match(renderer, /innerRadius: MACHINE_WORLD_FACILITY_CARRIER_HINGE_INNER_RADIUS_RATIO/);
  assert.match(renderer, /machineWorldFacilityCarrierRendered/);
  assert.match(manifest, /machine-world-facility-carrier\.js/);
});


test('S8 outer-spine carrier cross-sections stay inside the governed clearance budget', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 0.5, 1]) {
      const topology = topologyFor(seatCount, expansionAmount);
      const descriptors = deriveMachineWorldFacilityCarrierDescriptors(topology);
      const validation = validateMachineWorldFacilityCarrierDescriptors(
        descriptors,
        { topology, clearance: 0.16 },
      );
      assert.equal(validation.valid, true, validation.reasons.join(', '));

      const outerSpines = topology.edges.filter((edge) =>
        edge.kind === 'outer-spine' && edge.routeContinuous === true,
      );
      assert.equal(outerSpines.length, 4);

      for (const descriptor of descriptors) {
        const sourceEdge = outerSpines.find((edge) =>
          edge.semanticEdgeId === descriptor.semanticEdgeId,
        );
        assert.ok(sourceEdge, descriptor.id);
        assert.equal(descriptor.routeContinuous, true);
        const crossSectionRadius = descriptor.shape === 'TORUS'
          ? Math.max(descriptor.dimensions.x, descriptor.dimensions.z) * 0.5
          : Math.hypot(descriptor.dimensions.y * 0.5, descriptor.dimensions.z * 0.5);
        assert.ok(
          crossSectionRadius <= 0.16 + 1e-9,
          descriptor.id + ': cross-section must respect route clearance',
        );
      }
    }
  }
});


test('structural preview consumes the canonical carrier projection and keeps source/public parity', () => {
  const sourcePreview = readFileSync(
    'frontend/spatial/machine-structural-embodiment-preview.js',
    'utf8',
  );
  const publicPreview = readFileSync(
    'public/machine-structural-embodiment-preview.js',
    'utf8',
  );
  assert.equal(publicPreview, sourcePreview);
  assert.match(sourcePreview, /deriveMachineWorldFacilityCarrierDescriptors\(/);
  assert.match(sourcePreview, /validateMachineWorldFacilityCarrierDescriptors\(/);
  assert.doesNotMatch(sourcePreview, /const facilityCarrierDescriptors\s*=\s*\[\s*\]/);
});
