"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileText, ImageIcon, Database } from "lucide-react"

export function ExportDock() {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="glass-card px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Export:</span>
          <Button variant="ghost" size="sm" className="h-8">
            <FileText className="h-4 w-4 mr-1" />
            CSV
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            <Database className="h-4 w-4 mr-1" />
            NetCDF
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            <ImageIcon className="h-4 w-4 mr-1" />
            PNG
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            <Download className="h-4 w-4 mr-1" />
            All Data
          </Button>
        </div>
      </Card>
    </div>
  )
}
