import { Folder } from "lucide-react";

import { ITEM_TYPE_ICONS } from "@/lib/item-type-icons";

interface ItemTypeIconProps {
  iconName: string | undefined;
  className?: string;
}

export default function ItemTypeIcon({ iconName, className }: ItemTypeIconProps) {
  const Icon = (iconName && ITEM_TYPE_ICONS[iconName]) || Folder;
  return <Icon className={className} />;
}
