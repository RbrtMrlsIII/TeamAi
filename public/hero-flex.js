import { HERO_AUTHORED_MESHES } from './hero-authored-meshes.js';

const canvas = document.querySelector('#hero-canvas');
const shell = document.querySelector('.hero-shell');
const stateLabel = document.querySelector('#state-label');
const seatLabel = document.querySelector('#seat-label');
const demoButton = document.querySelector('#demo-toggle');
const motionButton = document.querySelector('#motion-toggle');
const gl = canvas?.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
if (!canvas || !shell || !gl) throw Error('WebGL is required for the 3D Hero.');

const VS = `attribute vec3 p;attribute vec3 n;uniform mat4 mvp;uniform mat4 model;varying vec3 N;varying vec3 W;void main(){vec4 w=model*vec4(p,1.);W=w.xyz;N=normalize(mat3(model)*n);gl_Position=mvp*vec4(p,1.);}`;
const FS = `precision mediump float;uniform vec3 color;uniform vec3 specular;uniform float rough;uniform float emit;uniform float alpha;varying vec3 N;varying vec3 W;void main(){vec3 n=normalize(N),k=normalize(vec3(-.55,.88,.34)),f=normalize(vec3(.66,.28,-.52)),v=normalize(vec3(-W.x*.045,.92,4.));float facing=max(dot(n,k),0.),d=.24+.67*facing+.16*max(dot(n,f),0.);vec3 h=normalize(k+v);float s=pow(max(dot(n,h),0.),mix(96.,12.,rough));float r=pow(1.-max(dot(n,v),0.),3.2);float grazing=pow(1.-facing,2.0);gl_FragColor=vec4(color*d+specular*s*(1.-rough*.72)+color*(.05*grazing+emit*(.16+r*1.45)),alpha);}`;
function shader(type, source) { const x = gl.createShader(type); gl.shaderSource(x, source); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(x)); return x; }
const program = gl.createProgram();
gl.attachShader(program, shader(gl.VERTEX_SHADER, VS));
gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FS));
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
gl.useProgram(program);
const U = {
  p: gl.getAttribLocation(program, 'p'), n: gl.getAttribLocation(program, 'n'),
  mvp: gl.getUniformLocation(program, 'mvp'), model: gl.getUniformLocation(program, 'model'),
  color: gl.getUniformLocation(program, 'color'), specular: gl.getUniformLocation(program, 'specular'),
  rough: gl.getUniformLocation(program, 'rough'), emit: gl.getUniformLocation(program, 'emit'), alpha: gl.getUniformLocation(program, 'alpha')
};
function mesh(P, N) {
  const pb = gl.createBuffer(), nb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(P), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, nb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(N), gl.STATIC_DRAW);
  return { pb, nb, count: P.length / 3 };
}
function authoredMesh(def) {
  const { positions, indices } = def, P = [], N = [], acc = new Float32Array(positions.length);
  for (let i = 0; i < indices.length; i += 3) {
    const ia = indices[i] * 3, ib = indices[i + 1] * 3, ic = indices[i + 2] * 3;
    const a = positions.slice(ia, ia + 3), b = positions.slice(ib, ib + 3), c = positions.slice(ic, ic + 3);
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const nx = u[1] * v[2] - u[2] * v[1], ny = u[2] * v[0] - u[0] * v[2], nz = u[0] * v[1] - u[1] * v[0], face = Math.hypot(nx, ny, nz) || 1;
    for (const id of [ia, ib, ic]) { acc[id] += nx / face; acc[id + 1] += ny / face; acc[id + 2] += nz / face; }
  }
  for (let i = 0; i < indices.length; i++) { const id = indices[i] * 3, l = Math.hypot(acc[id], acc[id + 1], acc[id + 2]) || 1; P.push(...positions.slice(id, id + 3)); N.push(acc[id] / l, acc[id + 1] / l, acc[id + 2] / l); }
  return mesh(P, N);
}
function cube() {
  const v=[[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]], f=[[0,1,2,3,0,0,-1],[4,7,6,5,0,0,1],[0,4,5,1,0,-1,0],[3,2,6,7,0,1,0],[0,3,7,4,-1,0,0],[1,5,6,2,1,0,0]], P=[], N=[];
  for (const [a,b,c,d,x,y,z] of f) for (const i of [a,b,c,a,c,d]) { P.push(...v[i]); N.push(x,y,z); }
  return mesh(P, N);
}
function cyl(segments=56) {
  const P=[],N=[];
  for(let i=0;i<segments;i++) { const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2,x0=Math.cos(a),z0=Math.sin(a),x1=Math.cos(b),z1=Math.sin(b),s=[[x0,-.5,z0,x0,0,z0],[x1,-.5,z1,x1,0,z1],[x1,.5,z1,x1,0,z1],[x0,-.5,z0,x0,0,z0],[x1,.5,z1,x1,0,z1],[x0,.5,z0,x0,0,z0]]; for(const q of s){P.push(q[0],q[1],q[2]);N.push(q[3],q[4],q[5]);} for(const c of[-1,1]){const y=c*.5,t=c>0?[[0,y,0],[x0,y,z0],[x1,y,z1]]:[[0,y,0],[x1,y,z1],[x0,y,z0]];for(const q of t){P.push(...q);N.push(0,c,0);}} }
  return mesh(P,N);
}
function torus(R=.9,r=.07,s=56,t=12) {
  const P=[],N=[];
  for(let i=0;i<s;i++) for(let j=0;j<t;j++){const a0=i/s*Math.PI*2,a1=(i+1)/s*Math.PI*2,b0=j/t*Math.PI*2,b1=(j+1)/t*Math.PI*2;for(const[a,b]of[[a0,b0],[a1,b0],[a1,b1],[a0,b0],[a1,b1],[a0,b1]]){const rr=R+r*Math.cos(b),x=rr*Math.cos(a),y=r*Math.sin(b),z=rr*Math.sin(a);P.push(x,y,z);N.push(Math.cos(b)*Math.cos(a),Math.sin(b),Math.cos(b)*Math.sin(a));}}
  return mesh(P,N);
}
function sph(r=.5,s=20,t=12) {
  const P=[],N=[];
  for(let i=0;i<t;i++) for(let j=0;j<s;j++){const p0=i/t*Math.PI,p1=(i+1)/t*Math.PI,a0=j/s*Math.PI*2,a1=(j+1)/s*Math.PI*2;for(const[p,a]of[[p0,a0],[p0,a1],[p1,a1],[p0,a0],[p1,a1],[p1,a0]]){const x=Math.sin(p)*Math.cos(a),y=Math.cos(p),z=Math.sin(p)*Math.sin(a);P.push(x*r,y*r,z*r);N.push(x,y,z);}}
  return mesh(P,N);
}
const CUBE=cube(),CYL=cyl(),TORUS=torus(),RING=torus(.52,.045,40,8),SPH=sph(.5,20,12),AUTHORED_RING=authoredMesh(HERO_AUTHORED_MESHES.workspaceRing),AUTHORED_SEAT_SHELL=authoredMesh(HERO_AUTHORED_MESHES.seatShell);
const M={shell:[.89,.88,.84],white:[.985,.98,.94],metal:[.47,.51,.49],metal2:[.71,.72,.68],glass:[.58,.71,.75],dark:[.13,.15,.14],energy:[1,.56,.12],trace:[.30,.43,.40],floor:[.76,.75,.71]};
const PALETTE=[[.66,.57,.46],[.48,.60,.57],[.57,.50,.65],[.69,.57,.43],[.47,.57,.66],[.65,.53,.40],[.45,.62,.53],[.59,.49,.61]];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t),sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],len=a=>Math.hypot(...a),norm=a=>{const l=len(a)||1;return[a[0]/l,a[1]/l,a[2]/l]},cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const I=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],mul=(a,b)=>{const r=new Array(16).fill(0);for(let c=0;c<4;c++)for(let q=0;q<4;q++)for(let k=0;k<4;k++)r[c*4+q]+=a[k*4+q]*b[c*4+k];return r};
function T(x,y,z){const m=I();m[12]=x;m[13]=y;m[14]=z;return m} function S(x,y,z){const m=I();m[0]=x;m[5]=y;m[10]=z;return m} function RY(a){const c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]}
function persp(fov,asp,n,f){const q=1/Math.tan(fov*Math.PI/360),nf=1/(n-f);return[q/asp,0,0,0,0,q,0,0,0,0,(f+n)*nf,-1,0,0,2*f*n*nf,0]}
function look(e,t){const z=norm(sub(e,t)),x=norm(cross([0,1,0],z)),y=cross(z,x);return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x[0]*e[0]-x[1]*e[1]-x[2]*e[2],-y[0]*e[0]-y[1]*e[1]-y[2]*e[2],-z[0]*e[0]-z[1]*e[1]-z[2]*e[2],1]}
function mdl(p,r,s){return mul(mul(T(...p),r),S(...s))}
function draw(m,mo,c,o={}){const mvp=mul(persp(camera.f,canvas.width/canvas.height,.1,90),mul(look(camera.p,camera.t),mo));gl.uniformMatrix4fv(U.mvp,false,new Float32Array(mvp));gl.uniformMatrix4fv(U.model,false,new Float32Array(mo));gl.uniform3fv(U.color,new Float32Array(c));gl.uniform3fv(U.specular,new Float32Array(o.spec||[.5,.52,.49]));gl.uniform1f(U.rough,o.rough??.7);gl.uniform1f(U.emit,o.emit??0);gl.uniform1f(U.alpha,o.alpha??1);gl.bindBuffer(gl.ARRAY_BUFFER,m.pb);gl.enableVertexAttribArray(U.p);gl.vertexAttribPointer(U.p,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.nb);gl.enableVertexAttribArray(U.n);gl.vertexAttribPointer(U.n,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,m.count)}

