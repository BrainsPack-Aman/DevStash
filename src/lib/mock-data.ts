// Placeholder for the signed-in user, until authentication exists.

import type { CurrentUser } from "@/types/dashboard";

export const currentUser: CurrentUser = {
  id: "user-1",
  name: "Jamie Davis",
  email: "demo@devstash.io",
  isPro: false,
  workspace: "Studio workspace",
};
