/**
 * SP-04 — Apply-path integrity helpers (spatial execution basis Gate S8).
 * Presentation only · no 029-released claim.
 *
 * Every expected Cam flex marker must be present after apply-cam2.
 * Silent no-op / emergency-loader treated as success is forbidden.
 */

/** Ordered expected markers after a successful Cam-2…6 flex apply. */
export const EXPECTED_FLEX_MARKERS = Object.freeze([
  { id: 'cam2-import', needle: "from './hero-cam2-tree-follow.js'" },
  { id: 'cam3-import', needle: "from './hero-cam3-tree-center-zoom.js'" },
  { id: 'cam4-import', needle: "from './hero-cam4-edge-swipe.js'" },
  { id: 'cam5-import', needle: "from './hero-cam5-selected-tree-center.js'" },
  { id: 'follow-fn', needle: 'function followHierarchyTreeCamera' },
  { id: 'should-apply-nav', needle: 'shouldApplyTreeNav' },
  { id: 'seat-dock', needle: 'resolveSelectedSeatDock' },
  { id: 'pose-about', needle: 'poseAboutTreeCenter' },
  { id: 'edge-drift', needle: 'edgeDriftDelta' },
  { id: 'inverse-swipe', needle: 'inverseSwipeDelta' },
  { id: 'world-baseline', needle: 'WORLD_BASELINE_DOCK_ID' },
]);

export const PINNED_BASE_HINT = 'a2f8a3e162ff2a19acc496bff07dd6b6d7ffcdec';

/**
 * @param {string} source
 * @param {{ markers?: typeof EXPECTED_FLEX_MARKERS }} [opts]
 * @returns {{ ok: boolean, missing: string[], present: string[], markerCount: number, isFullAssembly: boolean, isEmergencyLoader: boolean }}
 */
export function verifyFlexIntegrity(source, opts = {}) {
  const markers = opts.markers || EXPECTED_FLEX_MARKERS;
  const text = String(source || '');
  const isEmergencyLoader =
    text.includes('emergency loader') ||
    (text.includes('MAIN_URL') && text.length < 8000) ||
    (text.includes('patchSource') && !text.includes('function cameras()'));
  const isFullAssembly = text.includes('function cameras()') && text.length > 10000;

  const present = [];
  const missing = [];
  for (const m of markers) {
    if (text.includes(m.needle)) present.push(m.id);
    else missing.push(m.id);
  }

  const ok = isFullAssembly && missing.length === 0 && !isEmergencyLoader;
  return {
    ok,
    missing,
    present,
    markerCount: markers.length,
    isFullAssembly,
    isEmergencyLoader,
  };
}

/**
 * Fail loudly when integrity is not satisfied.
 * @param {string} source
 * @param {{ exit?: (code: number) => void, log?: (...args: unknown[]) => void }} [io]
 */
export function assertFlexIntegrityOrExit(source, io = {}) {
  const exit = io.exit || ((code) => process.exit(code));
  const log = io.log || console.error.bind(console);
  const report = verifyFlexIntegrity(source);
  if (report.ok) {
    (io.log || console.log.bind(console))(
      `SP-04 apply integrity OK (${report.present.length}/${report.markerCount} markers)`,
    );
    return report;
  }
  if (report.isEmergencyLoader) {
    log('SP-04 FAIL: result is emergency loader — base restore/apply did not produce full assembly');
  }
  if (!report.isFullAssembly) {
    log('SP-04 FAIL: result is not a full cameras() assembly');
  }
  if (report.missing.length) {
    log('SP-04 FAIL: missing expected flex markers:', report.missing.join(', '));
  }
  exit(1);
  return report;
}
