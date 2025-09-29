import type { ReactNode } from "react"

import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <main className="flex flex-1 flex-col overflow-hidden p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
