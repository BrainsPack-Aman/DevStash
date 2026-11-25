import { Suspense } from "react";
import { cookies } from "next/headers";

import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  SIDEBAR_COLLAPSED_COOKIE,
  SIDEBAR_SECTION_KEYS,
  sidebarSectionCookie,
  type SidebarSectionsOpen,
} from "@/lib/sidebar-cookie";

async function ShellWithPreferences({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialCollapsed = cookieStore.get(SIDEBAR_COLLAPSED_COOKIE)?.value === "true";
  const initialSectionsOpen = Object.fromEntries(
    SIDEBAR_SECTION_KEYS.map((key) => [key, cookieStore.get(sidebarSectionCookie(key))?.value !== "false"]),
  ) as SidebarSectionsOpen;

  return (
    <DashboardShell initialCollapsed={initialCollapsed} initialSectionsOpen={initialSectionsOpen}>
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
