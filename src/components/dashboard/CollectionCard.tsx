import Link from "next/link";
import { Star } from "lucide-react";

import ItemTypeIcon from "@/components/dashboard/ItemTypeIcon";
import { getItemType } from "@/lib/dashboard-data";
import { formatShortDate } from "@/lib/format";
import type { Collection } from "@/types/dashboard";

export default function CollectionCard({ collection }: { collection: Collection }) {
  const type = getItemType(collection.defaultTypeId);

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/25"
    >
      <div className="flex items-start justify-between">
        <div
          className="flex size-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: type ? `${type.color}1f` : undefined, color: type?.color }}
        >
          <ItemTypeIcon iconName={type?.icon} className="size-4" />
        </div>
        {collection.isFavorite && (
          <Star className="size-4 fill-yellow-400 text-yellow-400" aria-label="Favorite" />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-medium">{collection.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{collection.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
        <span>{collection.itemCount} items</span>
        <span>Updated {formatShortDate(collection.updatedAt)}</span>
      </div>
    </Link>
  );
}
