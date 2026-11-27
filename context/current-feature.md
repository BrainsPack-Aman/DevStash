# Current Feature: Theme Selector

<!-- feature name and short description -->

Add a customizable theme selector to the top bar, inspired by the theme selection UI in Claude, backed by a theme system built on centralized CSS tokens.

## Status

<!-- Not started | In Progress | Completed -->

In Progress

## Goals

<!-- Goals and Requirements -->

**Selector UI**

- A palette icon button in the top bar opens a dropdown with a small "THEME" heading and the themes stacked vertically
- The active theme is highlighted and has a checkmark; other themes have a subtle hover effect
- Smooth, subtle open and close animations
- Closes on outside click or on selecting a theme
- Matches the existing radius, spacing and typography, and works on small screens

**Themes**

- Default: the current DevStash look, unchanged
- Vercel: clean monochrome black and white
- Claude: warm cream background with subtle orange accents
- Dracula: dark purple with vibrant purple and pink accents
- Nord: cool blue-gray
- Monokai: dark, editor-inspired colors
- GitHub: clean light theme
- Midnight: deep navy

**Theme system**

- Themes are defined as centralized CSS variables (design tokens), so adding one needs no component changes
- Every theme applies across the whole app: backgrounds, sidebar, top bar, cards, dropdowns and popovers, borders, text, buttons, inputs, dialogs and drawers, hover and selected states, and scrollbars
- Every theme has readable contrast
- Replace hardcoded colors in components with semantic tokens
- Existing features, including light and dark mode, keep working
- Every theme has its own light and dark mode; the sun/moon button switches within the selected theme

**Persistence**

- The selected theme survives refreshing and reopening the app
- No flash of the wrong theme on first load

**Verification**

- Switching themes updates the whole UI, the selection is marked and persists after refresh, light and dark still work, no hardcoded colors are left behind, and the dropdown works on desktop and mobile
- Finish with a short summary of the files changed and the approach

## Notes

<!-- Any extra notes -->

- Do not redesign the app or refactor unrelated components. Reuse the existing architecture.
- Tokens: `src/app/globals.css` defines them in `:root` and `.dark`, exposed to Tailwind v4 through `@theme inline`. There is no Tailwind config file. The `dark:` variant depends on the `.dark` class.
- Current mode switching: `src/components/dashboard/ThemeToggle.tsx` toggles `.dark` and saves `light` or `dark` under the `theme` key in localStorage. An inline script in `src/app/layout.tsx` applies it before paint; dark is the default.
- Top bar: `src/components/dashboard/TopBar.tsx`. It is already crowded on mobile, so check that another button fits.
- Approach: a light and a dark token block per theme (`[data-theme="..."]` and `[data-theme="..."].dark`; Default uses the existing `:root` and `.dark` blocks), plus one typed list of themes for the dropdown.
- Light/dark with themes (changed during implementation, replacing the earlier fixed-mode proposal): every theme has both modes. A theme opens in its signature mode (Claude and GitHub light, the others dark) and remembers the last mode used.
- Persistence: there is no authentication yet (only the NextAuth tables and a demo user) and no theme field on the user, so store the choice in localStorage. No migration. Keep an existing `light` preference working.
- Flash prevention: extend the inline script. Read `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md` first.
- Dropdown: `src/components/ui/popover.tsx` exists. The shadcn dropdown menu (radio items) is not installed and would give menu keyboard behavior and a selected state.
- Hardcoded colors found: stat icon colors in `StatsCards.tsx`, the yellow favorite star in `CollectionCard.tsx`, `ItemCard.tsx` and `Sidebar.tsx`, and the `bg-black/10` overlay in `ui/sheet.tsx`.
- Item type colors come from the database and stay as data. Check their contrast on light backgrounds (the Note yellow especially).
- There is no modal dialog component yet; only the Sheet drawer. The tokens should cover future dialogs.
- The main area's scrollbar renders light in dark mode, so theme scrollbars (`color-scheme` and `scrollbar-color`). The sidebar scrollbar stays hidden.
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
- **Sidebar Pro badge:** The Files and Images types in the sidebar now show a subtle "PRO" badge (shadcn/ui `Badge`, added in `src/components/ui/badge.tsx`), in the desktop sidebar and the mobile drawer; the collapsed sidebar shows icons only. It is display only, with no gating. The sidebar's scrollbar is now hidden (`no-scrollbar`) and the list still scrolls.
