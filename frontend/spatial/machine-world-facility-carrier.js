/**
 * TEAM-EXPERIENCE-029 / S8
 * Presentation-only articulated carrier projection for existing outer-spine routes.
 *
 * The semantic route and its endpoints remain owned by S8 topology. This module
 * only turns the route into a staged mechanical carrier with derived hinges.
 */
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

export const MACHINE_WORLD_FACILITY_CARRIER_ID = 'MACHINE-WORLD-FACILITY-CARRIER';
export const MACHINE_WORLD_FACILITY_CARRIER_VERSION = 'S8-FACILITY-CARRIER-V3';
export const MACHINE_WORLD_FACILITY_CARRIER_HINGE_BORE_SEGMENTS = 24;
export const MACHINE_WORLD_FACILITY_CARRIER_HINGE_INNER_RADIUS_RATIO = 0.72;

const EDGE_KIND = 'outer-spine';
const STAGE_FRACTIONS = Object.freeze([0.08, 0.38, 0.72, 1]);
const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

function rootContext(semanticId = null) {
  return createSpatialConstructionContext({
    slice: 'S8',
    owner: 'frontend/spatial/machine-world-facility-carrier.js',
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function distance(a, b) {
  return Math.hypot(
    finite(b?.x) - finite(a?.x),
    finite(b?.y) - finite(a?.y),
    finite(b?.z) - finite(a?.z),
  );
}

function pointOnRoute(route, fraction) {
  const points = Array.isArray(route) ? route.filter(Boolean) : [];
  if (points.length < 2) return null;

  const lengths = [];
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const length = distance(points[index - 1], points[index]);
    lengths.push(length);
    total += length;
  }
  if (!(total > 0)) return null;

  const target = Math.max(0, Math.min(1, Number(fraction) || 0)) * total;
  let traversed = 0;
  for (let index = 1; index < points.length; index += 1) {
    const length = lengths[index - 1];
    if (target <= traversed + length || index === points.length - 1) {
      const t = length > 0 ? (target - traversed) / length : 0;
      const start = points[index - 1];
      const end = points[index];
      return Object.freeze({
        x: finite(start.x) + (finite(end.x) - finite(start.x)) * t,
        y: finite(start.y) + (finite(end.y) - finite(start.y)) * t,
        z: finite(start.z) + (finite(end.z) - finite(start.z)) * t,
      });
    }
    traversed += length;
  }
  return Object.freeze({ ...points.at(-1) });
}

function stageRadius(index) { return [0.085,0.075,0.065][Math.max(0,Math.min(2,index))]; }
function routeVertexFractions(route){const p=Array.isArray(route)?route.filter(Boolean):[];if(p.length<3)return[];const ls=[];let total=0;for(let i=1;i<p.length;i++){const d=distance(p[i-1],p[i]);ls.push(d);total+=d;}if(!(total>0))return[];const out=[];let walk=0;for(let i=1;i<p.length-1;i++){walk+=ls[i-1];out.push({index:i,fraction:walk/total});}return out;}
function carrierStations(route){const out=STAGE_FRACTIONS.map((fraction,i)=>({fraction,stageBoundaryIndex:i>0&&i<STAGE_FRACTIONS.length-1?i:null,routeVertexIndex:null}));for(const v of routeVertexFractions(route)){if(v.fraction<=STAGE_FRACTIONS[0]+1e-8||v.fraction>=STAGE_FRACTIONS.at(-1)-1e-8)continue;const same=out.find(s=>Math.abs(s.fraction-v.fraction)<=1e-8);if(same)same.routeVertexIndex=v.index;else out.push({fraction:v.fraction,stageBoundaryIndex:null,routeVertexIndex:v.index});}return out.sort((a,b)=>a.fraction-b.fraction);}
function routeDirectionAtFraction(route,fraction){const p=Array.isArray(route)?route.filter(Boolean):[];if(p.length<2)return null;const ls=[];let total=0;for(let i=1;i<p.length;i++){const d=distance(p[i-1],p[i]);ls.push(d);total+=d;}if(!(total>0))return null;const target=Math.max(0,Math.min(1,Number(fraction)||0))*total,eps=Math.max(1e-9,total*1e-9),unit=(a,b)=>{const x=finite(b?.x)-finite(a?.x),y=finite(b?.y)-finite(a?.y),z=finite(b?.z)-finite(a?.z),n=Math.hypot(x,y,z);return n>1e-9?{x:x/n,y:y/n,z:z/n}:null;};let walk=0;for(let i=1;i<p.length;i++){const vd=walk+ls[i-1];if(i<p.length-1&&Math.abs(target-vd)<=eps){const a=unit(p[i-1],p[i]),b=unit(p[i],p[i+1]);if(!a||!b)return a||b;const x=a.x+b.x,y=a.y+b.y,z=a.z+b.z,n=Math.hypot(x,y,z);return n>1e-8?{x:x/n,y:y/n,z:z/n}:b;}if(target<vd-eps||i===p.length-1)return unit(p[i-1],p[i]);walk=vd;}return unit(p.at(-2),p.at(-1));}
function carrierStageAtFraction(f){for(let i=0;i<STAGE_FRACTIONS.length-1;i++)if(f<STAGE_FRACTIONS[i+1]-1e-8)return i;return STAGE_FRACTIONS.length-2;}
function stageDescriptor(edge,index,segmentIndex,startFraction,endFraction,start,end){const dx=finite(end.x)-finite(start.x),dy=finite(end.y)-finite(start.y),dz=finite(end.z)-finite(start.z),horizontal=Math.hypot(dx,dz),length=Math.hypot(dx,dy,dz);if(length<0.06)return null;const id='FACILITY-CARRIER:'+edge.semanticEdgeId+':STAGE:'+segmentIndex;return Object.freeze({id,semanticId:edge.semanticEdgeId,shape:'BOX',profile:'facility-carrier-stage-'+index,center:Object.freeze({x:(start.x+end.x)*0.5,y:(start.y+end.y)*0.5,z:(start.z+end.z)*0.5}),dimensions:Object.freeze({x:length,y:stageRadius(index)*1.65,z:stageRadius(index)*1.80}),rotationY:Math.atan2(-dz,dx),rotationZ:Math.atan2(dy,horizontal),routeStartFraction:startFraction,routeEndFraction:endFraction,carrierSegmentIndex:segmentIndex,materialRole:'metal2',constructionSlice:'S8',constructionOwner:'frontend/spatial/machine-world-facility-carrier.js',semanticEdgeId:edge.semanticEdgeId,edgeKind:EDGE_KIND,carrierStage:index,routeContinuous:true,presentationOnly:true,...rootContext(id)});}
function hingeDescriptor(edge,stageBoundaryIndex,point,axisDirection,routeVertexIndex,routeFraction){const corner=routeVertexIndex!==null,suffix=stageBoundaryIndex!==null?String(stageBoundaryIndex):'ROUTE:'+routeVertexIndex,id='FACILITY-CARRIER:'+edge.semanticEdgeId+':HINGE:'+suffix;return Object.freeze({id,semanticId:edge.semanticEdgeId,shape:'TORUS',profile:'facility-carrier-hinge',center:Object.freeze({...point}),dimensions:Object.freeze({x:0.30,y:0.14,z:0.30}),rotationY:0,rotationZ:0,axisDirection:Object.freeze({...axisDirection}),routeFraction,routeVertexIndex,hingeKind:corner?'route-corner':'stage-boundary',materialRole:'metal2',constructionSlice:'S8',constructionOwner:'frontend/spatial/machine-world-facility-carrier.js',semanticEdgeId:edge.semanticEdgeId,edgeKind:EDGE_KIND,carrierStage:stageBoundaryIndex??carrierStageAtFraction(routeFraction),routeContinuous:true,presentationOnly:true,...rootContext(id)});}
export function deriveMachineWorldFacilityCarrierDescriptors(
  topology,
  { mode = 'WORLD_OVERVIEW' } = {},
) {
  if (mode !== 'WORLD_OVERVIEW') return Object.freeze([]);

  const descriptors = [];
  for (const edge of Array.isArray(topology?.edges) ? topology.edges : []) {
    if (
      edge?.kind !== EDGE_KIND
      || edge?.routeContinuous !== true
      || !edge?.semanticEdgeId
      || !Array.isArray(edge?.route)
      || edge.route.length < 2
    ) continue;

    const stations=carrierStations(edge.route),points=stations.map(s=>pointOnRoute(edge.route,s.fraction));if(points.some(p=>!p))continue;
    for(let i=1;i<stations.length;i++){const a=stations[i-1],b=stations[i],mid=(a.fraction+b.fraction)*0.5,d=stageDescriptor(edge,carrierStageAtFraction(mid),i-1,a.fraction,b.fraction,points[i-1],points[i]);if(d)descriptors.push(d);}
    for(let i=1;i<stations.length-1;i++){const s=stations[i];if(s.stageBoundaryIndex===null&&s.routeVertexIndex===null)continue;const axis=routeDirectionAtFraction(edge.route,s.fraction);if(axis)descriptors.push(hingeDescriptor(edge,s.stageBoundaryIndex,points[i],axis,s.routeVertexIndex,s.fraction));}
  }

  return Object.freeze(descriptors);
}

export function validateMachineWorldFacilityCarrierDescriptors(
  descriptors = [],
  { topology = null, clearance = 0.16 } = {},
) {
  const reasons = [];
  const list = Array.isArray(descriptors) ? descriptors : [];
  const routeIds = new Set(
    (Array.isArray(topology?.edges) ? topology.edges : [])
      .filter((edge) => edge?.kind === EDGE_KIND && edge?.routeContinuous === true)
      .map((edge) => edge.semanticEdgeId)
      .filter(Boolean),
  );
  const seen = new Set();

  for (const descriptor of list) {
    if (!descriptor?.id) reasons.push('MISSING_DESCRIPTOR_ID');
    if (descriptor?.id && seen.has(descriptor.id)) reasons.push('DUPLICATE_DESCRIPTOR_ID:' + descriptor.id);
    if (descriptor?.id) seen.add(descriptor.id);
    if (!routeIds.has(descriptor?.semanticEdgeId)) {
      reasons.push((descriptor?.id || 'unknown') + ':SOURCE_EDGE_NOT_FOUND');
    }
    if (descriptor?.constructionSlice !== 'S8') reasons.push((descriptor?.id || 'unknown') + ':NOT_S8');
    if (descriptor?.presentationOnly !== true) reasons.push((descriptor?.id || 'unknown') + ':NOT_PRESENTATION_ONLY');
    if (descriptor?.routeContinuous !== true) reasons.push((descriptor?.id || 'unknown') + ':ROUTE_NOT_CONTINUOUS');
    if (!descriptor?.center || ![descriptor.center.x, descriptor.center.y, descriptor.center.z].every(Number.isFinite)) {
      reasons.push((descriptor?.id || 'unknown') + ':NONFINITE_CENTER');
    }
    if (!descriptor?.dimensions || ![descriptor.dimensions.x, descriptor.dimensions.y, descriptor.dimensions.z].every(Number.isFinite)) {
      reasons.push((descriptor?.id || 'unknown') + ':NONFINITE_DIMENSIONS');
    } else {
      const crossSectionRadius = descriptor.shape === 'TORUS'
        ? Math.max(Math.abs(finite(descriptor.dimensions.x)), Math.abs(finite(descriptor.dimensions.z))) * 0.5
        : Math.hypot(
            Math.abs(finite(descriptor.dimensions.y)) * 0.5,
            Math.abs(finite(descriptor.dimensions.z)) * 0.5,
          );
      const safeClearance = Math.max(0.01, finite(clearance, 0.16));
      if (crossSectionRadius > safeClearance + 1e-9) {
        reasons.push((descriptor?.id || 'unknown') + ':CROSS_SECTION_EXCEEDS_CLEARANCE_BUDGET');
      }
    }
    if(descriptor?.shape==='BOX'&&(!Number.isFinite(descriptor.routeStartFraction)||!Number.isFinite(descriptor.routeEndFraction)||!(descriptor.routeEndFraction>descriptor.routeStartFraction)))reasons.push((descriptor?.id||'unknown')+':ROUTE_INTERVAL_INVALID');
    if(descriptor?.shape==='TORUS'){const a=descriptor.axisDirection;if(!a||![a.x,a.y,a.z].every(Number.isFinite))reasons.push((descriptor?.id||'unknown')+':HINGE_AXIS_INVALID');else if(Math.abs(Math.hypot(a.x,a.y,a.z)-1)>1e-6)reasons.push((descriptor?.id||'unknown')+':HINGE_AXIS_NOT_UNIT');if(!Number.isFinite(descriptor.routeFraction)||descriptor.routeFraction<0||descriptor.routeFraction>1)reasons.push((descriptor?.id||'unknown')+':HINGE_ROUTE_FRACTION_INVALID');const bore=Math.min(Math.abs(finite(descriptor.dimensions?.x)),Math.abs(finite(descriptor.dimensions?.z)))*0.5*MACHINE_WORLD_FACILITY_CARRIER_HINGE_INNER_RADIUS_RATIO*Math.cos(Math.PI/MACHINE_WORLD_FACILITY_CARRIER_HINGE_BORE_SEGMENTS);const adjacent=list.filter(c=>c?.shape==='BOX'&&c.semanticEdgeId===descriptor.semanticEdgeId&&(Math.abs(finite(c.routeStartFraction,-2)-finite(descriptor.routeFraction,-1))<=1e-8||Math.abs(finite(c.routeEndFraction,-2)-finite(descriptor.routeFraction,-1))<=1e-8));if(!adjacent.length)reasons.push((descriptor?.id||'unknown')+':HINGE_STAGE_INCIDENCE_MISSING');for(const s of adjacent){const envelope=Math.hypot(Math.abs(finite(s.dimensions?.y))*0.5,Math.abs(finite(s.dimensions?.z))*0.5);if(envelope>bore+1e-9)reasons.push((descriptor?.id||'unknown')+':HINGE_BORE_CLEARANCE_INSUFFICIENT:'+s.id);}}
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    descriptorCount: list.length,
  });
}
