import { useTranslation } from "react-i18next"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FolderTree,
  User,
  Settings,
} from "lucide-react"
import { SidebarNavItem } from "./sidebar-nav-item"

interface SidebarNavProps {
  isCollapsed: boolean
  onItemClick?: () => void
}

export function SidebarNav({ isCollapsed, onItemClick }: SidebarNavProps) {
  const { t } = useTranslation()

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/orders", icon: ShoppingCart, label: t("nav.orders") },
    { to: "/products", icon: Package, label: t("nav.products") },
    { to: "/customers", icon: Users, label: t("nav.customers") },
    { to: "/categories", icon: FolderTree, label: t("nav.categories") },
    { to: "/profile", icon: User, label: t("nav.profile") },
    { to: "/settings", icon: Settings, label: t("nav.settings") },
  ]

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <SidebarNavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isCollapsed={isCollapsed}
          onClick={onItemClick}
        />
      ))}
    </nav>
  )
}
