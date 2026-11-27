import Link from "next/link";
import { Star } from "lucide-react";

import ItemTypeIcon from "@/components/dashboard/ItemTypeIcon";
import { formatShortDate } from "@/lib/format";
import { itemColorVar } from "@/lib/item-type-colors";
import type { DashboardCollection } from "@/types/dashboard";

interface CollectionCardProps {
  collection: DashboardCollection;
  index?: number;
}

export default function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  const type = collection.primaryType;

  return (
    <Link
      href={`/collections/${collection.id}`}
      style={{
        ...(type ? { borderLeftColor: type.color } : null),
        animationDelay: `${index * 60}ms`,
      }}
      className="group flex flex-col gap-3 rounded-xl border border-l-[3px] bg-card p-4 hover:border-foreground/25 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:shadow-lg motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex size-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none ${type ? "text-item" : ""}`}
          style={type ? { ...itemColorVar(type.color), backgroundColor: `${type.color}1f` } : undefined}
        >
          <ItemTypeIcon iconName={type?.icon} className="size-4" />
        </div>
        {collection.isFavorite && (
          <Star className="size-4 fill-favorite text-favorite" aria-label="Favorite" />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-medium">{collection.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{collection.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
        </span>
        <div className="flex items-center gap-1.5">
          {collection.types.map((t) => (
            <span key={t.id} title={t.name} className="text-item" style={itemColorVar(t.color)}>
              <ItemTypeIcon iconName={t.icon} className="size-3.5" />
            </span>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Updated {formatShortDate(collection.updatedAt)}</p>
    </Link>
  );
}
