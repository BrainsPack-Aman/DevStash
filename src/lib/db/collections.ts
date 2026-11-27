import { prisma } from "@/lib/prisma";
import type { CollectionTypeSummary, DashboardCollection } from "@/types/dashboard";

export const RECENT_COLLECTIONS_LIMIT = 6;

// No auth yet: the dashboard shows the seeded demo user's data.
const DEMO_USER_EMAIL = "demo@devstash.io";

async function findCollections(limit?: number): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { user: { email: DEMO_USER_EMAIL } },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      defaultType: true,
      items: { select: { item: { select: { itemType: true } } } },
    },
  });

  return collections.map((collection) => {
    const counts = new Map<string, CollectionTypeSummary>();
    for (const { item } of collection.items) {
      const { id, name, icon, color } = item.itemType;
      const entry = counts.get(id) ?? { id, name, icon, color, count: 0 };
      entry.count += 1;
      counts.set(id, entry);
    }

    // Most-used type first; name breaks ties so the order is stable.
    const types = [...counts.values()].sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name),
    );
    const { defaultType } = collection;
    const primaryType =
      types[0] ??
      (defaultType
        ? {
            id: defaultType.id,
            name: defaultType.name,
            icon: defaultType.icon,
            color: defaultType.color,
            count: 0,
          }
        : null);

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description ?? "",
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      updatedAt: collection.updatedAt.toISOString(),
      primaryType,
      types,
    };
  });
}

export function getRecentCollections(
  limit = RECENT_COLLECTIONS_LIMIT,
): Promise<DashboardCollection[]> {
  return findCollections(limit);
}

// Every collection, most recently updated first (the sidebar splits favorites from the rest).
export function getAllCollections(): Promise<DashboardCollection[]> {
  return findCollections();
}

export async function getCollectionStats(): Promise<{
  totalCollections: number;
  favoriteCollections: number;
}> {
  const where = { user: { email: DEMO_USER_EMAIL } };
  const [totalCollections, favoriteCollections] = await Promise.all([
    prisma.collection.count({ where }),
    prisma.collection.count({ where: { ...where, isFavorite: true } }),
  ]);
  return { totalCollections, favoriteCollections };
}
