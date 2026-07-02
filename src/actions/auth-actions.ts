"use server"

import { z } from "zod"
import crypto from "node:crypto"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"
import { signIn } from "@/lib/auth"
import { createCustomer, getUserByEmail, updatePassword } from "@/services/user-service"
import { sendEmail, passwordResetEmailHtml } from "@/lib/email"
import { siteConfig } from "@/lib/constants"

const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
})

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha."),
})

export async function loginAction(input: unknown, callbackUrl?: string) {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl || "/",
    })
    return { success: true as const }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false as const, error: "E-mail ou senha inválidos." }
    }
    throw error
  }
}

export async function registerCustomer(input: unknown) {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const existing = await getUserByEmail(parsed.data.email)
  if (existing) {
    return { success: false as const, error: "Este e-mail já está cadastrado." }
  }

  await createCustomer(parsed.data)
  return { success: true as const }
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

export async function requestPasswordReset(email: string) {
  const user = await getUserByEmail(email)

  if (user) {
    const token = crypto.randomBytes(32).toString("hex")
    const tokenHash = hashToken(token)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    })

    const resetUrl = `${siteConfig.url}/redefinir-senha/${token}`
    await sendEmail({
      to: user.email,
      subject: "Redefinir sua senha — Anny Moda Executiva",
      html: passwordResetEmailHtml(resetUrl),
    })
  }

  return {
    success: true as const,
    message: "Se este e-mail estiver cadastrado, você receberá um link de redefinição em instantes.",
  }
}

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
})

export async function resetPassword(input: unknown) {
  const parsed = resetPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos." }
  }

  const tokenHash = hashToken(parsed.data.token)
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } })

  if (!record || record.expiresAt < new Date()) {
    return { success: false as const, error: "Link inválido ou expirado. Solicite um novo." }
  }

  await updatePassword(record.userId, parsed.data.password)
  await prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } })

  return { success: true as const }
}
