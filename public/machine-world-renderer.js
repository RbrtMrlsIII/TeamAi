/**
 * Canonical TeamAi Spatial World renderer.
 *
 * Owns the active WebGL scene for the machine-world canvas:
 * semantic machine-core layout -> physical modules -> semantic connections ->
 * camera subject -> deep-space environment.
 *
 * This replaces the historical hero-flex drawing path without creating a
 * second canvas or a second WebGL context. hero-flex remains the interaction
 * and DOM compatibility controller during migration.
 */
import { createBranchConnectionCore, resolveBranchCamera } from './machine-core-layout-runtime.js';
import { createMachineAnimation } from './machine-core-animation.js';
import { deriveMachineSubject } from './machine-hero-scene.js';
import { buildMachineCoreSeat1Connection } from './machine-core-seat-connection.js';
import { buildAdjacentDivisionWiring, adjacentDivisionWiringPoint } from './seat-adjacent-division-wiring.js';
import { createDeepSpaceField, DEEP_SPACE_NEBULA_ANCHORS } from './hero-environment.js';
import { BACKEND_DISPLAY_V1, drawBackendDisplayRing } from './hero-r1-backend-display.js';
import { drawBackendDisplayThreads } from './hero-r1-backend-threads.js';
import { SETUP_CONFIG_V1, drawSetupConfigRing } from './hero-r2-setup-ring.js';
import { RING_R1_SCALE, RING_R2_SCALE, NAV_ZOOM_MAX } from './hero-world-contract.js';
import { worldPullbackProgress, blendCameraPose } from './hero-cam3-tree-center-zoom.js';
import { deriveConcentricRingEnvelope } from './hero-ring-envelope.js';
import { deriveWorkspaceCoreGeometry } from './hero-workspace-core.js';
import { deriveMachineWorldProfile } from './hero-world-profile.js';
import { mapHeroThemeLighting } from './hero-theme-lighting-adapter.js';
import { authoredRingMaterial, authoredSeatShellMaterial, authoredSeatInsetMaterial } from './hero-authored-materials.js';
import { drawFocusedSeatDivision, deriveFocusedSeatDivisionGeometry } from './machine-seat-division-presentation.js';
import { resolveSeatDivisionPayload, SEAT_DIVISION_ORDER } from './machine-seat-division-payload.js';
import { electricalRoutePoint, electricalRoutePrefix, resolveElectricalEdgeRoute } from './machine-energy-flow.js';
import { deriveMachineTransformationChoreography } from './machine-choreography.js';
const TAU = Math.PI * 2;
const STAR_FIELD = createDeepSpaceField({ seed: 396 });
const POLYS = {
  hex: [[-1,0],[-.5,-.86],[.5,-.86],[1,0],[.5,.86],[-.5,.86]],
  pod: [[-.9,-.25],[-.55,-.58],[.18,-.62],[.78,-.30],[.9,.12],[.5,.5],[-.3,.58],[-.82,.3]],
  fin: [[-1,-.55],[.05,-.7],[1,.3],[.35,.66],[-.5,.55]],
  arc: [[-.95,-.3],[-.45,-.7],[.25,-.7],[.85,-.28],[.85,.18],[.25,.68],[-.42,.62],[-.86,.25],[-.28,.08],[.35,.16],[.18,-.08],[-.38,-.03]],
  diamond: [[0,-.9],[.72,0],[0,.9],[-.72,0]],
  blade: [[-.95,-.6],[-.18,-.82],[.78,-.28],[.98,.12],[.2,.74],[-.72,.55]],
};
const COLORS = {
  hub: [0.70,0.76,0.82],
  pod: [0.46,0.58,0.69],
  fin: [0.56,0.63,0.71],
  arc: [0.50,0.67,0.72],
  diamond: [0.66,0.58,0.49],
  blade: [0.46,0.65,0.59],
  connection: [0.28,0.66,0.86],
};
const UI_COLORS = {
  'command-core': [0.88,0.93,0.98],
  'seat-configuration': [0.76,0.87,0.95],
  'outer-fin': [0.78,0.88,0.93],
  'outer-arc': [0.80,0.89,0.92],
  'outer-diamond': [0.88,0.84,0.76],
  'outer-blade': [0.78,0.90,0.84],
};

const clamp = (v,a,b) => Math.max(a, Math.min(b, Number(v) || 0));
const finite = (v,f=0) => Number.isFinite(Number(v)) ? Number(v) : f;

function resolveHeroMaterialContext(state, reducedMotion) {
  const root = globalThis.document?.documentElement;
  const heroState = String(state?.heroState || 'IDLE');
  return mapHeroThemeLighting({
    themeMode: root?.getAttribute?.('data-theme-mode') || 'light',
    themeSource: root?.getAttribute?.('data-theme-source') || 'default',
    density: root?.getAttribute?.('data-density') || 'default',
    atmosphere: 0.52,
    surface: heroState === 'ACTIVE' || heroState === 'CONTRIBUTE' ? 0.82 : 0.62,
    focus: heroState === 'FOCUS' || heroState === 'ACTIVE' ? 0.86 : 0.24,
    signal: heroState === 'CONTRIBUTE' ? 1 : heroState === 'ABSORB' || heroState === 'REFLECT' ? 0.78 : 0,
    status: heroState === 'BLOCKED' ? 0.8 : heroState === 'UNAUTHORIZED' ? 0.55 : 0,
    reducedMotion: Boolean(reducedMotion),
  });
}

function shader(gl, type, source) {
  const value = gl.createShader(type);
  gl.shaderSource(value, source);
  gl.compileShader(value);
  if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(value) || 'machine-world shader compile failed');
  }
  return value;
}

