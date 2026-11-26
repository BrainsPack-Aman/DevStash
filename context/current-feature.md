# Current Feature

<!-- feature name and short description -->

Dashboard items: replace the dummy item data in the dashboard main area (right side) with real data from the Neon database via Prisma, for both pinned items and recent items. Spec: `context/dashboard-items-spec.md`.

## Status

<!-- Not started | In Progress | Completed -->

Completed

## Goals

<!-- Goals and Requirements -->

- Replace the mock item data shown in the dashboard main area (pinned items and recent items) with data from the Neon database using Prisma, instead of `src/lib/mock-data.ts`
- Create `src/lib/db/items.ts` with the data fetching functions
- Fetch items directly in the server component
- Item card icon and border are derived from the item type
- Keep showing the item type tag and everything else currently on the card (title, description, preview, tags, pinned and favorite markers, date). Reference screenshot: `context/screenshots/dashboard-ui-main.png`
- If there are no pinned items, show nothing in that section (no heading, no empty state)
- Update the stats display so the item counts (total items, favorite items) come from the database
- Keep the current design and layout

## Notes

<!-- Any extra notes -->

- Spec: `context/dashboard-items-spec.md`. Other references: `context/project-overview.md` (data models), `prisma/schema.prisma`, `src/lib/prisma.ts` (runtime client) and `src/lib/db/collections.ts` (the pattern to follow).
- The spec's last requirement says "Update collection stats display", which looks like a copy of the previous spec. Collection stats already come from the database, so this is read as updating the item stats (Items and Favorite items cards).
- Follow the collections work: fetch in async server components wrapped in Suspense (Cache Components is on), and use the seeded demo user (`demo@devstash.io`) until auth exists.
- The item card currently has no type-colored border. Add one matching the collection card's left accent (type color on the left edge) so the card, icon and border all follow the item type.
- Item tags (`ItemTag`) and the item's collections come from relations; select only what the card needs.
- The sidebar (item type counts, collections) still reads from the mock data and is a separate step.
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
