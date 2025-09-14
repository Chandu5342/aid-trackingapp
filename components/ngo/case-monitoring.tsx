"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Eye, MapPin, Clock, DollarSign, User } from "lucide-react"

interface Case {
  id: string
  beneficiaryName: string
  assistanceType: string[]
  urgencyLevel: string
  status: string
  createdAt: string
  estimatedCost: string
  description: string
  address: string
  verifiedAt?: string
}

export function CaseMonitoring() {
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = () => {
    const allCases = JSON.parse(localStorage.getItem("volunteerCases") || "[]")
    const activeCases = allCases.filter((c: Case) => c.status !== "pending")
    setCases(activeCases)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getProgressPercentage = (status: string) => {
    switch (status) {
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

  const filteredCases = cases.filter((caseItem) => {
    if (filter === "all") return true
    return caseItem.status === filter
  })

  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No active cases</h3>
        <p className="text-muted-foreground">Cases will appear here once they are verified.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All Cases ({cases.length})
        </Button>
        <Button variant={filter === "verified" ? "default" : "outline"} size="sm" onClick={() => setFilter("verified")}>
          Verified ({cases.filter((c) => c.status === "verified").length})
        </Button>
        <Button variant={filter === "funded" ? "default" : "outline"} size="sm" onClick={() => setFilter("funded")}>
          Funded ({cases.filter((c) => c.status === "funded").length})
        </Button>
        <Button
          variant={filter === "in-progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("in-progress")}
        >
          In Progress ({cases.filter((c) => c.status === "in-progress").length})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed ({cases.filter((c) => c.status === "completed").length})
        </Button>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.map((caseItem) => (
          <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{caseItem.id}</CardTitle>
                  <Badge className={getUrgencyColor(caseItem.urgencyLevel)}>{caseItem.urgencyLevel}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(caseItem.status)}>
                    <span className="capitalize">{caseItem.status}</span>
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setSelectedCase(caseItem)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
              <CardDescription>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {caseItem.beneficiaryName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(caseItem.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {caseItem.address.substring(0, 30)}...
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
                  <span>Progress</span>
                  <span>{getProgressPercentage(caseItem.status)}%</span>
                </div>
                <Progress value={getProgressPercentage(caseItem.status)} className="h-2" />
                {caseItem.estimatedCost && (
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-3 w-3" />
                    <span>Est. Cost: ${caseItem.estimatedCost}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <CardDescription>Case Monitoring Details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Beneficiary</div>
                  <p>{selectedCase.beneficiaryName}</p>
                </div>
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <Badge className={getStatusColor(selectedCase.status)}>
                    <span className="capitalize">{selectedCase.status}</span>
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">Urgency</div>
                  <Badge className={getUrgencyColor(selectedCase.urgencyLevel)}>{selectedCase.urgencyLevel}</Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">Assistance Type</div>
                  <p>{selectedCase.assistanceType.join(", ")}</p>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Description</div>
                <p className="text-sm text-muted-foreground mt-1">{selectedCase.description}</p>
              </div>
              <div>
                <div className="text-sm font-medium">Address</div>
                <p className="text-sm text-muted-foreground mt-1">{selectedCase.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Created Date</div>
                  <p>{new Date(selectedCase.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedCase.verifiedAt && (
                  <div>
                    <div className="text-sm font-medium">Verified Date</div>
                    <p>{new Date(selectedCase.verifiedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              {selectedCase.estimatedCost && (
                <div>
                  <div className="text-sm font-medium">Estimated Cost</div>
                  <p>${selectedCase.estimatedCost}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
