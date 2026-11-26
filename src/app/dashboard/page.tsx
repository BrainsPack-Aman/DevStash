import { Suspense } from "react";

import CollectionCard from "@/components/dashboard/CollectionCard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import ItemCard from "@/components/dashboard/ItemCard";
import StatsCards from "@/components/dashboard/StatsCards";
import { getPinnedItems, getRecentItems, getStats } from "@/lib/dashboard-data";
import { getCollectionStats, getRecentCollections } from "@/lib/db/collections";
import { currentUser } from "@/lib/mock-data";

async function DashboardStatsCards() {
  const collectionStats = await getCollectionStats();
  return <StatsCards stats={{ ...getStats(), ...collectionStats }} />;
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

function CollectionsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl border bg-card" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const firstName = currentUser.name.split(" ")[0];
  const pinnedItems = getPinnedItems();
  const recentItems = getRecentItems();

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
        <Suspense fallback={<CollectionsSkeleton />}>
          <RecentCollections />
        </Suspense>
      </DashboardSection>

      {pinnedItems.length > 0 && (
        <DashboardSection title="Pinned items" description="Your go-to snippets, prompts and notes.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {pinnedItems.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </DashboardSection>
      )}

      <DashboardSection title="Recent items" description="Pick up where you left off.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recentItems.map((item, index) => (
            <ItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
