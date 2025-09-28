"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Hash, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function HashtagSeoPage() {
  const [step, setStep] = useState(1)
  const [topic, setTopic] = useState("")
  const [platform, setPlatform] = useState("")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateHashtagsSeo = async () => {
    if (!topic || !platform) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI hashtag and SEO generation
    setTimeout(() => {
      const mockResults = {
        hashtags: {
          trending: [
            { tag: `#${topic.replace(/\s+/g, "")}`, volume: "2.1M", difficulty: "High" },
            { tag: "#trending", volume: "5.8M", difficulty: "Very High" },
            { tag: "#viral", volume: "3.2M", difficulty: "High" },
            { tag: "#explore", volume: "12.5M", difficulty: "Very High" },
            { tag: "#fyp", volume: "45.2M", difficulty: "Very High" },
          ],
          niche: [
            { tag: `#${topic.toLowerCase().replace(/\s+/g, "")}tips`, volume: "156K", difficulty: "Medium" },
            { tag: `#${topic.toLowerCase().replace(/\s+/g, "")}hacks`, volume: "89K", difficulty: "Medium" },
            { tag: `#${topic.toLowerCase().replace(/\s+/g, "")}guide`, volume: "234K", difficulty: "Medium" },
            { tag: `#${topic.toLowerCase().replace(/\s+/g, "")}expert`, volume: "67K", difficulty: "Low" },
            { tag: `#${topic.toLowerCase().replace(/\s+/g, "")}community`, volume: "145K", difficulty: "Medium" },
          ],
          longTail: [
            { tag: `#${topic.toLowerCase().replace(/\s+/g, "")}for beginners`, volume: "23K", difficulty: "Low" },
            { tag: `#${topic.toLowerCase().replace(/\s+/g, "")}success`, volume: "45K", difficulty: "Low" },
            { tag: `#${topic.toLowerCase().replace(/\s+/g, "")}journey`, volume: "78K", difficulty: "Low" },
            { tag: `#${topic.toLowerCase().replace(/\s+/g, "")}motivation`, volume: "156K", difficulty: "Medium" },
            { tag: `#${topic.toLowerCase().replace(/\s+/g, "")}inspiration`, volume: "234K", difficulty: "Medium" },
          ],
        },
        seoKeywords: {
          primary: [
            { keyword: topic, volume: "12,100", difficulty: "Medium", cpc: "$2.45" },
            { keyword: `${topic} tips`, volume: "3,600", difficulty: "Low", cpc: "$1.89" },
            { keyword: `${topic} guide`, volume: "2,900", difficulty: "Low", cpc: "$2.12" },
            { keyword: `best ${topic}`, volume: "1,900", difficulty: "Medium", cpc: "$3.21" },
            { keyword: `${topic} tutorial`, volume: "1,600", difficulty: "Low", cpc: "$1.67" },
          ],
          longTail: [
            { keyword: `how to ${topic.toLowerCase()}`, volume: "880", difficulty: "Low", cpc: "$1.34" },
            { keyword: `${topic.toLowerCase()} for beginners`, volume: "720", difficulty: "Low", cpc: "$1.56" },
            { keyword: `${topic.toLowerCase()} step by step`, volume: "590", difficulty: "Low", cpc: "$1.78" },
            { keyword: `${topic.toLowerCase()} mistakes to avoid`, volume: "480", difficulty: "Low", cpc: "$2.01" },
            { keyword: `${topic.toLowerCase()} success stories`, volume: "320", difficulty: "Low", cpc: "$1.89" },
          ],
          questions: [
            { keyword: `what is ${topic.toLowerCase()}?`, volume: "1,300", difficulty: "Low", cpc: "$0.89" },
            { keyword: `how does ${topic.toLowerCase()} work?`, volume: "880", difficulty: "Low", cpc: "$1.12" },
            { keyword: `why is ${topic.toLowerCase()} important?`, volume: "590", difficulty: "Low", cpc: "$1.45" },
            { keyword: `when to use ${topic.toLowerCase()}?`, volume: "320", difficulty: "Low", cpc: "$1.67" },
            { keyword: `where to learn ${topic.toLowerCase()}?`, volume: "260", difficulty: "Low", cpc: "$2.34" },
          ],
        },
      }

      setResults(mockResults)
      setLoading(false)
      toast({
        title: "Results generated",
        description: "Hashtags and SEO keywords found successfully",
      })
    }, 3000)
  }

  const copyHashtags = (category: string) => {
    if (!results) return
    const hashtags = results.hashtags[category].map((item: any) => item.tag).join(" ")
    navigator.clipboard.writeText(hashtags)
    toast({
      title: "Copied",
      description: `${category} hashtags copied to clipboard`,
    })
  }

  const copyKeywords = (category: string) => {
    if (!results) return
    const keywords = results.seoKeywords[category].map((item: any) => item.keyword).join(", ")
    navigator.clipboard.writeText(keywords)
    toast({
      title: "Copied",
      description: `${category} keywords copied to clipboard`,
    })
  }

  const reset = () => {
    setStep(1)
    setTopic("")
    setPlatform("")
    setResults(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hashtag & SEO Finder</h1>
        <p className="text-muted-foreground">Discover trending hashtags and SEO keywords for your content</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Topic</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Results</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Topic & Platform</CardTitle>
            <CardDescription>Enter your topic to find relevant hashtags and keywords</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic/Niche</Label>
              <Input
                id="topic"
                placeholder="e.g., Digital Marketing, Fitness, Cooking"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Primary Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="blog">Blog/Website</SelectItem>
                  <SelectItem value="general">General/Multi-platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateHashtagsSeo} disabled={loading || !topic || !platform}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Finding hashtags & keywords...
                </>
              ) : (
                <>
                  <Hash className="mr-2 h-4 w-4" />
                  Find Hashtags & Keywords
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Hashtags & SEO Keywords</h2>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              New Search
            </Button>
          </div>

          <Tabs defaultValue="hashtags" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              <TabsTrigger value="seo">SEO Keywords</TabsTrigger>
            </TabsList>

            <TabsContent value="hashtags" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      Trending
                      <Button size="sm" variant="ghost" onClick={() => copyHashtags("trending")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                    <CardDescription>High volume, competitive</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {results.hashtags.trending.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-mono">{item.tag}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.volume}
                          </Badge>
                          <Badge
                            variant={item.difficulty === "Very High" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {item.difficulty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      Niche
                      <Button size="sm" variant="ghost" onClick={() => copyHashtags("niche")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                    <CardDescription>Targeted, moderate competition</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {results.hashtags.niche.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-mono">{item.tag}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.volume}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.difficulty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      Long-tail
                      <Button size="sm" variant="ghost" onClick={() => copyHashtags("longTail")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                    <CardDescription>Specific, low competition</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {results.hashtags.longTail.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-mono">{item.tag}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.volume}
                          </Badge>
                          <Badge variant="default" className="text-xs">
                            {item.difficulty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      Primary Keywords
                      <Button size="sm" variant="ghost" onClick={() => copyKeywords("primary")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                    <CardDescription>High volume, main focus</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {results.seoKeywords.primary.map((item: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.keyword}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.volume}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Difficulty: {item.difficulty}</span>
                          <span>CPC: {item.cpc}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      Long-tail Keywords
                      <Button size="sm" variant="ghost" onClick={() => copyKeywords("longTail")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                    <CardDescription>Lower volume, easier to rank</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {results.seoKeywords.longTail.map((item: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.keyword}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.volume}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Difficulty: {item.difficulty}</span>
                          <span>CPC: {item.cpc}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      Question Keywords
                      <Button size="sm" variant="ghost" onClick={() => copyKeywords("questions")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                    <CardDescription>FAQ and how-to content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {results.seoKeywords.questions.map((item: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.keyword}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.volume}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Difficulty: {item.difficulty}</span>
                          <span>CPC: {item.cpc}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
