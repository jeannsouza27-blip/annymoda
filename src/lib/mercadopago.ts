import "server-only"
import { MercadoPagoConfig, Preference, Payment } from "mercadopago"
import { siteConfig } from "@/lib/constants"

function getClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) return null
  return new MercadoPagoConfig({ accessToken })
}

type PreferenceItem = {
  id: string
  title: string
  quantity: number
  unitPriceReais: number
}

export async function createPaymentPreference(params: {
  orderId: string
  items: PreferenceItem[]
  shippingReais: number
  payerName?: string
  payerEmail?: string
}) {
  const client = getClient()
  if (!client) {
    throw new Error(
      "Pagamentos temporariamente indisponíveis. Configure MERCADOPAGO_ACCESS_TOKEN para habilitar o checkout."
    )
  }

  const preference = new Preference(client)

  const items = params.items.map((item) => ({
    id: item.id,
    title: item.title,
    quantity: item.quantity,
    unit_price: item.unitPriceReais,
    currency_id: "BRL",
  }))

  if (params.shippingReais > 0) {
    items.push({
      id: "frete",
      title: "Frete",
      quantity: 1,
      unit_price: params.shippingReais,
      currency_id: "BRL",
    })
  }

  const result = await preference.create({
    body: {
      items,
      payer: params.payerName || params.payerEmail
        ? { name: params.payerName, email: params.payerEmail }
        : undefined,
      external_reference: params.orderId,
      back_urls: {
        success: `${siteConfig.url}/pedido/confirmado/${params.orderId}`,
        pending: `${siteConfig.url}/pedido/confirmado/${params.orderId}`,
        failure: `${siteConfig.url}/checkout?erro=pagamento`,
      },
      auto_return: "approved",
      notification_url: `${siteConfig.url}/api/webhooks/mercadopago`,
    },
  })

  return result
}

export async function fetchPayment(paymentId: string) {
  const client = getClient()
  if (!client) throw new Error("Mercado Pago não configurado.")

  const payment = new Payment(client)
  return payment.get({ id: paymentId })
}

export function isMercadoPagoConfigured() {
  return !!process.env.MERCADOPAGO_ACCESS_TOKEN
}

export function mapMercadoPagoStatus(mpStatus: string | undefined) {
  switch (mpStatus) {
    case "approved":
      return "PAID" as const
    case "pending":
    case "in_process":
      return "PENDING" as const
    case "rejected":
      return "CANCELED" as const
    case "refunded":
    case "charged_back":
      return "REFUNDED" as const
    default:
      return "PENDING" as const
  }
}
