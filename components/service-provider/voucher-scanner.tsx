"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { VoucherRedemptionModal } from "@/components/service-provider/voucher-redemption-modal"
import { QrCode, Camera, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ScannedVoucher {
  id: string
  caseId: string
  beneficiaryName: string
  serviceType: string
  amount: number
  validUntil: string
  status: string
  description: string
}

export function VoucherScanner() {
  const [voucherCode, setVoucherCode] = useState("")
  const [scannedVoucher, setScannedVoucher] = useState<ScannedVoucher | null>(null)
  const [showRedemptionModal, setShowRedemptionModal] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()

  // Mock voucher data for demonstration
  const mockVouchers: { [key: string]: ScannedVoucher } = {
    "VCH-001": {
      id: "VCH-001",
      caseId: "AID-001",
      beneficiaryName: "John Doe",
      serviceType: "Medical Consultation",
      amount: 150,
      validUntil: "2024-12-31",
      status: "active",
      description: "General medical consultation and basic health checkup",
    },
    "VCH-002": {
      id: "VCH-002",
      caseId: "AID-002",
      beneficiaryName: "Jane Smith",
      serviceType: "Prescription Medication",
      amount: 75,
      validUntil: "2024-12-31",
      status: "active",
      description: "Prescription medication for chronic condition management",
    },
    "VCH-003": {
      id: "VCH-003",
      caseId: "AID-003",
      beneficiaryName: "Bob Wilson",
      serviceType: "Emergency Treatment",
      amount: 300,
      validUntil: "2024-12-31",
      status: "active",
      description: "Emergency medical treatment and stabilization",
    },
  }

  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!voucherCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid voucher code.",
        variant: "destructive",
      })
      return
    }

    const voucher = mockVouchers[voucherCode.toUpperCase()]
    if (voucher) {
      setScannedVoucher(voucher)
      toast({
        title: "Voucher Found",
        description: `Voucher for ${voucher.beneficiaryName} loaded successfully.`,
      })
    } else {
      toast({
        title: "Voucher Not Found",
        description: "The voucher code you entered is not valid or has expired.",
        variant: "destructive",
      })
    }
  }

  const handleQRScan = async () => {
    setIsScanning(true)
    // Simulate QR code scanning
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate successful scan with random voucher
    const voucherIds = Object.keys(mockVouchers)
    const randomVoucherId = voucherIds[Math.floor(Math.random() * voucherIds.length)]
    const voucher = mockVouchers[randomVoucherId]

    setScannedVoucher(voucher)
    setVoucherCode(voucher.id)
    setIsScanning(false)

    toast({
      title: "QR Code Scanned",
      description: `Voucher for ${voucher.beneficiaryName} scanned successfully.`,
    })
  }

  const handleRedeemVoucher = () => {
    if (scannedVoucher) {
      setShowRedemptionModal(true)
    }
  }

  const handleRedemptionComplete = () => {
    setScannedVoucher(null)
    setVoucherCode("")
    setShowRedemptionModal(false)
    toast({
      title: "Service Completed",
      description: "Voucher has been redeemed and service marked as completed.",
    })
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

  return (
    <div className="space-y-6">
      {/* Scanner Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>Scan voucher QR codes with your camera</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
              {isScanning ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Scanning QR code...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Position QR code in camera view</p>
                </div>
              )}
            </div>
            <Button onClick={handleQRScan} disabled={isScanning} className="w-full">
              {isScanning ? "Scanning..." : "Start QR Scan"}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Entry */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Entry</CardTitle>
            <CardDescription>Enter voucher code manually if QR scan fails</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualEntry} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voucherCode">Voucher Code</Label>
                <Input
                  id="voucherCode"
                  placeholder="Enter voucher code (e.g., VCH-001)"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button type="submit" className="w-full">
                Lookup Voucher
              </Button>
            </form>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Demo codes:</strong> VCH-001, VCH-002, VCH-003
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scanned Voucher Details */}
      {scannedVoucher && (
        <Card className="animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Voucher Details</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setScannedVoucher(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Review voucher information before redemption</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Voucher ID</Label>
                  <p className="font-mono text-lg">{scannedVoucher.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Beneficiary</Label>
                  <p>{scannedVoucher.beneficiaryName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Type</Label>
                  <Badge className={getServiceTypeColor(scannedVoucher.serviceType)}>
                    {scannedVoucher.serviceType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Value</Label>
                  <p className="text-2xl font-bold text-primary">${scannedVoucher.amount}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Case ID</Label>
                  <p>{scannedVoucher.caseId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Valid Until</Label>
                  <p>{new Date(scannedVoucher.validUntil).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="secondary" className="capitalize">
                    {scannedVoucher.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{scannedVoucher.description}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleRedeemVoucher} className="w-full" size="lg">
                Redeem Voucher & Provide Service
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Redemption Modal */}
      {showRedemptionModal && scannedVoucher && (
        <VoucherRedemptionModal
          voucher={scannedVoucher}
          onClose={() => setShowRedemptionModal(false)}
          onComplete={handleRedemptionComplete}
        />
      )}
    </div>
  )
}
