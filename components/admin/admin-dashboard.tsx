"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, TrendingUp, AlertTriangle, DollarSign, Activity, CheckCircle } from "lucide-react"
import AdminStats from "./admin-stats"
import SystemOverview from "./system-overview"
import UserManagement from "./user-management"
import FraudDetection from "./fraud-detection"
import FinancialOverview from "./financial-overview"

// Sample data for admin dashboard
const sampleData = {
  totalUsers: 1247,
  totalCases: 892,
  totalDonations: 156780,
  activeVouchers: 234,
  pendingVerifications: 23,
  fraudAlerts: 3,
  systemHealth: 98.5,
  recentActivity: [
    { id: 1, type: "case_registered", user: "Volunteer Sarah", time: "2 minutes ago", location: "Mumbai Central" },
    { id: 2, type: "donation_received", user: "Donor Rajesh", amount: 5000, time: "5 minutes ago" },
    { id: 3, type: "case_verified", user: "NGO HelpIndia", time: "8 minutes ago", caseId: "CASE-2024-0892" },
    { id: 4, type: "voucher_redeemed", user: "Hospital ABC", time: "12 minutes ago", amount: 2500 },
    { id: 5, type: "fraud_detected", user: "System Alert", time: "15 minutes ago", severity: "medium" },
  ],
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Complete system oversight and management</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="w-3 h-3 mr-1" />
              System Healthy
            </Badge>
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <AdminStats data={sampleData} />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              System Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              User Management
            </TabsTrigger>
            <TabsTrigger value="fraud" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Fraud Detection
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Financial Overview
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Live Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SystemOverview />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="fraud" className="space-y-6">
            <FraudDetection />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <FinancialOverview />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  Live System Activity
                </CardTitle>
                <CardDescription>Real-time activity across all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {activity.type === "case_registered" && <Users className="w-5 h-5 text-blue-500" />}
                        {activity.type === "donation_received" && <Heart className="w-5 h-5 text-red-500" />}
                        {activity.type === "case_verified" && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {activity.type === "voucher_redeemed" && <DollarSign className="w-5 h-5 text-emerald-500" />}
                        {activity.type === "fraud_detected" && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                        <div>
                          <p className="font-medium text-slate-900">{activity.user}</p>
                          <p className="text-sm text-slate-600">
                            {activity.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            {activity.amount && ` - ₹${activity.amount.toLocaleString()}`}
                            {activity.location && ` at ${activity.location}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">{activity.time}</p>
                        {activity.severity && (
                          <Badge variant={activity.severity === "high" ? "destructive" : "secondary"} className="mt-1">
                            {activity.severity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
