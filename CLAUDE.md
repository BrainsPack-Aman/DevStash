# DevStash

The developer knowledge hub for  snippets, commands , prompts, notes, files, images, links and custom types.

## Context Files

Read the Following to get the full context of the project:
-@context/project-overview.md
-@context/coding-standards.md
-@context/ai-integration-plan.md
-@context/current-feature.md

## Project

DevStash is a Next.js (App Router) + React + TypeScript + Tailwind CSS v4 app. The Next.js app lives in the `devstash/` subdirectory (the parent folder is not the project root); run all commands from there.

## Commands

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint (flat config in eslint.config.mjs)
npm test        # Vitest unit tests, one run
npm run test:watch   # Vitest, re-running on changes

npm run db:migrate   # prisma migrate dev: create + apply a migration (never use db push)
npm run db:status    # prisma migrate status
npm run db:seed      # prisma db seed: system item types + demo user (demo@devstash.io) with sample collections and items (idempotent, safe to re-run; dev/demo only, never production)
npm run db:test      # read-only database check (connection, tables, migrations, row counts)
npm run db:deploy    # prisma migrate deploy (production)
npm run db:studio    # Prisma Studio
```

## Database

Prisma 7 + Neon PostgreSQL. Schema: `prisma/schema.prisma`; config (including the migration URL): `prisma.config.ts`; runtime client: `src/lib/prisma.ts` (uses the Neon driver adapter). The generated client lives in `src/generated/prisma/` (git-ignored; `npm install` regenerates it). Copy `.env.example` to `.env` and set `DATABASE_URL` (pooled) and optionally `DIRECT_URL` (non-pooled, used for migrations). `prisma.config.ts` uses `scripts/neon-relay.mjs`: for commands that connect (`migrate`, `db`, `studio`), if the system DNS can't resolve the Neon host (some routers filter `*.aws.neon.tech`), it resolves via public DNS and relays Prisma's connection through a loopback proxy that lives and dies with the command (plain `npx prisma ...` works too); on a healthy network it does nothing. A placeholder `DIRECT_URL` is ignored. Set `NEON_RELAY_DEBUG=1` to log relay activity (host names only). `migrate dev` takes about a minute on a remote database (it builds a shadow database); that is Prisma, not the relay. `src/lib/dns-fallback.ts` does the same for the app's runtime connection (override servers with `DNS_FALLBACK_SERVERS`). Install Prisma packages on the 7.x line only (`prisma@7`), since `latest` is currently a v8 release candidate.

Unit tests use Vitest (`vitest.config.mts`, Node environment) and sit next to the code as `src/**/*.test.ts`. They cover server actions and utilities, not components.

## Next.js version caveat

`next` is 16.x, which has breaking changes from older versions. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` (see [AGENTS.md](AGENTS.md)) and heed deprecation notices rather than relying on prior knowledge.

## Structure

- `src/app/` is the App Router root:
  - `layout.tsx` (root layout, runs the theme script before first paint) and `page.tsx` (home).
  - `globals.css` (Tailwind import, design tokens and the default theme) and `themes.css` (the named themes).
  - `dashboard/`: the `/dashboard` route. Its `layout.tsx` loads the sidebar data, and `page.tsx` renders the main area.
- `src/components/dashboard/` holds the dashboard UI (shell, top bar, sidebar, cards, theme selector and light/dark toggle).
- `src/components/ui/` holds the shadcn/ui components.
- `src/lib/` holds shared code:
  - `db/`: database queries (`collections.ts`, `items.ts`).
  - `prisma.ts` and `dns-fallback.ts`: the runtime database client (see Database).
  - `theme.ts`: the theme list and how the choice is saved and applied.
  - `item-type-icons.ts`, `item-type-colors.ts`, `sidebar-cookie.ts` and `format.ts`: small helpers.
  - `mock-data.ts`: the placeholder current user, until authentication exists.
- `src/types/` holds shared TypeScript types.
- `prisma/` holds the schema, migrations and seed script; `scripts/` holds the database helper scripts.
- `context/` holds the project docs and feature specs.
