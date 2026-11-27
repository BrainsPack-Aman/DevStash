// Sample data for development and demos (see context/features/seed-spec.md).
// Code samples are arrays of lines joined with "\n" so they stay readable here.

export interface SystemItemType {
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export interface SeedItem {
  title: string;
  description: string;
  /** Slug of a system item type, e.g. "snippets". */
  type: string;
  content?: string;
  language?: string;
  url?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
}

export interface SeedCollection {
  name: string;
  description: string;
  /** Slug of the item type used to style the collection. */
  defaultType: string;
  isFavorite?: boolean;
  items: SeedItem[];
}

export const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  // Development and demo use only. Never seed this into production.
  password: "12345678",
  isPro: false,
} as const;

export const BCRYPT_ROUNDS = 12;

export const SYSTEM_ITEM_TYPES: SystemItemType[] = [
  { name: "Snippet", slug: "snippets", icon: "Code", color: "#3b82f6" },
  { name: "Prompt", slug: "prompts", icon: "Sparkles", color: "#8b5cf6" },
  { name: "Note", slug: "notes", icon: "StickyNote", color: "#fde047" },
  { name: "Command", slug: "commands", icon: "Terminal", color: "#f97316" },
  { name: "Link", slug: "links", icon: "Link", color: "#10b981" },
  { name: "File", slug: "files", icon: "File", color: "#6b7280" },
  { name: "Image", slug: "images", icon: "Image", color: "#ec4899" },
];

