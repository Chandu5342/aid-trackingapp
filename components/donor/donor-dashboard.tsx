"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerifiedCasesList } from "@/components/donor/verified-cases-list"
import { DonationHistory } from "@/components/donor/donation-history"
import { DonorStats } from "@/components/donor/donor-stats"
import { ImpactStories } from "@/components/donor/impact-stories"
import { Heart, LogOut, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

interface DonorDashboardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function DonorDashboard({ user }: DonorDashboardProps) {
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
                <Heart className="h-6 w-6 text-primary animate-pulse-success" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Donor Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Updates
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
            <TabsTrigger value="cases">Browse Cases</TabsTrigger>
            <TabsTrigger value="history">My Donations</TabsTrigger>
            <TabsTrigger value="impact">Impact Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your Impact Dashboard</h2>
                <p className="text-muted-foreground">Track your donations and see the difference you're making</p>
              </div>
              <Button onClick={() => setActiveTab("cases")} className="animate-pulse-success">
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
            </div>

            <DonorStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>Your latest contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Case #AID-001</p>
                        <p className="text-sm text-muted-foreground">Medical assistance - John Doe</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">$250</div>
                        <div className="text-xs text-muted-foreground">2 days ago</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Case #AID-003</p>
                        <p className="text-sm text-muted-foreground">Food assistance - Jane Smith</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">$100</div>
                        <div className="text-xs text-muted-foreground">1 week ago</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Case #AID-005</p>
                        <p className="text-sm text-muted-foreground">Shelter assistance - Bob Wilson</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">$500</div>
                        <div className="text-xs text-muted-foreground">2 weeks ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Summary</CardTitle>
                  <CardDescription>Lives you've helped change</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">Cases Completed</p>
                        <p className="text-sm text-green-600">Successfully helped</p>
                      </div>
                      <div className="text-2xl font-bold text-green-600">12</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">People Helped</p>
                        <p className="text-sm text-blue-600">Direct beneficiaries</p>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">18</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-800">Communities Reached</p>
                        <p className="text-sm text-purple-600">Areas impacted</p>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">5</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cases" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Verified Cases</CardTitle>
                <CardDescription>Browse and donate to verified cases that need your help</CardDescription>
              </CardHeader>
              <CardContent>
                <VerifiedCasesList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>Track all your donations and their impact</CardDescription>
              </CardHeader>
              <CardContent>
                <DonationHistory />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Impact Stories</CardTitle>
                <CardDescription>See how your donations have made a difference</CardDescription>
              </CardHeader>
              <CardContent>
                <ImpactStories />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
