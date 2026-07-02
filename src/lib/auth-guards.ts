import "server-only"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export async function requireUser() {
  const session = await auth()
  if (!session?.user) redirect("/entrar")
  return session.user
}

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect("/entrar")
  if (session.user.role !== "ADMIN") redirect("/")
  return session.user
}

export async function getOptionalUser() {
  const session = await auth()
  return session?.user ?? null
}
