"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown, Folder, PanelLeft, Star, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { ITEM_TYPE_ICONS } from "@/lib/item-type-icons";
import { collections, currentUser, itemTypes } from "@/lib/mock-data";
import type { SidebarSectionKey, SidebarSectionsOpen } from "@/lib/sidebar-cookie";

type Collection = (typeof collections)[number];

interface SidebarProps {
  sectionsOpen: SidebarSectionsOpen;
  onToggleSection: (key: SidebarSectionKey) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
}

interface CollectionSection {
  key: SidebarSectionKey;
  title: string;
  icon: LucideIcon;
  iconClassName: string;
  showCount: boolean;
  viewAllHref: string;
  collections: Collection[];
}

const SIDEBAR_LIST_LIMIT = 3;

const COLLECTION_SECTIONS: CollectionSection[] = [
  {
    key: "favorites",
    title: "Favorites",
    icon: Star,
    iconClassName: "fill-yellow-400 text-yellow-400",
    showCount: false,
    viewAllHref: "/collections?filter=favorites",
    collections: collections.filter((c) => c.isFavorite),
  },
  {
    key: "recent",
    title: "Recent collections",
    icon: Folder,
    iconClassName: "",
    showCount: true,
    viewAllHref: "/collections",
    collections: collections
      .filter((c) => !c.isFavorite)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  },
];

const initials = currentUser.name
  .split(" ")
  .map((part) => part[0])
  .join("");

const LINK_CLASS =
  "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

function SectionLabel({ collapsed, children }: { collapsed: boolean; children: React.ReactNode }) {
  if (collapsed) {
    return <div className="mx-2 mb-2 border-t" aria-hidden />;
  }
  return (
    <h3 className="px-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  );
}

interface CollectionListProps {
  section: CollectionSection;
  collections: Collection[];
  onNavigate?: () => void;
}

function CollectionList({ section, collections: list, onNavigate }: CollectionListProps) {
  const Icon = section.icon;
  return (
    <ul className="space-y-0.5">
      {list.map((collection) => (
        <li key={collection.id}>
          <Link href={`/collections/${collection.id}`} onClick={onNavigate} className={LINK_CLASS}>
            <Icon className={`size-4 shrink-0 ${section.iconClassName}`} />
            <span className="flex-1 truncate">{collection.name}</span>
            {section.showCount && <span className="text-xs">{collection.itemCount}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function CollapsedSectionButton({ section }: { section: CollectionSection }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            title={section.title}
            aria-label={section.title}
            className="mx-auto flex"
          />
        }
      >
        <Icon className={section.iconClassName} />
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="w-60 gap-1 p-2">
        <PopoverTitle className="px-2 py-1 text-xs uppercase tracking-wider text-muted-foreground">
          {section.title}
        </PopoverTitle>
        <div className="max-h-80 overflow-y-auto">
          <CollectionList
            section={section}
            collections={section.collections}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ExpandedSectionProps {
  section: CollectionSection;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

function ExpandedSection({ section, open, onToggle, onNavigate }: ExpandedSectionProps) {
  const total = section.collections.length;
  const listId = useId();

  return (
    <>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={onToggle}
          className="flex w-full items-center justify-between rounded-md px-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        >
          {section.title}
          <ChevronDown
            className={`size-3.5 transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
          />
        </button>
      </h3>
      {open && (
        <div id={listId}>
          <CollectionList
            section={section}
            collections={section.collections.slice(0, SIDEBAR_LIST_LIMIT)}
            onNavigate={onNavigate}
          />
          {total > SIDEBAR_LIST_LIMIT && (
            <Link
              href={section.viewAllHref}
              onClick={onNavigate}
              className="mt-1 block px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              View all ({total})
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default function Sidebar({
  sectionsOpen,
  onToggleSection,
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
}: SidebarProps) {
  const linkClass = `${LINK_CLASS} ${collapsed ? "justify-center" : ""}`;

  return (
    <div className="flex h-full flex-col">
      {onToggleCollapsed && (
        <div className={`flex p-2 ${collapsed ? "justify-center" : "justify-end"}`}>
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={onToggleCollapsed}
          >
            <PanelLeft />
          </Button>
        </div>
      )}

      <nav className="flex-1 space-y-6 overflow-y-auto p-2">
        <section>
          <SectionLabel collapsed={collapsed}>Types</SectionLabel>
          <ul className="space-y-0.5">
            {itemTypes.map((type) => {
              const Icon = ITEM_TYPE_ICONS[type.icon];
              return (
                <li key={type.id}>
                  <Link
                    href={`/items/${type.slug}`}
                    onClick={onNavigate}
                    title={`${type.name}s`}
                    className={linkClass}
                  >
                    {Icon && <Icon className="size-4 shrink-0" style={{ color: type.color }} />}
                    {!collapsed && (
                      <>
                        <span className="flex-1">{type.name}s</span>
                        <span className="text-xs">{type.count}</span>
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {COLLECTION_SECTIONS.map((section) => (
          <section key={section.title}>
            {collapsed ? (
              <>
                <SectionLabel collapsed>{section.title}</SectionLabel>
                <CollapsedSectionButton section={section} />
              </>
            ) : (
              <ExpandedSection
                section={section}
                open={sectionsOpen[section.key]}
                onToggle={() => onToggleSection(section.key)}
                onNavigate={onNavigate}
              />
            )}
          </section>
        ))}
      </nav>

      <div className={`flex items-center gap-3 border-t p-3 ${collapsed ? "justify-center" : ""}`}>
        <div
          title={currentUser.name}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold"
        >
          {initials}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{currentUser.name}</p>
            <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
