import { prisma } from "@/lib/prisma"
import type { CouponType } from "@prisma/client"

export function listCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } })
}

export function getCouponByCode(code: string) {
  return prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
}

export async function validateCoupon(code: string, subtotalCents: number) {
  const coupon = await getCouponByCode(code)
  if (!coupon || !coupon.isActive) return { valid: false as const, error: "Cupom inválido." }

  const now = new Date()
  if (coupon.startsAt && coupon.startsAt > now)
    return { valid: false as const, error: "Cupom ainda não está ativo." }
  if (coupon.expiresAt && coupon.expiresAt < now)
    return { valid: false as const, error: "Cupom expirado." }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
    return { valid: false as const, error: "Cupom esgotado." }
  if (coupon.minOrderCents && subtotalCents < coupon.minOrderCents)
    return { valid: false as const, error: "Valor mínimo não atingido para este cupom." }

  const discountCents =
    coupon.type === "PERCENTAGE"
      ? Math.round((subtotalCents * coupon.value) / 100)
      : coupon.value

  return { valid: true as const, coupon, discountCents: Math.min(discountCents, subtotalCents) }
}

export function incrementCouponUse(id: string) {
  return prisma.coupon.update({ where: { id }, data: { usedCount: { increment: 1 } } })
}

export function createCoupon(data: {
  code: string
  type: CouponType
  value: number
  minOrderCents?: number
  maxUses?: number
  startsAt?: Date | null
  expiresAt?: Date | null
  isActive?: boolean
}) {
  return prisma.coupon.create({ data: { ...data, code: data.code.toUpperCase() } })
}

export function updateCoupon(id: string, data: Partial<Parameters<typeof createCoupon>[0]>) {
  return prisma.coupon.update({
    where: { id },
    data: { ...data, code: data.code?.toUpperCase() },
  })
}

export function deleteCoupon(id: string) {
  return prisma.coupon.delete({ where: { id } })
}
