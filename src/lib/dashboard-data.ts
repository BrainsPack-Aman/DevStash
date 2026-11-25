import { collections, items, itemTypes } from "@/lib/mock-data";
import type { Collection, DashboardStats, Item, ItemType } from "@/types/dashboard";

export const RECENT_COLLECTIONS_LIMIT = 4;
export const RECENT_ITEMS_LIMIT = 10;

export function getItemType(itemTypeId: string): ItemType | undefined {
  return itemTypes.find((type) => type.id === itemTypeId);
}

export function getStats(): DashboardStats {
  return {
    totalItems: itemTypes.reduce((sum, type) => sum + type.count, 0),
    totalCollections: collections.length,
    favoriteItems: items.filter((item) => item.isFavorite).length,
    favoriteCollections: collections.filter((collection) => collection.isFavorite).length,
  };
}

export function getRecentCollections(limit = RECENT_COLLECTIONS_LIMIT): Collection[] {
  return [...collections]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}

export function getPinnedItems(): Item[] {
  return items
    .filter((item) => item.isPinned)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getRecentItems(limit = RECENT_ITEMS_LIMIT): Item[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}
