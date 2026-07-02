import { notFound } from "next/navigation"
import Link from "next/link"
import { getCustomerById } from "@/services/user-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/admin-data-table"
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_LABELS } from "@/components/admin/order-status"
import { formatCurrency, formatDate } from "@/lib/format"

type CustomerDetail = NonNullable<Awaited<ReturnType<typeof getCustomerById>>>
type OrderRow = CustomerDetail["orders"][number]

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = await getCustomerById(id)

  if (!customer) notFound()

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
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">{customer.name}</h1>
        <p className="text-sm text-muted-foreground">Cliente desde {formatDate(customer.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-sm">
            <p>
              <span className="text-muted-foreground">E-mail: </span>
              {customer.email}
            </p>
            <p>
              <span className="text-muted-foreground">Telefone: </span>
              {customer.phone ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Pedidos: </span>
              {customer.orders.length}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Endereços</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado.</p>
            ) : (
              <ul className="space-y-4">
                {customer.addresses.map((address) => (
                  <li key={address.id} className="text-sm">
                    <p className="font-medium text-foreground">
                      {address.label}
                      {address.isDefault && (
                        <Badge variant="secondary" className="ml-2">
                          Padrão
                        </Badge>
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      {address.street}, {address.number}
                      {address.complement ? ` - ${address.complement}` : ""}
                    </p>
                    <p className="text-muted-foreground">
                      {address.neighborhood} — {address.city}/{address.state}
                    </p>
                    <p className="text-muted-foreground">CEP {address.zipCode}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            columns={columns}
            data={customer.orders}
            rowKey={(order) => order.id}
            emptyMessage="Este cliente ainda não fez pedidos."
          />
        </CardContent>
      </Card>
    </div>
  )
}
