import { FolderHeart, Folder, LayoutGrid, Star, type LucideIcon } from "lucide-react";

import type { DashboardStats } from "@/types/dashboard";

interface StatDefinition {
  key: keyof DashboardStats;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

const STATS: StatDefinition[] = [
  { key: "totalItems", label: "Items", icon: LayoutGrid, iconClassName: "bg-stat-blue-surface text-stat-blue" },
  { key: "totalCollections", label: "Collections", icon: Folder, iconClassName: "bg-stat-violet-surface text-stat-violet" },
  { key: "favoriteItems", label: "Favorite items", icon: Star, iconClassName: "bg-stat-yellow-surface text-stat-yellow" },
  { key: "favoriteCollections", label: "Favorite collections", icon: FolderHeart, iconClassName: "bg-stat-emerald-surface text-stat-emerald" },
];

export default function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {STATS.map(({ key, label, icon: Icon, iconClassName }, index) => (
        <div
          key={key}
          style={{ animationDelay: `${index * 60}ms` }}
          className="group flex flex-col items-start gap-3 rounded-xl border bg-card p-4 hover:border-foreground/25 sm:flex-row sm:items-center animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:shadow-lg motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none ${iconClassName}`}>
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold leading-tight">{stats[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
