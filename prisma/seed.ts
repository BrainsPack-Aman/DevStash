import "dotenv/config";

import { prisma } from "../src/lib/prisma";

interface SystemItemType {
  name: string;
  slug: string;
  icon: string;
  color: string;
}

const SYSTEM_ITEM_TYPES: SystemItemType[] = [
  { name: "Snippet", slug: "snippets", icon: "Code", color: "#3b82f6" },
  { name: "Prompt", slug: "prompts", icon: "Sparkles", color: "#8b5cf6" },
  { name: "Note", slug: "notes", icon: "StickyNote", color: "#fde047" },
  { name: "Command", slug: "commands", icon: "Terminal", color: "#f97316" },
  { name: "Link", slug: "links", icon: "Link", color: "#10b981" },
  { name: "File", slug: "files", icon: "File", color: "#6b7280" },
  { name: "Image", slug: "images", icon: "Image", color: "#ec4899" },
];

// Postgres treats NULLs as distinct in unique constraints, so the
// @@unique([userId, slug]) on ItemType cannot stop duplicate system types
// (userId = null) and an upsert on it would not work. Find first, then
// create or update, so running the seed repeatedly never duplicates rows.
async function seedSystemItemTypes(): Promise<{ created: number; updated: number }> {
  let created = 0;
  let updated = 0;

  for (const type of SYSTEM_ITEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { userId: null, slug: type.slug },
      select: { id: true },
    });

    if (existing) {
      await prisma.itemType.update({ where: { id: existing.id }, data: { ...type, isSystem: true } });
      updated += 1;
    } else {
      await prisma.itemType.create({ data: { ...type, isSystem: true, userId: null } });
      created += 1;
    }
  }

  return { created, updated };
}

async function main() {
  const { created, updated } = await seedSystemItemTypes();
  console.log(`System item types: ${created} created, ${updated} already existed (updated in place).`);
}

main()
  .catch((error: unknown) => {
    console.error("Seeding failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
