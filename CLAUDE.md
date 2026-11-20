# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DevStash is a Next.js (App Router) + React + TypeScript + Tailwind CSS v4 app. The Next.js app lives in the `devstash/` subdirectory (the parent folder is not the project root); run all commands from there.

## Commands

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint (flat config in eslint.config.mjs)
```

No test runner is configured yet.

## Next.js version caveat

`next` is 16.x, which has breaking changes from older versions. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` (see [AGENTS.md](AGENTS.md)) and heed deprecation notices rather than relying on prior knowledge.

## Structure

- `src/app/` is the App Router root: `layout.tsx` (root layout), `page.tsx` (home), `globals.css` (Tailwind import).
