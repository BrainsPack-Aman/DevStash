import type { CSSProperties } from "react";

// Item type colors are data. Pass one in as a variable for the `text-item`
// utility, which adjusts it to stay readable in the current theme.
export function itemColorVar(color: string) {
  return { "--item-color": color } as CSSProperties;
}
