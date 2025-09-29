import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileSidebarDrawer } from "@/components/mobile-sidebar-drawer"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <main className="flex flex-1 flex-col overflow-hidden p-0">
        {children}
      </main>
      <div className="md:hidden">
        <MobileSidebarDrawer />
      </div>
    </div>
  )
}
