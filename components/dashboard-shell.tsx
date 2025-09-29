import type { ReactNode } from "react"

import { DashboardHeader } from "@/components/dashboard-header"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <DashboardHeader />
      <main className="flex flex-1 flex-col overflow-hidden p-0">
        {children}
      </main>
    </div>
  )
}
