export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
  workspace: string;
}

export interface ItemType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  isSystem: boolean;
  count: number;
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export interface CollectionTypeSummary {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

// A collection as read from the database. Its look comes from the item types inside it.
export interface DashboardCollection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  updatedAt: string;
  // most-used type (falls back to the collection's default type when empty)
  primaryType: CollectionTypeSummary | null;
  // every type present, most-used first
  types: CollectionTypeSummary[];
}

// An item as read from the database. Its look comes from its item type.
export interface DashboardItem {
  id: string;
  title: string;
  description: string;
  contentType: "TEXT" | "URL" | "FILE";
  content: string | null;
  language: string | null;
  url: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  type: { name: string; icon: string; color: string };
  tags: string[];
}
