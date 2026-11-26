import { Pin, Star } from "lucide-react";

import ItemTypeIcon from "@/components/dashboard/ItemTypeIcon";
import { getItemType } from "@/lib/dashboard-data";
import { formatShortDate } from "@/lib/format";
import type { Item } from "@/types/dashboard";

function getPreview(item: Item): string | undefined {
  if (item.contentType === "URL") return item.url;
  if (item.language) return item.content?.split("\n")[0];
  return undefined;
}

export default function ItemCard({ item, index = 0 }: { item: Item; index?: number }) {
  const type = getItemType(item.itemTypeId);
  const preview = getPreview(item);

  return (
    <article
      style={{ animationDelay: `${index * 60}ms` }}
      className="flex flex-col gap-3 rounded-xl border bg-card p-4 hover:border-foreground/25 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:shadow-lg motion-reduce:animate-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-center justify-between gap-2">
        {type && (
          <span
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${type.color}1f`, color: type.color }}
          >
            <ItemTypeIcon iconName={type.icon} className="size-3.5" />
            {type.name}
          </span>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          {item.isPinned && <Pin className="size-3.5" aria-label="Pinned" />}
          {item.isFavorite && (
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" aria-label="Favorite" />
          )}
          <span className="text-xs">{formatShortDate(item.createdAt)}</span>
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="truncate font-medium">{item.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
      </div>

      {preview && (
        <code className="block truncate rounded-md border bg-background px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
          {preview}
        </code>
      )}

      {item.tags.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <li key={tag} className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              #{tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
