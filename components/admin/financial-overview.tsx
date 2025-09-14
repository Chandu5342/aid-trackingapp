"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, PieChart, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"

// Sample financial data
const financialData = {
  totalDonations: 1567800,
  serviceFees: 141102, // 9% of donations
  disbursed: 1426698,
  pending: 89450,
  monthlyGrowth: 23.5,
  transactionVolume: 2847,
  averageDonation: 551,
  topDonors: [
    { name: "Rajesh Patel", amount: 45000, donations: 12 },
    { name: "Priya Sharma", amount: 38000, donations: 8 },
    { name: "Tech Corp Foundation", amount: 125000, donations: 3 },
    { name: "Anonymous Donor", amount: 67000, donations: 15 },
  ],
  categoryBreakdown: [
    { category: "Medical", amount: 567800, percentage: 36.2 },
    { category: "Food & Shelter", amount: 423400, percentage: 27.0 },
    { category: "Education", amount: 312600, percentage: 19.9 },
    { category: "Emergency Aid", amount: 264000, percentage: 16.9 },
  ],
  recentTransactions: [
    {
      id: 1,
      type: "donation",
      amount: 5000,
      donor: "Rajesh P.",
      case: "CASE-2024-0892",
      time: "2 min ago",
      status: "completed",
    },
    {
      id: 2,
      type: "disbursement",
      amount: 2500,
      provider: "City Hospital",
      voucher: "VOUCH-1234",
      time: "5 min ago",
      status: "completed",
    },
    { id: 3, type: "service_fee", amount: 450, case: "CASE-2024-0891", time: "8 min ago", status: "collected" },
    {
      id: 4,
      type: "donation",
      amount: 10000,
      donor: "Anonymous",
      case: "CASE-2024-0890",
      time: "12 min ago",
      status: "pending",
    },
  ],
}

export default function FinancialOverview() {
  return (
    <div className="space-y-6">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Donations</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{(financialData.totalDonations / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+{financialData.monthlyGrowth}% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Service Fees</p>
                <p className="text-2xl font-bold text-blue-600">₹{(financialData.serviceFees / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-slate-600">9% of donations</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Disbursed</p>
                <p className="text-2xl font-bold text-emerald-600">₹{(financialData.disbursed / 100000).toFixed(1)}L</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-slate-600">91% of donations</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">₹{(financialData.pending / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-slate-600">Awaiting processing</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-600" />
              Donation Categories
            </CardTitle>
            <CardDescription>Breakdown by service category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {financialData.categoryBreakdown.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.category}</span>
                  <span className="text-sm text-slate-600">
                    ₹{(category.amount / 1000).toFixed(0)}K ({category.percentage}%)
                  </span>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Donors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Top Donors
            </CardTitle>
            <CardDescription>Highest contributing donors this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {financialData.topDonors.map((donor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-medium text-emerald-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{donor.name}</p>
                    <p className="text-sm text-slate-600">{donor.donations} donations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">₹{donor.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            Recent Transactions
          </CardTitle>
          <CardDescription>Latest financial activity across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === "donation"
                        ? "bg-green-100"
                        : transaction.type === "disbursement"
                          ? "bg-blue-100"
                          : "bg-purple-100"
                    }`}
                  >
                    {transaction.type === "donation" && <ArrowDownRight className="w-4 h-4 text-green-600" />}
                    {transaction.type === "disbursement" && <ArrowUpRight className="w-4 h-4 text-blue-600" />}
                    {transaction.type === "service_fee" && <Wallet className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {transaction.type === "donation" && `Donation from ${transaction.donor}`}
                      {transaction.type === "disbursement" && `Payment to ${transaction.provider}`}
                      {transaction.type === "service_fee" && "Service Fee Collected"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {transaction.case && `Case: ${transaction.case}`}
                      {transaction.voucher && `Voucher: ${transaction.voucher}`}
                      {transaction.type === "service_fee" && `From: ${transaction.case}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">₹{transaction.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : transaction.status === "pending"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                      }
                    >
                      {transaction.status}
                    </Badge>
                    <span className="text-xs text-slate-500">{transaction.time}</span>
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
