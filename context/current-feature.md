# Current Feature

<!-- feature name and short description -->

Dashboard collections: replace the dummy collection data in the dashboard main area (right side) with real data from the Neon database via Prisma. Spec: `context/dashboard-collections-spec.md`.

## Status

<!-- Not started | In Progress | Completed -->

In Progress

## Goals

<!-- Goals and Requirements -->

- Replace the mock collection data shown in the dashboard main area (the 6 recent collection cards) with data from the Neon database using Prisma, instead of `src/lib/mock-data.ts`
- Create `src/lib/db/collections.ts` with the data fetching functions
- Fetch collections directly in the server component
- Collection card border color is derived from the most-used content type in that collection
- Show small icons of all the types present in that collection
- Keep the current design (reference screenshot: `context/screenshots/dashboard-ui-main.png`)
- Update the collection stats display
- Do not add the items underneath the collections yet (a later step)

## Notes

<!-- Any extra notes -->

- Spec: `context/dashboard-collections-spec.md`. Other references: `context/project-overview.md` (data models), `prisma/schema.prisma` and `src/lib/prisma.ts` (runtime client).
- Only the collections part of the dashboard moves to the database. Stats for items, pinned items and recent items stay on the mock data until their own steps.
- A collection has no type of its own: derive the border color and the type icons from the types of the items inside it (most-used type wins for the color).
- The seed (`npm run db:seed`) provides the demo user (`demo@devstash.io`) and 5 sample collections to test against.
- Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` (Next.js 16 has breaking changes).

## History

<!-- Keep this updated . Earliest to the latest  -->

- **Initial Next.js setup:** Scaffolded the Next.js 16 (App Router) project in `devstash/` with React 19, TypeScript, Tailwind CSS v4 and ESLint (flat config). Includes the default `src/app` layout, page and global styles.
- **Mock data:** Added `src/lib/mock-data.ts` as the single source of truth for the dashboard UI (user, item types, collections and items) until the database is implemented.
- **Dashboard UI Phase 1:** Initialised shadcn/ui (button and input components), added the `/dashboard` route with a layout, enabled dark mode by default, and built a display-only top bar with the DS logo and app name, a centered search bar, and New collection and New item buttons. Sidebar and Main are placeholder `h2` headings.
- **Dashboard UI Phase 2:** Built the dashboard sidebar from the mock data: a collapsible sidebar with item types linking to `/items/TYPE`, favorite collections, most recent collections, and a user avatar area at the bottom. Added a drawer icon to open/close the sidebar, and the sidebar is always a drawer on mobile view.
- **Dashboard UI Phase 3:** Built the dashboard main area from the mock data: four stats cards (items, collections, favorite items, favorite collections), recent collections, pinned items and the 10 most recent items. Added more sample items to the mock data so the lists have enough content.
- **Prisma + Neon PostgreSQL setup:** Set up Prisma 7 with a serverless Neon PostgreSQL database. Added the schema from the project data models, including the NextAuth models (Account, Session, VerificationToken), indexes and cascade deletes. Created the initial migration and applied it to the development database, and added an idempotent seed for the system item types. Schema changes always go through migrations, never `db push`. The dashboard still reads from the mock data.
- **Seed data:** Extended `prisma/seed.ts` to populate the database with sample data for development and demos: a demo user (`demo@devstash.io`, password hashed with bcryptjs at 12 rounds), the 7 system item types, and 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) holding 18 snippets, prompts, commands and links. The seed is idempotent and safe to re-run, and is for development and demos only, never production.
