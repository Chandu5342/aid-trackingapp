"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Eye, Clock, CheckCircle, XCircle, DollarSign, Truck } from "lucide-react"

interface Case {
  id: string
  beneficiaryName: string
  assistanceType: string[]
  urgencyLevel: string
  status: string
  createdAt: string
  estimatedCost: string
  description: string
}

export function CaseTrackingList() {
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)

  useEffect(() => {
    const storedCases = JSON.parse(localStorage.getItem("volunteerCases") || "[]")
    setCases(storedCases)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "verified":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "funded":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "in-progress":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "completed":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "verified":
        return <CheckCircle className="h-4 w-4" />
      case "funded":
        return <DollarSign className="h-4 w-4" />
      case "in-progress":
        return <Truck className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending":
        return 20
      case "verified":
        return 40
      case "funded":
        return 60
      case "in-progress":
        return 80
      case "completed":
        return 100
      case "rejected":
        return 0
      default:
        return 0
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500 text-white hover:bg-red-500"
      case "high":
        return "bg-orange-500 text-white hover:bg-orange-500"
      case "medium":
        return "bg-yellow-500 text-white hover:bg-yellow-500"
      case "low":
        return "bg-green-500 text-white hover:bg-green-500"
      default:
        return "bg-gray-500 text-white hover:bg-gray-500"
    }
  }

  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No cases registered yet</h3>
        <p className="text-muted-foreground">Start by registering your first case to help someone in need.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cases.map((caseItem) => (
        <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{caseItem.id}</CardTitle>
                <Badge className={getUrgencyColor(caseItem.urgencyLevel)}>{caseItem.urgencyLevel}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(caseItem.status)}>
                  {getStatusIcon(caseItem.status)}
                  <span className="ml-1 capitalize">{caseItem.status}</span>
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setSelectedCase(caseItem)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
            <CardDescription>
              <strong>{caseItem.beneficiaryName}</strong> • {caseItem.assistanceType.join(", ")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{caseItem.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Registered: {new Date(caseItem.createdAt).toLocaleDateString()}
                </span>
                {caseItem.estimatedCost && <span className="font-medium">Est. Cost: ${caseItem.estimatedCost}</span>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{getProgressPercentage(caseItem.status)}%</span>
                </div>
                <Progress value={getProgressPercentage(caseItem.status)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedCase.id}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedCase(null)}>
                  Close
                </Button>
              </div>
              <CardDescription>Case Details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Beneficiary</Label>
                  <p>{selectedCase.beneficiaryName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedCase.status)}>
                    {getStatusIcon(selectedCase.status)}
                    <span className="ml-1 capitalize">{selectedCase.status}</span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Urgency</Label>
                  <Badge className={getUrgencyColor(selectedCase.urgencyLevel)}>{selectedCase.urgencyLevel}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assistance Type</Label>
                  <p>{selectedCase.assistanceType.join(", ")}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedCase.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Registered Date</Label>
                  <p>{new Date(selectedCase.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedCase.estimatedCost && (
                  <div>
                    <Label className="text-sm font-medium">Estimated Cost</Label>
                    <p>${selectedCase.estimatedCost}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
