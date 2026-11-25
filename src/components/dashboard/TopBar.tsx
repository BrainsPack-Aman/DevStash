import { FolderPlus, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TopBar() {
  return (
    <header className="grid h-16 grid-cols-[1fr_minmax(0,28rem)_1fr] items-center gap-4 border-b px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          DS
        </div>
        <span className="hidden text-lg font-semibold tracking-tight sm:inline">
          DevStash
        </span>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search anything..."
          className="h-9 pl-9"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <FolderPlus />
          New collection
        </Button>
        <Button>
          <Plus />
          New item
        </Button>
      </div>
    </header>
  );
}
