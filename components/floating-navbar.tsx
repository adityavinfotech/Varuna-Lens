"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, User, HelpCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export function FloatingNavbar() {
  const handleNotifications = () => {
    console.log("Notifications clicked")
  }

  const handleHelp = () => {
    console.log("Help clicked")
  }

  const handleProfile = () => {
    console.log("Profile clicked")
  }

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-card px-6 py-3 flex items-center gap-6 floating-particles rounded-full border-ocean-light/20 shadow-2xl ocean-glow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-primary to-ocean-medium flex items-center justify-center shadow-lg ocean-glow wave-animation">
            <Image 
              src="/images/ocean-wave.png" 
              alt="Varuna Lens Wave" 
              width={24} 
              height={24} 
              className="opacity-90" 
            />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-ocean-primary to-teal-primary bg-clip-text text-transparent">
            Varuna Lens
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-teal-primary/20 to-aqua-glow/20 text-teal-primary border-teal-primary/30 ocean-ripple rounded-full px-3 py-1 font-medium"
          >
            <div className="w-2 h-2 bg-teal-primary rounded-full mr-2 animate-pulse"></div>
            Live Data
          </Badge>
          
          <div className="flex items-center gap-1 ml-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              className="ocean-ripple rounded-full h-9 w-9 hover:bg-ocean-pale/50 hover:text-ocean-primary transition-all duration-200" 
              onClick={handleNotifications}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ocean-ripple rounded-full h-9 w-9 hover:bg-coral-pale/30 hover:text-coral-primary transition-all duration-200" 
              onClick={handleHelp}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ocean-ripple rounded-full h-9 w-9 hover:bg-ocean-medium/20 hover:text-ocean-medium transition-all duration-200" 
              onClick={handleProfile}
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
