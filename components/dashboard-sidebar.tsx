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
  Folder,
  Trash,
  HardDrive,
  LayoutGrid,
  ChevronDown, // Added ChevronDown for collapsible categories
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible" // Added Collapsible components

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
  const [isMobile, setIsMobile] = useState(false)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initialOpen: Record<string, boolean> = {}
    Object.keys(toolCategories).forEach(key => {
      initialOpen[key] = true // All categories open by default
    })
    return initialOpen
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => window.innerWidth < 768
      setIsMobile(checkMobile())
      setIsCollapsed(checkMobile())

      const handleResize = () => {
        setIsMobile(checkMobile())
        setIsCollapsed(checkMobile())
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleLogout = async () => {
    // Clear any local session
    try {
      localStorage.removeItem("user")
    } catch {}
    router.push("/")
  }

  const toggleCategory = (categoryKey: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }))
  }

  const SidebarContent = (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start ml-6"}`} asChild>
                <Link href="/dashboard">
                  <Home className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-2 text-body">All Files</span>}
                </Link>
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right" className="text-body">All Files</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start ml-6"}`} asChild>
                <Link href="/recent">
                  <Folder className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-2 text-body">Recent</span>}
                </Link>
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right" className="text-body">Recent</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start ml-6"}`} asChild>
                <Link href="/favorites">
                  <Folder className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-2 text-body">Favorites</span>}
                </Link>
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right" className="text-body">Favorites</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start ml-6"}`} asChild>
                <Link href="/shared">
                  <Folder className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-2 text-body">Shared</span>}
                </Link>
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right" className="text-body">Shared</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className={`w-full ${isCollapsed ? "justify-center px-2" : "justify-start ml-6"}`} asChild>
                <Link href="/tags">
                  <Folder className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-2 text-body">Tags</span>}
                </Link>
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right" className="text-body">Tags</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        <Separator className="my-4" />

        {Object.entries(toolCategories).map(([key, category]) => {
          const CategoryIcon = category.icon
          const isActive = currentCategory === key || pathname.includes(`/tools/${key}`)
          const isOpen = openCategories[key]

          return (
            <Collapsible key={key} open={isOpen} onOpenChange={() => toggleCategory(key)} className="space-y-1">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-between font-medium text-body ${isCollapsed ? "justify-center" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-5 w-5" />
                    <span className="text-body">{category.name}</span>
                  </div>
                  {!isCollapsed && (
                    <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`} />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className={`${isCollapsed ? "ml-0 text-center" : ""} space-y-1`}>
                {category.tools.map((tool) => {
                  const ToolIcon = tool.icon
                  return (
                    <TooltipProvider key={tool.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={pathname === tool.href ? "secondary" : "ghost"}
                            size="sm"
                            className={`w-full justify-start ${isCollapsed ? "px-2" : "ml-6"}`}
                            asChild
                          >
                            <Link href={tool.href}>
                              <ToolIcon className={`${isCollapsed ? "" : "mr-2"} h-5 w-5`} />
                              {!isCollapsed && <span className="text-sm">{tool.name}</span>}
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right" className="text-sm">{tool.name}</TooltipContent>}
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </ScrollArea>
  )

  return (
    <> {/* Use a React Fragment to return multiple elements */}
      <div className={`hidden md:flex h-full ${isCollapsed ? "w-16" : "w-72"} flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200`}>
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-2">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold px-2">
            <Bot className="h-6 w-6 text-sidebar-primary" />
            {!isCollapsed && <span className="text-body">AI Tools Platform</span>}
          </Link>
          <Button variant="ghost" size="icon" aria-label="Toggle sidebar" onClick={() => setIsCollapsed((v) => !v)}>
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        {SidebarContent}
        <div className="border-t border-sidebar-border p-4">
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/settings">
                      <Settings className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-2 text-body">Settings</span>}
                    </Link>
                  </Button>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right" className="text-body">Settings</TooltipContent>}
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/deleted-files">
                      <Trash className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-2 text-body">Deleted Files</span>}
                    </Link>
                  </Button>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right" className="text-body">Deleted Files</TooltipContent>}
              </Tooltip>
            </TooltipProvider>

            <div className="mt-4 space-y-2">
              {!isCollapsed && (
                <div className="px-2">
                  <div className="flex items-center justify-between text-body text-muted-foreground mb-2">
                    <span>Storage</span>
                    <span className="font-medium">42 GB / 256 GB</span>
                  </div>
                  <Progress value={42 / 256 * 100} className="h-3" />
                </div>
              )}
              {isCollapsed && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="w-full justify-center">
                        <HardDrive className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-body">Storage: 42 GB / 256 GB</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-2 text-body">Sign Out</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right" className="text-body">Sign Out</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Hamburger Menu) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <LayoutGrid className="h-7 w-7" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="flex h-full w-full flex-col bg-sidebar border-r border-sidebar-border">
            <div className="flex h-14 items-center border-b border-sidebar-border px-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Bot className="h-6 w-6 text-sidebar-primary" />
                <span className="text-body">AI Tools Platform</span>
              </Link>
            </div>
            {SidebarContent}
            <div className="border-t border-sidebar-border p-4">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-5 w-5" />
                    <span className="text-body">Settings</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/deleted-files">
                    <Trash className="mr-2 h-5 w-5" />
                    <span className="text-body">Deleted Files</span>
                  </Link>
                </Button>
                <div className="mt-4 space-y-2 px-2">
                  <div className="flex items-center justify-between text-body text-muted-foreground mb-2">
                    <span>Storage</span>
                    <span className="font-medium">42 GB / 256 GB</span>
                  </div>
                  <Progress value={42 / 256 * 100} className="h-3" />
                </div>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-5 w-5" />
                  <span className="text-body">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default DashboardSidebar
