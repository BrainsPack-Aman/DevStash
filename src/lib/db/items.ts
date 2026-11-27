import { prisma } from "@/lib/prisma";
import type { DashboardItem, ItemType } from "@/types/dashboard";

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

// Sidebar order; any other system type is listed after these.
const SYSTEM_TYPE_ORDER = ["snippets", "prompts", "commands", "notes", "files", "images", "links"];

export async function getSystemItemTypes(): Promise<ItemType[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: { _count: { select: { items: { where: userWhere } } } },
  });

  const rank = (slug: string) => {
    const index = SYSTEM_TYPE_ORDER.indexOf(slug);
    return index === -1 ? SYSTEM_TYPE_ORDER.length : index;
  };

  return types
    .map((type) => ({
      id: type.id,
      name: type.name,
      slug: type.slug,
      icon: type.icon,
      color: type.color,
      isSystem: type.isSystem,
      count: type._count.items,
    }))
    .sort((a, b) => rank(a.slug) - rank(b.slug));
}
