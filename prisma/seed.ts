import "dotenv/config";

import { hash } from "bcryptjs";

import { prisma } from "../src/lib/prisma";
import {
  BCRYPT_ROUNDS,
  DEMO_USER,
  SEED_COLLECTIONS,
  SYSTEM_ITEM_TYPES,
  type SeedCollection,
  type SeedItem,
} from "./seed-data";

interface Tally {
  created: number;
  updated: number;
}

type TypeIdBySlug = Map<string, string>;

function newTally(): Tally {
  return { created: 0, updated: 0 };
}

function describe(label: string, tally: Tally): string {
  return `${label}: ${tally.created} created, ${tally.updated} already existed (updated in place)`;
}

// Postgres treats NULLs as distinct in unique constraints, so the
// @@unique([userId, slug]) on ItemType cannot stop duplicate system types
// (userId = null) and an upsert on it would not work. Find first, then
// create or update, so running the seed repeatedly never duplicates rows.
async function seedSystemItemTypes(): Promise<{ tally: Tally; typeIdBySlug: TypeIdBySlug }> {
  const tally = newTally();
  const typeIdBySlug: TypeIdBySlug = new Map();

  for (const type of SYSTEM_ITEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { userId: null, slug: type.slug },
      select: { id: true },
    });

    if (existing) {
      await prisma.itemType.update({ where: { id: existing.id }, data: { ...type, isSystem: true } });
      typeIdBySlug.set(type.slug, existing.id);
      tally.updated += 1;
    } else {
      const created = await prisma.itemType.create({ data: { ...type, isSystem: true, userId: null } });
      typeIdBySlug.set(type.slug, created.id);
      tally.created += 1;
    }
  }

  return { tally, typeIdBySlug };
}

async function seedDemoUser(): Promise<{ id: string; created: boolean }> {
  const hashedPassword = await hash(DEMO_USER.password, BCRYPT_ROUNDS);
  const existing = await prisma.user.findUnique({ where: { email: DEMO_USER.email }, select: { id: true } });

  // The password is reset to the demo value on every run; emailVerified is set once.
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    create: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      hashedPassword,
      isPro: DEMO_USER.isPro,
      emailVerified: new Date(),
    },
    update: { name: DEMO_USER.name, hashedPassword, isPro: DEMO_USER.isPro },
    select: { id: true },
  });

  return { id: user.id, created: !existing };
}

function requireTypeId(typeIdBySlug: TypeIdBySlug, slug: string): string {
  const id = typeIdBySlug.get(slug);
  if (!id) throw new Error(`Unknown item type "${slug}" in seed data`);
  return id;
}

async function seedCollection(userId: string, collection: SeedCollection, typeIdBySlug: TypeIdBySlug) {
  const data = {
    description: collection.description,
    isFavorite: collection.isFavorite ?? false,
    defaultTypeId: requireTypeId(typeIdBySlug, collection.defaultType),
  };

  const existing = await prisma.collection.findFirst({
    where: { userId, name: collection.name },
    select: { id: true },
  });

  if (existing) {
    await prisma.collection.update({ where: { id: existing.id }, data });
    return { id: existing.id, created: false };
  }

  const created = await prisma.collection.create({ data: { ...data, name: collection.name, userId } });
  return { id: created.id, created: true };
}

async function seedItem(userId: string, collectionId: string, item: SeedItem, typeIdBySlug: TypeIdBySlug) {
  const data = {
    description: item.description,
    itemTypeId: requireTypeId(typeIdBySlug, item.type),
    contentType: item.url ? ("URL" as const) : ("TEXT" as const),
    content: item.content ?? null,
    language: item.language ?? null,
    url: item.url ?? null,
    isFavorite: item.isFavorite ?? false,
    isPinned: item.isPinned ?? false,
  };

  const existing = await prisma.item.findFirst({ where: { userId, title: item.title }, select: { id: true } });
  const saved = existing
    ? await prisma.item.update({ where: { id: existing.id }, data, select: { id: true } })
    : await prisma.item.create({ data: { ...data, title: item.title, userId }, select: { id: true } });

  await prisma.itemCollection.upsert({
    where: { itemId_collectionId: { itemId: saved.id, collectionId } },
    create: { itemId: saved.id, collectionId },
    update: {},
  });

  return { created: !existing };
}

async function seedCollectionsAndItems(userId: string, typeIdBySlug: TypeIdBySlug) {
  const collections = newTally();
  const items = newTally();

  for (const collection of SEED_COLLECTIONS) {
    const saved = await seedCollection(userId, collection, typeIdBySlug);
    collections[saved.created ? "created" : "updated"] += 1;

    for (const item of collection.items) {
      const result = await seedItem(userId, saved.id, item, typeIdBySlug);
      items[result.created ? "created" : "updated"] += 1;
    }
  }

  return { collections, items };
}

async function main() {
  const { tally: types, typeIdBySlug } = await seedSystemItemTypes();
  console.log(describe("System item types", types));

  const user = await seedDemoUser();
  console.log(`Demo user ${DEMO_USER.email}: ${user.created ? "created" : "already existed (password reset to the demo value)"}`);

  const { collections, items } = await seedCollectionsAndItems(user.id, typeIdBySlug);
  console.log(describe("Collections", collections));
  console.log(describe("Items", items));
}

main()
  .catch((error: unknown) => {
    console.error("Seeding failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
