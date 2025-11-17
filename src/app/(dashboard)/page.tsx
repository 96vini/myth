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
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted-foreground mb-2">
          Dashboard
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Visão geral</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Acompanhe suas métricas e performance em tempo real
        </p>
      </div>

      {/* Grid de métricas */}
      <div className="space-y-6">
        {/* Primeira linha - 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="w-full">
            <Conversion />
          </div>
          <div className="w-full">
            <LeadsReceived />
          </div>
          <div className="w-full">
            <CompletedSales />
          </div>
          <div className="w-full">
            <AverageTicket />
          </div>
        </div>

        {/* Segunda linha - card full width */}
        <div className="w-full">
          <PendingFollowUps />
        </div>
      </div>
    </div>
  )
}
