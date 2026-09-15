import { resolveMachineCamera } from './machine-hero-scene.js';
import { createMachineTransitionFromPayload } from './machine-hero-payload.js';

const BASE_PAYLOAD = {
  seatIndex: 0,
  source: {
    id: 'seat-0-connection',
    semanticId: 'SEAT_CONNECTION',
    kind: 'division',
    center: { x: -1.15, y: 0.55, z: 0 },
    port: { x: -0.28, y: 0.7, z: 0 },
    labels: ['Connection', 'Provider health'],
    controls: 2,
    density: 2,
  },
  target: {
    id: 'seat-0-behavior',
    semanticId: 'SEAT_BEHAVIOR',
    kind: 'division',
    center: { x: 1.05, y: 0.55, z: 0.15 },
    port: { x: 0.32, y: 0.7, z: 0.15 },
    labels: ['Behavior', 'Defaults'],
    controls: 3,
    density: 3,
  },
  expansion: { sourceAmount: 0.88, targetAmount: 0.66 },
  wiring: { id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING' },
};

function shader(gl,type,source){const value=gl.createShader(type);gl.shaderSource(value,source);gl.compileShader(value);if(!gl.getShaderParameter(value,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(value)||'shader compile failed');return value;}
function program(gl){const vertex=shader(gl,gl.VERTEX_SHADER,'attribute vec3 a_position; uniform mat4 u_projection; uniform mat4 u_view; uniform mat4 u_model; void main(){gl_Position=u_projection*u_view*u_model*vec4(a_position,1.0);}');const fragment=shader(gl,gl.FRAGMENT_SHADER,'precision mediump float; uniform vec4 u_color; void main(){gl_FragColor=u_color;}');const linked=gl.createProgram();gl.attachShader(linked,vertex);gl.attachShader(linked,fragment);gl.linkProgram(linked);if(!gl.getProgramParameter(linked,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(linked)||'program link failed');return linked;}
function perspective(out,fovy,aspect,near,far){const f=1/Math.tan(fovy/2);out.fill(0);out[0]=f/aspect;out[5]=f;out[10]=(far+near)/(near-far);out[11]=-1;out[14]=(2*far*near)/(near-far);return out;}
function lookAt(out,eye,target,up=[0,1,0]){let zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2];const zl=Math.hypot(zx,zy,zz)||1;zx/=zl;zy/=zl;zz/=zl;let xx=up[1]*zz-up[2]*zy,xy=up[2]*zx-up[0]*zz,xz=up[0]*zy-up[1]*zx;const xl=Math.hypot(xx,xy,xz)||1;xx/=xl;xy/=xl;xz/=xl;const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;out.set([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*eye[0]+xy*eye[1]+xz*eye[2]),-(yx*eye[0]+yy*eye[1]+yz*eye[2]),-(zx*eye[0]+zy*eye[1]+zz*eye[2]),1]);return out;}
function modelMatrix(out,center,size){out.set([size[0],0,0,0,0,size[1],0,0,0,0,size[2],0,center[0],center[1],center[2],1]);return out;}
const CUBE=new Float32Array([-1,-1,-1,1,-1,-1,1,1,-1,-1,1,-1,-1,-1,1,1,-1,1,1,1,1,-1,1,1]);
const INDICES=new Uint16Array([0,1,2,0,2,3,4,6,5,4,7,6,0,4,5,0,5,1,3,2,6,3,6,7,1,5,6,1,6,2,0,3,7,0,7,4]);

export function mountMachineWebGLPreview(root=globalThis.document){if(!root||!root.querySelector)return null;if(root.querySelector('[data-machine-hero-webgl]'))return null;const host=root.querySelector('.hero-shell');if(!host)return null;const panel=root.createElement('aside');panel.className='machine-hero-preview machine-hero-preview--webgl';panel.dataset.machineHeroWebgl='1';panel.innerHTML='<div class="machine-hero-preview__header"><strong>Machine 3D</strong><span>payload → geometry → wiring → subject → camera</span></div><div class="machine-hero-preview__controls"><button type="button" data-machine-webgl-nudge>Move geometry</button><output data-machine-webgl-state>payload-driven subject + wiring</output></div><canvas aria-label="Interactive Machine Hero WebGL preview"></canvas>';host.append(panel);
const canvas=panel.querySelector('canvas'),gl=canvas.getContext('webgl',{antialias:true,alpha:true});if(!gl){panel.querySelector('[data-machine-webgl-state]').textContent='WebGL unavailable';return panel;}
const prog=program(gl),position=gl.getAttribLocation(prog,'a_position'),projection=gl.getUniformLocation(prog,'u_projection'),view=gl.getUniformLocation(prog,'u_view'),model=gl.getUniformLocation(prog,'u_model'),color=gl.getUniformLocation(prog,'u_color');
const vertexBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,CUBE,gl.STATIC_DRAW);const indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,INDICES,gl.STATIC_DRAW);const wiringBuffer=gl.createBuffer();
let offset=0;const projectionMatrix=new Float32Array(16),viewMatrix=new Float32Array(16),modelMatrixValue=new Float32Array(16),identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
const payload=()=>({ ...BASE_PAYLOAD, target:{ ...BASE_PAYLOAD.target, center:{x:BASE_PAYLOAD.target.center.x+offset,y:BASE_PAYLOAD.target.center.y,z:BASE_PAYLOAD.target.center.z+offset*.3}, port:{x:BASE_PAYLOAD.target.port.x+offset,y:BASE_PAYLOAD.target.port.y,z:BASE_PAYLOAD.target.port.z+offset*.3} } });
function draw(){const width=canvas.clientWidth||420,height=canvas.clientHeight||240,dpr=globalThis.devicePixelRatio||1;canvas.width=Math.max(1,Math.floor(width*dpr));canvas.height=Math.max(1,Math.floor(height*dpr));gl.viewport(0,0,canvas.width,canvas.height);gl.enable(gl.DEPTH_TEST);gl.clearColor(.055,.05,.04,.02);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const t=createMachineTransitionFromPayload(payload()),camera=resolveMachineCamera({cameraId:'SEAT_CLOSE',subject:t.subject,viewport:{width,height},distance:6.8}),target=[camera.target.x,camera.target.y,camera.target.z],eye=[target[0]+4.8,target[1]+3.1,target[2]+5.4];perspective(projectionMatrix,Math.PI/3,width/Math.max(1,height),.1,100);lookAt(viewMatrix,eye,target);gl.useProgram(prog);gl.uniformMatrix4fv(projection,false,projectionMatrix);gl.uniformMatrix4fv(view,false,viewMatrix);
const renderPart=(part,tint)=>{gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,0,0);modelMatrix(modelMatrixValue,[part.center.x,part.center.y,part.center.z],[part.dimensions.x/2,part.dimensions.y/2,part.dimensions.z/2]);gl.uniformMatrix4fv(model,false,modelMatrixValue);gl.uniform4f(color,...tint,1);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.drawElements(gl.TRIANGLES,INDICES.length,gl.UNSIGNED_SHORT,0);};
renderPart(t.sourceGeometry,[.43,.50,.57]);renderPart(t.targetGeometry,[.64,.57,.47]);
if(t.wiring){gl.bindBuffer(gl.ARRAY_BUFFER,wiringBuffer);const route=new Float32Array(t.wiring.route.flatMap(p=>[p.x,p.y,p.z]));gl.bufferData(gl.ARRAY_BUFFER,route,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,0,0);gl.uniformMatrix4fv(model,false,identity);gl.uniform4f(color,.82,.38,.18,1);gl.drawArrays(gl.LINE_STRIP,0,t.wiring.route.length);}
modelMatrix(modelMatrixValue,[t.subject.center.x,t.subject.center.y+.03,t.subject.center.z],[(t.subject.max.x-t.subject.min.x)/2,.03,(t.subject.max.z-t.subject.min.z)/2]);gl.uniformMatrix4fv(model,false,modelMatrixValue);gl.uniform4f(color,.74,.27,.12,.72);gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.drawElements(gl.TRIANGLES,INDICES.length,gl.UNSIGNED_SHORT,0);}
panel.querySelector('[data-machine-webgl-nudge]').addEventListener('click',()=>{offset=offset?0:1.05;panel.querySelector('[data-machine-webgl-state]').textContent=offset?'payload geometry moved · subject + wiring moved':'payload subject returned to base geometry';draw();});if(typeof ResizeObserver!=='undefined')new ResizeObserver(draw).observe(canvas);draw();return panel;}
const machineQuery=globalThis.location&&new URLSearchParams(globalThis.location.search).get('machine-preview');if(machineQuery==='webgl'){if(globalThis.document?.readyState==='loading')globalThis.document.addEventListener('DOMContentLoaded',()=>mountMachineWebGLPreview(),{once:true});else if(globalThis.document)mountMachineWebGLPreview();}
