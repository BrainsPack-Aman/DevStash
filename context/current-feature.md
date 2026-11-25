# Current Feature

<!-- feature name and short description -->

Dashboard UI Phase 2: the second of 3 phases for the dashboard UI layout. Spec: `context/features/dashboard-phase-2-spec.md`.

## Status

<!-- Not started | In Progress | Completed -->

Completed

## Goals

<!-- Goals and Requirements -->

- Collapsible sidebar
- Items/types with links to `/items/TYPE` (e.g. `/items/snippets`)
- Favorite collections
- Most recent collections
- User avatar area at the bottom
- Drawer icon to open/close sidebar
- Always a drawer on mobile view

## Notes

<!-- Any extra notes -->

- Use the screenshot as a visual reference for how it should look.
- Use data from `src/lib/mock-data.ts`; import it directly until the database is implemented.
- References: `context/screenshots/dashboard-ui-main.png`, `context/project-overview.md`, `src/lib/mock-data.ts`, `context/features/dashboard-phase-1-spec.md`, `context/features/dashboard-phase-3-spec.md`.
- The screenshot path in the spec doesn't exist yet. The screenshots currently in `context/` are `Dashboard-UI.png` and `Dashboard-UI-drawer.png`.

## History

<!-- Keep this updated . Earliest to the latest  -->

- **Initial Next.js setup:** Scaffolded the Next.js 16 (App Router) project in `devstash/` with React 19, TypeScript, Tailwind CSS v4 and ESLint (flat config). Includes the default `src/app` layout, page and global styles.
- **Mock data:** Added `src/lib/mock-data.ts` as the single source of truth for the dashboard UI (user, item types, collections and items) until the database is implemented.
- **Dashboard UI Phase 1:** Initialised shadcn/ui (button and input components), added the `/dashboard` route with a layout, enabled dark mode by default, and built a display-only top bar with the DS logo and app name, a centered search bar, and New collection and New item buttons. Sidebar and Main are placeholder `h2` headings.
- **Dashboard UI Phase 2:** Built the dashboard sidebar from the mock data: a collapsible sidebar with item types linking to `/items/TYPE`, favorite collections, most recent collections, and a user avatar area at the bottom. Added a drawer icon to open/close the sidebar, and the sidebar is always a drawer on mobile view.
