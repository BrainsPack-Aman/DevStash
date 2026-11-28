# Current Feature

<!-- feature name and short description -->

## Status

<!-- Not started | In Progress | Completed -->

Not Started

## Goals

<!-- Goals and Requirements -->

## Notes

<!-- Any extra notes -->

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
- **Theme selector:** A palette button in the top bar opens a "Theme" menu with Default, Vercel, Claude, Dracula, Nord, Monokai, GitHub and Midnight. Every theme has its own light and dark mode, switched by the sun/moon button; a theme opens in its signature mode (Claude and GitHub light, the others dark) and remembers the last one used. Themes are CSS token blocks (`src/app/themes.css`; Default stays in `globals.css`) registered in `src/lib/theme.ts`. The choice is stored in localStorage (`color-theme`, plus a mode per theme) and applied by the inline script before paint. Hardcoded stat, favorite and overlay colors became tokens, item type colors have their lightness limited per theme (`text-item` utility), scrollbars are themed, and screens under 360px show only the "DS" logo. Open follow-ups: the sun/moon icon can flicker on load in light mode, the keyboard highlight in the theme menu is faint, and Default keeps some low-contrast colors.
- **Theme typography and Discord theme:** Switching themes now changes fonts and shape as well as colors. Each theme sets its heading, body and code fonts, corner radius and heading weight and letter spacing as CSS tokens (`--app-font-*`, `--heading-*`, `--radius`), and headings use the new `heading` utility or `font-heading`. Fonts are loaded with `next/font` in `src/app/fonts.ts` (free look-alikes for proprietary app fonts; GitHub uses the system fonts), and only Geist is preloaded. Added the Discord theme (light and dark, opens dark) with a blurple accent and its own top bar and sidebar surfaces (`--header-surface`, `--sidebar-surface`). Code previews now really use Geist Mono on the default theme, and the dashboard card grids no longer scroll sideways on phones. Open follow-ups: Geist is still preloaded on other themes, and in Discord light mode the mobile drawer is white while the desktop sidebar is light gray.
