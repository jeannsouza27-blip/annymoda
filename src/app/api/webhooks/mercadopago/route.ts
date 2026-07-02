import { NextRequest, NextResponse } from "next/server"
import { fetchPayment, mapMercadoPagoStatus, isMercadoPagoConfigured } from "@/lib/mercadopago"
import { updateOrderPayment } from "@/services/order-service"

export async function POST(req: NextRequest) {
  if (!isMercadoPagoConfigured()) {
    return NextResponse.json({ ok: true })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const paymentId =
      body?.data?.id ?? new URL(req.url).searchParams.get("data.id") ?? body?.id

    if (!paymentId) {
      return NextResponse.json({ ok: true })
    }

    const payment = await fetchPayment(String(paymentId))
    const orderId = payment.external_reference
    if (!orderId) return NextResponse.json({ ok: true })

    await updateOrderPayment(orderId, {
      mercadoPagoPaymentId: String(payment.id),
      mercadoPagoStatus: payment.status,
      status: mapMercadoPagoStatus(payment.status),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Erro no webhook Mercado Pago:", error)
    return NextResponse.json({ ok: true })
  }
}
