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
      <div className="glass-card px-6 py-3 flex items-center gap-6 floating-particles">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center ocean-glow wave-animation">
            <Image src="/images/ocean-wave.png" alt="Varuna Lens Wave" width={20} height={20} className="opacity-80" />
          </div>
          <span className="font-semibold text-lg text-balance">Varuna Lens</span>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground ocean-ripple">
            Live Data
          </Badge>
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="ocean-ripple" onClick={handleNotifications}>
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="ocean-ripple" onClick={handleHelp}>
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="ocean-ripple" onClick={handleProfile}>
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
