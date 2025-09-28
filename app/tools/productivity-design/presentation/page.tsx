"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Presentation, RotateCcw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PresentationPage() {
  const [step, setStep] = useState(1)
  const [topic, setTopic] = useState("")
  const [audience, setAudience] = useState("")
  const [duration, setDuration] = useState("")
  const [objective, setObjective] = useState("")
  const [presentation, setPresentation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generatePresentation = async () => {
    if (!topic || !audience || !duration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI presentation generation
    setTimeout(() => {
      const mockPresentation = {
        title: `${topic}: A Comprehensive Overview`,
        subtitle: `Presentation for ${audience}`,
        estimatedDuration: duration,
        totalSlides: duration === "5-10 minutes" ? 8 : duration === "15-20 minutes" ? 12 : 18,
        slides: [
          {
            slideNumber: 1,
            type: "Title Slide",
            title: topic,
            content: [
              `Subtitle: ${objective || "Key Insights and Strategies"}`,
              `Presenter: [Your Name]`,
              `Date: ${new Date().toLocaleDateString()}`,
              `Audience: ${audience}`,
            ],
          },
          {
            slideNumber: 2,
            type: "Agenda",
            title: "Today's Agenda",
            content: [
              "Introduction and Context",
              `Understanding ${topic}`,
              "Key Benefits and Opportunities",
              "Implementation Strategy",
              "Case Studies and Examples",
              "Next Steps and Action Items",
              "Q&A Session",
            ],
          },
          {
            slideNumber: 3,
            type: "Introduction",
            title: `Why ${topic} Matters`,
            content: [
              `Current market trends show increasing importance of ${topic.toLowerCase()}`,
              `Organizations implementing ${topic.toLowerCase()} see 40% improvement in efficiency`,
              "Industry leaders are already adopting these strategies",
              `This presentation will show you how to leverage ${topic.toLowerCase()} effectively`,
            ],
          },
          {
            slideNumber: 4,
            type: "Problem Statement",
            title: "The Challenge We Face",
            content: [
              `Traditional approaches to ${topic.toLowerCase()} are becoming outdated`,
              "Increasing competition requires innovative solutions",
              "Customer expectations are evolving rapidly",
              "Need for scalable and sustainable strategies",
            ],
          },
          {
            slideNumber: 5,
            type: "Solution Overview",
            title: `${topic}: The Solution`,
            content: [
              `Comprehensive approach to ${topic.toLowerCase()}`,
              "Proven methodology with measurable results",
              "Scalable framework for organizations of all sizes",
              "Integration with existing systems and processes",
            ],
          },
          {
            slideNumber: 6,
            type: "Benefits",
            title: "Key Benefits",
            content: [
              "Increased efficiency and productivity",
              "Reduced costs and improved ROI",
              "Enhanced customer satisfaction",
              "Competitive advantage in the market",
              "Future-proof strategy for long-term success",
            ],
          },
          {
            slideNumber: 7,
            type: "Implementation",
            title: "Implementation Roadmap",
            content: [
              "Phase 1: Assessment and Planning (2-4 weeks)",
              "Phase 2: Pilot Program Launch (4-6 weeks)",
              "Phase 3: Full Rollout (8-12 weeks)",
              "Phase 4: Optimization and Scaling (Ongoing)",
            ],
          },
          {
            slideNumber: 8,
            type: "Call to Action",
            title: "Next Steps",
            content: [
              "Schedule follow-up meeting to discuss implementation",
              "Identify key stakeholders and team members",
              "Allocate necessary resources and budget",
              "Set timeline and milestones for project launch",
            ],
          },
        ],
        speakerNotes: {
          general: [
            "Maintain eye contact with audience throughout presentation",
            "Use confident body language and gestures",
            "Pause for questions after each major section",
            "Have backup slides ready for detailed questions",
          ],
          timing: [
            "Spend 2-3 minutes on introduction and agenda",
            "Allow 5-7 minutes for problem and solution overview",
            "Dedicate most time to benefits and implementation",
            "Reserve 3-5 minutes for Q&A at the end",
          ],
        },
      }

      setPresentation(mockPresentation)
      setLoading(false)
      toast({
        title: "Presentation generated",
        description: `${mockPresentation.totalSlides} slides created successfully`,
      })
    }, 3000)
  }

  const copyPresentation = () => {
    if (!presentation) return

    const text = `${presentation.title}
${presentation.subtitle}
Duration: ${presentation.estimatedDuration}
Total Slides: ${presentation.totalSlides}

SLIDES:
${presentation.slides
  .map(
    (slide: any) => `
Slide ${slide.slideNumber}: ${slide.title} (${slide.type})
${slide.content.map((point: string) => `• ${point}`).join("\n")}
`,
  )
  .join("\n")}

SPEAKER NOTES:
General Tips:
${presentation.speakerNotes.general.map((note: string) => `• ${note}`).join("\n")}

Timing Guidelines:
${presentation.speakerNotes.timing.map((note: string) => `• ${note}`).join("\n")}`

    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Presentation outline copied to clipboard",
    })
  }

  const exportPresentation = () => {
    if (!presentation) return

    const content = `${presentation.title}
${presentation.subtitle}
Duration: ${presentation.estimatedDuration}
Total Slides: ${presentation.totalSlides}

SLIDES:
${presentation.slides
  .map(
    (slide: any) => `
Slide ${slide.slideNumber}: ${slide.title} (${slide.type})
${slide.content.map((point: string) => `• ${point}`).join("\n")}
`,
  )
  .join("\n")}

SPEAKER NOTES:
General Tips:
${presentation.speakerNotes.general.map((note: string) => `• ${note}`).join("\n")}

Timing Guidelines:
${presentation.speakerNotes.timing.map((note: string) => `• ${note}`).join("\n")}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "presentation-outline.txt"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Exported",
      description: "Presentation outline downloaded",
    })
  }

  const reset = () => {
    setStep(1)
    setTopic("")
    setAudience("")
    setDuration("")
    setObjective("")
    setPresentation(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Presentation Draft Maker</h1>
        <p className="text-muted-foreground">Generate slide headlines and bullet points for your presentations</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Setup</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Presentation</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Presentation Setup</CardTitle>
            <CardDescription>Define your presentation topic and audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Presentation Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Digital Marketing Strategy, Project Management, AI in Business"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Executive team, Marketing professionals, Students"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Presentation Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-10 minutes">5-10 minutes</SelectItem>
                  <SelectItem value="15-20 minutes">15-20 minutes</SelectItem>
                  <SelectItem value="30-45 minutes">30-45 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="objective">Objective (Optional)</Label>
              <Textarea
                id="objective"
                placeholder="e.g., Convince stakeholders to invest in new technology, Educate team on best practices"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={generatePresentation} disabled={loading || !topic || !audience || !duration}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Generating presentation...
                </>
              ) : (
                <>
                  <Presentation className="mr-2 h-4 w-4" />
                  Generate Presentation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && presentation && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{presentation.title}</h2>
              <p className="text-muted-foreground">{presentation.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportPresentation}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" onClick={copyPresentation}>
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Presentation
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Presentation Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Duration:</strong> {presentation.estimatedDuration}
                </div>
                <div>
                  <strong>Total Slides:</strong> {presentation.totalSlides}
                </div>
                <div>
                  <strong>Audience:</strong> {audience}
                </div>
                {objective && (
                  <div>
                    <strong>Objective:</strong> {objective}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              {presentation.slides.map((slide: any) => (
                <Card key={slide.slideNumber}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      Slide {slide.slideNumber}: {slide.title}
                      <Badge variant="outline">{slide.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {slide.content.map((point: string, index: number) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>General Speaking Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {presentation.speakerNotes.general.map((note: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500">💡</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timing Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {presentation.speakerNotes.timing.map((note: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-500">⏱️</span>
                      {note}
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
