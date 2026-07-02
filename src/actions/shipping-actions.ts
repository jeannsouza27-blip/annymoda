"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-guards"
import {
  createShippingRule,
  deleteShippingRule,
  updateShippingRule,
} from "@/services/shipping-service"

const shippingRuleSchema = z.object({
  name: z.string().min(2),
  state: z.string().optional(),
  zipPrefix: z.string().optional(),
  priceCents: z.number().int().min(0),
  estimatedDaysMin: z.number().int().min(1),
  estimatedDaysMax: z.number().int().min(1),
  isActive: z.boolean().optional(),
})

export async function createShippingRuleAction(input: unknown) {
  await requireAdmin()
  const parsed = shippingRuleSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const rule = await createShippingRule(parsed.data)
  revalidatePath("/admin/frete")
  return { success: true as const, rule }
}

export async function updateShippingRuleAction(id: string, input: unknown) {
  await requireAdmin()
  const parsed = shippingRuleSchema.partial().safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const rule = await updateShippingRule(id, parsed.data)
  revalidatePath("/admin/frete")
  return { success: true as const, rule }
}

export async function deleteShippingRuleAction(id: string) {
  await requireAdmin()
  await deleteShippingRule(id)
  revalidatePath("/admin/frete")
  return { success: true as const }
}
