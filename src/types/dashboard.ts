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

export interface Collection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  defaultTypeId: string;
  itemCount: number;
  updatedAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  itemTypeId: string;
  contentType: "TEXT" | "URL";
  content?: string;
  language?: string | null;
  url?: string;
  tags: string[];
  collectionIds: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}
