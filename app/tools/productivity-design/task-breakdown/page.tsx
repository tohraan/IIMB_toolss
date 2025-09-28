"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, ListTodo, RotateCcw, Download, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TaskBreakdownPage() {
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState("")
  const [timeline, setTimeline] = useState("")
  const [context, setContext] = useState("")
  const [taskBreakdown, setTaskBreakdown] = useState<any>(null)
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateTaskBreakdown = async () => {
    if (!goal || !timeline) {
      toast({
        title: "Error",
        description: "Please fill in goal and timeline",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI task breakdown generation
    setTimeout(() => {
      const mockTaskBreakdown = {
        projectTitle: goal,
        estimatedTimeline: timeline,
        totalTasks: 12,
        phases: [
          {
            phase: "Planning & Research",
            duration: "Week 1-2",
            tasks: [
              {
                id: "task-1",
                title: "Define project scope and requirements",
                description: "Create detailed project specification document",
                estimatedTime: "4-6 hours",
                priority: "High",
                dependencies: [],
              },
              {
                id: "task-2",
                title: "Research best practices and competitors",
                description: "Analyze market trends and competitor strategies",
                estimatedTime: "6-8 hours",
                priority: "Medium",
                dependencies: ["task-1"],
              },
              {
                id: "task-3",
                title: "Create project timeline and milestones",
                description: "Develop detailed project schedule with key deliverables",
                estimatedTime: "2-3 hours",
                priority: "High",
                dependencies: ["task-1"],
              },
            ],
          },
          {
            phase: "Design & Development",
            duration: "Week 3-6",
            tasks: [
              {
                id: "task-4",
                title: "Create wireframes and mockups",
                description: "Design user interface and user experience flows",
                estimatedTime: "8-12 hours",
                priority: "High",
                dependencies: ["task-2"],
              },
              {
                id: "task-5",
                title: "Set up development environment",
                description: "Configure tools, frameworks, and development workflow",
                estimatedTime: "3-4 hours",
                priority: "Medium",
                dependencies: ["task-3"],
              },
              {
                id: "task-6",
                title: "Implement core functionality",
                description: "Build main features and core business logic",
                estimatedTime: "20-30 hours",
                priority: "High",
                dependencies: ["task-4", "task-5"],
              },
              {
                id: "task-7",
                title: "Integrate third-party services",
                description: "Connect APIs and external services",
                estimatedTime: "6-10 hours",
                priority: "Medium",
                dependencies: ["task-6"],
              },
            ],
          },
          {
            phase: "Testing & Launch",
            duration: "Week 7-8",
            tasks: [
              {
                id: "task-8",
                title: "Conduct thorough testing",
                description: "Perform unit tests, integration tests, and user acceptance testing",
                estimatedTime: "8-12 hours",
                priority: "High",
                dependencies: ["task-7"],
              },
              {
                id: "task-9",
                title: "Fix bugs and optimize performance",
                description: "Address issues found during testing phase",
                estimatedTime: "6-10 hours",
                priority: "High",
                dependencies: ["task-8"],
              },
              {
                id: "task-10",
                title: "Prepare deployment environment",
                description: "Set up production servers and deployment pipeline",
                estimatedTime: "4-6 hours",
                priority: "Medium",
                dependencies: ["task-9"],
              },
              {
                id: "task-11",
                title: "Deploy to production",
                description: "Launch the project and monitor initial performance",
                estimatedTime: "2-4 hours",
                priority: "High",
                dependencies: ["task-10"],
              },
              {
                id: "task-12",
                title: "Create documentation and handover",
                description: "Document processes and train team members",
                estimatedTime: "4-6 hours",
                priority: "Medium",
                dependencies: ["task-11"],
              },
            ],
          },
        ],
        exportFormats: {
          trello: "Ready for Trello import",
          notion: "Compatible with Notion databases",
          csv: "Spreadsheet format available",
        },
      }

      setTaskBreakdown(mockTaskBreakdown)
      setLoading(false)
      toast({
        title: "Task breakdown generated",
        description: `${mockTaskBreakdown.totalTasks} tasks created across ${mockTaskBreakdown.phases.length} phases`,
      })
    }, 3000)
  }

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)
  }

  const copyTaskBreakdown = () => {
    if (!taskBreakdown) return

    const text = `PROJECT: ${taskBreakdown.projectTitle}
Timeline: ${taskBreakdown.estimatedTimeline}
Total Tasks: ${taskBreakdown.totalTasks}

${taskBreakdown.phases
  .map(
    (phase: any) => `
PHASE: ${phase.phase} (${phase.duration})
${phase.tasks
  .map(
    (task: any) => `
□ ${task.title}
  Description: ${task.description}
  Time: ${task.estimatedTime}
  Priority: ${task.priority}
  Dependencies: ${task.dependencies.length > 0 ? task.dependencies.join(", ") : "None"}
`,
  )
  .join("")}
`,
  )
  .join("")}`

    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Task breakdown copied to clipboard",
    })
  }

  const exportToTrello = () => {
    if (!taskBreakdown) return

    const trelloFormat = taskBreakdown.phases.map((phase: any) => ({
      listName: phase.phase,
      cards: phase.tasks.map((task: any) => ({
        name: task.title,
        desc: `${task.description}\n\nEstimated Time: ${task.estimatedTime}\nPriority: ${task.priority}\nDependencies: ${task.dependencies.join(", ") || "None"}`,
      })),
    }))

    const content = JSON.stringify(trelloFormat, null, 2)
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "trello-import.json"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Exported for Trello",
      description: "JSON file ready for Trello import",
    })
  }

  const exportToNotion = () => {
    if (!taskBreakdown) return

    const notionFormat = taskBreakdown.phases.flatMap((phase: any) =>
      phase.tasks.map((task: any) => ({
        Task: task.title,
        Description: task.description,
        Phase: phase.phase,
        "Estimated Time": task.estimatedTime,
        Priority: task.priority,
        Dependencies: task.dependencies.join(", ") || "None",
        Status: "Not Started",
      })),
    )

    const csvContent = [
      "Task,Description,Phase,Estimated Time,Priority,Dependencies,Status",
      ...notionFormat.map((task) =>
        Object.values(task)
          .map((value) => `"${value}"`)
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "notion-import.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Exported for Notion",
      description: "CSV file ready for Notion import",
    })
  }

  const reset = () => {
    setStep(1)
    setGoal("")
    setTimeline("")
    setContext("")
    setTaskBreakdown(null)
    setCompletedTasks(new Set())
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Task Breakdown Tool</h1>
        <p className="text-muted-foreground">Break down goals into actionable subtasks with export options</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Goal Setup</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Task Breakdown</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Define Your Goal</CardTitle>
            <CardDescription>Describe what you want to accomplish</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Project Goal</Label>
              <Input
                id="goal"
                placeholder="e.g., Launch a new mobile app, Organize a marketing campaign, Build a website"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                  <SelectItem value="1 month">1 month</SelectItem>
                  <SelectItem value="2-3 months">2-3 months</SelectItem>
                  <SelectItem value="6 months">6 months</SelectItem>
                  <SelectItem value="1 year">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Additional Context (Optional)</Label>
              <Textarea
                id="context"
                placeholder="Any specific requirements, constraints, or additional details about your project"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={generateTaskBreakdown} disabled={loading || !goal || !timeline}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Breaking down tasks...
                </>
              ) : (
                <>
                  <ListTodo className="mr-2 h-4 w-4" />
                  Generate Task Breakdown
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && taskBreakdown && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{taskBreakdown.projectTitle}</h2>
              <p className="text-muted-foreground">
                {taskBreakdown.totalTasks} tasks • {taskBreakdown.estimatedTimeline}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToTrello}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Export to Trello
              </Button>
              <Button variant="outline" onClick={exportToNotion}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Export to Notion
              </Button>
              <Button variant="outline" onClick={copyTaskBreakdown}>
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {taskBreakdown.phases.map((phase: any, phaseIndex: number) => (
              <Card key={phaseIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {phase.phase}
                    <Badge variant="outline">{phase.duration}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {phase.tasks.filter((task: any) => completedTasks.has(task.id)).length} of {phase.tasks.length}{" "}
                    tasks completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {phase.tasks.map((task: any) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={task.id}
                            checked={completedTasks.has(task.id)}
                            onCheckedChange={() => toggleTask(task.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={task.id}
                              className={`font-medium cursor-pointer ${
                                completedTasks.has(task.id) ? "line-through text-muted-foreground" : ""
                              }`}
                            >
                              {task.title}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {task.estimatedTime}
                              </Badge>
                              <Badge
                                variant={
                                  task.priority === "High"
                                    ? "destructive"
                                    : task.priority === "Medium"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {task.priority}
                              </Badge>
                              {task.dependencies.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  Depends on: {task.dependencies.join(", ")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Export your task breakdown to popular project management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Trello</h4>
                  <p className="text-sm text-muted-foreground">Export as JSON for Trello board import</p>
                </div>
                <Button variant="outline" onClick={exportToTrello}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notion</h4>
                  <p className="text-sm text-muted-foreground">Export as CSV for Notion database import</p>
                </div>
                <Button variant="outline" onClick={exportToNotion}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
