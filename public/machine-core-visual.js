import { createBranchConnectionCore, resolveBranchCamera } from './machine-core-layout-runtime.js';
import { createMachineAnimation, interpolateCamera } from './machine-core-animation.js';
import { buildMachineCoreSeat1Connection } from './machine-core-seat-connection.js';
import { parseSeatCountParam } from './seat-capacity.js';

const VS='attribute vec3 a;uniform mat4 p,v,m;varying vec3 lp;void main(){lp=a;gl_Position=p*v*m*vec4(a,1.);}';
const FS='precision mediump float;uniform vec4 c;uniform float glow;uniform float pulse;varying vec3 lp;void main(){vec3 n=normalize(vec3(lp.x,1.05,lp.z));float light=.54+.46*max(dot(n,normalize(vec3(-.35,.9,.55))),0.0);float rim=pow(1.0-max(n.y,0.0),2.0);float edge=.06+rim*.13;vec3 material=c.rgb*light+vec3(.16,.20,.23)*(glow*.55+edge);float alpha=min(1.0,c.a+glow*.12+sin(pulse)*.035);gl_FragColor=vec4(material,alpha);}';
const COLORS={hub:[.68,.74,.79],pod:[.48,.58,.66],fin:[.57,.62,.68],arc:[.50,.66,.70],diamond:[.62,.56,.47],blade:[.46,.63,.57],connection:[.36,.58,.70]};
const UI_COLORS={'command-core':[.88,.92,.96],'seat-configuration':[.82,.88,.94],'outer-fin':[.80,.87,.90],'outer-arc':[.84,.89,.92],'outer-diamond':[.86,.84,.78],'outer-blade':[.78,.89,.84]};
const POLYS={connection:[[-.9,-.36],[.9,-.36],[.9,.36],[-.9,.36]],hex:[[-1,0],[-.5,-.86],[.5,-.86],[1,0],[.5,.86],[-.5,.86]],pod:[[-.9,-.25],[-.55,-.58],[.18,-.62],[.78,-.30],[.9,.12],[.5,.5],[-.3,.58],[-.82,.3]],fin:[[-1,-.55],[.05,-.7],[1,.3],[.35,.66],[-.5,.55]],arc:[[-.95,-.3],[-.45,-.7],[.25,-.7],[.85,-.28],[.85,.18],[.25,.68],[-.42,.62],[-.86,.25],[-.28,.08],[.35,.16],[.18,-.08],[-.38,-.03]],diamond:[[0,-.9],[.72,0],[0,.9],[-.72,0]],blade:[[-.95,-.6],[-.18,-.82],[.78,-.28],[.98,.12],[.2,.74],[-.72,.55]]};
function compile(gl,t,s){const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(x)||'shader compile failed');return x;}
function program(gl){const p=gl.createProgram(),a=compile(gl,gl.VERTEX_SHADER,VS),b=compile(gl,gl.FRAGMENT_SHADER,FS);gl.attachShader(p,a);gl.attachShader(p,b);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||'program link failed');return p;}
const polyFor=part=>part.kind==='hub'?POLYS.hex:POLYS[part.silhouette]||POLYS.pod;
function shapeBuffer(gl,poly,height){const v=[],n=poly.length;for(const [x,z] of poly)v.push(x,0,z);for(const [x,z] of poly)v.push(x,height,z);for(let i=1;i<n-1;i++)v.push(0,0,0,poly[i][0],0,poly[i][1],poly[i+1][0],0,poly[i+1][1]);for(let i=1;i<n-1;i++)v.push(0,height,0,poly[i+1][0],height,poly[i+1][1],poly[i][0],height,poly[i][1]);for(let i=0;i<n;i++){const j=(i+1)%n;v.push(poly[i][0],0,poly[i][1],poly[j][0],0,poly[j][1],poly[j][0],height,poly[j][1],poly[i][0],0,poly[i][1],poly[j][0],height,poly[j][1],poly[i][0],height,poly[i][1]);}return new Float32Array(v);}
function ortho(o,l,r,b,t,n,f){o.fill(0);o[0]=2/(r-l);o[5]=2/(t-b);o[10]=-2/(f-n);o[12]=-(r+l)/(r-l);o[13]=-(t+b)/(t-b);o[14]=-(f+n)/(f-n);o[15]=1;}
function lookAt(out,eye,target){const ex=eye[0],ey=eye[1],ez=eye[2],tx=target[0],ty=target[1],tz=target[2];let zx=ex-tx,zy=ey-ty,zz=ez-tz,zl=Math.hypot(zx,zy,zz)||1;zx/=zl;zy/=zl;zz/=zl;let xx=zz,xz=-zx,xl=Math.hypot(xx,xz)||1;xx/=xl;xz/=xl;const xy=0;const yx=zy*xz,yy=zz*xx-zx*xz,yz=-zy*xx;out.set([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*ex+xy*ey+xz*ez),-(yx*ex+yy*ey+yz*ez),-(zx*ex+zy*ey+zz*ez),1]);}
function model(out,c,s){out.set([s[0],0,0,0,0,s[1],0,0,0,0,s[2],0,c[0],c[1],c[2],1]);}function makePanel(){const root=document.querySelector('.machine-core-shell');if(!root||document.querySelector('[data-machine-core-visual]'))return null;const seatCount=parseSeatCountParam();const reducedMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;const panel=document.createElement('section');panel.className='machine-core-visual';panel.dataset.machineCoreVisual='1';panel.innerHTML='<div class="machine-core-visual__hud"><strong>BRANCH CONNECTION CORE</strong><span data-core-count></span><label>Camera <select data-core-camera aria-label="Branch camera"></select></label><button type="button" data-core-expand>Expand</button><button type="button" data-core-reset>Reset</button></div><canvas tabindex="0" aria-label="3D modular branch connection core"></canvas><output data-core-state>collapsed lattice</output>';root.append(panel);const canvas=panel.querySelector('canvas'),gl=canvas.getContext('webgl',{antialias:true,alpha:true}),cameraSelect=panel.querySelector('[data-core-camera]');if(!gl){panel.querySelector('[data-core-state]').textContent='WebGL unavailable';return panel;}gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.DEPTH_TEST);const pr=program(gl),a=gl.getAttribLocation(pr,'a'),p=gl.getUniformLocation(pr,'p'),v=gl.getUniformLocation(pr,'v'),m=gl.getUniformLocation(pr,'m'),c=gl.getUniformLocation(pr,'c'),g=gl.getUniformLocation(pr,'glow'),pulseU=gl.getUniformLocation(pr,'pulse'),P=new Float32Array(16),V=new Float32Array(16),M=new Float32Array(16),I=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),buffers=new Map(),wire=gl.createBuffer();let selectedBranch='HUB-CORE',optionsKey='',cameraTransition=null;const animation=createMachineAnimation({duration:900});const configByBranch=new Map();
function sceneAt(now){const amount=animation.sample(now).amount;return createBranchConnectionCore({seatCount,expansionAmount:amount});}
function currentTransitionCamera(now){if(!cameraTransition)return null;const progress=(now-cameraTransition.startedAt)/cameraTransition.duration;return interpolateCamera(cameraTransition.from,cameraTransition.to,Math.max(0,Math.min(1,progress)));}
function beginCameraTransition(nextBranch,now){const scene=sceneAt(now),from=currentTransitionCamera(now)||resolveBranchCamera(scene,selectedBranch)||scene.cameras[0],to=resolveBranchCamera(scene,nextBranch)||scene.cameras[0];if(reducedMotion){cameraTransition=null;selectedBranch=nextBranch;return;}cameraTransition={from,to,startedAt:now,duration:620};selectedBranch=nextBranch;}
function setMachineTarget(target){const now=performance.now();if(reducedMotion){animation.setTarget(target,now);animation.sample(now+1000);render(now+1000);return;}animation.setTarget(target,now);render(now);}
canvas.addEventListener('machine:config-change',event=>{const detail=event.detail||{};if(!detail.branchId)return;const current=configByBranch.get(detail.branchId)||{profile:'balanced',intensity:72,density:56};configByBranch.set(detail.branchId,{...current,...detail});if(detail.profile)canvas.dataset.configProfile=detail.profile;if(detail.intensity!=null)canvas.dataset.configIntensity=String(detail.intensity);if(detail.density!=null)canvas.dataset.configDensity=String(detail.density);});
function render(now=performance.now()){const sample=animation.sample(now),amount=sample.amount,w=canvas.clientWidth||900,h=canvas.clientHeight||650,dpr=globalThis.devicePixelRatio||1;canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(pr);const scene=createBranchConnectionCore({seatCount,expansionAmount:amount});const options=scene.cameras.map(cam=>cam.branchId+':'+cam.cameraId).join('|');if(options!==optionsKey){cameraSelect.innerHTML='';for(const cam of scene.cameras){const o=document.createElement('option');o.value=cam.branchId;o.textContent=cam.branchId.replace('BRANCH-','')+' · '+cam.cameraId;if(cam.branchId===selectedBranch)o.selected=true;cameraSelect.append(o);}optionsKey=options;}if(!scene.byBranch.has(selectedBranch))selectedBranch='HUB-CORE';cameraSelect.value=selectedBranch;panel.querySelector('[data-core-count]').textContent=`${scene.parts.length} modules · ${scene.seatCount} seats · 4 outer housings · 1 hub`;let branchCamera=resolveBranchCamera(scene,selectedBranch)||scene.cameras[0];if(cameraTransition){branchCamera=currentTransitionCamera(now)||branchCamera;if((now-cameraTransition.startedAt)>=cameraTransition.duration)cameraTransition=null;}const eye=[branchCamera.position.x,branchCamera.position.y,branchCamera.position.z],target=[branchCamera.target.x,branchCamera.target.y,branchCamera.target.z];ortho(P,-15.5,15.5,-11,11,-30,30);lookAt(V,eye,target);gl.uniformMatrix4fv(p,false,P);gl.uniformMatrix4fv(v,false,V);for(const part of scene.parts){let entry=buffers.get(part.branchId);if(!entry){const data=shapeBuffer(gl,polyFor(part),part.dimensions.y);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);entry={buf,count:data.length/3};buffers.set(part.branchId,entry);}gl.bindBuffer(gl.ARRAY_BUFFER,entry.buf);gl.vertexAttribPointer(a,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(a);model(M,[part.center.x,part.level-part.dimensions.y*.25,part.center.z],[part.dimensions.x*.62,part.dimensions.y*.62,part.dimensions.z*.62]);gl.uniformMatrix4fv(m,false,M);const col=COLORS[part.silhouette||'pod']||COLORS.pod;const cfg=configByBranch.get(part.branchId)||{profile:part.uiStyle,intensity:72,density:56};const intensity=(Number(cfg.intensity)||72)/100;const density=(Number(cfg.density)||56)/100;const isSelected=part.branchId===selectedBranch?1:0;const glow=(isSelected?1.0:.18)*(0.62+intensity*.48);const profileRate=cfg.profile==='precision'?1.28:cfg.profile==='adaptive'?.82:1;gl.uniform4f(c,col[0],col[1],col[2],isSelected?.98:.92);gl.uniform1f(g,glow);gl.uniform1f(pulseU,now/(420/profileRate)+(part.branchId.length*.08));gl.drawArrays(gl.TRIANGLES,0,entry.count);const ui=part.uiSurface;if(ui){const uiWidth=Math.max(.24,ui.width),uiDepth=Math.max(.18,ui.depth),uiColor=UI_COLORS[part.uiStyle]||[.82,.88,.92];model(M,[ui.anchor.x,ui.anchor.y,ui.anchor.z],[uiWidth/2,.025,uiDepth/2]);gl.uniformMatrix4fv(m,false,M);gl.uniform4f(c,uiColor[0],uiColor[1],uiColor[2],.22+.22*density);gl.uniform1f(g,.55+intensity*.45);gl.uniform1f(pulseU,now/(500/profileRate));gl.drawArrays(gl.TRIANGLES,0,entry.count);}}
function renderSeat1ConnectionChild(scene, amount, selectedBranch, now, canvasNode) {
  const shell = scene.byBranch.get('BRANCH-SEAT-01');
  const child = selectedBranch === 'BRANCH-SEAT-01'
    ? buildMachineCoreSeat1Connection({ shell, expansionAmount: amount, density: document.documentElement.getAttribute('data-density') || 'default' })
    : null;
  if (!child) {
    if (canvasNode) {
      delete canvasNode.dataset.seatConnectionSemantic;
      delete canvasNode.dataset.seatConnectionGeometry;
      delete canvasNode.dataset.seatConnectionEdge;
      delete canvasNode.dataset.seatConnectionHealth;
      delete canvasNode.dataset.seatConnectionDrawPath;
      delete canvasNode.dataset.seatConnectionProof;
    }
    return;
  }

  if (canvasNode) {
    canvasNode.dataset.seatConnectionSemantic = child.semanticKey;
    canvasNode.dataset.seatConnectionGeometry = child.geometry.id;
    canvasNode.dataset.seatConnectionEdge = child.edgeId;
    canvasNode.dataset.seatConnectionHealth = child.healthLeaf.semanticKey;
  }

  const geometry = child.geometry;
  const scale = 0.78 + 0.22 * child.amount;
  let entry = buffers.get('__seat1-connection-child');
  if (!entry) {
    const data = shapeBuffer(gl, POLYS.connection, 1);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    entry = { buf, count: data.length / 3 };
    buffers.set('__seat1-connection-child', entry);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, entry.buf);
  gl.vertexAttribPointer(a, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a);
  model(M, [geometry.center.x, geometry.center.y, geometry.center.z], [
    geometry.dimensions.width * scale,
    geometry.dimensions.height * scale,
    geometry.dimensions.depth * scale,
  ]);
  gl.uniformMatrix4fv(m, false, M);
  gl.uniform4f(c, COLORS.connection[0], COLORS.connection[1], COLORS.connection[2], 0.52 + 0.34 * child.amount);
  gl.uniform1f(g, 0.8);
  gl.uniform1f(pulseU, now / 360);
  gl.drawArrays(gl.TRIANGLES, 0, entry.count);

  const surface = {
    x: geometry.center.x,
    y: geometry.center.y + geometry.dimensions.height * 0.7,
    z: geometry.center.z,
  };
  model(M, [surface.x, surface.y, surface.z], [
    Math.max(0.18, geometry.dimensions.width * 0.55),
    0.018,
    Math.max(0.14, geometry.dimensions.depth * 0.70),
  ]);
  gl.uniformMatrix4fv(m, false, M);
  gl.uniform4f(c, .78, .88, .94, .34 + .24 * child.amount);
  gl.uniform1f(g, 0.7);
  gl.uniform1f(pulseU, now / 480);
  gl.drawArrays(gl.TRIANGLES, 0, entry.count);

  const health = child.healthLeaf.point;
  model(M, [health.x, health.y + 0.075 * child.amount, health.z], [
    0.10 * child.amount,
    0.045 * child.amount,
    0.10 * child.amount,
  ]);
  gl.uniformMatrix4fv(m, false, M);
  gl.uniform4f(c, .48, .70, .80, .45 + .35 * child.amount);
  gl.uniform1f(g, 0.55 + .35 * child.amount);
  gl.uniform1f(pulseU, now / 260);
  gl.drawArrays(gl.TRIANGLES, 0, entry.count);

  const signal = child.previewPoint;
  const port = geometry.port;
  gl.bindBuffer(gl.ARRAY_BUFFER, wire);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    port.x, port.y, port.z,
    signal.x, signal.y, signal.z,
  ]), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a);
  gl.uniformMatrix4fv(m, false, I);
  gl.uniform1f(g, 0.85);
  gl.uniform1f(pulseU, now / 160);
  gl.uniform4f(c, .24, .74, .94, .50 + .25 * child.amount);
  gl.drawArrays(gl.LINE_STRIP, 0, 2);

  if (canvasNode) {
    canvasNode.dataset.seatConnectionDrawPath = 'webgl';
    canvasNode.dataset.seatConnectionProof = 'semantic+geometry+edge+webgl';
  }
}

