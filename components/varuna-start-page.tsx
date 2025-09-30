"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function VarunaStartPage() {
  const [input, setInput] = useState("")
  const router = useRouter()

  const suggestions = ["salinity", "floats", "trends"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      router.push(`/dashboard?message=${encodeURIComponent(input.trim())}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    router.push(`/dashboard?message=${encodeURIComponent(suggestion)}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Gradient orb background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/20 via-orange-500/20 to-pink-500/20 blur-3xl animate-pulse" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-8">
        {/* Logo and greeting */}
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <Image src="/images/ocean-wave.png" alt="Varuna Lens" width={48} height={48} className="mr-3" />
            <h1 className="text-2xl font-semibold text-foreground">Varuna Lens</h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-medium text-foreground">Good Morning, Explorer</h2>
            <p className="text-xl text-muted-foreground">🌊 Dive in — ask me about salinity, floats, or trends</p>
          </div>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full h-14 pl-6 pr-20 text-lg bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-muted/50">
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-primary hover:bg-primary/90"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        {/* Suggestion pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="rounded-full px-4 py-2 text-sm bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/50 hover:border-border transition-all"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Subtle floating particles animation */}
      <div className="absolute inset-0 floating-particles pointer-events-none" />
    </div>
  )
}
