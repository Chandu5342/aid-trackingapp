"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Scheme {
  id: string
  name: string
  description: string
  targetBeneficiaries: number
  fundingGoal: number
  currentFunding: number
  category: string
  status: "active" | "completed" | "paused"
  createdAt: string
  beneficiaries: string[]
}

export function SchemeManagement() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetBeneficiaries: "",
    fundingGoal: "",
    category: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadSchemes()
  }, [])

  const loadSchemes = () => {
    const storedSchemes = JSON.parse(localStorage.getItem("ngoSchemes") || "[]")
    setSchemes(storedSchemes)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const schemeData = {
      id: editingScheme?.id || `SCH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: formData.name,
      description: formData.description,
      targetBeneficiaries: Number.parseInt(formData.targetBeneficiaries),
      fundingGoal: Number.parseFloat(formData.fundingGoal),
      currentFunding: editingScheme?.currentFunding || 0,
      category: formData.category,
      status: editingScheme?.status || "active",
      createdAt: editingScheme?.createdAt || new Date().toISOString(),
      beneficiaries: editingScheme?.beneficiaries || [],
    }

    const existingSchemes = JSON.parse(localStorage.getItem("ngoSchemes") || "[]")
    let updatedSchemes

    if (editingScheme) {
      updatedSchemes = existingSchemes.map((s: Scheme) => (s.id === editingScheme.id ? schemeData : s))
      toast({
        title: "Scheme Updated",
        description: `${schemeData.name} has been updated successfully.`,
      })
    } else {
      updatedSchemes = [...existingSchemes, schemeData]
      toast({
        title: "Scheme Created",
        description: `${schemeData.name} has been created successfully.`,
      })
    }

    localStorage.setItem("ngoSchemes", JSON.stringify(updatedSchemes))
    setSchemes(updatedSchemes)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      targetBeneficiaries: "",
      fundingGoal: "",
      category: "",
    })
    setShowCreateForm(false)
    setEditingScheme(null)
  }

  const handleEdit = (scheme: Scheme) => {
    setFormData({
      name: scheme.name,
      description: scheme.description,
      targetBeneficiaries: scheme.targetBeneficiaries.toString(),
      fundingGoal: scheme.fundingGoal.toString(),
      category: scheme.category,
    })
    setEditingScheme(scheme)
    setShowCreateForm(true)
  }

  const handleDelete = (schemeId: string) => {
    const updatedSchemes = schemes.filter((s) => s.id !== schemeId)
    localStorage.setItem("ngoSchemes", JSON.stringify(updatedSchemes))
    setSchemes(updatedSchemes)
    toast({
      title: "Scheme Deleted",
      description: "The scheme has been deleted successfully.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "paused":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medical":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "food":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "shelter":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "education":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Aid Distribution Schemes</h3>
          <p className="text-sm text-muted-foreground">Create and manage schemes for grouping beneficiaries</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Scheme
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingScheme ? "Edit Scheme" : "Create New Scheme"}</CardTitle>
            <CardDescription>
              {editingScheme ? "Update scheme details" : "Set up a new aid distribution scheme"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Scheme Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Meals for 50 people"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="shelter">Shelter</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the scheme and its objectives"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetBeneficiaries">Target Beneficiaries *</Label>
                  <Input
                    id="targetBeneficiaries"
                    type="number"
                    placeholder="Number of people to help"
                    value={formData.targetBeneficiaries}
                    onChange={(e) => handleInputChange("targetBeneficiaries", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundingGoal">Funding Goal (USD) *</Label>
                  <Input
                    id="fundingGoal"
                    type="number"
                    placeholder="Total funding needed"
                    value={formData.fundingGoal}
                    onChange={(e) => handleInputChange("fundingGoal", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingScheme ? "Update Scheme" : "Create Scheme"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Schemes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{scheme.name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(scheme)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(scheme.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(scheme.status)}>{scheme.status}</Badge>
                <Badge className={getCategoryColor(scheme.category)}>{scheme.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{scheme.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Beneficiaries
                  </span>
                  <span>
                    {scheme.beneficiaries.length}/{scheme.targetBeneficiaries}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((scheme.beneficiaries.length / scheme.targetBeneficiaries) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Funding Progress</span>
                  <span>
                    ${scheme.currentFunding.toLocaleString()}/${scheme.fundingGoal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((scheme.currentFunding / scheme.fundingGoal) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Created: {new Date(scheme.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {schemes.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No schemes created yet</h3>
          <p className="text-muted-foreground mb-4">Create your first aid distribution scheme to get started.</p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Scheme
          </Button>
        </div>
      )}
    </div>
  )
}
