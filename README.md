# DevStash

DevStash is a hub for developer knowledge: snippets, prompts, commands, notes, files, images and links, organized into collections. It is built with [Next.js](https://nextjs.org) (App Router), React, TypeScript, Tailwind CSS and Prisma on [Neon](https://neon.tech) PostgreSQL.

It is in early development. The dashboard at `/dashboard` reads collections, items and stats from the database for a seeded demo user, and has selectable color themes with light and dark modes. Authentication is not built yet, and the home page is a simple welcome heading.

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org) 5
- [Tailwind CSS](https://tailwindcss.com) 4 and [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io) 7 with [Neon](https://neon.tech) PostgreSQL
- [ESLint](https://eslint.org) 9 with `eslint-config-next`
- [Vitest](https://vitest.dev) 4 for unit tests

## Prerequisites

- [Node.js](https://nodejs.org) 20.19 or later (or 22.12+, or 24+)
- npm (bundled with Node.js)
- A [Neon](https://neon.tech) PostgreSQL database for development

## Getting Started

```bash
# clone the repository
git clone https://github.com/BrainsPack-Aman/DevStash.git
cd DevStash

# install dependencies (also generates the Prisma client)
npm install

# create your env file, then set DATABASE_URL in it
cp .env.example .env

# create the tables and load the sample data
npm run db:migrate
npm run db:seed

# start the development server
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) in your browser. The page hot-reloads as you edit files.

### Environment variables

| Variable       | Required | Description                                                              |
| -------------- | -------- | ------------------------------------------------------------------------ |
| `DATABASE_URL` | Yes      | Pooled Neon connection string (host contains `-pooler`)                  |
| `DIRECT_URL`   | No       | Non-pooled string for migrations; derived from `DATABASE_URL` when unset |

The seed creates a demo user with a known password. Use it for development and demos only, never in production.

## Scripts

| Command              | Description                                           |
| -------------------- | ----------------------------------------------------- |
| `npm run dev`        | Start the development server                          |
| `npm run build`      | Create an optimized production build                  |
| `npm run start`      | Serve the production build                            |
| `npm run lint`       | Run ESLint                                            |
| `npm test`           | Run the unit tests once                               |
| `npm run test:watch` | Re-run the unit tests on changes                      |
| `npm run db:migrate` | Create and apply a migration (never use `db push`)    |
| `npm run db:status`  | Show the migration status                             |
| `npm run db:seed`    | Load the system item types and demo data              |
| `npm run db:test`    | Check the connection, tables, migrations and rows     |
| `npm run db:deploy`  | Apply pending migrations (production)                 |
| `npm run db:studio`  | Open Prisma Studio                                    |

## Project Structure

```
context/          # Project docs and feature specs
prisma/           # Schema, migrations and seed
scripts/          # Database helper scripts
src/
├── app/          # Routes, layouts and global styles
├── components/   # Dashboard and shadcn/ui components
├── lib/          # Database queries, themes and helpers
└── types/        # Shared TypeScript types
```

## Notes

This project uses a recent Next.js version with breaking changes from older releases. Consult the bundled docs in `node_modules/next/dist/docs/` before writing Next.js code.
