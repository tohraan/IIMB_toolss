"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Users, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PersonaBuilderPage() {
  const [step, setStep] = useState(1)
  const [productService, setProductService] = useState("")
  const [industry, setIndustry] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [persona, setPersona] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generatePersona = async () => {
    if (!productService) {
      toast({
        title: "Error",
        description: "Please describe your product or service",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI persona generation
    setTimeout(() => {
      const mockPersona = {
        name: "Sarah Chen",
        age: "32-38",
        title: "Marketing Director",
        company: "Mid-size SaaS Company (50-200 employees)",
        demographics: {
          location: "Urban areas (San Francisco, Austin, Seattle)",
          income: "$85,000 - $120,000",
          education: "Bachelor's in Marketing/Business, MBA preferred",
          familyStatus: "Married, 1-2 children",
        },
        psychographics: {
          values: ["Efficiency", "Innovation", "Work-life balance", "Professional growth"],
          interests: ["Digital marketing trends", "Productivity tools", "Industry conferences", "Networking"],
          personality: "Analytical, goal-oriented, collaborative, tech-savvy",
        },
        painPoints: [
          "Struggling to prove ROI on marketing campaigns",
          "Too many disconnected tools and platforms",
          "Limited time to learn new technologies",
          "Pressure to generate more leads with same budget",
          "Difficulty scaling marketing efforts as company grows",
        ],
        goals: [
          "Increase marketing qualified leads by 40%",
          "Streamline marketing operations and workflows",
          "Improve campaign attribution and reporting",
          "Stay ahead of marketing technology trends",
          "Build a more efficient marketing team",
        ],
        behaviors: {
          mediaConsumption: ["LinkedIn", "Marketing blogs", "Industry podcasts", "Webinars"],
          shoppingHabits: "Researches thoroughly, reads reviews, prefers free trials",
          decisionMaking: "Data-driven, seeks peer recommendations, involves team in decisions",
        },
        preferredChannels: ["LinkedIn", "Email", "Industry publications", "Conferences", "Peer referrals"],
        messaging: {
          keyMessages: [
            "Save 10+ hours per week on marketing operations",
            "Proven to increase lead quality by 60%",
            "Trusted by 500+ marketing teams",
          ],
          toneOfVoice: "Professional, data-driven, solution-focused",
          avoidWords: ["Cheap", "Basic", "Simple", "One-size-fits-all"],
        },
      }

      setPersona(mockPersona)
      setLoading(false)
      toast({
        title: "Persona generated",
        description: "Detailed customer profile created successfully",
      })
    }, 3000)
  }

  const copyPersona = () => {
    if (!persona) return

    const text = `Customer Persona: ${persona.name}

DEMOGRAPHICS
Age: ${persona.age}
Title: ${persona.title}
Company: ${persona.company}
Location: ${persona.demographics.location}
Income: ${persona.demographics.income}
Education: ${persona.demographics.education}

PAIN POINTS
${persona.painPoints.map((point: string, i: number) => `${i + 1}. ${point}`).join("\n")}

GOALS
${persona.goals.map((goal: string, i: number) => `${i + 1}. ${goal}`).join("\n")}

KEY MESSAGING
${persona.messaging.keyMessages.map((msg: string, i: number) => `${i + 1}. ${msg}`).join("\n")}

PREFERRED CHANNELS
${persona.preferredChannels.join(", ")}`

    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Persona profile copied to clipboard",
    })
  }

  const reset = () => {
    setStep(1)
    setProductService("")
    setIndustry("")
    setAdditionalInfo("")
    setPersona(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Persona Builder</h1>
        <p className="text-muted-foreground">Generate detailed target customer profiles with pain points and habits</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Product Info</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Customer Persona</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Product/Service Information</CardTitle>
            <CardDescription>Describe what you're selling to generate an accurate persona</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product/Service Description</Label>
              <Textarea
                id="product"
                placeholder="e.g., Marketing automation platform for B2B SaaS companies that helps streamline lead nurturing and campaign management"
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry/Market (Optional)</Label>
              <Input
                id="industry"
                placeholder="e.g., SaaS, E-commerce, Healthcare, Finance"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional">Additional Context (Optional)</Label>
              <Textarea
                id="additional"
                placeholder="Any specific requirements, target company size, geographic focus, etc."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={generatePersona} disabled={loading || !productService}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Persona...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Generate Customer Persona
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && persona && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Customer Persona: {persona.name}</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyPersona}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Persona
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Persona
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Age:</strong> {persona.age}
                </div>
                <div>
                  <strong>Title:</strong> {persona.title}
                </div>
                <div>
                  <strong>Company:</strong> {persona.company}
                </div>
                <div>
                  <strong>Location:</strong> {persona.demographics.location}
                </div>
                <div>
                  <strong>Income:</strong> {persona.demographics.income}
                </div>
                <div>
                  <strong>Education:</strong> {persona.demographics.education}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Psychographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Values:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {persona.psychographics.values.map((value: string) => (
                      <Badge key={value} variant="secondary">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Interests:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {persona.psychographics.interests.map((interest: string) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Personality:</strong> {persona.psychographics.personality}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pain Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {persona.painPoints.map((point: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {persona.goals.map((goal: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferred Channels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {persona.preferredChannels.map((channel: string) => (
                    <Badge key={channel} variant="default">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Messaging</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Key Messages:</strong>
                  <ul className="mt-1 space-y-1">
                    {persona.messaging.keyMessages.map((msg: string, index: number) => (
                      <li key={index} className="text-sm">
                        • {msg}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Tone:</strong> {persona.messaging.toneOfVoice}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
