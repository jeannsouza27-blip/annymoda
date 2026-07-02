"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/auth-guards"
import { updateProfile } from "@/services/user-service"

const profileSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  phone: z.string().optional(),
})

export async function updateProfileAction(input: unknown) {
  const user = await requireUser()

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  await updateProfile(user.id, parsed.data)
  revalidatePath("/minha-conta/dados")
  revalidatePath("/minha-conta")

  return { success: true as const }
}
