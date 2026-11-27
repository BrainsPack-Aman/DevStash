"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown, Folder, PanelLeft, Star, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { ITEM_TYPE_ICONS } from "@/lib/item-type-icons";
import { currentUser } from "@/lib/mock-data";
import type { SidebarSectionKey, SidebarSectionsOpen } from "@/lib/sidebar-cookie";
import type { DashboardCollection, ItemType } from "@/types/dashboard";

type Collection = DashboardCollection;

interface SidebarProps {
  sectionsOpen: SidebarSectionsOpen;
  onToggleSection: (key: SidebarSectionKey) => void;
  itemTypes: ItemType[];
  collections: Collection[];
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
  viewAllLabel: string;
  // recent collections draw their folder outline in their main type color
  showTypeColor: boolean;
  collections: Collection[];
}

const SIDEBAR_LIST_LIMIT = 5;
const ALL_COLLECTIONS_HREF = "/collections";
const FAVORITE_COLLECTIONS_HREF = "/collections?filter=favorites";
const PRO_TYPE_SLUGS = new Set(["files", "images"]);

// `collections` arrives most recently updated first.
function buildCollectionSections(collections: Collection[]): CollectionSection[] {
  return [
    {
      key: "favorites",
      title: "Favorites",
      icon: Star,
      iconClassName: "fill-yellow-400 text-yellow-400",
      showCount: false,
      viewAllHref: FAVORITE_COLLECTIONS_HREF,
      viewAllLabel: "View all favorites",
      showTypeColor: false,
      collections: collections.filter((c) => c.isFavorite),
    },
    {
      key: "recent",
      title: "Recent collections",
      icon: Folder,
      iconClassName: "",
      showCount: true,
      viewAllHref: ALL_COLLECTIONS_HREF,
      viewAllLabel: "View all collections",
      showTypeColor: true,
      collections: collections.filter((c) => !c.isFavorite),
    },
  ];
}

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
            <Icon
              className={`size-4 shrink-0 ${section.iconClassName}`}
              style={
                section.showTypeColor && collection.primaryType
                  ? { color: collection.primaryType.color }
                  : undefined
              }
            />
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
        <Link
          href={section.viewAllHref}
          onClick={() => setOpen(false)}
          className="px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {section.viewAllLabel}
        </Link>
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
        </div>
      )}
    </>
  );
}

export default function Sidebar({
  sectionsOpen,
  onToggleSection,
  itemTypes,
  collections,
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
}: SidebarProps) {
  const linkClass = `${LINK_CLASS} ${collapsed ? "justify-center" : ""}`;
  const collectionSections = buildCollectionSections(collections);

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

      <nav className="no-scrollbar flex-1 space-y-6 overflow-y-auto p-2">
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
                        <span className="flex flex-1 items-center gap-2">
                          {type.name}s
                          {PRO_TYPE_SLUGS.has(type.slug) && (
                            <Badge
                              variant="outline"
                              className="h-4 px-1.5 text-[10px] tracking-wider text-muted-foreground"
                            >
                              PRO
                            </Badge>
                          )}
                        </span>
                        <span className="text-xs">{type.count}</span>
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {collectionSections.map((section) => (
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

        {!collapsed && (
          <Link
            href={ALL_COLLECTIONS_HREF}
            onClick={onNavigate}
            className="block px-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View all collections
          </Link>
        )}
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
