"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Heart, Shield, X, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DonationModalProps {
  case: {
    id: string
    beneficiaryName: string
    description: string
    fundingGoal: number
    currentFunding: number
    urgencyLevel: string
    assistanceType: string[]
  }
  onClose: () => void
  onDonationComplete: (amount: number) => void
}

export function DonationModal({ case: caseData, onClose, onDonationComplete }: DonationModalProps) {
  const [donationAmount, setDonationAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const remainingAmount = caseData.fundingGoal - caseData.currentFunding
  const suggestedAmounts = [25, 50, 100, 250, 500]

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount.toString())
  }

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    const amount = Number.parseFloat(donationAmount)
    if (amount <= 0 || amount > remainingAmount) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      })
      setIsProcessing(false)
      return
    }

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Calculate service fee (9%)
    const serviceFee = amount * 0.09
    const netAmount = amount - serviceFee

    toast({
      title: "Donation Successful!",
      description: `Thank you for donating $${amount}. $${netAmount.toFixed(
        2,
      )} will go directly to help ${caseData.beneficiaryName}.`,
    })

    onDonationComplete(amount)
    setIsProcessing(false)
  }

  const fundingPercentage = (caseData.currentFunding / caseData.fundingGoal) * 100

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>
                  Help {caseData.beneficiaryName} - {caseData.id}
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Case Summary */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex flex-wrap gap-2">
              {caseData.assistanceType.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{caseData.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Funding Progress</span>
                <span>
                  ${caseData.currentFunding.toLocaleString()} / ${caseData.fundingGoal.toLocaleString()}
                </span>
              </div>
              <Progress value={fundingPercentage} className="h-2" />
              <div className="text-sm text-muted-foreground">${remainingAmount.toLocaleString()} still needed</div>
            </div>
          </div>

          <form onSubmit={handleDonation} className="space-y-6">
            {/* Donation Amount */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Choose Donation Amount</Label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {suggestedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={donationAmount === amount.toString() ? "default" : "outline"}
                    onClick={() => handleAmountSelect(amount)}
                    disabled={amount > remainingAmount}
                    className="h-12"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customAmount">Custom Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="pl-10"
                    max={remainingAmount}
                    min="1"
                    required
                  />
                </div>
                {donationAmount && (
                  <div className="text-sm text-muted-foreground">
                    Service fee (9%): ${(Number.parseFloat(donationAmount) * 0.09).toFixed(2)} • Net amount: $
                    {(Number.parseFloat(donationAmount) * 0.91).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="debit-card">Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Card Details */}
            {(paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => handleCardInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => handleCardInputChange("number", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardInputChange("expiry", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                <Label htmlFor="anonymous" className="text-sm">
                  Make this donation anonymous
                </Label>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="h-4 w-4 text-green-600" />
              <div className="text-sm text-green-800">
                <strong>Secure Payment:</strong> Your payment information is encrypted and secure. Funds are held in
                escrow until service completion.
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isProcessing || !donationAmount || !paymentMethod}>
              {isProcessing ? (
                "Processing Payment..."
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  Donate ${donationAmount || "0"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
