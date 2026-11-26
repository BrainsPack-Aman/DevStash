import { Suspense } from "react";

import CollectionCard from "@/components/dashboard/CollectionCard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import ItemCard from "@/components/dashboard/ItemCard";
import StatsCards from "@/components/dashboard/StatsCards";
import { getCollectionStats, getRecentCollections } from "@/lib/db/collections";
import { getItemStats, getPinnedItems, getRecentItems } from "@/lib/db/items";
import { currentUser } from "@/lib/mock-data";

async function DashboardStatsCards() {
  const [itemStats, collectionStats] = await Promise.all([getItemStats(), getCollectionStats()]);
  return <StatsCards stats={{ ...itemStats, ...collectionStats }} />;
}

async function RecentCollections() {
  const recentCollections = await getRecentCollections();
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {recentCollections.map((collection, index) => (
        <CollectionCard key={collection.id} collection={collection} index={index} />
      ))}
    </div>
  );
}

async function PinnedItems() {
  const pinnedItems = await getPinnedItems();
  if (pinnedItems.length === 0) return null;

  return (
    <DashboardSection title="Pinned items" description="Your go-to snippets, prompts and notes.">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {pinnedItems.map((item, index) => (
          <ItemCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </DashboardSection>
  );
}

async function RecentItems() {
  const recentItems = await getRecentItems();
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {recentItems.map((item, index) => (
        <ItemCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}

function CardsSkeleton({ count, className }: { count: number; className: string }) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl border bg-card" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const firstName = currentUser.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="animate-in fade-in slide-in-from-bottom-1 duration-500 motion-reduce:animate-none">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground">Everything you need, right where you left it.</p>
      </header>

      <Suspense fallback={<div className="h-[74px] animate-pulse rounded-xl border bg-card" />}>
        <DashboardStatsCards />
      </Suspense>

      <DashboardSection
        title="Recent collections"
        description="Spaces for the things you want to keep close."
        viewAllHref="/collections"
      >
        <Suspense
          fallback={<CardsSkeleton count={6} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" />}
        >
          <RecentCollections />
        </Suspense>
      </DashboardSection>

      <Suspense fallback={null}>
        <PinnedItems />
      </Suspense>

      <DashboardSection title="Recent items" description="Pick up where you left off.">
        <Suspense
          fallback={<CardsSkeleton count={6} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" />}
        >
          <RecentItems />
        </Suspense>
      </DashboardSection>
    </div>
  );
}
