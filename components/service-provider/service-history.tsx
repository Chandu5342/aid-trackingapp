"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Calendar, DollarSign, CheckCircle } from "lucide-react"

interface ServiceRecord {
  id: string
  voucherId: string
  caseId: string
  beneficiaryName: string
  serviceType: string
  amount: number
  completedAt: string
  status: string
  paymentStatus: string
  serviceNotes: string
}

export function ServiceHistory() {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(null)

  useEffect(() => {
    loadServiceHistory()
  }, [])

  const loadServiceHistory = () => {
    // Mock data for demonstration
    const mockRecords: ServiceRecord[] = [
      {
        id: "SRV-001",
        voucherId: "VCH-001",
        caseId: "AID-001",
        beneficiaryName: "John Doe",
        serviceType: "Medical Consultation",
        amount: 150,
        completedAt: "2024-01-15T14:30:00Z",
        status: "completed",
        paymentStatus: "paid",
        serviceNotes: "General health checkup completed. Patient in good health with minor concerns addressed.",
      },
      {
        id: "SRV-002",
        voucherId: "VCH-002",
        caseId: "AID-002",
        beneficiaryName: "Jane Smith",
        serviceType: "Prescription Medication",
        amount: 75,
        completedAt: "2024-01-16T16:45:00Z",
        status: "completed",
        paymentStatus: "paid",
        serviceNotes: "Prescribed medication dispensed for chronic condition management. Patient counseled on usage.",
      },
      {
        id: "SRV-003",
        voucherId: "VCH-003",
        caseId: "AID-003",
        beneficiaryName: "Bob Wilson",
        serviceType: "Emergency Treatment",
        amount: 300,
        completedAt: "2024-01-14T20:15:00Z",
        status: "completed",
        paymentStatus: "pending",
        serviceNotes: "Emergency treatment provided for acute condition. Patient stabilized and discharged.",
      },
    ]
    setServiceRecords(mockRecords)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const downloadServiceReport = (record: ServiceRecord) => {
    // Simulate service report download
    const reportData = {
      serviceId: record.id,
      voucherId: record.voucherId,
      caseId: record.caseId,
      beneficiary: record.beneficiaryName,
      serviceType: record.serviceType,
      amount: record.amount,
      completedAt: record.completedAt,
      status: record.status,
      paymentStatus: record.paymentStatus,
      serviceNotes: record.serviceNotes,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `service-report-${record.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (serviceRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No service history</h3>
        <p className="text-muted-foreground">
          Your completed services will appear here once you start redeeming vouchers.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {serviceRecords.map((record) => (
        <Card key={record.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Service #{record.id}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Voucher: {record.voucherId}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(record.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(record.status)}>
                  <span className="capitalize">{record.status}</span>
                </Badge>
                <Badge className={getPaymentStatusColor(record.paymentStatus)}>
                  <span className="capitalize">{record.paymentStatus}</span>
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{record.beneficiaryName}</p>
                  <p className="text-sm text-muted-foreground">{record.serviceType}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold text-primary">${record.amount}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Service fee</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{record.serviceNotes}</p>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-muted-foreground">
                  Completed: {new Date(record.completedAt).toLocaleString()}
                </span>
                <Button variant="outline" size="sm" onClick={() => downloadServiceReport(record)}>
                  <Download className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Service Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Service Details</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedRecord(null)}>
                  Close
                </Button>
              </div>
              <CardDescription>Service Record #{selectedRecord.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Voucher ID</Label>
                  <p>{selectedRecord.voucherId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Case ID</Label>
                  <p>{selectedRecord.caseId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Beneficiary</Label>
                  <p>{selectedRecord.beneficiaryName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Type</Label>
                  <p>{selectedRecord.serviceType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Fee</Label>
                  <p className="text-lg font-bold text-primary">${selectedRecord.amount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    <span className="capitalize">{selectedRecord.status}</span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Status</Label>
                  <Badge className={getPaymentStatusColor(selectedRecord.paymentStatus)}>
                    <span className="capitalize">{selectedRecord.paymentStatus}</span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Completed Date</Label>
                  <p>{new Date(selectedRecord.completedAt).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Service Notes</Label>
                <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">
                  {selectedRecord.serviceNotes}
                </p>
              </div>
              <Button onClick={() => downloadServiceReport(selectedRecord)} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Service Report
              </Button>
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
