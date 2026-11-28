"use client";

import { FolderPlus, Menu, Plus, Search } from "lucide-react";

import ThemeSelector from "@/components/dashboard/ThemeSelector";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  onOpenMobileSidebar: () => void;
}

function SearchField({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="search" placeholder="Search anything..." className="h-9 pl-9" />
    </div>
  );
}

export default function TopBar({ onOpenMobileSidebar }: TopBarProps) {
  return (
    <header className="border-b bg-header-surface px-4 md:px-6">
      <div className="flex h-16 items-center gap-2 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4">
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            DS
          </div>
          <span className="heading text-lg max-[22.5rem]:sr-only">DevStash</span>
        </div>

        <SearchField className="mx-auto hidden w-full max-w-md md:block" />

        <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
          <ThemeSelector />
          <ThemeToggle />
          <Button variant="outline" size="icon" aria-label="New collection" className="lg:hidden">
            <FolderPlus />
          </Button>
          <Button variant="outline" className="hidden lg:inline-flex">
            <FolderPlus />
            New collection
          </Button>
          <Button size="icon" aria-label="New item" className="lg:hidden">
            <Plus />
          </Button>
          <Button className="hidden lg:inline-flex">
            <Plus />
            New item
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open sidebar"
            className="md:hidden"
            onClick={onOpenMobileSidebar}
          >
            <Menu />
          </Button>
        </div>
      </div>

      <div className="pb-3 md:hidden">
        <SearchField />
      </div>
    </header>
  );
}
