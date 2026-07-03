import { prisma } from "@/lib/prisma"
import type { OrderStatus, PaymentMethod } from "@prisma/client"

const orderWithItems = {
  include: { items: true, user: { select: { name: true, email: true } } },
} as const

export function listOrdersForAdmin() {
  return prisma.order.findMany({ orderBy: { createdAt: "desc" }, ...orderWithItems })
}

export function listOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    ...orderWithItems,
  })
}

export function getOrderById(id: string) {
  return prisma.order.findUnique({ where: { id }, ...orderWithItems })
}

export function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({ where: { orderNumber }, ...orderWithItems })
}

export async function generateOrderNumber() {
  const count = await prisma.order.count()
  return `AM-${(100000 + count + 1).toString()}`
}

export type CreateOrderInput = {
  userId?: string
  paymentMethod?: PaymentMethod
  subtotalCents: number
  shippingCents: number
  discountCents: number
  totalCents: number
  couponId?: string
  recipientName: string
  phone: string
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  items: {
    productId: string
    variantId?: string
    variantColorSnapshot?: string
    variantSizeSnapshot?: string
    productNameSnapshot: string
    unitPriceCentsSnapshot: number
    quantity: number
    totalCents: number
  }[]
}

export async function createOrder(data: CreateOrderInput) {
  const orderNumber = await generateOrderNumber()
  const { items, ...rest } = data
  return prisma.order.create({
    data: {
      ...rest,
      orderNumber,
      items: { create: items },
    },
    ...orderWithItems,
  })
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({ where: { id }, data: { status } })
}

export function updateOrderTracking(id: string, trackingCode: string) {
  return prisma.order.update({ where: { id }, data: { trackingCode } })
}

export function updateOrderPayment(
  id: string,
  data: { mercadoPagoPaymentId?: string; mercadoPagoStatus?: string; status?: OrderStatus }
) {
  return prisma.order.update({ where: { id }, data })
}

export function setOrderPreference(id: string, mercadoPagoPreferenceId: string) {
  return prisma.order.update({ where: { id }, data: { mercadoPagoPreferenceId } })
}
