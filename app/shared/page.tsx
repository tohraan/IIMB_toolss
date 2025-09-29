import { DashboardShell } from "@/components/dashboard-shell"

export default function SharedPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-h1 font-bold mb-4">Shared Files</h1>
        <p className="text-body text-muted-foreground">No files have been shared with you.</p>
      </div>
    </DashboardShell>
  )
}
