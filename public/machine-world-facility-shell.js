/**
 * TEAM-EXPERIENCE-029 / S7
 * Presentation-only body shells for the four authored outer modules.
 *
 * The authoritative outer-housing center, dimensions, silhouette, and interface
 * remain owned by S7/S8. This module only gives the existing housing a coherent
 * visible body in the structural World preview.
 */
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

export const MACHINE_WORLD_FACILITY_SHELL_ID = 'MACHINE-WORLD-FACILITY-SHELL';
export const MACHINE_WORLD_FACILITY_SHELL_VERSION = 'S7-OUTER-BODY-V4';
export const MACHINE_WORLD_FACILITY_SERVICE_BAY_PROFILE = 'analysis-telescope-open-bay';
export const MACHINE_WORLD_FACILITY_SERVICE_BAY_WIDTH = 0.68;
export const MACHINE_WORLD_FACILITY_SERVICE_BAY_START_RADIUS = -0.20;

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const BODY_SCALE = 1.22;

// Authored faceted silhouettes keep the existing S7 housing envelope while
// replacing the legacy box-like presentation with manufactured machine bodies.
// The normalized outlines are intentionally asymmetric/chamfered and are
// consumed by the Three.js adapter as presentation geometry only.
export const MACHINE_WORLD_FACILITY_BODY_OUTLINES = Object.freeze({
  fin: Object.freeze([
    [-0.82, -0.52], [-0.42, -0.90], [0.34, -0.82], [0.90, -0.34],
    [0.76, 0.36], [0.30, 0.88], [-0.40, 0.72], [-0.86, 0.18],
  ]),
  arc: Object.freeze([
    [-0.84, -0.36], [-0.56, -0.76], [0.08, -0.94], [0.72, -0.62],
    [0.90, -0.02], [0.66, 0.66], [0.10, 0.90], [-0.66, 0.64],
  ]),
  diamond: Object.freeze([
    [-0.06, -1.00], [0.62, -0.68], [1.00, -0.05], [0.66, 0.60],
    [0.10, 1.00], [-0.62, 0.66], [-1.00, 0.02], [-0.66, -0.64],
  ]),
  blade: Object.freeze([
    [-0.82, -0.70], [-0.18, -0.92], [0.50, -0.76], [0.92, -0.28],
    [0.72, 0.22], [0.30, 0.92], [-0.48, 0.74], [-0.90, 0.12],
  ]),
});


export function getMachineWorldFacilityBodyOutline(silhouette) {
  return MACHINE_WORLD_FACILITY_BODY_OUTLINES[String(silhouette || '')] || null;
}

const GEOMETRY_EPSILON = 1e-9;
function signedTwiceArea(outline) {
  return outline.reduce((area,point,index)=>{const next=outline[(index+1)%outline.length];return area+point[0]*next[1]-next[0]*point[1];},0);
}
function cross2(a,b,c){return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);}
function pointOnSegment2D(p,a,b,eps=GEOMETRY_EPSILON){
  return Math.abs(cross2(a,b,p))<=eps&&p[0]>=Math.min(a[0],b[0])-eps&&p[0]<=Math.max(a[0],b[0])+eps
    &&p[1]>=Math.min(a[1],b[1])-eps&&p[1]<=Math.max(a[1],b[1])+eps;
}
function segmentsIntersect2D(a,b,c,d,eps=GEOMETRY_EPSILON){
  const p=cross2(a,b,c),q=cross2(a,b,d),r=cross2(c,d,a),s=cross2(c,d,b);
  if(((p>eps&&q< -eps)||(p< -eps&&q>eps))&&((r>eps&&s< -eps)||(r< -eps&&s>eps)))return true;
  return (Math.abs(p)<=eps&&pointOnSegment2D(c,a,b,eps))||(Math.abs(q)<=eps&&pointOnSegment2D(d,a,b,eps))
    ||(Math.abs(r)<=eps&&pointOnSegment2D(a,c,d,eps))||(Math.abs(s)<=eps&&pointOnSegment2D(b,c,d,eps));
}
function isSimplePolygon2D(points){
  const n=points.length;if(n<3)return false;
  for(let i=0;i<n;i+=1){
    const a=points[i],b=points[(i+1)%n];
    if(Math.hypot(b[0]-a[0],b[1]-a[1])<=GEOMETRY_EPSILON)return false;
    for(let j=i+1;j<n;j+=1){
      if(j===(i+1)%n||i===(j+1)%n)continue;
      if(segmentsIntersect2D(a,b,points[j],points[(j+1)%n]))return false;
    }
  }
  return true;
}
function pointInsideOrOnPolygon(point,outline){
  let inside=false;
  for(let i=0,j=outline.length-1;i<outline.length;j=i,i+=1){
    const a=outline[j],b=outline[i];
    if(pointOnSegment2D(point,a,b,1e-7))return true;
    if((a[1]>point[1])!==(b[1]>point[1])){
      const x=((b[0]-a[0])*(point[1]-a[1]))/(b[1]-a[1])+a[0];
      if(point[0]<x)inside=!inside;
    }
  }
  return inside;
}
const modulo=(value,divisor)=>((value%divisor)+divisor)%divisor;

