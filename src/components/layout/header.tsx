import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebarStore } from "@/store"
import { ThemeToggle } from "./theme-toggle"
import { LanguageSwitcher } from "./language-switcher"
import { UserDropdown } from "./user-dropdown"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { toggleMobileOpen } = useSidebarStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleMobileOpen}
      >
        <Menu className="size-5" />
      </Button>
      <div className="flex-1">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  )
}
