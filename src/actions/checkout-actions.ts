"use server"

import { z } from "zod"
import { getOptionalUser } from "@/lib/auth-guards"
import { getProductById } from "@/services/product-service"
import { validateCoupon, incrementCouponUse } from "@/services/coupon-service"
import { quoteShipping } from "@/services/shipping-service"
import { createOrder, setOrderPreference } from "@/services/order-service"
import { decrementStock } from "@/services/product-service"
import { createPaymentPreference, isMercadoPagoConfigured } from "@/lib/mercadopago"

const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().min(1) }))
    .min(1, "Sua sacola está vazia."),
  couponCode: z.string().optional(),
  recipientName: z.string().min(2, "Informe o nome completo."),
  phone: z.string().min(8, "Informe um telefone válido."),
  zipCode: z.string().min(8, "Informe um CEP válido."),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(2),
  city: z.string().min(2),
  state: z.string().length(2, "Use a sigla do estado (ex: SP)."),
  paymentMethod: z.enum(["CREDIT_CARD", "PIX"]).optional(),
})

export async function createOrderAndCheckout(input: unknown) {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const data = parsed.data
  const user = await getOptionalUser()

  const resolvedItems = []
  let subtotalCents = 0

  for (const item of data.items) {
    const product = await getProductById(item.productId)
    if (!product || !product.isActive) {
      return { success: false as const, error: `Produto indisponível na sacola.` }
    }
    if (product.stock < item.quantity) {
      return { success: false as const, error: `Estoque insuficiente para "${product.name}".` }
    }

    const totalCents = product.priceCents * item.quantity
    subtotalCents += totalCents
    resolvedItems.push({
      productId: product.id,
      productNameSnapshot: product.name,
      unitPriceCentsSnapshot: product.priceCents,
      quantity: item.quantity,
      totalCents,
      imageUrl: product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url,
      name: product.name,
      unitPriceReais: product.priceCents / 100,
    })
  }

  let discountCents = 0
  let couponId: string | undefined

  if (data.couponCode) {
    const couponResult = await validateCoupon(data.couponCode, subtotalCents)
    if (!couponResult.valid) {
      return { success: false as const, error: couponResult.error }
    }
    discountCents = couponResult.discountCents
    couponId = couponResult.coupon.id
  }

  const shippingRule = await quoteShipping(data.state)
  const shippingCents = shippingRule?.priceCents ?? 3500

  const totalCents = Math.max(subtotalCents + shippingCents - discountCents, 0)

  const order = await createOrder({
    userId: user?.id,
    paymentMethod: data.paymentMethod,
    subtotalCents,
    shippingCents,
    discountCents,
    totalCents,
    couponId,
    recipientName: data.recipientName,
    phone: data.phone,
    zipCode: data.zipCode,
    street: data.street,
    number: data.number,
    complement: data.complement,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
    items: resolvedItems.map(({ productId, productNameSnapshot, unitPriceCentsSnapshot, quantity, totalCents }) => ({
      productId,
      productNameSnapshot,
      unitPriceCentsSnapshot,
      quantity,
      totalCents,
    })),
  })

  if (couponId) await incrementCouponUse(couponId)
  for (const item of data.items) {
    await decrementStock(item.productId, item.quantity)
  }

  if (!isMercadoPagoConfigured()) {
    return {
      success: true as const,
      orderId: order.id,
      redirectUrl: `/pedido/confirmado/${order.id}`,
      paymentPending: true,
    }
  }

  try {
    const preference = await createPaymentPreference({
      orderId: order.id,
      items: resolvedItems.map((i) => ({
        id: i.productId,
        title: i.name,
        quantity: i.quantity,
        unitPriceReais: i.unitPriceReais,
      })),
      shippingReais: shippingCents / 100,
      payerName: data.recipientName,
    })

    if (preference.id) await setOrderPreference(order.id, preference.id)

    const redirectUrl = preference.init_point || preference.sandbox_init_point
    return {
      success: true as const,
      orderId: order.id,
      redirectUrl: redirectUrl ?? `/pedido/confirmado/${order.id}`,
      paymentPending: false,
    }
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error)
    return {
      success: true as const,
      orderId: order.id,
      redirectUrl: `/pedido/confirmado/${order.id}`,
      paymentPending: true,
    }
  }
}
