"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Clock,
  User,
  Heart,
  CheckCircle,
  AlertCircle,
  FileText,
  Camera,
  Phone,
  Eye,
  MessageSquare,
} from "lucide-react"

// Sample tracking data
const sampleTrackingData = {
  "CASE-2024-0892": {
    id: "CASE-2024-0892",
    beneficiary: "Ramesh Kumar",
    age: 45,
    location: "Mumbai Central Station",
    volunteer: "Sarah Johnson",
    ngo: "HelpIndia NGO",
    status: "voucher_generated",
    priority: "high",
    totalAmount: 5000,
    donatedAmount: 5000,
    serviceFee: 450,
    availableAmount: 4550,
    timeline: [
      {
        id: 1,
        stage: "case_registered",
        title: "Case Registered",
        description: "Volunteer registered beneficiary case with photo and voice recording",
        timestamp: "2024-01-15 10:30 AM",
        user: "Sarah Johnson (Volunteer)",
        location: "Mumbai Central Station",
        status: "completed",
        details: {
          photos: 2,
          voiceRecording: true,
          gpsLocation: "19.0176, 72.8562",
          medicalNeeds: ["Diabetes medication", "Blood pressure check"],
        },
      },
      {
        id: 2,
        stage: "ngo_verification",
        title: "NGO Verification",
        description: "Case verified by NGO after duplicate check and field validation",
        timestamp: "2024-01-15 02:45 PM",
        user: "HelpIndia NGO",
        status: "completed",
        details: {
          verificationTime: "4 hours 15 minutes",
          duplicateCheck: "No matches found",
          fieldVerification: "Completed",
          approvedSchemes: ["Medical Aid", "Food Support"],
        },
      },
      {
        id: 3,
        stage: "donation_received",
        title: "Donation Received",
        description: "Full amount donated by verified donor",
        timestamp: "2024-01-15 06:20 PM",
        user: "Rajesh Patel (Donor)",
        status: "completed",
        details: {
          amount: 5000,
          serviceFee: 450,
          netAmount: 4550,
          paymentMethod: "UPI",
          transactionId: "TXN123456789",
        },
      },
      {
        id: 4,
        stage: "voucher_generated",
        title: "Vouchers Generated",
        description: "Service vouchers created and assigned to providers",
        timestamp: "2024-01-15 06:25 PM",
        user: "System",
        status: "completed",
        details: {
          medicalVoucher: "VOUCH-MED-1234 (₹3000)",
          foodVoucher: "VOUCH-FOOD-5678 (₹1550)",
          assignedProviders: ["City Hospital", "Food Bank Mumbai"],
        },
      },
      {
        id: 5,
        stage: "service_in_progress",
        title: "Service in Progress",
        description: "Beneficiary taken to service provider for treatment",
        timestamp: "2024-01-16 09:15 AM",
        user: "Sarah Johnson (Volunteer)",
        status: "in_progress",
        details: {
          currentLocation: "City Hospital",
          serviceType: "Medical Treatment",
          estimatedCompletion: "2 hours",
        },
      },
      {
        id: 6,
        stage: "service_completed",
        title: "Service Completion",
        description: "Medical treatment completed, voucher redeemed",
        timestamp: "Pending",
        user: "Pending",
        status: "pending",
        details: {},
      },
    ],
    liveUpdates: [
      { time: "09:15 AM", message: "Beneficiary arrived at City Hospital", type: "location" },
      { time: "09:20 AM", message: "Registration completed, waiting for doctor", type: "status" },
      { time: "09:45 AM", message: "Consultation started with Dr. Sharma", type: "service" },
    ],
  },
}

interface LiveTrackingProps {
  caseId: string
  userRole: "volunteer" | "ngo" | "donor" | "service_provider" | "admin"
}

