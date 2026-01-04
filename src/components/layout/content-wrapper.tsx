import type { ReactNode } from "react"

interface ContentWrapperProps {
  children: ReactNode
}

export function ContentWrapper({ children }: ContentWrapperProps) {
  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-full">
        {children}
      </div>
    </main>
  )
}
