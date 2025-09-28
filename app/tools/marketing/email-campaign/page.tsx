"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Mail, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EmailCampaignPage() {
  const [step, setStep] = useState(1)
  const [brief, setBrief] = useState("")
  const [audience, setAudience] = useState("")
  const [campaignType, setCampaignType] = useState("")
  const [emailSequence, setEmailSequence] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateEmailCampaign = async () => {
    if (!brief || !audience || !campaignType) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI email campaign generation
    setTimeout(() => {
      const mockEmailSequence = [
        {
          id: 1,
          type: "Welcome/Introduction",
          subject: "Welcome! Here's what you need to know about [Product]",
          alternativeSubjects: [
            "Your journey with [Product] starts now",
            "Thanks for joining us - here's your first step",
            "Welcome aboard! Let's get you started",
          ],
          preview: "Thanks for your interest in [Product]. Here's how we can help you achieve [goal]...",
          body: `Hi [Name],

Welcome to [Company]! We're thrilled you've decided to explore how [Product] can help you ${brief.toLowerCase()}.

Over the next few days, I'll be sharing some valuable insights and tips to help you get the most out of your experience with us.

Here's what you can expect:
• Email 2: Success stories from customers like you
• Email 3: Advanced strategies and best practices
• Email 4: Exclusive resources and next steps

To get started, here's a quick tip: [Insert relevant tip based on your brief]

Looking forward to helping you succeed!

Best regards,
[Your Name]
[Company]

P.S. Have questions? Just reply to this email - I read every response personally.`,
          timing: "Immediately after signup",
          cta: "Get Started Now",
        },
        {
          id: 2,
          type: "Social Proof/Success Stories",
          subject: "How [Customer Name] achieved [specific result] in [timeframe]",
          alternativeSubjects: [
            "Real results: [Customer] increased [metric] by [percentage]",
            "Success story: From [problem] to [solution] in [time]",
            "Case study: [Customer]'s transformation with [Product]",
          ],
          preview: "See how [Customer] overcame [challenge] and achieved [result] using [Product]...",
          body: `Hi [Name],

Yesterday I shared how [Product] can help you ${brief.toLowerCase()}. Today, I want to show you it's not just theory - it really works.

Meet [Customer Name], a ${audience.toLowerCase()} just like you.

Their challenge: [Specific challenge related to your brief]
Their solution: [How they used your product]
Their result: [Specific measurable outcome]

"[Testimonial quote about the transformation and results]" - [Customer Name]

The best part? [Customer] achieved these results in just [timeframe] by following our proven system.

You can achieve similar results. Here's how to get started: [Specific action step]

Ready to see what's possible for you?

Best regards,
[Your Name]

P.S. Want to read the full case study? [Link to detailed case study]`,
          timing: "1 day after email 1",
          cta: "Read Full Case Study",
        },
        {
          id: 3,
          type: "Value/Education + Soft Pitch",
          subject: "The #1 mistake most [audience] make (and how to avoid it)",
          alternativeSubjects: [
            "Why 90% of [audience] fail at [goal] (and how you can succeed)",
            "The hidden obstacle preventing your [goal] success",
            "What [successful people] do differently (you can too)",
          ],
          preview: "Avoid this common mistake that's holding back 90% of [audience] from achieving [goal]...",
          body: `Hi [Name],

After working with hundreds of ${audience.toLowerCase()}, I've noticed a pattern.

The ones who succeed at ${brief.toLowerCase()} do ONE thing differently than those who struggle.

The #1 mistake most ${audience.toLowerCase()} make:
[Specific mistake related to your brief and audience]

This mistake costs them:
• [Consequence 1]
• [Consequence 2]  
• [Consequence 3]

But here's the good news - it's completely avoidable.

The solution is simple: [Specific solution/strategy]

Here's how to implement this starting today:
1. [Step 1]
2. [Step 2]
3. [Step 3]

This is exactly what we help our customers do with [Product]. In fact, [specific feature] was designed specifically to help you avoid this mistake.

Want to see how it works? [CTA]

Best regards,
[Your Name]

P.S. Tomorrow I'll share the advanced strategies our most successful customers use. Stay tuned!`,
          timing: "3 days after email 1",
          cta: "See How It Works",
        },
      ]

      setEmailSequence(mockEmailSequence)
      setLoading(false)
      toast({
        title: "Email sequence generated",
        description: "3-email campaign created successfully",
      })
    }, 3000)
  }

  const copyEmail = (email: any) => {
    const text = `Subject: ${email.subject}

Preview: ${email.preview}

${email.body}

CTA: ${email.cta}
Timing: ${email.timing}

Alternative Subjects:
${email.alternativeSubjects.map((subject: string, i: number) => `${i + 1}. ${subject}`).join("\n")}`

    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: `Email ${email.id} copied to clipboard`,
    })
  }

  const reset = () => {
    setStep(1)
    setBrief("")
    setAudience("")
    setCampaignType("")
    setEmailSequence([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Campaign Writer</h1>
        <p className="text-muted-foreground">Generate subject lines and 3-email sequences for your campaigns</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Campaign Setup</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Email Sequence</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Campaign Setup</CardTitle>
            <CardDescription>Define your campaign goals and target audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brief">Campaign Brief</Label>
              <Textarea
                id="brief"
                placeholder="e.g., Promote our new productivity app to help small business owners save time and increase efficiency"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Small business owners, Marketing professionals, Freelancers"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-type">Campaign Type</Label>
              <Select value={campaignType} onValueChange={setCampaignType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Series</SelectItem>
                  <SelectItem value="nurture">Lead Nurture</SelectItem>
                  <SelectItem value="product-launch">Product Launch</SelectItem>
                  <SelectItem value="re-engagement">Re-engagement</SelectItem>
                  <SelectItem value="educational">Educational Series</SelectItem>
                  <SelectItem value="promotional">Promotional Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateEmailCampaign} disabled={loading || !brief || !audience || !campaignType}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Campaign...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Generate Email Sequence
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && emailSequence.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">3-Email Campaign Sequence</h2>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </div>

          <div className="space-y-6">
            {emailSequence.map((email) => (
              <Card key={email.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Email {email.id}: {email.type}
                    <Button size="sm" variant="outline" onClick={() => copyEmail(email)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Email
                    </Button>
                  </CardTitle>
                  <CardDescription>{email.timing}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Primary Subject Line</h4>
                    <p className="text-sm bg-muted p-2 rounded">{email.subject}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Alternative Subject Lines</h4>
                    <div className="space-y-1">
                      {email.alternativeSubjects.map((subject: string, index: number) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          • {subject}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Preview Text</h4>
                    <p className="text-sm text-muted-foreground">{email.preview}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Email Body</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-sans">{email.body}</pre>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Call to Action</h4>
                      <Badge variant="default">{email.cta}</Badge>
                    </div>
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
