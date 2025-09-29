"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Frown, Meh, Smile, TrendingUp, Sparkles, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SentimentAnalyzerPage() {
  const [step, setStep] = useState(1)
  const [text, setText] = useState("")
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const analyzeSentiment = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please provide text to analyze",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate sentiment analysis
    setTimeout(() => {
      const mockAnalysis = {
        overallSentiment: {
          label: "Positive",
          score: 0.78,
          confidence: 0.92,
        },
        sentimentBreakdown: [
          { label: "Positive", score: 0.78, color: "green", icon: "smile" },
          { label: "Neutral", score: 0.15, color: "gray", icon: "meh" },
          { label: "Negative", score: 0.07, color: "red", icon: "frown" },
        ],
        emotions: [
          { emotion: "Joy", intensity: 0.72, color: "yellow" },
          { emotion: "Trust", intensity: 0.65, color: "blue" },
          { emotion: "Anticipation", intensity: 0.43, color: "orange" },
          { emotion: "Surprise", intensity: 0.21, color: "purple" },
          { emotion: "Fear", intensity: 0.08, color: "red" },
          { emotion: "Sadness", intensity: 0.05, color: "blue" },
          { emotion: "Disgust", intensity: 0.03, color: "green" },
          { emotion: "Anger", intensity: 0.02, color: "red" },
        ],
        keyPhrases: [
          { phrase: "amazing experience", sentiment: "positive", strength: 0.89 },
          { phrase: "highly recommend", sentiment: "positive", strength: 0.85 },
          { phrase: "excellent service", sentiment: "positive", strength: 0.82 },
          { phrase: "great value", sentiment: "positive", strength: 0.76 },
        ],
        textMetrics: {
          wordCount: 156,
          sentenceCount: 8,
          avgSentimentPerSentence: 0.73,
          subjectivity: 0.68,
          polarity: 0.78,
        },
        sentimentTrend: [
          { sentence: 1, sentiment: 0.65 },
          { sentence: 2, sentiment: 0.82 },
          { sentence: 3, sentiment: 0.71 },
          { sentence: 4, sentiment: 0.89 },
          { sentence: 5, sentiment: 0.76 },
          { sentence: 6, sentiment: 0.68 },
          { sentence: 7, sentiment: 0.84 },
          { sentence: 8, sentiment: 0.79 },
        ],
        insights: [
          "Text shows consistently positive sentiment throughout",
          "High levels of joy and trust emotions detected",
          "Key positive phrases indicate satisfaction and recommendation",
          "Subjectivity score suggests personal opinions rather than facts",
          "No significant negative sentiment patterns found",
        ],
      }

      setAnalysis(mockAnalysis)
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

  const getEmotionColorClass = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "joy":
      case "anticipation":
        return "text-yellow-500 bg-yellow-500/10"
      case "trust":
      case "sadness":
        return "text-blue-500 bg-blue-500/10"
      case "anger":
      case "fear":
      case "disgust":
        return "text-destructive bg-destructive/10"
      case "surprise":
        return "text-purple-500 bg-purple-500/10"
      default:
        return "text-primary bg-primary/10"
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-bold">Sentiment Analyzer</h1>
            <p className="text-muted-foreground text-body">Analyze the emotional tone and sentiment of any text using advanced AI.</p>
          </div>
        </div>

        <div className="grid gap-8">
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Text to Analyze
                  </CardTitle>
                  <CardDescription className="text-body">Enter the text you want to analyze for sentiment and emotions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter your text here for sentiment analysis..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[220px]"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">{text.length} characters</div>
                </CardContent>
              </Card>

              <Button onClick={analyzeSentiment} className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-bounce" />
                    Analyzing Sentiment...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analyze Sentiment
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 2 && (
            <Card className="flex h-[350px] items-center justify-center">
              <CardContent className="text-center space-y-4">
                <div className="h-16 w-16 animate-spin border-4 border-primary border-t-transparent mx-auto" />
                <h3 className="text-h3 font-semibold">Analyzing Sentiment</h3>
                <p className="text-muted-foreground text-body">AI is processing the emotional tone of your text...</p>
              </CardContent>
            </Card>
          )}

          {step === 3 && analysis && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getSentimentIcon(analysis.overallSentiment.label)} Overall Sentiment
                  </CardTitle>
                  <CardDescription className="text-body">The primary emotional tone detected in your text.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-2 ${getSentimentColorClass(analysis.overallSentiment.label)}`}>
                      {analysis.overallSentiment.label}
                    </div>
                    <div className="text-muted-foreground text-body">
                      Score: {(analysis.overallSentiment.score * 100).toFixed(1)}% | Confidence:{" "}
                      {(analysis.overallSentiment.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {analysis.sentimentBreakdown.map((sentiment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between border p-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className={`flex items-center gap-1 ${getSentimentColorClass(sentiment.label)}`}>
                            {getSentimentIcon(sentiment.label)} <span className="font-medium text-body">{sentiment.label}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground text-body w-12">{(sentiment.score * 100).toFixed(1)}%</span>
                          <div className="h-3 w-24 bg-muted">
                            <div
                              className={`h-3 ${getSentimentColorClass(sentiment.label)}`}
                              style={{ width: `${sentiment.score * 100}%` }}
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
                    Emotional Analysis
                  </CardTitle>
                  <CardDescription className="text-body">Breakdown of underlying emotions detected in the text.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {analysis.emotions.map((emotion: any, index: number) => (
                      <div key={index} className="border p-4 text-center">
                        <div className="mb-1 text-sm font-medium text-muted-foreground">{emotion.emotion}</div>
                        <div className={`mb-2 text-2xl font-bold ${getEmotionColorClass(emotion.emotion)}`}>{(emotion.intensity * 100).toFixed(0)}%</div>
                        <Progress value={emotion.intensity * 100} className="h-3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Key Phrases
                  </CardTitle>
                  <CardDescription className="text-body">Important phrases and their associated sentiment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.keyPhrases.map((phrase: any, index: number) => (
                      <div key={index} className="flex items-center justify-between border p-3">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-muted-foreground text-body">"{phrase.phrase}"</span>
                          <Badge variant="secondary" className={`ml-2 text-sm ${getSentimentColorClass(phrase.sentiment)}`}>
                            {phrase.sentiment}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{(phrase.strength * 100).toFixed(0)}% strength</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Text Metrics</CardTitle>
                    <CardDescription className="text-body">Quantitative data about the analyzed text.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-body">Word Count:</span>
                      <span className="font-medium text-body">{analysis.textMetrics.wordCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-body">Sentences:</span>
                      <span className="font-medium text-body">{analysis.textMetrics.sentenceCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-body">Avg Sentiment:</span>
                      <span className="font-medium text-body">{(analysis.textMetrics.avgSentimentPerSentence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-body">Subjectivity:</span>
                      <span className="font-medium text-body">{(analysis.textMetrics.subjectivity * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-body">Polarity:</span>
                      <span className="font-medium text-body">{(analysis.textMetrics.polarity * 100).toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-h3">Sentiment Trend</CardTitle>
                    <CardDescription className="text-body">Sentiment score progression across sentences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.sentimentTrend.map((point: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="w-16 text-sm text-muted-foreground">Sentence {point.sentence}:</span>
                          <div className="h-3 flex-1 bg-muted">
                            <div
                              className={`h-3 ${
                                point.sentiment > 0.6
                                  ? "bg-green-500"
                                  : point.sentiment > 0.4
                                    ? "bg-yellow-500"
                                    : "bg-destructive"
                              }`}
                              style={{ width: `${point.sentiment * 100}%` }}
                            />
                          </div>
                          <span className="w-12 text-sm font-medium text-muted-foreground">{(point.sentiment * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Key Insights
                  </CardTitle>
                  <CardDescription className="text-body">Important findings from the sentiment analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.insights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 border p-3 text-body text-muted-foreground">
                        <div className="h-2 w-2 flex-shrink-0 bg-primary mt-2" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button
                onClick={() => {
                  setStep(1)
                  setAnalysis(null)
                  setText("")
                }}
                variant="outline"
                className="w-full"
              >
                Analyze New Text
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
