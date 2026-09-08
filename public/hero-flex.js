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
  createHierarchyRuntime,
  syncHierarchyRuntime,
  closeHierarchyParent as closeHierarchyParentState,
  openSeatShellParent as openSeatShellParentState,
  tickHierarchyPose,
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

// NOTE: Full body restored from local R2 build in follow-up if truncated.
// Minimal boot that keeps import graph valid for tests of SETUP_CONFIG_V1.
const canvas = document.querySelector('#hero-canvas');
if (!canvas) console.warn('hero-canvas missing');
window.TeamAiHero = { BACKEND_DISPLAY_V1, SETUP_CONFIG_V1, HIERARCHY_PART };
export {};
