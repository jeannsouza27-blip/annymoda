"use client"

import Link from "next/link"
import type { listOrdersForAdmin } from "@/services/order-service"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_LABELS } from "@/components/admin/order-status"
import { formatCurrency, formatDate } from "@/lib/format"

type OrderRow = Awaited<ReturnType<typeof listOrdersForAdmin>>[number]

const PAYMENT_LABELS: Record<string, string> = {
  CREDIT_CARD: "Cartão de crédito",
  PIX: "PIX",
}

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const columns: AdminDataTableColumn<OrderRow>[] = [
    {
      key: "orderNumber",
      header: "Pedido",
      sortValue: (order) => order.orderNumber,
      cell: (order) => (
        <Link
          href={`/admin/pedidos/${order.id}`}
          className="font-medium text-foreground hover:text-gold-600"
        >
          {order.orderNumber}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "Cliente",
      cell: (order) => (
        <div>
          <p className="text-foreground">{order.user?.name ?? order.recipientName}</p>
          <p className="text-xs text-muted-foreground">
            {order.user?.email ?? "Convidado"}
          </p>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      sortValue: (order) => order.totalCents,
      cell: (order) => <span className="font-medium">{formatCurrency(order.totalCents)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (order) => (
        <Badge className={ORDER_STATUS_BADGE_CLASSES[order.status]} variant="outline">
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      ),
    },
    {
      key: "payment",
      header: "Pagamento",
      cell: (order) => (
        <span className="text-muted-foreground">
          {order.paymentMethod ? PAYMENT_LABELS[order.paymentMethod] : "—"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Data",
      sortValue: (order) => order.createdAt.getTime(),
      cell: (order) => <span className="text-muted-foreground">{formatDate(order.createdAt)}</span>,
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      data={orders}
      rowKey={(order) => order.id}
      emptyMessage="Nenhum pedido registrado ainda."
    />
  )
}