renderSeat1ConnectionChild(scene, amount, selectedBranch, now, canvas);
for(const connection of scene.connections){const route=connection.route.flatMap(q=>[q.x,q.y,q.z]);gl.bindBuffer(gl.ARRAY_BUFFER,wire);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(route),gl.DYNAMIC_DRAW);gl.vertexAttribPointer(a,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(a);gl.uniformMatrix4fv(m,false,I);const cfg=configByBranch.get(connection.targetBranchId)||configByBranch.get(connection.sourceBranchId)||{intensity:72,density:56,profile:'balanced'};const intensity=(Number(cfg.intensity)||72)/100;const density=(Number(cfg.density)||56)/100;const rate=cfg.profile==='precision'?1.45:cfg.profile==='adaptive'?.78:1;const phase=now/(180/rate)+connection.id.length;gl.uniform1f(g,.55+intensity*.45);gl.uniform1f(pulseU,phase);gl.uniform4f(c,connection.kind==='lattice-link'?.35:.1,.78,.95,.48+.34*(.5+.5*Math.sin(phase))*(.7+density*.3));gl.drawArrays(gl.LINE_STRIP,0,connection.route.length);}panel.querySelector('[data-core-state]').textContent=`${reducedMotion?'reduced-motion ':''}${sample.state} · ${Math.round(amount*100)}% · ${scene.parts.length} independent modules · camera ${branchCamera.cameraId}`;if((!sample.done&&!reducedMotion)||cameraTransition||(!reducedMotion))requestAnimationFrame(render);}
cameraSelect.addEventListener('change',()=>{const next=cameraSelect.value;if(next===selectedBranch)return;beginCameraTransition(next,performance.now());render()});panel.querySelector('[data-core-expand]').addEventListener('click',()=>setMachineTarget('expanded'));panel.querySelector('[data-core-reset]').addEventListener('click',()=>setMachineTarget('collapsed'));if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>render()).observe(canvas);render();return panel;}
if(globalThis.document){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',makePanel,{once:true});else makePanel();}
