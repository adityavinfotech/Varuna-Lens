"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, User, HelpCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export function FloatingNavbar() {
  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-card px-6 py-3 flex items-center gap-6 floating-particles">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center ocean-glow wave-animation">
            <Image src="/images/ocean-wave.png" alt="Varuna Lens Wave" width={20} height={20} className="opacity-80" />
          </div>
          <span className="font-semibold text-lg text-balance">Varuna Lens</span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground ocean-ripple">
            Live Data
          </Badge>
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="ocean-ripple">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="ocean-ripple">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="ocean-ripple">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
