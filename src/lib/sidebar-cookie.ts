export const SIDEBAR_COLLAPSED_COOKIE = "sidebar-collapsed";

export const SIDEBAR_SECTION_KEYS = ["favorites", "recent"] as const;

export type SidebarSectionKey = (typeof SIDEBAR_SECTION_KEYS)[number];
export type SidebarSectionsOpen = Record<SidebarSectionKey, boolean>;

export const sidebarSectionCookie = (key: SidebarSectionKey) => `sidebar-section-${key}`;

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function writeCookie(name: string, value: boolean) {
  document.cookie = `${name}=${value}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

export function writeSidebarCollapsedCookie(collapsed: boolean) {
  writeCookie(SIDEBAR_COLLAPSED_COOKIE, collapsed);
}

export function writeSidebarSectionCookie(key: SidebarSectionKey, open: boolean) {
  writeCookie(sidebarSectionCookie(key), open);
}
