const canvas = document.querySelector('#hero-canvas');
const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
if (!gl) throw new Error('WebGL is required for the 3D Hero.');

const vertexSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uMvp;
uniform mat4 uModel;
varying vec3 vNormal;
varying vec3 vWorld;
void main(){
  vec4 world = uModel * vec4(aPosition, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(uModel) * aNormal);
  gl_Position = uMvp * vec4(aPosition, 1.0);
}`;

const fragmentSource = `
precision mediump float;
uniform vec3 uColor;
uniform vec3 uSpecular;
uniform float uRoughness;
uniform float uEmission;
uniform float uAlpha;
varying vec3 vNormal;
varying vec3 vWorld;
void main(){
  vec3 n = normalize(vNormal);
  vec3 key = normalize(vec3(-0.55, 0.92, 0.42));
  vec3 fill = normalize(vec3(0.72, 0.28, -0.58));
  vec3 view = normalize(vec3(-vWorld.x * 0.04, 1.0, 4.0));
  float diff = 0.34 + 0.62 * max(dot(n, key), 0.0) + 0.18 * max(dot(n, fill), 0.0);
  vec3 halfVec = normalize(key + view);
  float spec = pow(max(dot(n, halfVec), 0.0), mix(90.0, 10.0, clamp(uRoughness, 0.0, 1.0)));
  float rim = pow(1.0 - max(dot(n, view), 0.0), 3.2);
  vec3 lit = uColor * diff + uSpecular * spec * (1.0 - uRoughness * 0.75);
  lit += uColor * uEmission * (0.28 + rim * 1.6);
  gl_FragColor = vec4(lit, uAlpha);
}`;

function compile(type, source){
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}
const program = gl.createProgram();
gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
gl.linkProgram(program);
if(!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
gl.useProgram(program);

const loc = {
  position: gl.getAttribLocation(program,'aPosition'), normal: gl.getAttribLocation(program,'aNormal'),
  mvp: gl.getUniformLocation(program,'uMvp'), model: gl.getUniformLocation(program,'uModel'),
  color: gl.getUniformLocation(program,'uColor'), specular: gl.getUniformLocation(program,'uSpecular'),
  roughness: gl.getUniformLocation(program,'uRoughness'), emission: gl.getUniformLocation(program,'uEmission'),
  alpha: gl.getUniformLocation(program,'uAlpha'),
};

function mesh(data){
  const position = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, position); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data.positions),gl.STATIC_DRAW);
  const normal = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, normal); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data.normals),gl.STATIC_DRAW);
  return {position,normal,count:data.positions.length/3};
}

function bevelCube(){
  const p=[-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5,0.5,-0.5, -0.5,0.5,-0.5, -0.5,-0.5,0.5, 0.5,-0.5,0.5, 0.5,0.5,0.5, -0.5,0.5,0.5];
  const faces=[[0,1,2,3,0,0,-1],[4,7,6,5,0,0,1],[0,4,5,1,0,-1,0],[3,2,6,7,0,1,0],[0,3,7,4,-1,0,0],[1,5,6,2,1,0,0]];
  const positions=[],normals=[];
  for(const [a,b,c,d,nx,ny,nz] of faces){for(const i of [a,b,c,a,c,d]){positions.push(p[i*3],p[i*3+1],p[i*3+2]);normals.push(nx,ny,nz);}}
  return mesh({positions,normals});
}
function cylinder(radial=64){
  const positions=[],normals=[];
  for(let i=0;i<radial;i++){
    const a0=i/radial*Math.PI*2,a1=(i+1)/radial*Math.PI*2;
    const x0=Math.cos(a0),z0=Math.sin(a0),x1=Math.cos(a1),z1=Math.sin(a1);
    const side=[[x0,-.5,z0,x0,0,z0],[x1,-.5,z1,x1,0,z1],[x1,.5,z1,x1,0,z1],[x0,-.5,z0,x0,0,z0],[x1,.5,z1,x1,0,z1],[x0,.5,z0,x0,0,z0]];
    side.forEach(v=>{positions.push(v[0],v[1],v[2]);normals.push(v[3],v[4],v[5]);});
    for(const cap of [-1,1]){const y=cap*.5,n=[0,cap,0];const tri=cap>0?[[0,y,0],[x0,y,z0],[x1,y,z1]]:[[0,y,0],[x1,y,z1],[x0,y,z0]];tri.forEach(v=>{positions.push(v[0],v[1],v[2]);normals.push(...n);});}
  }
  return mesh({positions,normals});
}
const CUBE=bevelCube(), CYL=cylinder();
const COLORS={
  shell:[0.90,0.89,0.85], bright:[0.98,0.97,0.93], metal:[0.52,0.56,0.55], metalLight:[0.73,0.74,0.70], glass:[0.66,0.76,0.79], dark:[0.16,0.17,0.16], energy:[1.00,0.58,0.13], trace:[0.34,0.47,0.44], floor:[0.78,0.77,0.74]
};
const seats=[
 {id:'seat-1',label:'Web AI Seat 1',angle:-Math.PI/2,accent:[0.66,0.57,0.46]},
 {id:'seat-2',label:'Web AI Seat 2',angle:0,accent:[0.48,0.60,0.57]},
 {id:'seat-3',label:'Web AI Seat 3',angle:Math.PI/2,accent:[0.58,0.51,0.66]},
 {id:'seat-4',label:'Web AI Seat 4',angle:Math.PI,accent:[0.69,0.57,0.43]},
];
const cameras={
 HERO_WIDE:{pos:[0,7.5,10.8],target:[0,.7,0],fov:39}, HERO_LOW_ORBIT:{pos:[7.9,3.25,8.55],target:[0,.72,0],fov:40},
 TEAM_ORBIT:{pos:[10.6,5.8,1.8],target:[0,.78,0],fov:42}, SEAT_CLOSE:{pos:[5.15,2.45,5.8],target:[0,.84,0],fov:36},
 WORKSPACE_CLOSE:{pos:[4.0,2.45,5.0],target:[0,.55,0],fov:33}, TURN_FOLLOW:{pos:[4.6,1.95,5.15],target:[0,.66,0],fov:35},
 OVERHEAD_MAP:{pos:[0,12.4,.25],target:[0,0,0],fov:50}, DETAIL_ANCHOR:{pos:[2.45,1.9,3.05],target:[0,.78,0],fov:31}
};
let cameraId='HERO_WIDE', camera={...cameras[cameraId]};
let selectedSeat=0,state='IDLE',demo=false,reducedMotion=false,stateStarted=performance.now(),contributionProgress=0;
let traces=[{angle:-2.3,scale:.86},{angle:-.55,scale:1.1},{angle:.8,scale:.78},{angle:2.35,scale:.96}];
const stateLabel=document.querySelector('#state-label'),seatLabel=document.querySelector('#seat-label'),demoButton=document.querySelector('#demo-toggle'),motionButton=document.querySelector('#motion-toggle'),shell=document.querySelector('.hero-shell');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)); const lerp=(a,b,t)=>a+(b-a)*t; const ease=t=>t*t*(3-2*t);
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], scale=(a,s)=>[a[0]*s,a[1]*s,a[2]*s], len=a=>Math.hypot(...a), norm=a=>scale(a,1/(len(a)||1)), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function i(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]} function mul(a,b){const r=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r0=0;r0<4;r0++)for(let k=0;k<4;k++)r[c*4+r0]+=a[k*4+r0]*b[c*4+k];return r}
function tr(x,y,z){const m=i();m[12]=x;m[13]=y;m[14]=z;return m} function sc(x,y,z){const m=i();m[0]=x;m[5]=y;m[10]=z;return m}
function ry(a){const c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]}
function rx(a){const c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]}
function axis(a,ang){const[x,y,z]=norm(a),c=Math.cos(ang),s=Math.sin(ang),t=1-c;return[t*x*x+c,t*x*y+s*z,t*x*z-s*y,0,t*x*y-s*z,t*y*y+c,t*y*z+s*x,0,t*x*z+s*y,t*y*z-s*x,t*z*z+c,0,0,0,0,1]}
function alignY(d){d=norm(d);const y=[0,1,0],a=cross(y,d),dot=clamp(y[0]*d[0]+y[1]*d[1]+y[2]*d[2],-1,1);if(len(a)<1e-4)return dot>0?i():rx(Math.PI);return axis(a,Math.acos(dot))}
function persp(fov,aspect,near,far){const f=1/Math.tan(fov*Math.PI/360),nf=1/(near-far);return[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]}
function look(eye,target,up=[0,1,0]){const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1]}
function model(pos,rot,size){return mul(mul(tr(...pos),rot),sc(...size))}
function draw(mdl,color,{spec=[.5,.52,.48],rough=.72,emission=0,alpha=1}={}){const v=look(camera.pos,camera.target),p=persp(camera.fov,canvas.width/canvas.height,.1,70),mvp=mul(p,mul(v,mdl));gl.uniformMatrix4fv(loc.mvp,false,new Float32Array(mvp));gl.uniformMatrix4fv(loc.model,false,new Float32Array(mdl));gl.uniform3fv(loc.color,new Float32Array(color));gl.uniform3fv(loc.specular,new Float32Array(spec));gl.uniform1f(loc.roughness,rough);gl.uniform1f(loc.emission,emission);gl.uniform1f(loc.alpha,alpha);gl.bindBuffer(gl.ARRAY_BUFFER,m.position);gl.enableVertexAttribArray(loc.position);gl.vertexAttribPointer(loc.position,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.normal);gl.enableVertexAttribArray(loc.normal);gl.vertexAttribPointer(loc.normal,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,m.count)}
function seatPos(seat,r=5.25){return[Math.cos(seat.angle)*r,.62,Math.sin(seat.angle)*r]}; const center=[0,.84,0];
function cubic(a,b,c,d,t){const u=1-t;return[u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1],u*u*u*a[2]+3*u*u*t*b[2]+3*u*t*t*c[2]+t*t*t*d[2]]}
function floor(t){draw(CUBE,[...model([0,-.28,0],i(),[15,.56,15])],[...COLORS.floor]);for(let g=-6;g<=6;g++){draw(CUBE,model([g*1.8,.012,0],i(),[.012,.018,15]),[.72,.71,.68]);draw(CUBE,model([0,.012,g*1.8],i(),[15,.018,.012]),[.72,.71,.68])}}
function workspace(t){
  draw(CYL,model([0,.46,0],i(),[6.0,.52,6.0]),COLORS.metal,{spec:[.82,.84,.80],rough:.42});
  draw(CYL,model([0,.74,0],i(),[5.55,.34,5.55]),COLORS.shell,{spec:[.62,.62,.58],rough:.60});
  draw(CYL,model([0,.94,0],i(),[4.85,.10,4.85]),COLORS.glass,{spec:[.92,.94,.92],rough:.24,alpha:.76});
  draw(CYL,model([0,1.02,0],i(),[3.6,.08,3.6]),COLORS.dark,{spec:[.40,.42,.40],rough:.68});
  const pulse=.5+.5*Math.sin(t*1.4); draw(CYL,model([0,1.075,0],i(),[3.28,.035,3.28]),COLORS.trace,{spec:[.5,.56,.52],rough:.58,emission:.06+pulse*.03});
  traces.forEach((trc,idx)=>{const x=Math.cos(trc.angle)*2.1,z=Math.sin(trc.angle)*2.1;draw(CUBE,model([x,1.16+0.018*Math.sin(t*1.5+idx),z],ry(trc.angle),[.55*trc.scale,.10,.26*trc.scale]),idx===traces.length-1&&state==='REFLECT'?COLORS.bright:COLORS.trace,{rough:.50,spec:[.65,.66,.62]})});
}
function seat(seatObj,index,t){const p=seatPos(seatObj),active=index===selectedSeat&&state!=='IDLE',wave=active?(state==='CONTRIBUTE'||state==='ACTIVE'?1:.35):0;const bob=(active?Math.sin(t*2.2)*.045:Math.sin(t*.7+index)*.018)*(reducedMotion?0.25:1);const toward=norm([-p[0],0,-p[2]]);const baseY=p[1]+bob;draw(CYL,model([p[0],.28,p[2]],i(),[2.05,.45,2.05]),COLORS.metal,{spec:[.78,.80,.75],rough:.45});draw(CYL,model([p[0],.55+wave*.08,p[2]],i(),[1.75,.36,1.75]),active?seatObj.accent:COLORS.shell,{spec:[.75,.74,.70],rough:.58});draw(CUBE,model([p[0],baseY+.62,p[2]],ry(-seatObj.angle),[1.48,1.28,1.18]),active?COLORS.bright:COLORS.shell,{spec:[.82,.80,.75],rough:.63});draw(CUBE,model([p[0],baseY+1.30,p[2]],ry(seatObj.angle),[.82,.13,.66]),active?seatObj.accent:COLORS.metalLight,{spec:[.72,.72,.68],rough:.42,emission:wave*.10});draw(CYL,model([p[0]+toward[0]*.54,baseY+1.03,p[2]+toward[2]*.54],alignY(toward),[.22,.52,.22]),active?COLORS.energy:seatObj.accent,{spec:[1,0.82,.50],rough:.30,emission:wave*.16});if(active){draw(CYL,model([p[0],baseY+.02,p[2]],i(),[2.28,.035,2.28]),seatObj.accent,{spec:[.8,.8,.75],rough:.48,emission:.025+wave*.035})}}
function contribution(t){if(state!=='CONTRIBUTE')return;const s=seatPos(seats[selectedSeat]),end=center,start=[s[0],1.12,s[2]],c1=[s[0]*.70,1.5,s[2]*.70],c2=[s[0]*.28,1.20,s[2]*.28],q=cubic(start,c1,c2,end,contributionProgress);const dir=sub(end,start);draw(CYL,model(q,alignY(dir),[.16,.55,.16]),COLORS.energy,{spec:[1,.9,.7],rough:.16,emission:.50});const tail=Math.max(0,contributionProgress-.12),qt=cubic(start,c1,c2,end,tail);draw(CYL,model(qt,alignY(dir),[.055,.85,.055]),COLORS.energy,{spec:[1,.88,.62],rough:.18,emission:.32,alpha:.55})}
function resize(){const dpr=Math.min(devicePixelRatio||1,2);const w=Math.max(1,Math.floor(canvas.clientWidth*dpr)),h=Math.max(1,Math.floor(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
function targetCamera(id){cameraId=id;const c=cameras[id];if(reducedMotion){camera={...c};return}camera={...camera};camera.pos=c.pos.slice();camera.target=c.target.slice();camera.fov=c.fov}
function setState(next){state=next;stateStarted=performance.now();contributionProgress=0;shell.dataset.state=next;stateLabel.textContent=next;seatLabel.textContent=next==='HANDOFF'?`Next: ${seats[(selectedSeat+1)%seats.length].label}`:`${seats[selectedSeat].label} · ${next}`}
function update(now){const dur=reducedMotion?420:900;const elapsed=now-stateStarted;if(demo){const phases={IDLE:850,FOCUS:720,ACTIVE:950,CONTRIBUTE:1100,ABSORB:520,REFLECT:720,HANDOFF:600};if(elapsed>phases[state]){const order=['IDLE','FOCUS','ACTIVE','CONTRIBUTE','ABSORB','REFLECT','HANDOFF'];const ix=(order.indexOf(state)+1)%order.length;if(state==='HANDOFF')selectedSeat=(selectedSeat+1)%seats.length;setState(order[ix]);}if(state==='CONTRIBUTE')contributionProgress=clamp(elapsed/1100,0,1);if(state==='ABSORB'&&elapsed>340)traces.push({angle:(selectedSeat*1.55)%6.28,scale:.82+.18*Math.sin(selectedSeat)});}else if(state==='CONTRIBUTE'){contributionProgress=clamp(elapsed/dur,0,1)}
  stateLabel.textContent=state;seatLabel.textContent=state==='HANDOFF'?`Next: ${seats[(selectedSeat+1)%seats.length].label}`:`${seats[selectedSeat].label} · ${state}`;
}
function render(now){resize();const t=now*.001;gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);floor(t);workspace(t);seats.forEach(seat.bind(null));for(let j=0;j<seats.length;j++)seat(seats[j],j,t);contribution(t);requestAnimationFrame(frame)}
function frame(now){update(now);render(now)}

document.querySelectorAll('[data-camera]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.camera;targetCamera(id);if(id==='SEAT_CLOSE')setState('FOCUS');if(id==='WORKSPACE_CLOSE')setState('REFLECT')}));
demoButton.addEventListener('click',()=>{demo=!demo;demoButton.textContent=demo?'Stop turn loop':'Start turn loop';if(demo&&state==='IDLE')setState('FOCUS');if(!demo)setState('IDLE')});
motionButton.addEventListener('click',()=>{reducedMotion=!reducedMotion;motionButton.textContent=`Reduced motion: ${reducedMotion?'on':'off'}`;if(reducedMotion)camera={...cameras[cameraId]}});
window.addEventListener('keydown',(e)=>{if(e.key.toLowerCase()==='d')demoButton.click();if(e.key.toLowerCase()==='m')motionButton.click();if(e.key>='1'&&e.key<='5'){const ids=['HERO_WIDE','HERO_LOW_ORBIT','TEAM_ORBIT','WORKSPACE_CLOSE','OVERHEAD_MAP'];targetCamera(ids[Number(e.key)-1])}});
setState('IDLE');requestAnimationFrame(frame);
