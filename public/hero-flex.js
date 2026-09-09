import { HERO_AUTHORED_MESHES } from './hero-authored-meshes.js';
import { authoredRingMaterial, authoredSeatShellMaterial, authoredSeatInsetMaterial } from './hero-authored-materials.js';
import {
  HIERARCHY_PART,
  HIERARCHY_PHASE,
  SEAT_SHELL_V1_CHILDREN,
  SEAT_REST_Y,
  SEAT_OPEN_LIFT,
  CHILD_STEP_Y,
  CHILD_STEP_R,
  OPEN_DURATION_MS,
  CLOSE_DURATION_MS,
  HIERARCHY_REDUCED_SNAP,
  HEALTH_STATUS,
  BACKEND_DISPLAY_V1,
  SETUP_CONFIG_V1,
  SEAT_TOOLKIT_V1,
  WORKSPACE_ZIPSKILLS_V1,
  toolkitChildAccessibleName,
  zipskillsAccessibleName,
  RING_R0_ZIP_SCALE,
  RING_R1_SCALE,
  RING_R2_SCALE,
  NAV_ZOOM_MIN,
  NAV_ZOOM_MAX,
  NAV_ZOOM_REDUCED_MIN,
  NAV_ZOOM_REDUCED_MAX,
  HIERARCHY_INPUT,
  createRingFocusState,
  focusRingItem,
  cycleRingFocus,
  clearRingFocus,
  ringFocusAccessibleName,
  createHierarchyRuntime,
  syncHierarchyRuntime,
  closeHierarchyParent as closeHierarchyParentState,
  openSeatShellParent as openSeatShellParentState,
  tickHierarchyPose,
  tickConnectionBranch,
  getConnectionBranchAmount,
  connectionFaceAccessibleName,
  requestConnectionConfigureHandoff,
  tickBehaviorBranch,
  getBehaviorBranchAmount,
  behaviorFaceAccessibleName,
  requestBehaviorConfigureHandoff,
  BEHAVIOR_BRANCH_MS,
  tickToolkitBranch,
  getToolkitBranchAmount,
  toolkitFaceAccessibleName,
  requestToolkitConfigureHandoff,
  TOOLKIT_BRANCH_MS,
  tickCapabilitiesBranch,
  getCapabilitiesBranchAmount,
  capabilitiesFaceAccessibleName,
  requestCapabilitiesConfigureHandoff,
  CAPABILITIES_BRANCH_MS,
  tickAuthorizationBranch,
  getAuthorizationBranchAmount,
  authorizationFaceAccessibleName,
  requestAuthorizationConfigureHandoff,
  AUTHORIZATION_BRANCH_MS,
  tickWorkspaceScopeBranch,
  getWorkspaceScopeBranchAmount,
  workspaceScopeFaceAccessibleName,
  requestWorkspaceScopeConfigureHandoff,
  WORKSPACE_SCOPE_BRANCH_MS,
  tickTaskEvidenceBranch,
  getTaskEvidenceBranchAmount,
  taskEvidenceFaceAccessibleName,
  requestTaskEvidenceConfigureHandoff,
  TASK_EVIDENCE_BRANCH_MS,
  CONNECTION_BRANCH_MS,
  seatAltitudeY,
  childStackOffset,
  childLocalPosition,
  focusChild as focusHierarchyChild,
  focusLeaf as focusHierarchyLeaf,
  clearLeafFocus,
  healthLeafAccessibleName,
  getHierarchySnapshot,
  seatShellParentId,
} from './hero-hierarchy-runtime.js';
import { drawSetupConfigRing } from './hero-r2-setup-ring.js';

const canvas = document.querySelector('#hero-canvas');
const shell = document.querySelector('.hero-shell');
const stateLabel = document.querySelector('#state-label');
const seatLabel = document.querySelector('#seat-label');
const demoButton = document.querySelector('#demo-toggle');
const motionButton = document.querySelector('#motion-toggle');
const gl = canvas?.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
if (!canvas || !shell || !gl) throw new Error('WebGL is required for the 3D Hero.');

