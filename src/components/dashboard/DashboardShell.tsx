"use client";

import { useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import {
  writeSidebarCollapsedCookie,
  writeSidebarSectionCookie,
  type SidebarSectionKey,
  type SidebarSectionsOpen,
} from "@/lib/sidebar-cookie";

interface DashboardShellProps {
  children: React.ReactNode;
  initialCollapsed: boolean;
  initialSectionsOpen: SidebarSectionsOpen;
}

export default function DashboardShell({
  children,
  initialCollapsed,
  initialSectionsOpen,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [sectionsOpen, setSectionsOpen] = useState(initialSectionsOpen);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    writeSidebarCollapsedCookie(next);
  }

  function toggleSection(key: SidebarSectionKey) {
    const next = !sectionsOpen[key];
    setSectionsOpen((current) => ({ ...current, [key]: next }));
    writeSidebarSectionCookie(key, next);
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar onOpenMobileSidebar={() => setMobileOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`hidden shrink-0 border-r transition-[width] duration-200 md:block ${
            collapsed ? "w-14" : "w-64"
          }`}
        >
          <Sidebar
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
            sectionsOpen={sectionsOpen}
            onToggleSection={toggleSection}
          />
        </aside>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" showCloseButton={false} className="w-64 gap-0 p-0 md:hidden">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Browse item types and collections
          </SheetDescription>
          <Sidebar
            sectionsOpen={sectionsOpen}
            onToggleSection={toggleSection}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
