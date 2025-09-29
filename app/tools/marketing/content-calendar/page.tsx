"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, Calendar, RotateCcw, Download, Star } from "lucide-react" // Import Star icon
import { useToast } from "@/hooks/use-toast"
import { useFavorites } from "@/hooks/use-favorites" // Import useFavorites hook
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils" // Import cn for conditional classnames

export default function ContentCalendarPage() {
  const [step, setStep] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [goal, setGoal] = useState("")
  const [platform, setPlatform] = useState("")
  const [calendar, setCalendar] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { isFavorite, toggleFavorite } = useFavorites() // Use the favorites hook

  const generateCalendar = async () => {
    if (!keyword || !goal || !platform) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI calendar generation
    setTimeout(() => {
      const mockCalendar = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i)

        const contentTypes = ["Educational", "Promotional", "Behind-the-scenes", "User-generated", "Trending"]
        const postTypes = ["Image", "Video", "Carousel", "Story", "Reel"]

        return {
          day: i + 1,
          date: date.toLocaleDateString(),
          dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }),
          contentType: contentTypes[i % contentTypes.length],
          postType: postTypes[i % postTypes.length],
          title: `${keyword} ${
            [
              "Tips for Beginners",
              "Success Stories",
              "Behind the Scenes",
              "Quick Tutorial",
              "Industry Insights",
              "Common Mistakes",
              "Best Practices",
              "Trending Now",
              "Expert Interview",
              "Case Study",
            ][i % 10]
          }`,
          description: `Engaging content about ${keyword} that aligns with ${goal}. Perfect for ${platform} audience.`,
          hashtags: [`#${keyword.replace(/\s+/g, "")}`, "#marketing", "#business", "#tips", "#growth"],
          bestTime: ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "8:00 PM"][i % 5],
        }
      })

      setCalendar(mockCalendar)
      setLoading(false)
      toast({
        title: "Calendar generated",
        description: "30-day content calendar created successfully",
      })
    }, 3000)
  }

  const copyCalendar = () => {
    const text = calendar
      .map(
        (item) =>
          `Day ${item.day} (${item.date})\nTitle: ${item.title}\nType: ${item.contentType} - ${item.postType}\nDescription: ${item.description}\nHashtags: ${item.hashtags.join(" ")}\nBest Time: ${item.bestTime}\n`,
      )
      .join("\n")

    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Content calendar copied to clipboard",
    })
  }

  const exportCalendar = () => {
    const csvContent = [
      "Day,Date,Day of Week,Content Type,Post Type,Title,Description,Hashtags,Best Time",
      ...calendar.map(
        (item) =>
          `${item.day},"${item.date}","${item.dayOfWeek}","${item.contentType}","${item.postType}","${item.title}","${item.description}","${item.hashtags.join(" ")}","${item.bestTime}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "content-calendar.csv"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Exported",
      description: "Calendar downloaded as CSV file",
    })
  }

  const reset = () => {
    setStep(1)
    setKeyword("")
    setGoal("")
    setPlatform("")
    setCalendar([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Calendar Maker</h1>
        <p className="text-muted-foreground">Generate a 30-day posting calendar with content ideas and timing</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={step >= 1 ? "default" : "secondary"}>1. Setup</Badge>
        <Badge variant={step >= 2 ? "default" : "secondary"}>2. Calendar</Badge>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Content Strategy Setup</CardTitle>
            <CardDescription>Define your content focus and goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyword">Main Keyword/Topic</Label>
              <Input
                id="keyword"
                placeholder="e.g., Digital Marketing, Fitness, Productivity"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Content Goal</Label>
              <Textarea
                id="goal"
                placeholder="e.g., Increase brand awareness, Drive website traffic, Generate leads"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Primary Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="blog">Blog/Website</SelectItem>
                  <SelectItem value="multi">Multi-platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateCalendar} disabled={loading || !keyword || !goal || !platform}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Calendar...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Generate 30-Day Calendar
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && calendar.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">30-Day Content Calendar</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportCalendar}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={copyCalendar}>
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Calendar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {calendar.map((item) => {
              const itemId = `content-calendar-${item.day}`;
              const isItemFavorite = isFavorite(itemId);
              return (
                <Card key={item.day} className="h-fit">
                  <CardHeader className="pb-3 flex-row items-center justify-between">
                    <div className="flex flex-col">
                      <CardTitle className="text-body">
                        Day {item.day} - {item.dayOfWeek}
                      </CardTitle>
                      <CardDescription className="text-xs">{item.date}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.bestTime}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 transition-transform duration-200 hover:scale-110"
                              onClick={() =>
                                toggleFavorite({
                                  id: itemId,
                                  name: `Content Calendar Day ${item.day}`,
                                  href: `/tools/marketing/content-calendar?day=${item.day}`,
                                })
                              }
                            >
                              <Star
                                className={cn(
                                  "h-4 w-4",
                                  isItemFavorite ? "fill-current text-primary" : "text-muted-foreground"
                                )}
                              />
                              <span className="sr-only">Toggle favorite</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {isItemFavorite ? "Remove from favorites" : "Add to favorites"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.contentType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.postType}
                      </Badge>
                    </div>
                    <div className="text-xs text-primary">{item.hashtags.join(" ")}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
