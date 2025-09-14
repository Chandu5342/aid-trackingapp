"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DonationModal } from "@/components/donor/donation-modal"
import { Heart, MapPin, Clock, User, Filter } from "lucide-react"

interface VerifiedCase {
  id: string
  beneficiaryName: string
  age: string
  gender: string
  address: string
  urgencyLevel: string
  assistanceType: string[]
  description: string
  estimatedCost: string
  status: string
  createdAt: string
  currentFunding: number
  fundingGoal: number
  donorCount: number
}

export function VerifiedCasesList() {
  const [cases, setCases] = useState<VerifiedCase[]>([])
  const [filteredCases, setFilteredCases] = useState<VerifiedCase[]>([])
  const [selectedCase, setSelectedCase] = useState<VerifiedCase | null>(null)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [filters, setFilters] = useState({
    urgency: "all",
    assistanceType: "all",
    fundingStatus: "all",
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadVerifiedCases()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [cases, filters, searchTerm])

  const loadVerifiedCases = () => {
    const allCases = JSON.parse(localStorage.getItem("volunteerCases") || "[]")
    const verified = allCases
      .filter((c: any) => c.status === "verified" || c.status === "funded" || c.status === "in-progress")
      .map((c: any) => ({
        ...c,
        currentFunding: Math.floor(Math.random() * Number.parseFloat(c.estimatedCost || "1000")),
        fundingGoal: Number.parseFloat(c.estimatedCost || "1000"),
        donorCount: Math.floor(Math.random() * 20) + 1,
      }))
    setCases(verified)
  }

  const applyFilters = () => {
    let filtered = cases

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Urgency filter
    if (filters.urgency !== "all") {
      filtered = filtered.filter((c) => c.urgencyLevel === filters.urgency)
    }

    // Assistance type filter
    if (filters.assistanceType !== "all") {
      filtered = filtered.filter((c) => c.assistanceType.includes(filters.assistanceType))
    }

    // Funding status filter
    if (filters.fundingStatus !== "all") {
      if (filters.fundingStatus === "urgent") {
        filtered = filtered.filter((c) => c.currentFunding < c.fundingGoal * 0.3)
      } else if (filters.fundingStatus === "partial") {
        filtered = filtered.filter((c) => c.currentFunding >= c.fundingGoal * 0.3 && c.currentFunding < c.fundingGoal)
      } else if (filters.fundingStatus === "nearly-funded") {
        filtered = filtered.filter((c) => c.currentFunding >= c.fundingGoal * 0.8 && c.currentFunding < c.fundingGoal)
      }
    }

    setFilteredCases(filtered)
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

  const getFundingPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  const getFundingColor = (percentage: number) => {
    if (percentage < 30) return "bg-red-500"
    if (percentage < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleDonate = (caseItem: VerifiedCase) => {
    setSelectedCase(caseItem)
    setShowDonationModal(true)
  }

  const handleDonationComplete = (amount: number) => {
    if (selectedCase) {
      // Update case funding
      const updatedCases = cases.map((c) =>
        c.id === selectedCase.id
          ? {
              ...c,
              currentFunding: c.currentFunding + amount,
              donorCount: c.donorCount + 1,
            }
          : c,
      )
      setCases(updatedCases)

      // Store donation
      const existingDonations = JSON.parse(localStorage.getItem("userDonations") || "[]")
      const newDonation = {
        id: Math.random().toString(36).substr(2, 9),
        caseId: selectedCase.id,
        caseName: selectedCase.beneficiaryName,
        amount,
        donorId: JSON.parse(localStorage.getItem("user") || "{}").id,
        createdAt: new Date().toISOString(),
        status: "completed",
      }
      localStorage.setItem("userDonations", JSON.stringify([...existingDonations, newDonation]))
    }
    setShowDonationModal(false)
    setSelectedCase(null)
  }

  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No verified cases available</h3>
        <p className="text-muted-foreground">Check back later for new cases that need your help.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="search">Search Cases</Label>
          <Input
            id="search"
            placeholder="Search by name, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="urgency">Urgency Level</Label>
          <Select value={filters.urgency} onValueChange={(value) => setFilters({ ...filters, urgency: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All urgency levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="assistanceType">Assistance Type</Label>
          <Select
            value={filters.assistanceType}
            onValueChange={(value) => setFilters({ ...filters, assistanceType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Medical">Medical</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Shelter">Shelter</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fundingStatus">Funding Status</Label>
          <Select
            value={filters.fundingStatus}
            onValueChange={(value) => setFilters({ ...filters, fundingStatus: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cases</SelectItem>
              <SelectItem value="urgent">Urgent ({"<"}30%)</SelectItem>
              <SelectItem value="partial">Partially Funded</SelectItem>
              <SelectItem value="nearly-funded">Nearly Funded (80%+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => {
          const fundingPercentage = getFundingPercentage(caseItem.currentFunding, caseItem.fundingGoal)
          const remainingAmount = caseItem.fundingGoal - caseItem.currentFunding

          return (
            <Card key={caseItem.id} className="hover:shadow-lg transition-all duration-300 animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{caseItem.id}</CardTitle>
                  <Badge className={getUrgencyColor(caseItem.urgencyLevel)}>{caseItem.urgencyLevel}</Badge>
                </div>
                <CardDescription>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-3 w-3" />
                    {caseItem.beneficiaryName} ({caseItem.age}y)
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {caseItem.assistanceType.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">{caseItem.description}</p>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{caseItem.address}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Funding Progress</span>
                    <span className="font-medium">{fundingPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={fundingPercentage} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">${caseItem.currentFunding.toLocaleString()} raised</span>
                    <span className="font-medium">${caseItem.fundingGoal.toLocaleString()} goal</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {caseItem.donorCount} donors
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(caseItem.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="pt-2 border-t">
                  <Button onClick={() => handleDonate(caseItem)} className="w-full" disabled={remainingAmount <= 0}>
                    <Heart className="h-4 w-4 mr-2" />
                    {remainingAmount <= 0 ? "Fully Funded" : `Donate $${Math.min(remainingAmount, 50)}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No cases match your filters</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria to see more cases.</p>
        </div>
      )}

      {/* Donation Modal */}
      {showDonationModal && selectedCase && (
        <DonationModal
          case={selectedCase}
          onClose={() => setShowDonationModal(false)}
          onDonationComplete={handleDonationComplete}
        />
      )}
    </div>
  )
}
