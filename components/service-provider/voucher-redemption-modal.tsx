"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Camera, Mic, MapPin, X, Square, Upload, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoucherRedemptionModalProps {
  voucher: {
    id: string
    caseId: string
    beneficiaryName: string
    serviceType: string
    amount: number
    description: string
  }
  onClose: () => void
  onComplete: () => void
}

export function VoucherRedemptionModal({ voucher, onClose, onComplete }: VoucherRedemptionModalProps) {
  const [proofData, setProofData] = useState({
    servicePhoto: null as File | null,
    voiceRecording: null as Blob | null,
    serviceDocument: null as File | null,
    serviceNotes: "",
    beneficiaryConfirmation: "",
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const photoInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofData((prev) => ({ ...prev, servicePhoto: file }))
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofData((prev) => ({ ...prev, serviceDocument: file }))
      toast({
        title: "Document Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      })
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        setProofData((prev) => ({ ...prev, voiceRecording: blob }))
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          toast({
            title: "Location captured",
            description: "GPS coordinates have been recorded successfully.",
          })
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get your location. Please enable GPS.",
            variant: "destructive",
          })
        },
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate required fields
    if (!proofData.servicePhoto || !proofData.serviceNotes || !location) {
      toast({
        title: "Missing Information",
        description: "Please provide service photo, notes, and GPS location.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate submission process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Store redemption data
    const redemptionData = {
      voucherId: voucher.id,
      caseId: voucher.caseId,
      providerId: JSON.parse(localStorage.getItem("user") || "{}").id,
      serviceType: voucher.serviceType,
      amount: voucher.amount,
      proofData: {
        ...proofData,
        location,
        timestamp: new Date().toISOString(),
      },
      status: "completed",
      redeemedAt: new Date().toISOString(),
    }

    const existingRedemptions = JSON.parse(localStorage.getItem("voucherRedemptions") || "[]")
    localStorage.setItem("voucherRedemptions", JSON.stringify([...existingRedemptions, redemptionData]))

    toast({
      title: "Voucher Redeemed Successfully!",
      description: `Service for ${voucher.beneficiaryName} has been completed and verified.`,
    })

    setIsSubmitting(false)
    onComplete()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Redeem Voucher - {voucher.id}</CardTitle>
              <CardDescription>
                Provide service to {voucher.beneficiaryName} and upload proof of completion
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Service Type</Label>
                  <p>{voucher.serviceType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Service Value</Label>
                  <p className="text-lg font-bold text-primary">${voucher.amount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Beneficiary</Label>
                  <p>{voucher.beneficiaryName}</p>
                </div>
              </div>
            </div>

            {/* Multi-Proof Upload */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary">Service Verification</h3>

              {/* Service Photo */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Service Photo *</Label>
                <div className="flex items-center gap-4">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={!!proofData.servicePhoto}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {proofData.servicePhoto ? "Photo Uploaded" : "Take Service Photo"}
                  </Button>
                  {proofData.servicePhoto && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProofData((prev) => ({ ...prev, servicePhoto: null }))
                        setPhotoPreview(null)
                        if (photoInputRef.current) photoInputRef.current.value = ""
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {photoPreview && (
                  <div className="w-fit">
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Service proof"
                      className="w-48 h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Take a photo showing the beneficiary receiving the service with the voucher visible
                </p>
              </div>

              {/* Voice Recording */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Voice Confirmation</Label>
                <div className="flex items-center gap-4">
                  {!proofData.voiceRecording ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={isRecording ? "animate-pulse" : ""}
                    >
                      {isRecording ? (
                        <>
                          <Square className="h-4 w-4 mr-2" />
                          Stop ({formatTime(recordingTime)})
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Recording saved ({formatTime(recordingTime)})</Badge>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProofData((prev) => ({ ...prev, voiceRecording: null }))
                          setRecordingTime(0)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Record a brief confirmation from the beneficiary acknowledging service completion
                </p>
              </div>

              {/* GPS Location */}
              <div className="space-y-4">
                <Label className="text-base font-medium">GPS Location *</Label>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" onClick={getCurrentLocation}>
                    <MapPin className="h-4 w-4 mr-2" />
                    {location ? "Location Captured" : "Capture Location"}
                  </Button>
                  {location && (
                    <Badge variant="secondary">
                      Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Capture GPS coordinates to verify service location</p>
              </div>

              {/* Service Document */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Service Document</Label>
                <div className="flex items-center gap-4">
                  <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => documentInputRef.current?.click()}
                    disabled={!!proofData.serviceDocument}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {proofData.serviceDocument ? "Document Uploaded" : "Upload Document"}
                  </Button>
                  {proofData.serviceDocument && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{proofData.serviceDocument.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProofData((prev) => ({ ...prev, serviceDocument: null }))
                          if (documentInputRef.current) documentInputRef.current.value = ""
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload invoice, prescription, or other service-related documents
                </p>
              </div>

              {/* Service Notes */}
              <div className="space-y-2">
                <Label htmlFor="serviceNotes">Service Notes *</Label>
                <Textarea
                  id="serviceNotes"
                  placeholder="Describe the service provided, any observations, and completion details..."
                  value={proofData.serviceNotes}
                  onChange={(e) => setProofData((prev) => ({ ...prev, serviceNotes: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              {/* Beneficiary Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="beneficiaryConfirmation">Beneficiary Confirmation</Label>
                <Input
                  id="beneficiaryConfirmation"
                  placeholder="Beneficiary signature or confirmation code"
                  value={proofData.beneficiaryConfirmation}
                  onChange={(e) => setProofData((prev) => ({ ...prev, beneficiaryConfirmation: e.target.value }))}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Processing Redemption..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Service & Redeem Voucher
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
