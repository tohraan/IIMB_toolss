"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tags, Zap, BarChart3 } from "lucide-react"
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

  const getResultsForMode = () => {
    if (!results) return null
    return results[classificationMode]
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Text Classifier</h1>
        <p className="text-gray-400">Classify text for sentiment, topics, intent, and more using AI analysis</p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Tags className="h-5 w-5" />
                Text to Classify
              </CardTitle>
              <CardDescription>Enter the text you want to analyze and classify</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your text here for classification..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] bg-gray-800 border-gray-700 text-white"
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Classification Mode</CardTitle>
              <CardDescription>Choose what type of classification to perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                    className={
                      classificationMode === mode.id
                        ? "h-auto p-3 bg-blue-600 hover:bg-blue-700 flex-col"
                        : "h-auto p-3 border-gray-700 text-gray-300 hover:bg-gray-800 flex-col"
                    }
                  >
                    <div className="font-medium">{mode.label}</div>
                    <div className="text-xs opacity-70">{mode.desc}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button onClick={classifyText} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            <Zap className="h-4 w-4 mr-2" />
            Classify Text
          </Button>
        </div>
      )}

      {step === 2 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Classifying Text</h3>
            <p className="text-gray-400">AI is analyzing your text for classification...</p>
          </CardContent>
        </Card>
      )}

      {step === 3 && results && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Classification Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "sentiment", label: "Sentiment" },
                  { id: "topic", label: "Topic" },
                  { id: "intent", label: "Intent" },
                  { id: "language", label: "Language" },
                ].map((mode) => (
                  <Button
                    key={mode.id}
                    variant={classificationMode === mode.id ? "default" : "outline"}
                    onClick={() => setClassificationMode(mode.id)}
                    className={
                      classificationMode === mode.id
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-gray-700 text-gray-300 hover:bg-gray-800"
                    }
                  >
                    {mode.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {classificationMode === "sentiment" && (
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-green-400">{results.sentiment.primary}</div>
                      <div className="text-gray-400">
                        Confidence: {(results.sentiment.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="space-y-3">
                      {results.sentiment.scores.map((score: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full bg-${score.color}-500`}
                              style={{
                                backgroundColor:
                                  score.color === "green" ? "#10B981" : score.color === "red" ? "#EF4444" : "#6B7280",
                              }}
                            />
                            <span className="text-white">{score.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300 text-sm">{(score.score * 100).toFixed(1)}%</span>
                            <div className="w-20 bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${score.score * 100}%`,
                                  backgroundColor:
                                    score.color === "green" ? "#10B981" : score.color === "red" ? "#EF4444" : "#6B7280",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Emotional Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.sentiment.emotions.map((emotion: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white">{emotion.emotion}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 text-sm">{(emotion.intensity * 100).toFixed(0)}%</span>
                          <Progress value={emotion.intensity * 100} className="w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {classificationMode === "topic" && (
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Topic Classification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-center">
                    <div className="text-3xl font-bold text-blue-400">{results.topic.primary}</div>
                    <div className="text-gray-400">Confidence: {(results.topic.confidence * 100).toFixed(1)}%</div>
                  </div>
                  <div className="space-y-3">
                    {results.topic.categories.map((category: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white">{category.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 text-sm">{(category.score * 100).toFixed(1)}%</span>
                          <Progress value={category.score * 100} className="w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Key Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.topic.keywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-blue-500 text-blue-400">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {classificationMode === "intent" && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Intent Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">{results.intent.primary}</div>
                  <div className="text-gray-400">Confidence: {(results.intent.confidence * 100).toFixed(1)}%</div>
                </div>
                <div className="space-y-3">
                  {results.intent.intents.map((intent: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white">{intent.intent}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 text-sm">{(intent.score * 100).toFixed(1)}%</span>
                        <Progress value={intent.score * 100} className="w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {classificationMode === "language" && (
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Language Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-center">
                    <div className="text-3xl font-bold text-teal-400">{results.language.detected}</div>
                    <div className="text-gray-400">Confidence: {(results.language.confidence * 100).toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    {results.language.alternatives.map((lang: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white">{lang.language}</span>
                        <span className="text-gray-300 text-sm">{(lang.score * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Readability Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">{results.readability.score}</div>
                      <div className="text-xs text-gray-400">Readability Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">{results.readability.metrics.sentences}</div>
                      <div className="text-xs text-gray-400">Sentences</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">{results.readability.metrics.words}</div>
                      <div className="text-xs text-gray-400">Words</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-400">
                        {results.readability.metrics.avgWordsPerSentence}
                      </div>
                      <div className="text-xs text-gray-400">Avg Words/Sentence</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="border-teal-500 text-teal-400">
                      {results.readability.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Button
            onClick={() => {
              setStep(1)
              setResults(null)
              setText("")
            }}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Classify New Text
          </Button>
        </div>
      )}
    </div>
  )
}
