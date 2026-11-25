import { FolderHeart, Folder, LayoutGrid, Star, type LucideIcon } from "lucide-react";

import type { DashboardStats } from "@/types/dashboard";

interface StatDefinition {
  key: keyof DashboardStats;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

const STATS: StatDefinition[] = [
  { key: "totalItems", label: "Items", icon: LayoutGrid, iconClassName: "bg-blue-500/10 text-blue-400" },
  { key: "totalCollections", label: "Collections", icon: Folder, iconClassName: "bg-violet-500/10 text-violet-400" },
  { key: "favoriteItems", label: "Favorite items", icon: Star, iconClassName: "bg-yellow-500/10 text-yellow-400" },
  { key: "favoriteCollections", label: "Favorite collections", icon: FolderHeart, iconClassName: "bg-emerald-500/10 text-emerald-400" },
];

export default function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {STATS.map(({ key, label, icon: Icon, iconClassName }) => (
        <div
          key={key}
          className="flex flex-col items-start gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center"
        >
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
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
