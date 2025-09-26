"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, ZoomIn, ZoomOut } from "lucide-react"

interface OceanMapProps {
  onRegionSelect: (region: string) => void
}

export function OceanMap({ onRegionSelect }: OceanMapProps) {
  const floatData = [
    { id: "F001", lat: 15.5, lon: 68.2, temp: 28.5, salinity: 35.2, status: "active" },
    { id: "F002", lat: 12.8, lon: 65.4, temp: 29.1, salinity: 35.8, status: "active" },
    { id: "F003", lat: 18.2, lon: 70.1, temp: 27.8, salinity: 34.9, status: "inactive" },
    { id: "F004", lat: 20.1, lon: 72.5, temp: 26.9, salinity: 35.1, status: "active" },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Map Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="glass-card bg-transparent">
            <Layers className="h-4 w-4 mr-2" />
            Layers
          </Button>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {floatData.filter((f) => f.status === "active").length} Active Floats
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <Card className="flex-1 glass-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-chart-3/10">
          {/* Simulated Ocean Map */}
          <div className="w-full h-full relative">
            {/* Ocean Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-chart-3/20 via-chart-2/30 to-chart-1/20" />

            {/* Float Markers */}
            {floatData.map((float) => (
              <div
                key={float.id}
                className={`absolute w-3 h-3 rounded-full cursor-pointer transition-all hover:scale-150 ${
                  float.status === "active" ? "bg-primary ocean-glow animate-pulse" : "bg-muted-foreground/50"
                }`}
                style={{
                  left: `${(float.lon - 60) * 8 + 20}%`,
                  top: `${(25 - float.lat) * 4 + 20}%`,
                }}
                onClick={() => onRegionSelect(`Float ${float.id}`)}
              />
            ))}

            {/* Region Labels */}
            <div className="absolute top-1/4 left-1/3 text-sm font-medium text-muted-foreground">Arabian Sea</div>
            <div className="absolute top-1/2 right-1/4 text-sm font-medium text-muted-foreground">Bay of Bengal</div>

            {/* Depth Contours */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              <path
                d="M 50 100 Q 200 50 350 120 Q 500 80 650 140"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-chart-2"
              />
              <path
                d="M 30 200 Q 180 150 330 220 Q 480 180 630 240"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-chart-3"
              />
            </svg>
          </div>
        </div>

        {/* Float Info Panel */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="glass-card p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Active Floats:</span>
                <span className="ml-2 font-medium text-primary">
                  {floatData.filter((f) => f.status === "active").length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Update:</span>
                <span className="ml-2 font-medium">2 min ago</span>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  )
}
