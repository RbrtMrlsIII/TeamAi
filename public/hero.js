const canvas = document.querySelector('#hero-canvas');
const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
if (!gl) throw new Error('WebGL is required for the 3D Hero prototype.');

const vertexSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uMvp;
uniform mat4 uModel;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vec4 world = uModel * vec4(aPosition, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(uModel) * aNormal);
  gl_Position = uMvp * vec4(aPosition, 1.0);
}
`;

const fragmentSource = `
precision mediump float;
uniform vec3 uColor;
uniform float uEmission;
uniform float uAlpha;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vec3 lightA = normalize(vec3(-0.45, 0.90, 0.55));
  vec3 lightB = normalize(vec3(0.65, 0.30, -0.35));
  float diffuse = 0.34 + 0.62 * max(dot(normalize(vNormal), lightA), 0.0);
  diffuse += 0.16 * max(dot(normalize(vNormal), lightB), 0.0);
  float edge = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
  vec3 lit = uColor * diffuse;
  lit += uColor * (uEmission * (0.55 + edge));
  gl_FragColor = vec4(lit, uAlpha);
}
`;

function compile(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

const program = gl.createProgram();
gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
gl.useProgram(program);

const loc = {
  position: gl.getAttribLocation(program, 'aPosition'),
  normal: gl.getAttribLocation(program, 'aNormal'),
  mvp: gl.getUniformLocation(program, 'uMvp'),
  model: gl.getUniformLocation(program, 'uModel'),
  color: gl.getUniformLocation(program, 'uColor'),
  emission: gl.getUniformLocation(program, 'uEmission'),
  alpha: gl.getUniformLocation(program, 'uAlpha'),
};

function mesh(data) {
  const position = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.positions), gl.STATIC_DRAW);
  const normal = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normal);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.normals), gl.STATIC_DRAW);
  return { position, normal, count: data.positions.length / 3 };
}

function cube() {
  const p = [
    -0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5,0.5,-0.5, -0.5,0.5,-0.5,
    -0.5,-0.5,0.5, 0.5,-0.5,0.5, 0.5,0.5,0.5, -0.5,0.5,0.5,
  ];
  const faces = [
    [0,1,2,3, 0,0,-1], [4,7,6,5, 0,0,1], [0,4,5,1, 0,-1,0],
    [3,2,6,7, 0,1,0], [0,3,7,4, -1,0,0], [1,5,6,2, 1,0,0],
  ];
  const positions = [], normals = [];
  for (const [a,b,c,d,nx,ny,nz] of faces) {
    for (const i of [a,b,c,a,c,d]) {
      positions.push(p[i*3],p[i*3+1],p[i*3+2]);
      normals.push(nx,ny,nz);
    }
  }
  return mesh({positions,normals});
}

function cylinder(radial = 48) {
  const positions = [], normals = [];
  for (let i = 0; i < radial; i++) {
    const a0 = (i / radial) * Math.PI * 2;
    const a1 = ((i + 1) / radial) * Math.PI * 2;
    const x0 = Math.cos(a0), z0 = Math.sin(a0), x1 = Math.cos(a1), z1 = Math.sin(a1);
    const side = [
      [x0, -.5, z0, x0,0,z0], [x1, -.5, z1, x1,0,z1], [x1, .5, z1, x1,0,z1],
      [x0, -.5, z0, x0,0,z0], [x1, .5, z1, x1,0,z1], [x0, .5, z0, x0,0,z0],
    ];
    side.forEach(v => { positions.push(v[0],v[1],v[2]); normals.push(v[3],v[4],v[5]); });
    for (const cap of [-1,1]) {
      const y = cap * .5;
      const n = [0,cap,0];
      const tri = cap > 0 ? [[0,y,0],[x0,y,z0],[x1,y,z1]] : [[0,y,0],[x1,y,z1],[x0,y,z0]];
      tri.forEach(v => { positions.push(v[0],v[1],v[2]); normals.push(...n); });
    }
  }
  return mesh({positions,normals});
}

const CUBE = cube();
const CYL = cylinder();

const COLORS = {
  shell: [0.86, 0.85, 0.81],
  shellBright: [0.96, 0.95, 0.91],
  metal: [0.58, 0.61, 0.60],
  glass: [0.73, 0.82, 0.84],
  dark: [0.17, 0.18, 0.17],
  energy: [1.00, 0.64, 0.20],
  trace: [0.43, 0.55, 0.52],
  floor: [0.78, 0.77, 0.73],
};

const seats = [
  { id: 'seat-1', label: 'Web AI Seat 1', angle: -Math.PI / 2, accent: [0.62,0.55,0.45] },
  { id: 'seat-2', label: 'Web AI Seat 2', angle: 0, accent: [0.51,0.60,0.58] },
  { id: 'seat-3', label: 'Web AI Seat 3', angle: Math.PI / 2, accent: [0.58,0.51,0.62] },
  { id: 'seat-4', label: 'Web AI Seat 4', angle: Math.PI, accent: [0.62,0.56,0.48] },
];

const cameras = {
  HERO_WIDE: { pos:[0,7.9,10.6], target:[0,0.65,0], fov:40 },
  HERO_LOW_ORBIT: { pos:[7.8,3.4,8.3], target:[0,0.65,0], fov:42 },
  TEAM_ORBIT: { pos:[10.8,5.9,1.3], target:[0,0.75,0], fov:44 },
  SEAT_CLOSE: { pos:[4.6,2.5,6.2], target:[0,0.85,0], fov:38 },
  WORKSPACE_CLOSE: { pos:[3.8,2.7,5.2], target:[0,0.45,0], fov:35 },
  TURN_FOLLOW: { pos:[4.4,2.0,5.2], target:[0,0.65,0], fov:36 },
  OVERHEAD_MAP: { pos:[0,12.8,0.35], target:[0,0,0], fov:52 },
  DETAIL_ANCHOR: { pos:[2.2,1.9,3.0], target:[0,0.65,0], fov:32 },
};

let cameraId = 'HERO_WIDE';
let camera = { ...cameras[cameraId] };
let selectedSeat = 0;
let state = 'IDLE';
let demo = false;
let reducedMotion = false;
let stateStarted = performance.now();
let contributionProgress = 0;
let traces = [0.15, 0.40, 0.67];

const stateLabel = document.querySelector('#state-label');
const seatLabel = document.querySelector('#seat-label');
const demoButton = document.querySelector('#demo-toggle');
const motionButton = document.querySelector('#motion-toggle');

function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function lerp(a,b,t){ return a+(b-a)*t; }
function ease(t){ return t*t*(3-2*t); }

function v3sub(a,b){ return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]; }
function v3add(a,b){ return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]; }
function v3scale(a,s){ return [a[0]*s,a[1]*s,a[2]*s]; }
function v3len(a){ return Math.hypot(a[0],a[1],a[2]); }
function v3norm(a){ const l=v3len(a)||1; return v3scale(a,1/l); }
function v3cross(a,b){ return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }

a function noop() {}

function mat4Identity(){ return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]; }
function mat4Mul(a,b){
  const r = new Array(16).fill(0);
  for(let c=0;c<4;c++) for(let row=0;row<4;row++) for(let k=0;k<4;k++) r[c*4+row]+=a[k*4+row]*b[c*4+k];
  return r;
}
function mat4Translate(x,y,z){ const m=mat4Identity(); m[12]=x;m[13]=y;m[14]=z;return m; }
function mat4Scale(x,y,z){ const m=mat4Identity(); m[0]=x;m[5]=y;m[10]=z;return m; }
function mat4RotateY(a){ const c=Math.cos(a),s=Math.sin(a); return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]; }
function mat4RotateX(a){ const c=Math.cos(a),s=Math.sin(a); return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]; }
function mat4AxisAngle(axis, angle){
  const [x,y,z]=v3norm(axis), c=Math.cos(angle), s=Math.sin(angle), t=1-c;
  return [t*x*x+c,t*x*y+s*z,t*x*z-s*y,0, t*x*y-s*z,t*y*y+c,t*y*z+s*x,0, t*x*z+s*y,t*y*z-s*x,t*z*z+c,0, 0,0,0,1];
}
function alignY(dir){
  const d=v3norm(dir), y=[0,1,0], axis=v3cross(y,d), dot=clamp(y[0]*d[0]+y[1]*d[1]+y[2]*d[2],-1,1);
  if(v3len(axis)<0.0001) return dot>0 ? mat4Identity() : mat4RotateX(Math.PI);
  return mat4AxisAngle(axis, Math.acos(dot));
}
function perspective(fov, aspect, near, far){
  const f=1/Math.tan(fov*Math.PI/360), nf=1/(near-far);
  return [f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,(2*far*near)*nf,0];
}
function lookAt(eye,target,up=[0,1,0]){
  const z=v3norm(v3sub(eye,target)), x=v3norm(v3cross(up,z)), y=v3cross(z,x);
  return [x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0,
    -(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]), -(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]), -(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1];
}

function transform(pos, rot, scale){ return mat4Mul(mat4Mul(mat4Translate(...pos),rot),mat4Scale(...scale)); }
function draw(meshRef, model, color, emission=0, alpha=1){
  const aspect=canvas.width/canvas.height;
  const view=lookAt(camera.pos,camera.target);
  const proj=perspective(camera.fov,aspect,.1,60);
  const mvp=mat4Mul(proj,mat4Mul(view,model));
  gl.uniformMatrix4fv(loc.mvp,false,new Float32Array(mvp));
  gl.uniformMatrix4fv(loc.model,false,new Float32Array(model));
  gl.uniform3fv(loc.color,new Float32Array(color));
  gl.uniform1f(loc.emission,emission);
  gl.uniform1f(loc.alpha,alpha);
  gl.bindBuffer(gl.ARRAY_BUFFER,meshRef.position); gl.enableVertexAttribArray(loc.position); gl.vertexAttribPointer(loc.position,3,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,meshRef.normal); gl.enableVertexAttribArray(loc.normal); gl.vertexAttribPointer(loc.normal,3,gl.FLOAT,false,0,0);
  gl.drawArrays(gl.TRIANGLES,0,meshRef.count);
}

function seatPosition(seat, radius=5.2){ return [Math.cos(seat.angle)*radius, .56, Math.sin(seat.angle)*radius]; }
function workspaceCenter(){ return [0,.84,0]; }
function cubic(a,b,c,d,t){
  const u=1-t;
  return [u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],
          u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1],
          u*u*u*a[2]+3*u*u*t*b[2]+3*u*t*t*c[2]+t*t*t*d[2]];
}

function drawFloor(){
  draw(CUBE, transform([0,-.25,0],mat4Identity(),[15,.5,15]), COLORS.floor);
  for(let i=-6;i<=6;i++){
    draw(CUBE, transform([i*1.8,.01,0],mat4Identity(),[.015,.02,15]), [0.72,0.71,0.68], 0);
    draw(CUBE, transform([0,.01,i*1.8],mat4Identity(),[15,.02,.015]), [0.72,0.71,0.68], 0);
  }
}

function drawWorkspace(time){
  const breathe=1+Math.sin(time*.0012)*.008;
  draw(CYL, transform([0,.42,0],mat4Identity(),[3.3,.62,3.3]), COLORS.metal);
  draw(CYL, transform([0,.75,0],mat4Identity(),[3.08,.18,3.08]), COLORS.shellBright);
  draw(CYL, transform([0,.86,0],mat4Identity(),[2.67,.10,2.67]), COLORS.glass, .02, .74);
  draw(CYL, transform([0,.94,0],mat4Identity(),[2.08,.055,2.08]), COLORS.trace, .04, .90);
  draw(CYL, transform([0,.98,0],mat4Identity(),[1.62,.035,1.62]), COLORS.shellBright, .0, .95);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4 + time*.00008;
    const r=2.42;
    draw(CYL, transform([Math.cos(a)*r,.90,Math.sin(a)*r],mat4RotateY(a),[.16,.09,.34]), COLORS.metal);
  }
  traces.forEach((r,i)=>{
    const a=(i*2.05)+.4;
    draw(CYL, transform([Math.cos(a)*r*1.35,.98,Math.sin(a)*r*1.35],mat4Identity(),[.18,.05,.18]), COLORS.dark);
  });
  draw(CYL, transform([0,1.05,0],mat4Identity(),[.64,.06,.64]), COLORS.shell, .03 + (state==='ABSORB'||state==='REFLECT' ? .16 : 0), .95);
  if(state==='ABSORB'||state==='REFLECT'){
    const p=state==='ABSORB'?clamp((performance.now()-stateStarted)/650,0,1):clamp(1-(performance.now()-stateStarted)/520,0,1);
    draw(CYL, transform([0,1.10,0],mat4Identity(),[.72+p*1.15,.025,.72+p*1.15]), COLORS.energy, .30*p, .36*p);
  }
  void breathe;
}

function drawSeat(seat, index, time){
  const pos=seatPosition(seat);
  const isActive=index===selectedSeat && state!=='IDLE' && state!=='HANDOFF';
  const pulse=isActive ? 1+Math.sin(time*.005)*.03 : 1;
  const lift=isActive ? .12+Math.sin(time*.004)*.02 : 0;
  const rot=mat4RotateY(-seat.angle + Math.PI/2 + (isActive?Math.sin(time*.0012)*.035:0));
  draw(CYL, transform([pos[0],.31,pos[2]],rot,[1.32,.12,1.32]), COLORS.metal);
  draw(CYL, transform([pos[0],.49+lift,pos[2]],rot,[1.07,.62*pulse,1.07]), COLORS.shell);
  draw(CUBE, transform([pos[0],.89+lift,pos[2]],rot,[.68,.22,.82]), COLORS.shellBright);
  draw(CYL, transform([pos[0],1.06+lift,pos[2]],rot,[.31,.08,.31]), seat.accent, isActive?.10:.02, .96);
  const anchor=[pos[0]-.55*Math.cos(seat.angle),1.02+lift,pos[2]-.55*Math.sin(seat.angle)];
  draw(CYL, transform(anchor,alignY(v3sub(workspaceCenter(),anchor)),[.11,.48,.11]), COLORS.energy, isActive?.12:.015, .78);
}

function drawCorridors(time){
  for(const seat of seats){
    const start=seatPosition(seat,5.0), end=workspaceCenter();
    const dir=v3sub(end,start), len=v3len(dir), mid=v3scale(v3add(start,end),.5);
    draw(CYL, transform(mid,alignY(dir),[.045,len,.045]), COLORS.metal, .01, .20);
  }
  if(state==='CONTRIBUTE'||state==='ABSORB'){
    const start=seatPosition(seats[selectedSeat],4.95);
    const end=[0,1.07,0];
    const dir=v3sub(end,start);
    const b1=v3add(start,[0,1.25,0]);
    const b2=v3add(end,[0,.70,0]);
    contributionProgress = clamp((performance.now()-stateStarted)/1200,0,1);
    const t=ease(contributionProgress);
    for(let i=0;i<5;i++){
      const tt=clamp(t-i*.055,0,1);
      if(tt<=0) continue;
      const p=cubic(start,b1,b2,end,tt);
      const s=state==='ABSORB' ? 1-tt*.3 : 1;
      draw(CYL, transform(p,mat4Identity(),[.095*s,.13*s,.095*s]), COLORS.energy, .72, .82);
    }
  }
  if(state==='FOCUS'){
    const p=seatPosition(seats[selectedSeat],5.14);
    const r=1.65+Math.sin(time*.004)*.10;
    draw(CYL, transform([p[0],.20,p[2]],mat4Identity(),[r,.025,r]), seats[selectedSeat].accent, .08, .22);
  }
}

function nextState(){
  const order={IDLE:'FOCUS',FOCUS:'ACTIVE',ACTIVE:'CONTRIBUTE',CONTRIBUTE:'ABSORB',ABSORB:'REFLECT',REFLECT:'HANDOFF',HANDOFF:'FOCUS'};
  const next=order[state]||'IDLE';
  if(next==='HANDOFF') traces.push(Math.random()*.74+.14);
  if(next==='FOCUS' && state==='HANDOFF') selectedSeat=(selectedSeat+1)%seats.length;
  state=next;
  stateStarted=performance.now();
  stateLabel.textContent=state;
  seatLabel.textContent = state==='IDLE' ? `Next: ${seats[selectedSeat].label}` : `Active: ${seats[selectedSeat].label}`;
}

function setCamera(id){
  if(!cameras[id]) return;
  cameraId=id;
  const target=cameras[id];
  const factor=reducedMotion?1:0.0;
  if(factor===1) camera={...target};
  else camera={...camera, goal:target};
  if(id==='SEAT_CLOSE'){
    const p=seatPosition(seats[selectedSeat],6.7);
    camera.goal={pos:[p[0],2.2,p[2]],target:[0,.85,0],fov:36};
  }
}

function updateCamera(){
  const goal=camera.goal||cameras[cameraId];
  if(!goal) return;
  const speed=reducedMotion?1:.055;
  camera.pos=camera.pos.map((v,i)=>lerp(v,goal.pos[i],speed));
  camera.target=camera.target.map((v,i)=>lerp(v,goal.target[i],speed));
  camera.fov=lerp(camera.fov,goal.fov,speed);
}

function handlePointer(x,y){
  let closest=Infinity, winner=selectedSeat;
  for(let i=0;i<seats.length;i++){
    const p=project(seatPosition(seats[i],5.2));
    const d=Math.hypot(p[0]-x,p[1]-y);
    if(d<closest){closest=d;winner=i;}
  }
  if(closest<85){ selectedSeat=winner; seatLabel.textContent=`Selected: ${seats[winner].label}`; setCamera('SEAT_CLOSE'); state='FOCUS'; stateStarted=performance.now(); stateLabel.textContent=state; }
}

function project(world){
  const aspect=canvas.width/canvas.height;
  const view=lookAt(camera.pos,camera.target), proj=perspective(camera.fov,aspect,.1,60);
  const m=mat4Mul(proj,view), x=world[0],y=world[1],z=world[2];
  const cx=m[0]*x+m[4]*y+m[8]*z+m[12], cy=m[1]*x+m[5]*y+m[9]*z+m[13], cw=m[3]*x+m[7]*y+m[11]*z+m[15];
  return [(cx/cw*.5+.5)*canvas.width, (1-(cy/cw*.5+.5))*canvas.height];
}

function resize(){
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.floor(canvas.clientWidth*dpr); canvas.height=Math.floor(canvas.clientHeight*dpr);
  gl.viewport(0,0,canvas.width,canvas.height);
}
window.addEventListener('resize',resize); resize();
canvas.addEventListener('pointerdown',e=>handlePointer(e.clientX,e.clientY));

document.querySelectorAll('[data-camera]').forEach(button=>button.addEventListener('click',()=>setCamera(button.dataset.camera)));
demoButton.addEventListener('click',()=>{
  demo=!demo;
  demoButton.textContent=demo?'Pause turn loop':'Start turn loop';
  if(demo && state==='IDLE') nextState();
});
motionButton.addEventListener('click',()=>{
  reducedMotion=!reducedMotion;
  motionButton.textContent=`Reduced motion: ${reducedMotion?'on':'off'}`;
  if(reducedMotion) camera={...camera,goal:cameras[cameraId]};
});
window.addEventListener('keydown',e=>{
  const map={'0':'HERO_WIDE','1':'HERO_LOW_ORBIT','2':'TEAM_ORBIT','3':'SEAT_CLOSE','4':'WORKSPACE_CLOSE','5':'TURN_FOLLOW','6':'OVERHEAD_MAP','7':'DETAIL_ANCHOR'};
  if(map[e.key]) setCamera(map[e.key]);
  if(e.key===' ') { demo=!demo; demoButton.textContent=demo?'Pause turn loop':'Start turn loop'; if(demo&&state==='IDLE') nextState(); }
  if(e.key.toLowerCase()==='r') motionButton.click();
});

function loop(time){
  resize();
  gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  updateCamera();
  drawFloor(); drawCorridors(time); drawWorkspace(time); seats.forEach((seat,i)=>drawSeat(seat,i,time));
  if(demo && time-stateStarted>1450) nextState();
  if(state==='CONTRIBUTE' && cameraId!=='TURN_FOLLOW') setCamera('TURN_FOLLOW');
  if(state==='REFLECT') setCamera('WORKSPACE_CLOSE');
  if(state==='HANDOFF') setCamera('TEAM_ORBIT');
  requestAnimationFrame(loop);
}
stateLabel.textContent=state; seatLabel.textContent=`Next: ${seats[selectedSeat].label}`;
requestAnimationFrame(loop);
