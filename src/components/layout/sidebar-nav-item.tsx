import { NavLink } from "react-router"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarNavItemProps {
  to: string
  icon: LucideIcon
  label: string
  isCollapsed: boolean
  onClick?: () => void
}

export function SidebarNavItem({ to, icon: Icon, label, isCollapsed, onClick }: SidebarNavItemProps) {
  const linkContent = (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          "hover:bg-sidebar-accent",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
          isCollapsed && "justify-center px-2"
        )
      }
    >
      <Icon className={cn("size-5 shrink-0 transition-colors")} />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
}
