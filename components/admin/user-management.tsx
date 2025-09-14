"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, MoreHorizontal, Eye } from "lucide-react"

// Sample user data
const sampleUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@volunteer.com",
    role: "volunteer",
    status: "active",
    cases: 23,
    joinDate: "2024-01-15",
    location: "Mumbai",
  },
  {
    id: 2,
    name: "HelpIndia NGO",
    email: "contact@helpindia.org",
    role: "ngo",
    status: "active",
    verified: 156,
    joinDate: "2023-11-20",
    location: "Delhi",
  },
  {
    id: 3,
    name: "Rajesh Patel",
    email: "rajesh@donor.com",
    role: "donor",
    status: "active",
    donated: 45000,
    joinDate: "2024-02-10",
    location: "Bangalore",
  },
  {
    id: 4,
    name: "City Hospital",
    email: "admin@cityhospital.com",
    role: "service_provider",
    status: "active",
    services: 89,
    joinDate: "2023-12-05",
    location: "Chennai",
  },
  {
    id: 5,
    name: "Admin User",
    email: "admin@aidtrack.com",
    role: "admin",
    status: "active",
    permissions: "full",
    joinDate: "2023-10-01",
    location: "Mumbai",
  },
  {
    id: 6,
    name: "John Doe",
    email: "john@volunteer.com",
    role: "volunteer",
    status: "suspended",
    cases: 5,
    joinDate: "2024-03-01",
    location: "Kolkata",
  },
]

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  const filteredUsers = sampleUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "volunteer":
        return "bg-blue-100 text-blue-700"
      case "ngo":
        return "bg-green-100 text-green-700"
      case "donor":
        return "bg-purple-100 text-purple-700"
      case "service_provider":
        return "bg-orange-100 text-orange-700"
      case "admin":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "suspended":
        return "bg-red-100 text-red-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Total Users", value: "1,247", color: "text-blue-600" },
          { label: "Volunteers", value: "456", color: "text-green-600" },
          { label: "NGOs", value: "89", color: "text-purple-600" },
          { label: "Donors", value: "567", color: "text-orange-600" },
          { label: "Service Providers", value: "135", color: "text-red-600" },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            User Management
          </CardTitle>
          <CardDescription>Manage all platform users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-md bg-white"
            >
              <option value="all">All Roles</option>
              <option value="volunteer">Volunteers</option>
              <option value="ngo">NGOs</option>
              <option value="donor">Donors</option>
              <option value="service_provider">Service Providers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRoleColor(user.role)}>{user.role.replace("_", " ")}</Badge>
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      <span className="text-xs text-slate-500">{user.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    {user.role === "volunteer" && <p className="text-slate-600">{user.cases} cases</p>}
                    {user.role === "ngo" && <p className="text-slate-600">{user.verified} verified</p>}
                    {user.role === "donor" && <p className="text-slate-600">₹{user.donated?.toLocaleString()}</p>}
                    {user.role === "service_provider" && <p className="text-slate-600">{user.services} services</p>}
                    <p className="text-xs text-slate-500">Joined {user.joinDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
