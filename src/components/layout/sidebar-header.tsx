import { useTranslation } from "react-i18next"
import { PanelLeftClose, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarHeaderProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        "flex h-16 items-center gap-3 border-b border-sidebar-border px-4",
        isCollapsed ? "justify-center" : "justify-between"
      )}
    >
      {!isCollapsed && (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">{t("common.appName")}</span>
        </div>
      )}
      {isCollapsed && (
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="size-4 text-primary-foreground" />
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn(
          "size-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
          isCollapsed && "hidden"
        )}
      >
        <PanelLeftClose className="size-4" />
      </Button>
    </div>
  )
}
