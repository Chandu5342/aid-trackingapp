"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react"

export function VolunteerStats() {
  const [stats, setStats] = useState({
    totalCases: 0,
    verifiedCases: 0,
    pendingCases: 0,
    completedCases: 0,
  })

  useEffect(() => {
    const cases = JSON.parse(localStorage.getItem("volunteerCases") || "[]")
    const newStats = {
      totalCases: cases.length,
      verifiedCases: cases.filter((c: any) => c.status === "verified" || c.status === "funded").length,
      pendingCases: cases.filter((c: any) => c.status === "pending").length,
      completedCases: cases.filter((c: any) => c.status === "completed").length,
    }
    setStats(newStats)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="animate-slide-in-right">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalCases}</div>
          <p className="text-xs text-muted-foreground">Cases registered by you</p>
        </CardContent>
      </Card>

      <Card className="animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified Cases</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.verifiedCases}</div>
          <p className="text-xs text-muted-foreground">Approved by NGOs</p>
        </CardContent>
      </Card>

      <Card className="animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingCases}</div>
          <p className="text-xs text-muted-foreground">Awaiting verification</p>
        </CardContent>
      </Card>

      <Card className="animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{stats.completedCases}</div>
          <p className="text-xs text-muted-foreground">Successfully helped</p>
        </CardContent>
      </Card>
    </div>
  )
}
