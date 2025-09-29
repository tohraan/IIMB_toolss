"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lightbulb, MessageCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AiQaSandboxPage() {
  const [step, setStep] = useState(1)
  const [question, setQuestion] = useState("")
  const [context, setContext] = useState("")
  const [answer, setAnswer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const getAnswer = async () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please ask a question.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setStep(2)

    // Simulate AI Q&A
    setTimeout(() => {
      const mockAnswer = {
        question: question,
        answer: "The capital of France is Paris. It is a major European city and a global center for art, fashion, gastronomy, and culture.",
        source: context ? "Provided context" : "General knowledge",
        relatedQuestions: [
          "What is the population of Paris?",
          "What are some famous landmarks in Paris?",
          "What is the history of the Eiffel Tower?",
        ],
        confidence: 0.95,
      }
      setAnswer(mockAnswer)
      setLoading(false)
      setStep(3)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Q&A Sandbox</h1>
            <p className="text-muted-foreground">Ask questions and get AI-powered answers, optionally with provided context.</p>
          </div>
        </div>

        <div className="grid gap-8">
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Your Question
                  </CardTitle>
                  <CardDescription>Enter your question for the AI to answer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Input
                      id="question"
                      placeholder="e.g., What is the capital of France?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="context">Optional: Provide Context</Label>
                    <Textarea
                      id="context"
                      placeholder="Paste relevant text or documents here for a more informed answer."
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={getAnswer} className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Answer...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Get Answer
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 2 && (
            <Card className="flex h-[300px] items-center justify-center">
              <CardContent className="text-center">
                <div className="h-12 w-12 animate-spin border-b-2 border-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Formulating Answer</h3>
                <p className="text-muted-foreground">AI is processing your question and generating a response...</p>
              </CardContent>
            </Card>
          )}

          {step === 3 && answer && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Answer
                  </CardTitle>
                  <CardDescription>AI-generated answer to your question.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Question:</h3>
                    <p className="text-muted-foreground/80">{answer.question}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Answer:</h3>
                    <div className="border bg-muted/20 p-4 text-muted-foreground leading-relaxed">
                      {answer.answer}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Source: <span className="font-medium text-primary">{answer.source}</span></span>
                    <span>Confidence: <span className="font-medium text-primary">{(answer.confidence * 100).toFixed(1)}%</span></span>
                  </div>
                </CardContent>
              </Card>

              {answer.relatedQuestions?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Questions</CardTitle>
                    <CardDescription>Other questions you might be interested in.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {answer.relatedQuestions.map((relatedQ: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Lightbulb className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                          {relatedQ}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={() => {
                  setStep(1)
                  setAnswer(null)
                  setQuestion("")
                  setContext("")
                }}
                variant="outline"
                className="w-full"
              >
                Ask Another Question
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
