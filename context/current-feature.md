# Current Feature

<!-- feature name and short description -->

Dashboard UI Phase 1: the first of 3 phases for the dashboard UI layout. Spec: `context/features/dashboard-phase-1-spec.md`.

## Status

<!-- Not started | In Progress | Completed -->

Completed

## Goals

<!-- Goals and Requirements -->

- ShadCN UI initialization and components
- ShadCN component installation
- Dashboard route at `/dashboard`
- Main dashboard layout and any global styles
- Dark mode by default
- Top bar with search and new item button (display only)
- Placeholder for sidebar and main area: just an `h2` with "Sidebar" and "Main" for now

## Notes

<!-- Any extra notes -->

- Use the screenshot as a visual reference for how it should look.
- References: `context/screenshots/dashboard-ui-main.png`, `context/project-overview.md`, `src/lib/mock-data.ts`, `context/features/dashboard-phase-2-spec.md`, `context/features/dashboard-phase-3-spec.md`.
- The screenshot path in the spec doesn't exist yet. The screenshots currently in `context/` are `Dashboard-UI.png` and `Dashboard-UI-drawer.png`.

## History

<!-- Keep this updated . Earliest to the latest  -->

- **Initial Next.js setup:** Scaffolded the Next.js 16 (App Router) project in `devstash/` with React 19, TypeScript, Tailwind CSS v4 and ESLint (flat config). Includes the default `src/app` layout, page and global styles.
- **Mock data:** Added `src/lib/mock-data.ts` as the single source of truth for the dashboard UI (user, item types, collections and items) until the database is implemented.
- **Dashboard UI Phase 1:** Initialised shadcn/ui (button and input components), added the `/dashboard` route with a layout, enabled dark mode by default, and built a display-only top bar with the DS logo and app name, a centered search bar, and New collection and New item buttons. Sidebar and Main are placeholder `h2` headings.