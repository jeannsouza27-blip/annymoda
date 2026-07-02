"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { OrderStatus } from "@prisma/client"
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
import { ORDER_STATUS_LABELS } from "@/components/admin/order-status"

interface OrdersStatusChartProps {
  data: { status: OrderStatus; count: number }[]
}

const chartConfig = {
  count: {
    label: "Pedidos",
    color: "var(--gold-500)",
  },
} satisfies ChartConfig

export function OrdersStatusChart({ data }: OrdersStatusChartProps) {
  const chartData = data.map((d) => ({
    status: ORDER_STATUS_LABELS[d.status],
    count: d.count,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos por status</CardTitle>
        <CardDescription>Distribuição de todos os pedidos</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            Sem dados suficientes ainda.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart data={chartData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="status"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={32} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
