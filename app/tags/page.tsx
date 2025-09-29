import { DashboardShell } from "@/components/dashboard-shell"

export default function TagsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-h1 font-bold mb-4">Tags</h1>
        <p className="text-body text-muted-foreground">No tags have been created yet.</p>
      </div>
    </DashboardShell>
  )
}