const VS = `attribute vec3 p;attribute vec3 n;uniform mat4 mvp;uniform mat4 model;varying vec3 N;varying vec3 W;void main(){vec4 w=model*vec4(p,1.0);W=w.xyz;N=normalize(mat3(model)*n);gl_Position=mvp*vec4(p,1.0);}`;
const FS = `precision mediump float;uniform vec3 color;uniform vec3 specular;uniform float rough;uniform float emit;uniform float alpha;varying vec3 N;varying vec3 W;void main(){vec3 n=normalize(N),k=normalize(vec3(-.55,.88,.34)),f=normalize(vec3(.66,.28,-.52)),v=normalize(vec3(-W.x*.045,.92,4.));float facing=max(dot(n,k),0.0),d=.24+.67*facing+.16*max(dot(n,f),0.0);vec3 h=normalize(k+v);float s=pow(max(dot(n,h),0.0),mix(96.0,12.0,rough));float r=pow(1.0-max(dot(n,v),0.0),3.2);float grazing=pow(1.0-facing,2.0);gl_FragColor=vec4(color*d+specular*s*(1.0-rough*.72)+color*(.05*grazing+emit*(.16+r*1.45)),alpha);}`;
function compile(type, source) { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed'); return shader; }
const program = gl.createProgram();
gl.attachShader(program, compile(gl.VERTEX_SHADER, VS));
gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FS));
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Program link failed');
gl.useProgram(program);
const U = { p: gl.getAttribLocation(program,'p'), n: gl.getAttribLocation(program,'n'), mvp: gl.getUniformLocation(program,'mvp'), model: gl.getUniformLocation(program,'model'), color: gl.getUniformLocation(program,'color'), specular: gl.getUniformLocation(program,'specular'), rough: gl.getUniformLocation(program,'rough'), emit: gl.getUniformLocation(program,'emit'), alpha: gl.getUniformLocation(program,'alpha') };
function mesh(P,N){const pb=gl.createBuffer(),nb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(P),gl.STATIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(N),gl.STATIC_DRAW);return{pb,nb,count:P.length/3};}
function cube(){const v=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]],f=[[0,1,2,3,0,0,-1],[4,7,6,5,0,0,1],[0,4,5,1,0,-1,0],[3,2,6,7,0,1,0],[0,3,7,4,-1,0,0],[1,5,6,2,1,0,0]],P=[],N=[];for(const[a,b,c,d,x,y,z]of f)for(const i of[a,b,c,a,c,d]){P.push(...v[i]);N.push(x,y,z);}return mesh(P,N);}
function cyl(s=48){const P=[],N=[];for(let i=0;i<s;i++){const a=i/s*Math.PI*2,b=(i+1)/s*Math.PI*2,x0=Math.cos(a),z0=Math.sin(a),x1=Math.cos(b),z1=Math.sin(b),q=[[x0,-.5,z0,x0,0,z0],[x1,-.5,z1,x1,0,z1],[x1,.5,z1,x1,0,z1],[x0,-.5,z0,x0,0,z0],[x1,.5,z1,x1,0,z1],[x0,.5,z0,x0,0,z0]];for(const n of q){P.push(n[0],n[1],n[2]);N.push(n[3],n[4],n[5]);}for(const c of[-1,1]){const y=c*.5,q=c>0?[[0,y,0],[x0,y,z0],[x1,y,z1]]:[[0,y,0],[x1,y,z1],[x0,y,z0]];for(const n of q){P.push(...n);N.push(0,c,0);}}}return mesh(P,N);}
function torus(R=.9,r=.07,s=48,t=10){const P=[],N=[];for(let i=0;i<s;i++)for(let j=0;j<t;j++){const a0=i/s*Math.PI*2,a1=(i+1)/s*Math.PI*2,b0=j/t*Math.PI*2,b1=(j+1)/t*Math.PI*2;for(const[a,b]of[[a0,b0],[a1,b0],[a1,b1],[a0,b0],[a1,b1],[a0,b1]]){const rr=R+r*Math.cos(b),x=rr*Math.cos(a),y=r*Math.sin(b),z=rr*Math.sin(a);P.push(x,y,z);N.push(Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a));}}return mesh(P,N);}
function sphere(r=.5,s=16,t=10){const P=[],N=[];for(let i=0;i<t;i++)for(let j=0;j<s;j++){const p0=i/t*Math.PI,p1=(i+1)/t*Math.PI,a0=j/s*Math.PI*2,a1=(j+1)/s*Math.PI*2;for(const[p,a]of[[p0,a0],[p0,a1],[p1,a1],[p0,a0],[p1,a1],[p1,a0]]){const x=Math.sin(p)*Math.cos(a),y=Math.cos(p),z=Math.sin(p)*Math.sin(a);P.push(x*r,y*r,z*r);N.push(x,y,z);}}return mesh(P,N);}
function authored(def){const P=[],N=[];for(let i=0;i<def.indices.length;i+=3){const ia=def.indices[i]*3,ib=def.indices[i+1]*3,ic=def.indices[i+2]*3,a=def.positions.slice(ia,ia+3),b=def.positions.slice(ib,ib+3),c=def.positions.slice(ic,ic+3),u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],nx=u[1]*v[2]-u[2]*v[1],ny=u[2]*v[0]-u[0]*v[2],nz=u[0]*v[1]-u[1]*v[0],m=Math.hypot(nx,ny,nz)||1;for(const id of[ia,ib,ic]){const q=def.positions.slice(id,id+3);P.push(...q);N.push(nx/m,ny/m,nz/m);}}return mesh(P,N);}
const CUBE=cube(),CYL=cyl(),TORUS=torus(),RING=torus(.52,.045,40,8),SPH=sphere(),AUTHORED_RING=authored(HERO_AUTHORED_MESHES.workspaceRing),AUTHORED_SEAT_SHELL=authored(HERO_AUTHORED_MESHES.seatShell);
const M={shell:[.89,.88,.84],metal:[.47,.51,.49],metal2:[.71,.72,.68],glass:[.58,.71,.75],dark:[.13,.15,.14],energy:[1,.56,.12],trace:[.30,.43,.40],floor:[.76,.75,.71]};
const PALETTE=[[.66,.57,.46],[.48,.60,.57],[.57,.50,.65],[.69,.57,.43],[.47,.57,.66],[.65,.53,.40],[.45,.62,.53],[.59,.49,.61]];
/** Issue #88 + B/E + #89 — presentation material context.
 * Subset of mapHeroThemeLighting material keys (roughness, reflectance, grazingRimStrength,
 * shadowSeparationStrength, emissiveCeilingFloor, themeMode, density) plus reducedMotionChoreography.
 * Numeric bases kept identical to frontend/spatial/hero-theme-lighting-adapter.js MODE_PROFILE.
 * Canonical theme source is document.documentElement data-theme-mode / data-density / data-motion
 * (written by spatial theme-root). No body fallback. Isolation preserved — no cross-root import.
 */
