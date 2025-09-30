"use client"

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
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated Ocean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-600">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-cyan-900/60 to-teal-500/40 animate-pulse" />
        
        {/* Floating orbs with motion */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/20 blur-3xl animate-bounce" style={{ animationDuration: '6s' }} />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-teal-400/25 to-cyan-600/15 blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-32 h-32 rounded-full bg-gradient-to-br from-blue-300/20 to-cyan-500/10 blur-xl animate-ping" style={{ animationDuration: '8s' }} />
        
        {/* Animated stars/particles */}
        <div className="absolute top-1/5 left-1/5 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-300/80 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-blue-200/70 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-teal-300/60 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
        
        {/* Flowing wave effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/20 to-transparent animate-pulse" />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-8">
        {/* Logo and greeting */}
        <div className="space-y-8">
          {/* Enhanced Logo with Glow Effect */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/50 to-blue-500/30 blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-white/20 to-cyan-100/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
                <Image 
                  src="/images/ocean-wave.png" 
                  alt="Varuna Lens" 
                  width={64} 
                  height={64} 
                  className="animate-pulse" 
                  style={{ filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.5))' }}
                />
              </div>
            </div>
            
            {/* Enhanced Title */}
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent animate-pulse mb-4">
              Varuna Lens
            </h1>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl font-medium text-white/90 animate-pulse">Good Morning, Aadi</h2>
            <p className="text-xl md:text-2xl text-cyan-100/70">🌊 Dive in — ask me about salinity, floats, or trends</p>
          </div>
        </div>

        {/* Enhanced Search form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-sm" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about ocean data..."
              className="relative w-full h-16 pl-6 pr-24 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-cyan-100/60 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300/50 transition-all duration-300 hover:bg-white/15"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button 
                type="button" 
                size="sm" 
                variant="ghost" 
                className="h-10 w-10 p-0 rounded-full hover:bg-white/20 text-cyan-100 hover:text-white transition-all duration-300"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-10 w-10 p-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
                disabled={!input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>

        {/* Enhanced Suggestion pills */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {suggestions.map((suggestion, index) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="relative rounded-full px-6 py-3 text-sm font-medium bg-white/10 backdrop-blur-md border border-white/20 text-cyan-100 hover:bg-white/20 hover:text-white hover:border-cyan-300/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="relative z-10">{suggestion}</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </Button>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 floating-particles pointer-events-none" />
    </div>
  )
}
