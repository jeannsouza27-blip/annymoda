"use client"

import Link from "next/link"
import type { getCustomerById } from "@/services/user-service"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_LABELS } from "@/components/admin/order-status"
import { formatCurrency, formatDate } from "@/lib/format"

type CustomerDetail = NonNullable<Awaited<ReturnType<typeof getCustomerById>>>
type OrderRow = CustomerDetail["orders"][number]

export function CustomerOrdersTable({ orders }: { orders: OrderRow[] }) {
  const columns: AdminDataTableColumn<OrderRow>[] = [
    {
      key: "orderNumber",
      header: "Pedido",
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
      key: "status",
      header: "Status",
      cell: (order) => (
        <Badge className={ORDER_STATUS_BADGE_CLASSES[order.status]} variant="outline">
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      ),
    },
    {
      key: "total",
      header: "Total",
      cell: (order) => formatCurrency(order.totalCents),
    },
    {
      key: "date",
      header: "Data",
      cell: (order) => <span className="text-muted-foreground">{formatDate(order.createdAt)}</span>,
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      data={orders}
      rowKey={(order) => order.id}
      emptyMessage="Este cliente ainda não fez pedidos."
    />
  )
}