export const SEED_COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    defaultType: "snippets",
    isFavorite: true,
    items: [
      {
        title: "useDebounce and useLocalStorage hooks",
        description: "Two small hooks: debounce a fast-changing value, and persist state to localStorage.",
        type: "snippets",
        language: "typescript",
        isPinned: true,
        content: [
          'import { useEffect, useState } from "react";',
          "",
          "export function useDebounce<T>(value: T, delay = 300): T {",
          "  const [debounced, setDebounced] = useState(value);",
          "",
          "  useEffect(() => {",
          "    const timer = setTimeout(() => setDebounced(value), delay);",
          "    return () => clearTimeout(timer);",
          "  }, [value, delay]);",
          "",
          "  return debounced;",
          "}",
          "",
          "export function useLocalStorage<T>(key: string, initialValue: T) {",
          "  const [value, setValue] = useState<T>(() => {",
          '    if (typeof window === "undefined") return initialValue;',
          "    try {",
          "      const stored = window.localStorage.getItem(key);",
          "      return stored ? (JSON.parse(stored) as T) : initialValue;",
          "    } catch {",
          "      return initialValue;",
          "    }",
          "  });",
          "",
          "  useEffect(() => {",
          "    try {",
          "      window.localStorage.setItem(key, JSON.stringify(value));",
          "    } catch {",
          "      // Storage unavailable: keep the in-memory value.",
          "    }",
          "  }, [key, value]);",
          "",
          "  return [value, setValue] as const;",
          "}",
        ].join("\n"),
      },
      {
        title: "Compound Tabs component with context",
        description: "A compound component pattern: a context provider shared by Tabs, Tabs.Trigger and Tabs.Panel.",
        type: "snippets",
        language: "typescript",
        content: [
          'import { createContext, useContext, useState, type ReactNode } from "react";',
          "",
          "interface TabsContextValue {",
          "  active: string;",
          "  setActive: (id: string) => void;",
          "}",
          "",
          "const TabsContext = createContext<TabsContextValue | null>(null);",
          "",
          "function useTabs() {",
          "  const context = useContext(TabsContext);",
          '  if (!context) throw new Error("Tabs components must be used inside <Tabs>");',
          "  return context;",
          "}",
          "",
          "export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {",
          "  const [active, setActive] = useState(defaultTab);",
          "  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;",
          "}",
          "",
          "Tabs.Trigger = function Trigger({ id, children }: { id: string; children: ReactNode }) {",
          "  const { active, setActive } = useTabs();",
          "  return (",
          '    <button role="tab" aria-selected={active === id} onClick={() => setActive(id)}>',
          "      {children}",
          "    </button>",
          "  );",
          "};",
          "",
          "Tabs.Panel = function Panel({ id, children }: { id: string; children: ReactNode }) {",
          "  const { active } = useTabs();",
          '  return active === id ? <div role="tabpanel">{children}</div> : null;',
          "};",
        ].join("\n"),
      },
      {
        title: "TypeScript utility functions",
        description: "Handy helpers: human-readable file sizes, grouping a list by key, and a sleep promise.",
        type: "snippets",
        language: "typescript",
        content: [
          "export function formatBytes(bytes: number, decimals = 1): string {",
          '  if (bytes === 0) return "0 B";',
          '  const units = ["B", "KB", "MB", "GB", "TB"];',
          "  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);",
          "  return `${(bytes / 1024 ** index).toFixed(decimals)} ${units[index]}`;",
          "}",
          "",
          "export function groupBy<T, K extends string | number>(items: T[], getKey: (item: T) => K): Record<K, T[]> {",
          "  const groups = {} as Record<K, T[]>;",
          "  for (const item of items) {",
          "    const key = getKey(item);",
          "    (groups[key] ??= []).push(item);",
          "  }",
          "  return groups;",
          "}",
          "",
          "export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));",
        ].join("\n"),
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    defaultType: "prompts",
    isFavorite: true,
    items: [
      {
        title: "Senior code reviewer",
        description: "Review a change for correctness, clarity, accessibility and edge cases.",
        type: "prompts",
        isPinned: true,
        content: [
          "You are a senior engineer reviewing a pull request. Review the code below.",
          "",
          "1. Point out bugs and incorrect assumptions first, with the line or snippet involved.",
          "2. Then cover readability, naming, error handling and edge cases.",
          "3. Flag security and accessibility issues.",
          "4. Suggest concrete fixes as code, not just descriptions.",
          "",
          "Be direct and specific. Skip praise and style nitpicks that a linter would catch.",
          "",
          "Code to review:",
          "{{code}}",
        ].join("\n"),
      },
      {
        title: "Documentation generator",
        description: "Turn a module or function into clear, accurate documentation.",
        type: "prompts",
        content: [
          "Write documentation for the code below for a developer who has never seen it.",
          "",
          "Include: a one-paragraph summary, the parameters and return value, a short usage example,",
          "and any side effects, errors or edge cases. Use Markdown. Do not invent behaviour that the",
          "code does not implement; if something is unclear, say so.",
          "",
          "Code:",
          "{{code}}",
        ].join("\n"),
      },
      {
        title: "Refactoring assistant",
        description: "Simplify code without changing its behaviour.",
        type: "prompts",
        isFavorite: true,
        content: [
          "Refactor the code below to make it simpler and easier to maintain without changing behaviour.",
          "",
          "- Explain each change in one sentence and why it helps.",
          "- Keep the public API and outputs identical.",
          "- Remove duplication and dead code, and split long functions.",
          "- Point out anything you would NOT change and why.",
          "",
          "Code:",
          "{{code}}",
        ].join("\n"),
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    defaultType: "links",
    items: [
      {
        title: "Multi-stage Dockerfile for Next.js",
        description: "Small production image: install, build, then run with only what is needed.",
        type: "snippets",
        language: "dockerfile",
        content: [
          "FROM node:22-alpine AS deps",
          "WORKDIR /app",
          "COPY package*.json ./",
          "RUN npm ci",
          "",
          "FROM node:22-alpine AS builder",
          "WORKDIR /app",
          "COPY --from=deps /app/node_modules ./node_modules",
          "COPY . .",
          "RUN npm run build",
          "",
          "FROM node:22-alpine AS runner",
          "WORKDIR /app",
          "ENV NODE_ENV=production",
          "COPY --from=builder /app/.next ./.next",
          "COPY --from=builder /app/public ./public",
          "COPY --from=builder /app/node_modules ./node_modules",
          "COPY --from=builder /app/package.json ./package.json",
          "EXPOSE 3000",
          'CMD ["npm", "start"]',
        ].join("\n"),
      },
      {
        title: "Deploy with Docker Compose",
        description: "Pull the latest images, restart changed services and clean up old images.",
        type: "commands",
        language: "bash",
        content: "docker compose pull && docker compose up -d --remove-orphans && docker image prune -f",
      },
      {
        title: "Docker documentation",
        description: "Official Docker docs: images, Compose, networking and more.",
        type: "links",
        url: "https://docs.docker.com/",
      },
      {
        title: "GitHub Actions documentation",
        description: "Official docs for building CI/CD workflows with GitHub Actions.",
        type: "links",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    defaultType: "commands",
    items: [
      {
        title: "Pretty git log",
        description: "Compact, graph-style history of all branches.",
        type: "commands",
        language: "bash",
        isFavorite: true,
        content: "git log --oneline --graph --decorate --all -20",
      },
      {
        title: "List running containers",
        description: "Docker containers with their image, status and ports in a readable table.",
        type: "commands",
        language: "bash",
        content: 'docker ps --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}"',
      },
      {
        title: "Free up a port",
        description: "Find and stop the process listening on a port (macOS and Linux).",
        type: "commands",
        language: "bash",
        content: "lsof -ti:3000 | xargs kill -9",
      },
      {
        title: "Check outdated packages",
        description: "See which npm dependencies have newer versions available.",
        type: "commands",
        language: "bash",
        content: "npm outdated",
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    defaultType: "links",
    items: [
      {
        title: "Tailwind CSS documentation",
        description: "Official Tailwind CSS docs: utilities, theming and configuration.",
        type: "links",
        url: "https://tailwindcss.com/docs",
      },
      {
        title: "shadcn/ui",
        description: "Accessible, customizable React components you copy into your project.",
        type: "links",
        url: "https://ui.shadcn.com/",
      },
      {
        title: "Material Design 3",
        description: "Google's design system: components, guidelines and theming.",
        type: "links",
        url: "https://m3.material.io/",
      },
      {
        title: "Lucide icons",
        description: "A clean, consistent open-source icon library.",
        type: "links",
        url: "https://lucide.dev/",
      },
    ],
  },
];
