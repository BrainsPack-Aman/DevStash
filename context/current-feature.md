# Current Feature

<!-- feature name and short description -->

Stats and sidebar: show the system item types and the real collections from the database in the sidebar, and make sure the main-area stats come from the database instead of `src/lib/mock-data.ts`. Spec: `context/stats-sidebar-spec.md`.

## Status

<!-- Not started | In Progress | Completed -->

Completed

## Goals

<!-- Goals and Requirements -->

- Main-area stats (items, collections, favorite items, favorite collections) come from the database, keeping the current design and layout
- Sidebar item types: show the system item types with their icons, each linking to `/items/[typename]` (the type slug, e.g. `/items/snippets`)
- Sidebar collections come from the database instead of the mock data
- Add a "View all collections" link under the collections list that goes to `/collections`
- Favorite collections keep the star icon. Recent collections show a colored circle based on the most-used item type in that collection
- Put the database functions in `src/lib/db/items.ts` (use `src/lib/db/collections.ts` as the reference)

## Notes

<!-- Any extra notes -->

- Spec: `context/stats-sidebar-spec.md`. References: `src/lib/db/collections.ts`, `src/lib/db/items.ts`, `prisma/schema.prisma`.
- The main-area stats already read from the database (`getItemStats` in `src/lib/db/items.ts` and `getCollectionStats` in `src/lib/db/collections.ts`), and `src/lib/db/items.ts` already exists. Check what is still missing against the spec (for example the sidebar functions) rather than rebuilding them.
- The sidebar (`src/components/dashboard/Sidebar.tsx`) still reads `collections`, `itemTypes` and `currentUser` from `src/lib/mock-data.ts`. The sidebar item type counts should also come from the database.
- The sidebar lives in the dashboard layout, which already wraps its cookie reads in Suspense (Cache Components is on). Fetch in a server component and pass the data down as props, since the sidebar is a client component.
- Use the seeded demo user (`demo@devstash.io`) until auth exists. The user block at the bottom of the sidebar can stay on the mock user unless it is cheap to read from the database.
- Reuse the collection's primary type logic from `getRecentCollections` for the colored circle, and the item type icon mapping in `src/lib/item-type-icons.ts`.
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
- **Dashboard collections:** Replaced the mock collection data in the dashboard main area with real data from Neon via Prisma. Added `src/lib/db/collections.ts` (recent collections and collection stats), fetched in server components inside Suspense. Collection cards show a left accent border in the color of the most-used item type, small icons for every type in the collection, and an updated item count. Added staggered entrance and hover animations to the collection, item and stats cards and the dashboard sections, all respecting reduced motion. Items, pinned items and the sidebar still read from the mock data.
- **Dashboard items:** Replaced the mock pinned and recent items in the dashboard main area with real data from Neon via Prisma. Added `src/lib/db/items.ts` (pinned items, 10 most recent items and item stats), fetched in async server components inside Suspense with skeleton fallbacks. Item cards take their icon, type tag and a left accent border from the item type, and the pinned section renders nothing when there are no pinned items. All four stats cards now come from the database, and the unused `src/lib/dashboard-data.ts` was removed. The sidebar still reads from the mock data.
- **Stats and sidebar:** The sidebar now reads from the database. Added `getSystemItemTypes` (`src/lib/db/items.ts`, the 7 system item types with the demo user's item counts, each linking to `/items/[slug]`) and `getAllCollections` (`src/lib/db/collections.ts`, sharing the loader with `getRecentCollections`). The dashboard layout fetches both and passes them through the shell to the sidebar. Favorite collections keep the star, and recent collections show a folder outlined in the color of their most-used item type. Added "View all collections" under the lists, and in the collapsed sidebar each popover ends with its own link ("View all favorites" or "View all collections"). The main-area stats were already database-backed. The sidebar user block and the welcome name still use the mock user.
