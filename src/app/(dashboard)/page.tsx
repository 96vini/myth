"use client"

import { AverageTicket } from "@/components/app-charts/average-ticket"
import { CompletedSales } from "@/components/app-charts/completed-sales"
import { Conversion } from "@/components/app-charts/conversion"
import { LeadsReceived } from "@/components/app-charts/leads-received"
import { PendingFollowUps } from "@/components/app-charts/pending-follow-ups"

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto w-full flex justify-center flex-1 flex-col mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        <div className="w-full h-full">
          <Conversion />
        </div>
        <div className="w-full h-full">
          <LeadsReceived />
        </div>
        <div className="w-full h-full">
          <CompletedSales />
        </div>
        <div className="w-full h-full">
          <AverageTicket />
        </div>
        <div className="w-full h-full">
          <PendingFollowUps />
        </div>
      </div>
    </div>
  )
}
