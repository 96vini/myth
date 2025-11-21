"use client"

import { AverageTicket } from "@/components/app-charts/average-ticket"
import { CompletedSales } from "@/components/app-charts/completed-sales"
import { Conversion } from "@/components/app-charts/conversion"
import { LeadsReceived } from "@/components/app-charts/leads-received"
import { PendingFollowUps } from "@/components/app-charts/pending-follow-ups"

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Visão geral das métricas
        </p>
      </div>

      {/* Grid de métricas */}
      <div className="space-y-6">
        {/* Primeira linha - 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Conversion />
          <LeadsReceived />
          <CompletedSales />
          <AverageTicket />
        </div>

        {/* Segunda linha - card full width */}
        <PendingFollowUps />
      </div>
    </div>
  )
}
