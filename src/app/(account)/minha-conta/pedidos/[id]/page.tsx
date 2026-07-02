import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Truck } from "lucide-react"
import { requireUser } from "@/lib/auth-guards"
import { getOrderById } from "@/services/order-service"
import { formatCurrency, formatDate } from "@/lib/format"
import { OrderStatusBadge } from "@/components/account/order-status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const paymentMethodLabels: Record<string, string> = {
  CREDIT_CARD: "Cartão de crédito",
  PIX: "Pix",
}

export default async function PedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUser()
  const { id } = await params
  const order = await getOrderById(id)

  if (!order || order.userId !== user.id) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/minha-conta/pedidos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Meus pedidos
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl text-foreground">Pedido {order.orderNumber}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Realizado em {formatDate(order.createdAt)}</p>
      </div>

      {order.trackingCode && (
        <Card className="border-gold-500/30 bg-gold-500/5">
          <CardContent className="flex items-center gap-3">
            <Truck className="size-5 shrink-0 text-gold-600 dark:text-gold-400" />
            <div>
              <p className="text-sm font-medium text-foreground">Código de rastreio</p>
              <p className="text-sm text-muted-foreground">{order.trackingCode}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Itens do pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">{item.productNameSnapshot}</p>
                  <p className="text-muted-foreground">
                    {item.quantity} × {formatCurrency(item.unitPriceCentsSnapshot)}
                  </p>
                </div>
                <p className="font-medium text-foreground">{formatCurrency(item.totalCents)}</p>
              </div>
            ))}

            <Separator />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span>{order.shippingCents > 0 ? formatCurrency(order.shippingCents) : "Grátis"}</span>
              </div>
              {order.discountCents > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Desconto</span>
                  <span>- {formatCurrency(order.discountCents)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 font-heading text-base text-foreground">
                <span>Total</span>
                <span>{formatCurrency(order.totalCents)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Endereço de entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{order.recipientName}</p>
              <p>
                {order.street}, {order.number}
                {order.complement ? ` — ${order.complement}` : ""}
              </p>
              <p>{order.neighborhood}</p>
              <p>
                {order.city} — {order.state}
              </p>
              <p>CEP {order.zipCode}</p>
              <p>{order.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                {order.paymentMethod
                  ? paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod
                  : "Não informado"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
