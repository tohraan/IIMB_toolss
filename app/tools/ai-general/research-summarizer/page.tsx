"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, FileText, Search, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ResearchSummarizerPage() {
  const [step, setStep] = useState(1)
  const [researchText, setResearchText] = useState("")
  const [summaryLength, setSummaryLength] = useState("medium")
  const [focusArea, setFocusArea] = useState("")
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
        mainSummary: `This research explores the impact of artificial intelligence on modern healthcare systems. The study analyzes data from 50 hospitals over a 2-year period, examining AI implementation in diagnostic procedures, patient care optimization, and administrative efficiency. Key findings indicate a 35% improvement in diagnostic accuracy when AI-assisted tools are used, particularly in radiology and pathology departments. The research also highlights significant cost reductions of approximately 20% in operational expenses due to automated administrative processes.

The study identifies three critical success factors for AI adoption in healthcare: staff training programs, robust data infrastructure, and regulatory compliance frameworks. Challenges include initial implementation costs, data privacy concerns, and resistance to change among healthcare professionals. The research concludes that while AI presents substantial opportunities for healthcare improvement, successful implementation requires strategic planning and comprehensive change management approaches.`,

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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Research Summarizer</h1>
        <p className="text-gray-400">Generate comprehensive summaries of research papers and academic content</p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Research Content
              </CardTitle>
              <CardDescription>Paste your research paper, article, or academic content</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your research content here..."
                value={researchText}
                onChange={(e) => setResearchText(e.target.value)}
                className="min-h-[300px] bg-gray-800 border-gray-700 text-white"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Summary Length</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["short", "medium", "detailed"].map((length) => (
                    <Button
                      key={length}
                      variant={summaryLength === length ? "default" : "outline"}
                      onClick={() => setSummaryLength(length)}
                      className={
                        summaryLength === length
                          ? "w-full bg-blue-600 hover:bg-blue-700"
                          : "w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                      }
                    >
                      {length.charAt(0).toUpperCase() + length.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Focus Area (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., methodology, results, implications"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </CardContent>
            </Card>
          </div>

          <Button onClick={generateSummary} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            Generate Summary
          </Button>
        </div>
      )}

      {step === 2 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Research</h3>
            <p className="text-gray-400">AI is processing and summarizing your research content...</p>
          </CardContent>
        </Card>
      )}

      {step === 3 && summary && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Research Summary
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(summary.mainSummary)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {summary.wordCount.original} → {summary.wordCount.summary} words
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {summary.wordCount.reduction} reduction
                </Badge>
              </div>
              <p className="text-gray-300 leading-relaxed">{summary.mainSummary}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Key Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {summary.keyFindings.map((finding: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{finding}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">{summary.methodology}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Implications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {summary.implications.map((implication: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      {implication}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {summary.limitations.map((limitation: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      {limitation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Future Research</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {summary.futureResearch.map((research: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      {research}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={() => {
              setStep(1)
              setSummary(null)
              setResearchText("")
              setFocusArea("")
            }}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Summarize New Research
          </Button>
        </div>
      )}
    </div>
  )
}
