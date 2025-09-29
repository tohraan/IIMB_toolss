"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, FileText, Search, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ResearchSummarizerPage() {
  const [step, setStep] = useState(1)
  const [researchText, setResearchText] = useState("")
  const [summaryLength, setSummaryLength] = useState<"short" | "medium" | "detailed">("medium")
  const [focusArea, setFocusArea] = useState<string[]>(["mainSummary", "keyFindings", "methodology"])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateSummary = async () => {
    if (!researchText.trim()) {
      toast({
        title: "Error",
        description: "Please provide research text to summarize",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI research summarization
    setTimeout(() => {
      const mockSummary = {
        mainSummary: `This research explores the impact of artificial intelligence on modern healthcare systems. The study analyzes data from 50 hospitals over a 2-year period, examining AI implementation in diagnostic procedures, patient care optimization, and administrative efficiency. Key findings indicate a 35% improvement in diagnostic accuracy when AI-assisted tools are used, particularly in radiology and pathology departments. The research also highlights significant cost reductions of approximately 20% in operational expenses due to automated administrative processes. The study identifies three critical success factors for AI adoption in healthcare: staff training programs, robust data infrastructure, and regulatory compliance frameworks. Challenges include initial implementation costs, data privacy concerns, and resistance to change among healthcare professionals. The research concludes that while AI presents substantial opportunities for healthcare improvement, successful implementation requires strategic planning and comprehensive change management approaches.`,

        keyFindings: [
          "35% improvement in diagnostic accuracy with AI-assisted tools",
          "20% reduction in operational expenses through automation",
          "Radiology and pathology departments show highest AI adoption rates",
          "Staff training is critical for successful AI implementation",
          "Data privacy remains a primary concern for healthcare institutions",
        ],

        methodology:
          "Mixed-methods approach combining quantitative analysis of hospital performance metrics with qualitative interviews of healthcare professionals across 50 institutions over 24 months.",

        implications: [
          "Healthcare institutions should prioritize AI training programs",
          "Investment in data infrastructure is essential for AI success",
          "Regulatory frameworks need updating to accommodate AI technologies",
          "Change management strategies are crucial for staff adoption",
        ],

        limitations: [
          "Study limited to hospitals in urban areas",
          "Sample size may not represent all healthcare settings",
          "Long-term effects beyond 2 years not assessed",
        ],

        futureResearch: [
          "Longitudinal studies on patient outcomes",
          "AI implementation in rural healthcare settings",
          "Cost-benefit analysis of different AI technologies",
          "Patient satisfaction metrics with AI-assisted care",
        ],

        wordCount: {
          original: 2847,
          summary: 156,
          reduction: "94.5%",
        },
      }

      setSummary(mockSummary)
      setLoading(false)
      setStep(3)
    }, 3000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Summary copied to clipboard",
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Research Summarizer</h1>
            <p className="text-muted-foreground">Generate comprehensive summaries of research papers and academic content.</p>
          </div>
        </div>

        <div className="grid gap-8">
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Research Content
                  </CardTitle>
                  <CardDescription>Paste your research paper, article, or academic content below.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste your research content here..."
                    value={researchText}
                    onChange={(e) => setResearchText(e.target.value)}
                    className="min-h-[300px]"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Summary Configuration
                  </CardTitle>
                  <CardDescription>Choose summary length and focus areas.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Summary Length</h3>
                    <Select value={summaryLength} onValueChange={(value: "short" | "medium" | "detailed") => setSummaryLength(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (5-10 sentences)</SelectItem>
                        <SelectItem value="medium">Medium (10-20 sentences)</SelectItem>
                        <SelectItem value="detailed">Detailed (20+ sentences)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Focus Areas</h3>
                    <Select value={focusArea.join(",")} onValueChange={(value) => setFocusArea(value.split(","))} multiple>
                      <SelectTrigger>
                        <SelectValue placeholder="Select focus areas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mainSummary">Main Summary</SelectItem>
                        <SelectItem value="keyFindings">Key Findings</SelectItem>
                        <SelectItem value="methodology">Methodology</SelectItem>
                        <SelectItem value="implications">Implications</SelectItem>
                        <SelectItem value="limitations">Limitations</SelectItem>
                        <SelectItem value="futureResearch">Future Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={generateSummary} className="w-full" size="lg" disabled={loading}>
                {loading ? "Generating Summary..." : "Generate Summary"}
              </Button>
            </div>
          )}

          {step === 2 && (
            <Card className="flex h-[300px] items-center justify-center">
              <CardContent className="text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Analyzing Research</h3>
                <p className="text-muted-foreground">AI is processing and summarizing your research content...</p>
              </CardContent>
            </Card>
          )}

          {step === 3 && summary && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Research Summary
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(summary.mainSummary)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex gap-2">
                    <Badge variant="secondary">
                      {summary.wordCount.original} → {summary.wordCount.summary} words
                    </Badge>
                    <Badge variant="secondary">
                      {summary.wordCount.reduction} reduction
                    </Badge>
                  </div>
                  <p className="leading-relaxed text-muted-foreground/80">{summary.mainSummary}</p>
                </CardContent>
              </Card>

              {focusArea.includes("keyFindings") && summary.keyFindings?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Findings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {summary.keyFindings.map((finding: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground/80">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {focusArea.includes("methodology") && summary.methodology && (
                <Card>
                  <CardHeader>
                    <CardTitle>Methodology</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground/80">{summary.methodology}</p>
                  </CardContent>
                </Card>
              )}

              {focusArea.includes("implications") && summary.implications?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Implications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {summary.implications.map((implication: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground/80 flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {implication}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {focusArea.includes("limitations") && summary.limitations?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Limitations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {summary.limitations.map((limitation: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground/80 flex items-start gap-2">
                          <span className="text-destructive">•</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {focusArea.includes("futureResearch") && summary.futureResearch?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Future Research</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {summary.futureResearch.map((research: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground/80 flex items-start gap-2">
                          <span className="text-secondary">•</span>
                          {research}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={() => {
                  setStep(1)
                  setSummary(null)
                  setResearchText("")
                  setFocusArea(["mainSummary", "keyFindings", "methodology"])
                }}
                variant="outline"
                className="w-full"
              >
                Summarize New Research
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