function heroMaterialContext(){
  const themeMode = (document.documentElement.getAttribute('data-theme-mode') || 'light').toLowerCase() === 'dark' ? 'dark' : 'light';
  const density = (document.documentElement.getAttribute('data-density') || 'default') === 'compact' ? 'compact' : 'default';
  const focus = state==='FOCUS'||state==='ACTIVE'?0.85:0.25;
  const signal = state==='CONTRIBUTE'?0.7:0.15;
  const baseRough = themeMode==='dark'?0.62:0.48;
  const baseRefl = themeMode==='dark'?0.54:0.72;
  const reducedMotionChoreography = !reducedMotion;
  return {
    themeMode, density, reducedMotion, reducedMotionChoreography,
    roughness: Math.min(1, baseRough + (density==='compact'?0.04:0)),
    reflectance: Math.min(1, baseRefl + focus*0.12),
    grazingRimStrength: Math.min(1, (themeMode==='dark'?0.44:0.62) + focus*0.18),
    shadowSeparationStrength: Math.min(1, (themeMode==='dark'?0.72:0.56) + 0.12),
    emissiveCeilingFloor: Math.min(1, (themeMode==='dark'?0.16:0.08) + signal*0.1),
  };
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t),sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],len=a=>Math.hypot(...a),norm=a=>{const m=len(a)||1;return[a[0]/m,a[1]/m,a[2]/m]},cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const I=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],mul=(a,b)=>{const r=new Array(16).fill(0);for(let c=0;c<4;c++)for(let q=0;q<4;q++)for(let k=0;k<4;k++)r[c*4+q]+=a[k*4+q]*b[c*4+k];return r},T=(x,y,z)=>{const m=I();m[12]=x;m[13]=y;m[14]=z;return m},S=(x,y,z)=>{const m=I();m[0]=x;m[5]=y;m[10]=z;return m},RY=a=>{const c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]},persp=(fov,asp,n,f)=>{const q=1/Math.tan(fov*Math.PI/360),nf=1/(n-f);return[q/asp,0,0,0,0,q,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0]};
function look(e,t){const z=norm(sub(e,t)),x=norm(cross([0,1,0],z)),y=cross(z,x);return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x[0]*e[0]-x[1]*e[1]-x[2]*e[2],-y[0]*e[0]-y[1]*e[1]-y[2]*e[2],-z[0]*e[0]-z[1]*e[1]-z[2]*e[2],1]}
let camera={p:[0,6.4,9.6],t:[0,.78,0],f:39},seatCount=4,selectedSeat=0,state='IDLE',demo=false,reducedMotion=false,stateStart=performance.now(),cameraId='HERO_WIDE',camFrom=camera,camTo=camera,camStart=performance.now(),camAt=1,contribution=0;
const hierarchyRuntime = createHierarchyRuntime({ selectedSeatIndex: selectedSeat, cameraId });
const ringFocus = createRingFocusState();
function syncHierarchyFromGlobals(){
  return syncHierarchyRuntime(hierarchyRuntime, { selectedSeatIndex: selectedSeat, cameraId, reducedMotion, demo });
}
function getHierarchyState(){ return getHierarchySnapshot(syncHierarchyFromGlobals()); }
function closeHierarchyParent(){ closeHierarchyParentState(hierarchyRuntime); return syncHierarchyFromGlobals(); }
function selectSeatShell(index){
  const i = ((Math.floor(Number(index)) % seatCount) + seatCount) % seatCount;
  selectedSeat = i;
  const now = performance.now();
  const snap = HIERARCHY_REDUCED_SNAP && reducedMotion;
  openSeatShellParentState(hierarchyRuntime, i, { snap, nowMs: now });
  setCamera('SEAT_CLOSE');
  syncHierarchyFromGlobals();
  setState('FOCUS', 'seat-shell-select');
  return getHierarchyState();
}
function returnFromSeatShell(){
  const now = performance.now();
  const snap = HIERARCHY_REDUCED_SNAP && reducedMotion;
  closeHierarchyParentState(hierarchyRuntime, { snap, nowMs: now });
  setCamera('HERO_WIDE');
  syncHierarchyFromGlobals();
  setState('IDLE', 'seat-shell-close');
  return getHierarchyState();
}
const traces=[];const TRACE_LIMIT=8;
function readDocumentMotionReduced(){
  const v = (document.documentElement.getAttribute('data-motion') || '').toLowerCase();
  return v === 'reduced' || v === 'reduce';
}
function syncReducedMotionFromDocument(){
  const next = readDocumentMotionReduced();
  if (next !== reducedMotion) reducedMotion = next;
  return reducedMotion;
}
function setReducedMotion(next, {writeDocument = true} = {}){
  reducedMotion = Boolean(next);
  if (writeDocument) { try { document.documentElement.setAttribute('data-motion', reducedMotion ? 'reduced' : 'full'); } catch (_) {} }
  return reducedMotion;
}
function durations(){
  const k=reducedMotion?0.35:1;
  return{ focus:700*k, active:900*k, contribute:1100*k, absorb:520*k, reflect:520*k, handoff:800*k };
}
const profile=count=>{const density=(clamp(count,1,8)-1)/7;return{workspace:lerp(4.35,5.95,density),seatRadius:lerp(4.25,6.45,density),seatScale:lerp(1,.78,density),cameraDist:lerp(9.6,12.2,density),ambient:lerp(.35,.78,density),artifacts:Math.round(lerp(3,8,density))}};
const buildSeats=count=>Array.from({length:count},(_,i)=>({id:`seat-${i+1}`,label:`Web AI Seat ${i+1}`,a:-Math.PI/2+i*(Math.PI*2/count),accent:PALETTE[i%PALETTE.length]}));
let seats=buildSeats(seatCount);
function cameras(){const p=profile(seatCount),d=p.cameraDist;return{HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39},HERO_LOW_ORBIT:{p:[d*.74,d*.23,d*.78],t:[0,.78,0],f:40},TEAM_ORBIT:{p:[d*.92,d*.5,d*.14],t:[0,.78,0],f:42},SEAT_CLOSE:{p:[p.seatRadius*.78,2.3,p.seatRadius*.78],t:[0,.95,0],f:36},WORKSPACE_CLOSE:{p:[3.55,2.45,4.65],t:[0,.62,0],f:33},TURN_FOLLOW:{p:[4.6,2.05,5.15],t:[0,.72,0],f:35},OVERHEAD_MAP:{p:[0,lerp(10.8,14.8,(seatCount-1)/7),.2],t:[0,.1,0],f:50},DETAIL_ANCHOR:{p:[2.45,1.9,3.05],t:[0,.82,0],f:31}}}
function setCamera(id){const next=cameras()[id]||cameras().HERO_WIDE;cameraId=id;camFrom=camera;camTo=next;camAt=reducedMotion?1:0;camStart=performance.now();if(typeof hierarchyRuntime!=='undefined'){hierarchyRuntime.cameraId=id;}}
let viewW = 1, viewH = 1;
function resize(){
  const d=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.floor(canvas.clientWidth*d)),h=Math.max(1,Math.floor(canvas.clientHeight*d));
  viewW = Math.max(1, canvas.clientWidth || w);
  viewH = Math.max(1, canvas.clientHeight || h);
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}
}
function responsiveFovBoost(){
  const aspect = viewW / Math.max(1, viewH);
  if (aspect < 0.85) return 4;
  if (aspect < 1.1) return 2;
  return 0;
}
function seatPos(seat){const p=profile(seatCount);return[Math.cos(seat.a)*p.seatRadius,SEAT_REST_Y,Math.sin(seat.a)*p.seatRadius]}
function draw(mesh,model,color,opts={}){const mvp=mul(persp(camera.f+responsiveFovBoost(),canvas.width/Math.max(1,canvas.height),.1,90),mul(look(camera.p,camera.t),model));gl.uniformMatrix4fv(U.mvp,false,new Float32Array(mvp));gl.uniformMatrix4fv(U.model,false,new Float32Array(model));gl.uniform3fv(U.color,new Float32Array(color));gl.uniform3fv(U.specular,new Float32Array(opts.spec||[.5,.52,.49]));gl.uniform1f(U.rough,opts.rough??.7);gl.uniform1f(U.emit,opts.emit??0);gl.uniform1f(U.alpha,opts.alpha??1);gl.bindBuffer(gl.ARRAY_BUFFER,mesh.pb);gl.enableVertexAttribArray(U.p);gl.vertexAttribPointer(U.p,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,mesh.nb);gl.enableVertexAttribArray(U.n);gl.vertexAttribPointer(U.n,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,mesh.count)}
function addTrace(){const slots=Math.max(1,profile(seatCount).artifacts);traces.push({seatId:seats[selectedSeat]?.id||`seat-${selectedSeat+1}`,slot:traces.length%slots,sequence:traces.length+1});if(traces.length>TRACE_LIMIT)traces.shift()}
function workspace(t){const p=profile(seatCount),r=p.workspace;draw(CYL,mul(T(0,.40,0),S(r+1,.52,r+1)),M.metal,{rough:.4,spec:[.86,.87,.83]});draw(CYL,mul(T(0,.69,0),S(r+.55,.34,r+.55)),M.shell,{rough:.6,spec:[.66,.65,.61]});{const L=heroMaterialContext(),Rm=authoredRingMaterial(L);draw(AUTHORED_RING,mul(T(0,.91,0),S(r*.88,.95,r*.88)),Rm.color,{rough:Rm.rough,spec:Rm.spec,emit:Rm.emit||0});draw(CYL,mul(T(0,.875,0),S(r*.86,.06,r*.86)),M.dark,{rough:.68,spec:[.32,.33,.31]});}draw(CYL,mul(T(0,.95,0),S(r*.84,.12,r*.84)),M.glass,{rough:.18,spec:[.96,.97,.95],alpha:.72});draw(TORUS,mul(T(0,1.01,0),S(r*.70,1,r*.70)),M.metal,{rough:.35,spec:[.8,.82,.78]});draw(CYL,mul(T(0,1.04,0),S(r*.65,.09,r*.65)),M.dark,{rough:.66,spec:[.42,.45,.43]});draw(TORUS,mul(T(0,1.08,0),S(r*.59,1,r*.59)),M.trace,{rough:.52,emit:.04});for(let i=0;i<p.artifacts;i++){const a=i*(Math.PI*2/p.artifacts)+.22,x=Math.cos(a)*r*.39,z=Math.sin(a)*r*.39;draw(CUBE,mul(mul(T(x,1.14,z),RY(a)),S(.82,.09,.20)),M.trace,{rough:.44,spec:[.68,.68,.63]})}for(let i=0;i<traces.length;i++){const tr=traces[i],a=tr.slot*(Math.PI*2/p.artifacts)+.22,x=Math.cos(a)*r*.52,z=Math.sin(a)*r*.52,isNew=i===traces.length-1;let pulse=1;if(!reducedMotion&&state==='HANDOFF'&&isNew)pulse=.5+.5*Math.sin(t*3.4);draw(RING,mul(mul(T(x,1.18,z),RY(a)),S(.18+.05*pulse,1,.18+.05*pulse)),isNew?M.energy:M.trace,{rough:.24,spec:[.84,.84,.80],emit:isNew?.16:.04,alpha:.5+.25*pulse});draw(CUBE,mul(mul(T(x,1.19,z),RY(a)),S(.36,.055,.12)),M.trace,{rough:.42,spec:[.7,.7,.66],alpha:.84})}if(state==='ABSORB'||state==='REFLECT'){const d=durations();let q=1;if(!reducedMotion){q=state==='ABSORB'?clamp((performance.now()-stateStart)/d.absorb,0,1):clamp(1-(performance.now()-stateStart)/d.reflect,0,1)}draw(TORUS,mul(T(0,1.11,0),S(.55+1.7*q,1,.55+1.7*q)),M.energy,{rough:.18,emit:.26+.20*q,alpha:.18+.24*q})}}
function drawHealthLeaf(seat, index, shellY, scale, connectionCx, connectionCy, connectionCz) {
  if (hierarchyRuntime.openParentId !== seatShellParentId(index)) return;
  if ((hierarchyRuntime.openAmount || 0) < 0.5) return;
  const leafFocused = hierarchyRuntime.focusedLeafId === HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE;
  const status = hierarchyRuntime.healthStatus || HEALTH_STATUS.UNKNOWN;
  const s = 0.18 * scale;
  const lx = connectionCx, ly = connectionCy + 0.12 * scale, lz = connectionCz;
  let col = M.trace, emit = 0.04;
  if (status === HEALTH_STATUS.LOADING) { col = M.glass; emit = 0.08; }
  if (status === HEALTH_STATUS.UNAVAILABLE) { col = [0.55, 0.28, 0.22]; emit = 0.06; }
  if (leafFocused) emit += 0.12;
  draw(SPH, mul(T(lx, ly, lz), S(s, s, s)), col, { rough: 0.25, emit, alpha: 0.75 + (leafFocused ? 0.2 : 0) });
  if (leafFocused) draw(TORUS, mul(T(lx, ly, lz), S(s * 1.6, 1, s * 1.6)), M.energy, { rough: 0.2, emit: 0.18, alpha: 0.55 });
}
function drawHierarchyChildren(seat, index, t, shellY, scale) {
  if (hierarchyRuntime.openParentId !== seatShellParentId(index)) return;
  const amt = hierarchyRuntime.openAmount || 0;
  if (amt <= 0.02) return;
  for (let ci = 0; ci < SEAT_SHELL_V1_CHILDREN.length; ci++) {
    const childId = SEAT_SHELL_V1_CHILDREN[ci];
    const loc = childLocalPosition(seat.a, profile(seatCount).seatRadius * 0.22, ci, amt);
    const cx = seatPos(seat)[0] + Math.cos(seat.a) * (0.15 + ci * 0.02) * scale + Math.cos(seat.a + Math.PI / 2) * (ci - 2.5) * 0.12 * scale;
    const cz = seatPos(seat)[2] + Math.sin(seat.a) * (0.15 + ci * 0.02) * scale + Math.sin(seat.a + Math.PI / 2) * (ci - 2.5) * 0.12 * scale;
    const cy = shellY + 0.55 * scale + loc.y * scale;
    const s = loc.scale * scale * (0.55 + 0.45 * amt);
    const focused = hierarchyRuntime.focusedChildId === childId;
    const isConnection = childId === HIERARCHY_PART.SEAT_CONNECTION;
    const isBehavior = childId === HIERARCHY_PART.SEAT_BEHAVIOR;
    const isToolkit = childId === HIERARCHY_PART.SEAT_TOOLKIT;
    const isCapabilities = childId === HIERARCHY_PART.SEAT_CAPABILITIES;
    const isAuthorization = childId === HIERARCHY_PART.SEAT_AUTHORIZATION;
    const isWorkspaceScope = childId === HIERARCHY_PART.SEAT_WORKSPACE_SCOPE;
    const isTaskEvidence = childId === HIERARCHY_PART.SEAT_TASK_EVIDENCE;
    const branch = isConnection ? getConnectionBranchAmount(hierarchyRuntime) : (isBehavior ? getBehaviorBranchAmount(hierarchyRuntime) : (isToolkit ? getToolkitBranchAmount(hierarchyRuntime) : (isCapabilities ? getCapabilitiesBranchAmount(hierarchyRuntime) : (isAuthorization ? getAuthorizationBranchAmount(hierarchyRuntime) : (isWorkspaceScope ? getWorkspaceScopeBranchAmount(hierarchyRuntime) : (isTaskEvidence ? getTaskEvidenceBranchAmount(hierarchyRuntime) : 0))))));
    const branchBoost = 1 + 0.28 * branch;
    const col = isConnection ? M.energy : (isToolkit ? M.glass : (focused ? seat.accent : M.trace));
    const emit = focused || isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope || isTaskEvidence ? 0.14 * amt * (1 + 0.55 * branch) : 0.03 * amt;
    const sx = 0.55 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope || isTaskEvidence ? branchBoost : 1);
    const sy = 0.08 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope || isTaskEvidence ? (1 + 0.35 * branch) : 1);
    const sz = 0.38 * s * (isConnection || isBehavior || isToolkit || isCapabilities || isAuthorization || isWorkspaceScope || isTaskEvidence ? branchBoost : 1);
    draw(CUBE, mul(mul(T(cx, cy, cz), RY(seat.a + Math.PI / 2)), S(sx, sy, sz)), col, { rough: 0.35, spec: [0.8, 0.82, 0.78], emit, alpha: 0.35 + 0.55 * amt });
    if (isConnection) {
      const torusScale = 0.22 * s * branchBoost;
      draw(TORUS, mul(T(cx, cy + 0.06 * s * (1 + 0.2 * branch), cz), S(torusScale, 1, torusScale)), M.energy, { rough: 0.2, emit: 0.2 * amt * (1 + 0.7 * branch), alpha: 0.5 + 0.4 * amt });
      drawHealthLeaf(seat, index, shellY, scale, cx, cy, cz);
    }
  }
}
function drawWorkspaceZipskills(t) {
  const p = profile(seatCount);
  const r = p.workspace * RING_R0_ZIP_SCALE;
  const n = WORKSPACE_ZIPSKILLS_V1.length;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * (Math.PI * 2 / Math.max(n, 1));
    const x = Math.cos(a) * r, z = Math.sin(a) * r, y = 1.26;
    const focused = ringFocus.ring === 'r0' && ringFocus.index === i;
    const spin = reducedMotion ? 0 : t * 0.25 + i;
    draw(CUBE, mul(mul(T(x, y, z), RY(a + Math.PI / 2)), S(0.38 * (focused ? 1.12 : 1), 0.07, 0.22 * (focused ? 1.12 : 1))), M.glass, {
      rough: 0.22, spec: [0.92, 0.94, 0.9], emit: focused ? 0.16 : 0.05, alpha: 0.78,
    });
    draw(TORUS, mul(mul(T(x, y + 0.07, z), RY(spin)), S(0.16 * (focused ? 1.2 : 1), 1, 0.16 * (focused ? 1.2 : 1))), focused ? M.energy : M.trace, {
      rough: 0.3, emit: focused ? 0.2 : 0.05, alpha: 0.6,
    });
  }
}
function drawBackendDisplayRing(t) {
  const p = profile(seatCount);
  const r = p.workspace * RING_R1_SCALE;
  const n = BACKEND_DISPLAY_V1.length;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * (Math.PI * 2 / Math.max(n, 1)) + 0.35;
    const x = Math.cos(a) * r, z = Math.sin(a) * r, y = 1.05;
    const focused = ringFocus.ring === 'r1' && ringFocus.index === i;
    const pulse = reducedMotion ? 0 : 0.5 + 0.5 * Math.sin(t * 1.4 + i);
    const emitBoost = focused ? 0.14 : 0.04 + 0.03 * pulse;
    draw(CUBE, mul(mul(T(x, y, z), RY(a + Math.PI / 2)), S(0.55 * (focused ? 1.12 : 1), 0.12, 0.38 * (focused ? 1.12 : 1))), M.glass, { rough: 0.28, spec: [0.9, 0.92, 0.9], emit: emitBoost, alpha: 0.72 });
    draw(TORUS, mul(T(x, y + 0.08, z), S(0.22 * (focused ? 1.2 : 1), 1, 0.22 * (focused ? 1.2 : 1))), focused ? M.energy : M.trace, { rough: 0.35, emit: focused ? 0.18 : 0.06, alpha: 0.55 });
    for (let s = 1; s <= 5; s++) {
      const q = s / 6;
      const jitter = reducedMotion ? 0 : 0.02 * Math.sin(t * 2.2 + s + i);
      const tx = x * (1 - q) + jitter, ty = y * (1 - q * 0.35) + 0.7 * q, tz = z * (1 - q);
      const k = 0.08 * (1 - q * 0.4);
      draw(SPH, mul(T(tx, ty, tz), S(k, k, k)), M.energy, { rough: 0.2, emit: 0.12 + 0.08 * pulse * (1 - q), alpha: 0.35 + 0.25 * (1 - q) });
    }
  }
}
function drawSeat(seat,index,t){const p=seatPos(seat),cfg=profile(seatCount),active=index===selectedSeat&&state!=='IDLE',engaged=active&&['FOCUS','ACTIVE','CONTRIBUTE'].includes(state),scale=cfg.seatScale,bob=(active?Math.sin(t*2.1)*.04:Math.sin(t*.7+index)*.012)*(reducedMotion?.2:1),hierLift=(hierarchyRuntime.openParentId===seatShellParentId(index)?SEAT_OPEN_LIFT*hierarchyRuntime.openAmount:0),y=p[1]+bob+hierLift;draw(CYL,mul(T(p[0],.27,p[2]),S(1.9*scale,.44,1.9*scale)),M.metal,{rough:.45,spec:[.8,.81,.77]});draw(TORUS,mul(T(p[0],.50,p[2]),S(.92*scale,1,.92*scale)),M.metal2,{rough:.3,spec:[.92,.92,.88]});{const L=heroMaterialContext(),Sm=authoredSeatShellMaterial(L),In=authoredSeatInsetMaterial(L);draw(AUTHORED_SEAT_SHELL,mul(mul(T(p[0],y,p[2]),RY(seat.a+Math.PI)),S(1.24*scale,1.12*scale,1.02*scale)),Sm.color,{rough:Sm.rough,spec:Sm.spec,emit:Sm.emit||0});draw(CYL,mul(mul(T(p[0],y+.08*scale,p[2]),RY(seat.a)),S(.98*scale,.55*scale,.98*scale)),In.color,{rough:In.rough,spec:In.spec});}draw(CYL,mul(mul(T(p[0],y+.47*scale,p[2]),RY(seat.a)),S(.62*scale,.12,.62*scale)),seat.accent,{rough:.25,spec:[.9,.9,.86],emit:engaged?.09:0});draw(TORUS,mul(T(p[0],y+.52*scale,p[2]),S(.40*scale,1,.40*scale)),engaged?M.energy:seat.accent,{rough:.22,emit:engaged?.28:.02,alpha:engaged?.88:.55});const nose=[p[0]+Math.cos(seat.a)*(.66*scale),y+.18*scale,p[2]+Math.sin(seat.a)*(.66*scale)];draw(CYL,mul(mul(T(...nose),RY(seat.a+Math.PI/2)),S(.15*scale,.45*scale,.15*scale)),M.metal2,{rough:.35,spec:[.88,.88,.84]});if(engaged){const pulse=reducedMotion?.65:.5+.5*Math.sin(t*4.2);draw(RING,mul(T(p[0],y+.66*scale,p[2]),S(.7*scale+.08*pulse,.7*scale+.08*pulse,.7*scale+.08*pulse)),M.energy,{rough:.18,emit:.12+.20*pulse,alpha:.27+.12*pulse})}drawHierarchyChildren(seat,index,t,y,scale);}
function point(start,c1,c2,end,q){const u=1-q;return[u*u*u*start[0]+3*u*u*q*c1[0]+3*u*q*q*c2[0]+q*q*q*end[0],u*u*u*start[1]+3*u*u*q*c1[1]+3*u*q*q*c2[1]+q*q*q*end[1],u*u*u*start[2]+3*u*u*q*c1[2]+3*u*q*q*c2[2]+q*q*q*end[2]]}
function contributionEffect(seat){if(state!=='CONTRIBUTE')return;const p=seatPos(seat),d=durations(),start=[p[0],1.03,p[2]],c1=[p[0]*.55,1.32,p[2]*.55],c2=[p[0]*.14,1.42,p[2]*.14],end=[0,1.3,0];if(reducedMotion){for(const q of[.3,.5,.7]){const[x,y,z]=point(start,c1,c2,end,q);draw(SPH,mul(T(x,y,z),S(.23,.23,.23)),M.energy,{rough:.15,emit:.25,alpha:.58})}return}const q=clamp((performance.now()-stateStart)/d.contribute,0,1);for(let i=0;i<5;i++){const tt=clamp(q-i*.06,0,1),[x,y,z]=point(start,c1,c2,end,tt),k=Math.max(.18,.34*(1-i*.13));draw(SPH,mul(T(x,y,z),S(k,k,k)),M.energy,{rough:.15,emit:.38,alpha:.82-i*.12})}}
function environment(t){const p=profile(seatCount),count=Math.max(8,seatCount*2);for(let i=0;i<count;i++){const a=i/count*Math.PI*2+.18,x=Math.cos(a)*(p.workspace+1.6),z=Math.sin(a)*(p.workspace+1.6);draw(TORUS,mul(T(x,.06,z),S(.24,1,.24)),M.metal2,{rough:.45,emit:p.ambient*(.06+.02*Math.sin(t*.8+i))})}}
function floor(){draw(CUBE,mul(T(0,-.32,0),S(18,.56,18)),M.floor,{rough:.95,spec:[.15,.16,.15]})}
function updateLabels(){stateLabel.textContent=state;const seat=seats[selectedSeat]||seats[0];let seatText=`${state==='IDLE'?'Next: ':''}${seat.label} · ${seatCount} seat${seatCount===1?'':'s'} unlocked`;if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedLeafId===HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE){seatText=healthLeafAccessibleName(hierarchyRuntime.healthStatus)}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CONNECTION){seatText=connectionFaceAccessibleName(getConnectionBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_BEHAVIOR){seatText=behaviorFaceAccessibleName(getBehaviorBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){seatText=toolkitFaceAccessibleName(getToolkitBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CAPABILITIES){seatText=capabilitiesFaceAccessibleName(getCapabilitiesBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_AUTHORIZATION){seatText=authorizationFaceAccessibleName(getAuthorizationBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_WORKSPACE_SCOPE){seatText=workspaceScopeFaceAccessibleName(getWorkspaceScopeBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TASK_EVIDENCE){seatText=taskEvidenceFaceAccessibleName(getTaskEvidenceBranchAmount(hierarchyRuntime))}else if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId){seatText=`${seat.label} · ${hierarchyRuntime.focusedChildId}`}else if(ringFocus.ring){seatText=ringFocusAccessibleName(ringFocus)}seatLabel.textContent=seatText;if(seatLabel){seatLabel.setAttribute('aria-live','polite');seatLabel.setAttribute('role','status')}demoButton.textContent=demo?'Stop turn loop':'Start turn loop';motionButton.textContent=`Reduced motion: ${reducedMotion?'on':'off'}`;shell.dataset.state=state;shell.dataset.traceCount=String(traces.length);if(hierarchyRuntime.openParentId){shell.dataset.hierarchyOpen='true';shell.dataset.focusedChild=hierarchyRuntime.focusedChildId||'';shell.dataset.focusedLeaf=hierarchyRuntime.focusedLeafId||''}else{shell.dataset.hierarchyOpen='false';shell.dataset.focusedChild='';shell.dataset.focusedLeaf=''}}
function setState(next,reason='transition'){const previous=state;state=next;stateStart=performance.now();updateLabels();window.dispatchEvent(new CustomEvent('teamai:hero-state-change',{detail:{previous,state,selectedSeat,seatId:seats[selectedSeat]?.id??null,reason,presentationOnly:true,traceCount:traces.length}}))}
function setSeatCount(next){const count=clamp(Math.round(Number(next)||1),1,8);if(count===seatCount)return;seatCount=count;seats=buildSeats(seatCount);selectedSeat%=seatCount;traces.length=0;setCamera(cameraId);updateLabels()}
function startLoop(){demo=true;setState('FOCUS','loop-start')}
function stopLoop(){demo=false;contribution=0;setState('IDLE','loop-stop')}
function cycleTurn(now){if(!demo)return;const elapsed=now-stateStart,d=durations();if(state==='FOCUS'&&elapsed>d.focus)setState('ACTIVE');else if(state==='ACTIVE'&&elapsed>d.active){contribution=0;setCamera('TURN_FOLLOW');setState('CONTRIBUTE','contribution-start')}else if(state==='CONTRIBUTE'){contribution=clamp(elapsed/d.contribute,0,1);if(elapsed>d.contribute){contribution=1;setState('ABSORB','workspace-absorb')}}else if(state==='ABSORB'&&elapsed>d.absorb)setState('REFLECT','workspace-reflect');else if(state==='REFLECT'&&elapsed>d.reflect){addTrace();setState('HANDOFF','trace-committed')}else if(state==='HANDOFF'&&elapsed>d.handoff){selectedSeat=(selectedSeat+1)%seatCount;setState('FOCUS','next-seat-focus');setCamera('TEAM_ORBIT')}}
function frame(now){syncReducedMotionFromDocument();resize();cycleTurn(now);tickHierarchyPose(hierarchyRuntime,now,reducedMotion);tickConnectionBranch(hierarchyRuntime,now,reducedMotion);tickBehaviorBranch(hierarchyRuntime,now,reducedMotion);tickToolkitBranch(hierarchyRuntime,now,reducedMotion);tickCapabilitiesBranch(hierarchyRuntime,now,reducedMotion);tickAuthorizationBranch(hierarchyRuntime,now,reducedMotion);tickWorkspaceScopeBranch(hierarchyRuntime,now,reducedMotion);tickTaskEvidenceBranch(hierarchyRuntime,now,reducedMotion);syncHierarchyFromGlobals();if(camAt<1){const q=reducedMotion?1:ease(clamp((now-camStart)/700,0,1));camera={p:[lerp(camFrom.p[0],camTo.p[0],q),lerp(camFrom.p[1],camTo.p[1],q),lerp(camFrom.p[2],camTo.p[2],q)],t:[lerp(camFrom.t[0],camTo.t[0],q),lerp(camFrom.t[1],camTo.t[1],q),lerp(camFrom.t[2],camTo.t[2],q)],f:lerp(camFrom.f,camTo.f,q)};camAt=q}gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);floor();environment(now/1000);workspace(now/1000);drawWorkspaceZipskills(now/1000);drawBackendDisplayRing(now/1000);drawSetupConfigRing({ profile, seatCount, reducedMotion, draw, CYL, TORUS, CUBE, T, S, RY, mul, M, focusedIndex: ringFocus.ring === 'r2' ? ringFocus.index : -1 }, now/1000);seats.forEach((seat,index)=>drawSeat(seat,index,now/1000));contributionEffect(seats[selectedSeat]);requestAnimationFrame(frame)}
canvas.addEventListener('click',event=>{const r=canvas.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;if(x>.38&&x<.62&&y>.38&&y<.58){if(!hierarchyRuntime.openParentId){clearRingFocus(ringFocus);updateLabels();}return;}if(!hierarchyRuntime.openParentId&&y>0.28&&y<0.48){if(x<=0.28){cycleRingFocus(ringFocus,'r1',1);updateLabels();return;}if(x>=0.72){cycleRingFocus(ringFocus,'r2',1);updateLabels();return;}}const next=(selectedSeat+1)%seatCount;selectSeatShell(next);});
let navOrbitYaw = 0, navOrbitPitch = 0, navZoom = 1;
let touchState = null;
function applyNavCamera() {
  if (hierarchyRuntime.openParentId) return;
  if (hierarchyRuntime.inputMode && hierarchyRuntime.inputMode !== HIERARCHY_INPUT.NAVIGATE) return;
  const base = cameras().HERO_WIDE;
  const dist = base.p[2] * navZoom;
  const cy = base.p[1] + navOrbitPitch * 1.2;
  const yaw = navOrbitYaw;
  camera = { p: [Math.sin(yaw) * dist * 0.85, cy, Math.cos(yaw) * dist], t: base.t.slice(), f: base.f };
  camAt = 1;
}
canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  if (hierarchyRuntime.openParentId) return;
  const delta = Math.sign(event.deltaY) * 0.08;
  navZoom = clamp(navZoom + delta, NAV_ZOOM_MIN, NAV_ZOOM_MAX);
  if (reducedMotion) navZoom = clamp(navZoom, NAV_ZOOM_REDUCED_MIN, NAV_ZOOM_REDUCED_MAX);
  applyNavCamera();
}, { passive: false });
canvas.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' || event.button === 1 || event.button === 2 || event.shiftKey) {
    touchState = { id: event.pointerId, x: event.clientX, y: event.clientY, mode: 'orbit' };
    try { canvas.setPointerCapture(event.pointerId); } catch (_) {}
  }
});
canvas.addEventListener('pointermove', (event) => {
  if (!touchState || touchState.id !== event.pointerId) return;
  if (hierarchyRuntime.openParentId) return;
  const dx = (event.clientX - touchState.x) / Math.max(1, canvas.clientWidth);
  const dy = (event.clientY - touchState.y) / Math.max(1, canvas.clientHeight);
  touchState.x = event.clientX; touchState.y = event.clientY;
  navOrbitYaw += dx * Math.PI;
  navOrbitPitch = clamp(navOrbitPitch + dy * 1.2, -0.45, 0.55);
  if (reducedMotion) { navOrbitYaw = 0; navOrbitPitch = 0; }
  applyNavCamera();
});
canvas.addEventListener('pointerup', (event) => { if (touchState && touchState.id === event.pointerId) touchState = null; });
canvas.addEventListener('pointercancel', () => { touchState = null; });
let pinchStart = null;
canvas.addEventListener('touchstart', (event) => {
  if (event.touches.length === 2) {
    const [a, b] = event.touches;
    pinchStart = { dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), zoom: navZoom };
    event.preventDefault();
  }
}, { passive: false });
canvas.addEventListener('touchmove', (event) => {
  if (event.touches.length === 2 && pinchStart) {
    const [a, b] = event.touches;
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    navZoom = clamp(pinchStart.zoom * (pinchStart.dist / Math.max(1, dist)), NAV_ZOOM_MIN, NAV_ZOOM_MAX);
    if (reducedMotion) navZoom = clamp(navZoom, NAV_ZOOM_REDUCED_MIN, NAV_ZOOM_REDUCED_MAX);
    applyNavCamera();
    event.preventDefault();
  }
}, { passive: false });
canvas.addEventListener('touchend', () => { pinchStart = null; });
document.querySelectorAll('[data-camera]').forEach(button=>button.addEventListener('click',()=>setCamera(button.dataset.camera)));
demoButton?.addEventListener('click',()=>demo?stopLoop():startLoop());
motionButton?.addEventListener('click',()=>{setReducedMotion(!reducedMotion);setCamera(cameraId);updateLabels()});
window.addEventListener('keydown',event=>{if(event.key.toLowerCase()==='d')demo?stopLoop():startLoop();if(event.key.toLowerCase()==='m'){setReducedMotion(!reducedMotion);setCamera(cameraId)}if(/^[1-8]$/.test(event.key))setSeatCount(Number(event.key));if(event.key==='0')setSeatCount(1);if(event.key==='Enter'){if(hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CONNECTION&&hierarchyRuntime.focusedLeafId!==HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE){focusHierarchyLeaf(hierarchyRuntime,HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE);event.preventDefault()}else if(hierarchyRuntime.focusedLeafId===HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE){const order=[HEALTH_STATUS.UNKNOWN,HEALTH_STATUS.LOADING,HEALTH_STATUS.UNAVAILABLE];const i=order.indexOf(hierarchyRuntime.healthStatus||HEALTH_STATUS.UNKNOWN);hierarchyRuntime.healthStatus=order[(i+1)%order.length];event.preventDefault()}else{selectSeatShell(selectedSeat);event.preventDefault()}}if(event.key==='Escape'){if(hierarchyRuntime.focusedLeafId){clearLeafFocus(hierarchyRuntime);event.preventDefault()}else{returnFromSeatShell();event.preventDefault()}}if(event.key==='z'||event.key==='x'){if(!hierarchyRuntime.openParentId){cycleRingFocus(ringFocus,'r0',event.key==='z'?1:-1);event.preventDefault()}}if(event.key==='['||event.key===']'){if(!hierarchyRuntime.openParentId){cycleRingFocus(ringFocus,'r1',event.key===']'?1:-1);event.preventDefault()}}if(event.key==='{'||event.key==='}'||event.key===';'||event.key==="'"){if(!hierarchyRuntime.openParentId){cycleRingFocus(ringFocus,'r2',(event.key==='}'||event.key==="'")?1:-1);event.preventDefault()}}if(event.key==='.'&&!hierarchyRuntime.openParentId){clearRingFocus(ringFocus);event.preventDefault()}if((event.key==='ArrowRight'||event.key==='ArrowLeft')&&hierarchyRuntime.openParentId){const list=SEAT_SHELL_V1_CHILDREN;const cur=Math.max(0,list.indexOf(hierarchyRuntime.focusedChildId));const next=event.key==='ArrowRight'?(cur+1)%list.length:(cur-1+list.length)%list.length;focusHierarchyChild(hierarchyRuntime,list[next],{nowMs:performance.now(),snap:HIERARCHY_REDUCED_SNAP&&reducedMotion});event.preventDefault()}if((event.key==='c'||event.key==='C')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CONNECTION){requestConnectionConfigureHandoff({targetSection:'connection'});event.preventDefault()}if((event.key==='b'||event.key==='B')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_BEHAVIOR){requestBehaviorConfigureHandoff({targetSection:'behavior'});event.preventDefault()}if((event.key==='t'||event.key==='T')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TOOLKIT){requestToolkitConfigureHandoff({targetSection:'toolkit'});event.preventDefault()}if((event.key==='k'||event.key==='K')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_CAPABILITIES){requestCapabilitiesConfigureHandoff({targetSection:'capabilities'});event.preventDefault()}if((event.key==='a'||event.key==='A')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_AUTHORIZATION){requestAuthorizationConfigureHandoff({targetSection:'authorization'});event.preventDefault()}if((event.key==='w'||event.key==='W')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_WORKSPACE_SCOPE){requestWorkspaceScopeConfigureHandoff({targetSection:'workspace-scope'});event.preventDefault()}if((event.key==='e'||event.key==='E')&&hierarchyRuntime.openParentId&&hierarchyRuntime.focusedChildId===HIERARCHY_PART.SEAT_TASK_EVIDENCE){requestTaskEvidenceConfigureHandoff({targetSection:'task-evidence'});event.preventDefault()}updateLabels()});
window.addEventListener('teamai:web-ai-seat-unlocked',event=>setSeatCount(event.detail?.seatCount??event.detail?.count??seatCount+1));
window.TeamAiHero={setSeatCount,getSeatCount:()=>seatCount,setTeamSize:setSeatCount,setCamera,startLoop:()=>startLoop(),stopLoop:()=>stopLoop(),getState:()=>state,getTraceCount:()=>traces.length,getSelectedSeat:()=>selectedSeat,getContributionProgress:()=>contribution,getReducedMotion:()=>reducedMotion,setReducedMotion:(v)=>setReducedMotion(v),getHierarchyState:()=>getHierarchyState(),selectSeatShell:(i)=>selectSeatShell(i),closeHierarchyParent:()=>returnFromSeatShell(),HIERARCHY_PART,HIERARCHY_PHASE,SEAT_SHELL_V1_CHILDREN,SEAT_REST_Y,SEAT_OPEN_LIFT,CHILD_STEP_Y,CHILD_STEP_R,OPEN_DURATION_MS,CLOSE_DURATION_MS,focusChild:(id)=>focusHierarchyChild(hierarchyRuntime,id),focusLeaf:(id)=>focusHierarchyLeaf(hierarchyRuntime,id),HEALTH_STATUS,healthLeafAccessibleName,BACKEND_DISPLAY_V1,SETUP_CONFIG_V1,SEAT_TOOLKIT_V1,toolkitChildAccessibleName,WORKSPACE_ZIPSKILLS_V1,zipskillsAccessibleName,RING_R0_ZIP_SCALE,RING_R1_SCALE,RING_R2_SCALE,NAV_ZOOM_MIN,NAV_ZOOM_MAX,getRingFocus:()=>({ring:ringFocus.ring,index:ringFocus.index}),focusRing:(ring,i)=>{focusRingItem(ringFocus,ring,i);updateLabels();return ringFocusAccessibleName(ringFocus);},cycleRing:(ring,d=1)=>{cycleRingFocus(ringFocus,ring,d);updateLabels();return ringFocusAccessibleName(ringFocus);},getNavZoom:()=>navZoom,resetNav:()=>{navOrbitYaw=0;navOrbitPitch=0;navZoom=1;applyNavCamera();},getConnectionBranchAmount:()=>getConnectionBranchAmount(hierarchyRuntime),requestConnectionConfigure:()=>requestConnectionConfigureHandoff({targetSection:'connection'}),CONNECTION_BRANCH_MS,connectionFaceAccessibleName,getBehaviorBranchAmount:()=>getBehaviorBranchAmount(hierarchyRuntime),requestBehaviorConfigure:()=>requestBehaviorConfigureHandoff({targetSection:'behavior'}),BEHAVIOR_BRANCH_MS,behaviorFaceAccessibleName,getToolkitBranchAmount:()=>getToolkitBranchAmount(hierarchyRuntime),requestToolkitConfigure:()=>requestToolkitConfigureHandoff({targetSection:'toolkit'}),TOOLKIT_BRANCH_MS,toolkitFaceAccessibleName,getCapabilitiesBranchAmount:()=>getCapabilitiesBranchAmount(hierarchyRuntime),requestCapabilitiesConfigure:()=>requestCapabilitiesConfigureHandoff({targetSection:'capabilities'}),CAPABILITIES_BRANCH_MS,capabilitiesFaceAccessibleName,getAuthorizationBranchAmount:()=>getAuthorizationBranchAmount(hierarchyRuntime),requestAuthorizationConfigure:()=>requestAuthorizationConfigureHandoff({targetSection:'authorization'}),AUTHORIZATION_BRANCH_MS,authorizationFaceAccessibleName,getWorkspaceScopeBranchAmount:()=>getWorkspaceScopeBranchAmount(hierarchyRuntime),requestWorkspaceScopeConfigure:()=>requestWorkspaceScopeConfigureHandoff({targetSection:'workspace-scope'}),WORKSPACE_SCOPE_BRANCH_MS,workspaceScopeFaceAccessibleName,getTaskEvidenceBranchAmount:()=>getTaskEvidenceBranchAmount(hierarchyRuntime),requestTaskEvidenceConfigure:()=>requestTaskEvidenceConfigureHandoff({targetSection:'task-evidence'}),TASK_EVIDENCE_BRANCH_MS,taskEvidenceFaceAccessibleName};
const query=new URLSearchParams(location.search);if(query.has('seats'))setSeatCount(Number(query.get('seats')));
syncReducedMotionFromDocument();
setCamera('HERO_WIDE');updateLabels();requestAnimationFrame(frame);
