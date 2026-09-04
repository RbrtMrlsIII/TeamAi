const MODE_KEY = "teamai.theme.mode";
const SOURCE_KEY = "teamai.theme.source";
const MOTION_KEY = "teamai.theme.motion";
const DENSITY_KEY = "teamai.theme.density";

export type ThemeMode = "dark" | "light";
export type ThemeSource = "user" | "os";
export type MotionPref = "full" | "reduced";
export type Density = "default" | "compact";

function osMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function readStoredMode(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(MODE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function readSource(): ThemeSource {
  if (typeof window === "undefined") return "user";
  return window.localStorage.getItem(SOURCE_KEY) === "os" ? "os" : "user";
}

export function readMotion(): MotionPref {
  if (typeof window === "undefined") return "full";
  const value = window.localStorage.getItem(MOTION_KEY);
  if (value === "full" || value === "reduced") return value;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
}

export function readDensity(): Density {
  if (typeof window === "undefined") return "default";
  return window.localStorage.getItem(DENSITY_KEY) === "compact" ? "compact" : "default";
}

export function resolveMode(source: ThemeSource, stored: ThemeMode | null): ThemeMode {
  return source === "os" ? osMode() : (stored ?? "dark");
}

export function applyDocumentTheme(options: {
  mode: ThemeMode;
  source: ThemeSource;
  motion: MotionPref;
  density: Density;
}): void {
  const root = document.documentElement;
  root.setAttribute("data-theme-mode", options.mode);
  root.setAttribute("data-theme-source", options.source);
  root.setAttribute("data-motion", options.motion);
  root.setAttribute("data-density", options.density);
  root.style.colorScheme = options.mode;
}

export function persistTheme(partial: Partial<{
  mode: ThemeMode;
  source: ThemeSource;
  motion: MotionPref;
  density: Density;
}>): void {
  if (partial.mode) {
    localStorage.setItem(MODE_KEY, partial.mode);
    localStorage.setItem(SOURCE_KEY, partial.source ?? "user");
  } else if (partial.source) {
    localStorage.setItem(SOURCE_KEY, partial.source);
  }
  if (partial.motion) localStorage.setItem(MOTION_KEY, partial.motion);
  if (partial.density) localStorage.setItem(DENSITY_KEY, partial.density);
}

export function watchOsTheme(onMode: (mode: ThemeMode) => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const listener = () => {
    if (readSource() === "os") onMode(media.matches ? "light" : "dark");
  };
  media.addEventListener?.("change", listener);
  return () => media.removeEventListener?.("change", listener);
}

export function initializeTheme(): void {
  const source = readSource();
  applyDocumentTheme({
    mode: resolveMode(source, readStoredMode()),
    source,
    motion: readMotion(),
    density: readDensity(),
  });
}

export const THEME_BOOT_SCRIPT = `(function(){
  try {
    var source = localStorage.getItem("teamai.theme.source") === "os" ? "os" : "user";
    var stored = localStorage.getItem("teamai.theme.mode");
    var mode = source === "os"
      ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : (stored === "light" || stored === "dark" ? stored : "dark");
    var motion = localStorage.getItem("teamai.theme.motion");
    if (motion !== "full" && motion !== "reduced") {
      motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
    }
    var density = localStorage.getItem("teamai.theme.density") === "compact" ? "compact" : "default";
    var root = document.documentElement;
    root.setAttribute("data-theme-mode", mode);
    root.setAttribute("data-theme-source", source);
    root.setAttribute("data-motion", motion);
    root.setAttribute("data-density", density);
    root.style.colorScheme = mode;
  } catch (e) {
    var root = document.documentElement;
    root.setAttribute("data-theme-mode", "dark");
    root.setAttribute("data-theme-source", "user");
    root.setAttribute("data-motion", "full");
    root.setAttribute("data-density", "default");
    root.style.colorScheme = "dark";
  }
})();`;
