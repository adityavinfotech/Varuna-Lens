"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Map, TrendingUp, Activity, Settings } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { OceanMap } from "@/components/ocean-map"
import { DataVisualization } from "@/components/data-visualization"
import { FloatingNavbar } from "@/components/floating-navbar"
import { ExportDock } from "@/components/export-dock"

interface VarunaLensDashboardProps {
  initialMessage?: string | null
}

export function VarunaLensDashboard({ initialMessage }: VarunaLensDashboardProps) {
  const [activeTab, setActiveTab] = useState("map")
  const [selectedRegion, setSelectedRegion] = useState("Arabian Sea")

  return (
    <div className="min-h-screen bg-background relative overflow-hidden floating-particles">
      {/* Floating Navbar */}
      <FloatingNavbar />

      {/* Main Dashboard Layout */}
      <div className="flex h-screen pt-20 pb-16">
        {/* Left Pane - Chat Interface */}
        <div className="w-1/2 p-6 border-r border-border/30">
          <ChatInterface initialMessage={initialMessage} />
        </div>

        {/* Right Pane - Visualization Panel */}
        <div className="w-1/2 p-6">
          <Card className="glass-card h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-balance">Ocean Data Visualization</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-accent/20 text-accent-foreground ocean-ripple">
                    {selectedRegion}
                  </Badge>
                  <Button variant="ghost" size="sm" className="ocean-ripple">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 h-[calc(100%-5rem)]">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <div className="px-6 pb-4">
                  <TabsList className="grid w-full grid-cols-3 glass-card">
                    <TabsTrigger value="map" className="flex items-center gap-2 ocean-ripple">
                      <Map className="h-4 w-4" />
                      Map
                    </TabsTrigger>
                    <TabsTrigger value="profiles" className="flex items-center gap-2 ocean-ripple">
                      <Activity className="h-4 w-4" />
                      Profiles
                    </TabsTrigger>
                    <TabsTrigger value="trends" className="flex items-center gap-2 ocean-ripple">
                      <TrendingUp className="h-4 w-4" />
                      Trends
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-6 h-[calc(100%-4rem)]">
                  <TabsContent value="map" className="h-full mt-0">
                    <OceanMap onRegionSelect={setSelectedRegion} />
                  </TabsContent>

                  <TabsContent value="profiles" className="h-full mt-0">
                    <DataVisualization type="profiles" />
                  </TabsContent>

                  <TabsContent value="trends" className="h-full mt-0">
                    <DataVisualization type="trends" />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Dock */}
      <ExportDock />
    </div>
  )
}
