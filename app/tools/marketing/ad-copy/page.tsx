"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Copy, PenTool, RotateCcw, RefreshCw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdCopyPage() {
  const [step, setStep] = useState(1)
  const [product, setProduct] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [usps, setUsps] = useState("")
  const [keywords, setKeywords] = useState("")
  const [channel, setChannel] = useState("") // ad platform
  const [targetAudience, setTargetAudience] = useState("")
  const [objective, setObjective] = useState("")
  const [tone, setTone] = useState("professional")
  const [style, setStyle] = useState("punchy")
  const [ctaInput, setCtaInput] = useState("")
  const [headlineLimit, setHeadlineLimit] = useState<number | undefined>(undefined)
  const [bodyLimit, setBodyLimit] = useState<number | undefined>(undefined)
  const [language, setLanguage] = useState("en")

  const [adCopies, setAdCopies] = useState<any[]>([])
  const [ctaSuggestions, setCtaSuggestions] = useState<string[]>([])
  const [complianceAlerts, setComplianceAlerts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const platformDefaults: Record<string, { headline: number; body: number }> = {
    google: { headline: 30, body: 90 },
    facebook: { headline: 40, body: 125 },
    instagram: { headline: 40, body: 125 },
    linkedin: { headline: 70, body: 150 },
    twitter: { headline: 70, body: 280 },
  }

  const truncate = (text: string, limit?: number) => {
    if (!limit || limit <= 0) return text
    return text.length <= limit ? text : text.slice(0, Math.max(0, limit - 1)).trimEnd() + "…"
  }

  const computeCompliance = (variants: any[]) => {
    const alerts: string[] = []
    const limits = platformDefaults[channel]
    if (limits) {
      variants.forEach((v, idx) => {
        if (v.headline.length > (headlineLimit ?? limits.headline)) {
          alerts.push(`Variation ${idx + 1}: Headline exceeds ${headlineLimit ?? limits.headline} chars`)
        }
        if (v.body.length > (bodyLimit ?? limits.body)) {
          alerts.push(`Variation ${idx + 1}: Body exceeds ${bodyLimit ?? limits.body} chars`)
        }
      })
    }
    if (!ctaInput && ctaSuggestions.length === 0) {
      alerts.push("No CTA provided. Consider adding a strong CTA.")
    }
    if (!objective) {
      alerts.push("Campaign objective not set.")
    }
    return alerts
  }

  const exportCSV = () => {
    if (adCopies.length === 0) return
    const header = ["Variation","Headline","Body","CTA","Tone","Channel","Objective","Language"].join(",")
    const rows = adCopies.map((c: any, i: number) => [
      i + 1,
      '"' + c.headline.replaceAll('"','""') + '"',
      '"' + c.body.replaceAll('"','""') + '"',
      '"' + c.cta.replaceAll('"','""') + '"',
      c.tone,
      channel,
      objective,
      language.toUpperCase(),
    ].join(","))
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ad-copies-${channel || 'generic'}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "CSV Downloaded", description: "Ad copies exported as CSV" })
  }

  const exportPDF = async () => {
    if (adCopies.length === 0) return
    try {
      const jsPDF = (await import('jspdf')).default
      const pdf = new jsPDF('p','mm','a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let y = 15

      const addLine = () => { pdf.setLineWidth(0.2); pdf.line(10, y, pageWidth - 10, y); y += 6 }
      const addText = (t: string, size = 11, bold = false) => {
        pdf.setFont('helvetica', bold ? 'bold' : 'normal')
        pdf.setFontSize(size)
        const lines = pdf.splitTextToSize(t, pageWidth - 20)
        pdf.text(lines, 10, y)
        y += lines.length * (size * 0.4) + 4
        if (y > pageHeight - 20) { pdf.addPage(); y = 15 }
      }

      addText('Ad Copy Pack', 16, true)
      addText(`Channel: ${channel || 'N/A'} | Objective: ${objective || 'N/A'} | Language: ${language.toUpperCase()}`, 10)
      addText(`Product: ${product}`, 10)
      if (productDescription) addText(`Description: ${productDescription}`, 10)
      addLine()

      adCopies.forEach((c: any, i: number) => {
        addText(`Variation ${i + 1}`, 13, true)
        addText(`Headline: ${c.headline}`, 11)
        addText(`Body: ${c.body}`, 11)
        addText(`CTA: ${c.cta} | Tone: ${c.tone}`, 10)
        addLine()
      })

      if (ctaSuggestions.length) {
        addText('CTA Suggestions', 12, true)
        ctaSuggestions.forEach(cta => addText(`• ${cta}`, 10))
        addLine()
      }

      if (complianceAlerts.length) {
        addText('Platform Fit Alerts', 12, true)
        complianceAlerts.forEach(alert => addText(`• ${alert}`, 10))
        addLine()
      }

      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.text(`Page ${i} / ${totalPages}`, pageWidth - 28, pageHeight - 8)
        pdf.text('Ad Copy Generator Pro', 10, pageHeight - 8)
      }

      pdf.save(`ad-copies-${channel || 'generic'}.pdf`)
      toast({ title: "PDF Generated", description: "Ad copies exported as PDF" })
    } catch (e) {
      toast({ title: "PDF Error", description: "Failed to generate PDF", variant: "destructive" })
    }
  }

  const generateAdCopy = async () => {
    if (!product || !channel) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(3)

    const limits = platformDefaults[channel]
    const effHeadline = headlineLimit ?? limits?.headline
    const effBody = bodyLimit ?? limits?.body

    // Simulate AI ad copy generation
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const baseTone = tone === 'witty' ? 'Witty' : tone === 'urgent' ? 'Urgent' : tone === 'friendly' ? 'Friendly' : 'Professional'
    const objectiveHint = objective ? ` (${objective})` : ''
    const baseCTA = ctaInput || 'Start Your Free Trial'

    const bodyContext = `${productDescription || product} ${usps ? `| USPs: ${usps}` : ''} ${keywords ? `| Keywords: ${keywords}` : ''}`.trim()

    const variants = [
      {
        headline: truncate(`${product}: ${baseTone} Advantage${objectiveHint}` , effHeadline),
        body: truncate(`Discover ${product} — ${bodyContext}. Made for ${targetAudience || 'your audience'}.`, effBody),
        cta: baseCTA,
        tone: `${baseTone} & Punchy`,
      },
      {
        headline: truncate(`Boost Results with ${product}`, effHeadline),
        body: truncate(`Say goodbye to friction. ${product} helps you achieve more with less effort. ${keywords ? `Includes: ${keywords}` : ''}`, effBody),
        cta: baseCTA || 'Get Started Now',
        tone: `${baseTone} & Action-Oriented`,
      },
      {
        headline: truncate(`Why ${product}? See the Difference`, effHeadline),
        body: truncate(`${product} solves ${targetAudience ? `${targetAudience}'s` : 'your'} pain points. ${usps || 'Unique value that stands out.'}`, effBody),
        cta: baseCTA || 'Learn More',
        tone: `${baseTone} & Trust-Building`,
      },
    ]

    const suggestions = [
      baseCTA,
      'Learn More',
      'Shop Now',
      'Try Free',
      'Request Demo',
      'Get Offer',
    ]

    setAdCopies(variants)
    setCtaSuggestions(suggestions)
    const alerts = computeCompliance(variants)
    setComplianceAlerts(alerts)

    setLoading(false)
    toast({ title: "Ad copies generated", description: `${variants.length} variations created` })
  }

  const copyAdCopy = (adCopy: any) => {
    const text = `${adCopy.headline}\n\n${adCopy.body}\n\nCTA: ${adCopy.cta}`
    navigator.clipboard.writeText(text)
    toast({ title: "Copied", description: "Ad copy copied to clipboard" })
  }

  const regenerateVariation = (id: number) => {
    const newVariations = [
      "Unlock Your True Potential Today",
      "The Smart Choice for Modern Professionals",
      "Efficiency Meets Innovation",
      "Your Success Story Starts Here",
      "The Tool That Changes Everything",
    ]
    const randomHeadline = newVariations[Math.floor(Math.random() * newVariations.length)]
    setAdCopies((prev) => prev.map((copy, idx) => (idx === id ? { ...copy, headline: randomHeadline } : copy)))
    toast({ title: "Variation updated", description: "New headline generated" })
  }

  const reset = () => {
    setStep(1)
    setProduct("")
    setProductDescription("")
    setUsps("")
    setKeywords("")
    setChannel("")
    setTargetAudience("")
    setObjective("")
    setTone("professional")
    setStyle("punchy")
    setCtaInput("")
    setHeadlineLimit(undefined)
    setBodyLimit(undefined)
    setLanguage("en")
    setAdCopies([])
    setCtaSuggestions([])
    setComplianceAlerts([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ad Copy Generator Pro</h1>
        <p className="text-muted-foreground">Create platform-ready ad copy variants with CTAs, compliance checks, and export.</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Product</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Settings</Badge>
        <Badge variant={step >= 3 ? "default" : "secondary"}>3. Output</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Product/Service</CardTitle>
            <CardDescription>Describe what you're advertising so we can tailor the copy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Name</Label>
              <Input id="product" placeholder="e.g., TaskFlow Pro" value={product} onChange={(e) => setProduct(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-desc">Product/Service Description</Label>
              <Textarea id="product-desc" placeholder="Short summary or feature highlights" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usps">Unique Selling Points (optional)</Label>
              <Textarea id="usps" placeholder="Comma-separated USPs" value={usps} onChange={(e) => setUsps(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience (optional)</Label>
              <Input id="audience" placeholder="Demographics, interests, or pain points" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (optional)</Label>
              <Input id="keywords" placeholder="priority keywords or phrases" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            </div>
            <Button onClick={() => setStep(2)} disabled={!product}>Next: Settings</Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Campaign Settings</CardTitle>
            <CardDescription>Select platform, objective, tone, and limits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ad Platform</Label>
                <Select value={channel} onValueChange={setChannel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Campaign Objective</Label>
                <Select value={objective} onValueChange={setObjective}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="sales">Sales/Conversion</SelectItem>
                    <SelectItem value="app">App Installs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="witty">Witty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="punchy">Punchy</SelectItem>
                    <SelectItem value="descriptive">Descriptive</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="informal">Informal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>CTA (optional)</Label>
                <Input placeholder="e.g., Start Free Trial" value={ctaInput} onChange={(e) => setCtaInput(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Headline Character Limit (optional)</Label>
                <Input type="number" value={headlineLimit ?? ""} onChange={(e) => setHeadlineLimit(e.target.value ? parseInt(e.target.value) : undefined)} placeholder="e.g., 30" />
              </div>
              <div className="space-y-2">
                <Label>Body Character Limit (optional)</Label>
                <Input type="number" value={bodyLimit ?? ""} onChange={(e) => setBodyLimit(e.target.value ? parseInt(e.target.value) : undefined)} placeholder="e.g., 90" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setStep(1)} variant="outline">Back</Button>
              <Button onClick={generateAdCopy} disabled={loading || !channel}>
                {loading ? (<><RotateCcw className="mr-2 h-4 w-4 animate-spin" />Generating...</>) : (<><PenTool className="mr-2 h-4 w-4" />Generate Ad Copies</>)}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && adCopies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Generated Ad Copies</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
              <Button variant="outline" onClick={exportPDF}><Download className="mr-2 h-4 w-4" />Export PDF</Button>
              <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />New Campaign</Button>
            </div>
          </div>

          {complianceAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Platform Fit Alerts</CardTitle>
                <CardDescription>Review before launching to ensure compliance.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm text-amber-700">
                  {complianceAlerts.map((a, i) => (<li key={i}>{a}</li>))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">CTA Suggestions</CardTitle>
              <CardDescription>Action-oriented CTAs ready to plug in.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {ctaSuggestions.map((cta, i) => (
                <Badge key={i} variant="secondary">{cta}</Badge>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {adCopies.map((adCopy, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Variation {idx + 1}
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => regenerateVariation(idx)}>
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => copyAdCopy(adCopy)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">{adCopy.tone}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Headline {headlineLimit || platformDefaults[channel]?.headline ? `(max ${headlineLimit ?? platformDefaults[channel]?.headline})` : ""}</h4>
                    <p className="text-sm">{adCopy.headline}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Body {bodyLimit || platformDefaults[channel]?.body ? `(max ${bodyLimit ?? platformDefaults[channel]?.body})` : ""}</h4>
                    <p className="text-sm">{adCopy.body}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Call to Action</h4>
                    <Badge variant="outline">{adCopy.cta}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
