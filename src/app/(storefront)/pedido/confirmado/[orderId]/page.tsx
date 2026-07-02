import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Clock } from "lucide-react"
import { getOrderById } from "@/services/order-service"
import { formatCurrency, formatDate } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Pedido confirmado",
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const order = await getOrderById(orderId)
  if (!order) notFound()

  const isPendingPayment = order.status === "PENDING" && !order.mercadoPagoPaymentId

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        {isPendingPayment ? (
          <Clock className="mx-auto size-12 text-gold-500" />
        ) : (
          <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
        )}
        <h1 className="mt-4 font-heading text-3xl">
          {isPendingPayment ? "Pedido recebido!" : "Pagamento confirmado!"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isPendingPayment
            ? "Nossa equipe entrará em contato para confirmar o pagamento e os detalhes da sua compra."
            : "Seu pedido foi confirmado e já está sendo preparado com todo carinho."}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Número do pedido: <span className="font-medium text-foreground">{order.orderNumber}</span>
        </p>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-lg">Itens do pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span>
                {item.productNameSnapshot} × {item.quantity}
              </span>
              <span>{formatCurrency(item.totalCents)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(order.subtotalCents)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Frete</span>
            <span>{formatCurrency(order.shippingCents)}</span>
          </div>
          {order.discountCents > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Desconto</span>
              <span>-{formatCurrency(order.discountCents)}</span>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between font-heading text-lg">
            <span>Total</span>
            <span>{formatCurrency(order.totalCents)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Endereço de entrega</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="text-foreground">{order.recipientName}</p>
          <p>
            {order.street}, {order.number}
            {order.complement ? ` — ${order.complement}` : ""}
          </p>
          <p>
            {order.neighborhood} — {order.city}/{order.state}
          </p>
          <p>CEP {order.zipCode}</p>
          <p>{order.phone}</p>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Pedido realizado em {formatDate(order.createdAt)}
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-gold-500 hover:text-gold-foreground">
          <Link href="/">Voltar para a loja</Link>
        </Button>
      </div>
    </div>
  )
}
