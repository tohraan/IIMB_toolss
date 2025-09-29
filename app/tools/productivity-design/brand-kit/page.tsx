"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Palette, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BrandKitStarterPage() {
  const [step, setStep] = useState(1)
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [brandValues, setBrandValues] = useState("")
  const [brandKit, setBrandKit] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateBrandKit = async () => {
    if (!companyName.trim() || !industry.trim() || !brandValues.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields to generate the brand kit.",
        variant: "destructive",
      })
      return
    }
    setLoading(true)
    setStep(2)
    setTimeout(() => {
      const mockBrandKit = {
        companyName: companyName,
        industry: industry,
        brandValues: brandValues,
        missionStatement: "To empower businesses with innovative AI solutions that drive growth and efficiency.",
        visionStatement: "To be the leading platform for AI tools, transforming how companies operate and create value.",
        tagline: "Innovate. Automate. Elevate.",
        coreColors: [
          { name: "Primary Blue", hex: "#3B82F6", rgb: "59, 130, 246" },
          { name: "Accent Green", hex: "#10B981", rgb: "16, 185, 129" },
          { name: "Neutral Gray", hex: "#6B7280", rgb: "107, 114, 128" },
        ],
        typography: {
          headingFont: "Inter Bold",
          bodyFont: "Inter Regular",
          sizes: {
            h1: "2.25rem",
            h2: "1.75rem",
            body: "1.05rem",
          },
        },
        voiceTone: "Professional, Innovative, Approachable",
        keyMessages: [
          "Transforming business with intelligent automation.",
          "Data-driven insights for smarter decisions.",
          "Scalable AI solutions for every industry.",
        ],
        logoConcepts: [
          "Minimalist, abstract AI brain icon",
          "Geometric shapes representing data flow",
          "Typographic logo with modern sans-serif font",
        ],
      }
      setBrandKit(mockBrandKit)
      setLoading(false)
      setStep(3)
    }, 3000)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold">Brand Kit Starter</h1>
            <p className="text-muted-foreground text-body">Generate a foundational brand kit with AI-driven suggestions for your business.</p>
          </div>
        </div>

        <div className="grid gap-8">
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Your Brand Details
                  </CardTitle>
                  <CardDescription className="text-body">Provide key information about your company to start building your brand kit.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-body">Company Name</Label>
                    <Input
                      id="company-name"
                      placeholder="e.g., InnovateAI Solutions"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-body">Industry</Label>
                    <Input
                      id="industry"
                      placeholder="e.g., Artificial Intelligence, Software Development"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand-values" className="text-body">Core Brand Values / Keywords</Label>
                    <Textarea
                      id="brand-values"
                      placeholder="e.g., Innovation, Reliability, Customer-centric, Modern, Efficient"
                      value={brandValues}
                      onChange={(e) => setBrandValues(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={generateBrandKit} className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Brand Kit...
                  </>
                ) : (
                  <>
                    <Palette className="mr-2 h-4 w-4" />
                    Generate Brand Kit
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 2 && (
            <Card className="flex h-[350px] items-center justify-center">
              <CardContent className="text-center space-y-4">
                <div className="h-16 w-16 animate-spin border-4 border-primary border-t-transparent mx-auto" />
                <h3 className="text-h3 font-semibold">Building Your Brand</h3>
                <p className="text-muted-foreground text-body">AI is curating elements for your unique brand identity...</p>
              </CardContent>
            </Card>
          )}

          {step === 3 && brandKit && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Brand Overview for {brandKit.companyName}
                  </CardTitle>
                  <CardDescription className="text-body">Your AI-generated brand foundation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-h3 font-medium">Mission Statement</h3>
                    <p className="text-muted-foreground text-body">{brandKit.missionStatement}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-h3 font-medium">Vision Statement</h3>
                    <p className="text-muted-foreground text-body">{brandKit.visionStatement}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-h3 font-medium">Tagline</h3>
                    <p className="text-muted-foreground text-body font-semibold">{brandKit.tagline}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-h3 font-medium">Core Brand Values</h3>
                    <p className="text-muted-foreground text-body">{brandKit.brandValues}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Core Colors</CardTitle>
                    <CardDescription className="text-body">Primary colors for your brand identity.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {brandKit.coreColors.map((color: any, index: number) => (
                        <div key={index} className="flex items-center justify-between border p-3">
                          <div className="flex items-center gap-3">
                            <div style={{ backgroundColor: color.hex }} className="h-6 w-6 border" />
                            <span className="text-body font-medium">{color.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {color.hex} / {color.rgb}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Typography</CardTitle>
                    <CardDescription className="text-body">Recommended fonts for headings and body text.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between border p-3">
                      <span className="text-body font-medium">Heading Font:</span>
                      <span className="text-body text-muted-foreground">{brandKit.typography.headingFont}</span>
                    </div>
                    <div className="flex items-center justify-between border p-3">
                      <span className="text-body font-medium">Body Font:</span>
                      <span className="text-body text-muted-foreground">{brandKit.typography.bodyFont}</span>
                    </div>
                    <div className="space-y-1 mt-4">
                      <h4 className="text-body font-medium mb-2">Font Sizes:</h4>
                      <div className="grid grid-cols-2 gap-2 text-body">
                        {Object.entries(brandKit.typography.sizes).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex justify-between border p-2">
                            <span className="text-muted-foreground">{key.toUpperCase()}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-h3">Voice & Tone</CardTitle>
                  <CardDescription className="text-body">Guidelines for your brand's communication style.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-body">{brandKit.voiceTone}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-h3">Key Messages</CardTitle>
                  <CardDescription className="text-body">Core messages to convey about your brand.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {brandKit.keyMessages.map((message: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 border p-3 text-body text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                        {message}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-h3">Logo Concepts</CardTitle>
                  <CardDescription className="text-body">Initial ideas for your brand's visual identity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {brandKit.logoConcepts.map((concept: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 border p-3 text-body text-muted-foreground">
                        <XCircle className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                        {concept}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button
                onClick={() => {
                  setStep(1)
                  setBrandKit(null)
                  setCompanyName("")
                  setIndustry("")
                  setBrandValues("")
                }}
                variant="outline"
                className="w-full"
              >
                Generate New Brand Kit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
