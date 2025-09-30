"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

interface DataVisualizationProps {
  type: "profiles" | "trends"
}

export function DataVisualization({ type }: DataVisualizationProps) {
  if (type === "profiles") {
    return (
      <div className="h-full space-y-4">
        {/* Profile Chart */}
        <Card className="glass-card flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Temperature vs Depth Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              {/* Simulated Profile Chart */}
              <div className="absolute inset-0 bg-gradient-to-r from-chart-1/20 via-chart-2/30 to-chart-3/20 rounded-lg">
                <svg className="w-full h-full">
                  {/* Temperature Profile Line */}
                  <path
                    d="M 50 20 Q 100 40 150 80 Q 200 120 250 160 Q 300 180 350 200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-primary ocean-glow"
                  />
                  {/* Data Points */}
                  {[50, 150, 250, 350].map((x, i) => (
                    <circle key={i} cx={x} cy={20 + i * 60} r="4" className="fill-primary ocean-glow" />
                  ))}
                </svg>
              </div>

              {/* Axis Labels */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
                Depth (m)
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                Temperature (°C)
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Float F001</span>
              </div>
              <Badge variant="secondary" className="bg-accent/20">
                Latest: 28.5°C at 50m
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Salinity Profile */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Salinity Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-chart-2/20 to-chart-4/20 rounded-lg">
                <svg className="w-full h-full">
                  <path
                    d="M 50 60 Q 150 40 250 50 Q 350 45 450 55"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-chart-2"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full space-y-4">
      {/* Trend Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Temperature</p>
                <p className="text-2xl font-bold text-primary">28.2°C</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-xs text-green-400 mt-2">+0.3°C from last week</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Salinity</p>
                <p className="text-2xl font-bold text-chart-2">35.1 PSU</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-xs text-red-400 mt-2">-0.1 PSU from last week</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Floats</p>
                <p className="text-2xl font-bold text-accent">24</p>
              </div>
              <Activity className="h-8 w-8 text-accent" />
            </div>
            <p className="text-xs text-accent mt-2">3 new deployments</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Chart */}
      <Card className="glass-card flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">30-Day Temperature Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-chart-3/10 rounded-lg">
              <svg className="w-full h-full">
                {/* Trend Line */}
                <path
                  d="M 20 120 Q 80 100 140 110 Q 200 90 260 95 Q 320 85 380 80 Q 440 75 500 70"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-primary ocean-glow"
                />
                {/* Area Fill */}
                <path
                  d="M 20 120 Q 80 100 140 110 Q 200 90 260 95 Q 320 85 380 80 Q 440 75 500 70 L 500 180 L 20 180 Z"
                  fill="currentColor"
                  className="text-primary/20"
                />
              </svg>
            </div>

            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-20">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-muted-foreground"
                  style={{ top: `${i * 25}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
