"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-guards"
import { createCoupon, deleteCoupon, updateCoupon } from "@/services/coupon-service"

const couponSchema = z.object({
  code: z.string().min(3, "Informe um código de cupom."),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().int().positive("Informe um valor válido."),
  minOrderCents: z.number().int().min(0).optional(),
  maxUses: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
})

export async function createCouponAction(input: unknown) {
  await requireAdmin()
  const parsed = couponSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const coupon = await createCoupon(parsed.data)
  revalidatePath("/admin/cupons")
  return { success: true as const, coupon }
}

export async function updateCouponAction(id: string, input: unknown) {
  await requireAdmin()
  const parsed = couponSchema.partial().safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const coupon = await updateCoupon(id, parsed.data)
  revalidatePath("/admin/cupons")
  return { success: true as const, coupon }
}

export async function deleteCouponAction(id: string) {
  await requireAdmin()
  await deleteCoupon(id)
  revalidatePath("/admin/cupons")
  return { success: true as const }
}
