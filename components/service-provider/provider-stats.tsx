"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, DollarSign, Clock, TrendingUp } from "lucide-react"

export function ProviderStats() {
  const [stats, setStats] = useState({
    totalServices: 0,
    completedServices: 0,
    pendingVouchers: 0,
    totalEarnings: 0,
  })

  useEffect(() => {
    // Mock data for demonstration
    const mockStats = {
      totalServices: 15,
      completedServices: 12,
      pendingVouchers: 3,
      totalEarnings: 2250,
    }
    setStats(mockStats)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="animate-slide-in-right">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalServices}</div>
          <p className="text-xs text-muted-foreground">Services provided</p>
        </CardContent>
      </Card>

      <Card className="animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.completedServices}</div>
          <p className="text-xs text-muted-foreground">Successfully completed</p>
        </CardContent>
      </Card>

      <Card className="animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.pendingVouchers}</div>
          <p className="text-xs text-muted-foreground">Awaiting service</p>
        </CardContent>
      </Card>

      <Card className="animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">${stats.totalEarnings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Service fees earned</p>
        </CardContent>
      </Card>
    </div>
  )
}
