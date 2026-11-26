# Current Feature

<!-- feature name and short description -->

Prisma + Neon PostgreSQL setup: set up Prisma ORM with a serverless Neon PostgreSQL database. Spec: `context/features/database-spec.md`.

## Status

<!-- Not started | In Progress | Completed -->

In Progress

## Goals

<!-- Goals and Requirements -->

- Use Neon PostgreSQL (serverless)
- Set up Prisma ORM (Prisma 7)
- Create the initial schema based on the data models in `context/project-overview.md` (this will evolve)
- Include the NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes

## Notes

<!-- Any extra notes -->

- Use Prisma 7, which has breaking changes. Read the full upgrade guide first: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Setup guide: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres (fetch the latest Prisma docs at https://prisma.io/docs).
- There is a development branch in Neon, used through `DATABASE_URL`, and a separate production branch. Always create migrations with `prisma migrate dev` and never push the schema directly (no `db push`) unless specified.
- Database standards are in `context/coding-standards.md`: use Prisma for all database operations, run `prisma migrate status` before committing, and run `prisma migrate deploy` before the app starts in production.
- References: `context/project-overview.md`, `context/coding-standards.md`, `context/features/database-spec.md`.
- The Neon connection string (`DATABASE_URL`) is needed before migrations can run. It belongs in `.env`, which is git-ignored.
- The dashboard still reads from `src/lib/mock-data.ts`; switching it to the database is a separate step.

## History

<!-- Keep this updated . Earliest to the latest  -->

- **Initial Next.js setup:** Scaffolded the Next.js 16 (App Router) project in `devstash/` with React 19, TypeScript, Tailwind CSS v4 and ESLint (flat config). Includes the default `src/app` layout, page and global styles.
- **Mock data:** Added `src/lib/mock-data.ts` as the single source of truth for the dashboard UI (user, item types, collections and items) until the database is implemented.
- **Dashboard UI Phase 1:** Initialised shadcn/ui (button and input components), added the `/dashboard` route with a layout, enabled dark mode by default, and built a display-only top bar with the DS logo and app name, a centered search bar, and New collection and New item buttons. Sidebar and Main are placeholder `h2` headings.
- **Dashboard UI Phase 2:** Built the dashboard sidebar from the mock data: a collapsible sidebar with item types linking to `/items/TYPE`, favorite collections, most recent collections, and a user avatar area at the bottom. Added a drawer icon to open/close the sidebar, and the sidebar is always a drawer on mobile view.
- **Dashboard UI Phase 3:** Built the dashboard main area from the mock data: four stats cards (items, collections, favorite items, favorite collections), recent collections, pinned items and the 10 most recent items. Added more sample items to the mock data so the lists have enough content.
