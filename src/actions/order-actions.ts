"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-guards"
import { updateOrderStatus, updateOrderTracking } from "@/services/order-service"

const statusSchema = z.enum([
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
  "REFUNDED",
])

export async function updateOrderStatusAction(id: string, status: string) {
  await requireAdmin()
  const parsed = statusSchema.safeParse(status)
  if (!parsed.success) return { success: false as const, error: "Status inválido." }

  await updateOrderStatus(id, parsed.data)
  revalidatePath("/admin/pedidos")
  revalidatePath(`/admin/pedidos/${id}`)
  return { success: true as const }
}

export async function updateOrderTrackingAction(id: string, trackingCode: string) {
  await requireAdmin()
  if (!trackingCode.trim()) return { success: false as const, error: "Informe o código de rastreio." }

  await updateOrderTracking(id, trackingCode.trim())
  revalidatePath("/admin/pedidos")
  revalidatePath(`/admin/pedidos/${id}`)
  return { success: true as const }
}
