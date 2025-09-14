"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CaseRegistrationForm } from "@/components/volunteer/case-registration-form"
import { CaseTrackingList } from "@/components/volunteer/case-tracking-list"
import { VolunteerStats } from "@/components/volunteer/volunteer-stats"
import { Plus, LogOut, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

interface VolunteerDashboardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function VolunteerDashboard({ user }: VolunteerDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showCaseForm, setShowCaseForm] = useState(false)
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
                <svg
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Welcome, {user.name}</h1>
                <p className="text-sm text-muted-foreground">Volunteer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="register">Register Case</TabsTrigger>
            <TabsTrigger value="tracking">My Cases</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <p className="text-muted-foreground">Track your volunteer activities and impact</p>
              </div>
              <Button onClick={() => setActiveTab("register")} className="animate-pulse-success">
                <Plus className="h-4 w-4 mr-2" />
                Register New Case
              </Button>
            </div>

            <VolunteerStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest case registrations and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Case #AID-001</p>
                        <p className="text-sm text-muted-foreground">Medical assistance required</p>
                      </div>
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Case #AID-002</p>
                        <p className="text-sm text-muted-foreground">Food assistance needed</p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Case #AID-003</p>
                        <p className="text-sm text-muted-foreground">Shelter assistance</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Funded</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => setActiveTab("register")} className="h-20 flex-col">
                      <Plus className="h-6 w-6 mb-2" />
                      New Case
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("tracking")} className="h-20 flex-col">
                      <Bell className="h-6 w-6 mb-2" />
                      Track Cases
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="register" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Register New Case</CardTitle>
                <CardDescription>
                  Help someone in need by registering their case with detailed information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CaseRegistrationForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Case Tracking</CardTitle>
                <CardDescription>Monitor the progress of all your registered cases</CardDescription>
              </CardHeader>
              <CardContent>
                <CaseTrackingList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
