import { notFound } from "next/navigation"
import LiveTracking from "@/components/shared/live-tracking"

interface TrackingPageProps {
  params: {
    caseId: string
  }
  searchParams: {
    role?: string
  }
}

export default function TrackingPage({ params, searchParams }: TrackingPageProps) {
  const { caseId } = params
  const userRole = (searchParams.role as any) || "donor" // Default to donor view

  // In a real app, you'd validate the case ID and user permissions here
  if (!caseId.startsWith("CASE-")) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        <LiveTracking caseId={caseId} userRole={userRole} />
      </div>
    </div>
  )
}
