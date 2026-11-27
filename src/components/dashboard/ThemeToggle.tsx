"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getIsDark, selectMode, subscribeToTheme } from "@/lib/theme";

const getServerIsDark = () => true;

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribeToTheme, getIsDark, getServerIsDark);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => selectMode(!isDark)}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
