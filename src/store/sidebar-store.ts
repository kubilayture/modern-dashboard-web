import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SidebarState {
  isCollapsed: boolean
  isMobileOpen: boolean
  setCollapsed: (collapsed: boolean) => void
  toggleCollapsed: () => void
  setMobileOpen: (open: boolean) => void
  toggleMobileOpen: () => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      isMobileOpen: false,
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      toggleCollapsed: () => set({ isCollapsed: !get().isCollapsed }),
      setMobileOpen: (open) => set({ isMobileOpen: open }),
      toggleMobileOpen: () => set({ isMobileOpen: !get().isMobileOpen }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
)
