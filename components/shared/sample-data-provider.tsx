"use client"

import { createContext, useContext, type ReactNode } from "react"
import { sampleUsers, sampleCases, sampleVouchers, sampleDonations, sampleSchemes } from "@/lib/sample-data"

interface SampleDataContextType {
  users: typeof sampleUsers
  cases: typeof sampleCases
  vouchers: typeof sampleVouchers
  donations: typeof sampleDonations
  schemes: typeof sampleSchemes
}

const SampleDataContext = createContext<SampleDataContextType | undefined>(undefined)

export function SampleDataProvider({ children }: { children: ReactNode }) {
  const value = {
    users: sampleUsers,
    cases: sampleCases,
    vouchers: sampleVouchers,
    donations: sampleDonations,
    schemes: sampleSchemes,
  }

  return <SampleDataContext.Provider value={value}>{children}</SampleDataContext.Provider>
}

export function useSampleData() {
  const context = useContext(SampleDataContext)
  if (context === undefined) {
    throw new Error("useSampleData must be used within a SampleDataProvider")
  }
  return context
}
