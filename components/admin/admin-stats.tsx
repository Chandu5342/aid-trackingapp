"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, Heart, Building2, UserCheck, TrendingUp, AlertTriangle, DollarSign, Activity } from "lucide-react"

interface AdminStatsProps {
  data: {
    totalUsers: number
    totalCases: number
    totalDonations: number
    activeVouchers: number
    pendingVerifications: number
    fraudAlerts: number
    systemHealth: number
  }
}

export default function AdminStats({ data }: AdminStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: data.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Active Cases",
      value: data.totalCases.toLocaleString(),
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Total Donations",
      value: `₹${(data.totalDonations / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+23%",
      changeType: "positive",
    },
    {
      title: "Active Vouchers",
      value: data.activeVouchers.toLocaleString(),
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+5%",
      changeType: "positive",
    },
    {
      title: "Pending Verifications",
      value: data.pendingVerifications.toLocaleString(),
      icon: Building2,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "-3%",
      changeType: "negative",
    },
    {
      title: "Fraud Alerts",
      value: data.fraudAlerts.toLocaleString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "-15%",
      changeType: "positive",
    },
    {
      title: "System Health",
      value: `${data.systemHealth}%`,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+0.2%",
      changeType: "positive",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className={`w-3 h-3 ${stat.changeType === "positive" ? "text-green-500" : "text-red-500"}`} />
              <span className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} from last month
              </span>
            </div>
            {stat.title === "System Health" && <Progress value={data.systemHealth} className="mt-2 h-2" />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
