import { notFound } from "next/navigation"
import Link from "next/link"
import { getOrderById } from "@/services/order-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import { OrderTrackingForm } from "@/components/admin/order-tracking-form"
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_LABELS } from "@/components/admin/order-status"
import { formatCurrency, formatDate } from "@/lib/format"

const PAYMENT_LABELS: Record<string, string> = {
  CREDIT_CARD: "Cartão de crédito",
  PIX: "PIX",
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) notFound()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Pedido {order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">Realizado em {formatDate(order.createdAt)}</p>
        </div>
        <Badge className={ORDER_STATUS_BADGE_CLASSES[order.status]} variant="outline">
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Itens do pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <Link
                        href={`/admin/produtos/${item.productId}`}
                        className="font-medium text-foreground hover:text-gold-600"
                      >
                        {item.productNameSnapshot}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity}x {formatCurrency(item.unitPriceCentsSnapshot)}
                      </p>
                    </div>
                    <span className="font-medium">{formatCurrency(item.totalCents)}</span>
                  </li>
                ))}
              </ul>

              <Separator className="my-4" />

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotalCents)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span>{formatCurrency(order.shippingCents)}</span>
                </div>
                {order.discountCents > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto</span>
                    <span>-{formatCurrency(order.discountCents)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 text-base font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalCents)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço de entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium text-foreground">{order.recipientName}</p>
              <p className="text-muted-foreground">{order.phone}</p>
              <p className="text-muted-foreground">
                {order.street}, {order.number}
                {order.complement ? ` - ${order.complement}` : ""}
              </p>
              <p className="text-muted-foreground">
                {order.neighborhood} — {order.city}/{order.state}
              </p>
              <p className="text-muted-foreground">CEP {order.zipCode}</p>
            </CardContent>
          </Card>

          {(order.mercadoPagoPreferenceId || order.mercadoPagoPaymentId || order.mercadoPagoStatus) && (
            <Card>
              <CardHeader>
                <CardTitle>Mercado Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                {order.mercadoPagoPreferenceId && <p>Preferência: {order.mercadoPagoPreferenceId}</p>}
                {order.mercadoPagoPaymentId && <p>Pagamento: {order.mercadoPagoPaymentId}</p>}
                {order.mercadoPagoStatus && <p>Status: {order.mercadoPagoStatus}</p>}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium text-foreground">{order.user?.name ?? order.recipientName}</p>
              <p className="text-muted-foreground">{order.user?.email ?? "Pedido de convidado"}</p>
              <p className="text-muted-foreground">
                {order.paymentMethod ? PAYMENT_LABELS[order.paymentMethod] : "Pagamento não definido"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status do pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <OrderStatusSelect orderId={order.id} status={order.status} />
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Rastreio</p>
                <OrderTrackingForm orderId={order.id} trackingCode={order.trackingCode} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
