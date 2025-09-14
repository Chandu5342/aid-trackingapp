"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, TrendingUp, Award } from "lucide-react"

export function DonorStats() {
  const [stats, setStats] = useState({
    totalDonated: 0,
    casesSupported: 0,
    peopleHelped: 0,
    impactScore: 0,
  })

  useEffect(() => {
    const donations = JSON.parse(localStorage.getItem("userDonations") || "[]")
    const newStats = {
      totalDonated: donations.reduce((sum: number, d: any) => sum + d.amount, 0),
      casesSupported: donations.length,
      peopleHelped: donations.length + Math.floor(donations.length * 0.3), // Estimate family members helped
      impactScore: Math.min(
        donations.length * 10 + Math.floor(donations.reduce((sum: number, d: any) => sum + d.amount, 0) / 100),
        100,
      ),
    }
    setStats(newStats)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="animate-slide-in-right">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">${stats.totalDonated.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Your generous contributions</p>
        </CardContent>
      </Card>

      <Card className="animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cases Supported</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.casesSupported}</div>
          <p className="text-xs text-muted-foreground">Individual cases helped</p>
        </CardContent>
      </Card>

      <Card className="animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">People Helped</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.peopleHelped}</div>
          <p className="text-xs text-muted-foreground">Lives directly impacted</p>
        </CardContent>
      </Card>

      <Card className="animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.impactScore}/100</div>
          <p className="text-xs text-muted-foreground">Community impact rating</p>
        </CardContent>
      </Card>
    </div>
  )
}
