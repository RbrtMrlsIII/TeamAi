/** Browser companion for theme-root.ts — keep in sync when TS changes. */
const MODE_KEY = "teamai.theme.mode";
const SOURCE_KEY = "teamai.theme.source";
const MOTION_KEY = "teamai.theme.motion";
const DENSITY_KEY = "teamai.theme.density";
const SCALE_KEY = "teamai.ui.scale";

function osMode() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function readStoredMode() {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(MODE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function readSource() {
  if (typeof window === "undefined") return "user";
  return window.localStorage.getItem(SOURCE_KEY) === "os" ? "os" : "user";
}

export function readMotion() {
  if (typeof window === "undefined") return "full";
  const value = window.localStorage.getItem(MOTION_KEY);
  if (value === "full" || value === "reduced") return value;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
}

export function readDensity() {
  if (typeof window === "undefined") return "default";
  return window.localStorage.getItem(DENSITY_KEY) === "compact" ? "compact" : "default";
}

export function readScale() {
  if (typeof window === "undefined") return 1;
  const value = Number(window.localStorage.getItem(SCALE_KEY));
  if (!Number.isFinite(value)) return 1;
  return Math.min(1.35, Math.max(0.85, value));
}

export function applyUiScale(scale) {
  const root = document.documentElement;
  const next = Math.min(1.35, Math.max(0.85, Number(scale) || 1));
  root.setAttribute("data-ui-scale", String(next));
  root.style.setProperty("--ui-scale", String(next));
  return next;
}

export function resolveMode(source, stored) {
  return source === "os" ? osMode() : (stored ?? "dark");
}

export function applyDocumentTheme(options) {
  const root = document.documentElement;
  root.setAttribute("data-theme-mode", options.mode);
  root.setAttribute("data-theme-source", options.source);
  root.setAttribute("data-motion", options.motion);
  root.setAttribute("data-density", options.density);
  root.style.colorScheme = options.mode;
}

export function persistTheme(partial) {
  if (partial.mode) {
    localStorage.setItem(MODE_KEY, partial.mode);
    localStorage.setItem(SOURCE_KEY, partial.source ?? "user");
  } else if (partial.source) {
    localStorage.setItem(SOURCE_KEY, partial.source);
  }
  if (partial.motion) localStorage.setItem(MOTION_KEY, partial.motion);
  if (partial.density) localStorage.setItem(DENSITY_KEY, partial.density);
  if (partial.scale != null) localStorage.setItem(SCALE_KEY, String(partial.scale));
}

export function watchOsTheme(onMode) {
  if (typeof window === "undefined") return () => undefined;
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const listener = () => {
    if (readSource() === "os") onMode(media.matches ? "light" : "dark");
  };
  media.addEventListener?.("change", listener);
  return () => media.removeEventListener?.("change", listener);
}

export function initializeTheme() {
  const source = readSource();
  applyDocumentTheme({
    mode: resolveMode(source, readStoredMode()),
    source,
    motion: readMotion(),
    density: readDensity(),
  });
  applyUiScale(readScale());
}
