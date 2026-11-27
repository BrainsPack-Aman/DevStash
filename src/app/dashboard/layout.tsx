import { Suspense } from "react";
import { cookies } from "next/headers";

import { getAllCollections } from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  SIDEBAR_COLLAPSED_COOKIE,
  SIDEBAR_SECTION_KEYS,
  sidebarSectionCookie,
  type SidebarSectionsOpen,
} from "@/lib/sidebar-cookie";

async function ShellWithPreferences({ children }: { children: React.ReactNode }) {
  const [cookieStore, itemTypes, collections] = await Promise.all([
    cookies(),
    getSystemItemTypes(),
    getAllCollections(),
  ]);
  const initialCollapsed = cookieStore.get(SIDEBAR_COLLAPSED_COOKIE)?.value === "true";
  const initialSectionsOpen = Object.fromEntries(
    SIDEBAR_SECTION_KEYS.map((key) => [key, cookieStore.get(sidebarSectionCookie(key))?.value !== "false"]),
  ) as SidebarSectionsOpen;

  return (
    <DashboardShell
      initialCollapsed={initialCollapsed}
      initialSectionsOpen={initialSectionsOpen}
      itemTypes={itemTypes}
      collections={collections}
    >
      {children}
    </DashboardShell>
  );
}

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <Suspense fallback={null}>
      <ShellWithPreferences>{children}</ShellWithPreferences>
    </Suspense>
  );
}
