"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Frown, Meh, Smile, TrendingUp } from "lucide-react"
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

  const getSentimentIcon = (iconType: string) => {
    switch (iconType) {
      case "smile":
        return <Smile className="h-4 w-4" />
      case "meh":
        return <Meh className="h-4 w-4" />
      case "frown":
        return <Frown className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const getSentimentColor = (label: string) => {
    switch (label.toLowerCase()) {
      case "positive":
        return "text-green-400"
      case "negative":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sentiment Analyzer</h1>
        <p className="text-gray-400">Analyze the emotional tone and sentiment of any text using advanced AI</p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Text to Analyze
              </CardTitle>
              <CardDescription>Enter the text you want to analyze for sentiment and emotions</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your text here for sentiment analysis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[200px] bg-gray-800 border-gray-700 text-white"
              />
              <div className="mt-2 text-sm text-gray-400">{text.length} characters</div>
            </CardContent>
          </Card>

          <Button onClick={analyzeSentiment} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analyze Sentiment
          </Button>
        </div>
      )}

      {step === 2 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Sentiment</h3>
            <p className="text-gray-400">AI is processing the emotional tone of your text...</p>
          </CardContent>
        </Card>
      )}

      {step === 3 && analysis && (
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Overall Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className={`text-4xl font-bold mb-2 ${getSentimentColor(analysis.overallSentiment.label)}`}>
                  {analysis.overallSentiment.label}
                </div>
                <div className="text-gray-400">
                  Score: {(analysis.overallSentiment.score * 100).toFixed(1)}% | Confidence:{" "}
                  {(analysis.overallSentiment.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="space-y-3">
                {analysis.sentimentBreakdown.map((sentiment: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          sentiment.color === "green"
                            ? "bg-green-500/20 text-green-400"
                            : sentiment.color === "red"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {getSentimentIcon(sentiment.icon)}
                      </div>
                      <span className="text-white font-medium">{sentiment.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-300 text-sm w-12">{(sentiment.score * 100).toFixed(1)}%</span>
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            sentiment.color === "green"
                              ? "bg-green-500"
                              : sentiment.color === "red"
                                ? "bg-red-500"
                                : "bg-gray-500"
                          }`}
                          style={{ width: `${sentiment.score * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Emotional Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.emotions.map((emotion: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-semibold text-white mb-1">{emotion.emotion}</div>
                    <div className="text-2xl font-bold text-blue-400 mb-2">{(emotion.intensity * 100).toFixed(0)}%</div>
                    <Progress value={emotion.intensity * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Key Phrases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.keyPhrases.map((phrase: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-white">"{phrase.phrase}"</span>
                      <Badge
                        variant="outline"
                        className={`${
                          phrase.sentiment === "positive"
                            ? "border-green-500 text-green-400"
                            : phrase.sentiment === "negative"
                              ? "border-red-500 text-red-400"
                              : "border-gray-500 text-gray-400"
                        }`}
                      >
                        {phrase.sentiment}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400">{(phrase.strength * 100).toFixed(0)}% strength</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Text Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Word Count:</span>
                  <span className="text-white">{analysis.textMetrics.wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sentences:</span>
                  <span className="text-white">{analysis.textMetrics.sentenceCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Sentiment:</span>
                  <span className="text-white">{(analysis.textMetrics.avgSentimentPerSentence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subjectivity:</span>
                  <span className="text-white">{(analysis.textMetrics.subjectivity * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Polarity:</span>
                  <span className="text-white">{(analysis.textMetrics.polarity * 100).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Sentiment Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.sentimentTrend.map((point: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-16">Sent {point.sentence}:</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            point.sentiment > 0.6
                              ? "bg-green-500"
                              : point.sentiment > 0.4
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${point.sentiment * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-sm w-12">{(point.sentiment * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.insights.map((insight: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{insight}</span>
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
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Analyze New Text
          </Button>
        </div>
      )}
    </div>
  )
}
