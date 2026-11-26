# Current Feature

<!-- feature name and short description -->

Seed data: extend the seed script (`prisma/seed.ts`) to populate the database with sample data for development and demos. Spec: `context/seed-spec.md`.

## Status

<!-- Not started | In Progress | Completed -->

Completed

## Goals

<!-- Goals and Requirements -->

- Demo user: email `demo@devstash.io`, name `Demo User`, password `12345678` (hashed with bcryptjs, 12 rounds), `isPro: false`, `emailVerified` set to the current date
- System item types (all `isSystem: true`, icons are Lucide component names): snippet (Code, #3b82f6), prompt (Sparkles, #8b5cf6), command (Terminal, #f97316), note (StickyNote, #fde047), file (File, #6b7280), image (Image, #ec4899), link (Link, #10b981)
- Collection **React Patterns** ("Reusable React patterns and hooks"): 3 TypeScript snippets covering custom hooks (useDebounce, useLocalStorage, etc.), component patterns (context providers, compound components) and utility functions
- Collection **AI Workflows** ("AI prompts and workflow automations"): 3 prompts covering code review, documentation generation and refactoring assistance
- Collection **DevOps** ("Infrastructure and deployment resources"): 1 snippet (Docker, CI/CD config), 1 command (deployment scripts) and 2 links to real documentation URLs
- Collection **Terminal Commands** ("Useful shell commands for everyday development"): 4 commands covering git operations, Docker commands, process management and package manager utilities
- Collection **Design Resources** ("UI/UX resources and references"): 4 links to real URLs covering CSS/Tailwind references, component libraries, design systems and icon libraries

## Notes

<!-- Any extra notes -->

- Spec: `context/seed-spec.md` (it sits in `context/`, not `context/features/`). Other references: `context/project-overview.md` (data models) and `prisma/schema.prisma`.
- `prisma/seed.ts` already exists and seeds only the 7 system item types, idempotently (find-then-create). This feature extends it. Keep the whole seed safe to re-run: no duplicate users, collections or items.
- `bcryptjs` is not installed yet and will need to be added (with its types if required).
- The spec lists type names in lowercase singular (`snippet`), while the existing seed uses `Snippet` with slug `snippets` (which the sidebar links to as `/items/snippets`). Keep the existing names and slugs unless told otherwise.
- The demo password is for development and demos only. Never seed it into the production database.
- Run the seed with `npm run db:seed` against the development database. Schema changes still go through `prisma migrate`, never `db push`.
- The dashboard still reads from `src/lib/mock-data.ts`; switching it to the database is a separate step.

## History

<!-- Keep this updated . Earliest to the latest  -->

- **Initial Next.js setup:** Scaffolded the Next.js 16 (App Router) project in `devstash/` with React 19, TypeScript, Tailwind CSS v4 and ESLint (flat config). Includes the default `src/app` layout, page and global styles.
- **Mock data:** Added `src/lib/mock-data.ts` as the single source of truth for the dashboard UI (user, item types, collections and items) until the database is implemented.
- **Dashboard UI Phase 1:** Initialised shadcn/ui (button and input components), added the `/dashboard` route with a layout, enabled dark mode by default, and built a display-only top bar with the DS logo and app name, a centered search bar, and New collection and New item buttons. Sidebar and Main are placeholder `h2` headings.
- **Dashboard UI Phase 2:** Built the dashboard sidebar from the mock data: a collapsible sidebar with item types linking to `/items/TYPE`, favorite collections, most recent collections, and a user avatar area at the bottom. Added a drawer icon to open/close the sidebar, and the sidebar is always a drawer on mobile view.
- **Dashboard UI Phase 3:** Built the dashboard main area from the mock data: four stats cards (items, collections, favorite items, favorite collections), recent collections, pinned items and the 10 most recent items. Added more sample items to the mock data so the lists have enough content.
- **Prisma + Neon PostgreSQL setup:** Set up Prisma 7 with a serverless Neon PostgreSQL database. Added the schema from the project data models, including the NextAuth models (Account, Session, VerificationToken), indexes and cascade deletes. Created the initial migration and applied it to the development database, and added an idempotent seed for the system item types. Schema changes always go through migrations, never `db push`. The dashboard still reads from the mock data.
- **Seed data:** Extended `prisma/seed.ts` to populate the database with sample data for development and demos: a demo user (`demo@devstash.io`, password hashed with bcryptjs at 12 rounds), the 7 system item types, and 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) holding 18 snippets, prompts, commands and links. The seed is idempotent and safe to re-run, and is for development and demos only, never production.
