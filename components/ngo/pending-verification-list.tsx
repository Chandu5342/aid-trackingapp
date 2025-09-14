"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Eye, AlertTriangle, MapPin, Clock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PendingCase {
  id: string
  beneficiaryName: string
  age: string
  gender: string
  contactNumber: string
  address: string
  urgencyLevel: string
  assistanceType: string[]
  description: string
  medicalCondition: string
  estimatedCost: string
  status: string
  createdAt: string
  volunteerId: string
  location?: { lat: number; lng: number }
}

export function PendingVerificationList() {
  const [pendingCases, setPendingCases] = useState<PendingCase[]>([])
  const [selectedCase, setSelectedCase] = useState<PendingCase | null>(null)
  const [verificationNotes, setVerificationNotes] = useState("")
  const [duplicateAlerts, setDuplicateAlerts] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadPendingCases()
  }, [])

  const loadPendingCases = () => {
    const allCases = JSON.parse(localStorage.getItem("volunteerCases") || "[]")
    const pending = allCases.filter((c: PendingCase) => c.status === "pending")
    setPendingCases(pending)

    // Simulate duplicate detection
    const duplicates = detectDuplicates(pending)
    setDuplicateAlerts(duplicates)
  }

  const detectDuplicates = (cases: PendingCase[]) => {
    const duplicates: string[] = []
    for (let i = 0; i < cases.length; i++) {
      for (let j = i + 1; j < cases.length; j++) {
        const case1 = cases[i]
        const case2 = cases[j]

        // Check for similar names, addresses, or locations
        if (
          case1.beneficiaryName.toLowerCase().includes(case2.beneficiaryName.toLowerCase()) ||
          case2.beneficiaryName.toLowerCase().includes(case1.beneficiaryName.toLowerCase()) ||
          case1.address.toLowerCase().includes(case2.address.toLowerCase()) ||
          case2.address.toLowerCase().includes(case1.address.toLowerCase())
        ) {
          if (!duplicates.includes(case1.id)) duplicates.push(case1.id)
          if (!duplicates.includes(case2.id)) duplicates.push(case2.id)
        }
      }
    }
    return duplicates
  }

  const handleVerification = async (caseId: string, action: "verify" | "reject") => {
    setIsProcessing(true)

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const allCases = JSON.parse(localStorage.getItem("volunteerCases") || "[]")
    const updatedCases = allCases.map((c: PendingCase) => {
      if (c.id === caseId) {
        return {
          ...c,
          status: action === "verify" ? "verified" : "rejected",
          verificationNotes,
          verifiedAt: new Date().toISOString(),
          verifiedBy: JSON.parse(localStorage.getItem("user") || "{}").id,
        }
      }
      return c
    })

    localStorage.setItem("volunteerCases", JSON.stringify(updatedCases))

    toast({
      title: action === "verify" ? "Case Verified" : "Case Rejected",
      description: `Case ${caseId} has been ${action === "verify" ? "verified" : "rejected"} successfully.`,
    })

    setSelectedCase(null)
    setVerificationNotes("")
    loadPendingCases()
    setIsProcessing(false)
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

  if (pendingCases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No pending cases</h3>
        <p className="text-muted-foreground">All cases have been reviewed and processed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {duplicateAlerts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Duplicate Detection Alert:</strong> {duplicateAlerts.length} cases may be duplicates. Please review
            carefully.
          </AlertDescription>
        </Alert>
      )}

      {pendingCases.map((caseItem) => (
        <Card
          key={caseItem.id}
          className={`hover:shadow-md transition-shadow ${
            duplicateAlerts.includes(caseItem.id) ? "border-yellow-300 bg-yellow-50/50" : ""
          }`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{caseItem.id}</CardTitle>
                <Badge className={getUrgencyColor(caseItem.urgencyLevel)}>{caseItem.urgencyLevel}</Badge>
                {duplicateAlerts.includes(caseItem.id) && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Potential Duplicate
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedCase(caseItem)}>
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
              </div>
            </div>
            <CardDescription>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {caseItem.beneficiaryName} ({caseItem.age}y, {caseItem.gender})
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(caseItem.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {caseItem.assistanceType.map((type) => (
                  <Badge key={type} variant="secondary">
                    {type}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{caseItem.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {caseItem.address.substring(0, 50)}...
                </span>
                {caseItem.estimatedCost && <span className="font-medium">Est. Cost: ${caseItem.estimatedCost}</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Case Review Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle>{selectedCase.id}</CardTitle>
                  <Badge className={getUrgencyColor(selectedCase.urgencyLevel)}>{selectedCase.urgencyLevel}</Badge>
                  {duplicateAlerts.includes(selectedCase.id) && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Potential Duplicate
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedCase(null)}>
                  Close
                </Button>
              </div>
              <CardDescription>Case Verification Review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Beneficiary Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Beneficiary Details</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p>{selectedCase.beneficiaryName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Age</Label>
                        <p>{selectedCase.age} years</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Gender</Label>
                        <p className="capitalize">{selectedCase.gender}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Contact</Label>
                      <p>{selectedCase.contactNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p>{selectedCase.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Case Information</h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Assistance Type</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedCase.assistanceType.map((type) => (
                          <Badge key={type} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Estimated Cost</Label>
                      <p>${selectedCase.estimatedCost || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Submitted</Label>
                      <p>{new Date(selectedCase.createdAt).toLocaleString()}</p>
                    </div>
                    {selectedCase.location && (
                      <div>
                        <Label className="text-sm font-medium">GPS Location</Label>
                        <p className="text-sm">
                          Lat: {selectedCase.location.lat.toFixed(6)}, Lng: {selectedCase.location.lng.toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description and Medical Condition */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">
                    {selectedCase.description}
                  </p>
                </div>
                {selectedCase.medicalCondition && (
                  <div>
                    <Label className="text-sm font-medium">Medical Condition</Label>
                    <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">
                      {selectedCase.medicalCondition}
                    </p>
                  </div>
                )}
              </div>

              {/* Verification Notes */}
              <div className="space-y-2">
                <Label htmlFor="verificationNotes">Verification Notes</Label>
                <Textarea
                  id="verificationNotes"
                  placeholder="Add your verification notes here..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleVerification(selectedCase.id, "verify")}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Verify Case"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleVerification(selectedCase.id, "reject")}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Reject Case"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
