import { prisma } from "@/lib/prisma";
import type { DashboardItem } from "@/types/dashboard";

export const RECENT_ITEMS_LIMIT = 10;

// No auth yet: the dashboard shows the seeded demo user's data.
const DEMO_USER_EMAIL = "demo@devstash.io";
const userWhere = { user: { email: DEMO_USER_EMAIL } };

const itemSelect = {
  id: true,
  title: true,
  description: true,
  contentType: true,
  content: true,
  language: true,
  url: true,
  isFavorite: true,
  isPinned: true,
  createdAt: true,
  itemType: { select: { name: true, icon: true, color: true } },
  tags: { select: { tag: { select: { name: true } } } },
} as const;

type ItemRow = Awaited<ReturnType<typeof findItems>>[number];

function findItems(where: object, take?: number) {
  return prisma.item.findMany({
    where: { ...userWhere, ...where },
    orderBy: { createdAt: "desc" },
    take,
    select: itemSelect,
  });
}

function toDashboardItem(row: ItemRow): DashboardItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    contentType: row.contentType,
    content: row.content,
    language: row.language,
    url: row.url,
    isFavorite: row.isFavorite,
    isPinned: row.isPinned,
    createdAt: row.createdAt.toISOString(),
    type: row.itemType,
    tags: row.tags.map(({ tag }) => tag.name).sort(),
  };
}

export async function getPinnedItems(): Promise<DashboardItem[]> {
  return (await findItems({ isPinned: true })).map(toDashboardItem);
}

export async function getRecentItems(limit = RECENT_ITEMS_LIMIT): Promise<DashboardItem[]> {
  return (await findItems({}, limit)).map(toDashboardItem);
}

export async function getItemStats(): Promise<{ totalItems: number; favoriteItems: number }> {
  const [totalItems, favoriteItems] = await Promise.all([
    prisma.item.count({ where: userWhere }),
    prisma.item.count({ where: { ...userWhere, isFavorite: true } }),
  ]);
  return { totalItems, favoriteItems };
}
