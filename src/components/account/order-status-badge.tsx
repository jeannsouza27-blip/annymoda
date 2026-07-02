import type { OrderStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Pendente",
    className: "bg-muted text-muted-foreground",
  },
  PAID: {
    label: "Pago",
    className: "bg-gold-500/15 text-gold-700 dark:text-gold-400",
  },
  PROCESSING: {
    label: "Em processamento",
    className: "bg-secondary text-secondary-foreground",
  },
  SHIPPED: {
    label: "Enviado",
    className: "bg-primary/10 text-primary",
  },
  DELIVERED: {
    label: "Entregue",
    className: "bg-primary text-primary-foreground",
  },
  CANCELED: {
    label: "Cancelado",
    className: "bg-destructive/10 text-destructive",
  },
  REFUNDED: {
    label: "Reembolsado",
    className: "border border-destructive/30 bg-transparent text-destructive",
  },
}

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const config = statusConfig[status]
  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