export default function LiveTracking({ caseId, userRole }: LiveTrackingProps) {
  const [trackingData, setTrackingData] = useState(sampleTrackingData[caseId as keyof typeof sampleTrackingData])
  const [isLive, setIsLive] = useState(true)

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Simulate new live updates
      const newUpdate = {
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        message: "Status update received from service provider",
        type: "status",
      }

      setTrackingData((prev) => ({
        ...prev,
        liveUpdates: [newUpdate, ...prev.liveUpdates.slice(0, 4)],
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isLive])

  if (!trackingData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-slate-600">Case not found or access denied</p>
        </CardContent>
      </Card>
    )
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "case_registered":
        return User
      case "ngo_verification":
        return CheckCircle
      case "donation_received":
        return Heart
      case "voucher_generated":
        return FileText
      case "service_in_progress":
        return Clock
      case "service_completed":
        return CheckCircle
      default:
        return AlertCircle
    }
  }

  const getStageColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200"
      case "in_progress":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const currentStage =
    trackingData.timeline.find((stage) => stage.status === "in_progress") ||
    trackingData.timeline[trackingData.timeline.length - 1]

  return (
    <div className="space-y-6">
      {/* Case Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-600" />
                Live Case Tracking - {trackingData.id}
              </CardTitle>
              <CardDescription>Real-time progress tracking for {trackingData.beneficiary}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${isLive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                {isLive ? "🔴 LIVE" : "Offline"}
              </Badge>
              <Badge
                variant="outline"
                className={
                  trackingData.priority === "high"
                    ? "border-red-200 text-red-700"
                    : trackingData.priority === "medium"
                      ? "border-orange-200 text-orange-700"
                      : "border-green-200 text-green-700"
                }
              >
                {trackingData.priority} priority
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Beneficiary Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Beneficiary Details</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-600">Name:</span> {trackingData.beneficiary}
                </p>
                <p>
                  <span className="text-slate-600">Age:</span> {trackingData.age} years
                </p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-600">Location:</span> {trackingData.location}
                </p>
                <p>
                  <span className="text-slate-600">Volunteer:</span> {trackingData.volunteer}
                </p>
                <p>
                  <span className="text-slate-600">NGO:</span> {trackingData.ngo}
                </p>
              </div>
            </div>

            {/* Financial Info */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Financial Status</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-600">Total Required:</span> ₹{trackingData.totalAmount.toLocaleString()}
                </p>
                <p>
                  <span className="text-slate-600">Donated:</span> ₹{trackingData.donatedAmount.toLocaleString()}
                </p>
                <p>
                  <span className="text-slate-600">Service Fee (9%):</span> ₹{trackingData.serviceFee.toLocaleString()}
                </p>
                <p>
                  <span className="text-slate-600">Available:</span> ₹{trackingData.availableAmount.toLocaleString()}
                </p>
              </div>
              <Progress value={(trackingData.donatedAmount / trackingData.totalAmount) * 100} className="h-2" />
            </div>

            {/* Current Status */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Current Status</h4>
              <div className={`p-3 rounded-lg border ${getStageColor(currentStage.status)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const Icon = getStageIcon(currentStage.stage)
                    return <Icon className="w-4 h-4" />
                  })()}
                  <span className="font-medium">{currentStage.title}</span>
                </div>
                <p className="text-sm">{currentStage.description}</p>
                <p className="text-xs mt-1 opacity-75">{currentStage.timestamp}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Progress Timeline
              </CardTitle>
              <CardDescription>Detailed journey from registration to completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trackingData.timeline.map((stage, index) => {
                  const Icon = getStageIcon(stage.stage)
                  const isLast = index === trackingData.timeline.length - 1

                  return (
                    <div key={stage.id} className="relative">
                      {!isLast && (
                        <div
                          className={`absolute left-6 top-12 w-0.5 h-16 ${
                            stage.status === "completed" ? "bg-green-200" : "bg-slate-200"
                          }`}
                        />
                      )}

                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full border-2 ${getStageColor(stage.status)}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900">{stage.title}</h4>
                            <Badge className={getStageColor(stage.status)}>{stage.status.replace("_", " ")}</Badge>
                          </div>

                          <p className="text-sm text-slate-600 mb-2">{stage.description}</p>

                          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {stage.timestamp}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {stage.user}
                            </span>
                            {stage.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {stage.location}
                              </span>
                            )}
                          </div>

                          {/* Stage Details */}
                          {Object.keys(stage.details).length > 0 && (
                            <div className="bg-slate-50 rounded-lg p-3 text-sm">
                              <h5 className="font-medium text-slate-700 mb-2">Details:</h5>
                              <div className="space-y-1">
                                {Object.entries(stage.details).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-slate-600 capitalize">
                                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                                    </span>
                                    <span className="text-slate-900">
                                      {Array.isArray(value) ? value.join(", ") : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Updates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                Live Updates
              </CardTitle>
              <CardDescription>Real-time status updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trackingData.liveUpdates.map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">{update.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{update.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 bg-transparent"
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? "Pause Live Updates" : "Resume Live Updates"}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {userRole === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Volunteer
                </Button>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Camera className="w-4 h-4 mr-2" />
                  Request Photo Update
                </Button>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Flag for Review
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
