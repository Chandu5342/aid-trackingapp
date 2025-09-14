"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PendingVerificationList } from "@/components/ngo/pending-verification-list"
import { SchemeManagement } from "@/components/ngo/scheme-management"
import { NGOStats } from "@/components/ngo/ngo-stats"
import { CaseMonitoring } from "@/components/ngo/case-monitoring"
import { Shield, LogOut, Bell, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface NGODashboardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    organization?: string
  }
}

export function NGODashboard({ user }: NGODashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NGO Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {user.organization || "Organization"} • {user.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="schemes">Schemes</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Verification Overview</h2>
                <p className="text-muted-foreground">Monitor and verify aid cases for transparency</p>
              </div>
              <Button onClick={() => setActiveTab("verification")} className="animate-pulse-success">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Review Pending Cases
              </Button>
            </div>

            <NGOStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Verifications</CardTitle>
                  <CardDescription>Latest case verification activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Case #AID-001</p>
                        <p className="text-sm text-muted-foreground">Medical assistance - John Doe</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">Verified</div>
                        <div className="text-xs text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Case #AID-002</p>
                        <p className="text-sm text-muted-foreground">Food assistance - Jane Smith</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">Rejected</div>
                        <div className="text-xs text-muted-foreground">4 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Case #AID-003</p>
                        <p className="text-sm text-muted-foreground">Shelter assistance - Bob Wilson</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">Verified</div>
                        <div className="text-xs text-muted-foreground">6 hours ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fraud Detection Alerts</CardTitle>
                  <CardDescription>Potential duplicate or suspicious cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <p className="font-medium text-red-800">Potential Duplicate</p>
                        <p className="text-sm text-red-600">Cases #AID-004 & #AID-007</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200 bg-transparent">
                        Review
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-800">Location Mismatch</p>
                        <p className="text-sm text-yellow-600">Case #AID-005</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-200 bg-transparent">
                        Review
                      </Button>
                    </div>
                    <div className="text-center py-4 text-muted-foreground">
                      <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">All other cases look legitimate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verification</CardTitle>
                <CardDescription>Review and verify cases submitted by volunteers</CardDescription>
              </CardHeader>
              <CardContent>
                <PendingVerificationList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schemes" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Scheme Management</CardTitle>
                <CardDescription>Create and manage aid distribution schemes</CardDescription>
              </CardHeader>
              <CardContent>
                <SchemeManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Case Monitoring</CardTitle>
                <CardDescription>Monitor live cases and track progress</CardDescription>
              </CardHeader>
              <CardContent>
                <CaseMonitoring />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
