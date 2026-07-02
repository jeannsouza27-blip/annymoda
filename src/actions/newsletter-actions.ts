"use server"

import { z } from "zod"
import { subscribeEmail } from "@/services/newsletter-service"

const emailSchema = z.string().email()

export async function subscribeNewsletter(email: string) {
  const parsed = emailSchema.safeParse(email)
  if (!parsed.success) {
    return { success: false as const, error: "Informe um e-mail válido." }
  }

  await subscribeEmail(parsed.data, "footer")
  return { success: true as const }
}
