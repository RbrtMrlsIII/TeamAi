/**
 * 031 Cam-7 semantic subject adapter.
 * Presentation-only: preserves the named camera authority while retargeting
 * the camera target to a geometry-derived semantic subject when one exists.
 */

export function semanticSubjectTarget(subject, fallback = [0, 0.82, 0]) {
  if (!subject?.center) return fallback.slice();
  return [
    Number(subject.center.x) || 0,
    Number(subject.center.y) || 0,
    Number(subject.center.z) || 0,
  ];
}

export function applySemanticSubjectCameraTarget(camera, subject) {
  if (!camera || !Array.isArray(camera.t) || !subject?.center) return camera;
  return {
    ...camera,
    t: semanticSubjectTarget(subject, camera.t),
  };
}
