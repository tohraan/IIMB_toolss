import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bot, MessageSquare } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 md:p-6">
      <h1 className="text-h1 font-bold text-center mb-4">Start developing now.</h1>
      <p className="text-muted-foreground text-body text-center mb-8 max-w-2xl">
        Access powerful AI tools and a real-time chatbot to accelerate your projects.
      </p>

      <Card className="w-full max-w-2xl">
        <CardHeader className="flex-row items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle className="text-h3 font-semibold">AI Chatbot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="Ask me anything..." className="min-h-[120px]" />
          <Button className="w-full">
            <Bot className="mr-2 h-4 w-4" />
            Ask AI
          </Button>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-sm text-center mt-8">
        Explore the sidebar for a full list of specialized AI tools.
      </p>
    </div>
  )
}