/** Ear-clips a simple outline and preserves its input winding. */
export function triangulateMachineWorldFacilityBodyOutline(outline=[]){
  const points=Array.isArray(outline)?outline.map(p=>[Number(p?.[0]),Number(p?.[1])]):[];
  if(points.length<3||points.some(p=>!p.every(Number.isFinite)))throw new Error('FACILITY_BODY_OUTLINE_INVALID_POINTS');
  const area=signedTwiceArea(points);
  if(Math.abs(area)<=GEOMETRY_EPSILON)throw new Error('FACILITY_BODY_OUTLINE_ZERO_AREA');
  if(!isSimplePolygon2D(points))throw new Error('FACILITY_BODY_OUTLINE_NOT_SIMPLE');
  const winding=area>0?1:-1,active=Array.from({length:points.length},(_,i)=>i),triangles=[];
  const insideTriangle=(p,a,b,c)=>cross2(a,b,p)*winding>=-GEOMETRY_EPSILON
    &&cross2(b,c,p)*winding>=-GEOMETRY_EPSILON&&cross2(c,a,p)*winding>=-GEOMETRY_EPSILON;
  let guard=points.length*points.length;
  while(active.length>3&&guard>0){
    guard-=1;let clipped=false;
    for(let k=0;k<active.length;k+=1){
      const pi=active[(k-1+active.length)%active.length],ci=active[k],ni=active[(k+1)%active.length];
      const a=points[pi],b=points[ci],c=points[ni];
      if(cross2(a,b,c)*winding<=GEOMETRY_EPSILON)continue;
      let occupied=false;
      for(const candidate of active){
        if(candidate===pi||candidate===ci||candidate===ni)continue;
        if(insideTriangle(points[candidate],a,b,c)){occupied=true;break;}
      }
      if(occupied)continue;
      triangles.push(Object.freeze([pi,ci,ni]));active.splice(k,1);clipped=true;break;
    }
    if(clipped)continue;
    const collinear=active.findIndex((ci,k)=>Math.abs(cross2(
      points[active[(k-1+active.length)%active.length]],points[ci],points[active[(k+1)%active.length]],
    ))<=GEOMETRY_EPSILON);
    if(collinear<0)throw new Error('FACILITY_BODY_OUTLINE_TRIANGULATION_FAILED');
    active.splice(collinear,1);
  }
  if(active.length!==3||cross2(points[active[0]],points[active[1]],points[active[2]])*winding<=GEOMETRY_EPSILON){
    throw new Error('FACILITY_BODY_OUTLINE_TRIANGULATION_DEGENERATE');
  }
  triangles.push(Object.freeze([...active]));
  return Object.freeze(triangles);
}

