# DevStash

DevStash is a web app built with [Next.js](https://nextjs.org) (App Router), React, TypeScript and Tailwind CSS. It is in early development; the home page currently renders a simple welcome heading.

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org) 5
- [Tailwind CSS](https://tailwindcss.com) 4
- [ESLint](https://eslint.org) 9 with `eslint-config-next`

## Prerequisites

- [Node.js](https://nodejs.org) 20 or later
- npm (bundled with Node.js)

## Getting Started

```bash
# clone the repository
git clone https://github.com/BrainsPack-Aman/DevStash.git
cd DevStash

# install dependencies
npm install

# start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads as you edit files.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Project Structure

```
src/app/
├── layout.tsx    # Root layout
├── page.tsx      # Home page
└── globals.css   # Global styles (Tailwind import)
public/           # Static assets
```

## Notes

This project uses a recent Next.js version with breaking changes from older releases. Consult the bundled docs in `node_modules/next/dist/docs/` before writing Next.js code.
