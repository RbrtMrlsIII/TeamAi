import { createMachineTransition, resolveMachineCamera } from './machine-hero-scene.js';

const SOURCE = {
  id: 'seat-0-connection',
  semanticId: 'SEAT_CONNECTION',
  kind: 'division',
  center: { x: -1.15, y: 0.55, z: 0 },
  dimensions: { x: 1.7, y: 0.7, z: 1.35 },
  port: { x: -0.28, y: 0.7, z: 0 },
};
const TARGET = {
  id: 'seat-0-behavior',
  semanticId: 'SEAT_BEHAVIOR',
  kind: 'division',
  center: { x: 1.05, y: 0.55, z: 0.15 },
  dimensions: { x: 1.45, y: 0.7, z: 1.2 },
  port: { x: 0.32, y: 0.7, z: 0.15 },
};

const clamp01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));

function shader(gl, type, source) {
  const value = gl.createShader(type);
  gl.shaderSource(value, source);
  gl.compileShader(value);
  if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(value) || 'shader compile failed');
  }
  return value;
}

function program(gl) {
  const vertex = shader(gl, gl.VERTEX_SHADER, `
    attribute vec3 a_position;
    uniform mat4 u_projection;
    uniform mat4 u_view;
    uniform mat4 u_model;
    void main() { gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0); }
  `);
  const fragment = shader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform vec4 u_color;
    void main() { gl_FragColor = u_color; }
  `);
  const linked = gl.createProgram();
  gl.attachShader(linked, vertex);
  gl.attachShader(linked, fragment);
  gl.linkProgram(linked);
  if (!gl.getProgramParameter(linked, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(linked) || 'program link failed');
  }
  return linked;
}

function perspective(out, fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
  return out;
}

function lookAt(out, eye, target, up = [0, 1, 0]) {
  let zx = eye[0] - target[0];
  let zy = eye[1] - target[1];
  let zz = eye[2] - target[2];
  let zLen = Math.hypot(zx, zy, zz) || 1;
  zx /= zLen; zy /= zLen; zz /= zLen;
  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  let xLen = Math.hypot(xx, xy, xz) || 1;
  xx /= xLen; xy /= xLen; xz /= xLen;
  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;
  out.set([
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
    -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
    -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
    1,
  ]);
  return out;
}

function modelMatrix(out, center, size) {
  out.set([
    size[0], 0, 0, 0,
    0, size[1], 0, 0,
    0, 0, size[2], 0,
    center[0], center[1], center[2], 1,
  ]);
  return out;
}

const CUBE = new Float32Array([
  -1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1,
  -1,-1,1, 1,-1,1, 1,1,1, -1,1,1,
]);
const INDICES = new Uint16Array([
  0,1,2, 0,2,3, 4,6,5, 4,7,6,
  0,4,5, 0,5,1, 3,2,6, 3,6,7,
  1,5,6, 1,6,2, 0,3,7, 0,7,4,
]);

export function mountMachineWebGLPreview(root = document) {
  if (!root || root.querySelector('[data-machine-hero-webgl]')) return null;
  const host = root.querySelector('.hero-shell');
  if (!host) return null;

  const panel = document.createElement('aside');
  panel.className = 'machine-hero-preview machine-hero-preview--webgl';
  panel.dataset.machineHeroWebgl = '1';
  panel.innerHTML = `
    <div class="machine-hero-preview__header"><strong>Machine 3D</strong><span>semantic camera</span></div>
    <div class="machine-hero-preview__controls">
      <button type="button" data-machine-webgl-nudge>Move geometry</button>
      <output data-machine-webgl-state>subject follows geometry</output>
    </div>
    <canvas aria-label="Interactive Machine Hero WebGL preview"></canvas>`;
  host.append(panel);

  const canvas = panel.querySelector('canvas');
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
  if (!gl) {
    panel.querySelector('[data-machine-webgl-state]').textContent = 'WebGL unavailable';
    return panel;
  }

  const prog = program(gl);
  const position = gl.getAttribLocation(prog, 'a_position');
  const projection = gl.getUniformLocation(prog, 'u_projection');
  const view = gl.getUniformLocation(prog, 'u_view');
  const model = gl.getUniformLocation(prog, 'u_model');
  const color = gl.getUniformLocation(prog, 'u_color');

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, CUBE, gl.STATIC_DRAW);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, INDICES, gl.STATIC_DRAW);

  let offset = 0;
  const projectionMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const modelMatrixValue = new Float32Array(16);

  function transition() {
    return createMachineTransition({
      seatIndex: 0,
      source: SOURCE,
      target: {
        ...TARGET,
        center: { x: TARGET.center.x + offset, y: TARGET.center.y, z: TARGET.center.z + offset * 0.3 },
        port: { x: TARGET.port.x + offset, y: TARGET.port.y, z: TARGET.port.z + offset * 0.3 },
      },
      expansion: { sourceAmount: 0.88, targetAmount: 0.66 },
      wiring: { id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING' },
    });
  }

  function draw() {
    const width = canvas.clientWidth || 420;
    const height = canvas.clientHeight || 240;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.055, 0.05, 0.04, 0.02);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const t = transition();
    const camera = resolveMachineCamera({ cameraId: 'SEAT_CLOSE', subject: t.subject, viewport: { width, height }, distance: 6.8 });
    const target = [camera.target.x, camera.target.y, camera.target.z];
    const eye = [target[0] + 4.8, target[1] + 3.1, target[2] + 5.4];
    perspective(projectionMatrix, Math.PI / 3, width / Math.max(1, height), 0.1, 100);
    lookAt(viewMatrix, eye, target);

    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.uniformMatrix4fv(projection, false, projectionMatrix);
    gl.uniformMatrix4fv(view, false, viewMatrix);

    const renderPart = (part, tint, lift = 0) => {
      modelMatrix(modelMatrixValue,
        [part.center.x, part.center.y + lift, part.center.z],
        [part.dimensions.x / 2, part.dimensions.y / 2, part.dimensions.z / 2]);
      gl.uniformMatrix4fv(model, false, modelMatrixValue);
      gl.uniform4f(color, tint[0], tint[1], tint[2], 1);
      gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0);
    };

    renderPart(t.sourceGeometry, [0.43, 0.50, 0.57]);
    renderPart(t.targetGeometry, [0.64, 0.57, 0.47]);

    modelMatrix(modelMatrixValue,
      [t.subject.center.x, t.subject.center.y + 0.03, t.subject.center.z],
      [(t.subject.max.x - t.subject.min.x) / 2, 0.03, (t.subject.max.z - t.subject.min.z) / 2]);
    gl.uniformMatrix4fv(model, false, modelMatrixValue);
    gl.uniform4f(color, 0.74, 0.27, 0.12, 0.72);
    gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0);
  }

  panel.querySelector('[data-machine-webgl-nudge]').addEventListener('click', () => {
    offset = offset ? 0 : 1.05;
    panel.querySelector('[data-machine-webgl-state]').textContent = offset ? 'geometry moved · target moved' : 'subject returned to base geometry';
    draw();
  });

  const observer = new ResizeObserver(draw);
  observer.observe(canvas);
  draw();
  return panel;
}

if (new URLSearchParams(window.location.search).get('machine-preview') === 'webgl') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => mountMachineWebGLPreview(), { once: true });
  else mountMachineWebGLPreview();
}
