# Current Feature: Theme Typography and Discord Theme

Switching themes changes the whole look (fonts and shape, not only colors) so each theme has the feel of its app, and Discord joins the theme list.

## Status

<!-- Not started | In Progress | Completed -->

In Progress

## Goals

<!-- Goals and Requirements -->

- Each theme sets its own typography (body, heading and monospace fonts) along with its colors, applied instantly on switch
- Each theme also sets the style traits that give its app's vibe: corner radius, heading weight and letter spacing
- Add a Discord theme to the theme menu, with light and dark modes, blurple accent, layered gray surfaces, a Discord-like font and rounded corners; it opens in dark mode
- Proposed font per theme (free look-alikes where the app's font is proprietary):

  | Theme    | Headings       | Body           | Mono           |
  | -------- | -------------- | -------------- | -------------- |
  | Default  | Geist          | Geist          | Geist Mono     |
  | Vercel   | Geist          | Geist          | Geist Mono     |
  | Claude   | Source Serif 4 | Figtree        | JetBrains Mono |
  | Discord  | Figtree        | Noto Sans      | Source Code Pro |
  | GitHub   | system stack   | system stack   | system mono    |
  | Dracula  | Fira Sans      | Fira Sans      | Fira Code      |
  | Nord     | Inter          | Inter          | JetBrains Mono |
  | Monokai  | JetBrains Mono | IBM Plex Sans  | JetBrains Mono |
  | Midnight | Space Grotesk  | Inter          | JetBrains Mono |

- The stored theme's font and shape apply before first paint, like the colors do now
- Fonts of themes that are not selected are not downloaded up front
- Light and dark modes, the per-theme remembered mode and the current layout keep working, including mobile and screens under 360px

## Notes

<!-- Any extra notes -->

- Register themes in `src/lib/theme.ts`; token blocks live in `src/app/themes.css` (Default stays in `globals.css`)
- Load fonts with `next/font` in the root layout (`preload: false` for non-default fonts); read the Next.js 16 font guide in `node_modules/next/dist/docs/` first
- `layout.tsx` names the Geist variable `--font-sans`, and `globals.css` maps `--font-sans` to itself. Give each font its own variable and let themes point `--font-sans`, `--font-heading` and `--font-mono` at it
- `--font-mono` is not mapped in `@theme inline`, so check that Geist Mono is really used today
- Radius utilities already derive from `--radius`, so a theme only needs to override that token
- The app fonts of Discord (gg sans) and Claude (Styrene, Tiempos) are proprietary and must not be bundled
- Wider fonts must not break the top bar, sidebar or card truncation
- Discord text and accent colors should meet readable contrast in both modes, including item type colors (`--item-l-min` / `--item-l-max`)

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
