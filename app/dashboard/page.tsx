"use client"

import { VarunaLensDashboard } from "@/components/varuna-lens-dashboard"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function DashboardContent() {
  const searchParams = useSearchParams()
  const initialMessage = searchParams.get("message")

  return <VarunaLensDashboard initialMessage={initialMessage} />
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