/** Cuts a radial service bay while retaining the authored hull as a separate envelope. */
export function deriveMachineWorldFacilityServiceBayOutline({
  outline,dimensions,housingAngle=0,rotationY=0,layerOffset=0,
  bayWidth=MACHINE_WORLD_FACILITY_SERVICE_BAY_WIDTH,bayStartRadius=MACHINE_WORLD_FACILITY_SERVICE_BAY_START_RADIUS,
}={}){
  const source=Array.isArray(outline)?outline.map(p=>[Number(p?.[0]),Number(p?.[1])]):[];
  if(source.length<3||source.some(p=>!p.every(Number.isFinite)))throw new Error('FACILITY_SERVICE_BAY_SOURCE_INVALID');
  const area=signedTwiceArea(source);
  if(area<=GEOMETRY_EPSILON||!isSimplePolygon2D(source))throw new Error('FACILITY_SERVICE_BAY_REQUIRES_CCW_SIMPLE_ENVELOPE');
  const width=Number(bayWidth),start=Number(bayStartRadius),dimX=Number(dimensions?.x),dimZ=Number(dimensions?.z);
  if(!(width>0)||!Number.isFinite(start)||!(dimX>0)||!(dimZ>0)
    ||![dimX,dimZ,housingAngle,rotationY,layerOffset].every(v=>Number.isFinite(Number(v)))){
    throw new Error('FACILITY_SERVICE_BAY_INVALID_PARAMETERS');
  }
  const minX=Math.min(...source.map(p=>p[0])),maxX=Math.max(...source.map(p=>p[0]));
  const minZ=Math.min(...source.map(p=>p[1])),maxZ=Math.max(...source.map(p=>p[1]));
  const cx=(minX+maxX)*0.5,cz=(minZ+maxZ)*0.5;
  const sx=dimX/Math.max(GEOMETRY_EPSILON,maxX-minX),sz=dimZ/Math.max(GEOMETRY_EPSILON,maxZ-minZ);
  const physical=source.map(([x,z])=>[(x-cx)*sx,(z-cz)*sz]);
  // The inverse of the scene's rotation maps the world radial axis to housingAngle + rotationY.
  const angle=Number(housingAngle)+Number(rotationY),u=[Math.cos(angle),Math.sin(angle)],v=[-u[1],u[0]];
  const r=start-Number(layerOffset),origin=[u[0]*r,u[1]*r],target=origin[0]*v[0]+origin[1]*v[1];
  const intersections=(projection)=>{
    const found=[];
    const add=(point,param)=>{
      if(!found.some(old=>Math.hypot(old.point[0]-point[0],old.point[1]-point[1])<=1e-7)){
        found.push({point,parameter:modulo(param,physical.length)});
      }
    };
    for(let i=0;i<physical.length;i+=1){
      const a=physical[i],b=physical[(i+1)%physical.length],pa=a[0]*v[0]+a[1]*v[1],pb=b[0]*v[0]+b[1]*v[1],delta=pb-pa;
      if(Math.abs(delta)<=1e-10){
        if(Math.abs(projection-pa)<=1e-7){add([...a],i);add([...b],i+1);}
        continue;
      }
      const raw=(projection-pa)/delta;
      if(raw< -1e-9||raw>1+1e-9)continue;
      const t=Math.max(0,Math.min(1,raw));
      add([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],i+t);
    }
    return found;
  };
  const minus=intersections(target-width*0.5),plus=intersections(target+width*0.5);
  if(!minus.length||!plus.length)throw new Error('FACILITY_SERVICE_BAY_DOES_NOT_CROSS_ENVELOPE');
  const outward=items=>items.reduce((best,item)=>item.point[0]*u[0]+item.point[1]*u[1]>best.point[0]*u[0]+best.point[1]*u[1]?item:best);
  let a=outward(minus),b=outward(plus),interval=modulo(b.parameter-a.parameter,physical.length);
  if(Math.abs(interval-physical.length*0.5)<=1e-7)throw new Error('FACILITY_SERVICE_BAY_MOUTH_AMBIGUOUS');
  if(interval>physical.length*0.5)[a,b]=[b,a];
  const longArc=modulo(a.parameter-b.parameter,physical.length);
  const inner=mouth=>{const side=mouth.point[0]*v[0]+mouth.point[1]*v[1]-target;return [origin[0]+v[0]*side,origin[1]+v[1]*side];};
  const innerA=inner(a),innerB=inner(b);
  if(!pointInsideOrOnPolygon(innerA,physical)||!pointInsideOrOnPolygon(innerB,physical))throw new Error('FACILITY_SERVICE_BAY_BACK_EDGE_ESCAPES_ENVELOPE');
  const arc=[];
  for(let i=0;i<physical.length;i+=1){
    const d=modulo(i-b.parameter,physical.length);
    if(d>1e-7&&d<longArc-1e-7)arc.push({d,point:physical[i]});
  }
  arc.sort((x,y)=>x.d-y.d);
  const result=[a.point,innerA,innerB,b.point,...arc.map(v=>v.point)].map(([x,z])=>[x/sx+cx,z/sz+cz]);
  const resultArea=signedTwiceArea(result);
  if(resultArea<=GEOMETRY_EPSILON||resultArea>=area-1e-7||!isSimplePolygon2D(result))throw new Error('FACILITY_SERVICE_BAY_RESULT_INVALID');
  triangulateMachineWorldFacilityBodyOutline(result);
  return Object.freeze(result.map(p=>Object.freeze(p)));
}

