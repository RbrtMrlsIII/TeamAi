const TAU=Math.PI*2;
const DEFAULT_SEAT_COUNT=10;
const MIN_SEAT_COUNT=2;
const MAX_SEAT_COUNT=16;
const OUTER_COUNT=4;
const polar=(radius,angle,y=0)=>({x:Math.cos(angle)*radius,y,z:Math.sin(angle)*radius});
const seatLevel=i=>.60+((i*.17)%.31);
const outerProfiles=[
 {branchId:'BRANCH-OUTER-ALPHA',height:.94,silhouette:'fin'},
 {branchId:'BRANCH-OUTER-BETA',height:1.08,silhouette:'arc'},
 {branchId:'BRANCH-OUTER-GAMMA',height:.98,silhouette:'diamond'},
 {branchId:'BRANCH-OUTER-DELTA',height:1.16,silhouette:'blade'}
];
const dims={pod:{x:1.34,y:.62,z:1.08,seam:.18},fin:{x:1.85,y:.82,z:1.22,seam:.22},arc:{x:2.05,y:.92,z:1.46,seam:.24},diamond:{x:1.72,y:1.08,z:1.72,seam:.26},blade:{x:1.96,y:.98,z:1.28,seam:.24}};
const camera=(branchId,position,target,seatIndex=null,role='branch')=>({cameraId:`BRANCH_CAMERA_${branchId}`,branchId,seatIndex,role,position:{...position},target:{...target},fov:role==='hub'?38:34});
export function createBranchConnectionCore({seatCount=DEFAULT_SEAT_COUNT,expanded=false}={}){
 const count=Math.min(MAX_SEAT_COUNT,Math.max(MIN_SEAT_COUNT,Math.floor(Number(seatCount)||DEFAULT_SEAT_COUNT)));
 const hub={id:'machine-hub-core',branchId:'HUB-CORE',kind:'hub',level:.42,center:{x:0,y:.42,z:0},dimensions:{x:2.6,y:.78,z:2.6},silhouette:'hex',seam:.26,port:{x:0,y:.42,z:1.45},uiStyle:'command-core',expanded:true};
 hub.camera=camera('HUB-CORE',{x:0,y:5.8,z:8.4},hub.center,null,'hub');
 const inner=Array.from({length:count},(_,seatIndex)=>{const angle=TAU*seatIndex/count,level=seatLevel(seatIndex),center=polar(expanded?4.55:4.05,angle,level),d=dims.pod,branchId=`BRANCH-SEAT-${String(seatIndex+1).padStart(2,'0')}`;return{id:`branch-seat-${String(seatIndex+1).padStart(2,'0')}`,branchId,seatIndex,kind:'inner-pod',level,center,dimensions:{...d},silhouette:'pod',seam:d.seam,uiStyle:'seat-configuration',port:polar(expanded?1.02:.92,angle,level),camera:camera(branchId,polar(7.6,angle,level+2.9),center,seatIndex)}});
 const outer=outerProfiles.map((p,outerIndex)=>{const angle=TAU*(outerIndex*count/OUTER_COUNT+.5)/count,center=polar(expanded?7.15:6.45,angle,p.height),d=dims[p.silhouette];return{id:p.branchId.toLowerCase(),branchId:p.branchId,seatIndex:null,kind:'outer-housing',level:p.height,center,dimensions:{...d},silhouette:p.silhouette,seam:d.seam,uiStyle:`outer-${p.silhouette}`,port:polar(1.12,angle,p.height),camera:camera(p.branchId,polar(10.2,angle,p.height+4.1),center)}});
 const parts=[hub,...inner,...outer],byBranch=new Map(parts.map(p=>[p.branchId,p])),connections=[];
 for(const pod of inner)connections.push({id:`${pod.branchId}:HUB`,sourceBranchId:'HUB-CORE',targetBranchId:pod.branchId,sourcePort:hub.port,targetPort:pod.port,kind:'inner-spoke',route:[hub.port,{x:pod.center.x*.52,y:Math.max(hub.level,pod.level)+.22,z:pod.center.z*.52},pod.port]});
 outer.forEach((housing,index)=>{const base=Math.floor(index*count/OUTER_COUNT+.5),left=inner[base%count],right=inner[(base+1)%count];connections.push({id:`${housing.branchId}:HUB`,sourceBranchId:'HUB-CORE',targetBranchId:housing.branchId,sourcePort:hub.port,targetPort:housing.port,kind:'outer-spine',route:[hub.port,{x:housing.center.x*.35,y:housing.level+.26,z:housing.center.z*.35},housing.port]});for(const pod of new Set([left,right]))connections.push({id:`${housing.branchId}:${pod.branchId}`,sourceBranchId:housing.branchId,targetBranchId:pod.branchId,sourcePort:housing.port,targetPort:pod.port,kind:'lattice-link',route:[housing.port,{x:(housing.center.x+pod.center.x)/2,y:Math.max(housing.level,pod.level)+.36,z:(housing.center.z+pod.center.z)/2},pod.port]})});
 return Object.freeze({seatCount:count,hub,parts:Object.freeze(parts),connections:Object.freeze(connections),cameras:Object.freeze(parts.map(p=>p.camera)),byBranch});
}
export function getBranchCamera(core,branchId){return core?.byBranch?.get(branchId)?.camera||null;}
