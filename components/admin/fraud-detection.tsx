"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Eye, CheckCircle, XCircle, Clock } from "lucide-react"

// Sample fraud detection data
const fraudAlerts = [
  {
    id: 1,
    type: "duplicate_case",
    severity: "high",
    description: "Potential duplicate case detected - same person, different location",
    case1: "CASE-2024-0891",
    case2: "CASE-2024-0892",
    similarity: 95,
    volunteer1: "Sarah J.",
    volunteer2: "Mike R.",
    location1: "Mumbai Central",
    location2: "Mumbai Bandra",
    timestamp: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "suspicious_donation",
    severity: "medium",
    description: "Large donation from new account with limited verification",
    amount: 50000,
    donor: "Anonymous Donor",
    accountAge: "2 days",
    timestamp: "4 hours ago",
    status: "investigating",
  },
  {
    id: 3,
    type: "voucher_fraud",
    severity: "high",
    description: "Voucher used multiple times at different locations",
    voucherId: "VOUCH-2024-1234",
    serviceProvider1: "City Hospital",
    serviceProvider2: "Metro Clinic",
    timestamp: "6 hours ago",
    status: "resolved",
  },
  {
    id: 4,
    type: "fake_verification",
    severity: "medium",
    description: "NGO verification pattern suggests automated approval",
    ngo: "QuickHelp NGO",
    verificationRate: "98%",
    avgTime: "30 seconds",
    timestamp: "1 day ago",
    status: "monitoring",
  },
]

const fraudStats = {
  totalAlerts: 47,
  resolvedAlerts: 44,
  pendingAlerts: 3,
  falsePositives: 12,
  accuracyRate: 89.5,
}

export default function FraudDetection() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "low":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-red-100 text-red-700"
      case "investigating":
        return "bg-blue-100 text-blue-700"
      case "monitoring":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Fraud Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{fraudStats.totalAlerts}</div>
            <div className="text-sm text-slate-600">Total Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{fraudStats.resolvedAlerts}</div>
            <div className="text-sm text-slate-600">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{fraudStats.pendingAlerts}</div>
            <div className="text-sm text-slate-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{fraudStats.falsePositives}</div>
            <div className="text-sm text-slate-600">False Positives</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{fraudStats.accuracyRate}%</div>
            <div className="text-sm text-slate-600">Accuracy Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Fraud Detection Alerts
          </CardTitle>
          <CardDescription>AI-powered fraud detection and prevention system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fraudAlerts.map((alert) => (
            <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <div>
                    <h4 className="font-medium">{alert.type.replace("_", " ").toUpperCase()}</h4>
                    <p className="text-sm mt-1">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                </div>
              </div>

              {/* Alert Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-3 bg-white/50 rounded">
                {alert.type === "duplicate_case" && (
                  <>
                    <div>
                      <p className="text-sm font-medium">Case 1: {alert.case1}</p>
                      <p className="text-xs text-slate-600">Volunteer: {alert.volunteer1}</p>
                      <p className="text-xs text-slate-600">Location: {alert.location1}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Case 2: {alert.case2}</p>
                      <p className="text-xs text-slate-600">Volunteer: {alert.volunteer2}</p>
                      <p className="text-xs text-slate-600">Location: {alert.location2}</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Similarity Score:</span>
                        <Progress value={alert.similarity} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{alert.similarity}%</span>
                      </div>
                    </div>
                  </>
                )}

                {alert.type === "suspicious_donation" && (
                  <>
                    <div>
                      <p className="text-sm font-medium">Amount: ₹{alert.amount?.toLocaleString()}</p>
                      <p className="text-xs text-slate-600">Donor: {alert.donor}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Account Age: {alert.accountAge}</p>
                      <p className="text-xs text-slate-600">Risk Level: High</p>
                    </div>
                  </>
                )}

                {alert.type === "voucher_fraud" && (
                  <>
                    <div>
                      <p className="text-sm font-medium">Voucher: {alert.voucherId}</p>
                      <p className="text-xs text-slate-600">Provider 1: {alert.serviceProvider1}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duplicate Usage</p>
                      <p className="text-xs text-slate-600">Provider 2: {alert.serviceProvider2}</p>
                    </div>
                  </>
                )}

                {alert.type === "fake_verification" && (
                  <>
                    <div>
                      <p className="text-sm font-medium">NGO: {alert.ngo}</p>
                      <p className="text-xs text-slate-600">Verification Rate: {alert.verificationRate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Avg Time: {alert.avgTime}</p>
                      <p className="text-xs text-slate-600">Pattern: Suspicious</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  {alert.timestamp}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Investigate
                  </Button>
                  {alert.status === "pending" && (
                    <>
                      <Button variant="outline" size="sm" className="text-green-600 bg-transparent">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                        <XCircle className="w-4 h-4 mr-1" />
                        Dismiss
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
