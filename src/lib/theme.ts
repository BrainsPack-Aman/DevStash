// The theme registry. To add a theme, add an entry here and a matching
// `:root[data-theme="<id>"]` token block in `src/app/themes.css`.
//
// Every theme has a light and a dark mode. The theme is `data-theme` on <html>
// (absent for the default) and the mode is its `dark` class. `startsDark` is the
// mode a theme opens in until the user switches it.
export const THEMES = [
  { id: "default", name: "Default", startsDark: true },
  { id: "vercel", name: "Vercel", startsDark: true },
  { id: "claude", name: "Claude", startsDark: false },
  { id: "dracula", name: "Dracula", startsDark: true },
  { id: "nord", name: "Nord", startsDark: true },
  { id: "monokai", name: "Monokai", startsDark: true },
  { id: "github", name: "GitHub", startsDark: false },
  { id: "midnight", name: "Midnight", startsDark: true },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

// localStorage keys. THEME holds the selected theme's id and is absent while on
// the default. Each theme remembers its own "light" or "dark"; the default one
// uses the key that predates the other themes.
const THEME_STORAGE_KEY = "color-theme";
const DEFAULT_MODE_STORAGE_KEY = "theme";
const MODE_STORAGE_PREFIX = "theme-mode-";

const STARTS_DARK = Object.fromEntries(
  THEMES.map((theme) => [theme.id, theme.startsDark]),
) as Record<ThemeId, boolean>;

const modeStorageKey = (id: ThemeId) =>
  id === "default" ? DEFAULT_MODE_STORAGE_KEY : `${MODE_STORAGE_PREFIX}${id}`;

// Runs in <head> before the first paint, so the stored theme never flashes.
// The server renders the default theme in dark mode.
export const THEME_INIT_SCRIPT = `try{var d=document.documentElement,s=${JSON.stringify(STARTS_DARK)},t=localStorage.getItem("${THEME_STORAGE_KEY}");if(!Object.prototype.hasOwnProperty.call(s,t))t="default";var m=localStorage.getItem(t==="default"?"${DEFAULT_MODE_STORAGE_KEY}":"${MODE_STORAGE_PREFIX}"+t);if(t==="default")d.removeAttribute("data-theme");else d.setAttribute("data-theme",t);d.classList.toggle("dark",m==="dark"||(m!=="light"&&s[t]))}catch(e){}`;

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the theme still applies for this session.
  }
}

function showTheme(id: ThemeId, isDark: boolean) {
  const root = document.documentElement;
  if (id === "default") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", id);
  root.classList.toggle("dark", isDark);
}

// The mode a theme is shown in: the stored one, or the one it starts in.
function isDarkTheme(id: ThemeId) {
  const mode = readStorage(modeStorageKey(id));
  return mode === "dark" || (mode !== "light" && STARTS_DARK[id]);
}

export function selectTheme(id: ThemeId) {
  writeStorage(THEME_STORAGE_KEY, id === "default" ? null : id);
  showTheme(id, isDarkTheme(id));
}

// Puts the stored theme back on <html>. In development React can reset the
// attributes the init script set; in production this changes nothing.
export function restoreTheme() {
  const stored = readStorage(THEME_STORAGE_KEY);
  const id = THEMES.find((theme) => theme.id === stored)?.id ?? "default";
  showTheme(id, isDarkTheme(id));
}

// Switches the current theme between light and dark.
export function selectMode(isDark: boolean) {
  const id = getThemeId();
  writeStorage(modeStorageKey(id), isDark ? "dark" : "light");
  showTheme(id, isDark);
}

export function getThemeId(): ThemeId {
  const id = document.documentElement.dataset.theme;
  return THEMES.find((theme) => theme.id === id)?.id ?? "default";
}

export function getIsDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

// Notifies when the theme or mode on <html> changes.
export function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
  return () => observer.disconnect();
}
