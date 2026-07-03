import { listOrdersForAdmin } from "@/services/order-service"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function AdminOrdersPage() {
  const orders = await listOrdersForAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Pedidos</h1>
        <p className="text-sm text-muted-foreground">{orders.length} pedidos registrados</p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}
