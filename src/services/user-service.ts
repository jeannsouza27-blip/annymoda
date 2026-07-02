import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}

export async function createCustomer(data: { name: string; email: string; password: string }) {
  const passwordHash = await bcrypt.hash(data.password, 10)
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: "CUSTOMER",
    },
  })
}

export async function verifyPassword(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user?.passwordHash) return null
  const valid = await bcrypt.compare(password, user.passwordHash)
  return valid ? user : null
}

export async function updatePassword(userId: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, 10)
  return prisma.user.update({ where: { id: userId }, data: { passwordHash } })
}

export function updateProfile(userId: string, data: { name?: string; phone?: string }) {
  return prisma.user.update({ where: { id: userId }, data })
}

export function listCustomers() {
  return prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  })
}

export function getCustomerById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { orders: { orderBy: { createdAt: "desc" } }, addresses: true },
  })
}

export function countCustomers() {
  return prisma.user.count({ where: { role: "CUSTOMER" } })
}
