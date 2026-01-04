import { useTranslation } from "react-i18next"
import { useSidebarStore } from "@/store"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { SidebarNav } from "./sidebar-nav"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Sparkles } from "lucide-react"

export function MobileSidebar() {
  const { t } = useTranslation()
  const { isMobileOpen, setMobileOpen } = useSidebarStore()

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">{t("common.appName")}</span>
        </div>
        <div className="px-3 py-4">
          <TooltipProvider>
            <SidebarNav isCollapsed={false} onItemClick={() => setMobileOpen(false)} />
          </TooltipProvider>
        </div>
      </SheetContent>
    </Sheet>
  )
}
