"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, User, Waves, Thermometer, Droplets } from "lucide-react"
import Image from "next/image"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ChatInterfaceProps {
  initialMessage?: string | null
}

export function ChatInterface({ initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI oceanographic assistant. I can help you explore ocean data, analyze float measurements, and visualize marine conditions. What would you like to discover today?",
      timestamp: new Date(),
      suggestions: [
        "Show salinity in Arabian Sea",
        "Temperature profiles near equator",
        "Recent float trajectories",
        "Compare seasonal patterns",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (initialMessage) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: initialMessage,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])

      // Simulate AI response to initial message
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: `I'll analyze the ${initialMessage.toLowerCase()} data for you. Let me pull up the relevant oceanographic measurements and display them in the visualization panel.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      }, 1000)
    }
  }, [initialMessage])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I'll analyze the ${inputValue.toLowerCase()} data for you. Let me pull up the relevant oceanographic measurements and display them in the visualization panel.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  return (
    <Card className="glass-card h-full flex flex-col floating-particles">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <div className="w-5 h-5 flex items-center justify-center wave-animation">
            <Image src="/images/ocean-wave.png" alt="AI Assistant Wave" width={20} height={20} className="opacity-80" />
          </div>
          AI Ocean Explorer
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ocean-glow ${
                      message.type === "user" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent-foreground"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      /* Replaced Bot icon with custom wave image */
                      <Image
                        src="/images/ocean-wave.png"
                        alt="AI Assistant"
                        width={16}
                        height={16}
                        className="opacity-80"
                      />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${message.type === "user" ? "text-right" : ""}`}>
                    <div
                      className={`rounded-lg p-3 ocean-ripple ${
                        message.type === "user"
                          ? "bg-primary/20 text-primary-foreground ml-auto"
                          : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="ml-11 space-y-2">
                    <p className="text-xs text-muted-foreground">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 glass-card hover:bg-accent/20 bg-transparent ocean-ripple"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-6 pt-4 border-t border-border/30">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about ocean data, float measurements, or marine conditions..."
              className="flex-1 glass-card ocean-ripple"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} className="ocean-glow" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Quick actions:</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs ocean-ripple">
              <Thermometer className="h-3 w-3 mr-1" />
              Temperature
            </Button>
            <Button variant="ghost" size="sm" className="h-6 text-xs ocean-ripple">
              <Droplets className="h-3 w-3 mr-1" />
              Salinity
            </Button>
            <Button variant="ghost" size="sm" className="h-6 text-xs ocean-ripple">
              <Waves className="h-3 w-3 mr-1" />
              Currents
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
