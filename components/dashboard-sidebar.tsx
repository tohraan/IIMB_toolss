"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import {
  Cloud,
  Megaphone,
  Zap,
  Bot,
  Settings,
  LogOut,
  Home,
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const toolCategories = {
  "cloud-dev": {
    name: "Cloud Dev",
    icon: Cloud,
    tools: [
      { name: "API Tester Lite", href: "/tools/cloud-dev/api-tester", icon: TestTube },
      { name: "SQL Query Assistant", href: "/tools/cloud-dev/sql-assistant", icon: Database },
      { name: "Cloud Cost Estimator", href: "/tools/cloud-dev/cost-estimator", icon: DollarSign },
      { name: "DevOps Checklist Builder", href: "/tools/cloud-dev/devops-checklist", icon: CheckSquare },
      { name: "API Documentation Summarizer", href: "/tools/cloud-dev/api-docs", icon: FileText },
    ],
  },
  marketing: {
    name: "Marketing",
    icon: Megaphone,
    tools: [
      { name: "Ad Copy Generator", href: "/tools/marketing/ad-copy", icon: PenTool },
      { name: "Persona Builder", href: "/tools/marketing/persona-builder", icon: Users },
      { name: "Content Calendar Maker", href: "/tools/marketing/content-calendar", icon: Calendar },
      { name: "Hashtag & SEO Finder", href: "/tools/marketing/hashtag-seo", icon: Hash },
      { name: "Email Campaign Writer", href: "/tools/marketing/email-campaign", icon: Mail },
    ],
  },
  "productivity-design": {
    name: "Productivity & Design",
    icon: Zap,
    tools: [
      { name: "Meeting Notes Summarizer", href: "/tools/productivity-design/meeting-notes", icon: StickyNote },
      { name: "Presentation Draft Maker", href: "/tools/productivity-design/presentation", icon: Presentation },
      { name: "Task Breakdown Tool", href: "/tools/productivity-design/task-breakdown", icon: ListTodo },
      { name: "Resume Optimizer", href: "/tools/productivity-design/resume-optimizer", icon: FileUser },
      { name: "Brand Kit Starter", href: "/tools/productivity-design/brand-kit", icon: Palette },
    ],
  },
  "ai-general": {
    name: "AI General",
    icon: Bot,
    tools: [
      { name: "Research Summarizer", href: "/tools/ai-general/research-summarizer", icon: Search },
      { name: "Dataset Analyzer", href: "/tools/ai-general/dataset-analyzer", icon: BarChart3 },
      { name: "Business Idea Validator", href: "/tools/ai-general/idea-validator", icon: Lightbulb },
      { name: "AI Q&A Sandbox", href: "/tools/ai-general/qa-sandbox", icon: HelpCircle },
      { name: "Competitor Snapshot", href: "/tools/ai-general/competitor-snapshot", icon: Building },
    ],
  },
}

interface DashboardSidebarProps {
  currentCategory?: string
}

export function DashboardSidebar({ currentCategory }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsCollapsed(window.innerWidth < 768)
    }
  }, [])

  const handleLogout = async () => {
    // Clear any local session
    try {
      localStorage.removeItem("user")
    } catch {}
    router.push("/")
  }

  return (
    <div className={`flex h-full ${isCollapsed ? "w-16" : "w-64"} flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200`}>
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-2">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold px-2">
          <Bot className="h-6 w-6 text-sidebar-primary" />
          {!isCollapsed && <span>AI Tools Platform</span>}
        </Link>
        <Button variant="ghost" size="icon" aria-label="Toggle sidebar" onClick={() => setIsCollapsed((v) => !v)}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                  <Link href="/dashboard">
                    <Home className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Dashboard</span>}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Dashboard</TooltipContent>}
            </Tooltip>
          </TooltipProvider>

          <Separator className="my-4" />

          {Object.entries(toolCategories).map(([key, category]) => {
            const CategoryIcon = category.icon
            const isActive = currentCategory === key || pathname.includes(`/tools/${key}`)

            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-sidebar-foreground">
                  <CategoryIcon className="h-4 w-4" />
                  {!isCollapsed && <span>{category.name}</span>}
                </div>
                <div className={`${isCollapsed ? "ml-0" : "ml-6"} space-y-1`}>
                  {category.tools.map((tool) => {
                    const ToolIcon = tool.icon
                    return (
                      <TooltipProvider key={tool.href}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={pathname === tool.href ? "secondary" : "ghost"}
                              size="sm"
                              className={`w-full justify-start ${isCollapsed ? "px-2" : "text-xs"}`}
                              asChild
                            >
                              <Link href={tool.href}>
                                <ToolIcon className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
                                {!isCollapsed && <span>{tool.name}</span>}
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isCollapsed && <TooltipContent side="right">{tool.name}</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-4">
        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Settings</span>}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">Sign Out</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Sign Out</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

export default DashboardSidebar
