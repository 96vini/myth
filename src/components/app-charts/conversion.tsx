"use client"

import { Cell, Pie, PieChart } from "recharts"
import { AppCard } from "../app-card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { name: "Convertidos", value: 68, fill: "hsl(var(--primary))" },
  { name: "Não Convertidos", value: 32, fill: "hsl(var(--muted))" },
]

const chartConfig = {
  converted: {
    label: "Convertidos",
    color: "hsl(var(--primary))",
  },
  notConverted: {
    label: "Não Convertidos",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

export function Conversion() {
  const convertedValue = chartData[0].value
  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <AppCard>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Conversão</h3>
            <span className="text-lg text-primary">
              {convertedValue}<span className="text-sm">%</span>
            </span>
          </div>
          <p className="text-sm mt-1 text-muted-foreground">Taxa de conversão</p>
        </div>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Convertidos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted" />
            <span className="text-muted-foreground">Não Convertidos</span>
          </div>
        </div>
      </div>
    </AppCard>
  )
}