function program(gl, vs, fs) {
  const value = gl.createProgram();
  gl.attachShader(value, shader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(value, shader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(value);
  if (!gl.getProgramParameter(value, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(value) || 'machine-world program link failed');
  }
  return value;
}

function shapeBuffer(gl, polygon, height) {
  const vertices = [];
  const count = polygon.length;
  const pushTri = (a,b,c) => vertices.push(...a,...b,...c);
  for (let i = 1; i < count - 1; i += 1) {
    pushTri([0,0,0],[polygon[i][0],0,polygon[i][1]],[polygon[i+1][0],0,polygon[i+1][1]]);
    pushTri([0,height,0],[polygon[i+1][0],height,polygon[i+1][1]],[polygon[i][0],height,polygon[i][1]]);
  }
  for (let i = 0; i < count; i += 1) {
    const j = (i + 1) % count;
    const [ax,az] = polygon[i];
    const [bx,bz] = polygon[j];
    pushTri([ax,0,az],[bx,0,bz],[bx,height,bz]);
    pushTri([ax,0,az],[bx,height,bz],[ax,height,az]);
  }
  return new Float32Array(vertices);
}

function perspective(out, fovDeg, aspect, near, far) {
  const f = 1 / Math.tan((fovDeg * Math.PI / 180) / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
}

function lookAt(out, eye, target) {
  let zx = eye[0] - target[0], zy = eye[1] - target[1], zz = eye[2] - target[2];
  const zl = Math.hypot(zx,zy,zz) || 1;
  zx /= zl; zy /= zl; zz /= zl;
  let xx = zz, xy = 0, xz = -zx;
  const xl = Math.hypot(xx, xz) || 1;
  xx /= xl; xz /= xl;
  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;
  out.set([
    xx,yx,zx,0,
    xy,yy,zy,0,
    xz,yz,zz,0,
    -(xx*eye[0]+xy*eye[1]+xz*eye[2]),
    -(yx*eye[0]+yy*eye[1]+yz*eye[2]),
    -(zx*eye[0]+zy*eye[1]+zz*eye[2]),
    1,
  ]);
}

function modelMatrix(out, center, scale) {
  out.set([
    scale[0],0,0,0,
    0,scale[1],0,0,
    0,0,scale[2],0,
    center[0],center[1],center[2],1,
  ]);
}

function ringPoints(count, radius, y) {
  const out = new Float32Array((count + 1) * 3);
  for (let i = 0; i <= count; i += 1) {
    const a = i / count * TAU;
    out[i*3] = Math.cos(a) * radius;
    out[i*3+1] = y;
    out[i*3+2] = Math.sin(a) * radius;
  }
  return out;
}

function regularPolygon(sides, phase = 0) {
  return Array.from({ length: sides }, (_, index) => {
    const a = phase + index / sides * TAU;
    return [Math.cos(a), Math.sin(a)];
  });
}

const PRIMITIVE_POLYGONS = Object.freeze({
  CUBE: POLYS.pod,
  CYL: regularPolygon(16),
  TORUS: regularPolygon(12),
  SPH: regularPolygon(10),
});

const RING_MATERIALS = Object.freeze({
  metal: Object.freeze({ color: [0.42, 0.50, 0.56], emit: 0.02 }),
  metal2: Object.freeze({ color: [0.28, 0.36, 0.42], emit: 0.01 }),
  glass: Object.freeze({ color: [0.58, 0.72, 0.82], emit: 0.06 }),
  energy: Object.freeze({ color: [0.28, 0.76, 1.00], emit: 0.16 }),
  trace: Object.freeze({ color: [0.30, 0.52, 0.66], emit: 0.03 }),
});

function translateMatrix(x, y, z) {
  return new Float32Array([
    1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1,
  ]);
}

function scaleMatrix(x, y, z) {
  return new Float32Array([
    x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1,
  ]);
}

function rotateYMatrix(angle) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return new Float32Array([
    c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1,
  ]);
}

function multiplyMatrix(a, b) {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

export function createMachineWorldRenderer({ canvas, gl: providedGl } = {}) {
  const gl = providedGl || canvas?.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
  if (!canvas || !gl) throw new Error('machine-world renderer requires the canonical Hero canvas and WebGL context');

  const solid = program(gl,
    'attribute vec3 p; uniform mat4 P; uniform mat4 V; uniform mat4 M; varying vec3 W; void main(){vec4 wp=M*vec4(p,1.0);W=wp.xyz;gl_Position=P*V*wp;}',
    'precision mediump float; uniform vec4 c; uniform float glow; varying vec3 W; void main(){vec3 n=normalize(vec3(W.x*.018+.12, .88, W.z*.018+.20));float d=.34+.66*max(dot(n,normalize(vec3(-.42,.86,.32))),0.0);float rim=pow(1.0-max(dot(n,normalize(vec3(.15,.85,.50))),0.0),3.0);gl_FragColor=vec4(c.rgb*(d+.10*rim)+vec3(.05,.08,.11)*glow,c.a);}'
  );
  const line = program(gl,
    'attribute vec3 p; uniform mat4 P; uniform mat4 V; uniform mat4 M; void main(){gl_Position=P*V*M*vec4(p,1.0);}',
    'precision mediump float; uniform vec4 c; void main(){gl_FragColor=c;}'
  );
  const star = program(gl,
    'attribute vec3 p; attribute float s; attribute float phase; uniform mat4 P; uniform mat4 V; uniform float time; varying float a; void main(){vec4 vp=V*vec4(p,1.0);gl_Position=P*vp;gl_PointSize=min(4.2,s*(18.0/max(9.0,-vp.z)));a=.64+.20*sin(time*.27+phase);}',
    'precision mediump float; varying float a; void main(){vec2 d=gl_PointCoord-.5;float r=dot(d,d);float soft=1.0-smoothstep(.03,.25,r);if(soft<=0.0)discard;gl_FragColor=vec4(.68,.78,.90,a*soft);}'
  );

  const solidPos = gl.getAttribLocation(solid,'p');
    const solidP = gl.getUniformLocation(solid,'P');
  const solidV = gl.getUniformLocation(solid,'V');
  const solidM = gl.getUniformLocation(solid,'M');
  const solidColor = gl.getUniformLocation(solid,'c');
  const solidGlow = gl.getUniformLocation(solid,'glow');
  const linePos = gl.getAttribLocation(line,'p');
  const lineP = gl.getUniformLocation(line,'P');
  const lineV = gl.getUniformLocation(line,'V');
  const lineM = gl.getUniformLocation(line,'M');
  const lineColor = gl.getUniformLocation(line,'c');
  const starPos = gl.getAttribLocation(star,'p');
  const starSize = gl.getAttribLocation(star,'s');
  const starPhase = gl.getAttribLocation(star,'phase');
  const starP = gl.getUniformLocation(star,'P');
  const starV = gl.getUniformLocation(star,'V');
  const starTime = gl.getUniformLocation(star,'time');

  const projection = new Float32Array(16);
  const view = new Float32Array(16);
  const identity = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
  const model = new Float32Array(16);
  const buffers = new Map();
  const wireBuffer = gl.createBuffer();
  const starBuffers = {
    position: gl.createBuffer(),
    size: gl.createBuffer(),
    phase: gl.createBuffer(),
  };
  const points = STAR_FIELD.map((s) => s.position);
  const sizes = STAR_FIELD.map((s) => s.size * 42);
  const phases = STAR_FIELD.map((s) => s.position[0] * .47 + s.position[2] * .31);
  gl.bindBuffer(gl.ARRAY_BUFFER, starBuffers.position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.flat()), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, starBuffers.size);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, starBuffers.phase);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(phases), gl.STATIC_DRAW);

  const animation = createMachineAnimation({ duration: 950 });
  let targetExpanded = false;
  let branchId = 'HUB-CORE';
  let lastSeat1AdjacentWiring = null;
  let disposed = false;
  const primitiveBuffers = new Map();

  function worldProfile(seatCount) {
    const profile = deriveMachineWorldProfile(seatCount);
    return {
      workspace: profile.workspaceFootprint,
      seatRadius: profile.seatShellRadius,
    };
  }

  function ensurePrimitiveBuffer(kind) {
    const key = String(kind);
    let entry = primitiveBuffers.get(key);
    if (entry) return entry;
    const polygon = PRIMITIVE_POLYGONS[key] || PRIMITIVE_POLYGONS.CUBE;
    const data = shapeBuffer(gl, polygon, 1);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    entry = { buffer, count: data.length / 3 };
    primitiveBuffers.set(key, entry);
    return entry;
  }

  function ringDraw(shape, transform, material, options = {}) {
    const entry = ensurePrimitiveBuffer(shape);
    const color = material?.color || [0.5, 0.6, 0.7];
    const glow = finite(options.emit, material?.emit || 0) + finite(options.glow, 0);
    gl.useProgram(solid);
    gl.bindBuffer(gl.ARRAY_BUFFER, entry.buffer);
    gl.enableVertexAttribArray(solidPos);
    gl.vertexAttribPointer(solidPos,3,gl.FLOAT,false,0,0);
    gl.uniformMatrix4fv(solidP,false,projection);
    gl.uniformMatrix4fv(solidV,false,view);
    gl.uniformMatrix4fv(solidM,false,transform);
    gl.uniform4f(solidColor,color[0],color[1],color[2],finite(options.alpha, 1));
    gl.uniform1f(solidGlow,glow);
    gl.drawArrays(gl.TRIANGLES,0,entry.count);
  }

  function drawCanonicalRings({ seatCount, ringFocus, setupRingFillAmount, reducedMotion, now, seatRingRadius, articulationAmount }) {
    const profile = worldProfile(seatCount);
    const workspaceCore = deriveWorkspaceCoreGeometry({
      workspaceRadius: profile.workspace,
      expansionAmount: articulationAmount,
    });
    const envelope = deriveConcentricRingEnvelope({
      r0Radius: workspaceCore.radius,
      r3Radius: seatRingRadius,
      ringR1Scale: RING_R1_SCALE,
      ringR2Scale: RING_R2_SCALE,
    });
    const common = {
      profile: () => profile,
      seatCount,
      ringFocus,
      reducedMotion,
      draw: ringDraw,
      CUBE: 'CUBE',
      CYL: 'CYL',
      TORUS: 'TORUS',
      SPH: 'SPH',
      T: translateMatrix,
      S: scaleMatrix,
      RY: rotateYMatrix,
      mul: multiplyMatrix,
      M: RING_MATERIALS,
    };
    drawBackendDisplayRing({
      ...common,
      ringScale: RING_R1_SCALE,
      ringRadius: envelope.r1Radius,
      articulationAmount,
      catalog: BACKEND_DISPLAY_V1,
    }, now / 1000);
    drawBackendDisplayThreads({
      ...common,
      ringScale: RING_R1_SCALE,
      ringRadius: envelope.r1Radius,
      articulationAmount,
      catalog: BACKEND_DISPLAY_V1,
    }, now / 1000);
    drawSetupConfigRing({
      ...common,
      ringScale: RING_R2_SCALE,
      ringRadius: envelope.r2Radius,
      articulationAmount,
      items: SETUP_CONFIG_V1,
      focusedIndex: ringFocus?.ring === 'r2' ? ringFocus.index : -1,
      fillAmount: setupRingFillAmount,
    }, now / 1000);
    canvas.dataset.machineWorldR1 = 'backend-display';
    canvas.dataset.machineWorldR1Count = String(BACKEND_DISPLAY_V1.length);
    canvas.dataset.machineWorldR1Threads = '2';
    canvas.dataset.machineWorldR2 = 'setup-config';
    canvas.dataset.machineWorldR2Count = String(SETUP_CONFIG_V1.length);
    canvas.dataset.machineWorldR0Radius = String(envelope.workspaceRadius);
    canvas.dataset.machineWorldR1Radius = String(envelope.r1Radius);
    canvas.dataset.machineWorldR2Radius = String(envelope.r2Radius);
    canvas.dataset.machineWorldR3Radius = String(envelope.seatRingRadius);
  }

  function ensureBuffer(part) {
    const key = part.branchId || part.id;
    let entry = buffers.get(key);
    if (entry) return entry;
    const polygon = part.kind === 'hub' ? POLYS.hex : (POLYS[part.silhouette] || POLYS.pod);
    const data = shapeBuffer(gl, polygon, part.dimensions.y);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    entry = { buffer, count: data.length / 3 };
    buffers.set(key, entry);
    return entry;
  }

  function fitWorldCamera(scene, viewport, cameraId) {
    const subject = deriveMachineSubject(scene.parts, 0.2);
    const selected = resolveBranchCamera(scene, cameraId) || resolveBranchCamera(scene, 'HUB-CORE') || scene.cameras[0];
    const span = subject ? Math.max(subject.max.x - subject.min.x, subject.max.z - subject.min.z) : 1;
    const distance = clamp(span * 1.12 + 6, 10, 22);
    const target = selected?.target || subject?.center || {x:0,y:.5,z:0};
    const side = finite(selected?.position?.x, 0);
    const depth = finite(selected?.position?.z, distance);
    const bearing = Math.atan2(side, depth);
    const pitch = Math.max(2.8, distance * .34);
    const aspect = viewport.width / Math.max(1, viewport.height);
    const responsive = aspect < .8 ? 1.25 : aspect < 1.1 ? 1.10 : 1;
    return {
      target: { x: target.x, y: target.y, z: target.z },
      radius: distance * responsive,
      pitch,
      bearing: bearing + .10,
      fov: aspect < .8 ? 48 : 44,
    };
  }

  function renderSeat1ConnectionChild(scene, amount, selectedBranch, reducedMotion, now) {
    if (selectedBranch !== 'BRANCH-SEAT-01' || amount <= 0.02) {
      for (const key of [
        'seatConnectionSemantic',
        'seatConnectionGeometry',
        'seatConnectionEdge',
        'seatConnectionHealth',
        'seatConnectionDrawPath',
        'seatConnectionProof',
      ]) {
        delete canvas.dataset[key];
      }
      return null;
    }
    const shell = scene.byBranch.get('BRANCH-SEAT-01');
    const child = buildMachineCoreSeat1Connection({
      shell,
      expansionAmount: amount,
      density: reducedMotion ? 'compact' : 'default',
    });
    if (!child) return null;
    const geometry = child.geometry;
    const scale = 0.78 + 0.22 * child.amount;
    let entry = buffers.get('__seat1-connection-child');
    if (!entry) {
      const data = shapeBuffer(gl, POLYS.pod, 1);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      entry = { buffer, count: data.length / 3 };
      buffers.set('__seat1-connection-child', entry);
    }
    gl.useProgram(solid);
    gl.bindBuffer(gl.ARRAY_BUFFER, entry.buffer);
    gl.enableVertexAttribArray(solidPos);
    gl.vertexAttribPointer(solidPos,3,gl.FLOAT,false,0,0);
    modelMatrix(model,[geometry.center.x,geometry.center.y,geometry.center.z],[
      geometry.dimensions.width * scale * 0.5,
      geometry.dimensions.height * scale * 0.5,
      geometry.dimensions.depth * scale * 0.5,
    ]);
    gl.uniformMatrix4fv(solidP,false,projection);
    gl.uniformMatrix4fv(solidV,false,view);
    gl.uniformMatrix4fv(solidM,false,model);
    gl.uniform4f(solidColor, COLORS.connection[0], COLORS.connection[1], COLORS.connection[2], 1);
    gl.uniform1f(solidGlow, .85);
    gl.drawArrays(gl.TRIANGLES,0,entry.count);

    gl.useProgram(line);
    gl.uniformMatrix4fv(lineP,false,projection);
    gl.uniformMatrix4fv(lineV,false,view);
    gl.uniformMatrix4fv(lineM,false,identity);
    const start = geometry.corridor.start;
    const signal = child.previewPoint;
    const route = new Float32Array([
      start.x,start.y,start.z,
      signal.x,signal.y,signal.z,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER,wireBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,route,gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(linePos);
    gl.vertexAttribPointer(linePos,3,gl.FLOAT,false,0,0);
    gl.uniform4f(lineColor,.28,.76,1,reducedMotion ? .42 : .62 + .18 * child.amount);
    gl.drawArrays(gl.LINE_STRIP,0,2);

    canvas.dataset.seatConnectionSemantic = child.semanticKey;
    canvas.dataset.seatConnectionGeometry = child.geometry.id;
    canvas.dataset.seatConnectionEdge = child.edgeId;
    canvas.dataset.seatConnectionHealth = child.healthLeaf.semanticKey;
    canvas.dataset.seatConnectionDrawPath = 'canonical-machine-world';
    canvas.dataset.seatConnectionProof = 'semantic+geometry+edge+webgl';
    return child;
  }

  function renderAdjacentDivisionWiring(scene, selectedBranch, state, reducedMotion) {
    lastSeat1AdjacentWiring = null;
    if (!selectedBranch || !state?.hierarchyOpen) return;
    const shell = scene.byBranch.get(selectedBranch);
    if (!shell || !state.focusedChildId) return;

    const focusedIndex = Number.isInteger(state.focusedChildIndex)
      ? state.focusedChildIndex
      : SEAT_DIVISION_ORDER.indexOf(state.focusedChildId);
    if (focusedIndex < 0 || focusedIndex >= SEAT_DIVISION_ORDER.length) return;

    const neighborIndex = focusedIndex > 0 ? focusedIndex - 1 : focusedIndex + 1;
    const neighborId = SEAT_DIVISION_ORDER[neighborIndex];
    if (!neighborId || neighborId === state.focusedChildId) return;

    // The wiring always represents the ordered neighborhood edge. At the first
    // child, focus is the source and the next child is the target. For later
    // children, the previous neighbor is the source and the focused child is
    // the target. This preserves one stable Connection→Behavior seam while
    // remaining generalized for all seven divisions.
    const sourceId = focusedIndex > 0 ? neighborId : state.focusedChildId;
    const targetId = focusedIndex > 0 ? state.focusedChildId : neighborId;
    const sourceIndex = focusedIndex > 0 ? neighborIndex : focusedIndex;
    const targetIndex = focusedIndex > 0 ? focusedIndex : neighborIndex;

    const sourcePayload = resolveSeatDivisionPayload(sourceId);
    const targetPayload = resolveSeatDivisionPayload(targetId);
    if (!sourcePayload || !targetPayload) return;

    const branchAmounts = state.seatDivisionBranchAmounts || {};
    const sourceAmount = clamp(
      finite(branchAmounts[sourcePayload.branchAmountKey] ?? state[sourcePayload.branchAmountKey], 0),
      0,
      1,
    );
    const targetAmount = clamp(
      finite(branchAmounts[targetPayload.branchAmountKey] ?? state[targetPayload.branchAmountKey], 0),
      0,
      1,
    );
    const activeAmount = Math.max(sourceAmount, targetAmount);
    if (activeAmount <= 0.02) return;

    const sourceGeometry = deriveFocusedSeatDivisionGeometry({
      parent: shell,
      childId: sourceId,
      childIndex: sourceIndex,
      amount: sourceAmount,
    });
    const targetGeometry = deriveFocusedSeatDivisionGeometry({
      parent: shell,
      childId: targetId,
      childIndex: targetIndex,
      amount: targetAmount,
    });
    if (!sourceGeometry || !targetGeometry) return;

    const wiring = buildAdjacentDivisionWiring({
      sourceGeometry,
      targetGeometry,
      clearance: Math.max(
        finite(sourceGeometry.clearance, 0.16),
        finite(targetGeometry.clearance, 0.16),
      ),
      amount: sourceAmount,
    });
    const point = adjacentDivisionWiringPoint(wiring, activeAmount);

    gl.useProgram(line);
    gl.uniformMatrix4fv(lineP,false,projection);
    gl.uniformMatrix4fv(lineV,false,view);
    gl.uniformMatrix4fv(lineM,false,identity);
    const route = new Float32Array([
      wiring.from.projected.x,wiring.from.projected.y,wiring.from.projected.z,
      point.x,point.y,point.z,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER,wireBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,route,gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(linePos);
    gl.vertexAttribPointer(linePos,3,gl.FLOAT,false,0,0);
    gl.uniform4f(lineColor,.36,.82,1,reducedMotion ? .26 : .54);
    gl.drawArrays(gl.LINE_STRIP,0,2);

    lastSeat1AdjacentWiring = Object.freeze({
      id: wiring.id,
      from: wiring.from.divisionId,
      to: wiring.to.divisionId,
      sourcePort: Object.freeze({ ...wiring.from.port }),
      targetPort: Object.freeze({ ...wiring.to.port }),
      amount: activeAmount,
      phase: targetAmount > sourceAmount ? 'TARGET_OPENING_OR_ACTIVE' : 'SOURCE_OPENING_OR_ACTIVE',
      presentationOnly: true,
    });
  }

  function renderSemanticEdgeTrace(edge, amount, reducedMotion) {
    const route = Array.isArray(edge?.route) ? edge.route : [];
    if (route.length < 2) return null;
    const activation = Math.max(0, Math.min(1, finite(amount, 0)));
    if (activation <= 0.02) return null;
    const values = route.flatMap((point) => [Number(point.x) || 0, Number(point.y) || 0, Number(point.z) || 0]);
    gl.useProgram(line);
    gl.uniformMatrix4fv(lineP,false,projection);
    gl.uniformMatrix4fv(lineV,false,view);
    gl.uniformMatrix4fv(lineM,false,identity);
    gl.bindBuffer(gl.ARRAY_BUFFER,wireBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(values),gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(linePos);
    gl.vertexAttribPointer(linePos,3,gl.FLOAT,false,0,0);
    gl.uniform4f(lineColor,.20,.46,.72,reducedMotion ? .34 + .20 * activation : .18 + .34 * activation);
    gl.drawArrays(gl.LINE_STRIP,0,route.length);
    return Object.freeze({
      semanticEdgeId: edge.semanticEdgeId || edge.id || null,
      progress: activation,
      presentationOnly: true,
    });
  }

  function renderElectricalEdgeFlow(edge, amount, reducedMotion, now, label = 'machine') {
    const route = resolveElectricalEdgeRoute(edge);
    if (route.length < 2) return null;
    const activation = Math.max(0, Math.min(1, finite(amount, 0)));
    if (activation <= 0.02) return null;
    const cycleProgress = Math.max(0, Math.min(1, (now / 1000 * 0.42) % 1));
    const progress = reducedMotion ? activation : Math.min(activation, cycleProgress);
    const point = electricalRoutePoint(route, progress);
    const prefix = electricalRoutePrefix(route, progress);
    if (!point || prefix.length < 1) return null;

    gl.useProgram(line);
    gl.uniformMatrix4fv(lineP,false,projection);
    gl.uniformMatrix4fv(lineV,false,view);
    gl.uniformMatrix4fv(lineM,false,identity);
    const values = prefix.flatMap((entry) => [entry.x, entry.y, entry.z]);
    gl.bindBuffer(gl.ARRAY_BUFFER,wireBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(values),gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(linePos);
    gl.vertexAttribPointer(linePos,3,gl.FLOAT,false,0,0);
    gl.uniform4f(lineColor,.30,.86,1,reducedMotion ? .20 + .22 * activation : .34 + .42 * activation);
    gl.drawArrays(gl.LINE_STRIP,0,prefix.length);

    ringDraw(
      'SPH',
      multiplyMatrix(
        translateMatrix(point.x, point.y, point.z),
        scaleMatrix(.12, .12, .12),
      ),
      RING_MATERIALS.energy,
      {
        glow: reducedMotion ? .12 : .26,
        emit: reducedMotion ? .08 + .08 * activation : .12 + .18 * activation,
        alpha: reducedMotion ? .36 + .19 * activation : .48 + .40 * activation,
      },
    );

    return Object.freeze({
      semanticEdgeId: edge.semanticEdgeId || edge.id || null,
      label,
      progress,
      target: Object.freeze({ ...route.at(-1) }),
      presentationOnly: true,
    });
  }

  let lastCanvasWidth = 0;
  let lastCanvasHeight = 0;

  function resizeCanvasIfNeeded(width, height, dpr) {
    const pixelWidth = Math.max(1, Math.floor(width * dpr));
    const pixelHeight = Math.max(1, Math.floor(height * dpr));
    const changed = canvas.width !== pixelWidth || canvas.height !== pixelHeight;
    if (changed) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    if (lastCanvasWidth !== pixelWidth || lastCanvasHeight !== pixelHeight) {
      gl.viewport(0, 0, pixelWidth, pixelHeight);
      lastCanvasWidth = pixelWidth;
      lastCanvasHeight = pixelHeight;
    }
    return Object.freeze({
      width: pixelWidth,
      height: pixelHeight,
      changed,
    });
  }

  function render(timestamp = performance.now(), state = {}) {
    if (disposed) return;
    const now = finite(timestamp, performance.now());
    if (state.machineLayer === false) {
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      canvas.dataset.machineWorldLayer = 'entrance';
      return null;
    }
    canvas.dataset.machineWorldLayer = 'machine';
    const width = canvas.clientWidth || 1180;
    const height = canvas.clientHeight || 760;
    const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
    resizeCanvasIfNeeded(width, height, dpr);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(.012,.020,.032,1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    const reducedMotion = Boolean(state.reducedMotion);
    const hierarchyOpen = Boolean(state.hierarchyOpen);
    const materialLighting = resolveHeroMaterialContext(state, reducedMotion);
    const authoredRing = authoredRingMaterial(materialLighting);
    const authoredSeatShell = authoredSeatShellMaterial(materialLighting);
    const authoredSeatInset = authoredSeatInsetMaterial(materialLighting);
    const wantedExpanded = hierarchyOpen || Boolean(state.expanded);
    if (wantedExpanded !== targetExpanded) {
      targetExpanded = wantedExpanded;
      animation.setTarget(targetExpanded ? 'expanded' : 'collapsed', now);
    }
    const sample = animation.sample(now);
    const branchAmounts = state.seatDivisionBranchAmounts || {};
    const connectionAmount = finite(
      branchAmounts.connectionBranchAmount ?? state.connectionBranchAmount,
      0,
    );
    const choreography = deriveMachineTransformationChoreography({
      shellAmount: finite(state.hierarchyOpenAmount, sample.amount),
      divisionAmount: finite(state.focusedChildAmount, 0),
      connectionAmount,
      heroState: state.heroState,
      contributionAmount: finite(state.contributionAmount, 0),
      hierarchyOpen,
      focusedChildId: state.focusedChildId,
      reducedMotion,
    });
    const seatCount = clamp(Math.floor(Number(state.seatCount) || 10), 1, 10);
    const workspaceProfile = worldProfile(seatCount);
    const selectedSeat = clamp(Math.floor(Number(state.selectedSeat) || 0), 0, seatCount - 1);
    branchId = state.branchId || `BRANCH-SEAT-${String(selectedSeat+1).padStart(2,'0')}`;
    const scene = createBranchConnectionCore({ seatCount, expansionAmount: sample.amount });
    const effectiveCameraId = hierarchyOpen ? branchId : 'HUB-CORE';
    const cameraSpec = fitWorldCamera(scene,{width,height},effectiveCameraId);
    const zoom = clamp(finite(state.navZoom,1),.78,NAV_ZOOM_MAX);
    const pullback = hierarchyOpen ? worldPullbackProgress(zoom, NAV_ZOOM_MAX) : 0;
    const subjectTarget = cameraSpec.target;
    const subjectRadius = cameraSpec.radius * clamp(zoom,.78,1);
    const subjectPose = {
      p: [
        subjectTarget.x + Math.sin(cameraSpec.bearing + finite(state.navOrbitYaw,0)) * subjectRadius * .82,
        subjectTarget.y + cameraSpec.pitch + finite(state.navOrbitPitch,0) * 4.0,
        subjectTarget.z + Math.cos(cameraSpec.bearing + finite(state.navOrbitYaw,0)) * subjectRadius,
      ],
      t: [subjectTarget.x,subjectTarget.y,subjectTarget.z],
      f: cameraSpec.fov,
    };
    const worldRadius = Math.max(cameraSpec.radius, Math.min(30, cameraSpec.radius * 1.72));
    const worldPose = {
      p: [
        scene.hub.center.x + Math.sin(cameraSpec.bearing) * worldRadius * .82,
        scene.hub.center.y + Math.max(4.4, worldRadius*.34),
        scene.hub.center.z + Math.cos(cameraSpec.bearing) * worldRadius,
      ],
      t: [scene.hub.center.x,scene.hub.center.y,scene.hub.center.z],
      f: Math.min(50, cameraSpec.fov + 2),
    };
    const cameraPose = blendCameraPose(subjectPose, worldPose, pullback);
    const eye = [
      cameraPose.p[0],
      cameraPose.p[1],
      cameraPose.p[2],
    ];
    lookAt(view,eye,cameraPose.t);
    perspective(projection,cameraPose.f,width/Math.max(1,height),.1,120);

    gl.useProgram(star);
    gl.uniformMatrix4fv(starP,false,projection);
    gl.uniformMatrix4fv(starV,false,view);
    gl.uniform1f(starTime,reducedMotion ? 0 : now/1000);
    gl.bindBuffer(gl.ARRAY_BUFFER,starBuffers.position);
    gl.enableVertexAttribArray(starPos);
    gl.vertexAttribPointer(starPos,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,starBuffers.size);
    gl.enableVertexAttribArray(starSize);
    gl.vertexAttribPointer(starSize,1,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,starBuffers.phase);
    gl.enableVertexAttribArray(starPhase);
    gl.vertexAttribPointer(starPhase,1,gl.FLOAT,false,0,0);
    gl.depthMask(false);
    gl.drawArrays(gl.POINTS,0,STAR_FIELD.length);
    gl.depthMask(true);

    const seatRingRadius = Math.max(
      ...scene.parts
        .filter((part) => part.kind === 'inner-pod' && Number.isInteger(part.seatIndex))
        .map((part) => Math.hypot(part.center.x, part.center.z)),
      0,
    );
    drawCanonicalRings({
      seatCount,
      ringFocus: state.ringFocus,
      setupRingFillAmount: finite(state.setupRingFillAmount, 0),
      reducedMotion,
      now,
      seatRingRadius,
      articulationAmount: sample.amount,
    });

    for (const fog of DEEP_SPACE_NEBULA_ANCHORS) {
      const size = fog.scale;
      const faux = { id: 'environment-nebula', branchId: 'environment-nebula', kind: 'hub', center: {x:fog.position[0],y:fog.position[1],z:fog.position[2]}, dimensions: {x:size[0],y:size[1],z:size[2]}, silhouette:'hex' };
      const entry = ensureBuffer(faux);
      gl.useProgram(solid);
      gl.bindBuffer(gl.ARRAY_BUFFER,entry.buffer);
      gl.enableVertexAttribArray(solidPos);
      gl.vertexAttribPointer(solidPos,3,gl.FLOAT,false,0,0);
      modelMatrix(model,faux.center,[size[0],size[1],size[2]]);
      gl.uniformMatrix4fv(solidP,false,projection);
      gl.uniformMatrix4fv(solidV,false,view);
      gl.uniformMatrix4fv(solidM,false,model);
      gl.uniform4f(solidColor,.06,.09,.14,1);
      gl.uniform1f(solidGlow,.04);
      gl.drawArrays(gl.TRIANGLES,0,entry.count);
    }

    for (const part of scene.parts) {
      const entry = ensureBuffer(part);
      gl.useProgram(solid);
      gl.bindBuffer(gl.ARRAY_BUFFER,entry.buffer);
      gl.enableVertexAttribArray(solidPos);
      gl.vertexAttribPointer(solidPos,3,gl.FLOAT,false,0,0);
      modelMatrix(model,[part.center.x,part.level - part.dimensions.y*.25,part.center.z],[
        part.dimensions.x*.58,
        part.dimensions.y*.62,
        part.dimensions.z*.58,
      ]);
      gl.uniformMatrix4fv(solidP,false,projection);
      gl.uniformMatrix4fv(solidV,false,view);
      gl.uniformMatrix4fv(solidM,false,model);
      const fallbackColor = COLORS[part.silhouette || 'pod'] || COLORS.pod;
      const partMaterial = part.kind === 'inner-pod' ? authoredSeatShell : null;
      const color = partMaterial?.color || fallbackColor;
      const selected = part.branchId === branchId;
      gl.uniform4f(solidColor,
        clamp(color[0] + (selected ? .14 : 0),0,1),
        clamp(color[1] + (selected ? .14 : 0),0,1),
        clamp(color[2] + (selected ? .14 : 0),0,1),
        1
      );
      gl.uniform1f(solidGlow, (partMaterial?.emit || 0) + (selected ? .75 : .16));
      gl.drawArrays(gl.TRIANGLES,0,entry.count);

      if (part.kind === 'inner-pod') {
        modelMatrix(model,[part.center.x,part.level - part.dimensions.y*.26,part.center.z],[
          part.dimensions.x*.54,
          part.dimensions.y*.52,
          part.dimensions.z*.54,
        ]);
        gl.uniformMatrix4fv(solidM,false,model);
        gl.uniform4f(solidColor,authoredSeatInset.color[0],authoredSeatInset.color[1],authoredSeatInset.color[2],1);
        gl.uniform1f(solidGlow,authoredSeatInset.emit || 0);
        gl.drawArrays(gl.TRIANGLES,0,entry.count);
      }

      if (part.uiSurface) {
        modelMatrix(model,
          [part.uiSurface.anchor.x,part.uiSurface.anchor.y,part.uiSurface.anchor.z],
          [Math.max(.16,part.uiSurface.width*.34),.024,Math.max(.14,part.uiSurface.depth*.32)]
        );
        gl.uniformMatrix4fv(solidM,false,model);
        const ui = UI_COLORS[part.uiStyle] || [0.80,0.87,0.92];
        gl.uniform4f(solidColor,ui[0],ui[1],ui[2],1);
        gl.uniform1f(solidGlow,selected ? .72 : .28);
        gl.drawArrays(gl.TRIANGLES,0,entry.count);
      }
    }

    // Seat-1 child and adjacent wiring are frame-level passes, not per-part draws.
    // Reuse the canonical branch aggregate resolved at the top of the frame.
    const seat1ConnectionAmount = clamp(
      finite(branchAmounts.connectionBranchAmount ?? state.connectionBranchAmount, 0),
      0,
      1,
    );
    const seat1Child = renderSeat1ConnectionChild(scene, seat1ConnectionAmount, effectiveCameraId, reducedMotion, now);
    renderAdjacentDivisionWiring(scene, effectiveCameraId, state, reducedMotion);
    if (hierarchyOpen && state.focusedChildId && state.focusedChildId !== 'SEAT_CONNECTION') {
      const shell = scene.byBranch.get(effectiveCameraId);
      const focusedDivision = drawFocusedSeatDivision({
        parent: shell,
        childId: state.focusedChildId,
        childIndex: state.focusedChildIndex,
        amount: state.focusedChildAmount,
        reducedMotion,
        draw: ringDraw,
        CYL: 'CYL',
        TORUS: 'TORUS',
        CUBE: 'CUBE',
        T: translateMatrix,
        S: scaleMatrix,
        RY: rotateYMatrix,
        mul: multiplyMatrix,
        M: RING_MATERIALS,
      }, now / 1000);
      canvas.dataset.machineWorldFocusedDivision = focusedDivision?.childId || '';
      canvas.dataset.machineWorldFocusedDivisionGeometry = focusedDivision?.id || '';
      canvas.dataset.machineWorldFocusedDivisionCamera = focusedDivision?.cameraId || '';
      const focusedDivisionTrace = renderSemanticEdgeTrace(
        focusedDivision?.edge,
        state.focusedChildAmount,
        reducedMotion,
      );
      canvas.dataset.machineWorldFocusedDivisionEdge = focusedDivisionTrace?.semanticEdgeId || '';
    } else {
      canvas.dataset.machineWorldFocusedDivision = '';
      canvas.dataset.machineWorldFocusedDivisionGeometry = '';
      canvas.dataset.machineWorldFocusedDivisionCamera = '';
      canvas.dataset.machineWorldFocusedDivisionEdge = '';
    }

    let electricalMachineFlow = null;
    let electricalWorkspaceFlow = null;
    if (hierarchyOpen && sample.amount > 0.02) {
      const selectedMachineEdge = scene.connections.find((edge) =>
        edge.kind === 'inner-spoke' && edge.targetBranchId === branchId
      );
      if (selectedMachineEdge) {
        electricalMachineFlow = renderElectricalEdgeFlow(
          selectedMachineEdge,
          choreography.electrical,
          reducedMotion,
          now,
          'selected-seat',
        );
      }
    }
    if (
      seat1Child
      && hierarchyOpen
      && effectiveCameraId === 'BRANCH-SEAT-01'
      && state.focusedChildId === 'SEAT_CONNECTION'
      && finite(state.connectionBranchAmount, 0) > 0.02
    ) {
      electricalWorkspaceFlow = renderElectricalEdgeFlow(
        seat1Child.edge,
        choreography.workspaceReception,
        reducedMotion,
        now,
        'workspace-center',
      );
    }
    canvas.dataset.machineWorldElectricalEdge = electricalMachineFlow?.semanticEdgeId || '';
    canvas.dataset.machineWorldElectricalProgress = String(electricalMachineFlow?.progress ?? '');
    canvas.dataset.machineWorldWorkspaceElectricalEdge = electricalWorkspaceFlow?.semanticEdgeId || '';
    canvas.dataset.machineWorldElectricalProof = electricalWorkspaceFlow
      ? 'semantic-edge-route+workspace-center'
      : electricalMachineFlow
        ? 'semantic-edge-route'
        : '';

    gl.useProgram(line);
    gl.uniformMatrix4fv(lineP,false,projection);
    gl.uniformMatrix4fv(lineV,false,view);
    gl.uniformMatrix4fv(lineM,false,identity);
    for (const connection of scene.connections) {
      const route = connection.route.flatMap((point) => [point.x,point.y,point.z]);
      gl.bindBuffer(gl.ARRAY_BUFFER,wireBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(route),gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(linePos);
      gl.vertexAttribPointer(linePos,3,gl.FLOAT,false,0,0);
      const selected = connection.targetBranchId === branchId || connection.sourceBranchId === branchId;
      const pulse = reducedMotion ? .34 : .32 + .24 * (.5 + .5*Math.sin(now*.004 + connection.id.length));
      gl.uniform4f(lineColor,
        selected ? .36 : .14,
        selected ? .82 : .58,
        1,
        selected ? .72 : pulse
      );
      gl.drawArrays(gl.LINE_STRIP,0,connection.route.length);
    }
    const workspaceCore = deriveWorkspaceCoreGeometry({
      workspaceRadius: workspaceProfile.workspace,
      expansionAmount: choreography.transformation,
    });
    ringDraw(
      'CYL',
      multiplyMatrix(
        translateMatrix(workspaceCore.center.x, workspaceCore.center.y, workspaceCore.center.z),
        scaleMatrix(workspaceCore.innerRadius * (0.20 + 0.08 * choreography.workspaceReception), 0.12 + 0.06 * choreography.workspaceReception, workspaceCore.innerRadius * (0.20 + 0.08 * choreography.workspaceReception)),
      ),
      RING_MATERIALS.metal2,
      {
        rough: 0.34,
        emit: 0.05 + 0.10 * choreography.workspaceReception,
        alpha: 0.82,
      },
    );
    ringDraw(
      'TORUS',
      multiplyMatrix(
        translateMatrix(workspaceCore.center.x, workspaceCore.center.y + 0.08, workspaceCore.center.z),
        scaleMatrix(workspaceCore.radius, 1, workspaceCore.radius),
      ),
      authoredRing,
      {
        rough: authoredRing.rough,
        emit: reducedMotion ? authoredRing.emit + 0.04 * choreography.workspaceReception : authoredRing.emit + 0.14 * choreography.workspaceReception,
        alpha: reducedMotion ? 0.38 + 0.10 * choreography.workspaceReception : 0.56 + 0.18 * choreography.workspaceReception,
      },
    );
    if (!reducedMotion) {
      const ring = ringPoints(144, workspaceCore.radius, workspaceCore.center.y + 0.03);
      gl.useProgram(line);
      gl.uniformMatrix4fv(lineP,false,projection);
      gl.uniformMatrix4fv(lineV,false,view);
      gl.uniformMatrix4fv(lineM,false,identity);
      gl.bindBuffer(gl.ARRAY_BUFFER,wireBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,ring,gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(linePos);
      gl.vertexAttribPointer(linePos,3,gl.FLOAT,false,0,0);
      gl.uniform4f(lineColor,.38,.68,.96,.22);
      gl.drawArrays(gl.LINE_STRIP,0,145);
    }
    canvas.dataset.machineWorldWorkspaceCore = workspaceCore.id;
    canvas.dataset.machineWorldWorkspaceCenter = String(workspaceCore.center.x) + ',' + String(workspaceCore.center.y) + ',' + String(workspaceCore.center.z);
    canvas.dataset.machineWorldWorkspaceRadius = String(workspaceCore.radius);
    canvas.dataset.machineWorldWorkspaceReception = String(choreography.workspaceReception);
    canvas.dataset.machineWorldState = sample.state;
    canvas.dataset.machineWorldAmount = String(sample.amount);
    canvas.dataset.machineWorldBranch = branchId;
    canvas.dataset.machineWorldModules = String(scene.parts.length);
    canvas.dataset.machineWorldSeats = String(scene.seatCount);
    canvas.dataset.machineWorldRenderer = 'canonical';
    canvas.dataset.machineWorldChoreographyPhase = choreography.phase;
    canvas.dataset.machineWorldChoreographyElectrical = String(choreography.electrical);
    canvas.dataset.machineWorldChoreographyWorkspaceReception = String(choreography.workspaceReception);
    canvas.dataset.machineWorldRingAuthority = 'canonical-machine-world';
    canvas.dataset.machineWorldMaterialModel = 'hero-authored-v1';

    return Object.freeze({
      state: sample.state,
      amount: sample.amount,
      branchId,
      moduleCount: scene.parts.length,
      seatCount: scene.seatCount,
      subject: deriveMachineSubject(scene.parts, .2),
      seat1AdjacentWiring: lastSeat1AdjacentWiring,
    });
  }

  return Object.freeze({
    render,
    setExpanded(value, now = performance.now()) {
      targetExpanded = Boolean(value);
      animation.setTarget(targetExpanded ? 'expanded' : 'collapsed', now);
    },
    getSeat1AdjacentWiring() { return lastSeat1AdjacentWiring; },
    dispose() { disposed = true; },
  });
}
