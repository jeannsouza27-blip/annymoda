import type { OrderStatus } from "@prisma/client"

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  PROCESSING: "Em processamento",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
  REFUNDED: "Reembolsado",
}

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as OrderStatus, label })
)

// Built exclusively from this project's semantic design tokens (muted, secondary,
// primary, destructive, gold accent scale) — no raw/arbitrary Tailwind hues.
export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  PENDING: "bg-muted text-muted-foreground",
  PAID: "bg-gold-500/15 text-gold-700 dark:text-gold-400",
  PROCESSING: "bg-secondary text-secondary-foreground",
  SHIPPED: "bg-primary/10 text-primary dark:bg-primary/20",
  DELIVERED: "bg-gold-500 text-gold-foreground",
  CANCELED: "bg-destructive/10 text-destructive",
  REFUNDED: "bg-border text-foreground",
}
