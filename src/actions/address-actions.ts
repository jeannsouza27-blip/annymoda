"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth-guards"
import { createAddress, deleteAddress, updateAddress } from "@/services/address-service"

const addressSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().min(2),
  phone: z.string().min(8),
  zipCode: z.string().min(8),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(2),
  city: z.string().min(2),
  state: z.string().length(2),
  isDefault: z.boolean().optional(),
})

export async function createAddressAction(input: unknown) {
  const user = await requireUser()
  const parsed = addressSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  await createAddress(user.id, parsed.data)
  revalidatePath("/enderecos")
  return { success: true as const }
}

export async function updateAddressAction(id: string, input: unknown) {
  const user = await requireUser()
  const parsed = addressSchema.partial().safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  await updateAddress(id, user.id, parsed.data)
  revalidatePath("/enderecos")
  return { success: true as const }
}

export async function deleteAddressAction(id: string) {
  await requireUser()
  await deleteAddress(id)
  revalidatePath("/enderecos")
  return { success: true as const }
}
