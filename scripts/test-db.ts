// Read-only database check: connects with the same Prisma client the app uses
// and reports connectivity, tables, migrations and row counts. Writes nothing.
//
// Run with: npm run db:test

import "dotenv/config";

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
