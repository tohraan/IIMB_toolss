import { DashboardShell } from "@/components/dashboard-shell"
import { useFavorites } from "@/hooks/use-favorites"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2, Star, 
    Cloud,
    Megaphone,
    Zap,
    Bot,
    TestTube,
    Database,
    DollarSign,
    CheckSquare,
    FileText,
    PenTool,
    Users,
    Calendar,
    Hash,
    Mail,
    StickyNote,
    Presentation,
    ListTodo,
    CircleUser as FileUser,
    Palette,
    Search,
    BarChart3,
    Lightbulb,
    HelpCircle,
    Building, } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Re-defining toolCategories for direct use in this page, or it could be imported from a shared file.
const toolCategories = {
    "cloud-dev": {
      name: "Cloud Dev",
      icon: Cloud,
      tools: [
        { id: "api-tester", name: "API Tester Lite", href: "/tools/cloud-dev/api-tester", icon: TestTube },
        { id: "sql-assistant", name: "SQL Query Assistant", href: "/tools/cloud-dev/sql-assistant", icon: Database },
        { id: "cost-estimator", name: "Cloud Cost Estimator", href: "/tools/cloud-dev/cost-estimator", icon: DollarSign },
        { id: "devops-checklist", name: "DevOps Checklist Builder", href: "/tools/cloud-dev/devops-checklist", icon: CheckSquare },
        { id: "api-docs", name: "API Documentation Summarizer", href: "/tools/cloud-dev/api-docs", icon: FileText },
      ],
    },
    marketing: {
      name: "Marketing",
      icon: Megaphone,
      tools: [
        { id: "ad-copy", name: "Ad Copy Generator", href: "/tools/marketing/ad-copy", icon: PenTool },
        { id: "persona-builder", name: "Persona Builder", href: "/tools/marketing/persona-builder", icon: Users },
        { id: "content-calendar", name: "Content Calendar Maker", href: "/tools/marketing/content-calendar", icon: Calendar },
        { id: "hashtag-seo", name: "Hashtag & SEO Finder", href: "/tools/marketing/hashtag-seo", icon: Hash },
        { id: "email-campaign", name: "Email Campaign Writer", href: "/tools/marketing/email-campaign", icon: Mail },
      ],
    },
    "productivity-design": {
      name: "Productivity & Design",
      icon: Zap,
      tools: [
        { id: "meeting-notes", name: "Meeting Notes Summarizer", href: "/tools/productivity-design/meeting-notes", icon: StickyNote },
        { id: "presentation", name: "Presentation Draft Maker", href: "/tools/productivity-design/presentation", icon: Presentation },
        { id: "task-breakdown", name: "Task Breakdown Tool", href: "/tools/productivity-design/task-breakdown", icon: ListTodo },
        { id: "resume-optimizer", name: "Resume Optimizer", href: "/tools/productivity-design/resume-optimizer", icon: FileUser },
        { id: "brand-kit", name: "Brand Kit Starter", href: "/tools/productivity-design/brand-kit", icon: Palette },
      ],
    },
    "ai-general": {
      name: "AI General",
      icon: Bot,
      tools: [
        { id: "research-summarizer", name: "Research Summarizer", href: "/tools/ai-general/research-summarizer", icon: Search },
        { id: "dataset-analyzer", name: "Dataset Analyzer", href: "/tools/ai-general/dataset-analyzer", icon: BarChart3 },
        { id: "idea-validator", name: "Business Idea Validator", href: "/tools/ai-general/idea-validator", icon: Lightbulb },
        { id: "qa-sandbox", name: "AI Q&A Sandbox", href: "/tools/ai-general/qa-sandbox", icon: HelpCircle },
        { id: "competitor-snapshot", name: "Competitor Snapshot", href: "/tools/ai-general/competitor-snapshot", icon: Building },
      ],
    },
  }

// Helper function to find tool icon by href
const getToolIcon = (href: string) => {
  for (const categoryKey in toolCategories) {
    const category = (toolCategories as any)[categoryKey];
    const tool = category.tools.find((t: any) => t.href === href);
    if (tool) {
      return tool.icon;
    }
  }
  return Star; // Default icon if not found
};

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <DashboardShell>
      <div className="flex flex-col items-center p-6">
        <h1 className="text-h1 font-bold mb-4">Favorite Tools</h1>
        {favorites.length === 0 ? (
          <p className="text-body text-muted-foreground">No favorite tools added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mt-6">
            {favorites.map((item) => {
              const ToolIcon = getToolIcon(item.href);
              return (
                <Card key={item.id} className="h-fit flex flex-col justify-between">
                  <CardHeader className="flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ToolIcon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-body">{item.name}</CardTitle>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 transition-transform duration-200 hover:scale-110"
                            onClick={() => toggleFavorite(item)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Remove from favorites</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Remove from favorites</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardHeader>
                  <CardContent>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:underline">
                      Go to tool
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
