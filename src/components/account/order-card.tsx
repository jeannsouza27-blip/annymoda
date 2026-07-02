import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { listOrdersForUser } from "@/services/order-service"
import { formatCurrency, formatDate } from "@/lib/format"
import { OrderStatusBadge } from "@/components/account/order-status-badge"
import { Card, CardContent } from "@/components/ui/card"

type Order = Awaited<ReturnType<typeof listOrdersForUser>>[number]

export function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Link href={`/minha-conta/pedidos/${order.id}`} className="block">
      <Card className="transition-colors hover:bg-muted/30">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-heading text-base text-foreground">Pedido {order.orderNumber}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)} · {itemCount} {itemCount === 1 ? "item" : "itens"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <p className="font-heading text-lg text-foreground">{formatCurrency(order.totalCents)}</p>
            <ArrowRight className="size-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
