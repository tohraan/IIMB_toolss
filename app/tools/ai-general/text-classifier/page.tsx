"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tags,
  Zap,
  BarChart3,
  Heart,
  Smile,
  Meh,
  Frown,
  MessageSquareText,
  Languages,
  BookOpenText,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TextClassifierPage() {
  const [step, setStep] = useState(1)
  const [text, setText] = useState("")
  const [classificationMode, setClassificationMode] = useState("sentiment")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const classifyText = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please provide text to classify",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate text classification
    setTimeout(() => {
      const mockResults = {
        sentiment: {
          primary: "Positive",
          confidence: 0.87,
          scores: [
            { label: "Positive", score: 0.87, color: "green" },
            { label: "Neutral", score: 0.09, color: "gray" },
            { label: "Negative", score: 0.04, color: "red" },
          ],
          emotions: [
            { emotion: "Joy", intensity: 0.72 },
            { emotion: "Trust", intensity: 0.65 },
            { emotion: "Anticipation", intensity: 0.43 },
            { emotion: "Surprise", intensity: 0.21 },
            { emotion: "Fear", intensity: 0.08 },
            { emotion: "Sadness", intensity: 0.05 },
          ],
        },
        topic: {
          primary: "Technology",
          confidence: 0.92,
          categories: [
            { category: "Technology", score: 0.92, color: "blue" },
            { category: "Business", score: 0.34, color: "purple" },
            { category: "Innovation", score: 0.28, color: "teal" },
            { category: "Science", score: 0.15, color: "orange" },
          ],
          keywords: ["AI", "machine learning", "automation", "efficiency", "innovation", "technology"],
        },
        intent: {
          primary: "Informational",
          confidence: 0.78,
          intents: [
            { intent: "Informational", score: 0.78, color: "blue" },
            { intent: "Commercial", score: 0.15, color: "green" },
            { intent: "Navigational", score: 0.07, color: "purple" },
          ],
        },
        language: {
          detected: "English",
          confidence: 0.99,
          alternatives: [
            { language: "English", score: 0.99 },
            { language: "American English", score: 0.95 },
          ],
        },
        readability: {
          score: 72,
          level: "College Level",
          metrics: {
            sentences: 8,
            words: 156,
            avgWordsPerSentence: 19.5,
            complexWords: 23,
          },
        },
      }

      setResults(mockResults)
      setLoading(false)
      setStep(3)
    }, 2500)
  }

  const getSentimentIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "positive":
        return <Smile className="h-4 w-4" />
      case "neutral":
        return <Meh className="h-4 w-4" />
      case "negative":
        return <Frown className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const getSentimentColorClass = (label: string) => {
    switch (label.toLowerCase()) {
      case "positive":
        return "text-green-500 bg-green-500/10"
      case "negative":
        return "text-destructive bg-destructive/10"
      case "neutral":
        return "text-gray-500 bg-gray-500/10"
      default:
        return "text-primary bg-primary/10"
    }
  }

  const getProgressColorClass = (score: number) => {
    if (score > 0.7) return "bg-green-500"
    if (score > 0.4) return "bg-yellow-500"
    return "bg-destructive"
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold">Text Classifier</h1>
            <p className="text-muted-foreground text-body">Classify text for sentiment, topics, intent, and more using AI analysis.</p>
          </div>
        </div>

        <div className="grid gap-8">
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Text to Classify
                  </CardTitle>
                  <CardDescription className="text-body">Enter the text you want to analyze and classify below.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter your text here for classification..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[220px]"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">{text.length} characters</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Classification Mode
                  </CardTitle>
                  <CardDescription className="text-body">Choose what type of classification to perform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      { id: "sentiment", label: "Sentiment", desc: "Positive/Negative" },
                      { id: "topic", label: "Topic", desc: "Subject Category" },
                      { id: "intent", label: "Intent", desc: "User Purpose" },
                      { id: "language", label: "Language", desc: "Language Detection" },
                    ].map((mode) => (
                      <Button
                        key={mode.id}
                        variant={classificationMode === mode.id ? "default" : "outline"}
                        onClick={() => setClassificationMode(mode.id)}
                        className="h-auto flex-col p-3"
                      >
                        <div className="font-medium text-body">{mode.label}</div>
                        <div className="text-sm opacity-70">{mode.desc}</div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={classifyText} className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Zap className="mr-2 h-4 w-4 animate-bounce" />
                    Classifying Text...
                  </>
                ) : (
                  <>
                    <Tags className="mr-2 h-4 w-4" />
                    Classify Text
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 2 && (
            <Card className="flex h-[350px] items-center justify-center">
              <CardContent className="text-center space-y-4">
                <div className="h-16 w-16 animate-spin border-4 border-primary border-t-transparent mx-auto" />
                <h3 className="text-h3 font-semibold">Classifying Text</h3>
                <p className="text-muted-foreground text-body">AI is analyzing your text for classification...</p>
              </CardContent>
            </Card>
          )}

          {step === 3 && results && (
            <div className="space-y-6">
              <Tabs defaultValue={classificationMode}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="sentiment" onClick={() => setClassificationMode("sentiment")} className="text-body">
                    Sentiment
                  </TabsTrigger>
                  <TabsTrigger value="topic" onClick={() => setClassificationMode("topic")} className="text-body">
                    Topic
                  </TabsTrigger>
                  <TabsTrigger value="intent" onClick={() => setClassificationMode("intent")} className="text-body">
                    Intent
                  </TabsTrigger>
                  <TabsTrigger value="language" onClick={() => setClassificationMode("language")} className="text-body">
                    Language
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sentiment" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          Sentiment Analysis
                        </CardTitle>
                        <CardDescription className="text-body">Overall emotional tone and breakdown.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6 text-center">
                          <div className={`mb-2 text-5xl font-bold ${getSentimentColorClass(results.sentiment.primary)}`}>
                            {results.sentiment.primary}
                          </div>
                          <div className="text-muted-foreground text-body">
                            Confidence: {(results.sentiment.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="grid gap-4">
                          {results.sentiment.scores.map((score: any, index: number) => (
                            <div key={index} className="flex items-center justify-between border p-3">
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary" className={`flex items-center gap-1 text-sm ${getSentimentColorClass(score.label)}`}>
                                  {getSentimentIcon(score.label)} <span className="font-medium text-body">{score.label}</span>
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="w-12 text-sm text-muted-foreground">{(score.score * 100).toFixed(1)}%</span>
                                <div className="h-3 w-24 bg-muted">
                                  <div
                                    className={`h-3 ${getProgressColorClass(score.score)}`}
                                    style={{ width: `${score.score * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-primary" />
                          Emotional Breakdown
                        </CardTitle>
                        <CardDescription className="text-body">Intensity of various emotions detected.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                          {results.sentiment.emotions.map((emotion: any, index: number) => (
                            <div key={index} className="border p-4 text-center">
                              <div className="mb-1 text-sm font-medium text-muted-foreground">{emotion.emotion}</div>
                              <div className="mb-2 text-2xl font-bold text-primary">{(emotion.intensity * 100).toFixed(0)}%</div>
                              <Progress value={emotion.intensity * 100} className="h-3" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="topic" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquareText className="h-5 w-5 text-primary" />
                          Topic Classification
                        </CardTitle>
                        <CardDescription className="text-body">Primary topics and their relevance scores.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6 text-center">
                          <div className="mb-2 text-5xl font-bold text-primary">{results.topic.primary}</div>
                          <div className="text-muted-foreground text-body">
                            Confidence: {(results.topic.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="grid gap-4">
                          {results.topic.categories.map((category: any, index: number) => (
                            <div key={index} className="flex items-center justify-between border p-3">
                              <span className="font-medium text-muted-foreground text-body">{category.category}</span>
                              <div className="flex items-center gap-3">
                                <span className="w-12 text-sm text-muted-foreground">{(category.score * 100).toFixed(1)}%</span>
                                <div className="h-3 w-24 bg-muted">
                                  <div
                                    className={`h-3 ${getProgressColorClass(category.score)}`}
                                    style={{ width: `${category.score * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Tags className="h-5 w-5 text-primary" />
                          Key Keywords
                        </CardTitle>
                        <CardDescription className="text-body">Extracted keywords from the text.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {results.topic.keywords.map((keyword: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-sm">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="intent" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary" />
                          Intent Classification
                        </CardTitle>
                        <CardDescription className="text-body">User intent detected from the text.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6 text-center">
                          <div className="mb-2 text-5xl font-bold text-primary">{results.intent.primary}</div>
                          <div className="text-muted-foreground text-body">
                            Confidence: {(results.intent.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="grid gap-4">
                          {results.intent.intents.map((intent: any, index: number) => (
                            <div key={index} className="flex items-center justify-between border p-3">
                              <span className="font-medium text-muted-foreground text-body">{intent.intent}</span>
                              <div className="flex items-center gap-3">
                                <span className="w-12 text-sm text-muted-foreground">{(intent.score * 100).toFixed(1)}%</span>
                                <div className="h-3 w-24 bg-muted">
                                  <div
                                    className={`h-3 ${getProgressColorClass(intent.score)}`}
                                    style={{ width: `${intent.score * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="language" className="mt-6">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Languages className="h-5 w-5 text-primary" />
                          Language Detection
                        </CardTitle>
                        <CardDescription className="text-body">Detected language and confidence scores.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6 text-center">
                          <div className="mb-2 text-5xl font-bold text-primary">{results.language.detected}</div>
                          <div className="text-muted-foreground text-body">
                            Confidence: {(results.language.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="grid gap-4">
                          {results.language.alternatives.map((lang: any, index: number) => (
                            <div key={index} className="flex items-center justify-between border p-3">
                              <span className="font-medium text-muted-foreground text-body">{lang.language}</span>
                              <span className="w-12 text-sm text-muted-foreground">{(lang.score * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpenText className="h-5 w-5 text-primary" />
                          Readability Analysis
                        </CardTitle>
                        <CardDescription className="text-body">Metrics on text complexity and readability level.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div className="border p-4 text-center">
                            <div className="mb-1 text-sm font-medium text-muted-foreground">Score</div>
                            <div className="text-2xl font-bold text-primary">{results.readability.score}</div>
                          </div>
                          <div className="border p-4 text-center">
                            <div className="mb-1 text-sm font-medium text-muted-foreground">Sentences</div>
                            <div className="text-2xl font-bold text-primary">
                              {results.readability.metrics.sentences}
                            </div>
                          </div>
                          <div className="border p-4 text-center">
                            <div className="mb-1 text-sm font-medium text-muted-foreground">Words</div>
                            <div className="text-2xl font-bold text-primary">{results.readability.metrics.words}</div>
                          </div>
                          <div className="border p-4 text-center">
                            <div className="mb-1 text-sm font-medium text-muted-foreground">Avg Words/Sentence</div>
                            <div className="text-2xl font-bold text-primary">
                              {results.readability.metrics.avgWordsPerSentence}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge variant="secondary" className="text-primary text-sm">
                            {results.readability.level}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={() => {
                  setStep(1)
                  setResults(null)
                  setText("")
                }}
                variant="outline"
                className="w-full"
              >
                Classify New Text
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
