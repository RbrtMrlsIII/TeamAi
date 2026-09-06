const canvas = document.querySelector('#hero-canvas');
const shell = document.querySelector('.hero-shell');
const stateLabel = document.querySelector('#state-label');
const seatLabel = document.querySelector('#seat-label');
const demoButton = document.querySelector('#demo-toggle');
const motionButton = document.querySelector('#motion-toggle');
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
  vec3 view = normalize(vec3(-vWorld.x * 0.04, 0.9, 4.0));
  float diffuse = 0.30 + 0.64 * max(dot(n, key), 0.0) + 0.16 * max(dot(n, fill), 0.0);
  vec3 halfVec = normalize(key + view);
  float spec = pow(max(dot(n, halfVec), 0.0), mix(90.0, 12.0, clamp(uRoughness, 0.0, 1.0)));
  float rim = pow(1.0 - max(dot(n, view), 0.0), 3.0);
  vec3 lit = uColor * diffuse + uSpecular * spec * (1.0 - uRoughness * 0.72);
  lit += uColor * uEmission * (0.24 + rim * 1.55);
  gl_FragColor = vec4(lit, uAlpha);
}`;
function compile(type, source){
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}
const program = gl.createProgram();
gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
gl.linkProgram(program);
if(!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
gl.useProgram(program);
const loc={
  position:gl.getAttribLocation(program,'aPosition'), normal:gl.getAttribLocation(program,'aNormal'),
  mvp:gl.getUniformLocation(program,'uMvp'), model:gl.getUniformLocation(program,'uModel'),
  color:gl.getUniformLocation(program,'uColor'), specular:gl.getUniformLocation(program,'uSpecular'),
  roughness:gl.getUniformLocation(program,'uRoughness'), emission:gl.getUniformLocation(program,'uEmission'),
  alpha:gl.getUniformLocation(program,'uAlpha')
};
function mesh(data){
  const position=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,position); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data.positions),gl.STATIC_DRAW);
  const normal=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,normal); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data.normals),gl.STATIC_DRAW);
  return {position,normal,count:data.positions.length/3};
}
function cube(){
  const p=[-0.5,-0.5,-0.5,0.5,-0.5,-0.5,0.5,0.5,-0.5,-0.5,0.5,-0.5,-0.5,-0.5,0.5,0.5,-0.5,0.5,0.5,0.5,0.5,-0.5,0.5,0.5];
  const faces=[[0,1,2,3,0,0,-1],[4,7,6,5,0,0,1],[0,4,5,1,0,-1,0],[3,2,6,7,0,1,0],[0,3,7,4,-1,0,0],[1,5,6,2,1,0,0]];
  const positions=[],normals=[];
  for(const [a,b,c,d,nx,ny,nz] of faces) for(const i of [a,b,c,a,c,d]){positions.push(p[i*3],p[i*3+1],p[i*3+2]);normals.push(nx,ny,nz)}
  return mesh({positions,normals});
}
function cylinder(radial=64){
  const positions=[],normals=[];
  for(let i=0;i<radial;i++){
    const a0=i/radial*Math.PI*2,a1=(i+1)/radial*Math.PI*2,x0=Math.cos(a0),z0=Math.sin(a0),x1=Math.cos(a1),z1=Math.sin(a1);
    const side=[[x0,-.5,z0,x0,0,z0],[x1,-.5,z1,x1,0,z1],[x1,.5,z1,x1,0,z1],[x0,-.5,z0,x0,0,z0],[x1,.5,z1,x1,0,z1],[x0,.5,z0,x0,0,z0]];
    side.forEach(v=>{positions.push(v[0],v[1],v[2]);normals.push(v[3],v[4],v[5])});
    for(const cap of [-1,1]){const y=cap*.5,n=[0,cap,0],tri=cap>0?[[0,y,0],[x0,y,z0],[x1,y,z1]]:[[0,y,0],[x1,y,z1],[x0,y,z0]];tri.forEach(v=>{positions.push(...v);normals.push(...n)})}
  }
  return mesh({positions,normals});
}
const CUBE=cube(),CYL=cylinder();
const COLORS={shell:[.90,.89,.85],bright:[.98,.97,.93],metal:[.52,.56,.55],metalLight:[.73,.74,.70],glass:[.66,.76,.79],dark:[.16,.17,.16],energy:[1,.58,.13],trace:[.34,.47,.44],floor:[.78,.77,.74]};
const seats=[
  {id:'seat-1',label:'Web AI Seat 1',angle:-Math.PI/2,accent:[.66,.57,.46]},
  {id:'seat-2',label:'Web AI Seat 2',angle:0,accent:[.48,.60,.57]},
  {id:'seat-3',label:'Web AI Seat 3',angle:Math.PI/2,accent:[.58,.51,.66]},
  {id:'seat-4',label:'Web AI Seat 4',angle:Math.PI,accent:[.69,.57,.43]}
];
const cameras={
  HERO_WIDE:{pos:[0,7.5,10.8],target:[0,.7,0],fov:39},
  HERO_LOW_ORBIT:{pos:[7.9,3.25,8.55],target:[0,.72,0],fov:40},
  TEAM_ORBIT:{pos:[10.6,5.8,1.8],target:[0,.78,0],fov:42},
  SEAT_CLOSE:{pos:[5.15,2.45,5.8],target:[0,.84,0],fov:36},
  WORKSPACE_CLOSE:{pos:[4.0,2.45,5.0],target:[0,.55,0],fov:33},
  TURN_FOLLOW:{pos:[4.6,1.95,5.15],target:[0,.66,0],fov:35},
  OVERHEAD_MAP:{pos:[0,12.4,.25],target:[0,0,0],fov:50},
  DETAIL_ANCHOR:{pos:[2.45,1.9,3.05],target:[0,.78,0],fov:31}
};
let cameraId='HERO_WIDE', camera={...cameras[cameraId]}, cameraFrom={...camera}, cameraTo={...camera}, cameraTravel=1, cameraTravelStarted=performance.now();
let selectedSeat=0,state='IDLE',demo=false,reducedMotion=false,stateStarted=performance.now(),contributionProgress=0;
let traces=[{angle:-2.3,scale:.86},{angle:-.55,scale:1.1},{angle:.8,scale:.78},{angle:2.35,scale:.96}];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)); const lerp=(a,b,t)=>a+(b-a)*t; const ease=t=>t*t*(3-2*t);
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], scale=(a,s)=>[a[0]*s,a[1]*s,a[2]*s], len=a=>Math.hypot(...a), norm=a=>scale(a,1/(len(a)||1)), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function identity(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}
function mul(a,b){const r=new Array(16).fill(0);for(let c=0;c<4;c++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)r[c*4+row]+=a[k*4+row]*b[c*4+k];return r}
function translate(x,y,z){const m=identity();m[12]=x;m[13]=y;m[14]=z;return m} function scaleM(x,y,z){const m=identity();m[0]=x;m[5]=y;m[10]=z;return m}
function rotateY(a){const c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]}
function rotateX(a){const c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]}
function axisAngle(axisValue,angle){const[x,y,z]=norm(axisValue),c=Math.cos(angle),s=Math.sin(angle),t=1-c;return[t*x*x+c,t*x*y+s*z,t*x*z-s*y,0,t*x*y-s*z,t*y*y+c,t*y*z+s*x,0,t*x*z+s*y,t*y*z-s*x,t*z*z+c,0,0,0,0,1]}
function alignY(dir){const d=norm(dir),y=[0,1,0],a=cross(y,d),dot=clamp(d[1],-1,1);if(len(a)<1e-4)return dot>0?identity():rotateX(Math.PI);return axisAngle(a,Math.acos(dot))}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov*Math.PI/360),nf=1/(near-far);return[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]}
function lookAt(eye,target,up=[0,1,0]){const z=norm(sub(eye,target)),x=norm(cross(up,z)),y=cross(z,x);return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*eye[0]+x[1]*eye[1]+x[2]*eye[2]),-(y[0]*eye[0]+y[1]*eye[1]+y[2]*eye[2]),-(z[0]*eye[0]+z[1]*eye[1]+z[2]*eye[2]),1]}
function mdl(pos,rot,size){return mul(mul(translate(...pos),rot),scaleM(...size))}
function draw(meshRef,modelMatrix,color,style={}){const view=lookAt(camera.pos,camera.target),proj=perspective(camera.fov,canvas.width/canvas.height,.1,70),mvp=mul(proj,mul(view,modelMatrix));gl.uniformMatrix4fv(loc.mvp,false,new Float32Array(mvp));gl.uniformMatrix4fv(loc.model,false,new Float32Array(modelMatrix));gl.uniform3fv(loc.color,new Float32Array(color));gl.uniform3fv(loc.specular,new Float32Array(style.spec||[.5,.52,.48]));gl.uniform1f(loc.roughness,style.rough??.72);gl.uniform1f(loc.emission,style.emission??0);gl.uniform1f(loc.alpha,style.alpha??1);gl.bindBuffer(gl.ARRAY_BUFFER,meshRef.position);gl.enableVertexAttribArray(loc.position);gl.vertexAttribPointer(loc.position,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,meshRef.normal);gl.enableVertexAttribArray(loc.normal);gl.vertexAttribPointer(loc.normal,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,meshRef.count)}
function seatPos(seat,r=5.25){return[Math.cos(seat.angle)*r,.62,Math.sin(seat.angle)*r]}
const center=[0,.84,0];
function cubic(a,b,c,d,t){const u=1-t;return[u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1],u*u*u*a[2]+3*u*u*t*b[2]+3*u*t*t*c[2]+t*t*t*d[2]]}
function drawFloor(){draw(CUBE,mdl([0,-.28,0],identity(),[15,.56,15]),COLORS.floor,{rough:.88,spec:[.28,.29,.27]});for(let i=-6;i<=6;i++){draw(CUBE,mdl([i*1.8,.012,0],identity(),[.012,.018,15]),[.72,.71,.68],{rough:.96,spec:[.15,.16,.15]});draw(CUBE,mdl([0,.012,i*1.8],identity(),[15,.018,.012]),[.72,.71,.68],{rough:.96,spec:[.15,.16,.15]})}}
function drawWorkspace(t){
  draw(CYL,mdl([0,.46,0],identity(),[6.05,.52,6.05]),COLORS.metal,{spec:[.86,.88,.82],rough:.38});
  draw(CYL,mdl([0,.73,0],identity(),[5.62,.34,5.62]),COLORS.shell,{spec:[.64,.64,.60],rough:.60});
  draw(CYL,mdl([0,.94,0],identity(),[4.92,.11,4.92]),COLORS.glass,{spec:[.95,.96,.94],rough:.20,alpha:.78});
  draw(CYL,mdl([0,1.01,0],identity(),[3.78,.09,3.78]),COLORS.dark,{spec:[.46,.48,.45],rough:.66});
  const breathing=.5+.5*Math.sin(t*1.25);draw(CYL,mdl([0,1.075,0],identity(),[3.42,.035,3.42]),COLORS.trace,{spec:[.52,.57,.52],rough:.52,emission:.035+breathing*.025});
  traces.slice(0,8).forEach((trace,idx)=>{const x=Math.cos(trace.angle)*2.16,z=Math.sin(trace.angle)*2.16,raise=.012+Math.sin(t*1.2+idx)*.012;draw(CUBE,mdl([x,1.16+raise,z],rotateY(trace.angle),[.56*trace.scale,.10,.27*trace.scale]),idx===traces.length-1&&state==='REFLECT'?COLORS.bright:COLORS.trace,{spec:[.67,.68,.64],rough:.47})});
  const pulse=.5+.5*Math.sin(t*1.9);draw(CYL,mdl([0,1.14,0],identity(),[1.38+.08*pulse,.018,1.38+.08*pulse]),COLORS.energy,{spec:[1,.84,.55],rough:.22,emission:.08+pulse*.04,alpha:.30});
}
function drawSeat(seatObj,index,t){const p=seatPos(seatObj),active=index===selectedSeat&&state!=='IDLE',engaged=active&&(state==='FOCUS'||state==='ACTIVE'||state==='CONTRIBUTE'),bob=(active?Math.sin(t*2.1)*.05:Math.sin(t*.7+index)*.016)*(reducedMotion?.25:1),y=p[1]+bob;const toward=norm([-p[0],0,-p[2]]);
  draw(CYL,mdl([p[0],.28,p[2]],identity(),[2.12,.46,2.12]),COLORS.metal,{spec:[.82,.84,.80],rough:.42});
  draw(CYL,mdl([p[0],.55,p[2]],identity(),[1.78,.36,1.78]),active?seatObj.accent:COLORS.shell,{spec:[.76,.75,.70],rough:.55});
  draw(CUBE,mdl([p[0],y+.63,p[2]],rotateY(-seatObj.angle),[1.54,1.30,1.22]),active?COLORS.bright:COLORS.shell,{spec:[.84,.82,.76],rough:.60});
  draw(CUBE,mdl([p[0],y+1.31,p[2]],rotateY(seatObj.angle),[.88,.14,.70]),engaged?seatObj.accent:COLORS.metalLight,{spec:[.78,.76,.70],rough:.40,emission:engaged?.06:0});
  draw(CYL,mdl([p[0]+toward[0]*.56,y+1.04,p[2]+toward[2]*.56],alignY(toward),[.23,.52,.23]),engaged?COLORS.energy:seatObj.accent,{spec:[1,.86,.58],rough:.24,emission:engaged?.18:0});
  if(active)draw(CYL,mdl([p[0],.80,p[2]],identity(),[2.32,.025,2.32]),seatObj.accent,{spec:[.82,.80,.76],rough:.44,emission:engaged?.045:.015,alpha:.78});
}
function contribution(){if(state!=='CONTRIBUTE')return;const s=seatPos(seats[selectedSeat]),start=[s[0],1.15,s[2]],end=center,c1=[s[0]*.70,1.58,s[2]*.70],c2=[s[0]*.28,1.24,s[2]*.28],q=cubic(start,c1,c2,end,contributionProgress),dir=sub(end,start);draw(CYL,mdl(q,alignY(dir),[.17,.58,.17]),COLORS.energy,{spec:[1,.92,.72],rough:.12,emission:.56});const tail=Math.max(0,contributionProgress-.16),qt=cubic(start,c1,c2,end,tail);draw(CYL,mdl(qt,alignY(dir),[.06,.92,.06]),COLORS.energy,{spec:[1,.88,.62],rough:.16,emission:.32,alpha:.58})}
function resize(){const dpr=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.floor(canvas.clientWidth*dpr)),h=Math.max(1,Math.floor(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
function targetCamera(id){if(!cameras[id])return;cameraId=id;cameraFrom={...camera};cameraTo={...cameras[id]};cameraTravelStarted=performance.now();cameraTravel=reducedMotion?1:0}
function updateCamera(now){const travelDuration=reducedMotion?1:950;if(cameraTravel<1){cameraTravel=clamp((now-cameraTravelStarted)/travelDuration,0,1);const k=ease(cameraTravel);camera.pos=cameraFrom.pos.map((v,i)=>lerp(v,cameraTo.pos[i],k));camera.target=cameraFrom.target.map((v,i)=>lerp(v,cameraTo.target[i],k));camera.fov=lerp(cameraFrom.fov,cameraTo.fov,k)}else{camera={...cameraTo}}}
function setState(next){state=next;stateStarted=performance.now();contributionProgress=0;shell.dataset.state=next;stateLabel.textContent=next;seatLabel.textContent=next==='HANDOFF'?`Next: ${seats[(selectedSeat+1)%seats.length].label}`:`${seats[selectedSeat].label} · ${next}`}
function update(now){const elapsed=now-stateStarted;if(demo){const phases={IDLE:820,FOCUS:720,ACTIVE:920,CONTRIBUTE:1120,ABSORB:540,REFLECT:700,HANDOFF:580};if(elapsed>phases[state]){const order=['IDLE','FOCUS','ACTIVE','CONTRIBUTE','ABSORB','REFLECT','HANDOFF'],next=order[(order.indexOf(state)+1)%order.length];if(state==='HANDOFF')selectedSeat=(selectedSeat+1)%seats.length;if(next==='ABSORB')traces.push({angle:(selectedSeat*1.55)%Math.PI*2,scale:.80+.18*Math.sin(selectedSeat+1)});setState(next)}}if(state==='CONTRIBUTE')contributionProgress=clamp(elapsed/(reducedMotion?1:1120),0,1);stateLabel.textContent=state;seatLabel.textContent=state==='HANDOFF'?`Next: ${seats[(selectedSeat+1)%seats.length].label}`:`${seats[selectedSeat].label} · ${state}`}
function render(now){resize();updateCamera(now);const t=now*.001;gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);drawFloor();drawWorkspace(t);for(let j=0;j<seats.length;j++)drawSeat(seats[j],j,t);contribution();requestAnimationFrame(frame)}
function frame(now){update(now);render(now)}

document.querySelectorAll('[data-camera]').forEach(button=>button.addEventListener('click',()=>targetCamera(button.dataset.camera)));
demoButton.addEventListener('click',()=>{demo=!demo;demoButton.textContent=demo?'Stop turn loop':'Start turn loop';if(demo&&state==='IDLE')setState('FOCUS');if(!demo)setState('IDLE')});
motionButton.addEventListener('click',()=>{reducedMotion=!reducedMotion;motionButton.textContent=`Reduced motion: ${reducedMotion?'on':'off'}`;targetCamera(cameraId)});
window.addEventListener('keydown',event=>{if(event.key.toLowerCase()==='d')demoButton.click();if(event.key.toLowerCase()==='m')motionButton.click();if(event.key>='1'&&event.key<='5')targetCamera(['HERO_WIDE','HERO_LOW_ORBIT','TEAM_ORBIT','WORKSPACE_CLOSE','OVERHEAD_MAP'][Number(event.key)-1])});
setState('IDLE');requestAnimationFrame(frame);
