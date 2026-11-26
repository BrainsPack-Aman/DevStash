import "dotenv/config";
import { defineConfig } from "prisma/config";

import { resolveDatabaseUrl } from "./scripts/neon-relay.mjs";

// The migration URL is DIRECT_URL (Neon's non-pooled string) when it is set to a
// real value, otherwise DATABASE_URL with "-pooler" removed. On networks whose
// DNS refuses Neon hostnames, resolveDatabaseUrl() starts a loopback relay for
// commands that connect (migrate, db, studio) and returns the relay URL.
// The URL is optional so `prisma generate` still works on a fresh checkout.
const url = await resolveDatabaseUrl();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: { url },
});
