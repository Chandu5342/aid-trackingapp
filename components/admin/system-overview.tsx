"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Server, Shield, Globe, Activity, CheckCircle, AlertTriangle } from "lucide-react"

// Sample system data
const systemMetrics = {
  serverStatus: [
    { name: "Web Server", status: "healthy", uptime: "99.9%", load: 45 },
    { name: "Database", status: "healthy", uptime: "99.8%", load: 62 },
    { name: "File Storage", status: "healthy", uptime: "100%", load: 23 },
    { name: "Payment Gateway", status: "warning", uptime: "98.5%", load: 78 },
  ],
  regionalStats: [
    { region: "Mumbai", cases: 234, volunteers: 45, ngos: 12, active: true },
    { region: "Delhi", cases: 189, volunteers: 38, ngos: 8, active: true },
    { region: "Bangalore", cases: 156, volunteers: 29, ngos: 6, active: true },
    { region: "Chennai", cases: 123, volunteers: 22, ngos: 5, active: true },
    { region: "Kolkata", cases: 98, volunteers: 18, ngos: 4, active: false },
  ],
}

export default function SystemOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-600" />
            System Health
          </CardTitle>
          <CardDescription>Real-time server and service status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {systemMetrics.serverStatus.map((server, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    server.status === "healthy"
                      ? "bg-green-500"
                      : server.status === "warning"
                        ? "bg-orange-500"
                        : "bg-red-500"
                  }`}
                />
                <div>
                  <p className="font-medium text-slate-900">{server.name}</p>
                  <p className="text-sm text-slate-600">Uptime: {server.uptime}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={server.status === "healthy" ? "default" : "secondary"}>{server.status}</Badge>
                <div className="mt-2 w-24">
                  <Progress value={server.load} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">{server.load}% load</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Regional Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            Regional Overview
          </CardTitle>
          <CardDescription>Activity across different regions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {systemMetrics.regionalStats.map((region, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${region.active ? "bg-green-500" : "bg-gray-400"}`} />
                <div>
                  <p className="font-medium text-slate-900">{region.region}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>{region.cases} cases</span>
                    <span>{region.volunteers} volunteers</span>
                    <span>{region.ngos} NGOs</span>
                  </div>
                </div>
              </div>
              <Badge variant={region.active ? "default" : "secondary"}>{region.active ? "Active" : "Inactive"}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Performance Metrics
          </CardTitle>
          <CardDescription>System performance indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">2.3s</div>
              <div className="text-sm text-slate-600">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-slate-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1.2K</div>
              <div className="text-sm text-slate-600">Daily Active Users</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">45GB</div>
              <div className="text-sm text-slate-600">Data Processed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Security Status
          </CardTitle>
          <CardDescription>Security monitoring and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-slate-900">SSL Certificate</p>
                <p className="text-sm text-slate-600">Valid until Dec 2024</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">Active</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-slate-900">Firewall</p>
                <p className="text-sm text-slate-600">All ports secured</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700">Protected</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-slate-900">Failed Login Attempts</p>
                <p className="text-sm text-slate-600">23 attempts in last hour</p>
              </div>
            </div>
            <Badge variant="secondary">Monitoring</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
