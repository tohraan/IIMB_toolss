"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building, BarChart2, TrendingUp, DollarSign, Users, ShieldCheck, Star, Loader2, XCircle, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CompetitorSnapshotPage() {
  const [step, setStep] = useState(1)
  const [companyName, setCompanyName] = useState("")
  const [competitorNames, setCompetitorNames] = useState("")
  const [industry, setIndustry] = useState("")
  const [snapshotResults, setSnapshotResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateSnapshot = async () => {
    if (!companyName.trim() || !competitorNames.trim() || !industry.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields to generate the snapshot.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI competitor snapshot generation
    setTimeout(() => {
      const mockResults = {
        yourCompany: {
          name: companyName,
          industry: industry,
          description: "A leading provider of innovative AI solutions for business analytics.",
        },
        competitors: [
          {
            name: "InnovateAI",
            overview: "Specializes in AI-driven data visualization and predictive modeling.",
            strengths: ["Strong market presence", "Advanced proprietary algorithms"],
            weaknesses: ["Higher pricing", "Limited customization options"],
            strategy: "Focuses on enterprise clients with large datasets.",
            marketShare: "30%",
            sentiment: "Positive",
          },
          {
            name: "DataSynth",
            overview: "Offers a comprehensive platform for synthetic data generation and AI training.",
            strengths: ["Innovative technology", "Strong R&D focus"],
            weaknesses: ["Niche market", "Brand recognition still growing"],
            strategy: "Targets startups and research institutions.",
            marketShare: "15%",
            sentiment: "Neutral",
          },
          {
            name: "AnalyticsFlow",
            overview: "Provides scalable analytics tools for real-time business intelligence.",
            strengths: ["User-friendly interface", "Competitive pricing"],
            weaknesses: ["Less advanced AI features", "Slower integration with legacy systems"],
            strategy: "Aims for small to medium-sized businesses.",
            marketShare: "25%",
            sentiment: "Mixed",
          },
        ],
        marketTrends: [
          "Growing demand for explainable AI.",
          "Increased adoption of AI in cloud environments.",
          "Focus on ethical AI and data privacy.",
        ],
        strategicInsights: [
          "Opportunities to differentiate through niche market specialization.",
          "Importance of continuous innovation to stay ahead of competitors.",
          "Leverage strong customer service to build loyalty.",
        ],
      }
      setSnapshotResults(mockResults)
      setLoading(false)
      setStep(3)
    }, 3000)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold">Competitor Snapshot</h1>
            <p className="text-muted-foreground text-body">Generate a concise overview of your competitive landscape with AI insights.</p>
          </div>
        </div>

        <div className="grid gap-8">
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Company & Competitor Details
                  </CardTitle>
                  <CardDescription className="text-body">Provide information about your company and key competitors.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-body">Your Company Name</Label>
                    <Input
                      id="company-name"
                      placeholder="e.g., Triaxon AI"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="competitor-names" className="text-body">Competitor Names (comma-separated)</Label>
                    <Input
                      id="competitor-names"
                      placeholder="e.g., InnovateAI, DataSynth, AnalyticsFlow"
                      value={competitorNames}
                      onChange={(e) => setCompetitorNames(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-body">Industry</Label>
                    <Input
                      id="industry"
                      placeholder="e.g., AI Business Intelligence"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={generateSnapshot} className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Snapshot...
                  </>
                ) : (
                  <>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Generate Competitor Snapshot
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 2 && (
            <Card className="flex h-[350px] items-center justify-center">
              <CardContent className="text-center space-y-4">
                <div className="h-16 w-16 animate-spin border-4 border-primary border-t-transparent mx-auto" />
                <h3 className="text-h3 font-semibold">Analyzing Competitors</h3>
                <p className="text-muted-foreground text-body">AI is gathering information and generating your competitive snapshot...</p>
              </CardContent>
            </Card>
          )}

          {step === 3 && snapshotResults && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Your Company Overview
                  </CardTitle>
                  <CardDescription className="text-body">Details about your company and its position.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-body">Company Name:</span>
                    <span className="font-medium text-body">{snapshotResults.yourCompany.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-body">Industry:</span>
                    <span className="font-medium text-body">{snapshotResults.yourCompany.industry}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-body font-medium">Description:</p>
                    <p className="text-muted-foreground text-body">{snapshotResults.yourCompany.description}</p>
                  </div>
                </CardContent>
              </Card>

              {snapshotResults.competitors.map((competitor: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-h3">{competitor.name}</span>
                    </CardTitle>
                    <CardDescription className="text-body">{competitor.overview}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-body font-medium mb-2">Strengths:</h3>
                      <ul className="space-y-1">
                        {competitor.strengths.map((strength: string, sIndex: number) => (
                          <li key={sIndex} className="flex items-start gap-2 text-body text-muted-foreground">
                            <ShieldCheck className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-body font-medium mb-2">Weaknesses:</h3>
                      <ul className="space-y-1">
                        {competitor.weaknesses.map((weakness: string, wIndex: number) => (
                          <li key={wIndex} className="flex items-start gap-2 text-body text-muted-foreground">
                            <XCircle className="h-5 w-5 flex-shrink-0 text-destructive mt-0.5" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-body font-medium">Strategy:</h3>
                      <p className="text-muted-foreground text-body">{competitor.strategy}</p>
                    </div>
                    <div className="flex justify-between items-center text-body text-muted-foreground">
                      <span>Market Share: <span className="font-medium text-primary">{competitor.marketShare}</span></span>
                      <span>Sentiment: <span className="font-medium text-primary">{competitor.sentiment}</span></span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Market Trends
                  </CardTitle>
                  <CardDescription className="text-body">Key trends influencing your industry and competitive landscape.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {snapshotResults.marketTrends.map((trend: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 border p-3 text-body text-muted-foreground">
                        <Star className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                        {trend}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Strategic Insights
                  </CardTitle>
                  <CardDescription className="text-body">Actionable insights derived from the competitive analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {snapshotResults.strategicInsights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 border p-3 text-body text-muted-foreground">
                        <ShieldCheck className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button
                onClick={() => {
                  setStep(1)
                  setSnapshotResults(null)
                  setCompanyName("")
                  setCompetitorNames("")
                  setIndustry("")
                }}
                variant="outline"
                className="w-full"
              >
                Generate New Snapshot
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
