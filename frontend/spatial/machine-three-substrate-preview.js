import {
  createMachineThreeSceneAdapter,
} from './machine-three-scene-adapter.js';
import {
  createBranchConnectionCore,
} from './machine-core-layout.js';
import {
  deriveMachineCoreAssembly,
} from './machine-core-assembly.js';
import {
  deriveMachinePodAssembly,
} from './machine-pod-assembly.js';

const status = document.querySelector('[data-three-status]');
const canvas = document.querySelector('canvas');
let adapter = null;
let overviewPose = null;
let seatPose = null;

function setStatus(value) {
  if (status) status.textContent = value;
}

function poseForAssembly(assembly, distance) {
  const center = assembly?.subject?.center || { x: 0, y: 0.9, z: 0 };
  return {
    position: { x: center.x, y: center.y + distance * 0.30, z: center.z + distance },
    target: { x: center.x, y: center.y + 0.35, z: center.z },
    fov: 32,
  };
}

async function boot() {
  if (!canvas) return;
  try {
    const THREE = await import('/vendor/three/three.module.js');
    adapter = createMachineThreeSceneAdapter({ THREE, canvas });

    const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
    const hub = machine.parts.find((part) => part.kind === 'hub');
    const firstPodPart = machine.parts.find((part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01');
    const core = deriveMachineCoreAssembly({
      hub,
      workspaceCore: { radius: 4.046 },
      expansionAmount: 0,
      adjacentSeatRadius: 5.05,
    });
    const pod = deriveMachinePodAssembly({
      part: firstPodPart,
      expansionAmount: 0,
      payloadDensity: 0.45,
      adjacentCenterSpacing: 2.812,
    });

    const result = adapter.setAssemblies({ core, pods: [pod] });
    const bounds = core?.subject;
    const distance = Math.max(10, (bounds?.max?.x || 0) - (bounds?.min?.x || 0) + 5.5);
    overviewPose = poseForAssembly(core, distance);
    seatPose = poseForAssembly(pod, 4.8);
    adapter.resize();
    adapter.setCameraPose(overviewPose);
    adapter.render();

    setStatus(`READY · WebGL2 · ${THREE.REVISION || 'r186'} · ${result.objectCount} meshes · Core + Seat 1`);
  } catch (error) {
    setStatus(error?.message === 'WEBGL2_UNAVAILABLE' ? 'BLOCKED · WebGL2 unavailable' : 'ERROR · ' + (error?.message || 'Three.js substrate unavailable'));
  }
}

document.querySelectorAll('[data-focus]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!adapter) return;
    adapter.setCameraPose(button.dataset.focus === 'seat' ? seatPose : overviewPose);
    adapter.render();
  });
});

window.addEventListener('resize', () => {
  if (!adapter) return;
  adapter.resize();
  adapter.render();
});

boot();
