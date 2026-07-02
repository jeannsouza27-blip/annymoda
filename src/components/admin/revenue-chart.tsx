"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCurrency } from "@/lib/format"

interface RevenueChartProps {
  data: { date: string; totalCents: number }[]
}

const chartConfig = {
  totalCents: {
    label: "Receita",
    color: "var(--gold-500)",
  },
} satisfies ChartConfig

function formatShortDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`)
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(d)
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita nos últimos 30 dias</CardTitle>
        <CardDescription>Pedidos pagos, em processamento, enviados ou entregues</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            Sem dados suficientes ainda.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-totalCents)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-totalCents)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatShortDate}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={72}
                tickFormatter={(value: number) => formatCurrency(value)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => formatShortDate(String(label))}
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      " Receita",
                    ]}
                  />
                }
              />
              <Area
                dataKey="totalCents"
                type="monotone"
                fill="url(#fillRevenue)"
                stroke="var(--color-totalCents)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