const scale = (value, factor, minimum = 0.06) =>
  Math.max(minimum, finite(value, minimum) * factor);

function rootContext(semanticId = null) {
  return createSpatialConstructionContext({
    slice: 'S7',
    owner: 'frontend/spatial/machine-world-facility-shell.js',
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function deriveShell(entry) {
  const housing = entry?.outerHousing;
  if (!housing?.center || !housing?.dimensions || !entry?.branchId) return [];

  const angle = Math.atan2(
    finite(housing.center.z),
    finite(housing.center.x),
  );
  const silhouetteByMachineRole = {
    analysis: 'fin',
    operations: 'arc',
    control: 'diamond',
    'access-commerce': 'blade',
  };
  const silhouette = String(entry.silhouette || housing.silhouette || silhouetteByMachineRole[entry.machineRole] || 'arc');

  const profiles = {
    fin: {
      shape: 'BOX',
      dimensions: {
        x: scale(housing.dimensions.x, 1.08 * BODY_SCALE),
        y: scale(housing.dimensions.y, 1.12 * BODY_SCALE),
        z: scale(housing.dimensions.z, 1.14 * BODY_SCALE),
      },
      rotationY: angle,
    },
    arc: {
      shape: 'CYLINDER',
      dimensions: {
        x: scale(housing.dimensions.x, 1.06 * BODY_SCALE),
        y: scale(housing.dimensions.y, 1.10 * BODY_SCALE),
        z: scale(housing.dimensions.x, 1.06 * BODY_SCALE),
      },
      rotationY: 0,
    },
    diamond: {
      shape: 'BOX',
      dimensions: {
        x: scale(housing.dimensions.x, 1.04 * BODY_SCALE),
        y: scale(housing.dimensions.y, 1.10 * BODY_SCALE),
        z: scale(housing.dimensions.z, 1.04 * BODY_SCALE),
      },
      rotationY: angle + Math.PI * 0.25,
    },
    blade: {
      shape: 'BOX',
      dimensions: {
        x: scale(housing.dimensions.x, 1.10 * BODY_SCALE),
        y: scale(housing.dimensions.y, 1.14 * BODY_SCALE),
        z: scale(housing.dimensions.z, 1.06 * BODY_SCALE),
      },
      rotationY: angle,
    },
  }[silhouette] || null;

  if (!profiles) return [];

  const body = {
    id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId + ':MAIN',
    semanticId: entry.branchId,
    role: 'facility-body-shell',
    shape: 'FACILITY_FACETED_BODY',
    profile: 'facility-body-' + silhouette,
    center: Object.freeze({ ...housing.center }),
    depthOffset: 0,
    dimensions: Object.freeze(profiles.dimensions),
    rotationY: finite(profiles.rotationY),
    materialRole: 'metal2',
    outline: MACHINE_WORLD_FACILITY_BODY_OUTLINES[silhouette],
    constructionSlice: 'S7',
    constructionOwner: 'frontend/spatial/machine-world-facility-shell.js',
    branchId: entry.branchId,
    silhouette,
    layer: 'main-shell',
    presentationOnly: true,
    ...rootContext('FACILITY-BODY:' + entry.branchId + ':MAIN'),
  };

  const bodyWidth = Number(body.dimensions.x);
  const bodyDepth = Number(body.dimensions.z);
  const bodyHeight = Number(body.dimensions.y);
  const bodyMin = Math.min(bodyWidth, bodyDepth);
  const radial = { x: Math.cos(angle), z: Math.sin(angle) };
  const depthOffset = (fraction) => bodyMin * fraction;

  const layered = [
    body,
    Object.freeze({
      ...body,
      id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId + ':BASE',
      profile: 'facility-body-' + silhouette + '-base',
      center: Object.freeze({
        x: housing.center.x - radial.x * depthOffset(0.08),
        y: housing.center.y - bodyHeight * 0.39,
        z: housing.center.z - radial.z * depthOffset(0.08),
      }),
      depthOffset: -depthOffset(0.08),
      dimensions: Object.freeze({
        x: bodyWidth * 0.78,
        y: Math.max(0.08, bodyHeight * 0.12),
        z: bodyDepth * 0.78,
      }),
      layer: 'base-collar',
      materialRole: 'metal',
      outline: MACHINE_WORLD_FACILITY_BODY_OUTLINES[silhouette],
      ...rootContext('FACILITY-BODY:' + entry.branchId + ':BASE'),
    }),
    Object.freeze({
      ...body,
      id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId + ':SHOULDER',
      profile: 'facility-body-' + silhouette + '-shoulder',
      center: Object.freeze({
        x: housing.center.x + radial.x * depthOffset(0.04),
        y: housing.center.y + bodyHeight * 0.29,
        z: housing.center.z + radial.z * depthOffset(0.04),
      }),
      depthOffset: depthOffset(0.04),
      dimensions: Object.freeze({
        x: bodyWidth * (entry.machineRole === 'analysis' ? 0.92 : 0.84),
        y: Math.max(0.08, bodyHeight * 0.13),
        z: bodyDepth * (entry.machineRole === 'analysis' ? 0.92 : 0.84),
      }),
      layer: 'shoulder-plate',
      materialRole: 'metal2',
      outline: MACHINE_WORLD_FACILITY_BODY_OUTLINES[silhouette],
      ...rootContext('FACILITY-BODY:' + entry.branchId + ':SHOULDER'),
    }),
    Object.freeze({
      ...body,
      id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId + ':CAP',
      profile: 'facility-body-' + silhouette + '-cap',
      center: Object.freeze({
        x: housing.center.x + radial.x * depthOffset(0.09),
        y: housing.center.y + bodyHeight * 0.41,
        z: housing.center.z + radial.z * depthOffset(0.09),
      }),
      depthOffset: depthOffset(0.09),
      dimensions: Object.freeze({
        x: bodyWidth * 0.58,
        y: Math.max(0.08, bodyHeight * 0.08),
        z: bodyDepth * 0.58,
      }),
      rotationY: 0,
      layer: 'upper-cap',
      materialRole: 'glass',
      outline: MACHINE_WORLD_FACILITY_BODY_OUTLINES[silhouette],
      ...rootContext('FACILITY-BODY:' + entry.branchId + ':CAP'),
    }),
  ];

  const coreProfiles = {
    analysis: {
      center: Object.freeze({
        x: housing.center.x + Math.cos(angle) * bodyMin * 0.12,
        y: housing.center.y + bodyHeight * 0.06,
        z: housing.center.z + Math.sin(angle) * bodyMin * 0.12,
      }),
      dimensions: Object.freeze({
        x: bodyMin * 0.34,
        y: Math.max(0.10, bodyHeight * 0.34),
        z: bodyMin * 0.34,
      }),
      shape: 'CYLINDER',
      materialRole: 'glass',
      rotationY: angle,
    },
    operations: {
      center: Object.freeze({
        x: housing.center.x,
        y: housing.center.y + bodyHeight * 0.08,
        z: housing.center.z,
      }),
      dimensions: Object.freeze({
        x: bodyMin * 0.32,
        y: Math.max(0.10, bodyHeight * 0.42),
        z: bodyMin * 0.20,
      }),
      shape: 'BOX',
      materialRole: 'metal2',
      rotationY: angle,
    },
    control: {
      center: Object.freeze({
        x: housing.center.x,
        y: housing.center.y + bodyHeight * 0.06,
        z: housing.center.z,
      }),
      dimensions: Object.freeze({
        x: bodyMin * 0.40,
        y: Math.max(0.10, bodyHeight * 0.30),
        z: bodyMin * 0.40,
      }),
      shape: 'CYLINDER',
      materialRole: 'energy',
      rotationY: 0,
    },
    'access-commerce': {
      center: Object.freeze({
        x: housing.center.x + Math.cos(angle) * bodyMin * 0.08,
        y: housing.center.y + bodyHeight * 0.17,
        z: housing.center.z + Math.sin(angle) * bodyMin * 0.08,
      }),
      dimensions: Object.freeze({
        x: bodyMin * 0.20,
        y: Math.max(0.10, bodyHeight * 0.52),
        z: bodyMin * 0.20,
      }),
      shape: 'CYLINDER',
      materialRole: 'glass',
      rotationY: 0,
    },
  };

  const core = coreProfiles[entry.machineRole] || coreProfiles.control;
  layered.push(Object.freeze({
    ...body,
    id: MACHINE_WORLD_FACILITY_SHELL_ID + ':' + entry.branchId + ':CORE',
    profile: 'facility-body-core-' + entry.machineRole,
    shape: core.shape,
    center: core.center,
    depthOffset: Math.cos(angle) * (core.center.x - housing.center.x)
      + Math.sin(angle) * (core.center.z - housing.center.z),
    dimensions: core.dimensions,
    rotationY: finite(core.rotationY),
    materialRole: core.materialRole,
    outline: null,
    layer: 'mechanism-housing',
    ...rootContext('FACILITY-BODY:' + entry.branchId + ':CORE'),
  }));

  return Object.freeze(layered.map((descriptor) => {
    if(entry.machineRole!=='analysis'||!['main-shell','shoulder-plate'].includes(descriptor.layer))return descriptor;
    const envelopeOutline=MACHINE_WORLD_FACILITY_BODY_OUTLINES[silhouette];
    const outline=deriveMachineWorldFacilityServiceBayOutline({
      outline:envelopeOutline,dimensions:descriptor.dimensions,housingAngle:angle,
      rotationY:descriptor.rotationY,layerOffset:descriptor.depthOffset,
    });
    return Object.freeze({...descriptor,outline,envelopeOutline,
      serviceBayProfile:MACHINE_WORLD_FACILITY_SERVICE_BAY_PROFILE,
      serviceBayWidth:MACHINE_WORLD_FACILITY_SERVICE_BAY_WIDTH,
      serviceBayStartRadius:MACHINE_WORLD_FACILITY_SERVICE_BAY_START_RADIUS});
  }));
}

export function deriveMachineWorldFacilityShellDescriptors(
  facilities,
  { mode = 'WORLD_OVERVIEW' } = {},
) {
  if (mode !== 'WORLD_OVERVIEW') return Object.freeze([]);
  return Object.freeze(
    (Array.isArray(facilities) ? facilities : [])
      .flatMap(deriveShell),
  );
}

export function validateMachineWorldFacilityShellDescriptors(descriptors = []) {
  const reasons = [];
  const list = Array.isArray(descriptors) ? descriptors : [];
  const seen = new Set();

  for (const descriptor of list) {
    const id = descriptor?.id || 'unknown';
    if (seen.has(id)) reasons.push('DUPLICATE_ID:' + id);
    seen.add(id);
    if (descriptor?.constructionSlice !== 'S7') reasons.push(id + ':NOT_S7');
    if (descriptor?.constructionOwner !== 'frontend/spatial/machine-world-facility-shell.js') reasons.push(id + ':OWNER_MISMATCH');
    if (descriptor?.presentationOnly !== true) reasons.push(id + ':NOT_PRESENTATION_ONLY');
    if (!descriptor?.branchId) reasons.push(id + ':MISSING_BRANCH_ID');
    if (!descriptor?.center || !['x','y','z'].every((axis) => Number.isFinite(Number(descriptor.center[axis])))) {
      reasons.push(id + ':NONFINITE_CENTER');
    }
    if (!descriptor?.dimensions || !['x','y','z'].every((axis) => Number(descriptor.dimensions[axis]) > 0)) {
      reasons.push(id + ':INVALID_DIMENSIONS');
    }
    if(descriptor?.serviceBayProfile){
      if(descriptor.serviceBayProfile!==MACHINE_WORLD_FACILITY_SERVICE_BAY_PROFILE)reasons.push(id+':SERVICE_BAY_PROFILE_MISMATCH');
      if(descriptor.branchId!=='BRANCH-OUTER-ALPHA'||!['main-shell','shoulder-plate'].includes(descriptor.layer))reasons.push(id+':SERVICE_BAY_SCOPE_INVALID');
      if(!Array.isArray(descriptor.envelopeOutline)||descriptor.envelopeOutline.length<3)reasons.push(id+':SERVICE_BAY_ENVELOPE_MISSING');
      if(!(Number(descriptor.serviceBayWidth)>0))reasons.push(id+':SERVICE_BAY_WIDTH_INVALID');
      try{
        if(!Array.isArray(descriptor.outline)||descriptor.outline.length<4)throw new Error();
        triangulateMachineWorldFacilityBodyOutline(descriptor.outline);
        if(Array.isArray(descriptor.envelopeOutline)&&signedTwiceArea(descriptor.outline)>=signedTwiceArea(descriptor.envelopeOutline)-1e-7)reasons.push(id+':SERVICE_BAY_DOES_NOT_REMOVE_ENVELOPE_AREA');
      }catch{reasons.push(id+':SERVICE_BAY_OUTLINE_INVALID');}
    }
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    descriptorCount: list.length,
  });
}