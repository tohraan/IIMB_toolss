"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lightbulb, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BusinessIdeaValidatorPage() {
  const [step, setStep] = useState(1)
  const [businessIdea, setBusinessIdea] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [marketSize, setMarketSize] = useState("")
  const [validationResults, setValidationResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const validateIdea = async () => {
    if (!businessIdea.trim() || !targetAudience.trim() || !marketSize.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields to validate your idea.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI business idea validation
    setTimeout(() => {
      const mockResults = {
        viability: {
          score: 85,
          status: "Highly Viable",
          summary: "This idea shows strong potential with a clear target audience and substantial market size. The core value proposition is compelling."
        },
        strengths: [
          "Clear problem-solution fit for the target audience.",
          "Demonstrates potential for strong customer acquisition.",
          "Scalable business model with diversified revenue streams."
        ],
        weaknesses: [
          "High initial capital investment may be required.",
          "Intense competition in the identified market segment.",
          "Dependency on specific technologies or partnerships."
        ],
        opportunities: [
          "Untapped niche markets within the broader segment.",
          "Potential for strategic partnerships and collaborations.",
          "Expansion into related product/service offerings."
        ],
        threats: [
          "Rapid technological changes could make the solution obsolete.",
          "New market entrants with disruptive innovations.",
          "Economic downturns impacting consumer spending."
        ],
        recommendations: [
          "Conduct thorough market research to refine target segments.",
          "Develop a detailed financial model and funding strategy.",
          "Focus on a unique selling proposition to differentiate from competitors."
        ]
      }
      setValidationResults(mockResults)
      setLoading(false)
      setStep(3)
    }, 3000)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold">Business Idea Validator</h1>
            <p className="text-muted-foreground text-body">Analyze and validate your business ideas with AI-driven insights.</p>
          </div>
        </div>

        <div className="grid gap-8">
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Your Business Idea
                  </CardTitle>
                  <CardDescription className="text-body">Provide details about your business concept for validation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-idea" className="text-body">Business Idea</Label>
                    <Textarea
                      id="business-idea"
                      placeholder="e.g., A subscription box service for sustainable pet products."
                      value={businessIdea}
                      onChange={(e) => setBusinessIdea(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-audience" className="text-body">Target Audience</Label>
                    <Input
                      id="target-audience"
                      placeholder="e.g., Environmentally-conscious pet owners in urban areas."
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="market-size" className="text-body">Estimated Market Size</Label>
                    <Input
                      id="market-size"
                      placeholder="e.g., $50 Billion (global annual spend)"
                      value={marketSize}
                      onChange={(e) => setMarketSize(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={validateIdea} className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating Idea...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Validate Idea
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 2 && (
            <Card className="flex h-[350px] items-center justify-center">
              <CardContent className="text-center space-y-4">
                <div className="h-16 w-16 animate-spin border-4 border-primary border-t-transparent mx-auto" />
                <h3 className="text-h3 font-semibold">Validating Business Idea</h3>
                <p className="text-muted-foreground text-body">AI is analyzing your idea for viability and potential...</p>
              </CardContent>
            </Card>
          )}

          {step === 3 && validationResults && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Idea Viability Assessment
                  </CardTitle>
                  <CardDescription className="text-body">Overall assessment of your business idea's potential.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-h1 font-bold mb-2 ${validationResults.viability.score > 70 ? "text-green-500" : validationResults.viability.score > 40 ? "text-yellow-500" : "text-destructive"}`}>
                      {validationResults.viability.status}
                    </div>
                    <div className="text-muted-foreground text-body">
                      Viability Score: {validationResults.viability.score}%
                    </div>
                  </div>
                  <p className="text-muted-foreground text-body leading-relaxed">
                    {validationResults.viability.summary}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Strengths</CardTitle>
                    <CardDescription className="text-body">Key advantages and positive aspects of your idea.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {validationResults.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 border p-3 text-body text-muted-foreground">
                          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Weaknesses</CardTitle>
                    <CardDescription className="text-body">Potential drawbacks and areas for improvement.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {validationResults.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 border p-3 text-body text-muted-foreground">
                          <XCircle className="h-5 w-5 flex-shrink-0 text-destructive mt-0.5" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Opportunities</CardTitle>
                    <CardDescription className="text-body">Favorable external factors that could benefit your idea.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {validationResults.opportunities.map((opportunity: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 border p-3 text-body text-muted-foreground">
                          <Lightbulb className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Threats</CardTitle>
                    <CardDescription className="text-body">Unfavorable external factors that could challenge your idea.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {validationResults.threats.map((threat: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 border p-3 text-body text-muted-foreground">
                          <XCircle className="h-5 w-5 flex-shrink-0 text-destructive mt-0.5" />
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-h3">Recommendations</CardTitle>
                  <CardDescription className="text-body">Actionable steps to enhance your business idea.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {validationResults.recommendations.map((recommendation: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 border p-3 text-body text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button
                onClick={() => {
                  setStep(1)
                  setValidationResults(null)
                  setBusinessIdea("")
                  setTargetAudience("")
                  setMarketSize("")
                }}
                variant="outline"
                className="w-full"
              >
                Validate New Idea
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
