"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Mic, MapPin, X, Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CaseData {
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
  photo: File | null
  voiceRecording: Blob | null
  location: { lat: number; lng: number } | null
}

export function CaseRegistrationForm() {
  const [formData, setFormData] = useState<CaseData>({
    beneficiaryName: "",
    age: "",
    gender: "",
    contactNumber: "",
    address: "",
    urgencyLevel: "",
    assistanceType: [],
    description: "",
    medicalCondition: "",
    estimatedCost: "",
    photo: null,
    voiceRecording: null,
    location: null,
  })

  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const assistanceTypes = ["Food", "Medical", "Shelter", "Education", "Transportation", "Clothing", "Emergency"]

  const handleInputChange = (field: keyof CaseData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAssistanceTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      assistanceType: prev.assistanceType.includes(type)
        ? prev.assistanceType.filter((t) => t !== type)
        : [...prev.assistanceType, type],
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }))
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }))
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
        setFormData((prev) => ({ ...prev, voiceRecording: blob }))
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

  const removeRecording = () => {
    setFormData((prev) => ({ ...prev, voiceRecording: null }))
    setRecordingTime(0)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }))
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

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate case ID
    const caseId = `AID-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Store case data (in real app, send to backend)
    const existingCases = JSON.parse(localStorage.getItem("volunteerCases") || "[]")
    const newCase = {
      id: caseId,
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
      volunteerId: JSON.parse(localStorage.getItem("user") || "{}").id,
    }
    localStorage.setItem("volunteerCases", JSON.stringify([...existingCases, newCase]))

    toast({
      title: "Case registered successfully!",
      description: `Case ID: ${caseId}. Your case is now pending NGO verification.`,
    })

    // Reset form
    setFormData({
      beneficiaryName: "",
      age: "",
      gender: "",
      contactNumber: "",
      address: "",
      urgencyLevel: "",
      assistanceType: [],
      description: "",
      medicalCondition: "",
      estimatedCost: "",
      photo: null,
      voiceRecording: null,
      location: null,
    })
    setPhotoPreview(null)
    setRecordingTime(0)
    setIsSubmitting(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Beneficiary Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Beneficiary Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="beneficiaryName">Full Name *</Label>
            <Input
              id="beneficiaryName"
              placeholder="Enter beneficiary's full name"
              value={formData.beneficiaryName}
              onChange={(e) => handleInputChange("beneficiaryName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              type="tel"
              placeholder="Enter contact number"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange("contactNumber", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            placeholder="Enter complete address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Assistance Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Assistance Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="urgencyLevel">Urgency Level *</Label>
            <Select
              value={formData.urgencyLevel}
              onValueChange={(value) => handleInputChange("urgencyLevel", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedCost">Estimated Cost (USD)</Label>
            <Input
              id="estimatedCost"
              type="number"
              placeholder="Enter estimated cost"
              value={formData.estimatedCost}
              onChange={(e) => handleInputChange("estimatedCost", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Assistance Type *</Label>
          <div className="flex flex-wrap gap-2">
            {assistanceTypes.map((type) => (
              <Badge
                key={type}
                variant={formData.assistanceType.includes(type) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleAssistanceTypeToggle(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe the situation and assistance needed"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalCondition">Medical Condition (if applicable)</Label>
          <Textarea
            id="medicalCondition"
            placeholder="Describe any medical conditions or health issues"
            value={formData.medicalCondition}
            onChange={(e) => handleInputChange("medicalCondition", e.target.value)}
          />
        </div>
      </div>

      {/* Media and Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">Documentation</h3>

        {/* Photo Upload */}
        <div className="space-y-2">
          <Label>Photo *</Label>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              required={!formData.photo}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={!!formData.photo}
            >
              <Camera className="h-4 w-4 mr-2" />
              {formData.photo ? "Photo Uploaded" : "Upload Photo"}
            </Button>
            {formData.photo && (
              <Button type="button" variant="outline" size="sm" onClick={removePhoto}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {photoPreview && (
            <Card className="w-fit">
              <CardContent className="p-2">
                <img
                  src={photoPreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Voice Recording */}
        <div className="space-y-2">
          <Label>Voice Recording</Label>
          <div className="flex items-center gap-4">
            {!formData.voiceRecording ? (
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
                <Button type="button" variant="outline" size="sm" onClick={removeRecording}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* GPS Location */}
        <div className="space-y-2">
          <Label>GPS Location</Label>
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" onClick={getCurrentLocation}>
              <MapPin className="h-4 w-4 mr-2" />
              {formData.location ? "Location Captured" : "Capture Location"}
            </Button>
            {formData.location && (
              <Badge variant="secondary">
                Lat: {formData.location.lat.toFixed(6)}, Lng: {formData.location.lng.toFixed(6)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Registering Case..." : "Register Case"}
      </Button>
    </form>
  )
}
