# Current Feature

<!-- feature name and short description -->

Dashboard UI Phase 3: the last of 3 phases for the dashboard UI layout. Spec: `context/features/dashboard-phase-3-spec.md`.

## Status

<!-- Not started | In Progress | Completed -->

In Progress

## Goals

<!-- Goals and Requirements -->

- The main area to the right
- Recent collections
- Pinned items
- 10 recent items
- 4 stats cards at the top for number of items, collections, favorite items and favorite collections (not in the screenshot)

## Notes

<!-- Any extra notes -->

- Use the screenshot as a visual reference for how it should look.
- Use data from `src/lib/mock-data.ts`; import it directly until the database is implemented.
- References: `context/screenshots/dashboard-ui-main.png`, `context/project-overview.md`, `src/lib/mock-data.ts`, `context/features/dashboard-phase-1-spec.md`, `context/features/dashboard-phase-2-spec.md`.
- The spec points to `src/lib/mock-data.js`, but the actual file is `src/lib/mock-data.ts`.
- The screenshot path in the spec doesn't exist yet. The screenshots currently in `context/` are `Dashboard-UI.png` and `Dashboard-UI-drawer.png`.
- The mock data currently has only 5 items (1 pinned), so "10 recent items" will need more sample items to show a full list.

## History

<!-- Keep this updated . Earliest to the latest  -->

- **Initial Next.js setup:** Scaffolded the Next.js 16 (App Router) project in `devstash/` with React 19, TypeScript, Tailwind CSS v4 and ESLint (flat config). Includes the default `src/app` layout, page and global styles.
- **Mock data:** Added `src/lib/mock-data.ts` as the single source of truth for the dashboard UI (user, item types, collections and items) until the database is implemented.
- **Dashboard UI Phase 1:** Initialised shadcn/ui (button and input components), added the `/dashboard` route with a layout, enabled dark mode by default, and built a display-only top bar with the DS logo and app name, a centered search bar, and New collection and New item buttons. Sidebar and Main are placeholder `h2` headings.
- **Dashboard UI Phase 2:** Built the dashboard sidebar from the mock data: a collapsible sidebar with item types linking to `/items/TYPE`, favorite collections, most recent collections, and a user avatar area at the bottom. Added a drawer icon to open/close the sidebar, and the sidebar is always a drawer on mobile view.
