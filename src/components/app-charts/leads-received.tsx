"use client"

import { Line, LineChart, XAxis, YAxis } from "recharts"
import { AppCard } from "../app-card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Jan", average: 245, fullMonth: "Janeiro" },
  { month: "Fev", average: 280, fullMonth: "Fevereiro" },
  { month: "Mar", average: 320, fullMonth: "Março" },
  { month: "Abr", average: 295, fullMonth: "Abril" },
  { month: "Mai", average: 350, fullMonth: "Maio" },
  { month: "Jun", average: 380, fullMonth: "Junho" },
  { month: "Jul", average: 365, fullMonth: "Julho" },
  { month: "Ago", average: 410, fullMonth: "Agosto" },
  { month: "Set", average: 395, fullMonth: "Setembro" },
  { month: "Out", average: 420, fullMonth: "Outubro" },
  { month: "Nov", average: 450, fullMonth: "Novembro" },
  { month: "Dez", average: 400, fullMonth: "Dezembro" },
]

const chartConfig = {
  average: {
    label: "Ticket Médio",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function LeadsReceived() {
  const latestValue = chartData[chartData.length - 1].average
  const previousValue = chartData[chartData.length - 2].average
  const lineColor = latestValue > previousValue ? "var(--color-average)" : "#ED333E"

  return (
    <AppCard>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Leads Recebidos</h3>
          </div>
          <p className="text-sm mt-1 text-muted-foreground">Últimos 12 meses</p>
        </div>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            data={chartData}
            margin={{
              left: 0,
              right: 10,
              top: 10,
              bottom: 0,
            }}
          >
            <XAxis hide />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
                    <div className="text-sm font-medium text-muted-foreground">
                      {data.fullMonth || data.month}
                    </div>
                    <div className="text-lg font-semibold">
                      R$ {payload[0].value?.toLocaleString('pt-BR')}
                    </div>
                  </div>
                )
              }}
            />
            <Line
              dataKey="average"
              type="monotone"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </AppCard>
  )
}