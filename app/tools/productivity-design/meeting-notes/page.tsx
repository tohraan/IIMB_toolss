"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, StickyNote, RotateCcw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MeetingNotesPage() {
  const [step, setStep] = useState(1)
  const [transcript, setTranscript] = useState("")
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const summarizeNotes = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Error",
        description: "Please paste meeting transcript",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI summarization
    setTimeout(() => {
      const mockSummary = {
        meetingTitle: "Q4 Marketing Strategy Review",
        date: new Date().toLocaleDateString(),
        duration: "45 minutes",
        attendees: [
          "Sarah Chen (Marketing Director)",
          "Mike Johnson (Product Manager)",
          "Lisa Wang (Designer)",
          "Alex Rodriguez (Developer)",
        ],
        keyTopics: [
          "Q4 campaign performance review",
          "New product launch timeline",
          "Budget allocation for 2024",
          "Team restructuring discussion",
          "Marketing automation implementation",
        ],
        summary: `The team reviewed Q4 marketing performance, showing a 23% increase in lead generation compared to Q3. The new product launch is scheduled for February 2024, with marketing campaigns beginning in January. Budget discussions focused on increasing digital advertising spend by 40% and investing in marketing automation tools. Team restructuring will add two new specialists to handle increased workload.`,
        actionItems: [
          {
            task: "Finalize Q4 campaign performance report",
            assignee: "Sarah Chen",
            dueDate: "December 15, 2024",
            priority: "High",
          },
          {
            task: "Create product launch marketing timeline",
            assignee: "Mike Johnson",
            dueDate: "December 20, 2024",
            priority: "High",
          },
          {
            task: "Research marketing automation platforms",
            assignee: "Lisa Wang",
            dueDate: "January 5, 2025",
            priority: "Medium",
          },
          {
            task: "Prepare 2024 budget proposal presentation",
            assignee: "Sarah Chen",
            dueDate: "December 18, 2024",
            priority: "High",
          },
          {
            task: "Draft job descriptions for new team members",
            assignee: "Sarah Chen",
            dueDate: "January 10, 2025",
            priority: "Medium",
          },
        ],
        decisions: [
          "Approved 40% increase in digital advertising budget for 2024",
          "Product launch date confirmed for February 15, 2024",
          "Marketing automation implementation approved for Q1 2024",
          "Two new marketing specialists to be hired by end of January",
        ],
        nextSteps: [
          "Schedule follow-up meeting for December 22 to review action item progress",
          "Send meeting summary to all stakeholders by end of week",
          "Begin recruitment process for new team members",
        ],
      }

      setSummary(mockSummary)
      setLoading(false)
      toast({
        title: "Meeting summarized",
        description: "Action items and summary generated successfully",
      })
    }, 3000)
  }

  const copySummary = () => {
    if (!summary) return

    const text = `MEETING SUMMARY: ${summary.meetingTitle}
Date: ${summary.date}
Duration: ${summary.duration}
Attendees: ${summary.attendees.join(", ")}

SUMMARY:
${summary.summary}

KEY TOPICS:
${summary.keyTopics.map((topic: string, i: number) => `${i + 1}. ${topic}`).join("\n")}

ACTION ITEMS:
${summary.actionItems.map((item: any, i: number) => `${i + 1}. ${item.task} (${item.assignee} - Due: ${item.dueDate}) [${item.priority}]`).join("\n")}

DECISIONS MADE:
${summary.decisions.map((decision: string, i: number) => `${i + 1}. ${decision}`).join("\n")}

NEXT STEPS:
${summary.nextSteps.map((step: string, i: number) => `${i + 1}. ${step}`).join("\n")}`

    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Meeting summary copied to clipboard",
    })
  }

  const exportSummary = () => {
    if (!summary) return

    const content = `MEETING SUMMARY: ${summary.meetingTitle}
Date: ${summary.date}
Duration: ${summary.duration}
Attendees: ${summary.attendees.join(", ")}

SUMMARY:
${summary.summary}

KEY TOPICS:
${summary.keyTopics.map((topic: string, i: number) => `${i + 1}. ${topic}`).join("\n")}

ACTION ITEMS:
${summary.actionItems.map((item: any, i: number) => `${i + 1}. ${item.task} (${item.assignee} - Due: ${item.dueDate}) [${item.priority}]`).join("\n")}

DECISIONS MADE:
${summary.decisions.map((decision: string, i: number) => `${i + 1}. ${decision}`).join("\n")}

NEXT STEPS:
${summary.nextSteps.map((step: string, i: number) => `${i + 1}. ${step}`).join("\n")}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "meeting-summary.txt"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Exported",
      description: "Meeting summary downloaded",
    })
  }

  const reset = () => {
    setStep(1)
    setTranscript("")
    setSummary(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meeting Notes Summarizer</h1>
        <p className="text-muted-foreground">Transform meeting transcripts into action items and summaries</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Transcript</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Summary</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Paste Meeting Transcript</CardTitle>
            <CardDescription>Copy and paste your meeting transcript or notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transcript">Meeting Transcript</Label>
              <Textarea
                id="transcript"
                placeholder="Paste your meeting transcript here... Include speaker names, discussion points, decisions made, and any action items mentioned."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
            <Button onClick={summarizeNotes} disabled={loading || !transcript.trim()}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing transcript...
                </>
              ) : (
                <>
                  <StickyNote className="mr-2 h-4 w-4" />
                  Summarize Meeting
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && summary && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Meeting Summary</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportSummary}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" onClick={copySummary}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Summary
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Meeting
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Title:</strong> {summary.meetingTitle}
                </div>
                <div>
                  <strong>Date:</strong> {summary.date}
                </div>
                <div>
                  <strong>Duration:</strong> {summary.duration}
                </div>
                <div>
                  <strong>Attendees:</strong>
                  <ul className="mt-1 space-y-1">
                    {summary.attendees.map((attendee: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {attendee}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Topics Discussed</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.keyTopics.map((topic: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Meeting Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{summary.summary}</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>Tasks assigned during the meeting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summary.actionItems.map((item: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.task}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>Assigned to: {item.assignee}</span>
                            <span>Due: {item.dueDate}</span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            item.priority === "High"
                              ? "destructive"
                              : item.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {item.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Decisions Made</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.decisions.map((decision: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {decision}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {summary.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500">→</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
