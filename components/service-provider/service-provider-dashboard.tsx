"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoucherScanner } from "@/components/service-provider/voucher-scanner"
import { AssignedVouchers } from "@/components/service-provider/assigned-vouchers"
import { ServiceHistory } from "@/components/service-provider/service-history"
import { ProviderStats } from "@/components/service-provider/provider-stats"
import { QrCode, LogOut, Bell, Stethoscope } from "lucide-react"
import { useRouter } from "next/navigation"

interface ServiceProviderDashboardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    organization?: string
  }
}

export function ServiceProviderDashboard({ user }: ServiceProviderDashboardProps) {
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
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Service Provider Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {user.organization || "Healthcare Provider"} • {user.name}
                </p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scanner">Scan Voucher</TabsTrigger>
            <TabsTrigger value="vouchers">My Vouchers</TabsTrigger>
            <TabsTrigger value="history">Service History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Service Overview</h2>
                <p className="text-muted-foreground">Manage vouchers and track your service delivery</p>
              </div>
              <Button onClick={() => setActiveTab("scanner")} className="animate-pulse-success">
                <QrCode className="h-4 w-4 mr-2" />
                Scan Voucher
              </Button>
            </div>

            <ProviderStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Voucher Activity</CardTitle>
                  <CardDescription>Latest voucher redemptions and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Voucher #VCH-001</p>
                        <p className="text-sm text-muted-foreground">Medical consultation - John Doe</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">Completed</div>
                        <div className="text-xs text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Voucher #VCH-002</p>
                        <p className="text-sm text-muted-foreground">Prescription medication - Jane Smith</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">In Progress</div>
                        <div className="text-xs text-muted-foreground">1 hour ago</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Voucher #VCH-003</p>
                        <p className="text-sm text-muted-foreground">Emergency treatment - Bob Wilson</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">Completed</div>
                        <div className="text-xs text-muted-foreground">4 hours ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Vouchers</CardTitle>
                  <CardDescription>Vouchers assigned to you awaiting service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-800">Voucher #VCH-004</p>
                        <p className="text-sm text-blue-600">Dental checkup - Alice Johnson</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 bg-transparent">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-800">Voucher #VCH-005</p>
                        <p className="text-sm text-yellow-600">Physical therapy - Mike Davis</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-200 bg-transparent">
                        View
                      </Button>
                    </div>
                    <div className="text-center py-4 text-muted-foreground">
                      <QrCode className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Scan voucher QR codes to start service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scanner" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Voucher Scanner</CardTitle>
                <CardDescription>Scan voucher QR codes to redeem and provide services</CardDescription>
              </CardHeader>
              <CardContent>
                <VoucherScanner />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vouchers" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Vouchers</CardTitle>
                <CardDescription>Vouchers assigned to your service provider account</CardDescription>
              </CardHeader>
              <CardContent>
                <AssignedVouchers />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in-up">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
                <CardDescription>Track all completed services and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceHistory />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
