"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getThemeId,
  restoreTheme,
  selectTheme,
  subscribeToTheme,
  THEMES,
  type ThemeId,
} from "@/lib/theme";

const getServerThemeId = (): ThemeId => "default";

export default function ThemeSelector() {
  const themeId = useSyncExternalStore(subscribeToTheme, getThemeId, getServerThemeId);

  useLayoutEffect(restoreTheme, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" title="Theme" aria-label="Choose theme" />}
      >
        <Palette />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-1.5 duration-150 motion-reduce:animate-none">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 uppercase tracking-wider">Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={themeId} onValueChange={(id: ThemeId) => selectTheme(id)}>
            {THEMES.map((theme) => (
              <DropdownMenuRadioItem
                key={theme.id}
                value={theme.id}
                closeOnClick
                className="cursor-pointer px-2 py-1.5 transition-colors focus:bg-accent/70 data-checked:bg-accent data-checked:font-medium data-checked:focus:bg-accent"
              >
                {theme.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
