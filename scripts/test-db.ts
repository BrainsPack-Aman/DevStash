// Read-only database check: connects with the same Prisma client the app uses,
// verifies connectivity, tables, migrations and the seeded demo data, and prints
// what is in the database. Writes nothing.
//
// Run with: npm run db:test

import "dotenv/config";

import { compare } from "bcryptjs";

import { DEMO_USER, SEED_COLLECTIONS } from "../prisma/seed-data";
import { prisma } from "../src/lib/prisma";

const EXPECTED_TABLES = [
  "Account",
  "Collection",
  "Item",
  "ItemCollection",
  "ItemTag",
  "ItemType",
  "Session",
  "Tag",
  "User",
  "VerificationToken",
];

const EXPECTED_SYSTEM_TYPE_SLUGS = ["commands", "files", "images", "links", "notes", "prompts", "snippets"];

let failures = 0;

function check(label: string, passed: boolean, detail = ""): void {
  console.log(`${passed ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
  if (!passed) failures += 1;
}

async function checkConnection(): Promise<void> {
  console.log("## Connection");
  const startedAt = Date.now();
  const [info] = await prisma.$queryRaw<{ database: string; version: string; now: Date }[]>`
    select current_database()::text as database, version()::text as version, now() as now
  `;
  const host = new URL(process.env.DATABASE_URL ?? "").hostname;
  check("connected to Neon", true, `${Date.now() - startedAt} ms`);
  console.log(`      host: ${host}`);
  console.log(`      database: ${info.database} | ${info.version.split(" on ")[0]}`);
  console.log(`      server time: ${info.now.toISOString()}`);
}

async function checkTables(): Promise<void> {
  console.log("\n## Tables");
  const rows = await prisma.$queryRaw<{ table_name: string }[]>`
    select table_name::text as table_name from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE' and table_name <> '_prisma_migrations'
    order by table_name
  `;
  const found = rows.map((row) => row.table_name);
  const missing = EXPECTED_TABLES.filter((name) => !found.includes(name));
  const unexpected = found.filter((name) => !EXPECTED_TABLES.includes(name));
  check(`all ${EXPECTED_TABLES.length} expected tables exist`, missing.length === 0, missing.length ? `missing: ${missing.join(", ")}` : found.join(", "));
  check("no unexpected tables", unexpected.length === 0, unexpected.join(", "));
}

async function checkMigrations(): Promise<void> {
  console.log("\n## Migrations");
  const rows = await prisma.$queryRaw<{ migration_name: string; finished: boolean }[]>`
    select migration_name, finished_at is not null as finished from _prisma_migrations order by started_at
  `;
  check("migration history present", rows.length > 0, rows.map((row) => row.migration_name).join(", "));
  check("every migration finished", rows.every((row) => row.finished));
}

async function checkRowCounts(): Promise<void> {
  console.log("\n## Row counts");
  const counts = {
    User: await prisma.user.count(),
    Account: await prisma.account.count(),
    Session: await prisma.session.count(),
    VerificationToken: await prisma.verificationToken.count(),
    Item: await prisma.item.count(),
    ItemType: await prisma.itemType.count(),
    Collection: await prisma.collection.count(),
    ItemCollection: await prisma.itemCollection.count(),
    Tag: await prisma.tag.count(),
    ItemTag: await prisma.itemTag.count(),
  };
  check("typed Prisma client can query every model", true);
  for (const [name, count] of Object.entries(counts)) console.log(`      ${name.padEnd(18)} ${count}`);
}

async function checkSystemItemTypes(): Promise<void> {
  console.log("\n## System item types (from `npm run db:seed`)");
  const types = await prisma.itemType.findMany({ where: { userId: null }, select: { slug: true }, orderBy: { slug: "asc" } });
  const slugs = types.map((type) => type.slug);
  const missing = EXPECTED_SYSTEM_TYPE_SLUGS.filter((slug) => !slugs.includes(slug));
  check(`${EXPECTED_SYSTEM_TYPE_SLUGS.length} system types seeded`, missing.length === 0, missing.length ? `missing: ${missing.join(", ")} (run npm run db:seed)` : slugs.join(", "));
  check("no duplicate system types", new Set(slugs).size === slugs.length);
}

// One query fetches the whole demo account: user, collections and their items.
function loadDemoUser() {
  return prisma.user.findUnique({
    where: { email: DEMO_USER.email },
    include: {
      collections: {
        orderBy: { createdAt: "asc" },
        include: {
          defaultType: { select: { name: true } },
          items: {
            orderBy: { addedAt: "asc" },
            include: { item: { include: { itemType: { select: { name: true, slug: true } } } } },
          },
        },
      },
    },
  });
}

type DemoUser = NonNullable<Awaited<ReturnType<typeof loadDemoUser>>>;

async function checkDemoUser(user: DemoUser): Promise<void> {
  check("name and plan are correct", user.name === DEMO_USER.name && user.isPro === DEMO_USER.isPro, `${user.name}, isPro=${user.isPro}`);
  check("email is verified", user.emailVerified !== null);
  const hash = user.hashedPassword;
  const isTwelveRounds = hash !== null && hash.startsWith("$2") && hash.split("$")[2] === "12";
  check("password is a bcrypt hash (12 rounds) that matches the demo password", isTwelveRounds && (await compare(DEMO_USER.password, hash)));
}

function checkDemoCollections(user: DemoUser): void {
  for (const expected of SEED_COLLECTIONS) {
    const found = user.collections.find((collection) => collection.name === expected.name);
    const actualTitles = new Set(found?.items.map((link) => link.item.title));
    const missing = expected.items.filter((item) => !actualTitles.has(item.title)).map((item) => item.title);
    check(`collection "${expected.name}" has all ${expected.items.length} items`, found !== undefined && missing.length === 0 && actualTitles.size === expected.items.length, found ? (missing.length ? `missing: ${missing.join(", ")}` : `${actualTitles.size} found`) : "collection missing");

    const wrongType = expected.items.filter((item) => found?.items.find((link) => link.item.title === item.title)?.item.itemType.slug !== item.type);
    check(`  every item in "${expected.name}" has the right type`, found !== undefined && wrongType.length === 0, wrongType.map((item) => item.title).join(", "));
  }
}

function checkDemoItems(user: DemoUser): void {
  const items = user.collections.flatMap((collection) => collection.items.map((link) => link.item));
  const expectedTotal = SEED_COLLECTIONS.reduce((sum, collection) => sum + collection.items.length, 0);
  check(`${expectedTotal} items in total, none duplicated`, items.length === expectedTotal && new Set(items.map((item) => item.id)).size === expectedTotal, `found ${items.length}`);

  const links = items.filter((item) => item.contentType === "URL");
  check("every link has a real https URL", links.length > 0 && links.every((item) => item.url?.startsWith("https://")), `${links.length} links`);
  const text = items.filter((item) => item.contentType === "TEXT");
  check("every text item (snippet, prompt, command) has content", text.every((item) => (item.content ?? "").trim().length > 0), `${text.length} text items`);
}

function truncate(text: string, max = 78): string {
  const firstLine = text.split("\n")[0];
  return firstLine.length > max ? `${firstLine.slice(0, max - 1)}…` : firstLine;
}

function printDemoData(user: DemoUser): void {
  console.log("\n## Demo data in the database");
  const verified = user.emailVerified ? user.emailVerified.toISOString().slice(0, 10) : "not verified";
  console.log(`User: ${user.name} <${user.email}> | plan: ${user.isPro ? "Pro" : "Free"} | email verified: ${verified}`);
  console.log(`Collections (${user.collections.length}):`);

  for (const collection of user.collections) {
    const star = collection.isFavorite ? "★" : "·";
    const defaultType = collection.defaultType?.name ?? "none";
    console.log(`\n  ${star} ${collection.name} (${collection.items.length} items, default type: ${defaultType})`);
    console.log(`    ${collection.description ?? ""}`);

    for (const { item } of collection.items) {
      const flags = [item.language, item.isPinned ? "pinned" : null, item.isFavorite ? "favorite" : null].filter(Boolean).join(", ");
      console.log(`    - [${item.itemType.name}] ${item.title}${flags ? `  (${flags})` : ""}`);
      const preview = item.contentType === "URL" ? item.url : item.content;
      if (preview) console.log(`        ${truncate(preview)}`);
    }
  }
}

async function checkAndShowDemoData(): Promise<void> {
  console.log("\n## Demo data (from `npm run db:seed`)");
  const user = await loadDemoUser();
  check(`demo user ${DEMO_USER.email} exists`, user !== null, user ? "" : "run npm run db:seed");
  if (!user) return;

  await checkDemoUser(user);
  checkDemoCollections(user);
  checkDemoItems(user);
  printDemoData(user);
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
    process.exitCode = 1;
    return;
  }

  await checkConnection();
  await checkTables();
  await checkMigrations();
  await checkRowCounts();
  await checkSystemItemTypes();
  await checkAndShowDemoData();

  console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main()
  .catch((error: unknown) => {
    console.error("\nDatabase test failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
