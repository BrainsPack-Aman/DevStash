import CollectionCard from "@/components/dashboard/CollectionCard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import ItemCard from "@/components/dashboard/ItemCard";
import StatsCards from "@/components/dashboard/StatsCards";
import {
  getPinnedItems,
  getRecentCollections,
  getRecentItems,
  getStats,
} from "@/lib/dashboard-data";
import { currentUser } from "@/lib/mock-data";

export default function DashboardPage() {
  const firstName = currentUser.name.split(" ")[0];
  const stats = getStats();
  const recentCollections = getRecentCollections();
  const pinnedItems = getPinnedItems();
  const recentItems = getRecentItems();

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground">Everything you need, right where you left it.</p>
      </header>

      <StatsCards stats={stats} />

      <DashboardSection
        title="Recent collections"
        description="Spaces for the things you want to keep close."
        viewAllHref="/collections"
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </DashboardSection>

      {pinnedItems.length > 0 && (
        <DashboardSection title="Pinned items" description="Your go-to snippets, prompts and notes.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </DashboardSection>
      )}

      <DashboardSection title="Recent items" description="Pick up where you left off.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
