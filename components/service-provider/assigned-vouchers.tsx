"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Calendar, DollarSign, User, MapPin } from "lucide-react"

interface AssignedVoucher {
  id: string
  caseId: string
  beneficiaryName: string
  serviceType: string
  amount: number
  validUntil: string
  status: string
  description: string
  assignedAt: string
  urgency: string
  location: string
}

export function AssignedVouchers() {
  const [vouchers, setVouchers] = useState<AssignedVoucher[]>([])
  const [filteredVouchers, setFilteredVouchers] = useState<AssignedVoucher[]>([])
  const [selectedVoucher, setSelectedVoucher] = useState<AssignedVoucher | null>(null)
  const [filters, setFilters] = useState({
    status: "all",
    serviceType: "all",
    urgency: "all",
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadAssignedVouchers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [vouchers, filters, searchTerm])

  const loadAssignedVouchers = () => {
    // Mock data for demonstration
    const mockVouchers: AssignedVoucher[] = [
      {
        id: "VCH-001",
        caseId: "AID-001",
        beneficiaryName: "John Doe",
        serviceType: "Medical Consultation",
        amount: 150,
        validUntil: "2024-12-31",
        status: "active",
        description: "General medical consultation and basic health checkup",
        assignedAt: "2024-01-15T10:00:00Z",
        urgency: "medium",
        location: "Downtown Medical Center",
      },
      {
        id: "VCH-002",
        caseId: "AID-002",
        beneficiaryName: "Jane Smith",
        serviceType: "Prescription Medication",
        amount: 75,
        validUntil: "2024-12-31",
        status: "active",
        description: "Prescription medication for chronic condition management",
        assignedAt: "2024-01-16T14:30:00Z",
        urgency: "high",
        location: "City Pharmacy",
      },
      {
        id: "VCH-003",
        caseId: "AID-003",
        beneficiaryName: "Bob Wilson",
        serviceType: "Emergency Treatment",
        amount: 300,
        validUntil: "2024-12-31",
        status: "completed",
        description: "Emergency medical treatment and stabilization",
        assignedAt: "2024-01-14T08:15:00Z",
        urgency: "critical",
        location: "Emergency Department",
      },
      {
        id: "VCH-004",
        caseId: "AID-004",
        beneficiaryName: "Alice Johnson",
        serviceType: "Dental Care",
        amount: 200,
        validUntil: "2024-12-31",
        status: "active",
        description: "Dental checkup and basic treatment",
        assignedAt: "2024-01-17T11:00:00Z",
        urgency: "low",
        location: "Dental Clinic",
      },
    ]
    setVouchers(mockVouchers)
  }

  const applyFilters = () => {
    let filtered = vouchers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.serviceType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((v) => v.status === filters.status)
    }

    // Service type filter
    if (filters.serviceType !== "all") {
      filtered = filtered.filter((v) => v.serviceType === filters.serviceType)
    }

    // Urgency filter
    if (filters.urgency !== "all") {
      filtered = filtered.filter((v) => v.urgency === filters.urgency)
    }

    setFilteredVouchers(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "expired":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
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

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case "medical consultation":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "prescription medication":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "emergency treatment":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "dental care":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  if (vouchers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No vouchers assigned</h3>
        <p className="text-muted-foreground">Vouchers will appear here when they are assigned to your services.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="search">Search Vouchers</Label>
          <Input
            id="search"
            placeholder="Search by name, ID, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type</Label>
          <Select value={filters.serviceType} onValueChange={(value) => setFilters({ ...filters, serviceType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="Medical Consultation">Medical Consultation</SelectItem>
              <SelectItem value="Prescription Medication">Prescription Medication</SelectItem>
              <SelectItem value="Emergency Treatment">Emergency Treatment</SelectItem>
              <SelectItem value="Dental Care">Dental Care</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="urgency">Urgency</Label>
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
      </div>

      {/* Vouchers List */}
      <div className="space-y-4">
        {filteredVouchers.map((voucher) => (
          <Card key={voucher.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{voucher.id}</CardTitle>
                  <Badge className={getUrgencyColor(voucher.urgency)}>{voucher.urgency}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(voucher.status)}>
                    <span className="capitalize">{voucher.status}</span>
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setSelectedVoucher(voucher)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
              <CardDescription>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {voucher.beneficiaryName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Assigned: {new Date(voucher.assignedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {voucher.location}
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getServiceTypeColor(voucher.serviceType)}>{voucher.serviceType}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{voucher.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold text-primary">${voucher.amount}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valid until: {new Date(voucher.validUntil).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVouchers.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No vouchers match your filters</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria to see more vouchers.</p>
        </div>
      )}

      {/* Voucher Detail Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedVoucher.id}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedVoucher(null)}>
                  Close
                </Button>
              </div>
              <CardDescription>Voucher Details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Beneficiary</Label>
                  <p>{selectedVoucher.beneficiaryName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Case ID</Label>
                  <p>{selectedVoucher.caseId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Type</Label>
                  <Badge className={getServiceTypeColor(selectedVoucher.serviceType)}>
                    {selectedVoucher.serviceType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Value</Label>
                  <p className="text-lg font-bold text-primary">${selectedVoucher.amount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedVoucher.status)}>
                    <span className="capitalize">{selectedVoucher.status}</span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Urgency</Label>
                  <Badge className={getUrgencyColor(selectedVoucher.urgency)}>{selectedVoucher.urgency}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedVoucher.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Service Location</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedVoucher.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Assigned Date</Label>
                  <p>{new Date(selectedVoucher.assignedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Valid Until</Label>
                  <p>{new Date(selectedVoucher.validUntil).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
