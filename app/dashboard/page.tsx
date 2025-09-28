import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
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
  Building,
} from "lucide-react"

const toolCategories = [
  {
    name: "Cloud Dev",
    description: "Development and infrastructure tools",
    icon: Cloud,
    color: "text-blue-400",
    tools: [
      { name: "API Tester Lite", href: "/tools/cloud-dev/api-tester", icon: TestTube },
      { name: "SQL Query Assistant", href: "/tools/cloud-dev/sql-assistant", icon: Database },
      { name: "Cloud Cost Estimator", href: "/tools/cloud-dev/cost-estimator", icon: DollarSign },
      { name: "DevOps Checklist Builder", href: "/tools/cloud-dev/devops-checklist", icon: CheckSquare },
      { name: "API Documentation Summarizer", href: "/tools/cloud-dev/api-docs", icon: FileText },
    ],
  },
  {
    name: "Marketing",
    description: "Content creation and marketing automation",
    icon: Megaphone,
    color: "text-green-400",
    tools: [
      { name: "Ad Copy Generator", href: "/tools/marketing/ad-copy", icon: PenTool },
      { name: "Persona Builder", href: "/tools/marketing/persona-builder", icon: Users },
      { name: "Content Calendar Maker", href: "/tools/marketing/content-calendar", icon: Calendar },
      { name: "Hashtag & SEO Finder", href: "/tools/marketing/hashtag-seo", icon: Hash },
      { name: "Email Campaign Writer", href: "/tools/marketing/email-campaign", icon: Mail },
    ],
  },
  {
    name: "Productivity & Design",
    description: "Workflow optimization and creative tools",
    icon: Zap,
    color: "text-yellow-400",
    tools: [
      { name: "Meeting Notes Summarizer", href: "/tools/productivity-design/meeting-notes", icon: StickyNote },
      { name: "Presentation Draft Maker", href: "/tools/productivity-design/presentation", icon: Presentation },
      { name: "Task Breakdown Tool", href: "/tools/productivity-design/task-breakdown", icon: ListTodo },
      { name: "Resume Optimizer", href: "/tools/productivity-design/resume-optimizer", icon: FileUser },
      { name: "Brand Kit Starter", href: "/tools/productivity-design/brand-kit", icon: Palette },
    ],
  },
  {
    name: "AI General",
    description: "Research, analysis, and general AI assistance",
    icon: Bot,
    color: "text-purple-400",
    tools: [
      { name: "Research Summarizer", href: "/tools/ai-general/research-summarizer", icon: Search },
      { name: "Dataset Analyzer", href: "/tools/ai-general/dataset-analyzer", icon: BarChart3 },
      { name: "Business Idea Validator", href: "/tools/ai-general/idea-validator", icon: Lightbulb },
      { name: "AI Q&A Sandbox", href: "/tools/ai-general/qa-sandbox", icon: HelpCircle },
      { name: "Competitor Snapshot", href: "/tools/ai-general/competitor-snapshot", icon: Building },
    ],
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-balance">Welcome to your AI Toolkit</h1>
        <p className="text-muted-foreground text-pretty">
          Choose from 20 specialized tools across 4 categories to supercharge your productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {toolCategories.map((category) => {
          const CategoryIcon = category.icon
          return (
            <Card key={category.name} className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CategoryIcon className={`h-6 w-6 ${category.color}`} />
                  {category.name}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {category.tools.map((tool) => {
                    const ToolIcon = tool.icon
                    return (
                      <Button key={tool.href} variant="ghost" className="justify-start h-auto p-3" asChild>
                        <Link href={tool.href}>
                          <ToolIcon className="mr-3 h-4 w-4" />
                          <span className="text-sm">{tool.name}</span>
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
