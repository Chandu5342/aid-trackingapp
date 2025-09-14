"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Calendar, DollarSign } from "lucide-react"

interface Donation {
  id: string
  caseId: string
  caseName: string
  amount: number
  createdAt: string
  status: string
}

export function DonationHistory() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)

  useEffect(() => {
    const storedDonations = JSON.parse(localStorage.getItem("userDonations") || "[]")
    setDonations(
      storedDonations.sort(
        (a: Donation, b: Donation) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    )
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "pending":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const downloadReceipt = (donation: Donation) => {
    // Simulate receipt download
    const receiptData = {
      donationId: donation.id,
      caseId: donation.caseId,
      beneficiary: donation.caseName,
      amount: donation.amount,
      serviceFee: donation.amount * 0.09,
      netAmount: donation.amount * 0.91,
      date: donation.createdAt,
      status: donation.status,
    }

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `donation-receipt-${donation.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
        <p className="text-muted-foreground">
          Your donation history will appear here once you make your first donation.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <Card key={donation.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Donation #{donation.id}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-4 text-sm">
                    <span>To: {donation.caseName}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(donation.status)}>
                  <span className="capitalize">{donation.status}</span>
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setSelectedDonation(donation)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">${donation.amount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">
                  Net amount: ${(donation.amount * 0.91).toFixed(2)} • Service fee: $
                  {(donation.amount * 0.09).toFixed(2)}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadReceipt(donation)}>
                  <Download className="h-4 w-4 mr-1" />
                  Receipt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Donation Details</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedDonation(null)}>
                  Close
                </Button>
              </div>
              <CardDescription>Transaction #{selectedDonation.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Case ID</div>
                  <p>{selectedDonation.caseId}</p>
                </div>
                <div>
                  <div className="text-sm font-medium">Beneficiary</div>
                  <p>{selectedDonation.caseName}</p>
                </div>
                <div>
                  <div className="text-sm font-medium">Donation Amount</div>
                  <p className="text-lg font-bold text-primary">${selectedDonation.amount.toLocaleString()}</p>
                </div>
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <Badge className={getStatusColor(selectedDonation.status)}>
                    <span className="capitalize">{selectedDonation.status}</span>
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Donation Amount:</span>
                  <span>${selectedDonation.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee (9%):</span>
                  <span>-${(selectedDonation.amount * 0.09).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium border-t pt-2">
                  <span>Net Amount to Beneficiary:</span>
                  <span>${(selectedDonation.amount * 0.91).toFixed(2)}</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Transaction Date</div>
                <p>{new Date(selectedDonation.createdAt).toLocaleString()}</p>
              </div>
              <Button onClick={() => downloadReceipt(selectedDonation)} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
