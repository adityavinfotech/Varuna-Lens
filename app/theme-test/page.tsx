"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExportDock } from "@/components/export-dock"
import { Waves, Thermometer, Droplets, MapPin, Activity } from "lucide-react"

export default function ThemeTestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Waves className="h-8 w-8 text-primary wave-animation" />
              <h1 className="text-2xl font-bold text-primary">Varuna Lens</h1>
              <span className="text-sm text-muted-foreground">Ocean Theme Test</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Light Mode</Button>
              <Button variant="default" size="sm">Dark Mode</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Color Palette Demo */}
          <Card className="glass-card p-6 ocean-glow">
            <h2 className="text-xl font-semibold mb-4 text-primary">Ocean Colors</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full" style={{backgroundColor: 'var(--ocean-deep)'}}></div>
                <span className="text-sm">Ocean Deep</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full" style={{backgroundColor: 'var(--ocean-primary)'}}></div>
                <span className="text-sm">Ocean Primary</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full" style={{backgroundColor: 'var(--ocean-medium)'}}></div>
                <span className="text-sm">Ocean Medium</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full" style={{backgroundColor: 'var(--coral-primary)'}}></div>
                <span className="text-sm">Coral Primary</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full" style={{backgroundColor: 'var(--teal-primary)'}}></div>
                <span className="text-sm">Teal Primary</span>
              </div>
            </div>
          </Card>

          {/* Temperature Visualization */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-accent" />
              Temperature Scale
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-4 rounded temp-cold"></div>
                <span className="text-sm">Cold (&lt; 20°C)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-4 rounded temp-cool"></div>
                <span className="text-sm">Cool (20-25°C)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-4 rounded temp-neutral"></div>
                <span className="text-sm">Neutral (25-28°C)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-4 rounded temp-warm"></div>
                <span className="text-sm">Warm (28-32°C)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-4 rounded temp-hot"></div>
                <span className="text-sm">Hot (&gt; 32°C)</span>
              </div>
            </div>
          </Card>

          {/* Float Status */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Float Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full float-active"></div>
                <span className="text-sm">Active Float</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full float-inactive"></div>
                <span className="text-sm">Inactive Float</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full float-maintenance"></div>
                <span className="text-sm">Maintenance</span>
              </div>
            </div>
          </Card>

          {/* Interactive Elements */}
          <Card className="glass-card p-6 ocean-ripple">
            <h2 className="text-xl font-semibold mb-4">Interactive Elements</h2>
            <div className="space-y-3">
              <Button className="w-full">Primary Action</Button>
              <Button variant="secondary" className="w-full">Secondary Action</Button>
              <Button variant="outline" className="w-full">Outline Button</Button>
              <Button variant="ghost" className="w-full">Ghost Button</Button>
            </div>
          </Card>

          {/* Animations Demo */}
          <Card className="glass-card p-6 floating-particles">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent wave-animation" />
              Ocean Animations
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg ocean-ripple">
                <p className="text-sm">Ripple Effect (hover me)</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <Waves className="h-6 w-6 text-accent wave-animation mx-auto" />
                <p className="text-sm text-center mt-2">Wave Animation</p>
              </div>
            </div>
          </Card>

          {/* Data Visualization Colors */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-teal-primary" />
              Chart Colors
            </h2>
            <div className="grid grid-cols-5 gap-2">
              <div className="h-12 rounded" style={{backgroundColor: 'var(--chart-1)'}}></div>
              <div className="h-12 rounded" style={{backgroundColor: 'var(--chart-2)'}}></div>
              <div className="h-12 rounded" style={{backgroundColor: 'var(--chart-3)'}}></div>
              <div className="h-12 rounded" style={{backgroundColor: 'var(--chart-4)'}}></div>
              <div className="h-12 rounded" style={{backgroundColor: 'var(--chart-5)'}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Chart colors for data visualization
            </p>
          </Card>

        </div>

        {/* Theme Toggle Instructions */}
        <Card className="glass-card p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Theme Testing Instructions</h2>
          <div className="prose prose-sm max-w-none">
            <ul className="space-y-2 text-sm">
              <li>• The ocean theme is now applied with deep blues, coral accents, and teal highlights</li>
              <li>• Glass morphism effects use ocean-inspired transparency</li>
              <li>• Temperature gradients show realistic oceanographic color mapping</li>
              <li>• Float status indicators use appropriate ocean colors</li>
              <li>• Hover effects and animations enhance the oceanic feel</li>
              <li>• All colors maintain WCAG accessibility standards</li>
            </ul>
          </div>
        </Card>
      </main>

      {/* Export Dock */}
      <ExportDock />
    </div>
  )
}
