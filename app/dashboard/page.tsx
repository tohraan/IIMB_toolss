"use client"
import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, MessageSquare, User, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: string
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMessage])
    setInput("")
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: `AI response to: "${newMessage.text}"`, // Placeholder AI response
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
      setLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full flex-col bg-background relative">
      {/* Chat Message Area */}
      <ScrollArea className="flex-1 p-4 md:p-6 pb-24">
        <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bot className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-h2 font-bold mb-2">Start developing now.</h2>
              <p className="text-body">Ask me anything about your projects or tools.</p>
            </div>
          )}
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`flex flex-col p-4 w-fit ${message.sender === "user" ? "self-end bg-primary/20 text-foreground" : "self-start bg-muted/20 text-foreground"}`}
            >
              <CardContent className="p-0 text-body">
                {message.text}
              </CardContent>
              <span className={`text-xs text-muted-foreground ${message.sender === "user" ? "self-end" : "self-start"}`}>
                {message.timestamp}
              </span>
            </Card>
          ))}
          {loading && (
            <Card className="flex flex-col p-4 w-fit self-start bg-muted/20 text-foreground">
              <CardContent className="p-0 text-body flex items-center">
                <span className="animate-pulse">Typing...</span>
              </CardContent>
            </Card>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area / Prompt Box */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-background border-t shadow-lg">
        <div className="flex items-center space-x-2 max-w-3xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message..."
            className="flex-1 min-h-[48px] max-h-[150px] resize-none pr-10 text-body"
          />
          <Button onClick={handleSendMessage} disabled={loading} size="icon" className="h-10 w-10 shrink-0">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
