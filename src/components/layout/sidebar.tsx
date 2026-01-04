import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export function Sidebar() {
  const { isCollapsed, toggleCollapsed } = useSidebarStore();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out lg:flex",
          isCollapsed ? "w-18" : "w-64"
        )}
      >
        <SidebarHeader isCollapsed={isCollapsed} onToggle={toggleCollapsed} />
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarNav isCollapsed={isCollapsed} />
        </div>
        {isCollapsed && (
          <div className="border-t border-sidebar-border p-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <PanelLeft className="size-4" />
            </Button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
