"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Copy, Download, FileText, Target, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ResumeOptimizerPage() {
  const [step, setStep] = useState(1)
  const [resume, setResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [optimization, setOptimization] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const optimizeResume = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      toast({
        title: "Error",
        description: "Please provide both resume and job description",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI resume optimization
    setTimeout(() => {
      const mockOptimization = {
        matchScore: 78,
        keywordMatches: 12,
        missingKeywords: 8,
        suggestions: {
          skills: [
            {
              original: "Experienced in web development",
              optimized: "5+ years of full-stack web development using React, Node.js, and Python",
              reason: "More specific and quantified experience",
            },
            {
              original: "Good communication skills",
              optimized:
                "Excellent written and verbal communication skills, demonstrated through leading cross-functional teams",
              reason: "More specific with concrete examples",
            },
          ],
          experience: [
            {
              original: "Worked on various projects",
              optimized: "Led development of 3 high-impact web applications serving 10,000+ users",
              reason: "Quantified achievements with specific metrics",
            },
          ],
        },
        missingKeywords: [
          "Agile methodology",
          "CI/CD",
          "Cloud platforms",
          "API development",
          "Database optimization",
          "Performance monitoring",
          "Security best practices",
          "Code review",
        ],
        optimizedResume: `JOHN DOE
Senior Full-Stack Developer

PROFESSIONAL SUMMARY
Results-driven Senior Full-Stack Developer with 5+ years of experience building scalable web applications using React, Node.js, and Python. Proven track record of leading cross-functional teams and delivering high-impact solutions serving 10,000+ users. Expert in Agile methodology, CI/CD pipelines, and cloud platforms.

TECHNICAL SKILLS
• Frontend: React, TypeScript, Next.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Python, Express.js, RESTful APIs, GraphQL
• Database: PostgreSQL, MongoDB, Redis, Database optimization
• Cloud: AWS, Docker, Kubernetes, CI/CD pipelines
• Tools: Git, Jest, Performance monitoring, Security best practices

PROFESSIONAL EXPERIENCE
Senior Full-Stack Developer | TechCorp Inc. | 2021 - Present
• Led development of 3 high-impact web applications serving 10,000+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Conducted thorough code reviews ensuring security best practices
• Collaborated with cross-functional teams using Agile methodology

Full-Stack Developer | StartupXYZ | 2019 - 2021
• Developed and maintained RESTful APIs handling 1M+ requests daily
• Optimized database queries improving application performance by 40%
• Integrated cloud platforms for scalable infrastructure solutions`,
      }

      setOptimization(mockOptimization)
      setLoading(false)
      setStep(3)
    }, 3000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Resume Optimizer</h1>
        <p className="text-gray-400">Optimize your resume for specific job descriptions using AI analysis</p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Current Resume
              </CardTitle>
              <CardDescription>Paste your current resume content</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your resume content here..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="min-h-[200px] bg-gray-800 border-gray-700 text-white"
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Job Description
              </CardTitle>
              <CardDescription>Paste the job description you're targeting</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] bg-gray-800 border-gray-700 text-white"
              />
            </CardContent>
          </Card>

          <Button onClick={optimizeResume} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            Optimize Resume
          </Button>
        </div>
      )}

      {step === 2 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Resume</h3>
            <p className="text-gray-400">AI is optimizing your resume for the target position...</p>
          </CardContent>
        </Card>
      )}

      {step === 3 && optimization && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Optimization Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{optimization.matchScore}%</div>
                  <div className="text-sm text-gray-400">Match Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{optimization.keywordMatches}</div>
                  <div className="text-sm text-gray-400">Keywords Matched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{optimization.missingKeywords}</div>
                  <div className="text-sm text-gray-400">Missing Keywords</div>
                </div>
              </div>
              <Progress value={optimization.matchScore} className="w-full" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Improvement Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Skills Section</h4>
                {optimization.suggestions.skills.map((suggestion: any, index: number) => (
                  <div key={index} className="mb-4 p-3 bg-gray-800 rounded-lg">
                    <div className="text-red-400 text-sm mb-1">Original:</div>
                    <div className="text-gray-300 mb-2">{suggestion.original}</div>
                    <div className="text-green-400 text-sm mb-1">Optimized:</div>
                    <div className="text-white mb-2">{suggestion.optimized}</div>
                    <div className="text-blue-400 text-xs">{suggestion.reason}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Missing Keywords</CardTitle>
              <CardDescription>Consider adding these relevant keywords to your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {optimization.missingKeywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-orange-500 text-orange-400">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Optimized Resume
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(optimization.optimizedResume)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto">
                {optimization.optimizedResume}
              </pre>
            </CardContent>
          </Card>

          <Button
            onClick={() => {
              setStep(1)
              setOptimization(null)
              setResume("")
              setJobDescription("")
            }}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Optimize Another Resume
          </Button>
        </div>
      )}
    </div>
  )
}