let seatCount=4,selectedSeat=0,state='IDLE',demo=false,reducedMotion=false,stateStart=performance.now(),contribution=0,cameraId='HERO_WIDE',camera=null,camFrom=null,camTo=null,camAt=1,camStart=performance.now();
const traces=[]; const TRACE_LIMIT=8;
function durations(){return reducedMotion?{focus:250,active:320,contribute:420,absorb:260,reflect:250,handoff:220}:{focus:560,active:900,contribute:1200,absorb:620,reflect:620,handoff:520};}
function profile(count){const c=clamp(count,1,8),density=(c-1)/7;return{workspace:lerp(4.35,5.95,density),seatRadius:lerp(4.25,6.45,density),seatScale:lerp(1,.78,density),cameraDist:lerp(9.6,12.2,density),ambient:lerp(.35,.78,density),artifacts:Math.round(lerp(3,8,density))}}
function buildSeats(count){return Array.from({length:count},(_,i)=>({id:`seat-${i+1}`,label:`Web AI Seat ${i+1}`,a:(-Math.PI/2)+(i*(Math.PI*2/count)),accent:PALETTE[i%PALETTE.length]}))}
let seats=buildSeats(seatCount);
function cameras(){const p=profile(seatCount),d=p.cameraDist;return{HERO_WIDE:{p:[0,d*.67,d],t:[0,.78,0],f:39},HERO_LOW_ORBIT:{p:[d*.74,d*.23,d*.78],t:[0,.78,0],f:40},TEAM_ORBIT:{p:[d*.92,d*.5,d*.14],t:[0,.78,0],f:42},SEAT_CLOSE:{p:[p.seatRadius*.78,2.3,p.seatRadius*.78],t:[0,.95,0],f:36},WORKSPACE_CLOSE:{p:[3.55,2.45,4.65],t:[0,.62,0],f:33},TURN_FOLLOW:{p:[4.6,2.05,5.15],t:[0,.72,0],f:35},OVERHEAD_MAP:{p:[0,lerp(10.8,14.8,(seatCount-1)/7),.2],t:[0,.1,0],f:50},DETAIL_ANCHOR:{p:[2.45,1.9,3.05],t:[0,.82,0],f:31}}}
function setCamera(id){const c=cameras()[id]||cameras().HERO_WIDE;cameraId=id;camFrom=camera?{p:[...camera.p],t:[...camera.t],f:camera.f}:c;camTo=c;camera=camFrom;camAt=reducedMotion?1:0;camStart=performance.now()}
function resize(){const d=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.floor(canvas.clientWidth*d)),h=Math.max(1,Math.floor(canvas.clientHeight*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
function seatPos(s){const p=profile(seatCount);return[Math.cos(s.a)*p.seatRadius,.62,Math.sin(s.a)*p.seatRadius]}
function addTrace(seatIndex){const slot=traces.length%Math.max(1,profile(seatCount).artifacts);traces.push({seatId:seats[seatIndex]?.id||`seat-${seatIndex+1}`,slot,sequence:traces.length+1,createdAt:performance.now()});if(traces.length>TRACE_LIMIT)traces.shift();}
function workspace(t){const p=profile(seatCount),r=p.workspace;draw(CYL,mdl([0,.40,0],I(),[r+1.0,.52,r+1.0]),M.metal,{rough:.4,spec:[.86,.87,.83]});draw(CYL,mdl([0,.69,0],I(),[r+.55,.34,r+.55]),M.shell,{rough:.6,spec:[.66,.65,.61]});draw(AUTHORED_RING,mdl([0,.91,0],I(),[r*.88,.95,r*.88]),M.metal2,{rough:.24,spec:[.96,.96,.92]});draw(CYL,mdl([0,.95,0],I(),[r*.84,.12,r*.84]),M.glass,{rough:.18,spec:[.96,.97,.95],alpha:.72});draw(TORUS,mdl([0,1.01,0],I(),[r*.70,1,r*.70]),M.metal,{rough:.35,spec:[.8,.82,.78]});draw(CYL,mdl([0,1.04,0],I(),[r*.65,.09,r*.65]),M.dark,{rough:.66,spec:[.42,.45,.43]});draw(TORUS,mdl([0,1.08,0],I(),[r*.59,1,r*.59]),M.trace,{rough:.52,emit:.035+.02*(.5+.5*Math.sin(t*1.2))});draw(RING,mdl([0,1.10,0],I(),[1,1,1]),M.energy,{rough:.2,emit:.07+.03*(.5+.5*Math.sin(t*1.8)),alpha:.45});const ptiles=p.artifacts;for(let i=0;i<ptiles;i++){const a=i*(Math.PI*2/ptiles)+.22,x=Math.cos(a)*r*.39,z=Math.sin(a)*r*.39,s=.74+.12*Math.sin(i*1.9);draw(CUBE,mdl([x,1.14+.012*Math.sin(t*1.2+i),z],RY(a),[s,.09,.20]),M.trace,{rough:.44,spec:[.68,.68,.63]})}traces.forEach((trace,index)=>{const a=trace.slot*(Math.PI*2/Math.max(1,ptiles))+.22,x=Math.cos(a)*r*.52,z=Math.sin(a)*r*.52,newest=index===traces.length-1,settled=reducedMotion?1:(state==='HANDOFF'&&newest?.5+.5*Math.sin(t*3.4):1);draw(RING,mdl([x,1.18,z],RY(a),[.18+.05*settled,1,.18+.05*settled]),newest?M.energy:M.trace,{rough:.24,spec:[.84,.84,.80],emit:newest?.16:.04,alpha:.5+.25*settled});draw(CUBE,mdl([x,1.19,z],RY(a),[.36,.055,.12]),M.trace,{rough:.42,spec:[.7,.7,.66],emit:newest?.03:0,alpha:.84})});if(state==='ABSORB'||state==='REFLECT'){const d=durations(),q=reducedMotion?1:(state==='ABSORB'?clamp((performance.now()-stateStart)/d.absorb,0,1):clamp(1-(performance.now()-stateStart)/d.reflect,0,1));draw(TORUS,mdl([0,1.11,0],I(),[.55+1.7*q,1,.55+1.7*q]),M.energy,{rough:.18,emit:.26+.20*q,alpha:.18+.24*q})}}
function drawSeat(s,i,t){const p=seatPos(s),cfg=profile(seatCount),active=i===selectedSeat&&state!=='IDLE',engaged=active&&['FOCUS','ACTIVE','CONTRIBUTE'].includes(state),scale=cfg.seatScale,bob=(active?Math.sin(t*2.1)*.04:Math.sin(t*.7+i)*.012)*(reducedMotion?.2:1),y=p[1]+bob,rot=RY(s.a+Math.PI);draw(CYL,mdl([p[0],.27,p[2]],I(),[1.9*scale,.44,1.9*scale]),M.metal,{rough:.45,spec:[.8,.81,.77]});draw(TORUS,mdl([p[0],.50,p[2]],I(),[.92*scale,1,.92*scale]),M.metal2,{rough:.3,spec:[.92,.92,.88]});draw(AUTHORED_SEAT_SHELL,mdl([p[0],y,p[2]],rot,[1.24*scale,1.12*scale,1.02*scale]),M.shell,{rough:.52,spec:[.84,.83,.79]});draw(CYL,mdl([p[0],y+.47*scale,p[2]],RY(s.a),[.62*scale,.12,.62*scale]),s.accent,{rough:.25,spec:[.9,.9,.86],emit:engaged?.09:0});draw(TORUS,mdl([p[0],y+.52*scale,p[2]],I(),[.40*scale,1,.40*scale]),engaged?M.energy:s.accent,{rough:.22,emit:engaged?.28:.02,alpha:engaged?.88:.55});const nose=[p[0]+Math.cos(s.a)*(.66*scale),y+.18*scale,p[2]+Math.sin(s.a)*(.66*scale)];draw(CYL,mdl(nose,RY(s.a+Math.PI/2),[.15*scale,.45*scale,.15*scale]),M.metal2,{rough:.35,spec:[.88,.88,.84]});if(engaged){const pulse=reducedMotion?.65:.5+.5*Math.sin(t*4.2);draw(RING,mdl([p[0],y+.66*scale,p[2]],I(),[.7*scale+.08*pulse,.7*scale+.08*pulse,.7*scale+.08*pulse]),M.energy,{rough:.18,emit:.12+.20*pulse,alpha:.27+.12*pulse})}}
function contributionPoint(start,c1,c2,end,tt){const u=1-tt;return[u*u*u*start[0]+3*u*u*tt*c1[0]+3*u*tt*tt*c2[0]+tt*tt*tt*end[0],u*u*u*start[1]+3*u*u*tt*c1[1]+3*u*tt*tt*c2[1]+tt*tt*tt*end[1],u*u*u*start[2]+3*u*u*tt*c1[2]+3*u*tt*tt*c2[2]+tt*tt*tt*end[2]]}
function contributionEffect(s,t){if(state!=='CONTRIBUTE')return;const p=seatPos(s),d=durations(),start=[p[0],1.03,p[2]],end=[0,1.3,0],c1=[p[0]*.55,1.32,p[2]*.55],c2=[p[0]*.14,1.42,p[2]*.14];if(reducedMotion){[.30,.50,.70].forEach((tt,i)=>{const[x,y,z]=contributionPoint(start,c1,c2,end,tt),k=.24-.03*i;draw(SPH,mdl([x,y,z],I(),[k,k,k]),M.energy,{rough:.15,emit:.25,alpha:.58})});return}const q=clamp((performance.now()-stateStart)/d.contribute,0,1);for(let i=0;i<5;i++){const tt=clamp(q-i*.06,0,1),[x,y,z]=contributionPoint(start,c1,c2,end,tt),k=Math.max(.18,.34*(1-i*.13));draw(SPH,mdl([x,y,z],I(),[k,k,k]),M.energy,{rough:.15,emit:.38,alpha:.82-i*.12})}}
function environment(t){const p=profile(seatCount),segments=Math.max(8,seatCount*2);for(let i=0;i<segments;i++){const a=i/segments*Math.PI*2+.18,x=Math.cos(a)*(p.workspace+1.6),z=Math.sin(a)*(p.workspace+1.6),pulse=.06+.02*Math.sin(t*.8+i);draw(TORUS,mdl([x,.06,z],I(),[.24,1,.24]),M.metal2,{rough:.45,emit:p.ambient*pulse})}}
function floor(){draw(CUBE,mdl([0,-.32,0],I(),[18,.56,18]),M.floor,{rough:.95,spec:[.15,.16,.15]})}
function updateLabels(){stateLabel.textContent=state;const n=seats[selectedSeat]||seats[0];seatLabel.textContent=`${state==='IDLE'?'Next: ':''}${n.label} · ${seatCount} seat${seatCount===1?'':'s'} unlocked`;demoButton.textContent=demo?'Stop turn loop':'Start turn loop';motionButton.textContent=`Reduced motion: ${reducedMotion?'on':'off'}`;shell.dataset.state=state}
function setState(next,reason='transition'){const previous=state;state=next;stateStart=performance.now();updateLabels();window.dispatchEvent(new CustomEvent('teamai:hero-state-change',{detail:{previous,state,selectedSeat,seatId:seats[selectedSeat]?.id??null,reason,presentationOnly:true}}))}
function setSeatCount(next){const count=clamp(Math.round(Number(next)||1),1,8);if(count===seatCount)return;seatCount=count;seats=buildSeats(seatCount);selectedSeat=selectedSeat%seatCount;setCamera(cameraId);traces.length=0;updateLabels()}
function startLoop(){demo=true;setState('FOCUS','loop-start')}
function stopLoop(){demo=false;contribution=0;setState('IDLE','loop-stop')}
function cycleTurn(now){if(!demo)return;const elapsed=now-stateStart,d=durations();if(state==='FOCUS'&&elapsed>d.focus){setState('ACTIVE')}else if(state==='ACTIVE'&&elapsed>d.active){contribution=0;setCamera('TURN_FOLLOW');setState('CONTRIBUTE','contribution-start')}else if(state==='CONTRIBUTE'){contribution=clamp(elapsed/d.contribute,0,1);if(elapsed>d.contribute){contribution=1;setState('ABSORB','workspace-absorb')}}else if(state==='ABSORB'&&elapsed>d.absorb){setState('REFLECT','workspace-reflect')}else if(state==='REFLECT'&&elapsed>d.reflect){addTrace(selectedSeat);setState('HANDOFF','trace-committed')}else if(state==='HANDOFF'&&elapsed>d.handoff){selectedSeat=(selectedSeat+1)%seatCount;setState('FOCUS','next-seat-focus');setCamera('TEAM_ORBIT')}}
function frame(now){resize();const t=now/1000;cycleTurn(now);if(camAt<1){const q=reducedMotion?1:ease(clamp((now-camStart)/700,0,1));camera={p:[lerp(camFrom.p[0],camTo.p[0],q),lerp(camFrom.p[1],camTo.p[1],q),lerp(camFrom.p[2],camTo.p[2],q)],t:[lerp(camFrom.t[0],camTo.t[0],q),lerp(camFrom.t[1],camTo.t[1],q),lerp(camFrom.t[2],camTo.t[2],q)],f:lerp(camFrom.f,camTo.f,q)};camAt=q}gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);floor();environment(t);workspace(t);seats.forEach((s,i)=>drawSeat(s,i,t));contributionEffect(seats[selectedSeat],t);requestAnimationFrame(frame)}
canvas.addEventListener('click',e=>{const rect=canvas.getBoundingClientRect(),nx=(e.clientX-rect.left)/rect.width,ny=(e.clientY-rect.top)/rect.height;if(nx>.32&&nx<.68&&ny>.32&&ny<.68)return;selectedSeat=(selectedSeat+1)%seatCount;setState('FOCUS','pointer-focus')});
document.querySelectorAll('[data-camera]').forEach(b=>b.addEventListener('click',()=>setCamera(b.dataset.camera)));
demoButton?.addEventListener('click',()=>demo?stopLoop():startLoop());
motionButton?.addEventListener('click',()=>{reducedMotion=!reducedMotion;setCamera(cameraId);updateLabels()});
window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='d')demo?stopLoop():startLoop();if(e.key.toLowerCase()==='m'){reducedMotion=!reducedMotion;setCamera(cameraId)}if(/^[1-8]$/.test(e.key))setSeatCount(Number(e.key));if(e.key==='0')setSeatCount(1);updateLabels()});
window.addEventListener('teamai:web-ai-seat-unlocked',e=>{const next=e.detail?.seatCount??e.detail?.count??seatCount+1;setSeatCount(next)});
window.TeamAiHero={setSeatCount,getSeatCount:()=>seatCount,setTeamSize:setSeatCount,setCamera,startLoop:()=>startLoop(),stopLoop:()=>stopLoop(),getState:()=>state,getTraceCount:()=>traces.length,getSelectedSeat:()=>selectedSeat,getContributionProgress:()=>contribution};
const query=new URLSearchParams(location.search);if(query.has('seats'))setSeatCount(Number(query.get('seats')));
setCamera('HERO_WIDE');updateLabels();requestAnimationFrame(frame);
